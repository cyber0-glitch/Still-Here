import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

interface VerificationStatus {
  verificationStatus: string;
  idVerified: boolean;
  communityVerified: boolean;
}

export default function Verify() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [communityCode, setCommunityCode] = useState('');
  const [submittingCode, setSubmittingCode] = useState(false);
  const [submittingId, setSubmittingId] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchStatus() {
      try {
        const data = await api<VerificationStatus>('/verify/status');
        setStatus(data);
      } catch {
        // Use user data as fallback
        if (user) {
          setStatus({
            verificationStatus: user.verificationStatus,
            idVerified: false,
            communityVerified: false,
          });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [user]);

  async function handleIdVerification() {
    setSubmittingId(true);
    setMessage('');
    try {
      await api('/verify/id', { method: 'POST' });
      setMessage('ID verification submitted. We will review your request.');
      const data = await api<VerificationStatus>('/verify/status');
      setStatus(data);
      await refreshUser();
    } catch (err: any) {
      setMessage(err.message || 'Failed to submit ID verification');
    } finally {
      setSubmittingId(false);
    }
  }

  async function handleCommunityCode(e: React.FormEvent) {
    e.preventDefault();
    if (!communityCode.trim()) return;
    setSubmittingCode(true);
    setMessage('');
    try {
      await api('/verify/community-code', {
        method: 'POST',
        body: JSON.stringify({ code: communityCode.trim() }),
      });
      setMessage('Community code verified successfully!');
      setCommunityCode('');
      const data = await api<VerificationStatus>('/verify/status');
      setStatus(data);
      await refreshUser();
    } catch (err: any) {
      setMessage(err.message || 'Invalid community code');
    } finally {
      setSubmittingCode(false);
    }
  }

  if (!user) return null;

  const statusColor =
    user.verificationStatus === 'verified'
      ? 'text-brand-teal'
      : user.verificationStatus === 'pending'
      ? 'text-brand-amber'
      : 'text-brand-muted';

  const statusLabel =
    user.verificationStatus === 'verified'
      ? 'Verified'
      : user.verificationStatus === 'pending'
      ? 'Pending Review'
      : 'Not Verified';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/settings')} className="text-brand-muted hover:text-brand-text">
          &larr;
        </button>
        <h1 className="text-2xl font-bold text-brand-amber">Verify Identity</h1>
      </div>

      {/* Current Status */}
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-brand-text">Current Status</h2>
        {loading ? (
          <p className="text-brand-muted text-sm">Loading...</p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-brand-muted">Overall:</span>
              <span className={`font-medium ${statusColor}`}>{statusLabel}</span>
            </div>
            {status && (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-brand-muted">ID Verification:</span>
                  <span className={status.idVerified ? 'text-brand-teal' : 'text-brand-muted'}>
                    {status.idVerified ? 'Verified' : 'Not verified'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-brand-muted">Community Code:</span>
                  <span className={status.communityVerified ? 'text-brand-teal' : 'text-brand-muted'}>
                    {status.communityVerified ? 'Verified' : 'Not verified'}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ID Verification */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-brand-text">ID Verification</h2>
        <p className="text-sm text-brand-muted">
          Verify your identity with a government-issued ID. This helps build trust within the community.
        </p>
        {status?.idVerified ? (
          <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-lg p-3">
            <p className="text-brand-teal text-sm font-medium">Your ID has been verified.</p>
          </div>
        ) : (
          <button
            onClick={handleIdVerification}
            disabled={submittingId}
            className="btn-primary"
          >
            {submittingId ? 'Submitting...' : 'Start ID Verification'}
          </button>
        )}
      </div>

      {/* Community Code */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-brand-text">Community Code</h2>
        <p className="text-sm text-brand-muted">
          If you received a community code from a healthcare provider or partner organization, enter it here.
        </p>
        {status?.communityVerified ? (
          <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-lg p-3">
            <p className="text-brand-teal text-sm font-medium">Community code verified.</p>
          </div>
        ) : (
          <form onSubmit={handleCommunityCode} className="space-y-3">
            <input
              className="input-field"
              placeholder="Enter community code"
              value={communityCode}
              onChange={(e) => setCommunityCode(e.target.value)}
              required
            />
            <button type="submit" disabled={submittingCode} className="btn-primary">
              {submittingCode ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}
      </div>

      {/* Message */}
      {message && (
        <p className={`text-sm ${message.includes('Failed') || message.includes('Invalid') ? 'text-brand-coral' : 'text-brand-teal'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
