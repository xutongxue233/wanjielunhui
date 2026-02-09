import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Spinner } from '../ui';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { useCombatStore } from '../../stores/combatStore';
import { getStoryNode, STORY_CHAPTERS, hasChapterData } from '../../data/stories';
import type { StoryNode, StoryChoice } from '../../types';
import type { ChapterReward } from '../../data/stories';
import type { Combatant } from '../../data/combat';
import { generateRandomEncounter } from '../../data/combat/enemies';
import { getSkillsByElement } from '../../data/combat/skills';

// 检查战斗是否激活
const isBattleActive = (battle: unknown): boolean => {
  return battle !== null && battle !== undefined;
};

// 章节选择视图
const ChapterSelectView: React.FC<{
  unlockedChapters: string[];
  completedChapters: string[];
  currentChapterId: string;
  onSelectChapter: (chapterId: string) => void;
}> = ({ unlockedChapters, completedChapters, currentChapterId, onSelectChapter }) => {
  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-xl font-bold text-primary mb-4">章节选择</h2>
      <div className="flex-1 overflow-y-auto space-y-3">
        {STORY_CHAPTERS.map((chapter) => {
          const isUnlocked = unlockedChapters.includes(chapter.id);
          const isCompleted = completedChapters.includes(chapter.id);
          const isCurrent = chapter.id === currentChapterId;
          const hasData = hasChapterData(chapter.id);

          return (
            <div
              key={chapter.id}
              className={`p-4 rounded-lg border transition-all ${
                isUnlocked && hasData
                  ? 'border-primary/30 bg-surface hover:bg-surface-hover cursor-pointer'
                  : 'border-border/30 bg-surface/50 opacity-60'
              } ${isCurrent ? 'ring-2 ring-primary' : ''}`}
              onClick={() => isUnlocked && hasData && onSelectChapter(chapter.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold ${isUnlocked ? 'text-foreground' : 'text-muted'}`}>
                  {chapter.name}
                </h3>
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                      已完成
                    </span>
                  )}
                  {isCurrent && !isCompleted && (
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                      进行中
                    </span>
                  )}
                  {!isUnlocked && (
                    <span className="text-xs px-2 py-0.5 rounded bg-muted/20 text-muted">
                      未解锁
                    </span>
                  )}
                  {isUnlocked && !hasData && (
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                      敬请期待
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted">{chapter.description}</p>
              {!isUnlocked && chapter.unlockConditions.length > 0 && (
                <div className="mt-2 text-xs text-muted">
                  解锁条件：
                  {chapter.unlockConditions.map((cond, idx) => (
                    <span key={idx} className="ml-1">
                      {cond.type === 'flag' && `完成前置章节`}
                      {cond.type === 'realm' && `境界等级 >= ${cond.value}`}
                      {idx < chapter.unlockConditions.length - 1 && '，'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 章节完成视图
const ChapterCompleteView: React.FC<{
  chapterName: string;
  rewards: ChapterReward[];
  onContinue: () => void;
  hasNextChapter: boolean;
}> = ({ chapterName, rewards, onContinue, hasNextChapter }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="story-complete-glow mb-6">
        <div className="text-4xl mb-2">&#x2728;</div>
      </div>
      <h2 className="text-2xl font-bold text-primary mb-2">{chapterName}</h2>
      <p className="text-xl text-foreground mb-6">本章完</p>

      {rewards.length > 0 && (
        <div className="w-full max-w-sm mb-6">
          <p className="text-sm text-muted mb-3">获得奖励：</p>
          <div className="bg-surface/50 rounded-lg p-4 space-y-2">
            {rewards.map((reward, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-muted">
                  {reward.type === 'item' && '物品'}
                  {reward.type === 'cultivation' && '修为'}
                  {reward.type === 'attribute' && '属性'}
                  {reward.type === 'technique' && '功法'}
                  {reward.type === 'skill' && '技能'}
                </span>
                <span className="text-foreground">
                  {reward.target} x{reward.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 w-full max-w-xs">
        {hasNextChapter && (
          <Button variant="primary" className="w-full" onClick={onContinue}>
            继续下一章
          </Button>
        )}
        <Button variant="secondary" className="w-full" onClick={() => window.location.reload()}>
          返回修炼
        </Button>
      </div>
    </div>
  );
};

export const StoryPanel: React.FC = () => {
  const player = usePlayerStore((state) => state.player);
  const modifyAttribute = usePlayerStore((state) => state.modifyAttribute);

  const storyProgress = useGameStore((state) => state.storyProgress);
  const setCurrentNode = useGameStore((state) => state.setCurrentNode);
  const setStoryFlag = useGameStore((state) => state.setStoryFlag);
  const completeChapter = useGameStore((state) => state.completeChapter);
  const startChapter = useGameStore((state) => state.startChapter);
  const getUnlockedChapters = useGameStore((state) => state.getUnlockedChapters);

  const storyHistory = useGameStore((state) => state.storyHistory);
  const addStoryEntry = useGameStore((state) => state.addStoryEntry);
  const storyDisplayState = useGameStore((state) => state.storyDisplayState);
  const setStoryDisplayState = useGameStore((state) => state.setStoryDisplayState);

  // 战斗相关
  const battle = useCombatStore((state) => state.battle);
  const startBattle = useCombatStore((state) => state.startBattle);
  const isCombatActive = isBattleActive(battle);

  // 视图状态
  const [viewMode, setViewMode] = useState<'story' | 'chapters' | 'complete'>('story');
  const [completedChapterName, setCompletedChapterName] = useState('');
  const [completedChapterRewards, setCompletedChapterRewards] = useState<ChapterReward[]>([]);

  // 当前节点
  const [currentNode, setCurrentNodeState] = useState<StoryNode | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [textToType, setTextToType] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  // 获取境界等级
  const realmLevel = player?.realm.level || 1;
  const unlockedChapters = getUnlockedChapters(realmLevel);
  const completedChapters = storyProgress.completedChapters;

  // 打字效果
  useEffect(() => {
    if (textToType === null) return;

    let index = 0;
    const text = textToType;
    setDisplayedText('');
    setIsTyping(true);

    const intervalId = window.setInterval(() => {
      if (index < text.length) {
        index++;
        setDisplayedText(text.slice(0, index));
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      } else {
        setIsTyping(false);
        window.clearInterval(intervalId);
      }
    }, 25);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [textToType]);

  // 跳过打字
  const skipTyping = useCallback(() => {
    if (textToType) {
      setDisplayedText(textToType);
      setIsTyping(false);
    }
  }, [textToType]);

  // 初始化和加载节点
  useEffect(() => {
    if (!player) return;

    const { currentChapterId, currentNodeId } = storyProgress;
    const node = getStoryNode(currentChapterId, currentNodeId, player.origin);
    setCurrentNodeState(node);

    // 恢复之前的显示状态
    if (storyDisplayState.displayedText) {
      setDisplayedText(storyDisplayState.displayedText);
      setIsTyping(false);
      setTextToType(null);
    } else if (node) {
      setTextToType(node.content);
    }
  }, [player, storyProgress.currentChapterId, storyProgress.currentNodeId]);

  // 保存显示状态
  useEffect(() => {
    if (displayedText && !isTyping) {
      setStoryDisplayState({
        displayedText,
        isCompleted: storyDisplayState.isCompleted,
      });
    }
  }, [displayedText, isTyping, setStoryDisplayState, storyDisplayState.isCompleted]);

  // 应用效果
  const applyEffects = (effects?: StoryNode['effects']) => {
    if (!effects) return;

    effects.forEach((effect) => {
      switch (effect.type) {
        case 'modify_attribute':
          modifyAttribute(effect.target as any, effect.value as number);
          break;
        case 'set_flag':
          setStoryFlag(effect.target, effect.value);
          break;
      }
    });
  };

  // 处理章节完成
  const handleChapterComplete = () => {
    const chapter = STORY_CHAPTERS.find((ch) => ch.id === storyProgress.currentChapterId);
    if (chapter) {
      setCompletedChapterName(chapter.name);
      setCompletedChapterRewards(chapter.rewards);
      completeChapter(storyProgress.currentChapterId);
      setStoryDisplayState({ displayedText: '', isCompleted: true });
      setDisplayedText('');
      setCurrentNodeState(null);
      setViewMode('complete');
    }
  };

  // 处理继续
  const handleContinue = () => {
    if (isTyping) {
      skipTyping();
      return;
    }

    if (!currentNode || !player) return;

    // 将当前内容添加到历史
    addStoryEntry({
      id: currentNode.id,
      content: currentNode.speaker ? `[${currentNode.speaker}] ${currentNode.content}` : currentNode.content,
    });

    // 应用效果
    applyEffects(currentNode.effects);

    if (currentNode.nextNodeId) {
      // 继续下一节点
      setCurrentNode(storyProgress.currentChapterId, currentNode.nextNodeId);
    } else {
      // 完成章节
      handleChapterComplete();
    }
  };

  // 处理选择
  const handleChoice = (choice: StoryChoice) => {
    if (!currentNode || !player) return;

    // 将当前内容和选择添加到历史
    addStoryEntry({
      id: currentNode.id,
      content: currentNode.content,
      isChoice: true,
      choiceText: choice.text,
    });

    // 应用效果
    applyEffects(choice.effects);

    // 前往下一节点
    setCurrentNode(storyProgress.currentChapterId, choice.nextNodeId);
  };

  // 选择章节
  const handleSelectChapter = (chapterId: string) => {
    startChapter(chapterId);
    setViewMode('story');
  };

  // 继续下一章
  const handleNextChapter = () => {
    const currentIdx = STORY_CHAPTERS.findIndex((ch) => ch.id === storyProgress.currentChapterId);
    const nextChapter = STORY_CHAPTERS[currentIdx + 1];
    if (nextChapter && unlockedChapters.includes(nextChapter.id) && hasChapterData(nextChapter.id)) {
      startChapter(nextChapter.id);
      setViewMode('story');
    } else {
      setViewMode('chapters');
    }
  };

  // 判断是否有下一章
  const hasNextChapter = () => {
    const currentIdx = STORY_CHAPTERS.findIndex((ch) => ch.id === storyProgress.currentChapterId);
    const nextChapter = STORY_CHAPTERS[currentIdx + 1];
    return nextChapter && unlockedChapters.includes(nextChapter.id) && hasChapterData(nextChapter.id);
  };

  // 如果正在战斗，显示战斗提示
  if (isCombatActive) {
    return (
      <div className="h-full flex items-center justify-center text-muted">
        <div className="text-center">
          <p className="text-lg">战斗进行中...</p>
          <p className="text-sm mt-2">请在战斗面板完成战斗</p>
        </div>
      </div>
    );
  }

  // 章节选择视图
  if (viewMode === 'chapters') {
    return (
      <ChapterSelectView
        unlockedChapters={unlockedChapters}
        completedChapters={completedChapters}
        currentChapterId={storyProgress.currentChapterId}
        onSelectChapter={handleSelectChapter}
      />
    );
  }

  // 章节完成视图
  if (viewMode === 'complete') {
    return (
      <ChapterCompleteView
        chapterName={completedChapterName}
        rewards={completedChapterRewards}
        onContinue={handleNextChapter}
        hasNextChapter={hasNextChapter()}
      />
    );
  }

  // 加载中
  if (!currentNode && !storyDisplayState.isCompleted && storyHistory.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4">剧情加载中...</p>
        </div>
      </div>
    );
  }

  // 当前章节信息
  const currentChapter = STORY_CHAPTERS.find((ch) => ch.id === storyProgress.currentChapterId);

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden story-panel">
      {/* 章节标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface/50 border-b border-border/30">
        <span className="text-sm font-medium text-primary">
          {currentChapter?.name || '剧情'}
        </span>
        <button
          className="text-xs text-muted hover:text-foreground transition-colors"
          onClick={() => setViewMode('chapters')}
        >
          章节列表
        </button>
      </div>

      {/* 剧情内容区 */}
      <div
        ref={contentRef}
        className="flex-1 p-6 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none story-glow" />

        <div className="relative z-10 story-content">
          {/* 历史内容 */}
          {storyHistory.map((entry, index) => (
            <div key={entry.id + '-' + index} className="story-entry">
              <p className="story-paragraph">{entry.content}</p>
              {entry.isChoice && entry.choiceText && (
                <p className="story-choice-text">你选择了：{entry.choiceText}</p>
              )}
            </div>
          ))}

          {/* 当前正在显示的内容 */}
          {currentNode && (
            <div className="story-current">
              {currentNode.speaker && (
                <p className="story-speaker text-primary font-medium mb-1">
                  [{currentNode.speaker}]
                </p>
              )}
              <p className="story-paragraph">
                {displayedText}
                {isTyping && <span className="story-typing-cursor animate-pulse">|</span>}
              </p>
            </div>
          )}

          {/* 章节完成提示 */}
          {storyDisplayState.isCompleted && (
            <div className="story-complete">
              <p className="story-complete-title">本章完</p>
              <p className="story-complete-hint">返回修炼界面继续你的修仙之旅</p>
            </div>
          )}
        </div>
      </div>

      {/* 操作区 */}
      {!storyDisplayState.isCompleted && currentNode && (
        <div className="p-4 story-actions">
          {currentNode.type === 'choice' && currentNode.choices && !isTyping ? (
            <div className="space-y-2">
              {currentNode.choices.map((choice, index) => (
                <button
                  key={index}
                  className="story-choice-btn"
                  onClick={() => handleChoice(choice)}
                >
                  <span className="story-choice-number">{index + 1}.</span>
                  {choice.text}
                </button>
              ))}
            </div>
          ) : currentNode.type === 'battle' ? (
            <div className="text-center">
              <p className="text-sm text-muted mb-3">战斗即将开始！</p>
              <Button
                className="w-full"
                variant="primary"
                onClick={() => {
                  if (!player) return;
                  // 先添加到历史
                  addStoryEntry({
                    id: currentNode.id,
                    content: currentNode.content,
                  });
                  applyEffects(currentNode.effects);

                  // 触发实际战斗
                  const playerLevel = player.realm.level;
                  const playerElement = player.spiritualRoot.elements[0] || 'neutral';
                  const playerSkills = getSkillsByElement(playerElement as any).map(skill => ({
                    ...skill,
                    currentCooldown: 0,
                  }));
                  const playerCombatant: Combatant = {
                    id: player.id,
                    name: player.name,
                    isPlayer: true,
                    isAlly: true,
                    hp: player.attributes.hp,
                    maxHp: player.attributes.maxHp,
                    mp: player.attributes.mp,
                    maxMp: player.attributes.maxMp,
                    attack: player.attributes.attack,
                    defense: player.attributes.defense,
                    speed: player.attributes.speed,
                    critRate: player.attributes.critRate,
                    critDamage: player.attributes.critDamage,
                    element: playerElement,
                    skills: playerSkills,
                    buffs: [],
                    debuffs: [],
                    isAlive: true,
                    actionGauge: 0,
                  };
                  const enemies = generateRandomEncounter(playerLevel, 1);
                  const totalExp = enemies.reduce((sum, _e) => sum + 30, 0);
                  const totalStones = enemies.reduce((sum, _e) => sum + 10, 0);
                  startBattle([playerCombatant], enemies, {
                    exp: totalExp,
                    spiritStones: totalStones,
                    items: [],
                  });

                  // 战斗结束后进入下一节点
                  if (currentNode.nextNodeId) {
                    setCurrentNode(storyProgress.currentChapterId, currentNode.nextNodeId);
                  }
                }}
              >
                开始战斗
              </Button>
            </div>
          ) : (
            <Button className="w-full" variant="primary" onClick={handleContinue}>
              {isTyping ? '跳过' : '继续'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
