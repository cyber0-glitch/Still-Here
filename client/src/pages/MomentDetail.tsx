import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import type { MomentRequest, MomentResponse } from '../types';
import { MOMENT_CATEGORIES } from '../types';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-brand-amber', 'bg-brand-teal', 'bg-brand-coral',
    'bg-brand-lavender', 'bg-brand-mid',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getCategoryLabel(value: string): string {
  return MOMENT_CATEGORIES.find((c) => c.value === value)?.label || value;
}

export default function MomentDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [moment, setMoment] = useState<MomentRequest | null>(null);
  const [responses, setResponses] = useState<MomentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responding, setResponding] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isOwner = moment?.userId === user?.id;

  const fetchMoment = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await api<MomentRequest>(`/moments/${id}`);
      setMoment(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load moment.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchResponses = useCallback(async () => {
    if (!id || !isOwner) return;
    try {
      const data = await api<MomentResponse[]>(`/moments/${id}/responses`);
      setResponses(data);
    } catch {
      // Silently fail for responses
    }
  }, [id, isOwner]);

  useEffect(() => {
    fetchMoment();
  }, [fetchMoment]);

  useEffect(() => {
    if (isOwner) {
      fetchResponses();
    }
  }, [isOwner, fetchResponses]);

  const handleRespond = async () => {
    if (!id) return;
    setResponding(true);
    try {
      await api(`/moments/${id}/respond`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      setHasResponded(true);
    } catch (err: any) {
      alert(err.message || 'Could not respond to this moment.');
    } finally {
      setResponding(false);
    }
  };

  const handleResponseAction = async (responseId: string, status: 'accepted' | 'declined') => {
    if (!id) return;
    setUpdatingId(responseId);
    try {
      await api(`/moments/${id}/responses/${responseId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await fetchResponses();
    } catch (err: any) {
      alert(err.message || 'Failed to update response.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-brand-muted">Loading moment...</p>
      </div>
    );
  }

  if (error || !moment) {
    return (
      <div className="text-center py-16">
        <p className="text-brand-coral mb-4">{error || 'Moment not found.'}</p>
        <Link to="/feed" className="btn-ghost">
          Back to feed
        </Link>
      </div>
    );
  }

  const displayName = moment.user?.displayName || 'Someone';
  const initials = getInitials(displayName);
  const colorClass = getAvatarColor(displayName);
  const isVerified = moment.user?.verificationStatus === 'verified';

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/feed" className="text-brand-muted text-sm hover:text-brand-text mb-6 inline-block">
        &larr; Back to feed
      </Link>

      <div className="card">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          {moment.user?.avatarUrl ? (
            <img
              src={moment.user.avatarUrl}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-brand-dark ${colorClass}`}
            >
              {initials}
            </div>
          )}
          <div>
            <span className="text-brand-text font-medium">{displayName}</span>
            {isVerified && (
              <span className="ml-1.5 text-xs text-brand-teal">Verified</span>
            )}
            <p className="text-xs text-brand-muted">
              Posted {new Date(moment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-brand-text mb-3">{moment.title}</h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="category-tag">{getCategoryLabel(moment.category)}</span>
          {moment.energyLevelNeeded && (
            <span className="category-tag capitalize">{moment.energyLevelNeeded} energy</span>
          )}
          <span className="category-tag capitalize">{moment.locationType}</span>
        </div>

        {/* Description */}
        {moment.description && (
          <p className="text-brand-muted leading-relaxed mb-4">{moment.description}</p>
        )}

        {/* Details */}
        <div className="space-y-2 text-sm text-brand-muted mb-6">
          {moment.locationName && (
            <p>Location: <span className="text-brand-text">{moment.locationName}</span></p>
          )}
          {moment.preferredDate && (
            <p>Date: <span className="text-brand-text">{new Date(moment.preferredDate).toLocaleDateString()}</span></p>
          )}
          {moment.preferredTime && (
            <p>Time: <span className="text-brand-text">{moment.preferredTime}</span></p>
          )}
          <p>Max participants: <span className="text-brand-text">{moment.maxParticipants}</span></p>
          {moment._count && (
            <p>Responses: <span className="text-brand-text">{moment._count.responses}</span></p>
          )}
        </div>

        {/* Respond button (non-owner) */}
        {!isOwner && (
          <div>
            {hasResponded ? (
              <div className="bg-brand-teal/10 border border-brand-teal/30 text-brand-teal rounded-lg px-4 py-3 text-sm">
                You've responded to this moment. The creator will be in touch.
              </div>
            ) : (
              <button
                onClick={handleRespond}
                disabled={responding}
                className="btn-primary w-full"
              >
                {responding ? 'Sending...' : "I'm in"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Responses section (owner only) */}
      {isOwner && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-brand-text mb-4">
            Responses ({responses.length})
          </h2>

          {responses.length === 0 ? (
            <p className="text-brand-muted text-sm">No responses yet. Give it time.</p>
          ) : (
            <div className="space-y-3">
              {responses.map((resp) => {
                const respName = resp.responder?.displayName || 'Someone';
                const respInitials = getInitials(respName);
                const respColor = getAvatarColor(respName);
                const respVerified = resp.responder?.verificationStatus === 'verified';

                return (
                  <div key={resp.id} className="card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {resp.responder?.avatarUrl ? (
                        <img
                          src={resp.responder.avatarUrl}
                          alt={respName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-brand-dark ${respColor}`}
                        >
                          {respInitials}
                        </div>
                      )}
                      <div>
                        <span className="text-brand-text font-medium text-sm">
                          {respName}
                        </span>
                        {respVerified && (
                          <span className="ml-1.5 text-xs text-brand-teal">Verified</span>
                        )}
                        <p className="text-xs text-brand-muted">
                          {resp.status === 'pending'
                            ? 'Waiting for your response'
                            : resp.status === 'accepted'
                            ? 'Accepted'
                            : 'Declined'}
                        </p>
                        {resp.message && (
                          <p className="text-xs text-brand-muted mt-1 italic">
                            "{resp.message}"
                          </p>
                        )}
                      </div>
                    </div>

                    {resp.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResponseAction(resp.id, 'accepted')}
                          disabled={updatingId === resp.id}
                          className="btn-primary text-xs py-1.5 px-3"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleResponseAction(resp.id, 'declined')}
                          disabled={updatingId === resp.id}
                          className="btn-ghost text-xs py-1.5 px-3"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {resp.status === 'accepted' && (
                      <span className="text-xs text-brand-teal font-medium">Accepted</span>
                    )}

                    {resp.status === 'declined' && (
                      <span className="text-xs text-brand-muted font-medium">Declined</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
