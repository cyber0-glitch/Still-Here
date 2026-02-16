export interface User {
  id: string;
  email: string;
  displayName: string;
  age?: number | null;
  locationCity?: string | null;
  locationCountry?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  radiusKm: number;
  avatarUrl?: string | null;
  conditionSummary?: string | null;
  energyLevel: string;
  mobilityNotes?: string | null;
  promptNoPatience?: string | null;
  promptWantCompany?: string | null;
  promptBodyCanHandle?: string | null;
  promptDontTalkLike?: string | null;
  promptBeforeIGo?: string | null;
  promptFreeform?: string | null;
  verificationStatus: string;
  contactPreference: string;
  showOnlineStatus: boolean;
  allowCaregiverView: boolean;
  memorialPreference?: string | null;
  memorialMessage?: string | null;
  isActive: boolean;
  isMemorial: boolean;
  isAdmin: boolean;
  createdAt: string;
  lastActiveAt?: string | null;
}

export interface MomentRequest {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: string;
  locationType: string;
  locationName?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  energyLevelNeeded?: string | null;
  maxParticipants: number;
  status: string;
  createdAt: string;
  user?: {
    displayName: string;
    verificationStatus: string;
    avatarUrl?: string | null;
  };
  _count?: { responses: number };
}

export interface MomentResponse {
  id: string;
  momentId: string;
  responderId: string;
  message?: string | null;
  status: string;
  createdAt: string;
  responder?: {
    id: string;
    displayName: string;
    verificationStatus: string;
    avatarUrl?: string | null;
  };
}

export interface Conversation {
  id: string;
  lastMessageAt?: string | null;
  memorialLocked: boolean;
  originMomentTitle?: string | null;
  otherParticipant?: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
    verificationStatus: string;
    isMemorial: boolean;
  };
  lastMessage?: string | null;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId?: string | null;
  content: string;
  messageType: string;
  systemEventType?: string | null;
  createdAt: string;
  sender?: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
}

export interface GroupEvent {
  id: string;
  organizerId?: string | null;
  title: string;
  description?: string | null;
  category: string;
  locationName?: string | null;
  locationAddress?: string | null;
  isVirtual: boolean;
  virtualLink?: string | null;
  eventDate: string;
  durationMinutes?: number | null;
  maxAttendees?: number | null;
  energyLevel?: string | null;
  accessibilityNotes?: string | null;
  status: string;
  createdAt: string;
  organizer?: {
    displayName: string;
    avatarUrl?: string | null;
    verificationStatus: string;
  };
  _count?: { attendees: number };
  attendees?: Array<{
    userId: string;
    status: string;
    user: {
      id: string;
      displayName: string;
      avatarUrl?: string | null;
      verificationStatus: string;
    };
  }>;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface ConnectionItem {
  connectionId: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
    verificationStatus: string;
    isMemorial: boolean;
    locationCity?: string | null;
  };
  connectedVia?: string | null;
  createdAt: string;
}

export const MOMENT_CATEGORIES = [
  { value: 'talk', label: 'Talk' },
  { value: 'food', label: 'Food' },
  { value: 'nature', label: 'Nature' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'art', label: 'Art' },
  { value: 'music', label: 'Music' },
  { value: 'travel', label: 'Travel' },
  { value: 'night_out', label: 'Night Out' },
  { value: 'quiet', label: 'Quiet' },
  { value: 'ridiculous', label: 'Ridiculous' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'other', label: 'Other' },
] as const;

export const ENERGY_LEVELS = [
  { value: 'high', label: 'High' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'low', label: 'Low' },
  { value: 'varies', label: 'Varies' },
] as const;
