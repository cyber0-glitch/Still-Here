import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import type { User, MomentRequest } from '../types';
import { ENERGY_LEVELS } from '../types';

const PROMPT_LABELS: Record<string, string> = {
  promptNoPatience: "I have no patience for...",
  promptWantCompany: "I want company for...",
  promptBodyCanHandle: "My body can handle...",
  promptDontTalkLike: "Don't talk to me like...",
  promptBeforeIGo: "Before I go, I want to...",
  promptFreeform: "In my own words...",
};

const PROMPT_KEYS = Object.keys(PROMPT_LABELS) as (keyof User)[];

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [moments, setMoments] = useState<MomentRequest[]>([]);
  const [loadingMoments, setLoadingMoments] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    displayName: '',
    age: '' as string | number,
    locationCity: '',
    locationCountry: '',
    conditionSummary: '',
    energyLevel: 'moderate',
    mobilityNotes: '',
    promptNoPatience: '',
    promptWantCompany: '',
    promptBodyCanHandle: '',
    promptDontTalkLike: '',
    promptBeforeIGo: '',
    promptFreeform: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName || '',
        age: user.age ?? '',
        locationCity: user.locationCity || '',
        locationCountry: user.locationCountry || '',
        conditionSummary: user.conditionSummary || '',
        energyLevel: user.energyLevel || 'moderate',
        mobilityNotes: user.mobilityNotes || '',
        promptNoPatience: user.promptNoPatience || '',
        promptWantCompany: user.promptWantCompany || '',
        promptBodyCanHandle: user.promptBodyCanHandle || '',
        promptDontTalkLike: user.promptDontTalkLike || '',
        promptBeforeIGo: user.promptBeforeIGo || '',
        promptFreeform: user.promptFreeform || '',
      });
    }
  }, [user]);

  useEffect(() => {
    async function fetchMoments() {
      try {
        const data = await api<MomentRequest[]>('/moments/mine');
        setMoments(data);
      } catch {
        // silently fail
      } finally {
        setLoadingMoments(false);
      }
    }
    fetchMoments();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      await api('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          ...form,
          age: form.age ? Number(form.age) : null,
        }),
      });
      await refreshUser();
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  const filledPrompts = PROMPT_KEYS.filter((k) => user[k]);
  const verificationLabel =
    user.verificationStatus === 'verified'
      ? 'Verified'
      : user.verificationStatus === 'pending'
      ? 'Pending verification'
      : 'Not verified';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-amber">My Profile</h1>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-ghost text-sm">
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="card space-y-4">
        {editing ? (
          <>
            {error && <p className="text-brand-coral text-sm">{error}</p>}

            <div>
              <label className="block text-sm text-brand-muted mb-1">Display Name</label>
              <input
                className="input-field"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-brand-muted mb-1">Age</label>
                <input
                  className="input-field"
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-brand-muted mb-1">Energy Level</label>
                <select
                  className="input-field"
                  value={form.energyLevel}
                  onChange={(e) => setForm({ ...form, energyLevel: e.target.value })}
                >
                  {ENERGY_LEVELS.map((el) => (
                    <option key={el.value} value={el.value}>
                      {el.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-brand-muted mb-1">City</label>
                <input
                  className="input-field"
                  value={form.locationCity}
                  onChange={(e) => setForm({ ...form, locationCity: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-brand-muted mb-1">Country</label>
                <input
                  className="input-field"
                  value={form.locationCountry}
                  onChange={(e) => setForm({ ...form, locationCountry: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brand-muted mb-1">Condition Summary</label>
              <textarea
                className="input-field"
                rows={2}
                value={form.conditionSummary}
                onChange={(e) => setForm({ ...form, conditionSummary: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-brand-muted mb-1">Mobility Notes</label>
              <textarea
                className="input-field"
                rows={2}
                value={form.mobilityNotes}
                onChange={(e) => setForm({ ...form, mobilityNotes: e.target.value })}
              />
            </div>

            <hr className="border-brand-mid/30" />
            <h3 className="text-lg font-semibold text-brand-text">Profile Prompts</h3>

            {PROMPT_KEYS.map((key) => (
              <div key={key}>
                <label className="block text-sm text-brand-muted mb-1">
                  {PROMPT_LABELS[key]}
                </label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={(form as any)[key] || ''}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Display mode */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-mid/50 flex items-center justify-center text-xl font-bold text-brand-amber">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                  {user.displayName}
                  {user.verificationStatus === 'verified' && (
                    <span className="text-brand-teal text-sm" title="Verified">
                      &#10003;
                    </span>
                  )}
                </h2>
                <p className="text-sm text-brand-muted">{verificationLabel}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {user.age && (
                <div>
                  <span className="text-brand-muted">Age:</span>{' '}
                  <span className="text-brand-text">{user.age}</span>
                </div>
              )}
              {(user.locationCity || user.locationCountry) && (
                <div>
                  <span className="text-brand-muted">Location:</span>{' '}
                  <span className="text-brand-text">
                    {[user.locationCity, user.locationCountry].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              <div>
                <span className="text-brand-muted">Energy:</span>{' '}
                <span className="text-brand-text capitalize">{user.energyLevel}</span>
              </div>
              <div>
                <span className="text-brand-muted">Contact:</span>{' '}
                <span className="text-brand-text capitalize">{user.contactPreference}</span>
              </div>
            </div>

            {user.conditionSummary && (
              <div>
                <span className="text-sm text-brand-muted">Condition:</span>
                <p className="text-brand-text mt-1">{user.conditionSummary}</p>
              </div>
            )}

            {user.mobilityNotes && (
              <div>
                <span className="text-sm text-brand-muted">Mobility:</span>
                <p className="text-brand-text mt-1">{user.mobilityNotes}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Prompts (display mode only) */}
      {!editing && filledPrompts.length > 0 && (
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-brand-amber">Profile Prompts</h3>
          {filledPrompts.map((key) => (
            <div key={key}>
              <p className="text-sm text-brand-muted">{PROMPT_LABELS[key]}</p>
              <p className="text-brand-text mt-1">{user[key] as string}</p>
            </div>
          ))}
        </div>
      )}

      {/* My Moments */}
      <div className="card space-y-4">
        <h3 className="text-lg font-semibold text-brand-amber">My Moments</h3>
        {loadingMoments ? (
          <p className="text-brand-muted text-sm">Loading moments...</p>
        ) : moments.length === 0 ? (
          <p className="text-brand-muted text-sm">You haven't posted any moments yet.</p>
        ) : (
          <div className="space-y-3">
            {moments.map((moment) => (
              <Link
                key={moment.id}
                to={`/feed/${moment.id}`}
                className="block p-3 rounded-lg bg-brand-dark/40 hover:bg-brand-dark/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-brand-text">{moment.title}</h4>
                  <span className="category-tag">{moment.category}</span>
                </div>
                {moment.description && (
                  <p className="text-sm text-brand-muted mt-1 line-clamp-2">
                    {moment.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-brand-muted">
                  <span className="capitalize">{moment.status}</span>
                  {moment._count && <span>{moment._count.responses} responses</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Link to settings */}
      <div className="flex gap-3">
        <Link to="/settings" className="btn-ghost text-sm">
          Account Settings
        </Link>
        <Link to="/connections" className="btn-ghost text-sm">
          My Connections
        </Link>
      </div>
    </div>
  );
}
