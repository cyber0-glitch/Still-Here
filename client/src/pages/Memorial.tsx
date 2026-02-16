import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import type { User } from '../types';

const PROMPT_LABELS: Record<string, string> = {
  promptNoPatience: "I have no patience for...",
  promptWantCompany: "I want company for...",
  promptBodyCanHandle: "My body can handle...",
  promptDontTalkLike: "Don't talk to me like...",
  promptBeforeIGo: "Before I go, I want to...",
  promptFreeform: "In my own words...",
};

const PROMPT_KEYS = Object.keys(PROMPT_LABELS) as (keyof User)[];

interface Memory {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  author?: {
    id: string;
    displayName: string;
  };
}

interface MemorialData {
  user: User;
  memorialMessage?: string | null;
  allowMemories: boolean;
  memories: Memory[];
}

export default function Memorial() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [memorial, setMemorial] = useState<MemorialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [memoryText, setMemoryText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  useEffect(() => {
    async function fetchMemorial() {
      try {
        const data = await api<MemorialData>(`/memorials/${id}`);
        setMemorial(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load memorial');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchMemorial();
  }, [id]);

  async function handleLeaveMemory(e: React.FormEvent) {
    e.preventDefault();
    if (!memoryText.trim() || !id) return;
    setSubmitting(true);
    setSubmitMsg('');
    try {
      const newMemory = await api<Memory>(`/memorials/${id}/memories`, {
        method: 'POST',
        body: JSON.stringify({ content: memoryText.trim() }),
      });
      setMemorial((prev) =>
        prev ? { ...prev, memories: [newMemory, ...prev.memories] } : prev
      );
      setMemoryText('');
      setSubmitMsg('Memory shared. Thank you.');
    } catch (err: any) {
      setSubmitMsg(err.message || 'Failed to share memory');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-brand-muted text-center py-12">Loading memorial...</p>;
  }

  if (error || !memorial) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-coral mb-4">{error || 'Memorial not found'}</p>
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm">
          Go Back
        </button>
      </div>
    );
  }

  const { user: memUser, memories } = memorial;
  const filledPrompts = PROMPT_KEYS.filter((k) => memUser[k]);

  return (
    <div className="space-y-6">
      {/* Memorial Header */}
      <div className="card text-center space-y-4 border-brand-lavender/40">
        <div className="w-20 h-20 rounded-full bg-brand-lavender/20 flex items-center justify-center text-2xl font-bold text-brand-lavender mx-auto">
          {memUser.displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-text">{memUser.displayName}</h1>
          <p className="text-brand-lavender mt-1">In Memoriam</p>
        </div>

        {memorial.memorialMessage && (
          <div className="bg-brand-dark/40 rounded-lg p-4 mt-4">
            <p className="text-brand-text italic leading-relaxed">
              "{memorial.memorialMessage}"
            </p>
          </div>
        )}
      </div>

      {/* Profile Prompts */}
      {filledPrompts.length > 0 && (
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-brand-amber">In Their Words</h3>
          {filledPrompts.map((key) => (
            <div key={key}>
              <p className="text-sm text-brand-muted">{PROMPT_LABELS[key]}</p>
              <p className="text-brand-text mt-1">{memUser[key] as string}</p>
            </div>
          ))}
        </div>
      )}

      {/* Leave a Memory */}
      {memorial.allowMemories && currentUser && (
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-brand-amber">Leave a Memory</h3>
          <form onSubmit={handleLeaveMemory} className="space-y-3">
            <textarea
              className="input-field"
              rows={3}
              placeholder="Share a memory, a thought, or something you want them to know..."
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
            />
            {submitMsg && (
              <p className={`text-sm ${submitMsg.includes('Failed') ? 'text-brand-coral' : 'text-brand-teal'}`}>
                {submitMsg}
              </p>
            )}
            <button type="submit" disabled={submitting || !memoryText.trim()} className="btn-primary">
              {submitting ? 'Sharing...' : 'Share Memory'}
            </button>
          </form>
        </div>
      )}

      {/* Memories List */}
      {memories.length > 0 && (
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-brand-amber">
            Memories ({memories.length})
          </h3>
          <div className="space-y-4">
            {memories.map((memory) => (
              <div key={memory.id} className="bg-brand-dark/40 rounded-lg p-4">
                <p className="text-brand-text leading-relaxed">{memory.content}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-brand-muted">
                  <span>{memory.author?.displayName || 'Anonymous'}</span>
                  <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
