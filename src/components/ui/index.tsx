import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  type?: 'hp' | 'mp' | 'exp' | 'cultivation' | 'custom';
  customColor?: string;
  label?: string;
  showText?: boolean;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  type = 'exp',
  customColor,
  label,
  showText = true,
  height = 8,
}) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  const typeClass = {
    hp: 'progress-hp',
    mp: 'progress-mp',
    exp: 'progress-exp',
    cultivation: 'progress-cultivation',
    custom: '',
  }[type];

  const customStyle = type === 'custom' && customColor ? { background: customColor } : {};

  return (
    <div style={{ width: '100%' }}>
      {(label || showText) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          {label && <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{label}</span>}
          {showText && (
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {Math.floor(current).toLocaleString()} / {Math.floor(max).toLocaleString()}
            </span>
          )}
        </div>
      )}
      <div className="progress-container" style={{ height: `${height}px` }}>
        <div
          className={`progress-bar ${typeClass}`}
          style={{ width: `${percentage}%`, ...customStyle }}
        />
      </div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-5 py-2.5',
    lg: 'text-lg px-7 py-3',
  };

  const variantClass = {
    primary: 'btn-xian btn-primary',
    secondary: 'btn-xian',
    danger: 'btn-xian btn-danger',
    ghost: 'btn-xian btn-ghost',
  }[variant];

  return (
    <button
      className={`${variantClass} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '', onClick }) => {
  return (
    <div
      className={`card-xian ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={{ padding: '20px' }}
    >
      {title && <h3 className="card-title" style={{ marginBottom: '16px' }}>{title}</h3>}
      {children}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div
        className="relative card-xian max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto animate-fade-in-scale"
        style={{ background: 'var(--ink-dark)' }}
      >
        {title && <h2 className="card-title">{title}</h2>}
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onClick={onClose}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="tooltip inline-block">
      {children}
      <div className="tooltip-content">{content}</div>
    </div>
  );
};
