const STORAGE_KEY = 'stillhere_mvp_state_v9';

const dom = {
  landingView: document.querySelector('#landing-view'),
  landingStartBtn: document.querySelector('#landing-start-btn'),
  authView: document.querySelector('#auth-view'),
  onboardingView: document.querySelector('#onboarding-view'),
  appView: document.querySelector('#app-view'),
  authForm: document.querySelector('#auth-form'),
  authStatus: document.querySelector('#auth-status'),
  onboardingForm: document.querySelector('#onboarding-form'),
  onboardEnergyBaseline: document.querySelector('#onboard-energy-baseline'),
  onboardAvailabilityWindow: document.querySelector('#onboard-availability-window'),
  onboardCommunicationStyle: document.querySelector('#onboard-communication-style'),
  onboardCommunityCode: document.querySelector('#onboard-community-code'),
  onboardingProgress: document.querySelector('#onboarding-progress'),
  onboardingPresetLow: document.querySelector('#onboarding-preset-low'),
  onboardingPresetSocial: document.querySelector('#onboarding-preset-social'),
  onboardingClearDraft: document.querySelector('#onboarding-clear-draft'),
  onboardingStatus: document.querySelector('#onboarding-status'),
  tabs: [...document.querySelectorAll('.tabs button')],
  panels: [...document.querySelectorAll('.tab-panel')],
  momentForm: document.querySelector('#moment-form'),
  eventForm: document.querySelector('#event-form'),
  partnerOfferFilter: document.querySelector('#partner-offer-filter'),
  partnerOfferList: document.querySelector('#partner-offer-list'),
  partnerBookingForm: document.querySelector('#partner-booking-form'),
  partnerBookingOfferId: document.querySelector('#partner-booking-offer-id'),
  partnerBookingDate: document.querySelector('#partner-booking-date'),
  partnerBookingNote: document.querySelector('#partner-booking-note'),
  partnerBookingList: document.querySelector('#partner-booking-list'),
  momentList: document.querySelector('#moment-list'),
  feedFilter: document.querySelector('#feed-filter'),
  momentTemplate: document.querySelector('#moment-item-template'),
  responseList: document.querySelector('#response-list'),
  connectionRequestForm: document.querySelector('#connection-request-form'),
  connectionTarget: document.querySelector('#connection-target'),
  connectionNote: document.querySelector('#connection-note'),
  connectionFilter: document.querySelector('#connection-filter'),
  connectionSuggestionList: document.querySelector('#connection-suggestion-list'),
  incomingConnectionList: document.querySelector('#incoming-connection-list'),
  outgoingConnectionList: document.querySelector('#outgoing-connection-list'),
  connectionList: document.querySelector('#connection-list'),
  eventList: document.querySelector('#event-list'),
  caregiverForm: document.querySelector('#caregiver-form'),
  caregiverName: document.querySelector('#caregiver-name'),
  caregiverRelationship: document.querySelector('#caregiver-relationship'),
  caregiverContact: document.querySelector('#caregiver-contact'),
  caregiverList: document.querySelector('#caregiver-list'),
  caregiverSnapshot: document.querySelector('#caregiver-snapshot'),
  careUpdateForm: document.querySelector('#care-update-form'),
  careUpdateUrgency: document.querySelector('#care-update-urgency'),
  careUpdateNeededBy: document.querySelector('#care-update-needed-by'),
  careUpdateText: document.querySelector('#care-update-text'),
  careUpdateList: document.querySelector('#care-update-list'),
  careUpdateFilter: document.querySelector('#care-update-filter'),
  eventDetail: document.querySelector('#event-detail'),
  eventMessageForm: document.querySelector('#event-message-form'),
  eventMessageInput: document.querySelector('#event-message-input'),
  conversationList: document.querySelector('#conversation-list'),
  thread: document.querySelector('#thread'),
  messageForm: document.querySelector('#message-form'),
  messageInput: document.querySelector('#message-input'),
  messageImage: document.querySelector('#message-image'),
  messageAttachmentStatus: document.querySelector('#message-attachment-status'),
  notificationList: document.querySelector('#notification-list'),
  notifDeliveryMode: document.querySelector('#notif-delivery-mode'),
  notifQuietStart: document.querySelector('#notif-quiet-start'),
  notifQuietEnd: document.querySelector('#notif-quiet-end'),
  notifPrefSaveBtn: document.querySelector('#notif-pref-save-btn'),
  notifPermissionBtn: document.querySelector('#notif-permission-btn'),
  notifMarkAllReadBtn: document.querySelector('#notif-mark-all-read-btn'),
  notifPrefStatus: document.querySelector('#notif-pref-status'),
  mute1dBtn: document.querySelector('#mute-1d-btn'),
  mute3dBtn: document.querySelector('#mute-3d-btn'),
  mute7dBtn: document.querySelector('#mute-7d-btn'),
  profileCard: document.querySelector('#profile-card'),
  logoutBtn: document.querySelector('#logout-btn'),
  reportForm: document.querySelector('#report-form'),
  blockForm: document.querySelector('#block-form'),
  safetyCheckinForm: document.querySelector('#safety-checkin-form'),
  safetyContact: document.querySelector('#safety-contact'),
  safetyLocation: document.querySelector('#safety-location'),
  safetyNote: document.querySelector('#safety-note'),
  safetyTimer: document.querySelector('#safety-timer'),
  safetyCheckinNowBtn: document.querySelector('#safety-checkin-now-btn'),
  safetyCheckinList: document.querySelector('#safety-checkin-list'),
  safetyStatus: document.querySelector('#safety-status'),
  incidentDrillForm: document.querySelector('#incident-drill-form'),
  incidentDrillType: document.querySelector('#incident-drill-type'),
  incidentDrillNote: document.querySelector('#incident-drill-note'),
  incidentDrillList: document.querySelector('#incident-drill-list'),
  adminReportList: document.querySelector('#admin-report-list'),
  adminStats: document.querySelector('#admin-stats'),
  adminProgressReport: document.querySelector('#admin-progress-report'),
  adminInboxFilter: document.querySelector('#admin-inbox-filter'),
  adminInboxSearch: document.querySelector('#admin-inbox-search'),
  adminInboxExportBtn: document.querySelector('#admin-inbox-export-btn'),
  adminInboxList: document.querySelector('#admin-inbox-list'),
  adminMemorialList: document.querySelector('#admin-memorial-list'),
  adminMemoryReviewList: document.querySelector('#admin-memory-review-list'),
  adminInactivityFilter: document.querySelector('#admin-inactivity-filter'),
  adminRefreshInactivityBtn: document.querySelector('#admin-refresh-inactivity-btn'),
  adminInactivityList: document.querySelector('#admin-inactivity-list'),
  adminCareUpdateList: document.querySelector('#admin-care-update-list'),
  adminPartnerReviewList: document.querySelector('#admin-partner-review-list'),
  adminPartnerBookingList: document.querySelector('#admin-partner-booking-list'),
  adminCodeRequestList: document.querySelector('#admin-code-request-list'),
  adminVerificationReviewList: document.querySelector('#admin-verification-review-list'),
  adminCommunityCodeList: document.querySelector('#admin-community-code-list'),
  adminLaunchStatus: document.querySelector('#admin-launch-status'),
  riskRegisterForm: document.querySelector('#risk-register-form'),
  riskRegisterTitle: document.querySelector('#risk-register-title'),
  riskRegisterSeverity: document.querySelector('#risk-register-severity'),
  riskRegisterMitigation: document.querySelector('#risk-register-mitigation'),
  adminRiskList: document.querySelector('#admin-risk-list'),
  adminIncidentList: document.querySelector('#admin-incident-list'),
  adminPhraseForm: document.querySelector('#admin-phrase-form'),
  adminPhraseInput: document.querySelector('#admin-phrase-input'),
  blockedPhraseList: document.querySelector('#blocked-phrase-list'),
  queueCount: document.querySelector('#queue-count'),
  allowCaregiverView: document.querySelector('#allow-caregiver-view'),
  themeSelect: document.querySelector('#theme-select'),
  textSizeSelect: document.querySelector('#text-size-select'),
  highContrastToggle: document.querySelector('#high-contrast-toggle'),
  reducedMotionToggle: document.querySelector('#reduced-motion-toggle'),
  profileSaveBtn: document.querySelector('#profile-save-btn'),
  profileVerificationStatus: document.querySelector('#profile-verification-status'),
  verificationRequestLevel: document.querySelector('#verification-request-level'),
  verificationRequestNote: document.querySelector('#verification-request-note'),
  verificationRequestBtn: document.querySelector('#verification-request-btn'),
  verificationRequestCancelBtn: document.querySelector('#verification-request-cancel-btn'),
  verificationRequestStatus: document.querySelector('#verification-request-status'),
  verificationHistoryList: document.querySelector('#verification-history-list'),
  exportDataBtn: document.querySelector('#export-data-btn'),
  deleteAccountBtn: document.querySelector('#delete-account-btn'),
  cancelDeletionBtn: document.querySelector('#cancel-deletion-btn'),
  communityCodeRequest: document.querySelector('#community-code-request'),
  communityCodeRequestBtn: document.querySelector('#community-code-request-btn'),
  communityCodeStatus: document.querySelector('#community-code-status'),
  accountStatus: document.querySelector('#account-status'),
  installAppBtn: document.querySelector('#install-app-btn'),
  offlineIndicator: document.querySelector('#offline-indicator'),
  griefResourceList: document.querySelector('#grief-resource-list'),
  digestFrequency: document.querySelector('#digest-frequency'),
  digestSaveBtn: document.querySelector('#digest-save-btn'),
  digestSendNowBtn: document.querySelector('#digest-send-now-btn'),
  digestStatus: document.querySelector('#digest-status'),
  clearStateBtn: document.querySelector('#clear-state-btn'),
  roadmapPhaseFilter: document.querySelector('#roadmap-phase-filter'),
  roadmapRunHealthBtn: document.querySelector('#roadmap-run-health-btn'),
  roadmapAdvanceBtn: document.querySelector('#roadmap-advance-btn'),
  roadmapExportBtn: document.querySelector('#roadmap-export-btn'),
  roadmapResetBtn: document.querySelector('#roadmap-reset-btn'),
  roadmapSummary: document.querySelector('#roadmap-summary'),
  roadmapHealthStatus: document.querySelector('#roadmap-health-status'),
  roadmapReadiness: document.querySelector('#roadmap-readiness'),
  roadmapPhaseList: document.querySelector('#roadmap-phase-list'),
  roadmapMilestoneList: document.querySelector('#roadmap-milestone-list'),
  roadmapLogList: document.querySelector('#roadmap-log-list'),
  roadmapLeftSummary: document.querySelector('#roadmap-left-summary'),
  roadmapBacklogList: document.querySelector('#roadmap-backlog-list'),
  executionSummary: document.querySelector('#execution-summary'),
  executionSprintName: document.querySelector('#execution-sprint-name'),
  executionSprintCapacity: document.querySelector('#execution-sprint-capacity'),
  executionCreateSprintBtn: document.querySelector('#execution-create-sprint-btn'),
  executionCompleteSprintBtn: document.querySelector('#execution-complete-sprint-btn'),
  executionSprintList: document.querySelector('#execution-sprint-list'),
  executionBlockerForm: document.querySelector('#execution-blocker-form'),
  executionBlockerTitle: document.querySelector('#execution-blocker-title'),
  executionBlockerSeverity: document.querySelector('#execution-blocker-severity'),
  executionBlockerOwner: document.querySelector('#execution-blocker-owner'),
  executionBlockerList: document.querySelector('#execution-blocker-list'),
  qualityGateSummary: document.querySelector('#quality-gate-summary'),
  qualityGateSuite: document.querySelector('#quality-gate-suite'),
  qualityGateRunBtn: document.querySelector('#quality-gate-run-btn'),
  qualityGateRunAllBtn: document.querySelector('#quality-gate-run-all-btn'),
  qualityGateList: document.querySelector('#quality-gate-list'),
  memorialForm: document.querySelector('#memorial-form'),
  memorialPreference: document.querySelector('#memorial-preference'),
  memorialMessage: document.querySelector('#memorial-message'),
  designatedName: document.querySelector('#designated-name'),
  designatedContact: document.querySelector('#designated-contact'),
  activateMemorialBtn: document.querySelector('#activate-memorial-btn'),
  addMemoryBtn: document.querySelector('#add-memory-btn'),
  memorialPreview: document.querySelector('#memorial-preview'),
  memoryList: document.querySelector('#memory-list'),
  memorialWallForm: document.querySelector('#memorial-wall-form'),
  memorialWallTarget: document.querySelector('#memorial-wall-target'),
  memorialWallMessage: document.querySelector('#memorial-wall-message'),
  memorialWallList: document.querySelector('#memorial-wall-list'),
  memorialWallView: document.querySelector('#memorial-wall-view'),
  memorialWallMemoryList: document.querySelector('#memorial-wall-memory-list'),
};

dom.installAppBtn.classList.add('hidden');

const DEFAULT_BLOCKED_PHRASES = [
  'send money', 'wire transfer', 'bitcoin', 'crypto', 'investment opportunity',
  'gofundme', 'cashapp', 'venmo', 'paypal me', 'donate', 'bank account', 'financial help', 'inheritance',
];

const seedUsers = [
  { id: 'u_riley', name: 'Riley', email: 'riley@example.com', prompts: {}, preferences: { energyBaseline: 'moderate', availabilityWindow: 'evening', communicationStyle: 'mixed' }, communityCode: 'NYC-QUIET-NIGHTS', verificationStatus: 'verified', onboarded: true, allowCaregiverView: false, caregivers: [], memorial: { preference: 'undecided', message: '', designatedName: '', designatedContact: '', isMemorial: false, memories: [] } },
  { id: 'u_amara', name: 'Amara', email: 'amara@example.com', prompts: {}, preferences: { energyBaseline: 'low', availabilityWindow: 'afternoon', communicationStyle: 'silent_company' }, communityCode: 'CAFE-SLOW-HOURS', verificationStatus: 'community_verified', onboarded: true, allowCaregiverView: true, caregivers: [{ id: 'cg_1', name: 'Eli', relationship: 'brother', contact: 'eli@example.com', addedAt: Date.now() - 500000 }], memorial: { preference: 'memorial', message: 'Thanks for showing up as yourselves.', designatedName: '', designatedContact: '', isMemorial: false, memories: [] } },
  { id: 'u_milo', name: 'Milo', email: 'milo@example.com', prompts: {}, preferences: { energyBaseline: 'high', availabilityWindow: 'late_night', communicationStyle: 'quick_checkins' }, verificationStatus: 'basic', onboarded: true, allowCaregiverView: false, caregivers: [], memorial: { preference: 'undecided', message: '', designatedName: '', designatedContact: '', isMemorial: false, memories: [] } },
];

const seedMoments = [
  { id: 'm_1', userId: 'u_riley', title: 'Sunset drive. No pressure to talk.', category: 'nature', energy: 'low', description: 'Could use calm company for 45 minutes.', createdAt: Date.now() - 500000 },
  { id: 'm_2', userId: 'u_amara', title: 'Street noodles and bad jokes', category: 'food', energy: 'moderate', description: 'In and out in an hour.', createdAt: Date.now() - 400000 },
  { id: 'm_3', userId: 'u_milo', title: 'Virtual movie tonight', category: 'virtual', energy: 'any', description: 'Camera optional.', createdAt: Date.now() - 300000 },
];

let state = loadState();
state.verificationRequests = (state.verificationRequests || []).map((request) => ({
  ...request,
  status: request.status || 'pending',
  reviewedAt: request.reviewedAt || null,
  reviewedBy: request.reviewedBy || null,
}));
let activeConversationId = null;
let activeEventId = null;
let deferredInstallPrompt = null;

function defaultState() {
  return {
    users: seedUsers.map((user) => ({ ...user, caregivers: [...(user.caregivers || [])], memorial: { ...(user.memorial || {}), memories: [...(user.memorial?.memories || [])] } })),
    currentUserId: null,
    moments: [...seedMoments],
    responses: [],
    connectionRequests: [],
    connections: [],
    connectionActivity: [],
    communityCodes: [
      { id: 'code_nyc_quiet', code: 'NYC-QUIET-NIGHTS', label: 'NYC quiet nights', status: 'active', memberIds: ['u_riley'] },
      { id: 'code_cafe_slow', code: 'CAFE-SLOW-HOURS', label: 'Cafe slow hours', status: 'active', memberIds: ['u_amara'] },
    ],
    communityCodeRequests: [],
    verificationRequests: [],
    moderationActions: [],
    onboardingDrafts: {},
    inactivityFlags: [],
    partners: [
      { id: 'p_glow', name: 'Glow Pottery Studio', verified: true, type: 'in_person', notes: 'Wheelchair accessible. Quiet hours available.' },
      { id: 'p_breathe', name: 'Breathe Breathwork', verified: false, type: 'virtual', notes: 'Low-energy guided calls.' },
      { id: 'p_sky', name: 'Skyline Drives', verified: true, type: 'in_person', notes: 'Door-to-door scenic rides with breaks.' },
    ],
    partnerOffers: [
      { id: 'offer_1', partnerId: 'p_glow', title: 'Private clay session', type: 'in_person', energy: 'low', description: '60 minutes, seating and breaks anytime.' },
      { id: 'offer_2', partnerId: 'p_breathe', title: 'Virtual reset session', type: 'virtual', energy: 'low', description: '30-minute guided breathing with camera optional.' },
      { id: 'offer_3', partnerId: 'p_sky', title: 'Sunset city drive', type: 'in_person', energy: 'moderate', description: 'Two-hour drive with comfort stops.' },
    ],
    partnerBookings: [],
    conversations: [],
    notifications: [],
    reports: [],
    blocks: [],
    blockedPhrases: DEFAULT_BLOCKED_PHRASES,
    events: [],
    notificationMuteUntil: 0,
    notificationPreferences: { deliveryMode: 'in_app', quietHoursStart: '22:00', quietHoursEnd: '07:00', browserPermissionRequested: false },
    eventReminderLog: [],
    careUpdates: [],
    safetyCheckins: [],
    theme: 'dark',
    accessibility: { textSize: 'normal', highContrast: false, reducedMotion: false },
    digestPreference: { frequency: 'off', lastSentAt: 0 },
    inactivityCheckinLog: [],
    roadmapMilestones: [
      { id: 'ms_onboarding', title: 'Onboarding + profile prompts', phase: 'foundation', status: 'done', completedAt: Date.now() - 86400000 * 20 },
      { id: 'ms_feed', title: 'Moment feed + responses + connections', phase: 'core connection', status: 'done', completedAt: Date.now() - 86400000 * 18 },
      { id: 'ms_safety', title: 'Safety toolkit + moderation + inactivity review', phase: 'trust & safety', status: 'done', completedAt: Date.now() - 86400000 * 12 },
      { id: 'ms_memorial', title: 'Memorial workflows + memory moderation', phase: 'grief-aware design', status: 'done', completedAt: Date.now() - 86400000 * 8 },
      { id: 'ms_partners', title: 'Partner ecosystem + booking controls', phase: 'ecosystem', status: 'done', completedAt: Date.now() - 86400000 * 6 },
      { id: 'ms_verification', title: 'Verification request lifecycle + audit metadata', phase: 'trust & safety', status: 'done', completedAt: Date.now() - 86400000 * 1 },
      { id: 'ms_backend', title: 'Backend/API integration and auth hardening', phase: 'production readiness', status: 'in_progress', completedAt: null },
      { id: 'ms_quality', title: 'Automated test coverage and CI checks', phase: 'production readiness', status: 'pending', completedAt: null },
      { id: 'ms_launch', title: 'Deployment, observability, and launch readiness', phase: 'production readiness', status: 'pending', completedAt: null },
    ],
    roadmapActivity: [],
    roadmapHealthRuns: [],
    riskRegister: [
      { id: 'risk_1', title: 'Realtime transport not wired to backend', severity: 'high', mitigation: 'Implement websocket service + retry rules', status: 'open', createdAt: Date.now() - 86400000 * 4 },
      { id: 'risk_2', title: 'No automated CI regression gate yet', severity: 'medium', mitigation: 'Add unit/e2e test jobs in CI pipeline', status: 'open', createdAt: Date.now() - 86400000 * 3 },
    ],
    incidentDrills: [],
    qualityGateRuns: [],
    qualityGateSuites: [
      { id: 'suite_core', key: 'core_regression', title: 'Core regression', status: 'not_run', passedChecks: 0, totalChecks: 0, lastRunAt: null },
      { id: 'suite_safety', key: 'safety_resilience', title: 'Safety resilience', status: 'not_run', passedChecks: 0, totalChecks: 0, lastRunAt: null },
      { id: 'suite_release', key: 'release_readiness', title: 'Release readiness', status: 'not_run', passedChecks: 0, totalChecks: 0, lastRunAt: null },
    ],
    executionSprints: [
      { id: 'spr_1', name: 'Stability sprint', status: 'active', capacity: 6, committedItemIds: ['left_api_auth', 'left_security'], completedItemIds: [], createdAt: Date.now() - 86400000 * 2, completedAt: null },
    ],
    executionBlockers: [
      { id: 'blk_1', title: 'Socket transport spec pending', severity: 'high', owner: 'agent', status: 'open', createdAt: Date.now() - 86400000 },
    ],
    deliveryBacklog: [
      { id: 'left_api_auth', title: 'Implement Node/TypeScript backend auth + persistence APIs', area: 'backend', status: 'in_progress', owner: 'agent' },
      { id: 'left_realtime', title: 'Wire realtime messaging/event updates with websocket transport', area: 'backend', status: 'pending', owner: 'agent' },
      { id: 'left_tests', title: 'Add automated regression suites (unit + e2e) in CI', area: 'quality', status: 'pending', owner: 'agent' },
      { id: 'left_security', title: 'Complete production security hardening (rate limits, audit trails)', area: 'trust', status: 'pending', owner: 'agent' },
      { id: 'left_ops', title: 'Set up deployment, monitoring, and error alerting pipeline', area: 'ops', status: 'pending', owner: 'agent' },
      { id: 'left_mobile', title: 'Polish mobile usability and accessibility QA pass', area: 'ux', status: 'pending', owner: 'agent' },
    ],
    activeTab: 'feed',
  };
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();
  try {
    const parsed = JSON.parse(raw);
    const users = (parsed.users || []).map((user) => ({
      ...user,
      allowCaregiverView: !!user.allowCaregiverView,
      caregivers: Array.isArray(user.caregivers) ? user.caregivers : [],
      memorial: { preference: 'undecided', message: '', designatedName: '', designatedContact: '', isMemorial: false, memories: [], ...(user.memorial || {}), memories: Array.isArray(user.memorial?.memories) ? user.memorial.memories : [] },
      preferences: { energyBaseline: user.preferences?.energyBaseline || 'variable', availabilityWindow: user.preferences?.availabilityWindow || 'flexible', communicationStyle: user.preferences?.communicationStyle || 'mixed' },
      communityCode: user.communityCode || '',
      verificationRequestStatus: user.verificationRequestStatus || 'none',
      isSoftDeleted: !!user.isSoftDeleted,
      deletedAt: user.deletedAt || null,
      hardDeleteAt: user.hardDeleteAt || null,
    }));
    return { ...defaultState(), ...parsed, users, careUpdates: Array.isArray(parsed.careUpdates) ? parsed.careUpdates : [], safetyCheckins: Array.isArray(parsed.safetyCheckins) ? parsed.safetyCheckins : [], connectionRequests: Array.isArray(parsed.connectionRequests) ? parsed.connectionRequests : [], connections: Array.isArray(parsed.connections) ? parsed.connections : [], connectionActivity: Array.isArray(parsed.connectionActivity) ? parsed.connectionActivity : [], partners: Array.isArray(parsed.partners) ? parsed.partners : defaultState().partners, partnerOffers: Array.isArray(parsed.partnerOffers) ? parsed.partnerOffers : defaultState().partnerOffers, partnerBookings: Array.isArray(parsed.partnerBookings) ? parsed.partnerBookings : [], communityCodes: Array.isArray(parsed.communityCodes) ? parsed.communityCodes : defaultState().communityCodes, communityCodeRequests: Array.isArray(parsed.communityCodeRequests) ? parsed.communityCodeRequests : [], verificationRequests: Array.isArray(parsed.verificationRequests) ? parsed.verificationRequests : [], moderationActions: Array.isArray(parsed.moderationActions) ? parsed.moderationActions : [], onboardingDrafts: parsed.onboardingDrafts && typeof parsed.onboardingDrafts === 'object' ? parsed.onboardingDrafts : {}, inactivityFlags: Array.isArray(parsed.inactivityFlags) ? parsed.inactivityFlags : [], blockedPhrases: parsed.blockedPhrases?.length ? parsed.blockedPhrases : DEFAULT_BLOCKED_PHRASES, theme: parsed.theme === 'light' ? 'light' : 'dark', inactivityCheckinLog: Array.isArray(parsed.inactivityCheckinLog) ? parsed.inactivityCheckinLog : [], roadmapMilestones: Array.isArray(parsed.roadmapMilestones) && parsed.roadmapMilestones.length ? parsed.roadmapMilestones : defaultState().roadmapMilestones, roadmapActivity: Array.isArray(parsed.roadmapActivity) ? parsed.roadmapActivity : [], roadmapHealthRuns: Array.isArray(parsed.roadmapHealthRuns) ? parsed.roadmapHealthRuns : [], riskRegister: Array.isArray(parsed.riskRegister) ? parsed.riskRegister : defaultState().riskRegister, incidentDrills: Array.isArray(parsed.incidentDrills) ? parsed.incidentDrills : [], qualityGateRuns: Array.isArray(parsed.qualityGateRuns) ? parsed.qualityGateRuns : [], qualityGateSuites: Array.isArray(parsed.qualityGateSuites) && parsed.qualityGateSuites.length ? parsed.qualityGateSuites : defaultState().qualityGateSuites, executionSprints: Array.isArray(parsed.executionSprints) ? parsed.executionSprints : defaultState().executionSprints, executionBlockers: Array.isArray(parsed.executionBlockers) ? parsed.executionBlockers : defaultState().executionBlockers, deliveryBacklog: Array.isArray(parsed.deliveryBacklog) && parsed.deliveryBacklog.length ? parsed.deliveryBacklog : defaultState().deliveryBacklog, accessibility: { textSize: parsed.accessibility?.textSize === 'large' ? 'large' : 'normal', highContrast: !!parsed.accessibility?.highContrast, reducedMotion: !!parsed.accessibility?.reducedMotion }, digestPreference: { frequency: ['off','daily','weekly'].includes(parsed.digestPreference?.frequency) ? parsed.digestPreference.frequency : 'off', lastSentAt: Number(parsed.digestPreference?.lastSentAt) || 0 }, notificationPreferences: { deliveryMode: parsed.notificationPreferences?.deliveryMode === 'in_app_and_push' ? 'in_app_and_push' : 'in_app', quietHoursStart: parsed.notificationPreferences?.quietHoursStart || '22:00', quietHoursEnd: parsed.notificationPreferences?.quietHoursEnd || '07:00', browserPermissionRequested: !!parsed.notificationPreferences?.browserPermissionRequested } };
  } catch {
    return defaultState();
  }
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function userById(id) { return state.users.find((u) => u.id === id); }
function currentUser() { return userById(state.currentUserId); }

function applyTheme() {
  document.body.classList.toggle('light-mode', state.theme === 'light');
  const prefs = state.accessibility || { textSize: 'normal', highContrast: false, reducedMotion: false };
  document.body.classList.toggle('large-text', prefs.textSize === 'large');
  document.body.classList.toggle('high-contrast', !!prefs.highContrast);
  document.body.classList.toggle('reduced-motion', !!prefs.reducedMotion);
}

function updateOfflineIndicator() {
  const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
  dom.offlineIndicator.classList.toggle('hidden', !isOffline);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

function refreshInactivityFlags() {
  const now = Date.now();
  const fourteen = 14 * 24 * 60 * 60 * 1000;
  const ninety = 90 * 24 * 60 * 60 * 1000;
  const existing = new Map((state.inactivityFlags || []).map((flag) => [flag.userId, flag]));
  const nextFlags = [];

  state.users.forEach((user) => {
    if (user.isSoftDeleted || user.isActive === false || user.memorial?.isMemorial) return;
    const lastActiveAt = user.lastActiveAt || now;
    const idleMs = now - lastActiveAt;
    if (idleMs < fourteen) return;
    const previous = existing.get(user.id) || {};
    const severity = idleMs >= ninety ? 'critical' : 'watch';
    nextFlags.push({
      id: previous.id || crypto.randomUUID(),
      userId: user.id,
      severity,
      status: previous.status || 'open',
      createdAt: previous.createdAt || now,
      updatedAt: now,
      lastActiveAt,
      checkinSentAt: previous.checkinSentAt || null,
      escalatedAt: previous.escalatedAt || null,
    });
  });

  state.inactivityFlags = nextFlags.sort((a, b) => b.updatedAt - a.updatedAt);
}

function maybeSendInactivityCheckins() {
  refreshInactivityFlags();
  const now = Date.now();
  state.inactivityCheckinLog = state.inactivityCheckinLog || [];
  state.inactivityFlags
    .filter((flag) => flag.status === 'open')
    .forEach((flag) => {
      const logKey = `${flag.userId}:inactivity:${flag.severity}`;
      if (state.inactivityCheckinLog.includes(logKey)) return;
      notify(flag.userId, flag.severity === 'critical'
        ? 'It has been a long while since we saw you here. If you are still here, please check in when you can.'
        : 'We have not seen you in a while. If you are still here, tap in and update your profile when you have energy.');
      flag.checkinSentAt = now;
      state.inactivityCheckinLog.push(logKey);
    });
}

function renderGriefResources() {
  const region = (navigator.language || 'en-US').toLowerCase();
  const isUS = region.includes('en-us');
  const resources = isUS
    ? [
      { label: '988 Lifeline (US)', href: 'https://988lifeline.org/' },
      { label: 'Crisis Text Line', href: 'https://www.crisistextline.org/' },
      { label: 'GriefShare directory', href: 'https://www.griefshare.org/findagroup' },
    ]
    : [
      { label: 'Find a Helpline (global)', href: 'https://findahelpline.com/' },
      { label: 'Befrienders Worldwide', href: 'https://www.befrienders.org/' },
      { label: 'Whats Your Grief resources', href: 'https://whatsyourgrief.com/' },
    ];

  dom.griefResourceList.textContent = '';
  resources.forEach((resource) => {
    const li = document.createElement('li');
    li.className = 'item';
    const link = document.createElement('a');
    link.href = resource.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = resource.label;
    li.append(link);
    dom.griefResourceList.append(li);
  });
}


function maybeSendDigestNotification(force = false) {
  const me = currentUser();
  if (!me) return;
  const pref = state.digestPreference || { frequency: 'off', lastSentAt: 0 };
  if (pref.frequency === 'off' && !force) {
    dom.digestStatus.textContent = 'Digest is off.';
    return;
  }
  const now = Date.now();
  const interval = pref.frequency === 'weekly' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  if (!force && pref.lastSentAt && (now - pref.lastSentAt) < interval) {
    dom.digestStatus.textContent = `Next ${pref.frequency} digest will be sent automatically.`;
    return;
  }

  const myNotifs = state.notifications.filter((n) => n.userId === me.id).slice(0, 20);
  const summary = [
    `Digest summary (${pref.frequency === 'off' ? 'manual' : pref.frequency}):`,
    `- Notifications in queue: ${myNotifs.length}`,
    `- Pending responses: ${state.responses.filter((r) => r.status === 'pending' && state.moments.some((m) => m.id === r.momentId && m.userId === me.id)).length}`,
    `- Active events joined: ${state.events.filter((event) => event.status === 'active' && (event.attendeeIds || []).includes(me.id)).length}`,
  ].join(' ');

  notify(me.id, summary);
  state.digestPreference.lastSentAt = now;
  dom.digestStatus.textContent = `Digest sent at ${new Date(now).toLocaleString()}.`;
}

function applyPendingAccountDeletion() {
  const now = Date.now();
  const dueForDelete = state.users.filter((user) => user.isSoftDeleted && user.hardDeleteAt && user.hardDeleteAt <= now);
  if (!dueForDelete.length) return;
  dueForDelete.forEach((user) => {
    state.moments = state.moments.filter((moment) => moment.userId !== user.id);
    state.responses = state.responses.filter((response) => response.responderId !== user.id && state.moments.some((moment) => moment.id === response.momentId));
    state.connectionRequests = state.connectionRequests.filter((request) => request.fromUserId !== user.id && request.toUserId !== user.id);
    state.connections = state.connections.filter((connection) => connection.userAId !== user.id && connection.userBId !== user.id);
    state.blocks = state.blocks.filter((block) => block.blockerId !== user.id && block.blockedId !== user.id);
    state.reports = state.reports.filter((report) => report.reporterName !== user.name && report.targetName !== user.name);
    state.partnerBookings = state.partnerBookings.filter((booking) => booking.userId !== user.id);
    state.careUpdates = state.careUpdates.filter((update) => update.userId !== user.id);
    state.safetyCheckins = state.safetyCheckins.filter((checkin) => checkin.userId !== user.id);
    state.notifications = state.notifications.filter((n) => n.userId !== user.id);
    state.events.forEach((event) => {
      event.attendeeIds = (event.attendeeIds || []).filter((id) => id !== user.id);
      event.messages = (event.messages || []).filter((message) => message.senderId !== user.id);
      if (event.organizerId === user.id) event.status = 'cancelled';
    });
    state.conversations = state.conversations
      .map((conversation) => ({
        ...conversation,
        participantIds: (conversation.participantIds || []).filter((id) => id !== user.id),
        messages: (conversation.messages || []).filter((message) => message.senderId !== user.id),
      }))
      .filter((conversation) => (conversation.participantIds || []).length >= 2);
  });
  state.users = state.users.filter((user) => !dueForDelete.some((candidate) => candidate.id === user.id));
  if (!userById(state.currentUserId)) state.currentUserId = null;
  saveState();
}

function exportCurrentUserData() {
  const me = currentUser();
  const payload = {
    exportedAt: new Date().toISOString(),
    user: me,
    moments: state.moments.filter((moment) => moment.userId === me.id),
    responsesSent: state.responses.filter((response) => response.responderId === me.id),
    responsesReceived: state.responses.filter((response) => {
      const moment = state.moments.find((item) => item.id === response.momentId);
      return moment?.userId === me.id;
    }),
    conversations: state.conversations.filter((conversation) => (conversation.participantIds || []).includes(me.id)),
    notifications: state.notifications.filter((n) => n.userId === me.id),
    events: state.events.filter((event) => event.organizerId === me.id || (event.attendeeIds || []).includes(me.id)),
    careUpdates: state.careUpdates.filter((update) => update.userId === me.id),
    safetyCheckins: state.safetyCheckins.filter((checkin) => checkin.userId === me.id),
    partnerBookings: state.partnerBookings.filter((booking) => booking.userId === me.id),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `still-here-export-${me.id}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function requestAccountDeletion() {
  const me = currentUser();
  const now = Date.now();
  me.isSoftDeleted = true;
  me.deletedAt = now;
  me.hardDeleteAt = now + (30 * 24 * 60 * 60 * 1000);
  applyDisappearMode(me);
  notify(me.id, 'Account deletion requested. You can restore within 30 days by logging in and canceling deletion.');
  saveState();
}

function cancelAccountDeletion() {
  const me = currentUser();
  me.isSoftDeleted = false;
  me.deletedAt = null;
  me.hardDeleteAt = null;
  me.isActive = true;
  notify(me.id, 'Account deletion canceled. Your account is active again.');
  saveState();
}
function verificationBadge(status) { return status === 'community_verified' ? 'community verified' : status === 'verified' ? 'verified' : 'basic'; }
function verificationRank(status) { return status === 'community_verified' ? 2 : status === 'verified' ? 1 : 0; }
function canRequestVerification(currentStatus, requestedLevel) { return verificationRank(requestedLevel) > verificationRank(currentStatus || 'basic'); }

function ensureView() {
  applyPendingAccountDeletion();
  applyTheme();
  const me = currentUser();
  const needsOnboarding = me && !me.onboarded;
  dom.landingView.classList.toggle('hidden', !!me);
  dom.authView.classList.toggle('hidden', !!me);
  dom.onboardingView.classList.toggle('hidden', !needsOnboarding);
  dom.appView.classList.toggle('hidden', !me || needsOnboarding);
  if (me && needsOnboarding) {
    hydrateOnboardingDraft(me.id);
    updateOnboardingProgress();
  }
  if (me && !needsOnboarding) {
    me.lastActiveAt = Date.now();
    state.inactivityCheckinLog = (state.inactivityCheckinLog || []).filter((key) => !key.startsWith(`${me.id}:`));
    state.inactivityFlags = (state.inactivityFlags || []).filter((flag) => flag.userId !== me.id);
    saveState();
    renderAll();
  }
}

function captureOnboardingDraft(userId) {
  state.onboardingDrafts = state.onboardingDrafts || {};
  state.onboardingDrafts[userId] = {
    noPatience: document.querySelector('#prompt-no-patience').value,
    company: document.querySelector('#prompt-company').value,
    body: document.querySelector('#prompt-body').value,
    before: document.querySelector('#prompt-before').value,
    energyBaseline: dom.onboardEnergyBaseline.value,
    availabilityWindow: dom.onboardAvailabilityWindow.value,
    communicationStyle: dom.onboardCommunicationStyle.value,
    communityCode: dom.onboardCommunityCode.value,
    updatedAt: Date.now(),
  };
}

function hydrateOnboardingDraft(userId) {
  const draft = state.onboardingDrafts?.[userId];
  if (!draft) return;
  document.querySelector('#prompt-no-patience').value = draft.noPatience || '';
  document.querySelector('#prompt-company').value = draft.company || '';
  document.querySelector('#prompt-body').value = draft.body || '';
  document.querySelector('#prompt-before').value = draft.before || '';
  dom.onboardEnergyBaseline.value = draft.energyBaseline || 'variable';
  dom.onboardAvailabilityWindow.value = draft.availabilityWindow || 'flexible';
  dom.onboardCommunicationStyle.value = draft.communicationStyle || 'mixed';
  dom.onboardCommunityCode.value = draft.communityCode || '';
}

function updateOnboardingProgress() {
  const values = [
    document.querySelector('#prompt-no-patience').value.trim(),
    document.querySelector('#prompt-company').value.trim(),
    document.querySelector('#prompt-body').value.trim(),
    document.querySelector('#prompt-before').value.trim(),
  ];
  const promptsFilled = values.filter(Boolean).length;
  const prefFilled = [dom.onboardEnergyBaseline.value, dom.onboardAvailabilityWindow.value, dom.onboardCommunicationStyle.value].filter(Boolean).length;
  const codeFilled = dom.onboardCommunityCode.value.trim() ? 1 : 0;
  const score = promptsFilled + prefFilled + codeFilled;
  const total = 8;
  const percent = Math.round((score / total) * 100);
  dom.onboardingProgress.textContent = `Setup progress: ${percent}% (${score}/${total} fields)`;
}

function applyOnboardingPreset(type) {
  if (type === 'low') {
    document.querySelector('#prompt-no-patience').value = 'Long plans and long explanations.';
    document.querySelector('#prompt-company').value = 'Quiet company for short hangs.';
    document.querySelector('#prompt-body').value = 'One small outing, then rest.';
    dom.onboardEnergyBaseline.value = 'low';
    dom.onboardCommunicationStyle.value = 'quick_checkins';
    dom.onboardAvailabilityWindow.value = 'afternoon';
  } else if (type === 'social') {
    document.querySelector('#prompt-company').value = 'Conversation, coffee, or a short walk.';
    document.querySelector('#prompt-before').value = 'Collect a few really good nights with people who get it.';
    dom.onboardEnergyBaseline.value = 'moderate';
    dom.onboardCommunicationStyle.value = 'mixed';
    dom.onboardAvailabilityWindow.value = 'evening';
  }
  updateOnboardingProgress();
}

function notify(userId, text) {
  const entry = { id: crypto.randomUUID(), userId, text, createdAt: Date.now(), readAt: null };
  state.notifications.unshift(entry);
  if (userId === state.currentUserId) maybeSendBrowserPush('Still Here', text);
}

function isMuted() {
  return (state.notificationMuteUntil || 0) > Date.now();
}

function parseMinutes(timeText) {
  const [h, m] = (timeText || '00:00').split(':').map((v) => Number(v));
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return (h * 60) + m;
}

function isWithinQuietHours() {
  const prefs = state.notificationPreferences || { quietHoursStart: '22:00', quietHoursEnd: '07:00' };
  const start = parseMinutes(prefs.quietHoursStart);
  const end = parseMinutes(prefs.quietHoursEnd);
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  if (start === end) return false;
  if (start < end) return minutesNow >= start && minutesNow < end;
  return minutesNow >= start || minutesNow < end;
}

function maybeSendBrowserPush(title, body) {
  const prefs = state.notificationPreferences || { deliveryMode: 'in_app' };
  if (prefs.deliveryMode !== 'in_app_and_push') return;
  if (isMuted() || isWithinQuietHours()) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body });
  } catch {
    // ignore browser notification errors in demo mode
  }
}

function muteNotificationsFor(days) {
  state.notificationMuteUntil = Date.now() + days * 24 * 60 * 60 * 1000;
  saveState();
  renderNotifications();
  renderGriefResources();
}

function maybeSendEventReminders() {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  let changed = false;
  state.eventReminderLog = state.eventReminderLog || [];
  state.events
    .filter((event) => event.status === 'active')
    .forEach((event) => {
      const msUntilStart = event.startsAt - now;
      if (msUntilStart <= oneDay && msUntilStart > 0) {
        (event.attendeeIds || []).forEach((userId) => {
          const key = `${event.id}:${userId}`;
          if (state.eventReminderLog.includes(key)) return;
          notify(userId, `Reminder: \"${event.title}\" is within 24 hours.`);
          state.eventReminderLog.push(key);
          changed = true;
        });
      }
    });
  if (changed) saveState();
}

function maybeEscalateSafetyCheckins() {
  const now = Date.now();
  let changed = false;
  state.safetyCheckins.forEach((item) => {
    if (item.status === 'active' && item.expiresAt < now) {
      item.status = 'missed';
      item.escalatedAt = now;
      notify(item.userId, `Safety timer expired. Reach out to ${item.contact} if you still need support.`);
      notify(item.userId, `Backup contact alert queued for ${item.contact} (demo).`);
      changed = true;
    }
  });
  if (changed) saveState();
}

function autoFlagIfScam(text, senderId, contextLabel) {
  const lowered = text.toLowerCase();
  const matchedPhrase = state.blockedPhrases.find((phrase) => lowered.includes(phrase));
  if (!matchedPhrase) return false;
  state.reports.push({ id: crypto.randomUUID(), reporterName: 'Auto-flagger', targetName: userById(senderId)?.name || 'Unknown', reason: `Possible scam phrase detected: \"${matchedPhrase}\" in ${contextLabel}`, createdAt: Date.now(), source: 'system', status: 'pending' });
  notify(senderId, "Still Here doesn't allow financial requests between users. This protects everyone.");
  return true;
}

function applyDisappearMode(user) {
  user.isActive = false;
  user.memorial.isMemorial = false;
  state.moments = state.moments.filter((moment) => moment.userId !== user.id);
  state.events.forEach((event) => {
    event.attendeeIds = (event.attendeeIds || []).filter((id) => id !== user.id);
    if (event.organizerId === user.id) event.status = 'cancelled';
  });
  state.responses = state.responses.filter((response) => response.responderId !== user.id);
  state.conversations
    .filter((conversation) => conversation.participantIds.includes(user.id))
    .forEach((conversation) => {
      conversation.memorialLocked = true;
      conversation.messages.push({
        id: crypto.randomUUID(),
        senderId: user.id,
        text: `${user.name}'s profile is no longer available per their disappear preference.`,
        createdAt: Date.now(),
      });
    });
}

function usersAreConnected(aId, bId) {
  return state.connections.some((connection) => (
    (connection.userAId === aId && connection.userBId === bId)
    || (connection.userAId === bId && connection.userBId === aId)
  ) && connection.status === 'connected');
}

function openDirectConversation(userAId, userBId) {
  const existing = state.conversations.find((conversation) => {
    const participants = conversation.participantIds || [];
    return participants.length === 2 && participants.includes(userAId) && participants.includes(userBId);
  });
  if (existing) return existing;
  const convo = {
    id: crypto.randomUUID(),
    participantIds: [userAId, userBId],
    memorialLocked: false,
    messages: [{ id: crypto.randomUUID(), senderId: userAId, text: 'Direct connection accepted. You can coordinate here.', createdAt: Date.now() }],
    createdAt: Date.now(),
  };
  state.conversations.unshift(convo);
  return convo;
}

function expireConnectionRequests() {
  const ttl = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  let changed = false;
  state.connectionRequests
    .filter((request) => request.status === 'pending' && now - request.createdAt > ttl)
    .forEach((request) => {
      request.status = 'expired';
      changed = true;
      const fromUser = userById(request.fromUserId);
      if (fromUser) notify(fromUser.id, 'A connection request expired after 7 days.');
    });
  if (changed) saveState();
}

function logConnectionActivity(type, actorId, targetId, details = '') {
  state.connectionActivity.unshift({
    id: crypto.randomUUID(),
    type,
    actorId,
    targetId,
    details,
    createdAt: Date.now(),
  });
  state.connectionActivity = state.connectionActivity.slice(0, 120);
}

function renderPartners() {
  const me = currentUser();
  if (!me) return;
  const filter = dom.partnerOfferFilter.value || 'all';
  const verifiedPartnerIds = new Set(state.partners.filter((partner) => partner.verified).map((partner) => partner.id));

  const offers = state.partnerOffers
    .filter((offer) => verifiedPartnerIds.has(offer.partnerId))
    .filter((offer) => {
      if (filter === 'all') return true;
      if (filter === 'low') return offer.energy === 'low';
      return offer.type === filter;
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  dom.partnerOfferList.textContent = '';
  if (!offers.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No partner offers match this filter right now.';
    dom.partnerOfferList.append(li);
  } else {
    offers.forEach((offer) => {
      const partner = state.partners.find((item) => item.id === offer.partnerId);
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${offer.title}</strong> <span class="pill">${offer.id}</span></p><p class="description">${offer.description}</p><p class="muted">${partner?.name || 'Unknown partner'} • ${offer.type.replace('_', ' ')} • ${offer.energy} energy</p>`;
      dom.partnerOfferList.append(li);
    });
  }

  dom.partnerBookingList.textContent = '';
  const myBookings = state.partnerBookings
    .filter((booking) => booking.userId === me.id)
    .sort((a, b) => b.createdAt - a.createdAt);
  if (!myBookings.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No partner requests yet.';
    dom.partnerBookingList.append(li);
  } else {
    myBookings.forEach((booking) => {
      const offer = state.partnerOffers.find((item) => item.id === booking.offerId);
      const partner = state.partners.find((item) => item.id === booking.partnerId);
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${offer?.title || 'Unknown offer'}</strong> <span class="pill">${booking.status}</span></p><p class="muted">${partner?.name || 'Unknown partner'} • requested ${new Date(booking.requestedAt).toLocaleString()} • submitted ${new Date(booking.createdAt).toLocaleString()}</p><p class="description">${booking.note || 'No additional note.'}</p>`;
      dom.partnerBookingList.append(li);
    });
  }
}

function findCommunityCodeRecord(code) {
  const normalized = (code || '').trim().toUpperCase();
  if (!normalized) return null;
  return state.communityCodes.find((entry) => entry.code.toUpperCase() === normalized && entry.status === 'active') || null;
}

function assignUserCommunityCode(user, rawCode) {
  const normalized = (rawCode || '').trim().toUpperCase();
  if (!normalized) return { ok: true, code: '' };
  const record = findCommunityCodeRecord(normalized);
  if (!record) return { ok: false, reason: 'Code not found or inactive.' };
  record.memberIds = record.memberIds || [];
  if (!record.memberIds.includes(user.id)) record.memberIds.push(user.id);
  user.communityCode = record.code;
  return { ok: true, code: record.code };
}

function connectionCompatibility(me, other) {
  const myPrefs = me.preferences || {};
  const otherPrefs = other.preferences || {};
  let score = 0;
  const reasons = [];

  if (myPrefs.energyBaseline && otherPrefs.energyBaseline && (myPrefs.energyBaseline === otherPrefs.energyBaseline || myPrefs.energyBaseline === 'variable' || otherPrefs.energyBaseline === 'variable')) {
    score += 2;
    reasons.push('energy compatible');
  }
  if (myPrefs.availabilityWindow && otherPrefs.availabilityWindow && (myPrefs.availabilityWindow === otherPrefs.availabilityWindow || myPrefs.availabilityWindow === 'flexible' || otherPrefs.availabilityWindow === 'flexible')) {
    score += 2;
    reasons.push('timing overlap');
  }
  if (myPrefs.communicationStyle && otherPrefs.communicationStyle && (myPrefs.communicationStyle === otherPrefs.communicationStyle || myPrefs.communicationStyle === 'mixed' || otherPrefs.communicationStyle === 'mixed')) {
    score += 2;
    reasons.push('conversation pace match');
  }
  if ((other.verificationStatus || 'basic') !== 'basic') {
    score += 1;
    reasons.push('verified profile');
  }
  if (me.communityCode && other.communityCode && me.communityCode === other.communityCode) {
    score += 3;
    reasons.push(`shared code ${me.communityCode}`);
  }

  return { score, reasons };
}

function renderConnections() {
  expireConnectionRequests();
  const me = currentUser();
  if (!me) return;
  const filter = dom.connectionFilter.value || 'all';
  const blockedByMe = new Set(state.blocks.filter((block) => block.blockerId === me.id).map((block) => block.blockedId));

  let suggested = state.users
    .filter((user) => user.id !== me.id)
    .filter((user) => user.isActive !== false)
    .filter((user) => !user.memorial?.isMemorial)
    .filter((user) => !blockedByMe.has(user.id))
    .filter((user) => !usersAreConnected(me.id, user.id))
    .filter((user) => !state.connectionRequests.some((request) => request.fromUserId === me.id && request.toUserId === user.id && request.status === 'pending'))
    .map((user) => ({ user, compatibility: connectionCompatibility(me, user) }));

  if (filter === 'verified') suggested = suggested.filter((entry) => ['verified', 'community_verified'].includes(entry.user.verificationStatus));
  if (filter === 'compatible_energy') suggested = suggested.filter((entry) => entry.compatibility.reasons.includes('energy compatible'));
  suggested = suggested.sort((a, b) => b.compatibility.score - a.compatibility.score).slice(0, 8);

  dom.connectionSuggestionList.textContent = '';
  if (!suggested.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No suggestions right now. Try changing the filter or check back later.';
    dom.connectionSuggestionList.append(li);
  } else {
    suggested.forEach((entry) => {
      const user = entry.user;
      const reasons = entry.compatibility.reasons.length ? entry.compatibility.reasons.join(' • ') : 'new connection';
      const li = document.createElement('li');
      li.className = 'item row';
      li.innerHTML = `<span><strong>${user.name}</strong> <span class="muted">${verificationBadge(user.verificationStatus)}</span><br /><span class="muted">match: ${reasons}</span></span>`;
      const button = document.createElement('button');
      button.className = 'ghost';
      button.textContent = 'Connect';
      button.addEventListener('click', () => {
        state.connectionRequests.push({
          id: crypto.randomUUID(),
          fromUserId: me.id,
          toUserId: user.id,
          note: 'from suggestions',
          status: 'pending',
          createdAt: Date.now(),
        });
        logConnectionActivity('request_sent', me.id, user.id, 'from suggestions');
        notify(me.id, `Connection request sent to ${user.name}.`);
        notify(user.id, `${me.name} sent you a connection request.`);
        saveState();
        renderAll();
      });
      li.append(button);
      dom.connectionSuggestionList.append(li);
    });
  }

  dom.incomingConnectionList.textContent = '';
  const incoming = state.connectionRequests
    .filter((request) => request.toUserId === me.id && request.status === 'pending')
    .sort((a, b) => b.createdAt - a.createdAt);
  if (!incoming.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No incoming connection requests.';
    dom.incomingConnectionList.append(li);
  } else {
    incoming.forEach((request) => {
      const fromUser = userById(request.fromUserId);
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${fromUser?.name || 'Unknown'}</strong>${request.note ? `: ${request.note}` : ''}</p>`;
      const row = document.createElement('div');
      row.className = 'row';
      const accept = document.createElement('button');
      accept.textContent = 'Accept';
      const decline = document.createElement('button');
      decline.className = 'ghost';
      decline.textContent = 'Decline';
      accept.addEventListener('click', () => {
        request.status = 'accepted';
        const now = Date.now();
        if (!usersAreConnected(request.fromUserId, request.toUserId)) {
          state.connections.push({
            id: crypto.randomUUID(),
            userAId: request.fromUserId,
            userBId: request.toUserId,
            status: 'connected',
            connectedVia: 'direct',
            createdAt: now,
            lastInteractionAt: now,
          });
        }
        const convo = openDirectConversation(request.fromUserId, request.toUserId);
        activeConversationId = convo.id;
        logConnectionActivity('request_accepted', me.id, request.fromUserId, 'accepted incoming request');
        if (fromUser) notify(fromUser.id, `${me.name} accepted your connection request.`);
        notify(me.id, `You connected with ${fromUser?.name || 'this user'}.`);
        saveState();
        renderAll();
      });
      decline.addEventListener('click', () => {
        request.status = 'declined';
        logConnectionActivity('request_declined', me.id, request.fromUserId, 'declined incoming request');
        if (fromUser) notify(fromUser.id, `${me.name} declined your connection request.`);
        saveState();
        renderConnections();
      });
      row.append(accept, decline);
      li.append(row);
      dom.incomingConnectionList.append(li);
    });
  }

  dom.outgoingConnectionList.textContent = '';
  const outgoing = state.connectionRequests
    .filter((request) => request.fromUserId === me.id)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10);
  if (!outgoing.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No outgoing requests yet.';
    dom.outgoingConnectionList.append(li);
  } else {
    outgoing.forEach((request) => {
      const target = userById(request.toUserId);
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${target?.name || 'Unknown'}</strong> <span class="pill">${request.status}</span></p><p class="muted">${new Date(request.createdAt).toLocaleString()}</p>`;
      if (request.status === 'pending') {
        const row = document.createElement('div');
        row.className = 'row';
        const cancel = document.createElement('button');
        cancel.className = 'ghost';
        cancel.textContent = 'Cancel request';
        cancel.addEventListener('click', () => {
          request.status = 'cancelled';
          logConnectionActivity('request_cancelled', me.id, request.toUserId, 'cancelled outgoing request');
          if (target) notify(target.id, `${me.name} cancelled a pending connection request.`);
          saveState();
          renderConnections();
        });
        row.append(cancel);
        li.append(row);
      }
      dom.outgoingConnectionList.append(li);
    });
  }

  dom.connectionList.textContent = '';
  const mine = state.connections
    .filter((connection) => connection.status === 'connected')
    .filter((connection) => connection.userAId === me.id || connection.userBId === me.id)
    .sort((a, b) => (b.lastInteractionAt || b.createdAt) - (a.lastInteractionAt || a.createdAt));
  if (!mine.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No direct connections yet.';
    dom.connectionList.append(li);
  } else {
    mine.forEach((connection) => {
      const otherId = connection.userAId === me.id ? connection.userBId : connection.userAId;
      const other = userById(otherId);
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${other?.name || 'Unknown'}</strong> <span class="muted">connected via ${connection.connectedVia}</span></p><p class="muted">last activity: ${new Date(connection.lastInteractionAt || connection.createdAt).toLocaleString()}</p>`;

      const row = document.createElement('div');
      row.className = 'row';
      const msgButton = document.createElement('button');
      msgButton.className = 'ghost';
      msgButton.textContent = 'Message';
      msgButton.addEventListener('click', () => {
        connection.lastInteractionAt = Date.now();
        const convo = openDirectConversation(me.id, otherId);
        activeConversationId = convo.id;
        activateTab('messages');
        saveState();
        renderConversations();
      });

      const removeBtn = document.createElement('button');
      removeBtn.className = 'ghost';
      removeBtn.textContent = 'Remove connection';
      removeBtn.addEventListener('click', () => {
        connection.status = 'removed';
        logConnectionActivity('connection_removed', me.id, otherId, 'removed direct connection');
        notify(me.id, `Connection removed with ${other?.name || 'user'}.`);
        if (other) notify(other.id, `${me.name} removed a direct connection.`);
        saveState();
        renderConnections();
      });

      row.append(msgButton, removeBtn);
      li.append(row);
      dom.connectionList.append(li);
    });
  }
}


function renderMoments() {
  const me = currentUser();
  const blockedByMe = new Set(state.blocks.filter((b) => b.blockerId === me.id).map((b) => b.blockedId));
  const filter = dom.feedFilter.value;
  const feed = state.moments
    .filter((m) => m.userId !== me.id)
    .filter((m) => !blockedByMe.has(m.userId))
    .filter((m) => filter === 'all' || m.category === filter)
    .filter((m) => userById(m.userId)?.isActive !== false)
    .filter((m) => !userById(m.userId)?.memorial?.isMemorial)
    .sort((a, b) => b.createdAt - a.createdAt);

  dom.momentList.textContent = '';
  if (!feed.length) {
    const li = document.createElement('li'); li.className = 'item'; li.textContent = 'No moments near you right now. Be the first — post what you want to do.'; dom.momentList.append(li); return;
  }

  feed.forEach((moment) => {
    const node = dom.momentTemplate.content.cloneNode(true);
    const owner = userById(moment.userId);
    node.querySelector('.title').textContent = moment.title;
    node.querySelector('.category').textContent = moment.category;
    node.querySelector('.energy').textContent = `energy: ${moment.energy}`;
    node.querySelector('.description').textContent = moment.description;
    node.querySelector('.meta').textContent = `by ${owner?.name ?? 'Unknown'} • ${verificationBadge(owner?.verificationStatus)}`;
    node.querySelector('.respond-btn').addEventListener('click', () => respondToMoment(moment.id));
    dom.momentList.append(node);
  });
}

function respondToMoment(momentId) {
  const me = currentUser();
  if (state.responses.some((r) => r.momentId === momentId && r.responderId === me.id)) {
    notify(me.id, 'You already responded to this moment.');
    return renderNotifications();
  }
  state.responses.push({ id: crypto.randomUUID(), momentId, responderId: me.id, status: 'pending', createdAt: Date.now() });
  const moment = state.moments.find((m) => m.id === momentId);
  notify(moment.userId, `${me.name} responded to "${moment.title}"`);
  saveState();
  notify(me.id, `Response sent for "${moment.title}".`);
  renderAll();
}

function renderEvents() {
  const me = currentUser();
  dom.eventList.textContent = '';
  const upcoming = state.events
    .filter((event) => event.status !== 'cancelled')
    .filter((event) => userById(event.organizerId)?.isActive !== false)
    .filter((event) => !userById(event.organizerId)?.memorial?.isMemorial)
    .sort((a, b) => a.startsAt - b.startsAt);

  if (!upcoming.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No events yet. Start one if you have the energy.';
    dom.eventList.append(li);
    activeEventId = null;
    renderEventThread();
    return;
  }

  if (!activeEventId || !upcoming.some((event) => event.id === activeEventId)) {
    activeEventId = upcoming[0].id;
  }

  upcoming.forEach((event) => {
    const organizer = userById(event.organizerId);
    const li = document.createElement('li');
    li.className = `item ${event.id === activeEventId ? 'active-item' : ''}`;
    const date = new Date(event.startsAt);
    const attendees = event.attendeeIds || [];
    const spotsLeft = Math.max(event.capacity - attendees.length, 0);
    li.innerHTML = `<strong>${event.title}</strong> <span class="pill">${event.type === 'virtual' ? 'virtual' : 'in person'}</span>
      <p class="description">${event.description || 'No extra details yet.'}</p>
      <p class="muted">${date.toLocaleString()} • host: ${organizer?.name || 'Unknown'} • ${spotsLeft} spots left</p>`;

    const row = document.createElement('div');
    row.className = 'row';
    const joined = attendees.includes(me.id);
    const status = document.createElement('span');
    status.className = 'muted';
    status.textContent = joined ? 'You are going.' : "Not RSVP'd yet.";
    row.append(status);

    const openBtn = document.createElement('button');
    openBtn.className = 'ghost';
    openBtn.textContent = 'Open';
    openBtn.addEventListener('click', () => {
      activeEventId = event.id;
      renderEvents();
    });
    row.append(openBtn);

    if (event.organizerId !== me.id && !joined && spotsLeft > 0) {
      const btn = document.createElement('button');
      btn.className = 'ghost';
      btn.textContent = 'RSVP';
      btn.addEventListener('click', () => {
        event.attendeeIds.push(me.id);
        notify(event.organizerId, `${me.name} RSVP'd to your event: ${event.title}.`);
        notify(me.id, `You joined "${event.title}".`);
        saveState();
        renderAll();
      });
      row.append(btn);
    }

    if (event.organizerId !== me.id && joined) {
      const leaveBtn = document.createElement('button');
      leaveBtn.className = 'ghost';
      leaveBtn.textContent = 'Leave';
      leaveBtn.addEventListener('click', () => {
        event.attendeeIds = event.attendeeIds.filter((id) => id !== me.id);
        notify(event.organizerId, `${me.name} left your event: ${event.title}.`);
        saveState();
        renderAll();
      });
      row.append(leaveBtn);
    }

    if (event.organizerId === me.id) {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'ghost';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => {
        event.status = 'cancelled';
        notify(me.id, `Event cancelled: ${event.title}.`);
        (event.attendeeIds || [])
          .filter((id) => id !== me.id)
          .forEach((id) => notify(id, `${me.name} cancelled the event "${event.title}".`));
        saveState();
        renderAll();
      });
      row.append(cancelBtn);
    }

    li.append(row);
    dom.eventList.append(li);
  });

  renderEventThread();
}

function renderEventThread() {
  const me = currentUser();
  const event = state.events.find((item) => item.id === activeEventId && item.status !== 'cancelled');
  dom.eventDetail.textContent = '';
  if (!event) {
    dom.eventDetail.classList.add('empty');
    dom.eventDetail.textContent = 'Pick an event to see attendees and chat.';
    dom.eventMessageInput.disabled = true;
    return;
  }
  dom.eventDetail.classList.remove('empty');
  event.attendeeIds = event.attendeeIds || [];
  event.messages = event.messages || [];
  const organizer = userById(event.organizerId);
  const attendeeNames = event.attendeeIds.map((id) => userById(id)?.name || 'Unknown').join(', ');
  const head = document.createElement('p');
  head.className = 'muted';
  head.textContent = `Host: ${organizer?.name || 'Unknown'} • Attendees: ${attendeeNames || 'none'}`;
  dom.eventDetail.append(head);

  event.messages.forEach((msg) => {
    const p = document.createElement('p');
    p.className = `bubble ${msg.senderId === me.id ? 'out' : 'in'}`;
    p.textContent = `${userById(msg.senderId)?.name || 'Unknown'}: ${msg.text}`;
    dom.eventDetail.append(p);
  });

  if (!event.messages.length) {
    const placeholder = document.createElement('p');
    placeholder.className = 'muted';
    placeholder.textContent = 'No event chat messages yet.';
    dom.eventDetail.append(placeholder);
  }

  const canChat = event.attendeeIds.includes(me.id);
  dom.eventMessageInput.disabled = !canChat;
  dom.eventMessageInput.placeholder = canChat
    ? 'Event chat: logistics, timing, and updates.'
    : 'RSVP to join this event chat.';
}

function renderResponses() {
  const me = currentUser();
  const mine = state.moments.filter((m) => m.userId === me.id).map((m) => m.id);
  const incoming = state.responses.filter((r) => mine.includes(r.momentId));
  dom.responseList.textContent = '';
  if (!incoming.length) {
    const li = document.createElement('li'); li.className = 'item'; li.textContent = 'No responses yet.'; dom.responseList.append(li); return;
  }
  incoming.forEach((res) => {
    const moment = state.moments.find((m) => m.id === res.momentId);
    const responder = userById(res.responderId);
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `<strong>${responder.name}</strong> wants to join <em>${moment.title}</em> — <span class="muted">${res.status}</span>`;
    if (res.status === 'pending') {
      const accept = document.createElement('button'); accept.textContent = 'Accept';
      const decline = document.createElement('button'); decline.textContent = 'Decline'; decline.className = 'ghost';
      accept.addEventListener('click', () => decideResponse(res.id, true));
      decline.addEventListener('click', () => decideResponse(res.id, false));
      const row = document.createElement('div'); row.className = 'row'; row.append(accept, decline);
      li.append(row);
    }
    dom.responseList.append(li);
  });
}

function decideResponse(responseId, accept) {
  const response = state.responses.find((r) => r.id === responseId);
  response.status = accept ? 'accepted' : 'declined';
  const moment = state.moments.find((m) => m.id === response.momentId);
  const responder = userById(response.responderId);
  if (accept) {
    const existing = state.conversations.find((c) => c.participantIds.includes(moment.userId) && c.participantIds.includes(response.responderId));
    if (!existing) {
      state.conversations.push({ id: crypto.randomUUID(), participantIds: [moment.userId, response.responderId], messages: [{ id: crypto.randomUUID(), senderId: moment.userId, text: `You connected through: ${moment.title}`, createdAt: Date.now() }] });
    }
    notify(response.responderId, `You're connected with ${userById(moment.userId).name}.`);
  } else {
    notify(response.responderId, `${userById(moment.userId).name} declined your response.`);
  }
  notify(moment.userId, `${responder.name} has been ${response.status}.`);
  saveState();
  renderAll();
}

function renderConversations() {
  const me = currentUser();
  const blocked = new Set(state.blocks.filter((b) => b.blockerId === me.id).map((b) => b.blockedId));
  const myConvos = state.conversations
    .filter((c) => c.participantIds.includes(me.id))
    .filter((c) => !blocked.has(c.participantIds.find((id) => id !== me.id)))
    .filter((c) => userById(c.participantIds.find((id) => id !== me.id))?.isActive !== false);

  dom.conversationList.textContent = '';
  if (!myConvos.length) {
    const li = document.createElement('li'); li.className = 'item'; li.textContent = 'No conversations yet. Find a moment that speaks to you.'; dom.conversationList.append(li);
    dom.thread.textContent = '';
    return;
  }

  myConvos.forEach((c) => {
    const other = userById(c.participantIds.find((id) => id !== me.id));
    const memorialFlag = other.memorial?.isMemorial ? ' • memorial' : '';
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = `${other.name} • ${verificationBadge(other.verificationStatus)}${memorialFlag}`;
    li.addEventListener('click', () => {
      activeConversationId = c.id;
      renderThread();
    });
    dom.conversationList.append(li);
  });

  if (!activeConversationId || !myConvos.some((c) => c.id === activeConversationId)) activeConversationId = myConvos[0].id;
  renderThread();
}

function renderThread() {
  const convo = state.conversations.find((c) => c.id === activeConversationId);
  const me = currentUser();
  dom.thread.textContent = '';
  if (!convo) return;
  const locked = convo.memorialLocked;
  dom.messageInput.disabled = !!locked;
  dom.messageImage.disabled = !!locked;
  dom.messageAttachmentStatus.textContent = '';
  dom.messageInput.placeholder = locked ? 'This conversation is now memorialized and read-only.' : "Say whatever you want. There's no wrong way to start.";
  convo.messages.forEach((msg) => {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${msg.senderId === me.id ? 'out' : 'in'}`;
    const text = document.createElement('p');
    text.textContent = msg.text;
    text.className = 'bubble-text';
    bubble.append(text);
    if (msg.imageDataUrl) {
      const image = document.createElement('img');
      image.src = msg.imageDataUrl;
      image.alt = 'Shared in chat';
      image.className = 'chat-image';
      bubble.append(image);
    }
    dom.thread.append(bubble);
  });
}

function renderSafetyCheckins() {
  const me = currentUser();
  dom.safetyCheckinList.textContent = '';
  const list = state.safetyCheckins
    .filter((item) => item.userId === me.id)
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt);

  if (!list.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No active check-in timers.';
    dom.safetyCheckinList.append(li);
    return;
  }

  list.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'item row';
    const expires = new Date(item.expiresAt).toLocaleString();
    const status = item.status === 'active' && item.expiresAt < Date.now() ? 'missed' : item.status;
    const location = item.location ? ` • meetup: ${item.location}` : '';
    const note = item.note ? `<br /><span class="muted">Note: ${item.note}</span>` : '';
    li.innerHTML = `<span><strong>${item.contact}</strong><br /><span class="muted">Timer: ${item.minutes} min • ends ${expires} • ${status}${location}</span>${note}</span>`;
    if (item.status === 'active') {
      const markSafeBtn = document.createElement('button');
      markSafeBtn.className = 'ghost';
      markSafeBtn.textContent = 'Mark safe';
      markSafeBtn.addEventListener('click', () => {
        item.status = 'checked_in';
        item.checkedInAt = Date.now();
        notify(me.id, `Check-in marked safe. ${item.contact} will not be alerted.`);
        saveState();
        renderSafetyCheckins();
        renderNotifications();
  renderGriefResources();
      });
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'ghost';
      cancelBtn.textContent = 'Cancel timer';
      cancelBtn.addEventListener('click', () => {
        item.status = 'cancelled';
        notify(me.id, 'Safety timer cancelled.');
        saveState();
        renderSafetyCheckins();
        renderNotifications();
  renderGriefResources();
      });
      li.append(markSafeBtn, cancelBtn);
    }
    dom.safetyCheckinList.append(li);
  });
}

function renderNotifications() {
  const me = currentUser();
  const list = state.notifications
    .filter((n) => n.userId === me.id)
    .sort((a, b) => (Number(!b.readAt) - Number(!a.readAt)) || (b.createdAt - a.createdAt));
  const muted = isMuted();
  const prefs = state.notificationPreferences || { deliveryMode: 'in_app', quietHoursStart: '22:00', quietHoursEnd: '07:00' };

  dom.notifDeliveryMode.value = prefs.deliveryMode;
  dom.notifQuietStart.value = prefs.quietHoursStart;
  dom.notifQuietEnd.value = prefs.quietHoursEnd;

  const unreadCount = list.filter((n) => !n.readAt).length;
  const quietLabel = isWithinQuietHours() ? 'quiet hours active' : 'quiet hours inactive';
  dom.notifPrefStatus.textContent = `Unread: ${unreadCount} • ${quietLabel} • delivery: ${prefs.deliveryMode === 'in_app_and_push' ? 'in-app + browser push' : 'in-app only'}.`;

  dom.notificationList.textContent = '';
  if (muted) {
    const until = new Date(state.notificationMuteUntil).toLocaleString();
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = `Notifications are muted until ${until}.`;
    dom.notificationList.append(li);
    return;
  }
  if (!list.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No notifications yet.';
    dom.notificationList.append(li);
    return;
  }

  list.forEach((n) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `<p>${n.text}</p><p class="muted">${new Date(n.createdAt).toLocaleString()} • ${n.readAt ? 'read' : 'unread'}</p>`;
    const row = document.createElement('div');
    row.className = 'row';
    if (!n.readAt) {
      const markRead = document.createElement('button');
      markRead.className = 'ghost';
      markRead.textContent = 'Mark read';
      markRead.addEventListener('click', () => {
        n.readAt = Date.now();
        saveState();
        renderNotifications();
      });
      row.append(markRead);
    }
    li.append(row);
    dom.notificationList.append(li);
  });

  dom.digestFrequency.value = state.digestPreference?.frequency || 'off';
  dom.digestStatus.textContent = state.digestPreference?.lastSentAt
    ? `Last digest sent: ${new Date(state.digestPreference.lastSentAt).toLocaleString()}`
    : 'No digests sent yet.';
}


function renderCareCircle() {
  const me = currentUser();
  me.caregivers = me.caregivers || [];
  dom.caregiverList.textContent = '';
  if (!me.caregivers.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No caregivers added yet.';
    dom.caregiverList.append(li);
  } else {
    me.caregivers.slice().sort((a, b) => b.addedAt - a.addedAt).forEach((caregiver) => {
      const li = document.createElement('li');
      li.className = 'item row';
      li.innerHTML = `<span><strong>${caregiver.name}</strong> <span class="muted">${caregiver.relationship || 'caregiver'} • ${caregiver.contact}</span></span>`;
      const removeBtn = document.createElement('button');
      removeBtn.className = 'ghost';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        me.caregivers = me.caregivers.filter((entry) => entry.id !== caregiver.id);
        saveState();
        renderCareCircle();
      });
      li.append(removeBtn);
      dom.caregiverList.append(li);
    });
  }

  dom.caregiverSnapshot.textContent = '';
  if (!me.allowCaregiverView) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'Caregiver updates are turned off in Profile.';
    dom.caregiverSnapshot.append(li);
  } else {
    const latestMoment = state.moments.filter((m) => m.userId === me.id).sort((a, b) => b.createdAt - a.createdAt)[0];
    const activeEvents = state.events.filter((event) => event.status === 'active' && event.attendeeIds?.includes(me.id));
    const pendingResponses = state.responses.filter((response) => response.status === 'pending' && state.moments.some((moment) => moment.id === response.momentId && moment.userId === me.id));

    [
      `Latest moment: ${latestMoment ? latestMoment.title : 'none yet'}`,
      `Active events joined: ${activeEvents.length}`,
      `Pending responses to your moments: ${pendingResponses.length}`,
      `Memorial preference: ${me.memorial?.preference || 'undecided'}`,
    ].forEach((line) => {
      const li = document.createElement('li');
      li.className = 'item';
      li.textContent = line;
      dom.caregiverSnapshot.append(li);
    });
  }

  dom.careUpdateList.textContent = '';
  const filter = dom.careUpdateFilter.value || 'all';
  const isOverdue = (update) => update.status === 'open' && update.neededBy && update.neededBy < Date.now();
  const updates = state.careUpdates
    .filter((update) => update.userId === me.id)
    .filter((update) => {
      if (filter === 'all') return true;
      if (filter === 'overdue') return isOverdue(update);
      return update.status === filter;
    })
    .slice()
    .sort((a, b) => {
      const overdueDelta = Number(isOverdue(b)) - Number(isOverdue(a));
      if (overdueDelta) return overdueDelta;
      if (a.status === 'open' && b.status === 'open' && a.neededBy && b.neededBy) return a.neededBy - b.neededBy;
      return b.createdAt - a.createdAt;
    });

  if (!updates.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = filter === 'all' ? 'No care updates posted yet.' : `No ${filter} care updates.`;
    dom.careUpdateList.append(li);
    return;
  }

  updates.forEach((update) => {
    const li = document.createElement('li');
    li.className = 'item';
    const dueLabel = update.neededBy ? new Date(update.neededBy).toLocaleString() : 'no deadline';
    const overdue = isOverdue(update);
    li.innerHTML = `<div class="row"><strong>${update.text}</strong> <span class="pill">${update.urgency} urgency</span></div><p class="muted">${new Date(update.createdAt).toLocaleString()} • needed by: ${dueLabel} • status: ${overdue ? 'overdue' : update.status}</p>`;
    if (update.status === 'open') {
      const markDone = document.createElement('button');
      markDone.className = 'ghost';
      markDone.textContent = 'Mark handled';
      markDone.addEventListener('click', () => {
        update.status = 'handled';
        saveState();
        renderCareCircle();
        renderAdmin();
      });
      li.append(markDone);
    }
    dom.careUpdateList.append(li);
  });
}


function renderVerificationHistory() {
  const me = currentUser();
  dom.verificationHistoryList.textContent = '';
  const requests = (state.verificationRequests || []).filter((entry) => entry.userId === me.id).sort((a, b) => b.createdAt - a.createdAt);
  const pending = requests.find((entry) => entry.status === 'pending');
  dom.verificationRequestStatus.textContent = pending
    ? `Pending ${verificationBadge(pending.requestedLevel)} request submitted ${new Date(pending.createdAt).toLocaleString()}.`
    : 'No pending verification request.';
  dom.verificationRequestCancelBtn.disabled = !pending;

  if (!requests.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No verification requests yet.';
    dom.verificationHistoryList.append(li);
    return;
  }

  requests.forEach((request) => {
    const li = document.createElement('li');
    li.className = 'item';
    const status = request.status || 'pending';
    const note = request.note ? ` • ${request.note}` : '';
    const reviewed = request.reviewedAt ? ` • reviewed ${new Date(request.reviewedAt).toLocaleString()}` : '';
    li.innerHTML = `<p><strong>${verificationBadge(request.requestedLevel)}</strong> <span class="pill">${status}</span></p><p class="muted">${new Date(request.createdAt).toLocaleString()}${note}${reviewed}</p>`;
    dom.verificationHistoryList.append(li);
  });
}

function renderProfile() {
  const me = currentUser();
  dom.profileCard.innerHTML = `
    <p><strong>${me.name}</strong> (${me.email})</p>
    <p class="muted">Verification: ${verificationBadge(me.verificationStatus)}</p>
    <p class="muted">I have no patience for: ${me.prompts?.noPatience || '—'}</p>
    <p class="muted">I want company for: ${me.prompts?.company || '—'}</p>
    <p class="muted">Today my body can handle: ${me.prompts?.body || '—'}</p>
    <p class="muted">Before I go, I want to: ${me.prompts?.before || '—'}</p>
    <p class="muted">Energy baseline: ${me.preferences?.energyBaseline || 'variable'}</p>
    <p class="muted">Best time: ${me.preferences?.availabilityWindow || 'flexible'}</p>
    <p class="muted">Conversation pace: ${me.preferences?.communicationStyle || 'mixed'}</p>
    <p class="muted">Community code: ${me.communityCode || 'none'}</p>
    <p class="muted">Last active: ${me.lastActiveAt ? new Date(me.lastActiveAt).toLocaleString() : 'now'}</p>
  `;
  dom.allowCaregiverView.checked = !!me.allowCaregiverView;
  dom.themeSelect.value = state.theme || 'dark';
  dom.textSizeSelect.value = state.accessibility?.textSize || 'normal';
  dom.highContrastToggle.checked = !!state.accessibility?.highContrast;
  dom.reducedMotionToggle.checked = !!state.accessibility?.reducedMotion;
  dom.profileVerificationStatus.textContent = verificationBadge(me.verificationStatus || 'basic');
  renderVerificationHistory();
  const isSoftDeleted = !!me.isSoftDeleted;
  dom.cancelDeletionBtn.classList.toggle('hidden', !isSoftDeleted);
  dom.communityCodeStatus.textContent = me.communityCode ? `Connected via code ${me.communityCode}.` : 'No community code linked yet.';
  dom.accountStatus.textContent = isSoftDeleted
    ? `Deletion requested. Hard delete scheduled for ${new Date(me.hardDeleteAt).toLocaleString()}.`
    : 'Account active. You can export your data or request account deletion.';
}

function renderMemorial() {
  const me = currentUser();
  me.memorial = me.memorial || { preference: 'undecided', message: '', designatedName: '', designatedContact: '', isMemorial: false, memories: [] };
  dom.memorialPreference.value = me.memorial.preference || 'undecided';
  dom.memorialMessage.value = me.memorial.message || '';
  dom.designatedName.value = me.memorial.designatedName || '';
  dom.designatedContact.value = me.memorial.designatedContact || '';

  const status = me.memorial.isMemorial ? 'Memorial is active.' : 'Memorial is not active.';
  const message = me.memorial.message || 'No memorial message set yet.';
  dom.memorialPreview.innerHTML = `<p><strong>Status:</strong> ${status}</p><p class="muted">${message}</p>`;

  dom.memoryList.textContent = '';
  const memories = me.memorial.memories || [];
  if (!memories.length) {
    const li = document.createElement('li'); li.className = 'item'; li.textContent = 'No memories yet.'; dom.memoryList.append(li);
  } else {
    memories.slice().reverse().forEach((memory) => {
      const li = document.createElement('li');
      li.className = 'item';
      li.textContent = `${memory.author}: ${memory.text}`;
      dom.memoryList.append(li);
    });
  }

  dom.memorialWallList.textContent = '';
  dom.memorialWallMemoryList.textContent = '';
  const memorialUsers = state.users.filter((user) => user.memorial?.isMemorial);

  const currentViewOptions = new Set([...(dom.memorialWallView?.options || [])].map((option) => option.value));
  if (!currentViewOptions.has('all')) {
    dom.memorialWallView.innerHTML = '<option value="all">all memorials</option>';
  }
  const selected = dom.memorialWallView.value || 'all';
  dom.memorialWallView.innerHTML = '<option value="all">all memorials</option>';
  memorialUsers.forEach((user) => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.name;
    dom.memorialWallView.append(option);
  });
  dom.memorialWallView.value = memorialUsers.some((user) => user.id === selected) ? selected : 'all';

  if (!memorialUsers.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No memorial pages are active yet.';
    dom.memorialWallList.append(li);
    return;
  }

  const visibleUsers = dom.memorialWallView.value === 'all'
    ? memorialUsers
    : memorialUsers.filter((user) => user.id === dom.memorialWallView.value);

  visibleUsers.forEach((user) => {
    const li = document.createElement('li');
    li.className = 'item';
    const memoriesCount = (user.memorial?.memories || []).filter((memory) => (memory.status || 'visible') === 'visible').length;
    const messagePreview = user.memorial?.message || 'No memorial message set.';
    li.innerHTML = `<strong>${user.name}</strong> <span class="pill">memorial</span><p class="description">${messagePreview}</p><p class="muted">memories: ${memoriesCount}</p>`;
    dom.memorialWallList.append(li);

    const memories = (user.memorial?.memories || [])
      .filter((memory) => (memory.status || 'visible') === 'visible')
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);
    if (!memories.length) return;
    memories.forEach((memory) => {
      const memoryNode = document.createElement('li');
      memoryNode.className = 'item';
      memoryNode.textContent = `${user.name} • ${memory.author}: ${memory.text}`;
      dom.memorialWallMemoryList.append(memoryNode);
    });
  });

  if (!dom.memorialWallMemoryList.children.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No memories posted yet for the selected memorial.';
    dom.memorialWallMemoryList.append(li);
  }

}


function activateMemorialForUser(userId, activatedBy = 'moderator') {
  const user = userById(userId);
  if (!user || user.memorial?.isMemorial || user.isActive === false) return;
  user.memorial = user.memorial || { preference: 'undecided', message: '', designatedName: '', designatedContact: '', isMemorial: false, memories: [] };
  user.memorial.isMemorial = true;
  user.memorial.activatedBy = activatedBy;
  user.memorial.activatedAt = Date.now();
  state.events.forEach((event) => {
    if (event.organizerId === user.id) event.status = 'cancelled';
    event.attendeeIds = (event.attendeeIds || []).filter((id) => id !== user.id);
  });
  state.conversations
    .filter((conversation) => conversation.participantIds.includes(user.id))
    .forEach((conversation) => {
      conversation.memorialLocked = true;
      conversation.messages.push({
        id: crypto.randomUUID(),
        senderId: user.id,
        text: `${user.name} is no longer with us. Their memorial is open if you'd like to visit it.`,
        createdAt: Date.now(),
      });
    });
  notify(user.id, 'Your profile has been set to memorial mode by moderation (demo).');
}

function logModerationAction(actionType, details) {
  state.moderationActions.unshift({
    id: crypto.randomUUID(),
    actionType,
    details,
    createdAt: Date.now(),
    moderatorId: state.currentUserId,
  });
  state.moderationActions = state.moderationActions.slice(0, 300);
}

function collectPendingModerationItems() {
  const items = [];
  state.reports
    .filter((report) => report.status === 'pending')
    .forEach((report) => {
      items.push({
        id: `report:${report.id}`,
        type: 'report',
        createdAt: report.createdAt,
        searchText: `${report.targetName} ${report.reason} ${report.reporterName}`.toLowerCase(),
        label: `${report.targetName} • ${report.reason}`,
        payload: report,
      });
    });

  state.users
    .filter((user) => user.memorial?.isMemorial)
    .forEach((user) => {
      (user.memorial?.memories || [])
        .filter((memory) => memory.status === 'pending')
        .forEach((memory) => {
          items.push({
            id: `memorial_memory:${user.id}:${memory.id}`,
            type: 'memorial_memory',
            createdAt: memory.createdAt,
            searchText: `${user.name} ${memory.author} ${memory.text}`.toLowerCase(),
            label: `${user.name} memorial • ${memory.author}: ${memory.text}`,
            payload: { user, memory },
          });
        });
    });

  state.careUpdates
    .filter((update) => update.status === 'open')
    .forEach((update) => {
      const owner = userById(update.userId);
      items.push({
        id: `care_update:${update.id}`,
        type: 'care_update',
        createdAt: update.createdAt,
        searchText: `${owner?.name || ''} ${update.text} ${update.urgency}`.toLowerCase(),
        label: `${owner?.name || 'Unknown'} • ${update.text} (${update.urgency})`,
        payload: { update, owner },
      });
    });

  state.partners
    .filter((partner) => !partner.verified)
    .forEach((partner) => {
      items.push({
        id: `partner_review:${partner.id}`,
        type: 'partner_review',
        createdAt: Date.now(),
        searchText: `${partner.name} ${partner.type} ${partner.notes || ''}`.toLowerCase(),
        label: `${partner.name} • ${partner.type.replace('_', ' ')}`,
        payload: partner,
      });
    });

  state.partnerBookings
    .filter((booking) => booking.status === 'pending')
    .forEach((booking) => {
      const user = userById(booking.userId);
      const offer = state.partnerOffers.find((entry) => entry.id === booking.offerId);
      items.push({
        id: `partner_booking:${booking.id}`,
        type: 'partner_booking',
        createdAt: booking.createdAt,
        searchText: `${user?.name || ''} ${offer?.title || ''} ${booking.note || ''}`.toLowerCase(),
        label: `${user?.name || 'Unknown'} booking ${offer?.title || 'offer'}`,
        payload: { booking, user, offer },
      });
    });

  state.communityCodeRequests
    .filter((request) => request.status === 'pending')
    .forEach((request) => {
      const user = userById(request.userId);
      items.push({
        id: `community_code:${request.id}`,
        type: 'community_code',
        createdAt: request.createdAt,
        searchText: `${user?.name || ''} ${request.code}`.toLowerCase(),
        label: `${user?.name || 'Unknown'} requested ${request.code}`,
        payload: { request, user },
      });
    });


  state.verificationRequests
    .filter((request) => request.status === 'pending')
    .forEach((request) => {
      const user = userById(request.userId);
      items.push({
        id: `verification_request:${request.id}`,
        type: 'verification_request',
        createdAt: request.createdAt,
        searchText: `${user?.name || ''} ${request.requestedLevel} ${request.note || ''}`.toLowerCase(),
        label: `${user?.name || 'Unknown'} requested ${verificationBadge(request.requestedLevel)}`,
        payload: { request, user },
      });
    });

  return items.sort((a, b) => b.createdAt - a.createdAt);
}

function moderateInboxItem(item, decision) {
  const me = currentUser();
  if (!item) return;

  if (item.type === 'report') {
    item.payload.status = decision === 'approve' ? 'resolved' : 'dismissed';
    const reporter = state.users.find((user) => user.name === item.payload.reporterName);
    if (reporter) notify(reporter.id, `Your report was ${decision === 'approve' ? 'resolved' : 'dismissed'} by moderation.`);
    logModerationAction(`report_${item.payload.status}`, item.label);
  } else if (item.type === 'memorial_memory') {
    item.payload.memory.status = decision === 'approve' ? 'visible' : 'removed';
    logModerationAction(`memorial_memory_${item.payload.memory.status}`, item.label);
  } else if (item.type === 'care_update') {
    item.payload.update.status = decision === 'approve' ? 'handled' : 'dismissed';
    if (item.payload.owner) notify(item.payload.owner.id, `Your care update was ${decision === 'approve' ? 'handled' : 'dismissed'} by support.`);
    logModerationAction(`care_update_${item.payload.update.status}`, item.label);
  } else if (item.type === 'partner_review') {
    if (decision === 'approve') {
      item.payload.verified = true;
      logModerationAction('partner_verified', item.label);
    } else {
      state.partners = state.partners.filter((entry) => entry.id !== item.payload.id);
      state.partnerOffers = state.partnerOffers.filter((offer) => offer.partnerId !== item.payload.id);
      logModerationAction('partner_rejected', item.label);
    }
  } else if (item.type === 'partner_booking') {
    item.payload.booking.status = decision === 'approve' ? 'approved' : 'declined';
    if (item.payload.user) notify(item.payload.user.id, `Partner request ${decision === 'approve' ? 'approved' : 'declined'}: ${item.payload.offer?.title || 'offer'}.`);
    logModerationAction(`partner_booking_${item.payload.booking.status}`, item.label);
  } else if (item.type === 'verification_request') {
    item.payload.request.status = decision === 'approve' ? 'approved' : 'rejected';
    item.payload.request.reviewedAt = Date.now();
    item.payload.request.reviewedBy = state.currentUserId;
    if (item.payload.user) {
      item.payload.user.verificationRequestStatus = item.payload.request.status;
      if (decision === 'approve') item.payload.user.verificationStatus = item.payload.request.requestedLevel;
      notify(item.payload.user.id, `Verification request ${item.payload.request.status}: ${verificationBadge(item.payload.request.requestedLevel)}.`);
    }
    logModerationAction(`verification_request_${item.payload.request.status}`, item.label);
  } else if (item.type === 'community_code') {
    if (decision === 'approve') {
      let codeRecord = findCommunityCodeRecord(item.payload.request.code);
      if (!codeRecord) {
        codeRecord = { id: crypto.randomUUID(), code: item.payload.request.code, label: item.payload.request.code.toLowerCase().replace(/-/g, ' '), status: 'active', memberIds: [] };
        state.communityCodes.push(codeRecord);
      }
      if (item.payload.user) assignUserCommunityCode(item.payload.user, item.payload.request.code);
      item.payload.request.status = 'approved';
      if (item.payload.user) notify(item.payload.user.id, `Community code approved: ${item.payload.request.code}.`);
      logModerationAction('community_code_approved', item.label);
    } else {
      item.payload.request.status = 'rejected';
      if (item.payload.user) notify(item.payload.user.id, `Community code request rejected: ${item.payload.request.code}.`);
      logModerationAction('community_code_rejected', item.label);
    }
  }

  if (me) notify(me.id, `Moderation action complete: ${item.type.replace('_', ' ')}.`);
  saveState();
  renderAll();
}

function renderModerationInbox() {
  const filter = dom.adminInboxFilter.value || 'all';
  const query = (dom.adminInboxSearch.value || '').trim().toLowerCase();
  let items = collectPendingModerationItems();
  if (filter !== 'all') items = items.filter((item) => item.type === filter);
  if (query) items = items.filter((item) => item.searchText.includes(query));

  dom.adminInboxList.textContent = '';
  if (!items.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No moderation inbox items for this filter.';
    dom.adminInboxList.append(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `<p><strong>${item.type.replace('_', ' ')}</strong> • ${item.label}</p><p class="muted">${new Date(item.createdAt).toLocaleString()}</p>`;
    const row = document.createElement('div');
    row.className = 'row';
    const approve = document.createElement('button');
    approve.textContent = 'Approve';
    const reject = document.createElement('button');
    reject.className = 'ghost';
    reject.textContent = 'Reject';
    approve.addEventListener('click', () => moderateInboxItem(item, 'approve'));
    reject.addEventListener('click', () => moderateInboxItem(item, 'reject'));
    row.append(approve, reject);
    li.append(row);
    dom.adminInboxList.append(li);
  });
}

function renderInactivityQueue() {
  refreshInactivityFlags();
  const filter = dom.adminInactivityFilter.value || 'all';
  let flags = state.inactivityFlags.slice();
  if (filter === 'watch') flags = flags.filter((flag) => flag.severity === 'watch');
  if (filter === 'critical') flags = flags.filter((flag) => flag.severity === 'critical');
  if (filter === 'escalated') flags = flags.filter((flag) => flag.status === 'escalated');

  dom.adminInactivityList.textContent = '';
  if (!flags.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No inactivity flags for this filter.';
    dom.adminInactivityList.append(li);
    return;
  }

  flags.forEach((flag) => {
    const user = userById(flag.userId);
    const li = document.createElement('li');
    li.className = 'item';
    const lastActive = new Date(flag.lastActiveAt).toLocaleString();
    li.innerHTML = `<p><strong>${user?.name || 'Unknown user'}</strong> <span class="pill">${flag.severity}</span> <span class="pill">${flag.status}</span></p><p class="muted">Last active: ${lastActive}</p>`;
    const row = document.createElement('div');
    row.className = 'row';

    const ping = document.createElement('button');
    ping.className = 'ghost';
    ping.textContent = 'Send check-in';
    ping.addEventListener('click', () => {
      notify(flag.userId, 'Check-in reminder from moderation: tap in when you can.');
      flag.checkinSentAt = Date.now();
      flag.updatedAt = Date.now();
      logModerationAction('inactivity_checkin_sent', `${user?.name || flag.userId}`);
      saveState();
      renderAll();
    });

    const markSafe = document.createElement('button');
    markSafe.className = 'ghost';
    markSafe.textContent = 'Mark safe';
    markSafe.addEventListener('click', () => {
      flag.status = 'resolved';
      flag.updatedAt = Date.now();
      logModerationAction('inactivity_resolved', `${user?.name || flag.userId}`);
      saveState();
      renderAll();
    });

    const escalate = document.createElement('button');
    escalate.textContent = 'Escalate';
    escalate.addEventListener('click', () => {
      flag.status = 'escalated';
      flag.escalatedAt = Date.now();
      flag.updatedAt = Date.now();
      if (user) notify(user.id, 'Your account was flagged for inactivity review. Reach out or check in when you can.');
      logModerationAction('inactivity_escalated', `${user?.name || flag.userId}`);
      saveState();
      renderAll();
    });

    row.append(ping, markSafe, escalate);
    li.append(row);
    dom.adminInactivityList.append(li);
  });
}


function renderIncidentDrills() {
  dom.incidentDrillList.textContent = '';
  const drills = (state.incidentDrills || []).slice(0, 10);
  if (!drills.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No incident drills run yet.';
    dom.incidentDrillList.append(li);
    return;
  }
  drills.forEach((drill) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `<p><strong>${drill.type.replace('_', ' ')}</strong> <span class="pill">${drill.severity}</span> <span class="pill">${drill.status}</span></p><p class="muted">${new Date(drill.createdAt).toLocaleString()}${drill.note ? ` • ${drill.note}` : ''}</p>`;
    dom.incidentDrillList.append(li);
  });
}

function launchReadinessMetrics() {
  const risks = state.riskRegister || [];
  const openHigh = risks.filter((risk) => risk.status !== 'mitigated' && risk.severity === 'high').length;
  const openTotal = risks.filter((risk) => risk.status !== 'mitigated').length;
  const recentDrills = (state.incidentDrills || []).filter((drill) => Date.now() - drill.createdAt < 14 * 24 * 60 * 60 * 1000).length;
  const completion = calculateRoadmapMetrics().pct;
  const openBlockers = (state.executionBlockers || []).filter((b) => b.status !== 'resolved').length;
  const score = Math.max(0, 100 - openHigh * 20 - openTotal * 5 - openBlockers * 6 + Math.min(recentDrills * 4, 12) + Math.floor(completion / 10));
  return { openHigh, openTotal, recentDrills, openBlockers, score };
}

function renderAdmin() {
  dom.adminReportList.textContent = '';
  const list = state.reports.slice().reverse();
  const pending = list.filter((report) => (report.status || 'pending') === 'pending');
  const pendingMemorialReviews = state.users
    .filter((user) => user.memorial?.isMemorial)
    .flatMap((user) => (user.memorial?.memories || []).map((memory) => ({ user, memory })))
    .filter((entry) => (entry.memory.status || 'visible') === 'pending');
  const openCareUpdatesCount = state.careUpdates.filter((update) => update.status === 'open').length;
  const unresolvedInactivity = state.inactivityFlags.filter((flag) => ['open', 'escalated'].includes(flag.status)).length;
  dom.queueCount.textContent = String(collectPendingModerationItems().length + unresolvedInactivity);

  const activeUsers = state.users.filter((user) => user.isActive !== false && !user.memorial?.isMemorial).length;
  const memorialUsers = state.users.filter((user) => user.memorial?.isMemorial).length;
  const inactiveUsers = state.users.filter((user) => user.isActive === false).length;
  const activeEvents = state.events.filter((event) => event.status === 'active').length;
  const activeConnections = state.connections.filter((connection) => connection.status === 'connected').length;
  const pendingConnectionRequests = state.connectionRequests.filter((request) => request.status === 'pending').length;
  const verifiedPartners = state.partners.filter((partner) => partner.verified).length;
  const pendingPartnerBookings = state.partnerBookings.filter((booking) => booking.status === 'pending').length;
  const { milestones: mvpWorkstreams, done: completedStreams, pct: completionPct } = calculateRoadmapMetrics();
  const remainingLabels = mvpWorkstreams.filter((item) => item.status !== 'done').map((item) => item.title).slice(0, 3);
  const readinessLabel = calculateRoadmapMetrics().readiness.releaseCandidate ? 'release candidate' : 'not release-ready';
  const leftCount = (state.deliveryBacklog || []).filter((item) => item.status !== 'done').length;
  const qualityPassing = (state.qualityGateSuites || []).filter((suite) => suite.status === 'pass').length;
  dom.adminProgressReport.textContent = `Completion ${completionPct}% (${completedStreams}/${mvpWorkstreams.length} streams). Remaining focus: ${remainingLabels.join(', ') || 'none'}. Status: ${readinessLabel}. Left implementation items: ${leftCount}. Quality pass suites: ${qualityPassing}/${(state.qualityGateSuites || []).length}.`;

  const launch = launchReadinessMetrics();
  dom.adminLaunchStatus.textContent = `Launch readiness score: ${launch.score}/100 • open high risks: ${launch.openHigh} • open risks total: ${launch.openTotal} • open blockers: ${launch.openBlockers} • drills in last 14 days: ${launch.recentDrills}.`;

  dom.adminRiskList.textContent = '';
  const risks = (state.riskRegister || []).slice().sort((a, b) => b.createdAt - a.createdAt);
  if (!risks.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No risks logged.';
    dom.adminRiskList.append(li);
  } else {
    risks.forEach((risk) => {
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${risk.title}</strong> <span class="pill">${risk.severity}</span> <span class="pill">${risk.status}</span></p><p class="muted">Mitigation: ${risk.mitigation || 'none'} • logged ${new Date(risk.createdAt).toLocaleString()}</p>`;
      const row = document.createElement('div');
      row.className = 'row';
      const mitigate = document.createElement('button');
      mitigate.textContent = 'Mark mitigated';
      mitigate.addEventListener('click', () => {
        risk.status = 'mitigated';
        state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: risk.id, action: 'risk mitigated', createdAt: Date.now() });
        saveState();
        renderAdmin();
        renderRoadmap();
      });
      const escalate = document.createElement('button');
      escalate.className = 'ghost';
      escalate.textContent = 'Escalate';
      escalate.addEventListener('click', () => {
        risk.status = 'escalated';
        saveState();
        renderAdmin();
      });
      row.append(mitigate, escalate);
      li.append(row);
      dom.adminRiskList.append(li);
    });
  }

  dom.adminIncidentList.textContent = '';
  const drills = (state.incidentDrills || []).slice(0, 12);
  if (!drills.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No incident drills captured.';
    dom.adminIncidentList.append(li);
  } else {
    drills.forEach((drill) => {
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${drill.type.replace('_', ' ')}</strong> <span class="pill">${drill.status}</span></p><p class="muted">${new Date(drill.createdAt).toLocaleString()} • ${drill.note || 'no note'}</p>`;
      dom.adminIncidentList.append(li);
    });
  }

  dom.adminStats.textContent = '';
  [
    ['active users', activeUsers],
    ['memorial users', memorialUsers],
    ['inactive users', inactiveUsers],
    ['active events', activeEvents],
    ['active connections', activeConnections],
    ['pending connection requests', pendingConnectionRequests],
    ['verified partners', verifiedPartners],
    ['pending partner bookings', pendingPartnerBookings],
  ].forEach(([label, value]) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    const labelNode = document.createElement('p');
    labelNode.className = 'muted';
    labelNode.textContent = String(label);
    const valueNode = document.createElement('p');
    valueNode.className = 'value';
    valueNode.textContent = String(value);
    card.append(labelNode, valueNode);
    dom.adminStats.append(card);
  });
  if (!pending.length) {
    const li = document.createElement('li'); li.className = 'item'; li.textContent = 'No reports in queue.'; dom.adminReportList.append(li);
  } else {
    pending.forEach((r) => {
      const li = document.createElement('li');
      li.className = 'item';
      const text = document.createElement('p');
      text.textContent = `${r.reporterName} reported ${r.targetName}: ${r.reason}`;
      const row = document.createElement('div');
      row.className = 'row';
      const resolve = document.createElement('button');
      resolve.textContent = 'Resolve';
      const dismiss = document.createElement('button');
      dismiss.className = 'ghost';
      dismiss.textContent = 'Dismiss';
      resolve.addEventListener('click', () => {
        r.status = 'resolved';
        const reporter = state.users.find((user) => user.name === r.reporterName);
        if (reporter) notify(reporter.id, `Update: your report on ${r.targetName} was resolved.`);
        saveState();
        renderAdmin();
      });
      dismiss.addEventListener('click', () => {
        r.status = 'dismissed';
        const reporter = state.users.find((user) => user.name === r.reporterName);
        if (reporter) notify(reporter.id, `Update: your report on ${r.targetName} was reviewed and dismissed.`);
        saveState();
        renderAdmin();
      });
      row.append(resolve, dismiss);
      li.append(text, row);
      dom.adminReportList.append(li);
    });
  }

  renderModerationInbox();
  renderInactivityQueue();

  dom.adminMemorialList.textContent = '';
  const memorialCandidates = state.users
    .filter((user) => user.id !== state.currentUserId)
    .filter((user) => user.isActive !== false)
    .filter((user) => !user.memorial?.isMemorial);
  if (!memorialCandidates.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No users currently pending memorial action.';
    dom.adminMemorialList.append(li);
  } else {
    memorialCandidates.forEach((user) => {
      const li = document.createElement('li');
      li.className = 'item row';
      const label = document.createElement('span');
      label.textContent = `${user.name} • ${verificationBadge(user.verificationStatus)}`;
      const btn = document.createElement('button');
      btn.className = 'ghost';
      btn.textContent = 'Activate memorial';
      btn.addEventListener('click', () => {
        activateMemorialForUser(user.id, 'moderator');
        saveState();
        renderAll();
      });
      li.append(label, btn);
      dom.adminMemorialList.append(li);
    });
  }

  dom.adminMemoryReviewList.textContent = '';
  const pendingMemories = pendingMemorialReviews
    .slice()
    .sort((a, b) => b.memory.createdAt - a.memory.createdAt);

  if (!pendingMemories.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No memorial memories pending review.';
    dom.adminMemoryReviewList.append(li);
  } else {
    pendingMemories.forEach(({ user, memory }) => {
      const li = document.createElement('li');
      li.className = 'item';
      const textNode = document.createElement('p');
      textNode.textContent = `${user.name} memorial • ${memory.author}: ${memory.text}`;
      const row = document.createElement('div');
      row.className = 'row';
      const approve = document.createElement('button');
      approve.textContent = 'Approve';
      const remove = document.createElement('button');
      remove.className = 'ghost';
      remove.textContent = 'Remove';
      approve.addEventListener('click', () => {
        memory.status = 'visible';
        saveState();
        renderAll();
      });
      remove.addEventListener('click', () => {
        memory.status = 'removed';
        saveState();
        renderAll();
      });
      row.append(approve, remove);
      li.append(textNode, row);
      dom.adminMemoryReviewList.append(li);
    });
  }

  dom.adminCareUpdateList.textContent = '';
  const openCareUpdates = state.careUpdates
    .slice()
    .filter((update) => update.status === 'open')
    .sort((a, b) => {
      const rank = { high: 3, medium: 2, low: 1 };
      return (rank[b.urgency] || 0) - (rank[a.urgency] || 0) || b.createdAt - a.createdAt;
    });

  if (!openCareUpdates.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No open care updates.';
    dom.adminCareUpdateList.append(li);
  } else {
    openCareUpdates.forEach((update) => {
      const owner = userById(update.userId);
      const li = document.createElement('li');
      li.className = 'item';
      const overdue = update.neededBy && update.neededBy < Date.now();
      const dueLabel = update.neededBy ? new Date(update.neededBy).toLocaleString() : 'no deadline';
      li.innerHTML = `<p><strong>${owner?.name || 'Unknown'}</strong> • ${update.text} ${overdue ? '<span class="pill">overdue</span>' : ''}</p><p class="muted">${update.urgency} urgency • needed by ${dueLabel} • posted ${new Date(update.createdAt).toLocaleString()}</p>`;
      const row = document.createElement('div');
      row.className = 'row';
      const resolve = document.createElement('button');
      resolve.className = 'ghost';
      resolve.textContent = 'Mark handled';
      resolve.addEventListener('click', () => {
        update.status = 'handled';
        if (owner) notify(owner.id, 'Your care update was marked handled by support.');
        saveState();
        renderAll();
      });
      row.append(resolve);
      li.append(row);
      dom.adminCareUpdateList.append(li);
    });
  }

  dom.adminPartnerReviewList.textContent = '';
  const unverifiedPartners = state.partners.filter((partner) => !partner.verified);
  if (!unverifiedPartners.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No partners awaiting verification.';
    dom.adminPartnerReviewList.append(li);
  } else {
    unverifiedPartners.forEach((partner) => {
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${partner.name}</strong> <span class="pill">${partner.type.replace('_', ' ')}</span></p><p class="muted">${partner.notes || 'No notes provided.'}</p>`;
      const row = document.createElement('div');
      row.className = 'row';
      const approve = document.createElement('button');
      approve.textContent = 'Verify partner';
      const reject = document.createElement('button');
      reject.className = 'ghost';
      reject.textContent = 'Reject';
      approve.addEventListener('click', () => {
        partner.verified = true;
        saveState();
        renderAll();
      });
      reject.addEventListener('click', () => {
        state.partners = state.partners.filter((item) => item.id !== partner.id);
        state.partnerOffers = state.partnerOffers.filter((offer) => offer.partnerId !== partner.id);
        saveState();
        renderAll();
      });
      row.append(approve, reject);
      li.append(row);
      dom.adminPartnerReviewList.append(li);
    });
  }

  dom.adminPartnerBookingList.textContent = '';
  const pendingPartnerBookingsList = state.partnerBookings
    .filter((booking) => booking.status === 'pending')
    .sort((a, b) => a.requestedAt - b.requestedAt);
  if (!pendingPartnerBookingsList.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No partner booking requests pending.';
    dom.adminPartnerBookingList.append(li);
  } else {
    pendingPartnerBookingsList.forEach((booking) => {
      const user = userById(booking.userId);
      const offer = state.partnerOffers.find((item) => item.id === booking.offerId);
      const partner = state.partners.find((item) => item.id === booking.partnerId);
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${user?.name || 'Unknown user'}</strong> requested <strong>${offer?.title || 'Unknown offer'}</strong></p><p class="muted">${partner?.name || 'Unknown partner'} • for ${new Date(booking.requestedAt).toLocaleString()}</p>`;
      const row = document.createElement('div');
      row.className = 'row';
      const approve = document.createElement('button');
      approve.textContent = 'Approve booking';
      const decline = document.createElement('button');
      decline.className = 'ghost';
      decline.textContent = 'Decline';
      approve.addEventListener('click', () => {
        booking.status = 'approved';
        if (user) notify(user.id, `Partner request approved: ${offer?.title || 'offer'}.`);
        saveState();
        renderAll();
      });
      decline.addEventListener('click', () => {
        booking.status = 'declined';
        if (user) notify(user.id, `Partner request declined: ${offer?.title || 'offer'}.`);
        saveState();
        renderAll();
      });
      row.append(approve, decline);
      li.append(row);
      dom.adminPartnerBookingList.append(li);
    });
  }

  dom.adminCodeRequestList.textContent = '';
  const pendingCodeRequests = state.communityCodeRequests.filter((request) => request.status === 'pending').sort((a, b) => b.createdAt - a.createdAt);
  if (!pendingCodeRequests.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No pending community code requests.';
    dom.adminCodeRequestList.append(li);
  } else {
    pendingCodeRequests.forEach((request) => {
      const user = userById(request.userId);
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${user?.name || 'Unknown user'}</strong> requested <strong>${request.code}</strong></p><p class="muted">${new Date(request.createdAt).toLocaleString()}</p>`;
      const row = document.createElement('div');
      row.className = 'row';
      const approve = document.createElement('button');
      approve.textContent = 'Approve';
      const reject = document.createElement('button');
      reject.className = 'ghost';
      reject.textContent = 'Reject';
      approve.addEventListener('click', () => {
        let codeRecord = findCommunityCodeRecord(request.code);
        if (!codeRecord) {
          codeRecord = { id: crypto.randomUUID(), code: request.code, label: request.code.toLowerCase().replace(/-/g, ' '), status: 'active', memberIds: [] };
          state.communityCodes.push(codeRecord);
        }
        if (user) assignUserCommunityCode(user, request.code);
        request.status = 'approved';
        if (user) notify(user.id, `Community code approved: ${request.code}.`);
        saveState();
        renderAll();
      });
      reject.addEventListener('click', () => {
        request.status = 'rejected';
        if (user) notify(user.id, `Community code request rejected: ${request.code}.`);
        saveState();
        renderAll();
      });
      row.append(approve, reject);
      li.append(row);
      dom.adminCodeRequestList.append(li);
    });
  }


  dom.adminVerificationReviewList.textContent = '';
  const pendingVerificationRequests = (state.verificationRequests || [])
    .filter((request) => request.status === 'pending')
    .sort((a, b) => b.createdAt - a.createdAt);
  if (!pendingVerificationRequests.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No pending verification requests.';
    dom.adminVerificationReviewList.append(li);
  } else {
    pendingVerificationRequests.forEach((request) => {
      const user = userById(request.userId);
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${user?.name || 'Unknown user'}</strong> requested <strong>${verificationBadge(request.requestedLevel)}</strong></p><p class="muted">${new Date(request.createdAt).toLocaleString()}${request.note ? ` • ${request.note}` : ''}</p>`;
      const row = document.createElement('div');
      row.className = 'row';
      const approve = document.createElement('button');
      approve.textContent = 'Approve';
      const reject = document.createElement('button');
      reject.className = 'ghost';
      reject.textContent = 'Reject';
      approve.addEventListener('click', () => moderateInboxItem({ type: 'verification_request', payload: { request, user }, label: `${user?.name || 'Unknown'} requested ${verificationBadge(request.requestedLevel)}` }, 'approve'));
      reject.addEventListener('click', () => moderateInboxItem({ type: 'verification_request', payload: { request, user }, label: `${user?.name || 'Unknown'} requested ${verificationBadge(request.requestedLevel)}` }, 'reject'));
      row.append(approve, reject);
      li.append(row);
      dom.adminVerificationReviewList.append(li);
    });
  }

  dom.adminCommunityCodeList.textContent = '';
  if (!state.communityCodes.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No community codes configured.';
    dom.adminCommunityCodeList.append(li);
  } else {
    state.communityCodes.forEach((entry) => {
      const li = document.createElement('li');
      li.className = 'item';
      const memberCount = (entry.memberIds || []).length;
      li.innerHTML = `<p><strong>${entry.code}</strong> <span class="pill">${entry.status}</span></p><p class="muted">${entry.label || 'community code'} • members: ${memberCount}</p>`;
      const row = document.createElement('div');
      row.className = 'row';
      const toggle = document.createElement('button');
      toggle.className = 'ghost';
      toggle.textContent = entry.status === 'active' ? 'Deactivate' : 'Activate';
      toggle.addEventListener('click', () => {
        entry.status = entry.status === 'active' ? 'inactive' : 'active';
        saveState();
        renderAdmin();
      });
      row.append(toggle);
      li.append(row);
      dom.adminCommunityCodeList.append(li);
    });
  }

  dom.blockedPhraseList.textContent = '';
  state.blockedPhrases.forEach((phrase) => {
    const li = document.createElement('li');
    li.className = 'item row';
    const span = document.createElement('span'); span.textContent = phrase;
    const removeBtn = document.createElement('button');
    removeBtn.className = 'ghost';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      state.blockedPhrases = state.blockedPhrases.filter((p) => p !== phrase);
      saveState();
      renderAdmin();
    });
    li.append(span, removeBtn);
    dom.blockedPhraseList.append(li);
  });
}




function evaluateQualitySuite(key) {
  const roadmap = calculateRoadmapMetrics();
  const launch = launchReadinessMetrics();
  const openReports = state.reports.filter((report) => (report.status || 'pending') === 'pending').length;
  const pendingVerification = (state.verificationRequests || []).filter((entry) => entry.status === 'pending').length;
  const openBlockers = (state.executionBlockers || []).filter((blocker) => blocker.status !== 'resolved').length;

  if (key === 'core_regression') {
    const checks = [
      { label: 'moments and events data loaded', pass: state.moments.length > 0 && Array.isArray(state.events) },
      { label: 'roadmap completion at least 60%', pass: roadmap.pct >= 60 },
      { label: 'single active execution sprint', pass: (state.executionSprints || []).filter((s) => s.status === 'active').length <= 1 },
      { label: 'blocked backlog under threshold', pass: (state.deliveryBacklog || []).filter((i) => i.status === 'blocked').length <= 2 },
    ];
    return checks;
  }

  if (key === 'safety_resilience') {
    const checks = [
      { label: 'open reports below surge threshold', pass: openReports <= 6 },
      { label: 'incident drills executed recently', pass: (state.incidentDrills || []).some((d) => Date.now() - d.createdAt < 14 * 24 * 60 * 60 * 1000) },
      { label: 'pending verification queue manageable', pass: pendingVerification <= 5 },
      { label: 'high risks count limited', pass: (state.riskRegister || []).filter((r) => r.severity === 'high' && r.status !== 'mitigated').length <= 2 },
    ];
    return checks;
  }

  const checks = [
    { label: 'launch readiness score at least 70', pass: launch.score >= 70 },
    { label: 'roadmap completion at least 75%', pass: roadmap.pct >= 75 },
    { label: 'no unresolved high-severity blockers', pass: (state.executionBlockers || []).filter((b) => b.severity === 'high' && b.status !== 'resolved').length === 0 },
    { label: 'open blockers low enough for release', pass: openBlockers <= 1 },
  ];
  return checks;
}

function runQualityGateSuite(key) {
  const suite = (state.qualityGateSuites || []).find((entry) => entry.key === key);
  if (!suite) return;
  const checks = evaluateQualitySuite(key);
  const passedChecks = checks.filter((item) => item.pass).length;
  const totalChecks = checks.length;
  suite.passedChecks = passedChecks;
  suite.totalChecks = totalChecks;
  suite.status = passedChecks === totalChecks ? 'pass' : passedChecks >= Math.ceil(totalChecks / 2) ? 'warning' : 'fail';
  suite.lastRunAt = Date.now();
  state.qualityGateRuns.unshift({ id: crypto.randomUUID(), key, checks, passedChecks, totalChecks, createdAt: Date.now() });
  state.qualityGateRuns = state.qualityGateRuns.slice(0, 40);
}

function renderQualityGateBoard() {
  const suites = state.qualityGateSuites || [];
  const passing = suites.filter((suite) => suite.status === 'pass').length;
  const warning = suites.filter((suite) => suite.status === 'warning').length;
  const failing = suites.filter((suite) => suite.status === 'fail').length;
  const notRun = suites.filter((suite) => suite.status === 'not_run').length;
  dom.qualityGateSummary.textContent = `Suites: pass ${passing}, warning ${warning}, fail ${failing}, not run ${notRun}.`;

  dom.qualityGateList.textContent = '';
  suites.forEach((suite) => {
    const li = document.createElement('li');
    li.className = 'item';
    const runLabel = suite.lastRunAt ? new Date(suite.lastRunAt).toLocaleString() : 'not run yet';
    li.innerHTML = `<p><strong>${suite.title}</strong> <span class="pill">${suite.status}</span></p><p class="muted">${suite.passedChecks}/${suite.totalChecks || 0} checks passing • last run ${runLabel}</p>`;

    const latest = (state.qualityGateRuns || []).find((run) => run.key === suite.key);
    if (latest) {
      const checks = document.createElement('ul');
      checks.className = 'list';
      latest.checks.forEach((check) => {
        const checkLi = document.createElement('li');
        checkLi.className = 'item';
        checkLi.innerHTML = `<span>${check.label}</span> <span class="pill">${check.pass ? 'pass' : 'fail'}</span>`;
        checks.append(checkLi);
      });
      li.append(checks);
    }
    dom.qualityGateList.append(li);
  });
}

function renderExecutionBoard() {
  const backlog = state.deliveryBacklog || [];
  const sprints = state.executionSprints || [];
  const blockers = state.executionBlockers || [];
  const active = sprints.find((sprint) => sprint.status === 'active') || null;
  const completedSprints = sprints.filter((s) => s.status === 'completed').length;
  const resolvedBlockers = blockers.filter((b) => b.status === 'resolved').length;
  const openBlockers = blockers.length - resolvedBlockers;
  const burndown = backlog.length ? Math.round(((backlog.filter((item) => item.status === 'done').length) / backlog.length) * 100) : 0;
  dom.executionSummary.textContent = `Burndown ${burndown}% • sprints: ${sprints.length} (${completedSprints} completed) • blockers open: ${openBlockers}.`;

  dom.executionSprintList.textContent = '';
  if (!sprints.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No sprints planned yet.';
    dom.executionSprintList.append(li);
  } else {
    sprints.slice().sort((a,b)=>b.createdAt-a.createdAt).forEach((sprint) => {
      const li = document.createElement('li');
      li.className = 'item';
      const completed = sprint.completedItemIds?.length || 0;
      const committed = sprint.committedItemIds?.length || 0;
      li.innerHTML = `<p><strong>${sprint.name}</strong> <span class="pill">${sprint.status}</span> <span class="pill">capacity ${sprint.capacity}</span></p><p class="muted">Committed: ${committed} • Completed: ${completed}</p>`;
      const row = document.createElement('div');
      row.className = 'row';
      const commit = document.createElement('button');
      commit.className = 'ghost';
      commit.textContent = 'Commit next backlog item';
      commit.addEventListener('click', () => {
        const nextItem = backlog.find((item) => item.status !== 'done' && !(sprint.committedItemIds || []).includes(item.id));
        if (!nextItem) return;
        sprint.committedItemIds = sprint.committedItemIds || [];
        sprint.committedItemIds.push(nextItem.id);
        state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: sprint.id, action: `committed ${nextItem.id} to sprint`, createdAt: Date.now() });
        saveState();
        renderRoadmap();
        renderAdmin();
      });
      const completeCommitted = document.createElement('button');
      completeCommitted.textContent = 'Complete committed item';
      completeCommitted.addEventListener('click', () => {
        const targetId = (sprint.committedItemIds || []).find((id) => !(sprint.completedItemIds || []).includes(id));
        if (!targetId) return;
        sprint.completedItemIds = sprint.completedItemIds || [];
        sprint.completedItemIds.push(targetId);
        const backlogItem = backlog.find((item) => item.id === targetId);
        if (backlogItem) backlogItem.status = 'done';
        state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: sprint.id, action: `completed committed item ${targetId}`, createdAt: Date.now() });
        saveState();
        renderRoadmap();
        renderAdmin();
      });
      row.append(commit, completeCommitted);
      li.append(row);
      dom.executionSprintList.append(li);
    });
  }

  dom.executionBlockerList.textContent = '';
  if (!blockers.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No blockers logged.';
    dom.executionBlockerList.append(li);
  } else {
    blockers.slice().sort((a,b)=>b.createdAt-a.createdAt).forEach((blocker) => {
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${blocker.title}</strong> <span class="pill">${blocker.severity}</span> <span class="pill">${blocker.status}</span></p><p class="muted">Owner: ${blocker.owner || 'unassigned'}</p>`;
      const row = document.createElement('div');
      row.className = 'row';
      const resolve = document.createElement('button');
      resolve.textContent = 'Resolve';
      resolve.addEventListener('click', () => {
        blocker.status = 'resolved';
        state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: blocker.id, action: 'blocker resolved', createdAt: Date.now() });
        saveState();
        renderRoadmap();
        renderAdmin();
      });
      const escalate = document.createElement('button');
      escalate.className = 'ghost';
      escalate.textContent = 'Escalate';
      escalate.addEventListener('click', () => {
        blocker.status = 'escalated';
        saveState();
        renderRoadmap();
        renderAdmin();
      });
      row.append(resolve, escalate);
      li.append(row);
      dom.executionBlockerList.append(li);
    });
  }
}

function createExecutionSprint() {
  const name = (dom.executionSprintName.value || '').trim();
  const capacity = Number(dom.executionSprintCapacity.value) || 6;
  if (!name) return;
  const active = (state.executionSprints || []).find((s) => s.status === 'active');
  if (active) active.status = 'completed';
  state.executionSprints.unshift({ id: crypto.randomUUID(), name, status: 'active', capacity, committedItemIds: [], completedItemIds: [], createdAt: Date.now(), completedAt: null });
  dom.executionSprintName.value = '';
  notify(currentUser().id, `Execution sprint created: ${name}.`);
  saveState();
  renderRoadmap();
  renderAdmin();
  renderNotifications();
}

function completeActiveSprint() {
  const active = (state.executionSprints || []).find((s) => s.status === 'active');
  if (!active) {
    notify(currentUser().id, 'No active sprint to complete.');
    renderNotifications();
    return;
  }
  active.status = 'completed';
  active.completedAt = Date.now();
  state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: active.id, action: 'sprint completed', createdAt: Date.now() });
  notify(currentUser().id, `Sprint completed: ${active.name}.`);
  saveState();
  renderRoadmap();
  renderAdmin();
  renderNotifications();
}

function calculateRoadmapMetrics() {
  const milestones = state.roadmapMilestones || [];
  const done = milestones.filter((item) => item.status === 'done').length;
  const inProgress = milestones.filter((item) => item.status === 'in_progress').length;
  const pending = milestones.filter((item) => item.status === 'pending').length;
  const pct = milestones.length ? Math.round((done / milestones.length) * 100) : 0;

  const phaseOrder = ['foundation', 'core connection', 'trust & safety', 'grief-aware design', 'ecosystem', 'production readiness'];
  const phaseStats = phaseOrder.map((phase) => {
    const entries = milestones.filter((item) => item.phase === phase);
    const phaseDone = entries.filter((item) => item.status === 'done').length;
    const phasePct = entries.length ? Math.round((phaseDone / entries.length) * 100) : 0;
    return { phase, total: entries.length, done: phaseDone, pct: phasePct };
  }).filter((entry) => entry.total > 0);

  const latestHealth = (state.roadmapHealthRuns || [])[0] || null;
  const healthPassing = latestHealth ? latestHealth.passed === latestHealth.total : false;
  const backlog = state.deliveryBacklog || [];
  const leftPending = backlog.filter((item) => item.status !== 'done');
  const leftDone = backlog.length - leftPending.length;

  const readiness = {
    releaseCandidate: pct >= 80 && healthPassing,
    integrationRisk: milestones.some((item) => item.phase === 'production readiness' && item.status !== 'done'),
    healthPassing,
  };

  return { milestones, done, inProgress, pending, pct, phaseStats, readiness, latestHealth, backlog, leftPending, leftDone };
}

function renderRoadmap() {
  const { milestones, done, inProgress, pending, pct, phaseStats, readiness, latestHealth, backlog, leftPending, leftDone } = calculateRoadmapMetrics();
  dom.roadmapSummary.textContent = `Completion ${pct}% • done: ${done}, in progress: ${inProgress}, pending: ${pending}.`;

  if (!latestHealth) {
    dom.roadmapHealthStatus.textContent = 'Health checks have not been run yet in this session.';
  } else {
    dom.roadmapHealthStatus.textContent = `Last health check: ${new Date(latestHealth.createdAt).toLocaleString()} • ${latestHealth.passed}/${latestHealth.total} passed.`;
  }

  dom.roadmapReadiness.textContent = readiness.releaseCandidate
    ? 'Release readiness: candidate status reached (80%+ roadmap and all latest health checks passing).'
    : `Release readiness: not yet ready (${readiness.integrationRisk ? 'production readiness milestones still open' : 'complete production milestones and rerun health checks'}).`;

  dom.roadmapPhaseList.textContent = '';
  phaseStats.forEach((phase) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `<p><strong>${phase.phase}</strong> <span class="pill">${phase.done}/${phase.total} done</span></p><p class="muted">${phase.pct}% complete</p>`;
    dom.roadmapPhaseList.append(li);
  });

  const selectedPhase = dom.roadmapPhaseFilter.value || 'all';
  const visibleMilestones = selectedPhase === 'all' ? milestones : milestones.filter((entry) => entry.phase === selectedPhase);

  dom.roadmapMilestoneList.textContent = '';
  if (!visibleMilestones.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No milestones match this phase filter.';
    dom.roadmapMilestoneList.append(li);
  } else {
    visibleMilestones.forEach((milestone) => {
      const li = document.createElement('li');
      li.className = 'item';
      const completedLabel = milestone.completedAt ? ` • completed ${new Date(milestone.completedAt).toLocaleDateString()}` : '';
      li.innerHTML = `<p><strong>${milestone.title}</strong> <span class="pill">${milestone.phase}</span> <span class="pill">${milestone.status.replace('_', ' ')}</span></p><p class="muted">${completedLabel || 'No completion date yet.'}</p>`;

      const row = document.createElement('div');
      row.className = 'row';
      const markInProgress = document.createElement('button');
      markInProgress.className = 'ghost';
      markInProgress.textContent = 'Mark in progress';
      markInProgress.addEventListener('click', () => {
        milestone.status = 'in_progress';
        milestone.completedAt = null;
        state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: milestone.id, action: 'marked in progress', createdAt: Date.now() });
        saveState();
        renderRoadmap();
        renderAdmin();
      });

      const markDone = document.createElement('button');
      markDone.textContent = 'Mark done';
      markDone.addEventListener('click', () => {
        milestone.status = 'done';
        milestone.completedAt = Date.now();
        state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: milestone.id, action: 'marked done', createdAt: Date.now() });
        saveState();
        renderRoadmap();
        renderAdmin();
      });

      row.append(markInProgress, markDone);
      li.append(row);
      dom.roadmapMilestoneList.append(li);
    });
  }

  dom.roadmapLeftSummary.textContent = `Left to implement: ${leftPending.length}/${backlog.length} items remaining (${leftDone} done).`;
  dom.roadmapBacklogList.textContent = '';
  backlog.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `<p><strong>${item.title}</strong> <span class="pill">${item.area}</span> <span class="pill">${item.status.replace('_', ' ')}</span></p><p class="muted">owner: ${item.owner}</p>`;
    const row = document.createElement('div');
    row.className = 'row';
    const markProgress = document.createElement('button');
    markProgress.className = 'ghost';
    markProgress.textContent = 'In progress';
    markProgress.addEventListener('click', () => {
      item.status = 'in_progress';
      state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: item.id, action: 'backlog moved to in progress', createdAt: Date.now() });
      saveState();
      renderRoadmap();
      renderAdmin();
    });
    const markBlocked = document.createElement('button');
    markBlocked.className = 'ghost';
    markBlocked.textContent = 'Blocked';
    markBlocked.addEventListener('click', () => {
      item.status = 'blocked';
      state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: item.id, action: 'backlog marked blocked', createdAt: Date.now() });
      saveState();
      renderRoadmap();
      renderAdmin();
    });
    const markDone = document.createElement('button');
    markDone.textContent = 'Done';
    markDone.addEventListener('click', () => {
      item.status = 'done';
      state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: item.id, action: 'backlog completed', createdAt: Date.now() });
      saveState();
      renderRoadmap();
      renderAdmin();
    });
    row.append(markProgress, markBlocked, markDone);
    li.append(row);
    dom.roadmapBacklogList.append(li);
  });

  renderQualityGateBoard();
  renderExecutionBoard();

  dom.roadmapLogList.textContent = '';
  const logEntries = (state.roadmapActivity || []).slice(0, 12);
  if (!logEntries.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No roadmap updates yet.';
    dom.roadmapLogList.append(li);
  } else {
    logEntries.forEach((entry) => {
      const milestone = milestones.find((item) => item.id === entry.milestoneId);
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `<p><strong>${milestone?.title || entry.milestoneId}</strong> • ${entry.action}</p><p class="muted">${new Date(entry.createdAt).toLocaleString()}</p>`;
      dom.roadmapLogList.append(li);
    });
  }
}

function runRoadmapHealthChecks() {
  const metrics = calculateRoadmapMetrics();
  const checks = [
    { name: 'tabs and panels remain aligned', pass: dom.tabs.length === dom.panels.length },
    { name: 'verification requests use array state', pass: Array.isArray(state.verificationRequests) },
    { name: 'moderation inbox collector is callable', pass: typeof collectPendingModerationItems === 'function' },
    { name: 'roadmap milestones exist', pass: Array.isArray(state.roadmapMilestones) && state.roadmapMilestones.length >= 6 },
    { name: 'roadmap has production readiness milestones', pass: (state.roadmapMilestones || []).some((item) => item.phase === 'production readiness') },
    { name: 'at most one milestone in progress', pass: (state.roadmapMilestones || []).filter((item) => item.status === 'in_progress').length <= 1 },
    { name: 'all done milestones have completion timestamps', pass: (state.roadmapMilestones || []).filter((item) => item.status === 'done').every((item) => !!item.completedAt) },
    { name: 'roadmap completion remains at least 50%', pass: metrics.pct >= 50 },
    { name: 'backlog blocked items below warning threshold', pass: (state.deliveryBacklog || []).filter((item) => item.status === 'blocked').length <= 2 },
    { name: 'at most one active execution sprint', pass: (state.executionSprints || []).filter((sprint) => sprint.status === 'active').length <= 1 },
    { name: 'quality gate suites configured', pass: Array.isArray(state.qualityGateSuites) && state.qualityGateSuites.length >= 3 },
  ];
  const passed = checks.filter((item) => item.pass).length;
  const total = checks.length;
  state.roadmapHealthRuns.unshift({ id: crypto.randomUUID(), createdAt: Date.now(), passed, total, checks });
  state.roadmapHealthRuns = state.roadmapHealthRuns.slice(0, 20);
  notify(currentUser().id, `Roadmap health checks complete: ${passed}/${total} passing.`);
  saveState();
  renderRoadmap();
  renderNotifications();
}

function resetRoadmapMilestones() {
  state.roadmapMilestones = defaultState().roadmapMilestones;
  state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: 'all', action: 'roadmap reset', createdAt: Date.now() });
  notify(currentUser().id, 'Roadmap milestones reset to default development plan baseline.');
  saveState();
  renderRoadmap();
  renderAdmin();
  renderNotifications();
}

function advanceNextRoadmapMilestone() {
  const inProgress = (state.roadmapMilestones || []).find((item) => item.status === 'in_progress');
  if (!inProgress) {
    notify(currentUser().id, 'No in-progress milestone found. Mark a milestone in progress first.');
    renderNotifications();
    return;
  }
  inProgress.status = 'done';
  inProgress.completedAt = Date.now();
  const next = (state.roadmapMilestones || []).find((item) => item.status === 'pending');
  if (next) next.status = 'in_progress';
  state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: inProgress.id, action: 'advanced milestone sequence', createdAt: Date.now() });
  saveState();
  renderRoadmap();
  renderAdmin();
  renderNotifications();
}

function exportRoadmapReport() {
  const metrics = calculateRoadmapMetrics();
  const payload = {
    exportedAt: new Date().toISOString(),
    summary: {
      completionPercent: metrics.pct,
      done: metrics.done,
      inProgress: metrics.inProgress,
      pending: metrics.pending,
      readiness: metrics.readiness,
    },
    phaseStats: metrics.phaseStats,
    milestones: state.roadmapMilestones,
    latestHealthRun: metrics.latestHealth,
    recentActivity: (state.roadmapActivity || []).slice(0, 20),
    backlog: state.deliveryBacklog || [],
    executionSprints: state.executionSprints || [],
    executionBlockers: state.executionBlockers || [],
    qualityGateSuites: state.qualityGateSuites || [],
    qualityGateRuns: (state.qualityGateRuns || []).slice(0, 20),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'still-here-roadmap-report.json';
  a.click();
  URL.revokeObjectURL(url);
  notify(currentUser().id, 'Roadmap report exported.');
  saveState();
  renderNotifications();
}

function renderAll() {
  maybeSendEventReminders();
  maybeEscalateSafetyCheckins();
  maybeSendInactivityCheckins();
  maybeSendDigestNotification();
  renderMoments();
  renderEvents();
  renderResponses();
  renderPartners();
  renderConnections();
  renderCareCircle();
  renderConversations();
  renderNotifications();
  renderGriefResources();
  renderProfile();
  renderMemorial();
  renderAdmin();
  renderSafetyCheckins();
  renderIncidentDrills();
  renderRoadmap();
  activateTab(state.activeTab || 'feed');
}

function activateTab(tab) {
  state.activeTab = tab;
  dom.tabs.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tab));
  dom.panels.forEach((panel) => panel.classList.toggle('hidden', panel.id !== `tab-${tab}`));
  saveState();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read image file.'));
    reader.readAsDataURL(file);
  });
}

// Events

dom.authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.querySelector('#auth-name').value.trim();
  const email = document.querySelector('#auth-email').value.trim().toLowerCase();
  let user = state.users.find((u) => u.email === email);
  if (!user) {
    user = { id: crypto.randomUUID(), name, email, prompts: {}, preferences: { energyBaseline: 'variable', availabilityWindow: 'flexible', communicationStyle: 'mixed' }, communityCode: '', onboarded: false, verificationStatus: 'basic', verificationRequestStatus: 'none', allowCaregiverView: false, caregivers: [], memorial: { preference: 'undecided', message: '', designatedName: '', designatedContact: '', isMemorial: false, memories: [] }, isSoftDeleted: false, deletedAt: null, hardDeleteAt: null };
    state.users.push(user);
  }
  user.name = name || user.name;
  state.currentUserId = user.id;
  dom.authStatus.textContent = user.isSoftDeleted
    ? `This account is pending deletion until ${new Date(user.hardDeleteAt).toLocaleString()}. Go to Profile to cancel deletion.`
    : '';
  dom.onboardingStatus.textContent = '';
  saveState();
  ensureView();
});

dom.onboardingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  const prompts = {
    noPatience: document.querySelector('#prompt-no-patience').value.trim(),
    company: document.querySelector('#prompt-company').value.trim(),
    body: document.querySelector('#prompt-body').value.trim(),
    before: document.querySelector('#prompt-before').value.trim(),
  };
  if (!Object.values(prompts).some(Boolean)) {
    dom.onboardingStatus.textContent = 'Add at least one prompt so people know how to show up for you.';
    return;
  }

  me.prompts = prompts;
  me.preferences = {
    energyBaseline: dom.onboardEnergyBaseline.value,
    availabilityWindow: dom.onboardAvailabilityWindow.value,
    communicationStyle: dom.onboardCommunicationStyle.value,
  };
  const codeAttempt = assignUserCommunityCode(me, dom.onboardCommunityCode.value);
  if (!codeAttempt.ok && dom.onboardCommunityCode.value.trim()) notify(me.id, `Community code not applied: ${codeAttempt.reason}`);
  me.onboarded = true;
  if (state.onboardingDrafts) delete state.onboardingDrafts[me.id];
  dom.onboardingStatus.textContent = 'Onboarding complete. You can edit all of this in Profile.';
  saveState();
  ensureView();
});

dom.landingStartBtn.addEventListener('click', () => {
  dom.landingView.classList.add('hidden');
  dom.authView.classList.remove('hidden');
  document.querySelector('#auth-name').focus();
});

const onboardingInputs = [
  document.querySelector('#prompt-no-patience'),
  document.querySelector('#prompt-company'),
  document.querySelector('#prompt-body'),
  document.querySelector('#prompt-before'),
  dom.onboardEnergyBaseline,
  dom.onboardAvailabilityWindow,
  dom.onboardCommunicationStyle,
  dom.onboardCommunityCode,
];
onboardingInputs.forEach((input) => {
  input.addEventListener('input', () => {
    const me = currentUser();
    if (!me || me.onboarded) return;
    captureOnboardingDraft(me.id);
    updateOnboardingProgress();
    saveState();
  });
  input.addEventListener('change', () => {
    const me = currentUser();
    if (!me || me.onboarded) return;
    captureOnboardingDraft(me.id);
    updateOnboardingProgress();
    saveState();
  });
});

dom.onboardingPresetLow.addEventListener('click', () => {
  applyOnboardingPreset('low');
  const me = currentUser();
  if (me && !me.onboarded) {
    captureOnboardingDraft(me.id);
    saveState();
  }
});

dom.onboardingPresetSocial.addEventListener('click', () => {
  applyOnboardingPreset('social');
  const me = currentUser();
  if (me && !me.onboarded) {
    captureOnboardingDraft(me.id);
    saveState();
  }
});

dom.onboardingClearDraft.addEventListener('click', () => {
  const me = currentUser();
  dom.onboardingForm.reset();
  dom.onboardingStatus.textContent = 'Draft cleared.';
  if (me && state.onboardingDrafts) delete state.onboardingDrafts[me.id];
  updateOnboardingProgress();
  saveState();
});

dom.tabs.forEach((btn) => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));

dom.momentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  const title = document.querySelector('#moment-title').value.trim();
  if (!title) return;
  const description = document.querySelector('#moment-description').value.trim() || 'No extra details yet.';
  autoFlagIfScam(`${title} ${description}`, me.id, 'moment post');
  state.moments.push({ id: crypto.randomUUID(), userId: me.id, title, category: document.querySelector('#moment-category').value, energy: document.querySelector('#moment-energy').value, description, createdAt: Date.now() });
  dom.momentForm.reset();
  notify(me.id, 'Moment posted. It is now live in the feed.');
  saveState();
  renderAll();
});

dom.feedFilter.addEventListener('change', renderMoments);
dom.connectionFilter.addEventListener('change', renderConnections);
dom.partnerOfferFilter.addEventListener('change', renderPartners);

dom.partnerBookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  const offerId = dom.partnerBookingOfferId.value.trim();
  const requestedRaw = dom.partnerBookingDate.value;
  const note = dom.partnerBookingNote.value.trim();
  const offer = state.partnerOffers.find((item) => item.id === offerId);
  if (!offer) {
    notify(me.id, 'Offer not found. Copy the Offer ID from the list.');
    return renderNotifications();
  }
  const partner = state.partners.find((item) => item.id === offer.partnerId);
  if (!partner || !partner.verified) {
    notify(me.id, 'This partner is not available right now.');
    return renderNotifications();
  }
  const requestedAt = new Date(requestedRaw).getTime();
  if (!requestedRaw || Number.isNaN(requestedAt)) return;
  state.partnerBookings.push({
    id: crypto.randomUUID(),
    userId: me.id,
    partnerId: partner.id,
    offerId: offer.id,
    requestedAt,
    note,
    status: 'pending',
    createdAt: Date.now(),
  });
  notify(me.id, `Partner request submitted: ${offer.title}.`);
  dom.partnerBookingForm.reset();
  saveState();
  renderPartners();
  renderAdmin();
  renderNotifications();
  renderGriefResources();
});

dom.connectionRequestForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  const targetName = dom.connectionTarget.value.trim().toLowerCase();
  const note = dom.connectionNote.value.trim();
  const target = state.users.find((user) => user.name.toLowerCase() === targetName);
  if (!target || target.id === me.id) {
    notify(me.id, 'User not found for connection request.');
    return renderNotifications();
  }
  if (usersAreConnected(me.id, target.id)) {
    notify(me.id, `You are already connected with ${target.name}.`);
    return renderNotifications();
  }
  if (state.connectionRequests.some((request) => request.fromUserId === me.id && request.toUserId === target.id && request.status === 'pending')) {
    notify(me.id, `You already sent a pending request to ${target.name}.`);
    return renderNotifications();
  }
  state.connectionRequests.push({
    id: crypto.randomUUID(),
    fromUserId: me.id,
    toUserId: target.id,
    note,
    status: 'pending',
    createdAt: Date.now(),
  });
  logConnectionActivity('request_sent', me.id, target.id, note || 'manual request');
  notify(me.id, `Connection request sent to ${target.name}.`);
  notify(target.id, `${me.name} sent you a connection request.`);
  dom.connectionRequestForm.reset();
  saveState();
  renderAll();
});

dom.eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  const title = document.querySelector('#event-title').value.trim();
  const startsRaw = document.querySelector('#event-date').value;
  if (me.verificationStatus === 'basic') {
    notify(me.id, 'Event creation is for verified users in this MVP flow. Request verification in Profile first.');
    renderNotifications();
  renderGriefResources();
    return;
  }
  if (!title || !startsRaw) return;
  const startsAt = new Date(startsRaw).getTime();
  if (Number.isNaN(startsAt)) return;
  const event = {
    id: crypto.randomUUID(),
    organizerId: me.id,
    title,
    type: document.querySelector('#event-type').value,
    startsAt,
    capacity: Math.max(2, Number(document.querySelector('#event-capacity').value) || 5),
    description: document.querySelector('#event-description').value.trim(),
    attendeeIds: [me.id],
    messages: [],
    status: 'active',
  };
  state.events.push(event);
  notify(me.id, `Event created: ${event.title}.`);
  dom.eventForm.reset();
  saveState();
  renderEvents();
  renderNotifications();
  renderGriefResources();
});

dom.mute1dBtn.addEventListener('click', () => muteNotificationsFor(1));
dom.mute3dBtn.addEventListener('click', () => muteNotificationsFor(3));
dom.mute7dBtn.addEventListener('click', () => muteNotificationsFor(7));


dom.eventMessageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  const event = state.events.find((item) => item.id === activeEventId && item.status !== 'cancelled');
  const text = dom.eventMessageInput.value.trim();
  if (!event || !text) return;
  if (!event.attendeeIds.includes(me.id)) return;
  autoFlagIfScam(text, me.id, 'event chat');
  event.messages.push({ id: crypto.randomUUID(), senderId: me.id, text, createdAt: Date.now() });
  event.attendeeIds
    .filter((id) => id !== me.id)
    .forEach((id) => notify(id, `${me.name} in ${event.title}: ${text}`));
  dom.eventMessageInput.value = '';
  saveState();
  renderEventThread();
});

dom.messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const convo = state.conversations.find((c) => c.id === activeConversationId);
  const text = dom.messageInput.value.trim();
  const imageFile = dom.messageImage.files?.[0];
  if (!convo || (!text && !imageFile) || convo.memorialLocked) return;

  let imageDataUrl = null;
  if (imageFile) {
    if (!imageFile.type.startsWith('image/')) {
      dom.messageAttachmentStatus.textContent = 'Only image attachments are supported.';
      return;
    }
    if (imageFile.size > 1_500_000) {
      dom.messageAttachmentStatus.textContent = 'Image is too large. Use a file under 1.5MB.';
      return;
    }
    try {
      imageDataUrl = await readFileAsDataUrl(imageFile);
    } catch {
      dom.messageAttachmentStatus.textContent = 'Could not attach image. Try another file.';
      return;
    }
  }

  const flagged = autoFlagIfScam(text, state.currentUserId, 'message');
  convo.messages.push({
    id: crypto.randomUUID(),
    senderId: state.currentUserId,
    text: text || 'Shared an image',
    imageDataUrl,
    createdAt: Date.now(),
  });
  const otherId = convo.participantIds.find((id) => id !== state.currentUserId);
  const directConnection = state.connections.find((connection) => connection.status === 'connected' && ((connection.userAId === state.currentUserId && connection.userBId === otherId) || (connection.userAId === otherId && connection.userBId === state.currentUserId)));
  if (directConnection) directConnection.lastInteractionAt = Date.now();
  notify(otherId, imageDataUrl ? `${currentUser().name} shared a photo${text ? `: ${text}` : '.'}` : `${currentUser().name}: ${text}`);
  if (flagged) notify(otherId, 'A recent message is being reviewed by moderation.');
  dom.messageInput.value = '';
  dom.messageImage.value = '';
  dom.messageAttachmentStatus.textContent = imageDataUrl ? 'Image attached and sent.' : '';
  saveState();
  renderAll();
});

dom.reportForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const targetName = document.querySelector('#report-target').value.trim();
  const reason = document.querySelector('#report-reason').value.trim();
  if (!targetName || !reason) return;
  state.reports.push({ id: crypto.randomUUID(), reporterName: currentUser().name, targetName, reason, createdAt: Date.now(), source: 'manual', status: 'pending' });
  dom.reportForm.reset();
  dom.safetyStatus.textContent = 'Report filed. A moderator will review it.';
  saveState();
  renderAdmin();
});

dom.blockForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const targetName = document.querySelector('#block-target').value.trim();
  const target = state.users.find((u) => u.name.toLowerCase() === targetName.toLowerCase());
  if (!target || target.id === state.currentUserId) {
    dom.safetyStatus.textContent = 'User not found.';
    return;
  }
  if (!state.blocks.some((b) => b.blockerId === state.currentUserId && b.blockedId === target.id)) {
    state.blocks.push({ blockerId: state.currentUserId, blockedId: target.id });
  }
  dom.blockForm.reset();
  dom.safetyStatus.textContent = `${target.name} blocked. You will not see each other in feed or messages.`;
  saveState();
  renderAll();
});

dom.safetyCheckinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  const contact = dom.safetyContact.value.trim();
  const location = dom.safetyLocation.value.trim();
  const note = dom.safetyNote.value.trim();
  const minutes = Number(dom.safetyTimer.value);
  if (!contact || Number.isNaN(minutes) || minutes <= 0) return;
  const now = Date.now();
  state.safetyCheckins.unshift({
    id: crypto.randomUUID(),
    userId: me.id,
    contact,
    location,
    note,
    minutes,
    status: 'active',
    createdAt: now,
    expiresAt: now + (minutes * 60 * 1000),
  });
  dom.safetyCheckinForm.reset();
  notify(me.id, `Safety timer started for ${minutes} minutes. Backup contact: ${contact}.`);
  notify(me.id, `Safety plan shared with ${contact}${location ? ` for ${location}` : ''} (demo).`);
  saveState();
  renderSafetyCheckins();
  renderNotifications();
  renderGriefResources();
});

dom.safetyCheckinNowBtn.addEventListener('click', () => {
  const me = currentUser();
  const active = state.safetyCheckins.find((item) => item.userId === me.id && item.status === 'active');
  if (!active) {
    dom.safetyStatus.textContent = 'No active check-in timer right now.';
    return;
  }
  active.status = 'checked_in';
  dom.safetyStatus.textContent = 'Thanks for checking in. Your timer is marked safe.';
  notify(me.id, 'Check-in confirmed.');
  saveState();
  renderSafetyCheckins();
  renderNotifications();
  renderGriefResources();
});

dom.memorialForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  me.memorial.preference = dom.memorialPreference.value;
  me.memorial.message = dom.memorialMessage.value.trim();
  me.memorial.designatedName = dom.designatedName.value.trim();
  me.memorial.designatedContact = dom.designatedContact.value.trim();
  notify(me.id, 'Memorial preferences saved.');
  saveState();
  renderMemorial();
  renderNotifications();
  renderGriefResources();
});

dom.activateMemorialBtn.addEventListener('click', () => {
  const me = currentUser();
  if (me.memorial.preference === 'disappear') {
    applyDisappearMode(me);
    notify(me.id, 'Disappear mode activated (demo). Your profile is removed from discovery and events.');
  } else {
    me.memorial.isMemorial = true;
    notify(me.id, 'Memorial mode activated (demo).');
    state.conversations
      .filter((c) => c.participantIds.includes(me.id))
      .forEach((c) => {
        c.memorialLocked = true;
        c.messages.push({ id: crypto.randomUUID(), senderId: me.id, text: `${me.name} is no longer with us. Their memorial is open if you'd like to visit it.`, createdAt: Date.now() });
      });
  }
  saveState();
  renderAll();
});

dom.addMemoryBtn.addEventListener('click', () => {
  const me = currentUser();
  me.memorial.memories = me.memorial.memories || [];
  me.memorial.memories.push({ id: crypto.randomUUID(), author: 'You', text: me.memorial.message || 'Thank you for being here.', createdAt: Date.now() });
  saveState();
  renderMemorial();
});


dom.memorialWallView.addEventListener('change', renderMemorial);

dom.memorialWallForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  const targetName = dom.memorialWallTarget.value.trim();
  const memoryText = dom.memorialWallMessage.value.trim();
  if (!targetName || !memoryText) return;
  const target = state.users.find((user) => user.name.toLowerCase() === targetName.toLowerCase());
  if (!target || !target.memorial?.isMemorial) {
    notify(me.id, 'That memorial profile is not available yet.');
    renderNotifications();
  renderGriefResources();
    return;
  }
  target.memorial.memories = target.memorial.memories || [];
  const flagged = autoFlagIfScam(memoryText, me.id, 'memorial memory');
  target.memorial.memories.push({
    id: crypto.randomUUID(),
    author: me.name,
    text: memoryText,
    createdAt: Date.now(),
    status: flagged ? 'pending' : 'visible',
  });
  notify(me.id, flagged
    ? `Your memory for ${target.name} is pending moderation review.`
    : `Your memory is now visible on ${target.name}'s memorial page.`);
  dom.memorialWallForm.reset();
  saveState();
  renderMemorial();
  renderNotifications();
  renderGriefResources();
  renderAdmin();
});

dom.careUpdateFilter.addEventListener('change', renderCareCircle);

dom.careUpdateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  const text = dom.careUpdateText.value.trim();
  const urgency = dom.careUpdateUrgency.value;
  const neededByRaw = dom.careUpdateNeededBy.value;
  const neededBy = neededByRaw ? new Date(neededByRaw).getTime() : null;
  if (!text) return;
  if (neededByRaw && Number.isNaN(neededBy)) return;
  state.careUpdates.push({
    id: crypto.randomUUID(),
    userId: me.id,
    text,
    urgency,
    status: 'open',
    neededBy,
    createdAt: Date.now(),
  });
  dom.careUpdateForm.reset();
  notify(me.id, `Care update posted (${urgency} urgency${neededBy ? `, needed by ${new Date(neededBy).toLocaleString()}` : ''}).`);
  if (me.allowCaregiverView && (me.caregivers || []).length) {
    notify(me.id, `${me.caregivers.length} caregiver${me.caregivers.length > 1 ? 's were' : ' was'} notified.`);
  }
  saveState();
  renderCareCircle();
  renderNotifications();
  renderGriefResources();
  renderAdmin();
});

dom.caregiverForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  const name = dom.caregiverName.value.trim();
  const relationship = dom.caregiverRelationship.value.trim();
  const contact = dom.caregiverContact.value.trim();
  if (!name || !contact) return;
  me.caregivers = me.caregivers || [];
  me.caregivers.push({ id: crypto.randomUUID(), name, relationship, contact, addedAt: Date.now() });
  dom.caregiverForm.reset();
  notify(me.id, `${name} added to your care circle.`);
  saveState();
  renderCareCircle();
  renderNotifications();
  renderGriefResources();
});

dom.adminPhraseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const phrase = dom.adminPhraseInput.value.trim().toLowerCase();
  if (!phrase) return;
  if (!state.blockedPhrases.includes(phrase)) state.blockedPhrases.push(phrase);
  dom.adminPhraseInput.value = '';
  saveState();
  renderAdmin();
});

dom.adminInboxFilter.addEventListener('change', renderModerationInbox);
dom.adminInboxSearch.addEventListener('input', renderModerationInbox);
dom.adminRefreshInactivityBtn.addEventListener('click', () => {
  refreshInactivityFlags();
  notify(currentUser().id, 'Inactivity scan refreshed.');
  saveState();
  renderAdmin();
});

dom.adminInactivityFilter.addEventListener('change', renderInactivityQueue);

dom.adminInboxExportBtn.addEventListener('click', () => {
  const snapshot = {
    exportedAt: new Date().toISOString(),
    pendingItems: collectPendingModerationItems(),
    moderationActions: state.moderationActions.slice(0, 100),
    inactivityFlags: state.inactivityFlags.slice(0, 200),
  };
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'still-here-moderation-snapshot.json';
  a.click();
  URL.revokeObjectURL(url);
  notify(currentUser().id, 'Moderation snapshot exported.');
  saveState();
  renderNotifications();
});


dom.verificationRequestBtn.addEventListener('click', () => {
  const me = currentUser();
  const requestedLevel = dom.verificationRequestLevel.value;
  const note = dom.verificationRequestNote.value.trim();

  if (!canRequestVerification(me.verificationStatus, requestedLevel)) {
    notify(me.id, `You already have ${verificationBadge(me.verificationStatus)} verification.`);
    renderNotifications();
    return;
  }

  const duplicatePending = (state.verificationRequests || []).some((entry) => entry.userId === me.id && entry.status === 'pending');
  if (duplicatePending) {
    notify(me.id, 'You already have a pending verification request. Cancel it before submitting another.');
    renderNotifications();
    return;
  }

  const request = { id: crypto.randomUUID(), userId: me.id, requestedLevel, note, status: 'pending', createdAt: Date.now(), reviewedAt: null, reviewedBy: null };
  state.verificationRequests.unshift(request);
  me.verificationRequestStatus = 'pending';
  dom.verificationRequestNote.value = '';
  notify(me.id, `Verification request submitted: ${verificationBadge(requestedLevel)}.`);
  saveState();
  renderProfile();
  renderAdmin();
  renderNotifications();
});

dom.verificationRequestCancelBtn.addEventListener('click', () => {
  const me = currentUser();
  const pending = (state.verificationRequests || []).find((entry) => entry.userId === me.id && entry.status === 'pending');
  if (!pending) {
    notify(me.id, 'No pending verification request to cancel.');
    renderNotifications();
    return;
  }
  pending.status = 'cancelled';
  pending.reviewedAt = Date.now();
  pending.reviewedBy = me.id;
  me.verificationRequestStatus = 'none';
  notify(me.id, 'Pending verification request canceled.');
  saveState();
  renderProfile();
  renderAdmin();
  renderNotifications();
});


dom.profileSaveBtn.addEventListener('click', () => {
  const me = currentUser();
  me.allowCaregiverView = dom.allowCaregiverView.checked;
  state.theme = dom.themeSelect.value === 'light' ? 'light' : 'dark';
  state.accessibility = {
    textSize: dom.textSizeSelect.value === 'large' ? 'large' : 'normal',
    highContrast: dom.highContrastToggle.checked,
    reducedMotion: dom.reducedMotionToggle.checked,
  };
  notify(me.id, `Profile updated: caregiver view ${me.allowCaregiverView ? 'on' : 'off'}, theme ${state.theme}.`);
  saveState();
  renderAll();
});



dom.notifPrefSaveBtn.addEventListener('click', () => {
  state.notificationPreferences = state.notificationPreferences || {};
  state.notificationPreferences.deliveryMode = dom.notifDeliveryMode.value === 'in_app_and_push' ? 'in_app_and_push' : 'in_app';
  state.notificationPreferences.quietHoursStart = dom.notifQuietStart.value || '22:00';
  state.notificationPreferences.quietHoursEnd = dom.notifQuietEnd.value || '07:00';
  notify(currentUser().id, 'Notification preferences updated.');
  saveState();
  renderNotifications();
});

dom.notifPermissionBtn.addEventListener('click', async () => {
  if (!('Notification' in window)) {
    dom.notifPrefStatus.textContent = 'Browser notifications are not supported in this environment.';
    return;
  }
  state.notificationPreferences.browserPermissionRequested = true;
  const result = await Notification.requestPermission();
  dom.notifPrefStatus.textContent = `Browser notification permission: ${result}.`;
  saveState();
  renderNotifications();
});

dom.notifMarkAllReadBtn.addEventListener('click', () => {
  const me = currentUser();
  state.notifications
    .filter((n) => n.userId === me.id && !n.readAt)
    .forEach((n) => { n.readAt = Date.now(); });
  saveState();
  renderNotifications();
});

dom.digestSaveBtn.addEventListener('click', () => {
  state.digestPreference = state.digestPreference || { frequency: 'off', lastSentAt: 0 };
  state.digestPreference.frequency = dom.digestFrequency.value;
  notify(currentUser().id, `Digest preference updated: ${state.digestPreference.frequency}.`);
  saveState();
  renderNotifications();
  renderGriefResources();
});

dom.digestSendNowBtn.addEventListener('click', () => {
  maybeSendDigestNotification(true);
  saveState();
  renderNotifications();
  renderGriefResources();
});

dom.communityCodeRequestBtn.addEventListener('click', () => {
  const me = currentUser();
  const code = dom.communityCodeRequest.value.trim().toUpperCase();
  if (!code) return;
  const existing = findCommunityCodeRecord(code);
  if (existing) {
    assignUserCommunityCode(me, code);
    notify(me.id, `Community code linked: ${code}.`);
    dom.communityCodeRequest.value = '';
    saveState();
    renderProfile();
    renderConnections();
    renderNotifications();
    return;
  }
  const already = state.communityCodeRequests.some((req) => req.userId === me.id && req.code === code && req.status === 'pending');
  if (already) {
    notify(me.id, `Request already pending for code ${code}.`);
    return renderNotifications();
  }
  state.communityCodeRequests.unshift({ id: crypto.randomUUID(), userId: me.id, code, status: 'pending', createdAt: Date.now() });
  notify(me.id, `Community code request submitted: ${code}.`);
  dom.communityCodeRequest.value = '';
  saveState();
  renderProfile();
  renderAdmin();
  renderNotifications();
});

dom.exportDataBtn.addEventListener('click', () => {
  exportCurrentUserData();
  notify(currentUser().id, 'Data export started.');
  saveState();
  renderNotifications();
  renderGriefResources();
});

dom.deleteAccountBtn.addEventListener('click', () => {
  requestAccountDeletion();
  state.currentUserId = null;
  saveState();
  ensureView();
});

dom.cancelDeletionBtn.addEventListener('click', () => {
  cancelAccountDeletion();
  renderProfile();
  renderNotifications();
  renderGriefResources();
});

dom.incidentDrillForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const type = dom.incidentDrillType.value;
  const note = dom.incidentDrillNote.value.trim();
  const severity = type === 'platform_outage' ? 'high' : type === 'report_surge' ? 'medium' : 'high';
  state.incidentDrills.unshift({ id: crypto.randomUUID(), type, note, severity, status: 'open', createdAt: Date.now() });
  state.roadmapActivity.unshift({ id: crypto.randomUUID(), milestoneId: `drill_${type}`, action: 'incident drill triggered', createdAt: Date.now() });
  if (type === 'report_surge') {
    state.reports.unshift({ id: crypto.randomUUID(), reporterName: currentUser().name, targetName: 'Drill target', reason: 'Simulated abuse surge drill', createdAt: Date.now(), status: 'pending' });
  }
  notify(currentUser().id, `Incident drill triggered: ${type.replace('_', ' ')}.`);
  dom.incidentDrillForm.reset();
  saveState();
  renderAll();
});

dom.riskRegisterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = dom.riskRegisterTitle.value.trim();
  if (!title) return;
  state.riskRegister.unshift({
    id: crypto.randomUUID(),
    title,
    severity: dom.riskRegisterSeverity.value,
    mitigation: dom.riskRegisterMitigation.value.trim(),
    status: 'open',
    createdAt: Date.now(),
  });
  notify(currentUser().id, `Risk logged: ${title}.`);
  dom.riskRegisterForm.reset();
  saveState();
  renderAdmin();
  renderNotifications();
});

dom.qualityGateRunBtn.addEventListener('click', () => {
  runQualityGateSuite(dom.qualityGateSuite.value);
  notify(currentUser().id, `Quality suite run: ${dom.qualityGateSuite.value.replace('_', ' ')}.`);
  saveState();
  renderRoadmap();
  renderAdmin();
  renderNotifications();
});

dom.qualityGateRunAllBtn.addEventListener('click', () => {
  ['core_regression', 'safety_resilience', 'release_readiness'].forEach(runQualityGateSuite);
  notify(currentUser().id, 'All quality suites executed.');
  saveState();
  renderRoadmap();
  renderAdmin();
  renderNotifications();
});

dom.executionCreateSprintBtn.addEventListener('click', createExecutionSprint);
dom.executionCompleteSprintBtn.addEventListener('click', completeActiveSprint);
dom.executionBlockerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = dom.executionBlockerTitle.value.trim();
  if (!title) return;
  state.executionBlockers.unshift({
    id: crypto.randomUUID(),
    title,
    severity: dom.executionBlockerSeverity.value,
    owner: dom.executionBlockerOwner.value.trim() || 'unassigned',
    status: 'open',
    createdAt: Date.now(),
  });
  dom.executionBlockerForm.reset();
  notify(currentUser().id, `Blocker logged: ${title}.`);
  saveState();
  renderRoadmap();
  renderAdmin();
  renderNotifications();
});

dom.roadmapPhaseFilter.addEventListener('change', renderRoadmap);
dom.roadmapRunHealthBtn.addEventListener('click', runRoadmapHealthChecks);
dom.roadmapAdvanceBtn.addEventListener('click', advanceNextRoadmapMilestone);
dom.roadmapExportBtn.addEventListener('click', exportRoadmapReport);
dom.roadmapResetBtn.addEventListener('click', resetRoadmapMilestones);

dom.clearStateBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  activeConversationId = null;
  activeEventId = null;
  ensureView();
});

dom.logoutBtn.addEventListener('click', () => {
  state.currentUserId = null;
  saveState();
  ensureView();
});

window.addEventListener('online', updateOfflineIndicator);
window.addEventListener('offline', updateOfflineIndicator);
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  dom.installAppBtn.classList.remove('hidden');
});

dom.installAppBtn.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice.catch(() => {});
  deferredInstallPrompt = null;
  dom.installAppBtn.classList.add('hidden');
});

registerServiceWorker();
updateOfflineIndicator();
ensureView();
