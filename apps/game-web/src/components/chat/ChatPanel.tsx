import { useState, useEffect, useRef, useCallback } from 'react';
import { chatApi, type ChatMessage as ApiChatMessage } from '../../services/api';
import { message } from '../ui';
import './ChatPanel.css';

type ChatChannel = 'world' | 'realm' | 'sect' | 'private';

interface ChatMessage {
  id: string;
  channel: ChatChannel;
  senderId: string;
  senderName: string;
  senderRealm?: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount?: number;
}

const CHANNELS: { id: ChatChannel; label: string }[] = [
  { id: 'world', label: '世界' },
  { id: 'realm', label: '同境' },
  { id: 'sect', label: '宗门' },
  { id: 'private', label: '私聊' },
];

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [activeChannel, setActiveChannel] = useState<ChatChannel>('world');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<number | null>(null);

  const transformMessage = (msg: ApiChatMessage): ChatMessage => ({
    id: msg.id,
    channel: msg.channel as ChatChannel,
    senderId: msg.senderId,
    senderName: msg.senderName,
    senderRealm: msg.senderRealm,
    content: msg.content,
    timestamp: new Date(msg.createdAt),
    isSystem: msg.isSystem,
  });

  const fetchMessages = useCallback(async () => {
    try {
      const data = await chatApi.getMessages(activeChannel);
      setMessages(data.map(transformMessage));
    } catch (err) {
      console.error('获取消息失败:', err);
      message.error('获取消息失败');
    }
  }, [activeChannel]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchMessages().finally(() => setLoading(false));

      // 轮询获取新消息
      pollingRef.current = window.setInterval(fetchMessages, 5000);

      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [isOpen, activeChannel, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;

    setSending(true);
    try {
      const newMsg = await chatApi.send(activeChannel, inputValue.trim());
      setMessages((prev) => [...prev, transformMessage(newMsg)]);
      setInputValue('');
    } catch (err) {
      console.error('发送消息失败:', err);
      message.error('发送消息失败');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className={`chat-panel ${isOpen ? 'open' : ''}`}>
        <div className="chat-panel-header">
          <span className="chat-panel-title">仙界通讯</span>
          <button className="chat-panel-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="chat-channels">
          {CHANNELS.map((channel) => (
            <button
              key={channel.id}
              className={`chat-channel-btn ${activeChannel === channel.id ? 'active' : ''}`}
              onClick={() => setActiveChannel(channel.id)}
            >
              {channel.label}
            </button>
          ))}
        </div>

        <div className="chat-messages">
          {loading ? (
            <div className="chat-empty">
              <span>加载中...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="chat-empty">
              <svg className="chat-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>暂无消息</span>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.isSystem ? 'system' : ''}`}>
                <div className="chat-message-header">
                  <span className="chat-message-sender">{msg.senderName}</span>
                  {msg.senderRealm && <span className="chat-message-realm">{msg.senderRealm}</span>}
                  <span className="chat-message-time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="chat-message-content">{msg.content}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <input
              id="chat-message-input"
              name="chat-message"
              type="text"
              className="chat-input"
              placeholder="输入消息..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
            />
            <button className="chat-send-btn" onClick={handleSend} disabled={!inputValue.trim() || sending}>
              {sending ? '...' : '发送'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function ChatToggleButton({ onClick, unreadCount }: { onClick: () => void; unreadCount?: number }) {
  return (
    <button className="chat-toggle-btn" onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      {unreadCount !== undefined && unreadCount > 0 && (
        <span className="chat-unread">{unreadCount > 99 ? '99+' : unreadCount}</span>
      )}
    </button>
  );
}
