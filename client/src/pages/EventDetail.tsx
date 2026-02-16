import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import type { GroupEvent } from '../types';

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}m`;
}

function energyBadgeColor(level: string): string {
  switch (level) {
    case 'low':
      return 'bg-brand-teal/20 text-brand-teal';
    case 'moderate':
      return 'bg-brand-amber/20 text-brand-amber';
    case 'high':
      return 'bg-brand-coral/20 text-brand-coral';
    default:
      return 'bg-brand-mid/30 text-brand-muted';
  }
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<GroupEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await api<GroupEvent>(`/events/${id}`);
        setEvent(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const handleAttend = async (status: 'going' | 'maybe') => {
    setActionLoading(status);
    try {
      await api(`/events/${id}/attend`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      // Refresh event data
      const updated = await api<GroupEvent>(`/events/${id}`);
      setEvent(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to update attendance');
    } finally {
      setActionLoading('');
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this event?')) return;
    setActionLoading('cancel');
    try {
      await api(`/events/${id}`, { method: 'DELETE' });
      navigate('/events');
    } catch (err: any) {
      setError(err.message || 'Failed to cancel event');
      setActionLoading('');
    }
  };

  const isOrganizer = user?.id === event?.organizerId;

  const currentUserAttendance = event?.attendees?.find(
    (a) => a.userId === user?.id
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-brand-muted">Loading event...</p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-brand-coral">{error}</p>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/events"
        className="text-brand-muted hover:text-brand-text text-sm transition-colors"
      >
        &larr; Back to Events
      </Link>

      {/* Event header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-text">{event.title}</h1>
            {event.status !== 'active' && (
              <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full bg-brand-coral/20 text-brand-coral capitalize">
                {event.status}
              </span>
            )}
          </div>
          <span className="category-tag text-sm">{event.category}</span>
        </div>

        {event.description && (
          <p className="text-brand-text/80 mt-4 whitespace-pre-wrap leading-relaxed">
            {event.description}
          </p>
        )}
      </div>

      {/* Event details */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-brand-text">Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date & time */}
          <div>
            <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
              Date
            </p>
            <p className="text-brand-text">{formatFullDate(event.eventDate)}</p>
            <p className="text-brand-amber text-sm">{formatTime(event.eventDate)}</p>
          </div>

          {/* Duration */}
          {event.durationMinutes && (
            <div>
              <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                Duration
              </p>
              <p className="text-brand-text">
                {formatDuration(event.durationMinutes)}
              </p>
            </div>
          )}

          {/* Location */}
          <div>
            <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
              Location
            </p>
            {event.isVirtual ? (
              <div>
                <p className="text-brand-teal">Virtual</p>
                {event.virtualLink && (
                  <a
                    href={event.virtualLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-amber hover:underline break-all"
                  >
                    Join link
                  </a>
                )}
              </div>
            ) : (
              <div>
                {event.locationName && (
                  <p className="text-brand-text">{event.locationName}</p>
                )}
                {event.locationAddress && (
                  <p className="text-sm text-brand-muted">{event.locationAddress}</p>
                )}
              </div>
            )}
          </div>

          {/* Energy level */}
          {event.energyLevel && (
            <div>
              <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                Energy Level
              </p>
              <span
                className={`inline-block text-sm px-3 py-1 rounded-full ${energyBadgeColor(
                  event.energyLevel
                )}`}
              >
                {event.energyLevel}
              </span>
            </div>
          )}

          {/* Max attendees */}
          {event.maxAttendees && (
            <div>
              <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                Capacity
              </p>
              <p className="text-brand-text">
                {event._count?.attendees ?? 0} / {event.maxAttendees}
              </p>
            </div>
          )}

          {/* Organizer */}
          {event.organizer && (
            <div>
              <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                Organizer
              </p>
              <p className="text-brand-text">{event.organizer.displayName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Accessibility notes */}
      {event.accessibilityNotes && (
        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-2">
            Accessibility Notes
          </h2>
          <p className="text-brand-text/80 whitespace-pre-wrap">
            {event.accessibilityNotes}
          </p>
        </div>
      )}

      {/* Attendees */}
      <div className="card">
        <h2 className="text-lg font-semibold text-brand-text mb-4">
          Attendees ({event.attendees?.length ?? 0})
        </h2>

        {event.attendees && event.attendees.length > 0 ? (
          <div className="space-y-3">
            {event.attendees.map((attendee) => (
              <div
                key={attendee.userId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-mid flex items-center justify-center text-brand-text text-xs font-semibold">
                    {attendee.user.avatarUrl ? (
                      <img
                        src={attendee.user.avatarUrl}
                        alt={attendee.user.displayName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      attendee.user.displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <Link
                    to={`/profile/${attendee.user.id}`}
                    className="text-sm text-brand-text hover:text-brand-amber transition-colors"
                  >
                    {attendee.user.displayName}
                  </Link>
                </div>
                <span className="text-xs text-brand-muted capitalize">
                  {attendee.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-muted text-sm">No attendees yet.</p>
        )}
      </div>

      {/* Actions */}
      {event.status === 'active' && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleAttend('going')}
            disabled={actionLoading !== ''}
            className={`btn-primary ${
              currentUserAttendance?.status === 'going'
                ? 'ring-2 ring-brand-amber ring-offset-2 ring-offset-brand-dark'
                : ''
            }`}
          >
            {actionLoading === 'going'
              ? 'Updating...'
              : currentUserAttendance?.status === 'going'
              ? "I'm Going"
              : "I'm Going"}
          </button>

          <button
            onClick={() => handleAttend('maybe')}
            disabled={actionLoading !== ''}
            className={`btn-ghost ${
              currentUserAttendance?.status === 'maybe'
                ? 'ring-2 ring-brand-muted ring-offset-2 ring-offset-brand-dark'
                : ''
            }`}
          >
            {actionLoading === 'maybe' ? 'Updating...' : 'Maybe'}
          </button>

          {isOrganizer && (
            <button
              onClick={handleCancel}
              disabled={actionLoading !== ''}
              className="btn-ghost text-brand-coral border-brand-coral/30 hover:border-brand-coral hover:text-brand-coral ml-auto"
            >
              {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel Event'}
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="text-brand-coral text-sm text-center">{error}</p>
      )}
    </div>
  );
}
