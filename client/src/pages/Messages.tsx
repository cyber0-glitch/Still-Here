import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import type { Conversation } from '../types';

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '...';
}

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchConversations() {
      try {
        const data = await api<{ conversations: any[] }>('/conversations');
        // Transform server shape: server returns `participants` array, client expects `otherParticipant`
        const transformed: Conversation[] = data.conversations.map((conv) => ({
          id: conv.id,
          lastMessageAt: conv.lastMessageAt,
          memorialLocked: conv.memorialLocked,
          originMomentTitle: conv.originMomentTitle,
          otherParticipant: conv.participants?.[0] || null,
          lastMessage: conv.lastMessage?.content || null,
          unreadCount: conv.unreadCount ?? 0,
        }));
        setConversations(transformed);
      } catch (err: any) {
        setError(err.message || 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-brand-muted">Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-brand-coral">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-brand-text">Messages</h1>

      {conversations.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-brand-muted text-lg">No conversations yet.</p>
          <p className="text-brand-muted mt-2">Find a moment that speaks to you.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const isUnread = (conv.unreadCount ?? 0) > 0;
            const other = conv.otherParticipant;

            return (
              <button
                key={conv.id}
                onClick={() => navigate(`/messages/${conv.id}`)}
                className="card w-full text-left flex items-center gap-4 hover:border-brand-amber/40 transition-colors duration-200 cursor-pointer"
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-brand-mid flex items-center justify-center text-brand-text font-semibold text-sm">
                  {other?.avatarUrl ? (
                    <img
                      src={other.avatarUrl}
                      alt={other.displayName}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    other?.displayName?.charAt(0).toUpperCase() || '?'
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`truncate ${
                          isUnread
                            ? 'font-bold text-brand-text'
                            : 'font-medium text-brand-text'
                        }`}
                      >
                        {other?.displayName || 'Unknown'}
                      </span>
                      {other?.isMemorial && (
                        <span className="text-xs text-brand-lavender bg-brand-lavender/10 px-2 py-0.5 rounded-full flex-shrink-0">
                          Memorial
                        </span>
                      )}
                    </div>
                    {conv.lastMessageAt && (
                      <span className="text-xs text-brand-muted flex-shrink-0">
                        {timeAgo(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-0.5 truncate ${
                      isUnread ? 'text-brand-text font-semibold' : 'text-brand-muted'
                    }`}
                  >
                    {conv.lastMessage
                      ? truncate(conv.lastMessage, 80)
                      : 'No messages yet'}
                  </p>
                </div>

                {/* Unread indicator */}
                {isUnread && (
                  <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-brand-amber" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
