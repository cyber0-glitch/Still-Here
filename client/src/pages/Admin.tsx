import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

type Tab = 'reports' | 'users' | 'codes' | 'partners' | 'phrases' | 'analytics';

const TABS: { key: Tab; label: string }[] = [
  { key: 'reports', label: 'Reports' },
  { key: 'users', label: 'Users' },
  { key: 'codes', label: 'Community Codes' },
  { key: 'partners', label: 'Partners' },
  { key: 'phrases', label: 'Blocked Phrases' },
  { key: 'analytics', label: 'Analytics' },
];

// --- Sub-component types ---

interface AdminReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  details?: string | null;
  status: string;
  createdAt: string;
  reporter?: { displayName: string };
  reportedUser?: { displayName: string };
}

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
  isMemorial: boolean;
  isAdmin: boolean;
  verificationStatus: string;
  createdAt: string;
}

interface CommunityCode {
  id: string;
  code: string;
  partnerId?: string | null;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  createdAt: string;
  partner?: { name: string };
}

interface Partner {
  id: string;
  name: string;
  contactEmail: string;
  isActive: boolean;
  createdAt: string;
  _count?: { communityCodes: number };
}

interface BlockedPhrase {
  id: string;
  phrase: string;
  createdAt: string;
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  memorialUsers: number;
  totalMoments: number;
  totalConversations: number;
  totalEvents: number;
  totalReports: number;
  pendingReports: number;
  verifiedUsers: number;
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('reports');

  if (!user?.isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-coral mb-4">Access denied. Admin privileges required.</p>
        <button onClick={() => navigate('/feed')} className="btn-ghost text-sm">
          Go to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-amber">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-brand-amber text-brand-dark'
                : 'bg-brand-navy/60 text-brand-muted hover:text-brand-text border border-brand-mid/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'reports' && <ReportsTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'codes' && <CodesTab />}
      {activeTab === 'partners' && <PartnersTab />}
      {activeTab === 'phrases' && <PhrasesTab />}
      {activeTab === 'analytics' && <AnalyticsTab />}
    </div>
  );
}

// ========== Reports Tab ==========
function ReportsTab() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const data = await api<AdminReport[]>('/admin/reports');
      setReports(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(reportId: string, action: 'review' | 'dismiss') {
    setActionMsg('');
    try {
      await api(`/admin/reports/${reportId}/${action}`, { method: 'POST' });
      setActionMsg(`Report ${action === 'review' ? 'marked as reviewed' : 'dismissed'}.`);
      fetchReports();
    } catch (err: any) {
      setActionMsg(err.message || 'Action failed');
    }
  }

  if (loading) return <p className="text-brand-muted">Loading reports...</p>;

  return (
    <div className="space-y-4">
      {actionMsg && <p className="text-sm text-brand-teal">{actionMsg}</p>}
      {reports.length === 0 ? (
        <div className="card"><p className="text-brand-muted">No reports found.</p></div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="card space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-brand-text font-medium capitalize">{report.reason}</p>
                <p className="text-xs text-brand-muted">
                  By {report.reporter?.displayName || report.reporterId} &rarr;{' '}
                  {report.reportedUser?.displayName || report.reportedUserId}
                </p>
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
              <p className="text-sm text-brand-muted">{report.details}</p>
            )}
            <p className="text-xs text-brand-muted">
              {new Date(report.createdAt).toLocaleDateString()}
            </p>
            {report.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(report.id, 'review')}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  Review
                </button>
                <button
                  onClick={() => handleAction(report.id, 'dismiss')}
                  className="btn-ghost text-xs px-3 py-1.5"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ========== Users Tab ==========
function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers(query?: string) {
    setLoading(true);
    try {
      const params = query ? `?search=${encodeURIComponent(query)}` : '';
      const data = await api<AdminUser[]>(`/admin/users${params}`);
      setUsers(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchUsers(search);
  }

  async function handleToggleActive(userId: string, isActive: boolean) {
    setActionMsg('');
    try {
      const action = isActive ? 'suspend' : 'activate';
      await api(`/admin/users/${userId}/${action}`, { method: 'POST' });
      setActionMsg(`User ${isActive ? 'suspended' : 'activated'}.`);
      fetchUsers(search);
    } catch (err: any) {
      setActionMsg(err.message || 'Action failed');
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          className="input-field flex-1"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary text-sm">
          Search
        </button>
      </form>

      {actionMsg && <p className="text-sm text-brand-teal">{actionMsg}</p>}

      {loading ? (
        <p className="text-brand-muted">Loading users...</p>
      ) : users.length === 0 ? (
        <div className="card"><p className="text-brand-muted">No users found.</p></div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="card flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-brand-text font-medium">{u.displayName}</p>
                  {u.isAdmin && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-brand-amber/20 text-brand-amber">
                      Admin
                    </span>
                  )}
                  {u.isMemorial && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-brand-lavender/20 text-brand-lavender">
                      Memorial
                    </span>
                  )}
                  {!u.isActive && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-brand-coral/20 text-brand-coral">
                      Suspended
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-muted">{u.email}</p>
                <p className="text-xs text-brand-muted capitalize">
                  Verification: {u.verificationStatus} | Joined: {new Date(u.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!u.isAdmin && (
                <button
                  onClick={() => handleToggleActive(u.id, u.isActive)}
                  className={`btn-ghost text-xs ${
                    u.isActive
                      ? 'text-brand-coral border-brand-coral/30'
                      : 'text-brand-teal border-brand-teal/30'
                  }`}
                >
                  {u.isActive ? 'Suspend' : 'Activate'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== Community Codes Tab ==========
function CodesTab() {
  const [codes, setCodes] = useState<CommunityCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Create form
  const [newCode, setNewCode] = useState('');
  const [newMaxUses, setNewMaxUses] = useState('100');
  const [newPartnerId, setNewPartnerId] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCodes();
  }, []);

  async function fetchCodes() {
    try {
      const data = await api<CommunityCode[]>('/admin/community-codes');
      setCodes(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newCode.trim()) return;
    setCreating(true);
    setActionMsg('');
    try {
      await api('/admin/community-codes', {
        method: 'POST',
        body: JSON.stringify({
          code: newCode.trim(),
          maxUses: Number(newMaxUses) || 100,
          partnerId: newPartnerId.trim() || undefined,
        }),
      });
      setActionMsg('Community code created.');
      setNewCode('');
      setNewMaxUses('100');
      setNewPartnerId('');
      fetchCodes();
    } catch (err: any) {
      setActionMsg(err.message || 'Failed to create code');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeactivate(codeId: string) {
    setActionMsg('');
    try {
      await api(`/admin/community-codes/${codeId}/deactivate`, { method: 'POST' });
      setActionMsg('Code deactivated.');
      fetchCodes();
    } catch (err: any) {
      setActionMsg(err.message || 'Failed to deactivate code');
    }
  }

  return (
    <div className="space-y-4">
      {/* Create Form */}
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-brand-text">Create Community Code</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-brand-muted mb-1">Code</label>
              <input
                className="input-field"
                placeholder="e.g. PARTNER2026"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1">Max Uses</label>
              <input
                className="input-field"
                type="number"
                value={newMaxUses}
                onChange={(e) => setNewMaxUses(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1">Partner ID (optional)</label>
              <input
                className="input-field"
                placeholder="Partner ID"
                value={newPartnerId}
                onChange={(e) => setNewPartnerId(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" disabled={creating} className="btn-primary text-sm">
            {creating ? 'Creating...' : 'Create Code'}
          </button>
        </form>
      </div>

      {actionMsg && <p className="text-sm text-brand-teal">{actionMsg}</p>}

      {/* Codes List */}
      {loading ? (
        <p className="text-brand-muted">Loading codes...</p>
      ) : codes.length === 0 ? (
        <div className="card"><p className="text-brand-muted">No community codes found.</p></div>
      ) : (
        <div className="space-y-3">
          {codes.map((code) => (
            <div key={code.id} className="card flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-brand-text font-mono font-medium">{code.code}</p>
                  {!code.isActive && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-brand-coral/20 text-brand-coral">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-muted">
                  Uses: {code.currentUses}/{code.maxUses}
                  {code.partner && ` | Partner: ${code.partner.name}`}
                </p>
              </div>
              {code.isActive && (
                <button
                  onClick={() => handleDeactivate(code.id)}
                  className="btn-ghost text-xs text-brand-coral border-brand-coral/30"
                >
                  Deactivate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== Partners Tab ==========
function PartnersTab() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Create form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    try {
      const data = await api<Partner[]>('/admin/partners');
      setPartners(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    setCreating(true);
    setActionMsg('');
    try {
      await api('/admin/partners', {
        method: 'POST',
        body: JSON.stringify({
          name: newName.trim(),
          contactEmail: newEmail.trim(),
        }),
      });
      setActionMsg('Partner created.');
      setNewName('');
      setNewEmail('');
      fetchPartners();
    } catch (err: any) {
      setActionMsg(err.message || 'Failed to create partner');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Create Form */}
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-brand-text">Add Partner</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-brand-muted mb-1">Name</label>
              <input
                className="input-field"
                placeholder="Organization name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1">Contact Email</label>
              <input
                className="input-field"
                type="email"
                placeholder="contact@org.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={creating} className="btn-primary text-sm">
            {creating ? 'Creating...' : 'Add Partner'}
          </button>
        </form>
      </div>

      {actionMsg && <p className="text-sm text-brand-teal">{actionMsg}</p>}

      {/* Partners List */}
      {loading ? (
        <p className="text-brand-muted">Loading partners...</p>
      ) : partners.length === 0 ? (
        <div className="card"><p className="text-brand-muted">No partners found.</p></div>
      ) : (
        <div className="space-y-3">
          {partners.map((partner) => (
            <div key={partner.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-brand-text font-medium">{partner.name}</p>
                    {!partner.isActive && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-brand-coral/20 text-brand-coral">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted">{partner.contactEmail}</p>
                  <p className="text-xs text-brand-muted">
                    Codes: {partner._count?.communityCodes ?? 0} | Since: {new Date(partner.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== Blocked Phrases Tab ==========
function PhrasesTab() {
  const [phrases, setPhrases] = useState<BlockedPhrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPhrase, setNewPhrase] = useState('');
  const [adding, setAdding] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchPhrases();
  }, []);

  async function fetchPhrases() {
    try {
      const data = await api<BlockedPhrase[]>('/admin/blocked-phrases');
      setPhrases(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newPhrase.trim()) return;
    setAdding(true);
    setActionMsg('');
    try {
      await api('/admin/blocked-phrases', {
        method: 'POST',
        body: JSON.stringify({ phrase: newPhrase.trim() }),
      });
      setActionMsg('Phrase added.');
      setNewPhrase('');
      fetchPhrases();
    } catch (err: any) {
      setActionMsg(err.message || 'Failed to add phrase');
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(phraseId: string) {
    setActionMsg('');
    try {
      await api(`/admin/blocked-phrases/${phraseId}`, { method: 'DELETE' });
      setActionMsg('Phrase removed.');
      fetchPhrases();
    } catch (err: any) {
      setActionMsg(err.message || 'Failed to remove phrase');
    }
  }

  return (
    <div className="space-y-4">
      {/* Add Form */}
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-brand-text">Add Blocked Phrase</h2>
        <p className="text-sm text-brand-muted">
          Messages containing these phrases will be automatically flagged or blocked.
        </p>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="Enter phrase to block..."
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            required
          />
          <button type="submit" disabled={adding} className="btn-primary text-sm">
            {adding ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      {actionMsg && <p className="text-sm text-brand-teal">{actionMsg}</p>}

      {/* Phrases List */}
      {loading ? (
        <p className="text-brand-muted">Loading phrases...</p>
      ) : phrases.length === 0 ? (
        <div className="card"><p className="text-brand-muted">No blocked phrases.</p></div>
      ) : (
        <div className="card">
          <div className="space-y-2">
            {phrases.map((phrase) => (
              <div key={phrase.id} className="flex items-center justify-between bg-brand-dark/40 rounded-lg px-3 py-2">
                <span className="text-brand-text text-sm">{phrase.phrase}</span>
                <button
                  onClick={() => handleRemove(phrase.id)}
                  className="text-brand-coral hover:text-brand-coral/80 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========== Analytics Tab ==========
function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await api<AnalyticsData>('/admin/analytics');
        setAnalytics(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <p className="text-brand-muted">Loading analytics...</p>;
  if (!analytics) return <div className="card"><p className="text-brand-muted">Failed to load analytics.</p></div>;

  const stats = [
    { label: 'Total Users', value: analytics.totalUsers, color: 'text-brand-text' },
    { label: 'Active Users', value: analytics.activeUsers, color: 'text-brand-teal' },
    { label: 'Verified Users', value: analytics.verifiedUsers, color: 'text-brand-teal' },
    { label: 'Memorial Profiles', value: analytics.memorialUsers, color: 'text-brand-lavender' },
    { label: 'Total Moments', value: analytics.totalMoments, color: 'text-brand-amber' },
    { label: 'Conversations', value: analytics.totalConversations, color: 'text-brand-text' },
    { label: 'Events', value: analytics.totalEvents, color: 'text-brand-text' },
    { label: 'Total Reports', value: analytics.totalReports, color: 'text-brand-coral' },
    { label: 'Pending Reports', value: analytics.pendingReports, color: 'text-brand-amber' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card text-center">
          <p className={`text-3xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
          <p className="text-sm text-brand-muted mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
