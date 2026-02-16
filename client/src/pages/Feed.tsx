import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import type { MomentRequest } from '../types';
import { MOMENT_CATEGORIES, ENERGY_LEVELS } from '../types';

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

export default function Feed() {
  const [moments, setMoments] = useState<MomentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respondingId, setRespondingId] = useState<string | null>(null);

  // Filters
  const [category, setCategory] = useState('');
  const [energyLevel, setEnergyLevel] = useState('');
  const [locationType, setLocationType] = useState('');

  const fetchMoments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (energyLevel) params.set('energyLevel', energyLevel);
      if (locationType) params.set('locationType', locationType);
      const query = params.toString();
      const data = await api<MomentRequest[]>(`/moments${query ? `?${query}` : ''}`);
      setMoments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load moments.');
    } finally {
      setLoading(false);
    }
  }, [category, energyLevel, locationType]);

  useEffect(() => {
    fetchMoments();
  }, [fetchMoments]);

  const handleRespond = async (momentId: string) => {
    setRespondingId(momentId);
    try {
      await api(`/moments/${momentId}/respond`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      // Refresh to update counts
      await fetchMoments();
    } catch (err: any) {
      alert(err.message || 'Could not respond to this moment.');
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-text">Moments</h1>
        <Link to="/feed/new" className="btn-primary text-sm">
          What do you want to do?
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="input-field w-auto text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {MOMENT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          className="input-field w-auto text-sm"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(e.target.value)}
        >
          <option value="">All energy levels</option>
          {ENERGY_LEVELS.map((e) => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>

        <select
          className="input-field w-auto text-sm"
          value={locationType}
          onChange={(e) => setLocationType(e.target.value)}
        >
          <option value="">All locations</option>
          <option value="specific">Specific place</option>
          <option value="flexible">Flexible</option>
          <option value="virtual">Virtual</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-brand-coral/10 border border-brand-coral/30 text-brand-coral rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <p className="text-brand-muted">Loading moments...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && moments.length === 0 && (
        <div className="text-center py-16">
          <p className="text-brand-muted text-lg mb-2">
            No moments near you right now.
          </p>
          <p className="text-brand-muted mb-6">
            Be the first &mdash; post what you want to do.
          </p>
          <Link to="/feed/new" className="btn-primary">
            Create a moment
          </Link>
        </div>
      )}

      {/* Moment cards */}
      <div className="space-y-4">
        {moments.map((moment) => {
          const displayName = moment.user?.displayName || 'Someone';
          const initials = getInitials(displayName);
          const colorClass = getAvatarColor(displayName);
          const isVerified = moment.user?.verificationStatus === 'verified';

          return (
            <div key={moment.id} className="card">
              {/* Header row */}
              <div className="flex items-center gap-3 mb-3">
                {moment.user?.avatarUrl ? (
                  <img
                    src={moment.user.avatarUrl}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-brand-dark ${colorClass}`}
                  >
                    {initials}
                  </div>
                )}
                <div>
                  <span className="text-brand-text font-medium text-sm">
                    {displayName}
                  </span>
                  {isVerified && (
                    <span className="ml-1.5 text-xs text-brand-teal">Verified</span>
                  )}
                </div>
              </div>

              {/* Title */}
              <Link
                to={`/feed/${moment.id}`}
                className="block text-lg font-semibold text-brand-text hover:text-brand-amber transition-colors mb-2"
              >
                {moment.title}
              </Link>

              {/* Tags row */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="category-tag">{getCategoryLabel(moment.category)}</span>
                {moment.energyLevelNeeded && (
                  <span className="category-tag capitalize">
                    {moment.energyLevelNeeded} energy
                  </span>
                )}
              </div>

              {/* Description */}
              {moment.description && (
                <p className="text-brand-muted text-sm mb-3 leading-relaxed">
                  {moment.description}
                </p>
              )}

              {/* Location */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-brand-muted">
                  {moment.locationName && (
                    <span>{moment.locationName} &middot; </span>
                  )}
                  <span className="capitalize">{moment.locationType}</span>
                  {moment.preferredDate && (
                    <span> &middot; {new Date(moment.preferredDate).toLocaleDateString()}</span>
                  )}
                </div>

                <button
                  onClick={() => handleRespond(moment.id)}
                  disabled={respondingId === moment.id}
                  className="btn-primary text-sm py-1.5 px-4"
                >
                  {respondingId === moment.id ? 'Sending...' : "I'm in"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
