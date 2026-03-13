import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const REPORT_REASONS = [
  { value: 'scam', label: 'Scam or fraud' },
  { value: 'money_request', label: 'Requesting money' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'fake_profile', label: 'Fake profile' },
  { value: 'exploitation', label: 'Exploitation' },
  { value: 'other', label: 'Other' },
];

interface Report {
  id: string;
  reportedUserId: string;
  reason: string;
  details?: string | null;
  status: string;
  createdAt: string;
  reportedUser?: {
    displayName: string;
  };
}

export default function Safety() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Report form
  const [reportUserId, setReportUserId] = useState('');
  const [reportReason, setReportReason] = useState('scam');
  const [reportDetails, setReportDetails] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportMsg, setReportMsg] = useState('');

  // Block form
  const [blockUserId, setBlockUserId] = useState('');
  const [blockingUser, setBlockingUser] = useState(false);
  const [blockMsg, setBlockMsg] = useState('');

  // My reports
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await api<{ reports: Report[] }>('/reports/mine');
        setReports(data.reports);
      } catch {
        // silently fail
      } finally {
        setLoadingReports(false);
      }
    }
    fetchReports();
  }, []);

  async function handleSubmitReport(e: React.FormEvent) {
    e.preventDefault();
    if (!reportUserId.trim()) return;
    setSubmittingReport(true);
    setReportMsg('');
    try {
      await api('/reports', {
        method: 'POST',
        body: JSON.stringify({
          reportedUserId: reportUserId.trim(),
          reason: reportReason,
          details: reportDetails.trim() || undefined,
        }),
      });
      setReportMsg('Report submitted. Our team will review it.');
      setReportUserId('');
      setReportDetails('');
      // Refresh reports list
      const updated = await api<{ reports: Report[] }>('/reports/mine');
      setReports(updated.reports);
    } catch (err: any) {
      setReportMsg(err.message || 'Failed to submit report');
    } finally {
      setSubmittingReport(false);
    }
  }

  async function handleBlockUser(e: React.FormEvent) {
    e.preventDefault();
    if (!blockUserId.trim()) return;
    setBlockingUser(true);
    setBlockMsg('');
    try {
      await api(`/connections/${blockUserId.trim()}/block`, { method: 'POST' });
      setBlockMsg('User blocked successfully.');
      setBlockUserId('');
    } catch (err: any) {
      setBlockMsg(err.message || 'Failed to block user');
    } finally {
      setBlockingUser(false);
    }
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/settings')} className="text-brand-muted hover:text-brand-text">
          &larr;
        </button>
        <h1 className="text-2xl font-bold text-brand-amber">Safety</h1>
      </div>

      {/* Report Form */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-brand-text">Report a User</h2>
        <p className="text-sm text-brand-muted">
          If someone is behaving inappropriately, let us know. All reports are reviewed by our team.
        </p>
        <form onSubmit={handleSubmitReport} className="space-y-3">
          <div>
            <label className="block text-sm text-brand-muted mb-1">User ID</label>
            <input
              className="input-field"
              placeholder="Enter the user's ID"
              value={reportUserId}
              onChange={(e) => setReportUserId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-brand-muted mb-1">Reason</label>
            <select
              className="input-field"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-brand-muted mb-1">Details (optional)</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Provide any additional context..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
            />
          </div>

          {reportMsg && (
            <p className={`text-sm ${reportMsg.includes('Failed') ? 'text-brand-coral' : 'text-brand-teal'}`}>
              {reportMsg}
            </p>
          )}

          <button type="submit" disabled={submittingReport} className="btn-primary">
            {submittingReport ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>

      {/* Block Form */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-brand-text">Block a User</h2>
        <p className="text-sm text-brand-muted">
          Blocked users cannot contact you or see your profile.
        </p>
        <form onSubmit={handleBlockUser} className="space-y-3">
          <div>
            <label className="block text-sm text-brand-muted mb-1">User ID</label>
            <input
              className="input-field"
              placeholder="Enter the user's ID"
              value={blockUserId}
              onChange={(e) => setBlockUserId(e.target.value)}
              required
            />
          </div>

          {blockMsg && (
            <p className={`text-sm ${blockMsg.includes('Failed') ? 'text-brand-coral' : 'text-brand-teal'}`}>
              {blockMsg}
            </p>
          )}

          <button type="submit" disabled={blockingUser} className="btn-ghost">
            {blockingUser ? 'Blocking...' : 'Block User'}
          </button>
        </form>
      </div>

      {/* My Reports */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-brand-text">My Reports</h2>
        {loadingReports ? (
          <p className="text-brand-muted text-sm">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-brand-muted text-sm">You haven't filed any reports.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="bg-brand-dark/40 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-text text-sm font-medium capitalize">
                      {report.reason}
                    </p>
                    {report.reportedUser && (
                      <p className="text-xs text-brand-muted">
                        Reported: {report.reportedUser.displayName}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      report.status === 'resolved'
                        ? 'bg-brand-teal/20 text-brand-teal'
                        : report.status === 'dismissed'
                        ? 'bg-brand-muted/20 text-brand-muted'
                        : 'bg-brand-amber/20 text-brand-amber'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                {report.details && (
                  <p className="text-xs text-brand-muted mt-2">{report.details}</p>
                )}
                <p className="text-xs text-brand-muted mt-1">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
