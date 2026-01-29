import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { getStoryNode } from '../../data/stories/prologue';
import type { StoryNode, StoryChoice } from '../../types';

interface StoryEntry {
  id: string;
  content: string;
  isChoice?: boolean;
  choiceText?: string;
}

export const StoryPanel: React.FC = () => {
  const player = usePlayerStore((state) => state.player);
  const modifyAttribute = usePlayerStore((state) => state.modifyAttribute);

  const storyProgress = useGameStore((state) => state.storyProgress);
  const setCurrentNode = useGameStore((state) => state.setCurrentNode);
  const setStoryFlag = useGameStore((state) => state.setStoryFlag);
  const completeChapter = useGameStore((state) => state.completeChapter);

  // 历史记录
  const [storyHistory, setStoryHistory] = useState<StoryEntry[]>([]);
  // 当前节点
  const [currentNode, setCurrentNodeState] = useState<StoryNode | null>(null);
  // 当前正在打字的文字
  const [displayedText, setDisplayedText] = useState('');
  // 是否正在打字
  const [isTyping, setIsTyping] = useState(false);
  // 是否已完成全部剧情
  const [isCompleted, setIsCompleted] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const lastNodeIdRef = useRef<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, []);

  // 打字效果
  const typeText = useCallback((text: string, onComplete?: () => void) => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    setIsTyping(true);
    setDisplayedText('');
    let index = 0;

    intervalRef.current = window.setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        scrollToBottom();
      } else {
        setIsTyping(false);
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        onComplete?.();
      }
    }, 25);
  }, [scrollToBottom]);

  // 跳过打字
  const skipTyping = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (currentNode) {
      setDisplayedText(currentNode.content);
    }
    setIsTyping(false);
  }, [currentNode]);

  // 加载节点
  useEffect(() => {
    if (player && storyProgress.currentNodeId !== lastNodeIdRef.current) {
      lastNodeIdRef.current = storyProgress.currentNodeId;
      const node = getStoryNode(player.origin, storyProgress.currentNodeId);
      setCurrentNodeState(node);
      if (node) {
        typeText(node.content);
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [player, storyProgress.currentNodeId, typeText]);

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

  // 处理继续
  const handleContinue = () => {
    if (isTyping) {
      skipTyping();
      return;
    }

    if (!currentNode) return;

    // 将当前内容添加到历史
    setStoryHistory(prev => [...prev, {
      id: currentNode.id,
      content: currentNode.content,
    }]);

    // 应用效果
    applyEffects(currentNode.effects);

    if (currentNode.nextNodeId) {
      // 继续下一节点
      setCurrentNode(player!.origin, currentNode.nextNodeId);
    } else {
      // 完成章节
      completeChapter(storyProgress.currentChapterId);
      setIsCompleted(true);
      setDisplayedText('');
      setCurrentNodeState(null);
    }
  };

  // 处理选择
  const handleChoice = (choice: StoryChoice) => {
    if (!currentNode) return;

    // 将当前内容和选择添加到历史
    setStoryHistory(prev => [...prev, {
      id: currentNode.id,
      content: currentNode.content,
      isChoice: true,
      choiceText: choice.text,
    }]);

    // 应用效果
    applyEffects(choice.effects);

    // 前往下一节点
    setCurrentNode(player!.origin, choice.nextNodeId);
  };

  // 加载中
  if (!currentNode && !isCompleted && storyHistory.length === 0) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ color: 'var(--text-muted)' }}
      >
        <div className="text-center">
          <motion.div
            className="w-8 h-8 rounded-full mx-auto mb-4"
            style={{ border: '2px solid var(--gold-immortal)', borderTopColor: 'transparent' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p>剧情加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full flex flex-col rounded-lg overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, var(--ink-dark) 0%, var(--ink-deep) 100%)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* 剧情内容区 */}
      <div
        ref={contentRef}
        className="flex-1 p-6 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* 装饰性背景 */}
        <div
          className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.05) 0%, transparent 70%)',
          }}
        />

        <div
          className="relative z-10"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: '16px',
            lineHeight: '2',
            color: 'var(--text-primary)',
          }}
        >
          {/* 历史内容 */}
          {storyHistory.map((entry, index) => (
            <div key={entry.id + '-' + index} style={{ marginBottom: '1.5em' }}>
              <p style={{ textIndent: '2em', margin: 0 }}>
                {entry.content}
              </p>
              {entry.isChoice && entry.choiceText && (
                <p
                  style={{
                    textIndent: '2em',
                    margin: '0.5em 0 0 0',
                    color: 'var(--gold-immortal)',
                    fontStyle: 'italic',
                  }}
                >
                  你选择了：{entry.choiceText}
                </p>
              )}
            </div>
          ))}

          {/* 当前正在显示的内容 */}
          {currentNode && (
            <p style={{ textIndent: '2em', margin: 0 }}>
              {displayedText}
              {isTyping && (
                <span
                  style={{
                    color: 'var(--gold-immortal)',
                    marginLeft: '2px',
                  }}
                  className="animate-pulse"
                >
                  |
                </span>
              )}
            </p>
          )}

          {/* 完成提示 */}
          {isCompleted && (
            <div
              style={{
                marginTop: '2em',
                padding: '1em',
                textAlign: 'center',
                borderTop: '1px solid var(--border-subtle)',
                color: 'var(--gold-immortal)',
              }}
            >
              <p style={{ margin: 0, fontFamily: "'Ma Shan Zheng', serif", fontSize: '1.2em' }}>
                本章完
              </p>
              <p style={{ margin: '0.5em 0 0 0', fontSize: '0.9em', color: 'var(--text-muted)' }}>
                返回修炼界面继续你的修仙之旅
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 操作区 */}
      {!isCompleted && currentNode && (
        <div
          className="p-4"
          style={{
            background: 'var(--ink-deep)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {currentNode.type === 'choice' && currentNode.choices && !isTyping ? (
            <div className="space-y-2">
              {currentNode.choices.map((choice, index) => (
                <button
                  key={index}
                  className="w-full p-3 text-left rounded-lg transition-all"
                  style={{
                    background: 'var(--ink-medium)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                  onClick={() => handleChoice(choice)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold-immortal)';
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(201, 162, 39, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ color: 'var(--gold-immortal)' }} className="mr-2">
                    {index + 1}.
                  </span>
                  {choice.text}
                </button>
              ))}
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
