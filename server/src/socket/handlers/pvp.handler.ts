import type { Server as SocketServer, Socket } from 'socket.io';
import { prisma } from '../../lib/prisma.js';
import { getRedis } from '../../lib/redis.js';
import { logger } from '../../lib/logger.js';
import { pvpService } from '../../modules/pvp/pvp.service.js';

interface PvpAction {
  matchId: string;
  actionType: 'attack' | 'defend' | 'skill' | 'item';
  skillId?: string;
  itemId?: string;
}

interface BattleState {
  matchId: string;
  turn: number;
  playerHp: number;
  opponentHp: number;
  playerEnergy: number;
  opponentEnergy: number;
  actions: Array<{
    turn: number;
    playerId: string;
    action: string;
    damage?: number;
  }>;
}

const TURN_TIME_LIMIT = 30000;
const MAX_HP = 1000;
const MAX_ENERGY = 100;

export function pvpHandler(io: SocketServer, socket: Socket) {
  const redis = getRedis();
  const { playerId, playerName } = socket.user;

  socket.on('pvp:join_queue', async (callback?: (res: { success: boolean; status?: string; matchId?: string; error?: string }) => void) => {
    try {
      const result = await pvpService.joinMatchQueue(playerId);

      if (result.status === 'matched' && result.matchId) {
        const match = await prisma.pvpMatch.findUnique({
          where: { id: result.matchId },
          include: { player: true, opponent: true },
        });

        if (match) {
          socket.join(`pvp:${result.matchId}`);

          const opponentSocketId = await redis.get(`player:online:${match.opponentId}`);
          if (opponentSocketId) {
            io.to(opponentSocketId).socketsJoin(`pvp:${result.matchId}`);
          }

          const battleState: BattleState = {
            matchId: result.matchId,
            turn: 1,
            playerHp: MAX_HP,
            opponentHp: MAX_HP,
            playerEnergy: MAX_ENERGY,
            opponentEnergy: MAX_ENERGY,
            actions: [],
          };

          await redis.set(`pvp:battle:${result.matchId}`, JSON.stringify(battleState), 'EX', 3600);

          io.to(`pvp:${result.matchId}`).emit('pvp:matched', {
            matchId: result.matchId,
            player: {
              id: match.playerId,
              name: match.player.name,
              realm: match.player.realm,
              combatPower: Number(match.player.combatPower),
            },
            opponent: {
              id: match.opponentId,
              name: match.opponent.name,
              realm: match.opponent.realm,
              combatPower: Number(match.opponent.combatPower),
            },
            turnTimeLimit: TURN_TIME_LIMIT,
          });
        }
      }

      callback?.({ success: true, status: result.status, matchId: result.matchId });
    } catch (error) {
      logger.error({ error, playerId }, 'Failed to join PVP queue');
      callback?.({ success: false, error: error instanceof Error ? error.message : '加入匹配失败' });
    }
  });

  socket.on('pvp:leave_queue', async (callback?: (res: { success: boolean; error?: string }) => void) => {
    try {
      await pvpService.leaveMatchQueue(playerId);
      callback?.({ success: true });
    } catch (error) {
      logger.error({ error, playerId }, 'Failed to leave PVP queue');
      callback?.({ success: false, error: '退出匹配失败' });
    }
  });

  socket.on('pvp:action', async (data: PvpAction, callback?: (res: { success: boolean; error?: string }) => void) => {
    try {
      const { matchId, actionType, skillId } = data;

      const battleStateStr = await redis.get(`pvp:battle:${matchId}`);
      if (!battleStateStr) {
        callback?.({ success: false, error: '战斗不存在或已结束' });
        return;
      }

      const battleState: BattleState = JSON.parse(battleStateStr);

      const match = await prisma.pvpMatch.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        callback?.({ success: false, error: '对战记录不存在' });
        return;
      }

      const isPlayer = match.playerId === playerId;
      let damage = 0;
      let energyCost = 0;

      switch (actionType) {
        case 'attack':
          damage = Math.floor(Math.random() * 50) + 30;
          energyCost = 10;
          break;
        case 'skill':
          damage = Math.floor(Math.random() * 80) + 50;
          energyCost = 25;
          break;
        case 'defend':
          damage = -20;
          energyCost = 5;
          break;
        default:
          damage = 0;
      }

      if (isPlayer) {
        if (battleState.playerEnergy < energyCost) {
          callback?.({ success: false, error: '能量不足' });
          return;
        }
        battleState.playerEnergy -= energyCost;
        battleState.opponentHp -= damage;
        if (actionType === 'defend') {
          battleState.playerHp = Math.min(MAX_HP, battleState.playerHp - damage);
        }
      } else {
        if (battleState.opponentEnergy < energyCost) {
          callback?.({ success: false, error: '能量不足' });
          return;
        }
        battleState.opponentEnergy -= energyCost;
        battleState.playerHp -= damage;
        if (actionType === 'defend') {
          battleState.opponentHp = Math.min(MAX_HP, battleState.opponentHp - damage);
        }
      }

      battleState.actions.push({
        turn: battleState.turn,
        playerId,
        action: actionType,
        damage: damage > 0 ? damage : undefined,
      });

      io.to(`pvp:${matchId}`).emit('pvp:turn', {
        turn: battleState.turn,
        action: {
          playerId,
          playerName,
          actionType,
          skillId,
          damage: damage > 0 ? damage : 0,
        },
        state: {
          playerHp: battleState.playerHp,
          opponentHp: battleState.opponentHp,
          playerEnergy: battleState.playerEnergy,
          opponentEnergy: battleState.opponentEnergy,
        },
      });

      if (battleState.playerHp <= 0 || battleState.opponentHp <= 0) {
        const winnerId = battleState.playerHp <= 0 ? match.opponentId : match.playerId;

        const result = await pvpService.settlePvpMatch(
          matchId,
          winnerId,
          { actions: battleState.actions },
          battleState.turn * 10
        );

        io.to(`pvp:${matchId}`).emit('pvp:end', {
          matchId,
          winnerId,
          result: result.result,
          playerRatingChange: result.playerRatingChange,
          opponentRatingChange: result.opponentRatingChange,
          finalState: {
            playerHp: battleState.playerHp,
            opponentHp: battleState.opponentHp,
          },
        });

        await redis.del(`pvp:battle:${matchId}`);
      } else {
        battleState.turn += 1;
        battleState.playerEnergy = Math.min(MAX_ENERGY, battleState.playerEnergy + 10);
        battleState.opponentEnergy = Math.min(MAX_ENERGY, battleState.opponentEnergy + 10);

        await redis.set(`pvp:battle:${matchId}`, JSON.stringify(battleState), 'EX', 3600);
      }

      callback?.({ success: true });
    } catch (error) {
      logger.error({ error, playerId }, 'PVP action failed');
      callback?.({ success: false, error: '操作失败' });
    }
  });

  socket.on('pvp:surrender', async (data: { matchId: string }, callback?: (res: { success: boolean; error?: string }) => void) => {
    try {
      const { matchId } = data;

      const match = await prisma.pvpMatch.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        callback?.({ success: false, error: '对战不存在' });
        return;
      }

      const winnerId = match.playerId === playerId ? match.opponentId : match.playerId;

      const result = await pvpService.settlePvpMatch(
        matchId,
        winnerId,
        { surrender: true, surrenderedBy: playerId },
        0
      );

      io.to(`pvp:${matchId}`).emit('pvp:end', {
        matchId,
        winnerId,
        result: match.playerId === playerId ? 'LOSE' : 'WIN',
        playerRatingChange: result.playerRatingChange,
        opponentRatingChange: result.opponentRatingChange,
        surrender: true,
        surrenderedBy: playerId,
      });

      await redis.del(`pvp:battle:${matchId}`);
      callback?.({ success: true });
    } catch (error) {
      logger.error({ error, playerId }, 'PVP surrender failed');
      callback?.({ success: false, error: '投降失败' });
    }
  });
}

export default pvpHandler;
