/**
 * Design System UI Components
 * 统一的UI组件库，基于 Radix UI + xian 主题
 * 所有样式通过CSS类实现，禁止内联style
 *
 * 每个组件包含状态: hover/active/disabled/loading/error/empty + focus可访问性
 */

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

// ==================== ProgressBar ====================

export interface ProgressBarProps {
  current: number;
  max: number;
  type?: 'hp' | 'mp' | 'exp' | 'cultivation' | 'custom';
  customColor?: string;
  size?: 'sm' | 'md' | 'lg';
  /** @deprecated Use size prop instead */
  height?: number;
  label?: string;
  showText?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  type = 'exp',
  customColor,
  size = 'md',
  height,
  label,
  showText = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  const typeClass = type === 'custom' ? '' : `progress-${type}`;
  const sizeClass = height ? '' : `progress-${size}`;

  const containerStyle: React.CSSProperties = height ? { height: `${height}px` } : {};

  return (
    <div className={`w-full ${className}`}>
      {(label || showText) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-text-secondary">{label}</span>}
          {showText && (
            <span className="text-xs text-text-muted">
              {Math.floor(current).toLocaleString()} / {Math.floor(max).toLocaleString()}
            </span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        className={`progress-container ${sizeClass}`}
        value={percentage}
        style={containerStyle}
      >
        <ProgressPrimitive.Indicator
          className={`progress-bar ${typeClass}`}
          style={{
            width: `${percentage}%`,
            ...(type === 'custom' && customColor ? { background: customColor } : {}),
          }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
};

// ==================== Button ====================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const variantClass = variant === 'secondary' ? 'btn-xian' : `btn-xian btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full-width' : '';

  return (
    <button
      className={`${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner size="sm" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

// ==================== Card ====================

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'default' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  onClick,
}) => {
  const variantClass = variant !== 'default' ? `card-${variant}` : '';
  const paddingClass = `card-padding-${padding}`;
  const hoverClass = hoverable || onClick ? 'cursor-pointer hover:border-jade/50 transition-colors' : '';

  return (
    <div
      className={`card-xian ${variantClass} ${paddingClass} ${hoverClass} ${className}`.trim()}
      onClick={onClick}
    >
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </div>
  );
};

// ==================== Modal (Radix Dialog) ====================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
}) => {
  const sizeClass = `modal-${size}`;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="modal-backdrop animate-fade-in" />
        <DialogPrimitive.Content
          className={`modal-content card-xian card-padding-lg ${sizeClass} animate-fade-in-scale`}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          {title && (
            <DialogPrimitive.Title className="card-title">
              {title}
            </DialogPrimitive.Title>
          )}
          <DialogPrimitive.Close className="modal-close" aria-label="关闭">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </DialogPrimitive.Close>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

// ==================== Input ====================

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  size = 'md',
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const sizeClass = `input-${size}`;
  const errorClass = error ? 'input-error' : '';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input-xian ${sizeClass} ${errorClass}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && <p id={`${inputId}-error`} className="text-xs text-crimson-light mt-1">{error}</p>}
      {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  );
};

// ==================== Tabs (Radix Tabs) ====================

export interface TabItem {
  key: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeKey,
  onChange,
  className = '',
}) => {
  return (
    <TabsPrimitive.Root value={activeKey} onValueChange={onChange} className={className}>
      <TabsPrimitive.List className="tabs-container">
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.key}
            value={item.key}
            className="tab-xian data-[state=active]:active"
            disabled={item.disabled}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
};

// ==================== Badge ====================

export type BadgeVariant = 'realm' | 'element' | 'status';
export type RealmType = 'lianqi' | 'zhuji' | 'jindan' | 'yuanying' | 'huashen' | 'heti' | 'dacheng' | 'dujie' | 'xianren';
export type ElementType = 'metal' | 'wood' | 'water' | 'fire' | 'earth';
export type StatusType = 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  type?: RealmType | ElementType | StatusType;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'status',
  type = 'info',
  className = '',
}) => {
  const variantClass = variant === 'status' ? '' : `badge-${variant}`;
  const typeClass = `badge-${type}`;

  return (
    <span className={`badge ${variantClass} ${typeClass} ${className}`.trim()}>
      {children}
    </span>
  );
};

// ==================== Tooltip (Radix Tooltip) ====================

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  className = '',
}) => {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild className={className}>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            className="tooltip-content animate-fade-in"
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-bg-elevated" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

// ==================== Divider ====================

export interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className = '' }) => {
  return <div className={`divider-xian my-4 ${className}`} />;
};

// ==================== Loading Spinner ====================

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <svg className={`animate-spin ${sizeMap[size]} ${className}`} viewBox="0 0 24 24">
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
  );
};

// ==================== List ====================

export interface ListItem {
  id: string;
  content: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export interface ListProps {
  items: ListItem[];
  loading?: boolean;
  empty?: boolean;
  emptyText?: string;
  error?: string;
  className?: string;
  onItemClick?: (id: string) => void;
}

export const List: React.FC<ListProps> = ({
  items,
  loading = false,
  empty = false,
  emptyText = '暂无数据',
  error,
  className = '',
  onItemClick,
}) => {
  if (loading) {
    return (
      <div className={`list-container list-loading ${className}`}>
        <Spinner size="md" />
        <span className="list-loading-text">加载中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`list-container list-error ${className}`}>
        <span className="list-error-icon">!</span>
        <span className="list-error-text">{error}</span>
      </div>
    );
  }

  if (empty || items.length === 0) {
    return (
      <div className={`list-container list-empty ${className}`}>
        <span className="list-empty-text">{emptyText}</span>
      </div>
    );
  }

  return (
    <ul className={`list-container ${className}`} role="list">
      {items.map((item) => (
        <li
          key={item.id}
          className={`list-item ${item.disabled ? 'disabled' : ''} ${item.onClick || onItemClick ? 'clickable' : ''}`}
          onClick={() => {
            if (item.disabled) return;
            item.onClick?.();
            onItemClick?.(item.id);
          }}
          role={item.onClick || onItemClick ? 'button' : 'listitem'}
          tabIndex={item.onClick || onItemClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !item.disabled) {
              item.onClick?.();
              onItemClick?.(item.id);
            }
          }}
        >
          {item.content}
        </li>
      ))}
    </ul>
  );
};

// ==================== Toast ====================

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="toast-container" role="alert" aria-live="polite">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              onClick={() => removeToast(toast.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && removeToast(toast.id)}
            >
              <span className="toast-icon">
                {toast.type === 'success' && '\u2713'}
                {toast.type === 'error' && '\u2715'}
                {toast.type === 'warning' && '!'}
                {toast.type === 'info' && 'i'}
              </span>
              <span className="toast-message">{toast.message}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

// ==================== Dropdown (Radix DropdownMenu) ====================

export interface DropdownItem {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (key: string) => void;
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  disabled?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  placement = 'bottom-left',
  disabled = false,
  className = '',
}) => {
  const align = placement.includes('right') ? 'end' : 'start';
  const side = placement.includes('top') ? 'top' : 'bottom';

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger
        className={`dropdown-trigger ${disabled ? 'disabled' : ''} ${className}`}
        disabled={disabled}
      >
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className="dropdown-menu animate-fade-in"
          align={align}
          side={side}
          sideOffset={5}
        >
          {items.map((item) => (
            <DropdownMenuPrimitive.Item
              key={item.key}
              className={`dropdown-item ${item.disabled ? 'disabled' : ''} ${item.danger ? 'danger' : ''}`}
              disabled={item.disabled}
              onSelect={() => onSelect(item.key)}
            >
              {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
              {item.label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

// ==================== TextArea ====================

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  hint,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorClass = error ? 'input-error' : '';
  const disabledClass = disabled ? 'disabled' : '';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`textarea-xian ${errorClass} ${disabledClass}`.trim()}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && <p id={`${inputId}-error`} className="text-xs text-crimson-light mt-1">{error}</p>}
      {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  );
};

// ==================== Select (Radix Select) ====================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  label,
  error,
  hint,
  placeholder = '请选择',
  disabled = false,
  className = '',
}) => {
  const inputId = `select-${Math.random().toString(36).substr(2, 9)}`;
  const sizeClass = `select-${size}`;
  const errorClass = error ? 'select-error' : '';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          id={inputId}
          className={`select-xian ${sizeClass} ${errorClass}`.trim()}
          aria-invalid={!!error}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="select-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="select-content animate-fade-in" position="popper" sideOffset={5}>
            <SelectPrimitive.Viewport>
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className="select-item"
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="select-item-indicator">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <p className="text-xs text-crimson-light mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  );
};

// ==================== Switch (Radix Switch) ====================

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="switch-xian"
      >
        <SwitchPrimitive.Thumb className="switch-thumb" />
      </SwitchPrimitive.Root>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </div>
  );
};

// ==================== Checkbox (Radix Checkbox) ====================

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CheckboxPrimitive.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="checkbox-xian"
      >
        <CheckboxPrimitive.Indicator className="checkbox-indicator">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </div>
  );
};

// ==================== Empty State ====================

export interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const Empty: React.FC<EmptyProps> = ({
  title = '暂无数据',
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`empty-state ${className}`}>
      {icon && <div className="empty-icon">{icon}</div>}
      <h4 className="empty-title">{title}</h4>
      {description && <p className="empty-description">{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
};

// ==================== Skeleton ====================

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'text',
  className = '',
}) => {
  const variantClass = `skeleton-${variant}`;
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return <div className={`skeleton ${variantClass} ${className}`} style={style} />;
};

// ==================== IconButton ====================

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  loading?: boolean;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  variant = 'default',
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const sizeClass = `icon-btn-${size}`;
  const variantClass = `icon-btn-${variant}`;

  return (
    <button
      className={`icon-btn ${sizeClass} ${variantClass} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon}
    </button>
  );
};

// ==================== Confirm Dialog (Radix AlertDialog) ====================

export interface ConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
}

export const Confirm: React.FC<ConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  danger = false,
  loading = false,
}) => {
  return (
    <AlertDialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="modal-backdrop animate-fade-in" />
        <AlertDialogPrimitive.Content className="modal-content card-xian card-padding-lg modal-sm animate-fade-in-scale">
          <AlertDialogPrimitive.Title className="card-title">
            {title}
          </AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description className="text-text-secondary mb-6">
            {message}
          </AlertDialogPrimitive.Description>
          <div className="flex gap-4">
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="ghost" disabled={loading} className="flex-1">
                {cancelText}
              </Button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <Button
                variant={danger ? 'danger' : 'primary'}
                onClick={onConfirm}
                loading={loading}
                className="flex-1"
              >
                {confirmText}
              </Button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
};

// ==================== ScrollArea (Radix ScrollArea) ====================

export interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string | number;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className = '',
  maxHeight,
}) => {
  const style: React.CSSProperties = maxHeight
    ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }
    : {};

  return (
    <ScrollAreaPrimitive.Root className={`scroll-area ${className}`} style={style}>
      <ScrollAreaPrimitive.Viewport className="scroll-area-viewport">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar className="scroll-area-scrollbar" orientation="vertical">
        <ScrollAreaPrimitive.Thumb className="scroll-area-thumb" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
};

// ==================== Accordion (Radix Accordion) ====================

export interface AccordionItem {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  type = 'single',
  defaultValue,
  className = '',
}) => {
  if (type === 'multiple') {
    return (
      <AccordionPrimitive.Root
        type="multiple"
        defaultValue={defaultValue as string[]}
        className={`accordion ${className}`}
      >
        {items.map((item) => (
          <AccordionPrimitive.Item key={item.key} value={item.key} disabled={item.disabled} className="accordion-item">
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger className="accordion-trigger">
                {item.title}
                <svg className="accordion-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="accordion-content">
              {item.content}
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    );
  }

  return (
    <AccordionPrimitive.Root
      type="single"
      defaultValue={defaultValue as string}
      collapsible
      className={`accordion ${className}`}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item key={item.key} value={item.key} disabled={item.disabled} className="accordion-item">
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="accordion-trigger">
              {item.title}
              <svg className="accordion-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="accordion-content">
            {item.content}
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
};

// ==================== Message API ====================

type MessageType = 'success' | 'error' | 'warning' | 'info';

interface MessageOptions {
  duration?: number;
}

interface MessageInstance {
  id: string;
  message: string;
  type: MessageType;
  duration: number;
}

class MessageManager {
  private listeners: Set<(messages: MessageInstance[]) => void> = new Set();
  private messages: MessageInstance[] = [];

  subscribe(listener: (messages: MessageInstance[]) => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.messages]));
  }

  show(content: string, type: MessageType, options?: MessageOptions) {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = options?.duration ?? 3000;

    const instance: MessageInstance = { id, message: content, type, duration };
    this.messages.push(instance);
    this.notify();

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }

    return id;
  }

  remove(id: string) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.notify();
  }

  success(content: string, options?: MessageOptions) {
    return this.show(content, 'success', options);
  }

  error(content: string, options?: MessageOptions) {
    return this.show(content, 'error', options);
  }

  warning(content: string, options?: MessageOptions) {
    return this.show(content, 'warning', options);
  }

  info(content: string, options?: MessageOptions) {
    return this.show(content, 'info', options);
  }
}

export const message = new MessageManager();

export const MessageContainer: React.FC = () => {
  const [messages, setMessages] = useState<MessageInstance[]>([]);

  useEffect(() => {
    return message.subscribe(setMessages);
  }, []);

  if (messages.length === 0) return null;

  return createPortal(
    <div className="message-container" role="alert" aria-live="polite">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message message-${msg.type}`}
          onClick={() => message.remove(msg.id)}
        >
          <span className="message-icon">
            {msg.type === 'success' && '\u2713'}
            {msg.type === 'error' && '\u2715'}
            {msg.type === 'warning' && '!'}
            {msg.type === 'info' && 'i'}
          </span>
          <span className="message-text">{msg.message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
};
