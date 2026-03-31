import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../services/api';
import './TitleScreen.css';

const FloatingParticle: React.FC<{ delay: number; duration: number; x: number }> = ({ delay, duration, x }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full title-particle"
    style={{ left: `${x}%`, bottom: '-5%' }}
    animate={{
      y: [0, -window.innerHeight * 1.2],
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1, 1, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
);

const MountainLayer: React.FC<{ opacity: number; yOffset: number; scale: number }> = ({ opacity, yOffset, scale }) => (
  <svg
    className="absolute bottom-0 left-0 w-full"
    style={{ opacity, transform: `translateY(${yOffset}%) scale(${scale})` }}
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <path
      fill="var(--ink-medium)"
      d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </svg>
);

const CloudLayer: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <motion.div
    className={`absolute pointer-events-none title-cloud ${className}`}
    style={style}
    animate={{
      x: ['-5%', '5%', '-5%'],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

export const TitleScreen: React.FC<{ onEnter?: () => void }> = ({ onEnter }) => {
  const setPhase = useGameStore((state) => state.setPhase);
  const player = usePlayerStore((state) => state.player);
  const resetPlayer = usePlayerStore((state) => state.resetPlayer);
  const { isAuthenticated, user, logout } = useAuthStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      x: Math.random() * 100,
    })), []);

  const handleNewGame = () => {
    if (player) {
      setShowConfirm(true);
    } else {
      // 已登录用户进入存档管理，未登录直接创建角色
      if (isAuthenticated && onEnter) {
        onEnter();
      } else {
        setPhase('character_creation');
      }
    }
  };

  const handleContinue = () => {
    // 已登录用户进入存档管理，未登录直接继续游戏
    if (isAuthenticated && onEnter) {
      onEnter();
    } else if (player) {
      setPhase('playing');
    }
  };

  const handleConfirmNewGame = () => {
    resetPlayer();
    if (isAuthenticated && onEnter) {
      onEnter();
    } else {
      setPhase('character_creation');
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* 深层背景 - 星空效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 title-bg-gradient" />
      </div>

      {/* 远山层 */}
      <div className="absolute inset-0 pointer-events-none">
        <MountainLayer opacity={0.15} yOffset={20} scale={1.2} />
        <MountainLayer opacity={0.25} yOffset={10} scale={1.1} />
        <MountainLayer opacity={0.4} yOffset={0} scale={1} />
      </div>

      {/* 云雾层 */}
      <CloudLayer className="w-[800px] h-[300px] -left-20 top-1/4" />
      <CloudLayer
        className="w-[600px] h-[200px] -right-10 top-1/3"
        style={{ animationDelay: '5s' }}
      />
      <CloudLayer
        className="w-[1000px] h-[400px] left-1/4 bottom-1/4"
        style={{ animationDelay: '10s' }}
      />

      {/* 仙气粒子 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <FloatingParticle key={p.id} delay={p.delay} duration={p.duration} x={p.x} />
        ))}
      </div>

      {/* 中心光晕 */}
      <motion.div
        className="absolute top-1/3 left-1/2 w-[600px] h-[600px] rounded-full title-center-glow"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 八卦阵 - 外圈 */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full title-bagua-outer"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        {/* 八卦符文标记 */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <motion.div
            key={deg}
            className="absolute w-3 h-3"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateY(-350px) translateX(-50%)`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-full h-full rounded-full title-bagua-dot" />
          </motion.div>
        ))}
      </motion.div>

      {/* 八卦阵 - 内圈 */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-10 title-bagua-inner"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />

      {/* 太极核心 */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-32 h-32 title-taiji"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full rounded-full opacity-20 title-taiji-inner" />
      </motion.div>

      {/* 主内容 */}
      <div className="relative z-10 text-center">
        <AnimatePresence>
          {isLoaded && (
            <>
              {/* 顶部装饰线 */}
              <motion.div
                className="w-40 h-px mx-auto mb-5 title-deco-line"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.6 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />

              {/* 副标题 - 上 */}
              <motion.p
                className="text-xs tracking-[0.4em] mb-3 title-subtitle-top"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                仙道渺渺 唯心求真
              </motion.p>

              {/* 主标题 */}
              <motion.h1
                className="text-6xl md:text-7xl font-bold mb-3 title-main"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              >
                万界轮回
              </motion.h1>

              {/* 副标题 - 下 */}
              <motion.p
                className="text-lg md:text-xl mb-2 title-subtitle-bottom"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                凡人修仙 逆天改命
              </motion.p>

              {/* 装饰诗句 */}
              <motion.p
                className="text-xs title-poem"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                三千大道皆可成仙 一念之间天地翻覆
              </motion.p>

              {/* 按钮组 */}
              <motion.div
                className="title-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {/* 已登录状态 - 简洁显示 */}
                {isAuthenticated && (
                  <div className="title-user-badge">
                    <span className="title-user-dot" />
                    <span className="title-user-name">
                      {user?.username || '修仙者'}
                    </span>
                    <span className="title-user-divider" />
                    <button
                      onClick={logout}
                      className="title-logout-btn"
                    >
                      退出
                    </button>
                  </div>
                )}

                {/* 主按钮区 */}
                <div className="title-btn-group">
                  {/* 主游戏按钮 */}
                  <motion.button
                    className="btn-xian btn-primary title-btn-primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={player ? handleContinue : handleNewGame}
                  >
                    {player ? '继续修炼' : '踏入仙途'}
                  </motion.button>

                  {/* 辅助按钮行 */}
                  <div className="title-btn-row">
                    {player && (
                      <motion.button
                        className="btn-xian title-btn-secondary"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleNewGame}
                      >
                        重新开始
                      </motion.button>
                    )}

                    {!isAuthenticated && (
                      <>
                        {player && (
                          <span className="title-btn-divider" />
                        )}
                        <motion.button
                          className="title-btn-login"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setShowLoginPrompt(true)}
                        >
                          登录账号
                        </motion.button>
                      </>
                    )}
                  </div>

                  {/* 提示文字 */}
                  {!isAuthenticated && (
                    <p className="title-hint">
                      登录后可云端同步存档
                    </p>
                  )}
                </div>
              </motion.div>

              {/* 底部信息 */}
              <motion.div
                className="mt-10 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                <div className="flex items-center gap-3 text-xs title-footer">
                  <span className="title-version-line left" />
                  <span>版本 0.1.0</span>
                  <span className="title-version-line right" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* 确认弹窗 */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 title-modal-overlay"
              onClick={() => setShowConfirm(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative card-xian max-w-md w-full mx-4 title-modal-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <h3 className="card-title">道心动摇</h3>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                重踏仙途将抹去前世因果,此决定不可逆转。是否确认?
              </p>
              <div className="flex gap-4">
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowConfirm(false)}
                  >
                    继续前路
                  </Button>
                </motion.div>
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={handleConfirmNewGame}
                  >
                    转世轮回
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 登录弹窗 */}
      <AnimatePresence>
        {showLoginPrompt && (
          <LoginModal
            onClose={() => setShowLoginPrompt(false)}
            onLoginSuccess={() => {
              setShowLoginPrompt(false);
              // 登录成功后自动进入存档管理
              if (onEnter) {
                onEnter();
              }
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 登录弹窗组件
const LoginModal: React.FC<{ onClose: () => void; onLoginSuccess?: () => void }> = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await authApi.login(account, password);
        setAuth(res.user, res.accessToken, res.refreshToken);
      } else {
        await authApi.register(username, email, password);
        const loginRes = await authApi.login(username, password);
        setAuth(loginRes.user, loginRes.accessToken, loginRes.refreshToken);
      }

      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 title-modal-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="relative card-xian max-w-md w-full mx-4 title-modal-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="card-title">{isLogin ? '道友登录' : '加入仙途'}</h3>

        {/* 切换标签 */}
        <div className="title-auth-tabs">
          <button
            onClick={() => setIsLogin(true)}
            className={`title-auth-tab ${isLogin ? 'active' : 'inactive'}`}
          >
            登录
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`title-auth-tab ${!isLogin ? 'active' : 'inactive'}`}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="title-auth-form">
          {isLogin ? (
            <>
              <input
                type="text"
                placeholder="用户名或邮箱"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
                className="title-auth-input"
              />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="title-auth-input"
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="title-auth-input"
              />
              <input
                type="email"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="title-auth-input"
              />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="title-auth-input"
              />
            </>
          )}

          {error && (
            <div className="title-auth-error">
              {error}
            </div>
          )}

          <div className="title-auth-buttons">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={onClose}
            >
              取消
            </Button>
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-xian btn-primary flex-1"
              style={{ padding: '10px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? '处理中...' : isLogin ? '登录' : '注册'}
            </motion.button>
          </div>
        </form>

        <p className="title-auth-hint">
          登录后可在不同设备间同步存档
        </p>
      </motion.div>
    </motion.div>
  );
};
