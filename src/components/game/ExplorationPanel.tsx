import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, ProgressBar } from '../ui';
import { useRoguelikeStore } from '../../stores/roguelikeStore';
import { usePlayerStore } from '../../stores/playerStore';
import { SECRET_REALMS, TEMPORARY_TALENTS, Room } from '../../data/roguelike';

const ROOM_TYPE_ICONS: Record<string, string> = {
  combat: '剑',
  elite: '将',
  boss: '王',
  treasure: '宝',
  rest: '息',
  shop: '商',
  event: '?',
};

const ROOM_TYPE_COLORS: Record<string, string> = {
  combat: 'border-red-500 bg-red-500/20',
  elite: 'border-orange-500 bg-orange-500/20',
  boss: 'border-purple-500 bg-purple-500/20',
  treasure: 'border-amber-500 bg-amber-500/20',
  rest: 'border-green-500 bg-green-500/20',
  shop: 'border-blue-500 bg-blue-500/20',
  event: 'border-gray-500 bg-gray-500/20',
};

const RARITY_COLORS = {
  common: 'text-gray-400 border-gray-500',
  rare: 'text-blue-400 border-blue-500',
  epic: 'text-purple-400 border-purple-500',
  legendary: 'text-amber-400 border-amber-500',
};

// 房间节点组件
const RoomNode: React.FC<{
  room: Room;
  isAccessible: boolean;
  onClick: () => void;
}> = ({ room, isAccessible, onClick }) => {
  return (
    <motion.div
      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
        room.isCurrent
          ? 'border-amber-400 bg-amber-500/30 ring-2 ring-amber-400'
          : room.isCleared
          ? 'border-gray-600 bg-gray-700/30 opacity-50'
          : isAccessible
          ? ROOM_TYPE_COLORS[room.type]
          : 'border-gray-700 bg-gray-800/30 opacity-30'
      }`}
      onClick={isAccessible && !room.isCurrent ? onClick : undefined}
      whileHover={isAccessible ? { scale: 1.1 } : undefined}
      whileTap={isAccessible ? { scale: 0.95 } : undefined}
    >
      <span className={`text-lg font-bold ${room.isCleared ? 'text-gray-500' : 'text-white'}`}>
        {ROOM_TYPE_ICONS[room.type]}
      </span>
    </motion.div>
  );
};

export const ExplorationPanel: React.FC = () => {
  const player = usePlayerStore((state) => state.player);

  const currentRun = useRoguelikeStore((state) => state.currentRun);
  const destinyPoints = useRoguelikeStore((state) => state.destinyPoints);
  const reincarnationCount = useRoguelikeStore((state) => state.reincarnationCount);
  const permanentTalents = useRoguelikeStore((state) => state.permanentTalents);
  const dailyEntries = useRoguelikeStore((state) => state.dailyEntries);

  const enterRealm = useRoguelikeStore((state) => state.enterRealm);
  const exitRealm = useRoguelikeStore((state) => state.exitRealm);
  const moveToRoom = useRoguelikeStore((state) => state.moveToRoom);
  const clearCurrentRoom = useRoguelikeStore((state) => state.clearCurrentRoom);
  const getCurrentRoom = useRoguelikeStore((state) => state.getCurrentRoom);
  const getAvailableRooms = useRoguelikeStore((state) => state.getAvailableRooms);
  const upgradePermanentTalent = useRoguelikeStore((state) => state.upgradePermanentTalent);

  const [activeTab, setActiveTab] = useState<'realms' | 'run' | 'talents'>('realms');
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);

  // 如果正在进行秘境，切换到运行标签
  React.useEffect(() => {
    if (currentRun) {
      setActiveTab('run');
    }
  }, [currentRun]);

  const handleEnterRealm = () => {
    if (!selectedRealm || !player) return;
    enterRealm(selectedRealm, player.attributes.hp, player.attributes.mp);
  };

  const handleClearRoom = () => {
    clearCurrentRoom();
  };

  const handleExitRealm = () => {
    const result = exitRealm(false);
    setActiveTab('realms');
  };

  const currentRoom = getCurrentRoom();
  const availableRooms = getAvailableRooms();

  return (
    <div className="space-y-4">
      {/* 顶部状态栏 */}
      <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
        <div className="flex gap-6">
          <div>
            <span className="text-gray-500 text-sm">天命点</span>
            <span className="text-amber-400 font-bold ml-2">{destinyPoints}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">轮回次数</span>
            <span className="text-purple-400 font-bold ml-2">{reincarnationCount}</span>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex gap-2">
        {[
          { id: 'realms', name: '秘境列表' },
          { id: 'run', name: '当前探索', disabled: !currentRun },
          { id: 'talents', name: '永久天赋' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500'
                : tab.disabled
                ? 'bg-gray-800/30 text-gray-600 border border-gray-700 cursor-not-allowed'
                : 'bg-gray-700/30 text-gray-400 border border-gray-600 hover:border-gray-500'
            }`}
            onClick={() => !tab.disabled && setActiveTab(tab.id as typeof activeTab)}
            disabled={tab.disabled}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* 秘境列表 */}
      {activeTab === 'realms' && !currentRun && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(SECRET_REALMS).map((realm) => {
            const entries = dailyEntries[realm.id] || 0;
            const canEnter = entries < realm.dailyLimit &&
                            (player?.realm.level || 0) >= realm.requiredLevel;

            return (
              <Card
                key={realm.id}
                className={`cursor-pointer transition-all ${
                  selectedRealm === realm.id
                    ? 'border-amber-500'
                    : canEnter
                    ? 'hover:border-gray-500'
                    : 'opacity-50'
                }`}
                onClick={() => canEnter && setSelectedRealm(realm.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white">{realm.name}</h3>
                  <div className="flex gap-1">
                    {Array.from({ length: realm.difficulty }).map((_, i) => (
                      <span key={i} className="text-amber-400">*</span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-3">{realm.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>层数: {realm.floors}</div>
                  <div>等级: {realm.requiredLevel}+</div>
                  <div>次数: {entries}/{realm.dailyLimit}</div>
                  <div>消耗: {realm.entryCost.amount}灵石</div>
                </div>

                {selectedRealm === realm.id && (
                  <Button
                    className="w-full mt-3"
                    onClick={handleEnterRealm}
                    disabled={!canEnter}
                  >
                    进入秘境
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* 当前探索 */}
      {activeTab === 'run' && currentRun && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 地图 */}
          <Card title={`${SECRET_REALMS[currentRun.realmId]?.name} - 第${currentRun.currentFloor}层`} className="lg:col-span-2">
            <div className="space-y-4">
              {/* 按层显示房间 */}
              {Array.from({ length: SECRET_REALMS[currentRun.realmId]?.floors || 0 }).map((_, floorIndex) => {
                const floor = floorIndex + 1;
                const floorRooms = currentRun.rooms.filter(r => r.floor === floor);

                return (
                  <div key={floor} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-8">F{floor}</span>
                    <div className="flex gap-2">
                      {floorRooms.map((room) => (
                        <RoomNode
                          key={room.id}
                          room={room}
                          isAccessible={
                            room.isCurrent ||
                            availableRooms.some(r => r.id === room.id)
                          }
                          onClick={() => moveToRoom(room.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 当前房间信息 */}
          <Card title="当前房间">
            {currentRoom && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className={`inline-block w-16 h-16 rounded-lg border-2 ${ROOM_TYPE_COLORS[currentRoom.type]} flex items-center justify-center`}>
                    <span className="text-2xl">{ROOM_TYPE_ICONS[currentRoom.type]}</span>
                  </div>
                  <div className="mt-2 text-white font-medium">
                    {currentRoom.type === 'combat' && '战斗房间'}
                    {currentRoom.type === 'elite' && '精英房间'}
                    {currentRoom.type === 'boss' && 'Boss房间'}
                    {currentRoom.type === 'treasure' && '宝箱房间'}
                    {currentRoom.type === 'rest' && '休息点'}
                    {currentRoom.type === 'shop' && '商店'}
                    {currentRoom.type === 'event' && '事件房间'}
                  </div>
                </div>

                {!currentRoom.isCleared && (
                  <Button className="w-full" onClick={handleClearRoom}>
                    {currentRoom.type === 'combat' || currentRoom.type === 'elite' || currentRoom.type === 'boss'
                      ? '开始战斗'
                      : '探索房间'}
                  </Button>
                )}

                {currentRoom.isCleared && availableRooms.length > 0 && (
                  <div className="text-center text-gray-400 text-sm">
                    选择下一个房间继续探索
                  </div>
                )}

                <div className="pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-500 mb-2">探索进度</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>已清理: {currentRun.roomsCleared}</div>
                    <div>击杀: {currentRun.enemiesKilled}</div>
                    <div>秘境币: {currentRun.realmCoins}</div>
                    <div>天赋: {currentRun.acquiredTalents.length}</div>
                  </div>
                </div>

                <Button variant="danger" className="w-full" onClick={handleExitRealm}>
                  退出秘境
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* 永久天赋 */}
      {activeTab === 'talents' && (
        <Card title="永久天赋树">
          <p className="text-gray-400 text-sm mb-4">
            使用天命点解锁永久天赋，这些加成在轮回后依然保留。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(permanentTalents).map((talent) => {
              const cost = talent.cost * (talent.currentLevel + 1);
              const canUpgrade = talent.currentLevel < talent.maxLevel &&
                                destinyPoints >= cost &&
                                talent.requires.every(req => permanentTalents[req]?.currentLevel > 0);

              return (
                <div
                  key={talent.id}
                  className={`p-3 rounded-lg border ${
                    talent.currentLevel > 0
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : canUpgrade
                      ? 'bg-gray-700/30 border-gray-600'
                      : 'bg-gray-800/30 border-gray-700 opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-white">{talent.name}</span>
                    <span className="text-xs text-amber-400">
                      {talent.currentLevel}/{talent.maxLevel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{talent.description}</p>

                  {talent.currentLevel < talent.maxLevel && (
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={!canUpgrade}
                      onClick={() => upgradePermanentTalent(talent.id)}
                    >
                      升级 ({cost}点)
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
