import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, ProgressBar, message } from '../ui';
import { useAlchemyStore } from '../../stores/alchemyStore';
import { usePlayerStore } from '../../stores/playerStore';
import { PILL_RECIPES, ALCHEMY_MATERIALS, calculateSuccessRate } from '../../data/alchemy';

const QUALITY_COLORS = {
  low: 'text-gray-400',
  medium: 'text-green-400',
  high: 'text-blue-400',
  perfect: 'text-purple-400',
  transcendent: 'text-amber-400',
};

const QUALITY_NAMES = {
  low: '下品',
  medium: '中品',
  high: '上品',
  perfect: '极品',
  transcendent: '仙品',
};

export const AlchemyPanel: React.FC = () => {
  const player = usePlayerStore((state) => state.player);

  const alchemyLevel = useAlchemyStore((state) => state.alchemyLevel);
  const alchemyExp = useAlchemyStore((state) => state.alchemyExp);
  const alchemyExpToNext = useAlchemyStore((state) => state.alchemyExpToNext);
  const currentFurnace = useAlchemyStore((state) => state.currentFurnace);
  const learnedRecipes = useAlchemyStore((state) => state.learnedRecipes);
  const refiningState = useAlchemyStore((state) => state.refiningState);
  const pillInventory = useAlchemyStore((state) => state.pillInventory);

  const startRefining = useAlchemyStore((state) => state.startRefining);
  const completeRefining = useAlchemyStore((state) => state.completeRefining);
  const cancelRefining = useAlchemyStore((state) => state.cancelRefining);
  const usePill = useAlchemyStore((state) => state.usePill);

  const healPlayer = usePlayerStore((state) => state.healPlayer);
  const restoreMp = usePlayerStore((state) => state.restoreMp);
  const addCultivation = usePlayerStore((state) => state.addCultivation);

  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [refiningProgress, setRefiningProgress] = useState(0);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  // 计算材料持有情况
  const materialStatus = useMemo(() => {
    if (!selectedRecipe || !player) return null;

    const recipe = PILL_RECIPES[selectedRecipe];
    if (!recipe) return null;

    const inventory = player.inventory || [];
    const materials = recipe.materials.map((mat) => {
      const owned = inventory.find((i) => i.item.id === mat.itemId);
      const ownedQty = owned ? owned.quantity : 0;
      const materialInfo = ALCHEMY_MATERIALS[mat.itemId];
      return {
        itemId: mat.itemId,
        name: materialInfo?.name || mat.itemId,
        required: mat.quantity,
        owned: ownedQty,
        sufficient: ownedQty >= mat.quantity,
      };
    });

    const allSufficient = materials.every((m) => m.sufficient);
    return { materials, allSufficient };
  }, [selectedRecipe, player]);

  // 更新炼制进度
  useEffect(() => {
    if (!refiningState.isRefining) {
      setRefiningProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const total = refiningState.endTime - refiningState.startTime;
      const elapsed = now - refiningState.startTime;
      const progress = Math.min(100, (elapsed / total) * 100);

      setRefiningProgress(progress);

      if (progress >= 100) {
        const result = completeRefining();
        if (result) {
          setResultMessage(`炼制成功! 获得 ${QUALITY_NAMES[result.quality]} ${result.name}`);
        } else {
          setResultMessage('炼制失败, 丹药炸炉了...');
        }
        setTimeout(() => setResultMessage(null), 3000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [refiningState, completeRefining]);

  const handleStartRefining = () => {
    if (!selectedRecipe || !player) return;

    const success = startRefining(
      selectedRecipe,
      player.attributes.comprehension,
      player.attributes.luck
    );

    if (!success) {
      setResultMessage('无法开始炼制，请检查条件');
      setTimeout(() => setResultMessage(null), 2000);
    }
  };

  const handleUsePill = (pillId: string) => {
    const pill = usePill(pillId);
    if (!pill) return;

    const effectTexts: string[] = [];
    for (const effect of pill.effects) {
      if (effect.type === 'heal_hp') {
        healPlayer(effect.value);
        effectTexts.push(`恢复${effect.value}气血`);
      } else if (effect.type === 'heal_mp') {
        restoreMp(effect.value);
        effectTexts.push(`恢复${effect.value}法力`);
      } else if (effect.type === 'add_cultivation') {
        addCultivation(effect.value);
        effectTexts.push(`增加${effect.value}修为`);
      } else if (effect.type === 'breakthrough_bonus') {
        effectTexts.push(`突破率+${(effect.value * 100).toFixed(0)}%`);
      }
    }

    message.success(`使用${QUALITY_NAMES[pill.quality]}${pill.name}: ${effectTexts.join(', ')}`);
  };

  const recipe = selectedRecipe ? PILL_RECIPES[selectedRecipe] : null;
  const successRate = recipe && player
    ? calculateSuccessRate(recipe, currentFurnace, alchemyLevel, player.attributes.comprehension)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 左侧：丹方列表 */}
      <Card title="丹方" className="lg:col-span-1">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {learnedRecipes.map((recipeId) => {
            const r = PILL_RECIPES[recipeId];
            if (!r) return null;

            const canMake = alchemyLevel >= r.requiredLevel &&
                           currentFurnace.grade >= r.requiredFurnaceGrade;

            return (
              <motion.div
                key={recipeId}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedRecipe === recipeId
                    ? 'bg-amber-500/20 border-amber-500'
                    : canMake
                    ? 'bg-gray-700/30 border-gray-600 hover:border-gray-500'
                    : 'bg-gray-800/30 border-gray-700 opacity-50'
                }`}
                onClick={() => canMake && setSelectedRecipe(recipeId)}
                whileHover={canMake ? { scale: 1.01 } : undefined}
              >
                <div className="flex justify-between">
                  <span className="font-medium text-white">{r.name}</span>
                  <span className="text-xs text-gray-500">Lv.{r.requiredLevel}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{r.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* 中间：炼丹炉 */}
      <Card title="炼丹" className="lg:col-span-1">
        <div className="text-center py-4">
          {/* 丹炉 */}
          <motion.div
            className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center ${
              refiningState.isRefining
                ? 'border-orange-500 bg-orange-500/20'
                : 'border-gray-600 bg-gray-700/30'
            }`}
            animate={refiningState.isRefining ? {
              boxShadow: ['0 0 20px rgba(249,115,22,0.3)', '0 0 40px rgba(249,115,22,0.5)', '0 0 20px rgba(249,115,22,0.3)'],
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-white">{currentFurnace.name}</div>
              <div className="text-xs text-gray-400">
                耐久: {currentFurnace.durability}/{currentFurnace.maxDurability}
              </div>
            </div>
          </motion.div>

          {/* 炼制进度 */}
          {refiningState.isRefining && (
            <div className="mt-4">
              <ProgressBar
                current={refiningProgress}
                max={100}
                type="custom"
                customColor="linear-gradient(90deg, #f97316, #fbbf24)"
                label="炼制中..."
                showText={false}
              />
              <p className="text-sm text-gray-400 mt-2">
                {refiningState.currentRecipeId && PILL_RECIPES[refiningState.currentRecipeId]?.name}
              </p>
            </div>
          )}

          {/* 结果消息 */}
          {resultMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-2 rounded-lg ${
                resultMessage.includes('成功')
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {resultMessage}
            </motion.div>
          )}

          {/* 选中的丹方信息 */}
          {recipe && !refiningState.isRefining && (
            <div className="mt-4 text-left bg-gray-700/30 rounded-lg p-3">
              <h4 className="font-medium text-amber-400">{recipe.name}</h4>
              <p className="text-sm text-gray-400 mt-1">{recipe.description}</p>

              {/* 材料需求列表 */}
              {materialStatus && (
                <div className="mt-3 border-t border-gray-600/50 pt-3">
                  <div className="text-sm text-gray-300 mb-2 font-medium">
                    所需材料
                  </div>
                  <div className="space-y-1.5">
                    {materialStatus.materials.map((mat) => (
                      <div
                        key={mat.itemId}
                        className={`flex justify-between items-center text-sm px-2 py-1 rounded ${
                          mat.sufficient
                            ? 'bg-gray-600/30'
                            : 'bg-red-900/30 border border-red-700/50'
                        }`}
                      >
                        <span
                          className={
                            mat.sufficient ? 'text-gray-300' : 'text-red-400'
                          }
                        >
                          {mat.name}
                        </span>
                        <span
                          className={`font-mono ${
                            mat.sufficient ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {mat.owned}/{mat.required}
                        </span>
                      </div>
                    ))}
                  </div>
                  {!materialStatus.allSufficient && (
                    <div className="mt-2 text-xs text-red-400 text-center">
                      材料不足，无法炼制
                    </div>
                  )}
                </div>
              )}

              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">成功率</span>
                  <span className="text-white">{(successRate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">耗时</span>
                  <span className="text-white">
                    {Math.floor(recipe.baseDuration * (1 - currentFurnace.speedBonus))}秒
                  </span>
                </div>
              </div>

              <Button
                className="w-full mt-3"
                onClick={handleStartRefining}
                disabled={!materialStatus?.allSufficient}
              >
                {materialStatus?.allSufficient ? '开始炼制' : '材料不足'}
              </Button>
            </div>
          )}

          {refiningState.isRefining && (
            <Button
              variant="danger"
              className="mt-4"
              onClick={cancelRefining}
            >
              取消炼制
            </Button>
          )}
        </div>

        {/* 炼丹等级 */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">炼丹等级</span>
            <span className="text-amber-400">Lv.{alchemyLevel}</span>
          </div>
          <ProgressBar
            current={alchemyExp}
            max={alchemyExpToNext}
            type="exp"
            height={8}
            showText={false}
          />
        </div>
      </Card>

      {/* 右侧：丹药库存 */}
      <Card title={`丹药库存 (${pillInventory.length})`} className="lg:col-span-1">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {pillInventory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">暂无丹药</p>
          ) : (
            pillInventory.map((pill) => (
              <div
                key={pill.id}
                className="p-3 bg-gray-700/30 rounded-lg border border-gray-600"
              >
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${QUALITY_COLORS[pill.quality]}`}>
                    {QUALITY_NAMES[pill.quality]} {pill.name}
                  </span>
                  <Button size="sm" onClick={() => handleUsePill(pill.id)}>
                    使用
                  </Button>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {pill.effects.map((e, i) => (
                    <span key={i}>
                      {e.type === 'heal_hp' && `恢复${e.value}气血`}
                      {e.type === 'heal_mp' && `恢复${e.value}法力`}
                      {e.type === 'add_cultivation' && `增加${e.value}修为`}
                      {e.type === 'breakthrough_bonus' && `突破率+${(e.value * 100).toFixed(0)}%`}
                      {i < pill.effects.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
