import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const CONTACT_PREFERENCES = [
  { value: 'anyone', label: 'Anyone' },
  { value: 'connections', label: 'Connections only' },
  { value: 'nobody', label: 'Nobody' },
];

export default function Settings() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showOnlineStatus, setShowOnlineStatus] = useState(user?.showOnlineStatus ?? true);
  const [allowCaregiverView, setAllowCaregiverView] = useState(user?.allowCaregiverView ?? false);
  const [contactPreference, setContactPreference] = useState(user?.contactPreference ?? 'anyone');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) return null;

  async function handleToggle(field: string, value: boolean) {
    setSaving(true);
    setMessage('');
    try {
      await api('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ [field]: value }),
      });
      if (field === 'showOnlineStatus') setShowOnlineStatus(value);
      if (field === 'allowCaregiverView') setAllowCaregiverView(value);
      await refreshUser();
      setMessage('Setting updated.');
    } catch (err: any) {
      setMessage(err.message || 'Failed to update setting');
    } finally {
      setSaving(false);
    }
  }

  async function handleContactPreferenceChange(value: string) {
    setContactPreference(value);
    setSaving(true);
    setMessage('');
    try {
      await api('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ contactPreference: value }),
      });
      await refreshUser();
      setMessage('Contact preference updated.');
    } catch (err: any) {
      setMessage(err.message || 'Failed to update preference');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) return;
    setDeleting(true);
    setMessage('');
    try {
      await api('/users/me', { method: 'DELETE' });
      logout();
      navigate('/');
    } catch (err: any) {
      setMessage(err.message || 'Failed to delete account');
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-amber">Settings</h1>

      {message && (
        <p className="text-sm text-brand-muted">{message}</p>
      )}

      {/* Navigation Links */}
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-brand-text">Account</h2>
        <div className="space-y-2">
          <Link
            to="/settings/memorial"
            className="block p-3 rounded-lg bg-brand-dark/40 hover:bg-brand-dark/60 transition-colors text-brand-text"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Memorial Preferences</p>
                <p className="text-sm text-brand-muted">What happens to your profile when you're no longer here</p>
              </div>
              <span className="text-brand-muted">&rarr;</span>
            </div>
          </Link>

          <Link
            to="/settings/safety"
            className="block p-3 rounded-lg bg-brand-dark/40 hover:bg-brand-dark/60 transition-colors text-brand-text"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Safety</p>
                <p className="text-sm text-brand-muted">Reports, blocks, and safety tools</p>
              </div>
              <span className="text-brand-muted">&rarr;</span>
            </div>
          </Link>

          <Link
            to="/verify"
            className="block p-3 rounded-lg bg-brand-dark/40 hover:bg-brand-dark/60 transition-colors text-brand-text"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Verify Identity</p>
                <p className="text-sm text-brand-muted">
                  Status: <span className="capitalize">{user.verificationStatus}</span>
                </p>
              </div>
              <span className="text-brand-muted">&rarr;</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Toggles */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-brand-text">Privacy</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-brand-text">Show Online Status</p>
            <p className="text-sm text-brand-muted">Let others see when you're active</p>
          </div>
          <button
            onClick={() => handleToggle('showOnlineStatus', !showOnlineStatus)}
            disabled={saving}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              showOnlineStatus ? 'bg-brand-amber' : 'bg-brand-mid/60'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                showOnlineStatus ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-brand-text">Allow Caregiver View</p>
            <p className="text-sm text-brand-muted">Let a caregiver access your profile</p>
          </div>
          <button
            onClick={() => handleToggle('allowCaregiverView', !allowCaregiverView)}
            disabled={saving}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              allowCaregiverView ? 'bg-brand-amber' : 'bg-brand-mid/60'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                allowCaregiverView ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Contact Preference */}
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-brand-text">Contact Preference</h2>
        <p className="text-sm text-brand-muted">Who can start a conversation with you</p>
        <select
          className="input-field"
          value={contactPreference}
          onChange={(e) => handleContactPreferenceChange(e.target.value)}
          disabled={saving}
        >
          {CONTACT_PREFERENCES.map((cp) => (
            <option key={cp.value} value={cp.value}>
              {cp.label}
            </option>
          ))}
        </select>
      </div>

      {/* Danger Zone */}
      <div className="card border-brand-coral/30 space-y-3">
        <h2 className="text-lg font-semibold text-brand-coral">Danger Zone</h2>
        <p className="text-sm text-brand-muted">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="btn-ghost text-brand-coral border-brand-coral/30 hover:border-brand-coral hover:text-brand-coral"
        >
          {deleting ? 'Deleting...' : 'Delete My Account'}
        </button>
      </div>
    </div>
  );
}
