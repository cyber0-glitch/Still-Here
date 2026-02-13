const STORAGE_KEY = 'stillhere_mvp_state_v9';

const dom = {
  authView: document.querySelector('#auth-view'),
  onboardingView: document.querySelector('#onboarding-view'),
  appView: document.querySelector('#app-view'),
  authForm: document.querySelector('#auth-form'),
  authStatus: document.querySelector('#auth-status'),
  onboardingForm: document.querySelector('#onboarding-form'),
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
  adminReportList: document.querySelector('#admin-report-list'),
  adminStats: document.querySelector('#admin-stats'),
  adminMemorialList: document.querySelector('#admin-memorial-list'),
  adminMemoryReviewList: document.querySelector('#admin-memory-review-list'),
  adminCareUpdateList: document.querySelector('#admin-care-update-list'),
  adminPartnerReviewList: document.querySelector('#admin-partner-review-list'),
  adminPartnerBookingList: document.querySelector('#admin-partner-booking-list'),
  adminPhraseForm: document.querySelector('#admin-phrase-form'),
  adminPhraseInput: document.querySelector('#admin-phrase-input'),
  blockedPhraseList: document.querySelector('#blocked-phrase-list'),
  queueCount: document.querySelector('#queue-count'),
  verificationSelect: document.querySelector('#profile-verification'),
  allowCaregiverView: document.querySelector('#allow-caregiver-view'),
  themeSelect: document.querySelector('#theme-select'),
  profileSaveBtn: document.querySelector('#profile-save-btn'),
  exportDataBtn: document.querySelector('#export-data-btn'),
  deleteAccountBtn: document.querySelector('#delete-account-btn'),
  cancelDeletionBtn: document.querySelector('#cancel-deletion-btn'),
  accountStatus: document.querySelector('#account-status'),
  installAppBtn: document.querySelector('#install-app-btn'),
  offlineIndicator: document.querySelector('#offline-indicator'),
  griefResourceList: document.querySelector('#grief-resource-list'),
  clearStateBtn: document.querySelector('#clear-state-btn'),
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
  { id: 'u_riley', name: 'Riley', email: 'riley@example.com', prompts: {}, verificationStatus: 'verified', onboarded: true, allowCaregiverView: false, caregivers: [], memorial: { preference: 'undecided', message: '', designatedName: '', designatedContact: '', isMemorial: false, memories: [] } },
  { id: 'u_amara', name: 'Amara', email: 'amara@example.com', prompts: {}, verificationStatus: 'community_verified', onboarded: true, allowCaregiverView: true, caregivers: [{ id: 'cg_1', name: 'Eli', relationship: 'brother', contact: 'eli@example.com', addedAt: Date.now() - 500000 }], memorial: { preference: 'memorial', message: 'Thanks for showing up as yourselves.', designatedName: '', designatedContact: '', isMemorial: false, memories: [] } },
  { id: 'u_milo', name: 'Milo', email: 'milo@example.com', prompts: {}, verificationStatus: 'basic', onboarded: true, allowCaregiverView: false, caregivers: [], memorial: { preference: 'undecided', message: '', designatedName: '', designatedContact: '', isMemorial: false, memories: [] } },
];

const seedMoments = [
  { id: 'm_1', userId: 'u_riley', title: 'Sunset drive. No pressure to talk.', category: 'nature', energy: 'low', description: 'Could use calm company for 45 minutes.', createdAt: Date.now() - 500000 },
  { id: 'm_2', userId: 'u_amara', title: 'Street noodles and bad jokes', category: 'food', energy: 'moderate', description: 'In and out in an hour.', createdAt: Date.now() - 400000 },
  { id: 'm_3', userId: 'u_milo', title: 'Virtual movie tonight', category: 'virtual', energy: 'any', description: 'Camera optional.', createdAt: Date.now() - 300000 },
];

let state = loadState();
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
    eventReminderLog: [],
    careUpdates: [],
    safetyCheckins: [],
    theme: 'dark',
    inactivityCheckinLog: [],
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
      isSoftDeleted: !!user.isSoftDeleted,
      deletedAt: user.deletedAt || null,
      hardDeleteAt: user.hardDeleteAt || null,
    }));
    return { ...defaultState(), ...parsed, users, careUpdates: Array.isArray(parsed.careUpdates) ? parsed.careUpdates : [], safetyCheckins: Array.isArray(parsed.safetyCheckins) ? parsed.safetyCheckins : [], connectionRequests: Array.isArray(parsed.connectionRequests) ? parsed.connectionRequests : [], connections: Array.isArray(parsed.connections) ? parsed.connections : [], connectionActivity: Array.isArray(parsed.connectionActivity) ? parsed.connectionActivity : [], partners: Array.isArray(parsed.partners) ? parsed.partners : defaultState().partners, partnerOffers: Array.isArray(parsed.partnerOffers) ? parsed.partnerOffers : defaultState().partnerOffers, partnerBookings: Array.isArray(parsed.partnerBookings) ? parsed.partnerBookings : [], blockedPhrases: parsed.blockedPhrases?.length ? parsed.blockedPhrases : DEFAULT_BLOCKED_PHRASES, theme: parsed.theme === 'light' ? 'light' : 'dark', inactivityCheckinLog: Array.isArray(parsed.inactivityCheckinLog) ? parsed.inactivityCheckinLog : [] };
  } catch {
    return defaultState();
  }
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function userById(id) { return state.users.find((u) => u.id === id); }
function currentUser() { return userById(state.currentUserId); }

function applyTheme() {
  document.body.classList.toggle('light-mode', state.theme === 'light');
}

function updateOfflineIndicator() {
  const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
  dom.offlineIndicator.classList.toggle('hidden', !isOffline);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

function maybeSendInactivityCheckins() {
  const now = Date.now();
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
  state.inactivityCheckinLog = state.inactivityCheckinLog || [];
  state.users.forEach((user) => {
    if (user.isActive === false || user.memorial?.isMemorial || user.isSoftDeleted) return;
    const lastActiveAt = user.lastActiveAt || now;
    if ((now - lastActiveAt) < fourteenDaysMs) return;
    const logKey = `${user.id}:inactivity`;
    if (state.inactivityCheckinLog.includes(logKey)) return;
    notify(user.id, 'We have not seen you in a while. If you are still here, tap in and update your profile when you have energy.');
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

function ensureView() {
  applyPendingAccountDeletion();
  applyTheme();
  const me = currentUser();
  const needsOnboarding = me && !me.onboarded;
  dom.authView.classList.toggle('hidden', !!me);
  dom.onboardingView.classList.toggle('hidden', !needsOnboarding);
  dom.appView.classList.toggle('hidden', !me || needsOnboarding);
  if (me && !needsOnboarding) {
    me.lastActiveAt = Date.now();
    state.inactivityCheckinLog = (state.inactivityCheckinLog || []).filter((key) => !key.startsWith(`${me.id}:`));
    saveState();
    renderAll();
  }
}

function notify(userId, text) { state.notifications.unshift({ id: crypto.randomUUID(), userId, text, createdAt: Date.now() }); }

function isMuted() {
  return (state.notificationMuteUntil || 0) > Date.now();
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

function renderConnections() {
  expireConnectionRequests();
  const me = currentUser();
  if (!me) return;
  const filter = dom.connectionFilter.value || 'all';
  const blockedByMe = new Set(state.blocks.filter((block) => block.blockerId === me.id).map((block) => block.blockedId));

  const suggested = state.users
    .filter((user) => user.id !== me.id)
    .filter((user) => user.isActive !== false)
    .filter((user) => !user.memorial?.isMemorial)
    .filter((user) => !blockedByMe.has(user.id))
    .filter((user) => !usersAreConnected(me.id, user.id))
    .filter((user) => !state.connectionRequests.some((request) => request.fromUserId === me.id && request.toUserId === user.id && request.status === 'pending'))
    .filter((user) => {
      if (filter === 'verified') return ['verified', 'community_verified'].includes(user.verificationStatus);
      if (filter === 'compatible_energy') {
        const myEnergy = state.moments.find((moment) => moment.userId === me.id)?.energy || 'any';
        const theirEnergy = state.moments.find((moment) => moment.userId === user.id)?.energy || 'any';
        return myEnergy === 'any' || theirEnergy === 'any' || myEnergy === theirEnergy;
      }
      return true;
    })
    .slice(0, 8);

  dom.connectionSuggestionList.textContent = '';
  if (!suggested.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = 'No suggestions right now. Try changing the filter or check back later.';
    dom.connectionSuggestionList.append(li);
  } else {
    suggested.forEach((user) => {
      const li = document.createElement('li');
      li.className = 'item row';
      li.innerHTML = `<span><strong>${user.name}</strong> <span class="muted">${verificationBadge(user.verificationStatus)}</span></span>`;
      const button = document.createElement('button');
      button.className = 'ghost';
      button.textContent = 'Connect';
      button.addEventListener('click', () => {
        state.connectionRequests.push({
          id: crypto.randomUUID(),
          fromUserId: me.id,
          toUserId: user.id,
          note: '',
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
  const list = state.notifications.filter((n) => n.userId === me.id).sort((a, b) => b.createdAt - a.createdAt);
  const muted = isMuted();
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
    const li = document.createElement('li'); li.className = 'item'; li.textContent = 'No notifications yet.'; dom.notificationList.append(li); return;
  }
  list.forEach((n) => {
    const li = document.createElement('li'); li.className = 'item'; li.textContent = n.text; dom.notificationList.append(li);
  });
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

function renderProfile() {
  const me = currentUser();
  dom.profileCard.innerHTML = `
    <p><strong>${me.name}</strong> (${me.email})</p>
    <p class="muted">Verification: ${verificationBadge(me.verificationStatus)}</p>
    <p class="muted">I have no patience for: ${me.prompts?.noPatience || '—'}</p>
    <p class="muted">I want company for: ${me.prompts?.company || '—'}</p>
    <p class="muted">Today my body can handle: ${me.prompts?.body || '—'}</p>
    <p class="muted">Before I go, I want to: ${me.prompts?.before || '—'}</p>
  `;
  dom.verificationSelect.value = me.verificationStatus || 'basic';
  dom.allowCaregiverView.checked = !!me.allowCaregiverView;
  dom.themeSelect.value = state.theme || 'dark';
  const isSoftDeleted = !!me.isSoftDeleted;
  dom.cancelDeletionBtn.classList.toggle('hidden', !isSoftDeleted);
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

function renderAdmin() {
  dom.adminReportList.textContent = '';
  const list = state.reports.slice().reverse();
  const pending = list.filter((report) => (report.status || 'pending') === 'pending');
  const pendingMemorialReviews = state.users
    .filter((user) => user.memorial?.isMemorial)
    .flatMap((user) => (user.memorial?.memories || []).map((memory) => ({ user, memory })))
    .filter((entry) => (entry.memory.status || 'visible') === 'pending');
  const openCareUpdatesCount = state.careUpdates.filter((update) => update.status === 'open').length;
  dom.queueCount.textContent = String(pending.length + pendingMemorialReviews.length + openCareUpdatesCount);

  const activeUsers = state.users.filter((user) => user.isActive !== false && !user.memorial?.isMemorial).length;
  const memorialUsers = state.users.filter((user) => user.memorial?.isMemorial).length;
  const inactiveUsers = state.users.filter((user) => user.isActive === false).length;
  const activeEvents = state.events.filter((event) => event.status === 'active').length;
  const activeConnections = state.connections.filter((connection) => connection.status === 'connected').length;
  const pendingConnectionRequests = state.connectionRequests.filter((request) => request.status === 'pending').length;
  const verifiedPartners = state.partners.filter((partner) => partner.verified).length;
  const pendingPartnerBookings = state.partnerBookings.filter((booking) => booking.status === 'pending').length;
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

function renderAll() {
  maybeSendEventReminders();
  maybeEscalateSafetyCheckins();
  maybeSendInactivityCheckins();
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
    user = { id: crypto.randomUUID(), name, email, prompts: {}, onboarded: false, verificationStatus: 'basic', allowCaregiverView: false, caregivers: [], memorial: { preference: 'undecided', message: '', designatedName: '', designatedContact: '', isMemorial: false, memories: [] }, isSoftDeleted: false, deletedAt: null, hardDeleteAt: null };
    state.users.push(user);
  }
  user.name = name || user.name;
  state.currentUserId = user.id;
  dom.authStatus.textContent = user.isSoftDeleted
    ? `This account is pending deletion until ${new Date(user.hardDeleteAt).toLocaleString()}. Go to Profile to cancel deletion.`
    : '';
  saveState();
  ensureView();
});

dom.onboardingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const me = currentUser();
  me.prompts = {
    noPatience: document.querySelector('#prompt-no-patience').value.trim(),
    company: document.querySelector('#prompt-company').value.trim(),
    body: document.querySelector('#prompt-body').value.trim(),
    before: document.querySelector('#prompt-before').value.trim(),
  };
  me.onboarded = true;
  saveState();
  ensureView();
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
    notify(me.id, 'Event creation is for verified users in this MVP flow. Update verification in Profile first.');
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

dom.profileSaveBtn.addEventListener('click', () => {
  const me = currentUser();
  me.verificationStatus = dom.verificationSelect.value;
  me.allowCaregiverView = dom.allowCaregiverView.checked;
  state.theme = dom.themeSelect.value === 'light' ? 'light' : 'dark';
  notify(me.id, `Profile updated: ${verificationBadge(me.verificationStatus)} verification, caregiver view ${me.allowCaregiverView ? 'on' : 'off'}, theme ${state.theme}.`);
  saveState();
  renderAll();
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
