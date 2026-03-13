import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import type { Message, Conversation } from '../types';

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (isToday) return time;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return `Yesterday ${time}`;

  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${time}`;
}

export default function ConversationView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [messagesRes, convRes] = await Promise.all([
          api<{ messages: Message[]; pagination: any }>(`/conversations/${id}/messages`),
          api<any>(`/conversations/${id}`).catch(() => null),
        ]);
        setMessages(messagesRes.messages);
        if (convRes) {
          // Transform server shape: participants array → otherParticipant
          const other = convRes.participants?.find(
            (p: any) => p.userId !== user?.id
          );
          setConversation({
            id: convRes.id,
            lastMessageAt: convRes.lastMessageAt,
            memorialLocked: convRes.memorialLocked,
            originMomentTitle: convRes.originMomentTitle,
            otherParticipant: other
              ? {
                  id: other.userId,
                  displayName: other.displayName,
                  avatarUrl: other.avatarUrl,
                  verificationStatus: other.verificationStatus,
                  isMemorial: other.isMemorial,
                }
              : undefined,
          });
        }

        // Mark as read
        api(`/conversations/${id}/read`, { method: 'PATCH' }).catch(() => {});
      } catch (err: any) {
        setError(err.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content || sending) return;

    setSending(true);
    try {
      const res = await api<{ message: Message }>(`/conversations/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      setMessages((prev) => [...prev, res.message]);
      setNewMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const isMemorialLocked = conversation?.memorialLocked ?? false;
  const otherName = conversation?.otherParticipant?.displayName || 'Conversation';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-brand-muted">Loading messages...</p>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-brand-coral">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-brand-mid/30">
        <Link
          to="/messages"
          className="text-brand-muted hover:text-brand-text transition-colors"
        >
          &larr; Back
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-brand-text">{otherName}</h1>
          {conversation?.otherParticipant?.isMemorial && (
            <span className="text-xs text-brand-lavender bg-brand-lavender/10 px-2 py-0.5 rounded-full">
              Memorial
            </span>
          )}
        </div>
        {conversation?.originMomentTitle && (
          <span className="text-xs text-brand-muted ml-auto">
            via "{conversation.originMomentTitle}"
          </span>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-brand-muted py-8">
            No messages yet. Say hello.
          </p>
        )}

        {messages.map((msg) => {
          const isSystem = msg.messageType === 'system';
          const isOwn = msg.senderId === user?.id;

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <p className="text-xs text-brand-muted italic px-4 py-1.5 bg-brand-dark/40 rounded-full max-w-md text-center">
                  {msg.content}
                </p>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isOwn
                    ? 'bg-brand-mid text-brand-text rounded-br-md'
                    : 'bg-brand-navy text-brand-text rounded-bl-md border border-brand-mid/20'
                }`}
              >
                {!isOwn && msg.sender && (
                  <p className="text-xs text-brand-amber font-medium mb-1">
                    {msg.sender.displayName}
                  </p>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? 'text-brand-muted/70 text-right' : 'text-brand-muted/70'
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area or memorial notice */}
      {isMemorialLocked ? (
        <div className="border-t border-brand-mid/30 pt-4">
          <p className="text-center text-brand-lavender text-sm py-3">
            This conversation is now memorialized and read-only.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSend}
          className="border-t border-brand-mid/30 pt-4 flex gap-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input-field flex-1"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="btn-primary px-5 py-3 flex-shrink-0"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      )}

      {error && messages.length > 0 && (
        <p className="text-brand-coral text-xs mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
