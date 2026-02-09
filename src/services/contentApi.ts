/**
 * 游戏内容API - 从后端获取游戏数据
 * 不需要认证token，使用独立的fetch封装
 */

const API_BASE = '/api/v1/content';

async function contentRequest<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  let url = `${API_BASE}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Content API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json.data;
}

export const contentApi = {
  // 敌人
  getEnemies: (params?: { minLevel?: number; maxLevel?: number }) =>
    contentRequest<unknown[]>('/enemies', params as Record<string, string | number | undefined>),
  getEnemy: (id: string) =>
    contentRequest<unknown>(`/enemies/${id}`),

  // 物品
  getItems: (params?: { type?: string }) =>
    contentRequest<unknown[]>('/items', params as Record<string, string | number | undefined>),
  getItem: (id: string) =>
    contentRequest<unknown>(`/items/${id}`),

  // 装备
  getEquipments: (params?: { slot?: string; minLevel?: number }) =>
    contentRequest<unknown[]>('/equipments', params as Record<string, string | number | undefined>),

  // 技能
  getSkills: (params?: { element?: string }) =>
    contentRequest<unknown[]>('/skills', params as Record<string, string | number | undefined>),

  // 副本
  getDungeons: (params?: { chapter?: number }) =>
    contentRequest<unknown[]>('/dungeons', params as Record<string, string | number | undefined>),

  // 剧情
  getStoryChapters: () =>
    contentRequest<unknown[]>('/stories'),
  getStoryChapter: (id: string) =>
    contentRequest<unknown>(`/stories/${id}`),

  // 炼丹
  getAlchemyRecipes: () =>
    contentRequest<unknown[]>('/alchemy/recipes'),
  getAlchemyCauldrons: () =>
    contentRequest<unknown[]>('/alchemy/cauldrons'),

  // 境界
  getRealms: () =>
    contentRequest<unknown[]>('/realms'),

  // 出身
  getOrigins: () =>
    contentRequest<unknown[]>('/origins'),
  getSpiritRoots: () =>
    contentRequest<unknown[]>('/spirit-roots'),

  // 秘境
  getRoguelikeDungeons: () =>
    contentRequest<unknown[]>('/roguelike/dungeons'),
  getRoguelikeTalents: () =>
    contentRequest<unknown[]>('/roguelike/talents'),
};
