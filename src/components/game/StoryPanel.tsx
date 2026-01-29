import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { getStoryNode } from '../../data/stories/prologue';
import type { StoryNode, StoryChoice } from '../../types';

export const StoryPanel: React.FC = () => {
  const player = usePlayerStore((state) => state.player);
  const modifyAttribute = usePlayerStore((state) => state.modifyAttribute);

  const storyProgress = useGameStore((state) => state.storyProgress);
  const setCurrentNode = useGameStore((state) => state.setCurrentNode);
  const setStoryFlag = useGameStore((state) => state.setStoryFlag);

  const [currentNode, setCurrentNodeState] = useState<StoryNode | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (player) {
      const node = getStoryNode(player.origin, storyProgress.currentNodeId);
      setCurrentNodeState(node);
      if (node) {
        typeText(node.content);
      }
    }
  }, [player, storyProgress.currentNodeId]);

  const typeText = (text: string) => {
    setIsTyping(true);
    setDisplayedText('');
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  };

  const handleContinue = () => {
    if (isTyping && currentNode) {
      setIsTyping(false);
      setDisplayedText(currentNode.content);
      return;
    }

    if (currentNode?.nextNodeId) {
      applyEffects(currentNode.effects);
      setCurrentNode(player!.origin, currentNode.nextNodeId);
    }
  };

  const handleChoice = (choice: StoryChoice) => {
    applyEffects(choice.effects);
    setCurrentNode(player!.origin, choice.nextNodeId);
  };

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

  if (!currentNode) {
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
      <div className="flex-1 p-6 overflow-y-auto relative">
        {/* 装饰性背景 */}
        <div
          className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.05) 0%, transparent 70%)',
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentNode.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 relative z-10"
          >
            {/* 说话者名称 */}
            {currentNode.speaker && (
              <div
                className="font-medium"
                style={{
                  color: 'var(--gold-immortal)',
                  fontFamily: "'Ma Shan Zheng', serif",
                  fontSize: '1.1rem',
                }}
              >
                {currentNode.speaker}
              </div>
            )}

            {/* 剧情文字 */}
            <div
              className="leading-relaxed text-lg"
              style={{
                color: 'var(--text-primary)',
                fontFamily: "'Noto Serif SC', serif",
              }}
            >
              {displayedText}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ color: 'var(--gold-immortal)' }}
                >
                  |
                </motion.span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 操作区 */}
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
              <motion.button
                key={index}
                className="w-full p-3 text-left rounded-lg transition-all"
                style={{
                  background: 'var(--ink-medium)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
                onClick={() => handleChoice(choice)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  borderColor: 'var(--gold-immortal)',
                  boxShadow: 'var(--shadow-gold)',
                }}
              >
                <span style={{ color: 'var(--gold-immortal)' }} className="mr-2">
                  {index + 1}.
                </span>
                {choice.text}
              </motion.button>
            ))}
          </div>
        ) : (
          <Button className="w-full" variant="primary" onClick={handleContinue}>
            {isTyping ? '跳过' : currentNode.nextNodeId ? '继续' : '完成'}
          </Button>
        )}
      </div>
    </div>
  );
};
