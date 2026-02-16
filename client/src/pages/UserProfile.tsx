import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reporting, setReporting] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api<User>(`/users/${id}`);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id]);

  async function handleReport() {
    if (!id) return;
    setReporting(true);
    setActionMsg('');
    try {
      await api('/reports', {
        method: 'POST',
        body: JSON.stringify({ reportedUserId: id, reason: 'other', details: '' }),
      });
      setActionMsg('Report submitted. Thank you.');
    } catch (err: any) {
      setActionMsg(err.message || 'Failed to submit report');
    } finally {
      setReporting(false);
    }
  }

  async function handleBlock() {
    if (!id) return;
    if (!confirm('Are you sure you want to block this user? They will not be able to contact you.')) return;
    setBlocking(true);
    setActionMsg('');
    try {
      await api(`/connections/${id}/block`, { method: 'POST' });
      setActionMsg('User blocked.');
    } catch (err: any) {
      setActionMsg(err.message || 'Failed to block user');
    } finally {
      setBlocking(false);
    }
  }

  if (loading) {
    return <p className="text-brand-muted text-center py-12">Loading profile...</p>;
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-coral mb-4">{error || 'Profile not found'}</p>
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm">
          Go Back
        </button>
      </div>
    );
  }

  const filledPrompts = PROMPT_KEYS.filter((k) => profile[k]);
  const location = [profile.locationCity, profile.locationCountry].filter(Boolean).join(', ');

  return (
    <div className="space-y-6">
      {/* Memorial Banner */}
      {profile.isMemorial && (
        <div className="bg-brand-lavender/20 border border-brand-lavender/40 rounded-xl p-4 text-center">
          <p className="text-brand-lavender font-medium mb-2">
            This person is no longer with us. Their profile has been preserved as a memorial.
          </p>
          <Link
            to={`/profile/${id}/memorial`}
            className="text-brand-amber hover:underline text-sm font-medium"
          >
            Visit Memorial Page
          </Link>
        </div>
      )}

      {/* Profile Card */}
      <div className="card space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-mid/50 flex items-center justify-center text-xl font-bold text-brand-amber">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-text flex items-center gap-2">
              {profile.displayName}
              {profile.verificationStatus === 'verified' && (
                <span className="text-brand-teal text-sm" title="Verified">
                  &#10003;
                </span>
              )}
            </h1>
            {location && <p className="text-sm text-brand-muted">{location}</p>}
          </div>
        </div>

        {profile.conditionSummary && (
          <div>
            <span className="text-sm text-brand-muted">Condition:</span>
            <p className="text-brand-text mt-1">{profile.conditionSummary}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-brand-muted">Energy Level:</span>{' '}
            <span className="text-brand-text capitalize">{profile.energyLevel}</span>
          </div>
          {profile.mobilityNotes && (
            <div>
              <span className="text-brand-muted">Mobility:</span>{' '}
              <span className="text-brand-text">{profile.mobilityNotes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Prompts */}
      {filledPrompts.length > 0 && (
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-brand-amber">Profile Prompts</h3>
          {filledPrompts.map((key) => (
            <div key={key}>
              <p className="text-sm text-brand-muted">{PROMPT_LABELS[key]}</p>
              <p className="text-brand-text mt-1">{profile[key] as string}</p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {currentUser && currentUser.id !== id && (
        <div className="card space-y-3">
          {actionMsg && (
            <p className="text-sm text-brand-muted">{actionMsg}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleReport}
              disabled={reporting}
              className="btn-ghost text-sm text-brand-coral border-brand-coral/30 hover:border-brand-coral hover:text-brand-coral"
            >
              {reporting ? 'Reporting...' : 'Report'}
            </button>
            <button
              onClick={handleBlock}
              disabled={blocking}
              className="btn-ghost text-sm text-brand-coral border-brand-coral/30 hover:border-brand-coral hover:text-brand-coral"
            >
              {blocking ? 'Blocking...' : 'Block'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
