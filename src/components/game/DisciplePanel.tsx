import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../ui';
import { useDiscipleStore } from '../../stores/discipleStore';
import type { Disciple } from '../../data/disciples';
import { EXPEDITIONS, calculateExpeditionSuccess } from '../../data/disciples';
import { ELEMENT_NAMES } from '../../data/origins';

const TALENT_NAMES = {
  cultivation: '修炼',
  combat: '战斗',
  alchemy: '炼丹',
  crafting: '炼器',
  comprehension: '悟性',
};

const STATUS_NAMES = {
  idle: '空闲',
  training: '修炼中',
  expedition: '派遣中',
  injured: '受伤',
};

const STATUS_COLORS = {
  idle: 'status-idle',
  training: 'status-training',
  expedition: 'status-expedition',
  injured: 'status-injured',
};

// 弟子卡片
const DiscipleCard: React.FC<{
  disciple: Disciple;
  selected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
}> = ({ disciple, selected, onClick, showDetails }) => {
  const avgTalent = Object.values(disciple.talent).reduce((a, b) => a + b, 0) / 5;

  return (
    <motion.div
      className={`selectable-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl">
          {disciple.gender === 'male' ? '男' : '女'}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <span className="font-medium text-white">{disciple.name}</span>
            <span className={`text-xs ${STATUS_COLORS[disciple.status]}`}>
              {STATUS_NAMES[disciple.status]}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {disciple.realm.displayName} Lv.{disciple.level}
          </div>
          <div className="text-xs text-gray-500">
            灵根: {disciple.spiritualRoot.elements.map(e => ELEMENT_NAMES[e]).join('')}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-600">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">攻击</span>
              <span className="text-white">{disciple.attack}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">防御</span>
              <span className="text-white">{disciple.defense}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">忠诚</span>
              <span className="text-white">{disciple.loyalty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">心情</span>
              <span className="text-white">{disciple.mood}</span>
            </div>
          </div>

          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">天赋 (平均: {avgTalent.toFixed(0)})</div>
            <div className="flex gap-1">
              {Object.entries(disciple.talent).map(([key, value]) => (
                <div
                  key={key}
                  className="flex-1 text-center text-xs"
                  title={TALENT_NAMES[key as keyof typeof TALENT_NAMES]}
                >
                  <div className="h-1 bg-gray-600 rounded overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const DisciplePanel: React.FC = () => {
  const disciples = useDiscipleStore((state) => state.disciples);
  const maxDisciples = useDiscipleStore((state) => state.maxDisciples);
  const recruitCandidates = useDiscipleStore((state) => state.recruitCandidates);
  const activeExpeditions = useDiscipleStore((state) => state.activeExpeditions);

  const refreshRecruitCandidates = useDiscipleStore((state) => state.refreshRecruitCandidates);
  const recruitDisciple = useDiscipleStore((state) => state.recruitDisciple);
  const startExpedition = useDiscipleStore((state) => state.startExpedition);

  const [activeTab, setActiveTab] = useState<'list' | 'recruit' | 'expedition'>('list');
  const [selectedDisciple, setSelectedDisciple] = useState<string | null>(null);
  const [selectedForExpedition, setSelectedForExpedition] = useState<string[]>([]);
  const [selectedExpedition, setSelectedExpedition] = useState<string | null>(null);

  useEffect(() => {
    if (recruitCandidates.length === 0) {
      refreshRecruitCandidates();
    }
  }, []);

  const idleDisciples = disciples.filter(d => d.status === 'idle');

  // 过滤满足当前派遣任务等级要求的弟子
  const eligibleDisciples = selectedExpedition
    ? idleDisciples.filter(d => d.level >= EXPEDITIONS[selectedExpedition].minLevel)
    : idleDisciples;

  const handleToggleExpeditionSelect = (id: string) => {
    setSelectedForExpedition(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStartExpedition = () => {
    if (!selectedExpedition || selectedForExpedition.length === 0) {
      return;
    }
    const success = startExpedition(selectedExpedition, selectedForExpedition);
    if (success) {
      setSelectedForExpedition([]);
      setSelectedExpedition(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* 标签页 */}
      <div className="game-tabs">
        {[
          { id: 'list', name: `弟子 (${disciples.length}/${maxDisciples})` },
          { id: 'recruit', name: '招收' },
          { id: 'expedition', name: `派遣 (${activeExpeditions.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`game-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* 弟子列表 */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {disciples.length === 0 ? (
            <Card className="col-span-full">
              <p className="text-center text-gray-500 py-8">
                暂无弟子，前往招收页面招收弟子
              </p>
            </Card>
          ) : (
            disciples.map((disciple) => (
              <DiscipleCard
                key={disciple.id}
                disciple={disciple}
                selected={selectedDisciple === disciple.id}
                onClick={() => setSelectedDisciple(
                  selectedDisciple === disciple.id ? null : disciple.id
                )}
                showDetails={selectedDisciple === disciple.id}
              />
            ))
          )}
        </div>
      )}

      {/* 招收 */}
      {activeTab === 'recruit' && (
        <Card title="招收弟子">
          <div className="mb-4 flex justify-between items-center">
            <span className="text-gray-400">
              可招收: {recruitCandidates.length} 人
            </span>
            <Button size="sm" onClick={refreshRecruitCandidates}>
              刷新候选
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recruitCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="p-3 bg-gray-700/30 rounded-lg border border-gray-600"
              >
                <DiscipleCard disciple={candidate} showDetails />
                <Button
                  size="sm"
                  className="w-full mt-3"
                  disabled={disciples.length >= maxDisciples}
                  onClick={() => recruitDisciple(candidate.id)}
                >
                  招收
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 派遣 */}
      {activeTab === 'expedition' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 任务列表 */}
          <Card title="派遣任务">
            <div className="space-y-2">
              {Object.values(EXPEDITIONS).map((exp) => {
                const isActive = activeExpeditions.some(a => a.expeditionId === exp.id);

                return (
                  <div
                    key={exp.id}
                    className={`selectable-card ${
                      selectedExpedition === exp.id
                        ? 'selected'
                        : isActive
                        ? 'active-expedition'
                        : ''
                    }`}
                    onClick={() => !isActive && setSelectedExpedition(exp.id)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-white">{exp.name}</span>
                      <span className="text-xs text-gray-500">
                        {isActive ? '进行中' : `${Math.floor(exp.duration / 3600)}小时`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{exp.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>等级: {exp.minLevel}+</span>
                      <span>人数: {exp.minDiscipleCount}-{exp.maxDiscipleCount}</span>
                      <span>危险: {'*'.repeat(exp.dangerLevel)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 选择弟子 */}
          <Card title="选择弟子">
            {selectedExpedition ? (
              <>
                <div className="mb-3 text-sm text-gray-400">
                  已选择: {selectedForExpedition.length} / {EXPEDITIONS[selectedExpedition].maxDiscipleCount}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {eligibleDisciples.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      没有满足等级要求的空闲弟子
                    </p>
                  ) : (
                    eligibleDisciples.map((disciple) => (
                    <div
                      key={disciple.id}
                      className={`selectable-card ${
                        selectedForExpedition.includes(disciple.id) ? 'selected' : ''
                      }`}
                      onClick={() => handleToggleExpeditionSelect(disciple.id)}
                    >
                      <div className="flex justify-between">
                        <span className="text-white">{disciple.name}</span>
                        <span className="text-xs text-gray-400">Lv.{disciple.level}</span>
                      </div>
                    </div>
                  ))
                  )}
                </div>

                {selectedForExpedition.length >= EXPEDITIONS[selectedExpedition].minDiscipleCount && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-400 mb-2">
                      预计成功率: {(calculateExpeditionSuccess(
                        EXPEDITIONS[selectedExpedition],
                        idleDisciples.filter(d => selectedForExpedition.includes(d.id))
                      ) * 100).toFixed(1)}%
                    </div>
                    <Button className="w-full" onClick={handleStartExpedition}>
                      开始派遣
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">
                请选择一个派遣任务
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
