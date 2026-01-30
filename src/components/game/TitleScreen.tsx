import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useAuthStore } from '../../stores/authStore';

const FloatingParticle: React.FC<{ delay: number; duration: number; x: number }> = ({ delay, duration, x }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full"
    style={{
      left: `${x}%`,
      bottom: '-5%',
      background: 'radial-gradient(circle, rgba(201, 162, 39, 0.8) 0%, transparent 70%)',
      boxShadow: '0 0 6px rgba(201, 162, 39, 0.6)',
    }}
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
    className={`absolute pointer-events-none ${className}`}
    style={{
      background: 'radial-gradient(ellipse 80% 40% at center, rgba(201, 162, 39, 0.03) 0%, transparent 70%)',
      filter: 'blur(30px)',
      ...style,
    }}
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
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 50% 0%, rgba(45, 139, 111, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse 80% 60% at 20% 100%, rgba(109, 40, 217, 0.06) 0%, transparent 40%),
              radial-gradient(ellipse 60% 80% at 90% 80%, rgba(201, 162, 39, 0.05) 0%, transparent 40%)
            `,
          }}
        />
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
        className="absolute top-1/3 left-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.12) 0%, rgba(201, 162, 39, 0.05) 30%, transparent 70%)',
          filter: 'blur(60px)',
        }}
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
        className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          transform: 'translate(-50%, -50%)',
          border: '1px solid rgba(201, 162, 39, 0.1)',
          boxShadow: 'inset 0 0 100px rgba(201, 162, 39, 0.03)',
        }}
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
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'var(--gold-immortal)',
                boxShadow: '0 0 10px var(--gold-immortal), 0 0 20px rgba(201, 162, 39, 0.5)',
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* 八卦阵 - 内圈 */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          transform: 'translate(-50%, -50%)',
          background: `conic-gradient(
            from 0deg,
            transparent 0deg 22.5deg,
            var(--gold-immortal) 22.5deg 67.5deg,
            transparent 67.5deg 112.5deg,
            var(--gold-immortal) 112.5deg 157.5deg,
            transparent 157.5deg 202.5deg,
            var(--gold-immortal) 202.5deg 247.5deg,
            transparent 247.5deg 292.5deg,
            var(--gold-immortal) 292.5deg 337.5deg,
            transparent 337.5deg 360deg
          )`,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />

      {/* 太极核心 */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-32 h-32"
        style={{ transform: 'translate(-50%, -50%)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="w-full h-full rounded-full opacity-20"
          style={{
            background: `
              linear-gradient(90deg, var(--ink-black) 50%, var(--gold-immortal) 50%),
              radial-gradient(circle at 25% 50%, var(--gold-immortal) 12%, transparent 12%),
              radial-gradient(circle at 75% 50%, var(--ink-black) 12%, transparent 12%)
            `,
            backgroundBlendMode: 'normal',
          }}
        />
      </motion.div>

      {/* 主内容 */}
      <div className="relative z-10 text-center">
        <AnimatePresence>
          {isLoaded && (
            <>
              {/* 顶部装饰线 */}
              <motion.div
                className="w-40 h-px mx-auto mb-5"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, var(--gold-immortal) 50%, transparent 100%)',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.6 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />

              {/* 副标题 - 上 */}
              <motion.p
                className="text-xs tracking-[0.4em] mb-3"
                style={{
                  color: 'var(--gold-immortal)',
                  fontFamily: "'Noto Serif SC', serif",
                  opacity: 0.7,
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                仙道渺渺 唯心求真
              </motion.p>

              {/* 主标题 */}
              <motion.h1
                className="text-6xl md:text-7xl font-bold mb-3"
                style={{
                  fontFamily: "'Ma Shan Zheng', 'Noto Serif SC', serif",
                  background: 'linear-gradient(180deg, var(--gold-light) 0%, var(--gold-immortal) 40%, #8b6914 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 60px rgba(201, 162, 39, 0.3)',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
                }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              >
                万界轮回
              </motion.h1>

              {/* 副标题 - 下 */}
              <motion.p
                className="text-lg md:text-xl mb-2"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: "'ZCOOL XiaoWei', serif",
                  letterSpacing: '0.15em',
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                凡人修仙 逆天改命
              </motion.p>

              {/* 装饰诗句 */}
              <motion.p
                className="text-xs"
                style={{
                  color: 'var(--text-muted)',
                  fontFamily: "'Noto Serif SC', serif",
                  fontStyle: 'italic',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                三千大道皆可成仙 一念之间天地翻覆
              </motion.p>

              {/* 按钮组 */}
              <motion.div
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', marginTop: '32px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {/* 已登录状态 - 简洁显示 */}
                {isAuthenticated && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 16px',
                      background: 'rgba(201, 162, 39, 0.08)',
                      border: '1px solid rgba(201, 162, 39, 0.2)',
                      borderRadius: '20px',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--jade-essence)',
                        boxShadow: '0 0 6px var(--jade-essence)',
                      }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)' }}>
                      {user?.username || '修仙者'}
                    </span>
                    <span style={{ width: '1px', height: '12px', background: 'rgba(201, 162, 39, 0.3)' }} />
                    <button
                      onClick={logout}
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(224, 104, 96, 0.9)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      退出
                    </button>
                  </div>
                )}

                {/* 主按钮区 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  {/* 主游戏按钮 */}
                  <motion.button
                    className="btn-xian btn-primary"
                    style={{ fontSize: '1.1rem', padding: '16px 48px', minWidth: '200px' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={player ? handleContinue : handleNewGame}
                  >
                    {player ? '继续修炼' : '踏入仙途'}
                  </motion.button>

                  {/* 辅助按钮行 */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {player && (
                      <motion.button
                        className="btn-xian"
                        style={{ fontSize: '0.875rem', padding: '10px 24px' }}
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
                          <span style={{ width: '1px', height: '20px', background: 'rgba(201, 162, 39, 0.2)' }} />
                        )}
                        <motion.button
                          style={{
                            fontSize: '0.875rem',
                            padding: '10px 24px',
                            background: 'transparent',
                            border: '1px solid rgba(201, 162, 39, 0.4)',
                            borderRadius: '6px',
                            color: 'var(--gold-immortal)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          whileHover={{ scale: 1.03, borderColor: 'rgba(201, 162, 39, 0.7)' }}
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
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', opacity: 0.6 }}>
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
                <div
                  className="flex items-center gap-3 text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span style={{
                    width: '30px',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--text-muted))'
                  }} />
                  <span>版本 0.1.0</span>
                  <span style={{
                    width: '30px',
                    height: '1px',
                    background: 'linear-gradient(90deg, var(--text-muted), transparent)'
                  }} />
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
              className="absolute inset-0"
              style={{ background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowConfirm(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative card-xian max-w-md w-full mx-4"
              style={{
                background: 'linear-gradient(145deg, rgba(26, 26, 40, 0.95) 0%, rgba(18, 18, 26, 0.98) 100%)',
                boxShadow: '0 0 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(201, 162, 39, 0.1)',
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <h3 className="card-title">道心动摇</h3>
              <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
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
      const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const body = isLogin
        ? { account, password }
        : { username, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || '操作失败');
      }

      if (isLogin) {
        setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      } else {
        // 注册成功后自动登录
        const loginRes = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: username, password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          setAuth(loginData.data.user, loginData.data.accessToken, loginData.data.refreshToken);
        }
      }

      // 登录成功，调用回调跳转到存档管理
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
        className="absolute inset-0"
        style={{ background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="relative card-xian max-w-md w-full mx-4"
        style={{
          background: 'linear-gradient(145deg, rgba(26, 26, 40, 0.95) 0%, rgba(18, 18, 26, 0.98) 100%)',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(201, 162, 39, 0.1)',
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="card-title">{isLogin ? '道友登录' : '加入仙途'}</h3>

        {/* 切换标签 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '8px',
              background: isLogin ? 'rgba(201, 162, 39, 0.15)' : 'transparent',
              border: `1px solid ${isLogin ? 'rgba(201, 162, 39, 0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '4px',
              color: isLogin ? 'var(--gold-immortal)' : 'var(--text-muted)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            登录
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '8px',
              background: !isLogin ? 'rgba(201, 162, 39, 0.15)' : 'transparent',
              border: `1px solid ${!isLogin ? 'rgba(201, 162, 39, 0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '4px',
              color: !isLogin ? 'var(--gold-immortal)' : 'var(--text-muted)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isLogin ? (
            <>
              <input
                type="text"
                placeholder="用户名或邮箱"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
                style={{
                  padding: '10px 14px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: '10px 14px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
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
                style={{
                  padding: '10px 14px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <input
                type="email"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '10px 14px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: '10px 14px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </>
          )}

          {error && (
            <div
              style={{
                padding: '8px 12px',
                background: 'rgba(224, 104, 96, 0.1)',
                border: '1px solid rgba(224, 104, 96, 0.3)',
                borderRadius: '4px',
                color: '#e06860',
                fontSize: '0.8rem',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
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

        <p
          style={{
            marginTop: '16px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          登录后可在不同设备间同步存档
        </p>
      </motion.div>
    </motion.div>
  );
};
