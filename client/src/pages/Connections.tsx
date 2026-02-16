import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import type { ConnectionItem } from '../types';

export default function Connections() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchConnections() {
      try {
        const data = await api<ConnectionItem[]>('/connections');
        setConnections(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load connections');
      } finally {
        setLoading(false);
      }
    }
    fetchConnections();
  }, []);

  if (!user) return null;

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-amber">Connections</h1>

      {loading ? (
        <p className="text-brand-muted text-center py-12">Loading connections...</p>
      ) : error ? (
        <p className="text-brand-coral text-center py-12">{error}</p>
      ) : connections.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-brand-muted">No connections yet.</p>
          <p className="text-sm text-brand-muted mt-2">
            Respond to moments or attend events to connect with people.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((conn) => (
            <button
              key={conn.connectionId}
              onClick={() => navigate(`/profile/${conn.user.id}`)}
              className="card w-full text-left flex items-center gap-4 hover:bg-brand-navy/80 transition-colors cursor-pointer"
            >
              {/* Avatar / Initials */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  conn.user.isMemorial
                    ? 'bg-brand-lavender/30 text-brand-lavender'
                    : 'bg-brand-mid/50 text-brand-amber'
                }`}
              >
                {getInitials(conn.user.displayName)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-brand-text truncate">
                    {conn.user.displayName}
                  </h3>
                  {conn.user.verificationStatus === 'verified' && (
                    <span className="text-brand-teal text-xs flex-shrink-0" title="Verified">
                      &#10003;
                    </span>
                  )}
                  {conn.user.isMemorial && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full bg-brand-lavender/20 text-brand-lavender flex-shrink-0"
                      title="Memorial"
                    >
                      Memorial
                    </span>
                  )}
                </div>
                {conn.user.locationCity && (
                  <p className="text-sm text-brand-muted truncate">{conn.user.locationCity}</p>
                )}
              </div>

              {/* Arrow */}
              <span className="text-brand-muted text-sm flex-shrink-0">&rarr;</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
