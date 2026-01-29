import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 内存存储 (生产环境应使用数据库)
const users: Map<string, UserData> = new Map();
const rankings: Map<string, RankingEntry[]> = new Map();
const friends: Map<string, string[]> = new Map();
const serverEvents: ServerEvent[] = [];

interface UserData {
  id: string;
  username: string;
  password: string;
  playerData: any;
  createdAt: number;
  lastLoginAt: number;
}

interface RankingEntry {
  odId: string;
  username: string;
  value: number;
  updatedAt: number;
}

interface ServerEvent {
  id: string;
  type: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  participants: string[];
  rewards: any[];
}

// 初始化排行榜
['power', 'realm', 'wealth', 'alchemy', 'reincarnation'].forEach(type => {
  rankings.set(type, []);
});

// ==================== 认证路由 ====================

app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  const existingUser = Array.from(users.values()).find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: '用户名已存在' });
  }

  const user: UserData = {
    id: uuidv4(),
    username,
    password, // 生产环境应加密
    playerData: null,
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
  };

  users.set(user.id, user);

  res.json({
    id: user.id,
    username: user.username,
    token: user.id, // 简化token
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const user = Array.from(users.values()).find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  user.lastLoginAt = Date.now();

  res.json({
    id: user.id,
    username: user.username,
    token: user.id,
    playerData: user.playerData,
  });
});

// ==================== 玩家数据路由 ====================

app.post('/api/player/sync', (req, res) => {
  const { userId, playerData } = req.body;

  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  user.playerData = playerData;

  // 更新排行榜
  if (playerData) {
    updateRanking('power', userId, user.username, playerData.attributes?.attack || 0);
    updateRanking('realm', userId, user.username, playerData.realm?.level || 0);
  }

  res.json({ success: true });
});

app.get('/api/player/:userId', (req, res) => {
  const user = users.get(req.params.userId);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  res.json({
    id: user.id,
    username: user.username,
    playerData: user.playerData,
  });
});

// ==================== 排行榜路由 ====================

function updateRanking(type: string, odId: string, username: string, value: number) {
  const ranking = rankings.get(type);
  if (!ranking) return;

  const existingIndex = ranking.findIndex(r => r.odId === odId);
  if (existingIndex >= 0) {
    ranking[existingIndex].value = value;
    ranking[existingIndex].updatedAt = Date.now();
  } else {
    ranking.push({ odId, username, value, updatedAt: Date.now() });
  }

  ranking.sort((a, b) => b.value - a.value);
  if (ranking.length > 100) {
    ranking.length = 100;
  }
}

app.get('/api/ranking/:type', (req, res) => {
  const { type } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  const ranking = rankings.get(type);
  if (!ranking) {
    return res.status(404).json({ error: '排行榜类型不存在' });
  }

  const start = Number(offset);
  const end = start + Number(limit);

  res.json({
    type,
    total: ranking.length,
    entries: ranking.slice(start, end).map((entry, index) => ({
      rank: start + index + 1,
      ...entry,
    })),
  });
});

app.get('/api/ranking/:type/my', (req, res) => {
  const { type } = req.params;
  const { userId } = req.query;

  const ranking = rankings.get(type);
  if (!ranking) {
    return res.status(404).json({ error: '排行榜类型不存在' });
  }

  const index = ranking.findIndex(r => r.odId === userId);
  if (index === -1) {
    return res.json({ rank: null, entry: null });
  }

  res.json({
    rank: index + 1,
    entry: ranking[index],
  });
});

// ==================== 好友路由 ====================

app.get('/api/friends/:userId', (req, res) => {
  const friendList = friends.get(req.params.userId) || [];

  const friendData = friendList.map(friendId => {
    const user = users.get(friendId);
    return user ? {
      id: user.id,
      username: user.username,
      realm: user.playerData?.realm?.displayName,
      lastOnline: user.lastLoginAt,
    } : null;
  }).filter(Boolean);

  res.json({ friends: friendData });
});

app.post('/api/friends/add', (req, res) => {
  const { userId, friendId } = req.body;

  if (!users.has(friendId)) {
    return res.status(404).json({ error: '用户不存在' });
  }

  const userFriends = friends.get(userId) || [];
  if (!userFriends.includes(friendId)) {
    userFriends.push(friendId);
    friends.set(userId, userFriends);
  }

  res.json({ success: true });
});

app.post('/api/friends/remove', (req, res) => {
  const { userId, friendId } = req.body;

  const userFriends = friends.get(userId) || [];
  const index = userFriends.indexOf(friendId);
  if (index >= 0) {
    userFriends.splice(index, 1);
    friends.set(userId, userFriends);
  }

  res.json({ success: true });
});

// ==================== 服务器事件路由 ====================

app.get('/api/events', (req, res) => {
  const now = Date.now();
  const activeEvents = serverEvents.filter(e => e.startTime <= now && e.endTime > now);

  res.json({ events: activeEvents });
});

app.post('/api/events/:eventId/join', (req, res) => {
  const { userId } = req.body;
  const event = serverEvents.find(e => e.id === req.params.eventId);

  if (!event) {
    return res.status(404).json({ error: '活动不存在' });
  }

  if (!event.participants.includes(userId)) {
    event.participants.push(userId);
  }

  res.json({ success: true });
});

// 创建测试事件
function createTestEvent() {
  const now = Date.now();
  serverEvents.push({
    id: uuidv4(),
    type: 'treasure_hunt',
    name: '灵宝出世',
    description: '上古灵宝即将出世，各方势力蠢蠢欲动！',
    startTime: now,
    endTime: now + 24 * 60 * 60 * 1000,
    participants: [],
    rewards: [
      { type: 'spirit_stone', quantity: 1000 },
      { type: 'item', itemId: 'ancient_artifact', quantity: 1 },
    ],
  });
}

createTestEvent();

// ==================== 启动服务器 ====================

app.listen(PORT, () => {
  console.log(`万界轮回服务器运行在端口 ${PORT}`);
});

export default app;
