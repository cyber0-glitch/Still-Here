import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import type { GroupEvent } from '../types';
import { MOMENT_CATEGORIES, ENERGY_LEVELS } from '../types';

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (isToday) return `Today at ${time}`;
  if (isTomorrow) return `Tomorrow at ${time}`;

  return `${date.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })} at ${time}`;
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

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterEnergy, setFilterEnergy] = useState('');
  const [filterVirtual, setFilterVirtual] = useState<'' | 'virtual' | 'in-person'>('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await api<GroupEvent[]>('/events');
        setEvents(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (filterCategory && event.category !== filterCategory) return false;
    if (filterEnergy && event.energyLevel !== filterEnergy) return false;
    if (filterVirtual === 'virtual' && !event.isVirtual) return false;
    if (filterVirtual === 'in-person' && event.isVirtual) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-brand-muted">Loading events...</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-text">Events</h1>
        <Link to="/events/new" className="btn-primary text-sm">
          Create Event
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-field w-auto text-sm"
        >
          <option value="">All Categories</option>
          {MOMENT_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <select
          value={filterEnergy}
          onChange={(e) => setFilterEnergy(e.target.value)}
          className="input-field w-auto text-sm"
        >
          <option value="">Any Energy</option>
          {ENERGY_LEVELS.map((lvl) => (
            <option key={lvl.value} value={lvl.value}>
              {lvl.label}
            </option>
          ))}
        </select>

        <select
          value={filterVirtual}
          onChange={(e) =>
            setFilterVirtual(e.target.value as '' | 'virtual' | 'in-person')
          }
          className="input-field w-auto text-sm"
        >
          <option value="">Virtual & In-Person</option>
          <option value="virtual">Virtual Only</option>
          <option value="in-person">In-Person Only</option>
        </select>
      </div>

      {/* Event list */}
      {filteredEvents.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-brand-muted text-lg">No events yet.</p>
          <p className="text-brand-muted mt-2">
            Start one if you have the energy.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="card block hover:border-brand-amber/40 transition-colors duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold text-brand-text">
                      {event.title}
                    </h2>
                    {event.status !== 'active' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-brand-coral/20 text-brand-coral capitalize">
                        {event.status}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-brand-amber mt-1">
                    {formatEventDate(event.eventDate)}
                  </p>

                  <p className="text-sm text-brand-muted mt-1">
                    {event.isVirtual ? 'Virtual' : event.locationName || 'Location TBD'}
                  </p>

                  {event.organizer && (
                    <p className="text-xs text-brand-muted mt-2">
                      Organized by{' '}
                      <span className="text-brand-text">
                        {event.organizer.displayName}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {event.energyLevel && (
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${energyBadgeColor(
                        event.energyLevel
                      )}`}
                    >
                      {event.energyLevel} energy
                    </span>
                  )}
                  <span className="text-xs text-brand-muted">
                    {event._count?.attendees ?? 0}{' '}
                    {(event._count?.attendees ?? 0) === 1 ? 'attendee' : 'attendees'}
                  </span>
                  <span className="category-tag">{event.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
