import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

type MemorialPreference = 'memorial' | 'disappear' | 'undecided';

export default function MemorialSettings() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [preference, setPreference] = useState<MemorialPreference>('undecided');
  const [memorialMessage, setMemorialMessage] = useState('');
  const [designatedName, setDesignatedName] = useState('');
  const [designatedContact, setDesignatedContact] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setPreference((user.memorialPreference as MemorialPreference) || 'undecided');
      setMemorialMessage(user.memorialMessage || '');
    }
    // Load designated person if API returns it
    async function loadPreferences() {
      try {
        const data = await api<any>('/users/me/memorial-preferences');
        if (data.designatedName) setDesignatedName(data.designatedName);
        if (data.designatedContact) setDesignatedContact(data.designatedContact);
        if (data.memorialPreference) setPreference(data.memorialPreference);
        if (data.memorialMessage) setMemorialMessage(data.memorialMessage);
      } catch {
        // Use user data as fallback
      }
    }
    loadPreferences();
  }, [user]);

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      await api('/users/me/memorial-preferences', {
        method: 'PATCH',
        body: JSON.stringify({
          memorialPreference: preference,
          memorialMessage,
          designatedName,
          designatedContact,
        }),
      });
      await refreshUser();
      setMessage('Memorial preferences saved.');
    } catch (err: any) {
      setMessage(err.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/settings')} className="text-brand-muted hover:text-brand-text">
          &larr;
        </button>
        <h1 className="text-2xl font-bold text-brand-amber">Memorial Preferences</h1>
      </div>

      <div className="card space-y-4">
        <p className="text-brand-muted leading-relaxed">
          This is about what happens to your profile when you're no longer here. You can change this anytime.
        </p>

        {/* Preference Radio */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-brand-text mb-2">
            When I'm gone, I want my profile to:
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-brand-dark/40 cursor-pointer hover:bg-brand-dark/60 transition-colors">
            <input
              type="radio"
              name="memorial"
              value="memorial"
              checked={preference === 'memorial'}
              onChange={() => setPreference('memorial')}
              className="mt-1 accent-brand-amber"
            />
            <div>
              <p className="text-brand-text font-medium">Become a memorial</p>
              <p className="text-sm text-brand-muted">
                Your profile will be preserved as a memorial page where people can leave memories.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-brand-dark/40 cursor-pointer hover:bg-brand-dark/60 transition-colors">
            <input
              type="radio"
              name="memorial"
              value="disappear"
              checked={preference === 'disappear'}
              onChange={() => setPreference('disappear')}
              className="mt-1 accent-brand-amber"
            />
            <div>
              <p className="text-brand-text font-medium">Disappear</p>
              <p className="text-sm text-brand-muted">
                Your profile and all associated data will be quietly removed.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-brand-dark/40 cursor-pointer hover:bg-brand-dark/60 transition-colors">
            <input
              type="radio"
              name="memorial"
              value="undecided"
              checked={preference === 'undecided'}
              onChange={() => setPreference('undecided')}
              className="mt-1 accent-brand-amber"
            />
            <div>
              <p className="text-brand-text font-medium">I haven't decided yet</p>
              <p className="text-sm text-brand-muted">
                You can come back and set this anytime. No pressure.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Memorial Message */}
      {preference === 'memorial' && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-brand-text">Memorial Message</h2>
          <p className="text-sm text-brand-muted">
            This message will be displayed on your memorial page. Say whatever you'd like.
          </p>
          <textarea
            className="input-field"
            rows={4}
            placeholder="Write something for people to remember you by..."
            value={memorialMessage}
            onChange={(e) => setMemorialMessage(e.target.value)}
          />
        </div>
      )}

      {/* Designated Person */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-brand-text">Designated Person</h2>
        <p className="text-sm text-brand-muted">
          Someone we can contact to verify and carry out your wishes. This is optional but recommended.
        </p>

        <div>
          <label className="block text-sm text-brand-muted mb-1">Name</label>
          <input
            className="input-field"
            placeholder="Their full name"
            value={designatedName}
            onChange={(e) => setDesignatedName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-brand-muted mb-1">Contact (email or phone)</label>
          <input
            className="input-field"
            placeholder="How we can reach them"
            value={designatedContact}
            onChange={(e) => setDesignatedContact(e.target.value)}
          />
        </div>
      </div>

      {/* Save */}
      {message && (
        <p className={`text-sm ${message.includes('Failed') ? 'text-brand-coral' : 'text-brand-teal'}`}>
          {message}
        </p>
      )}

      <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}
