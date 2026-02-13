# Still-Here
# STILL HERE — Full Development Plan

## App Name: **Still Here**
**Tagline:** "No pity. Just time."
**Secondary taglines:** "Skip the small talk." / "Do it while you can." / "Let's not waste it."

---

## 1. MISSION & PHILOSOPHY

Still Here is a mobile-first web application that connects people with terminal or life-limiting illnesses so they can share experiences, pursue bucket-list activities, and find companionship with others who understand the urgency of limited time — without pity, patronization, or corporate therapy voice.

### Core Design Principles

1. **Permission, not inspiration.** The app exists to remove friction between wanting something and doing it. Users should never feel like they need to justify what they want to do or why.
2. **Predator-proof, not risk-proof.** Every guardrail should protect users from bad actors, not from their own choices. Adults making conscious decisions about their remaining time deserve autonomy.
3. **2am language, not pitch-deck language.** All copy should sound like a real person talking, not a brand. If it could appear on a wellness poster, rewrite it.
4. **Speed-to-connection over funnel safety.** Normal product pacing doesn't apply. Users may have weeks or months, not years. Every screen between download and human connection is a screen where someone might leave forever.
5. **Grief is a feature, not a bug.** People will die. The app must handle this with grace, not avoidance.

---

## 2. TARGET USERS

### Primary Users
- People diagnosed with terminal illness (cancer, ALS, organ failure, etc.)
- People in palliative/hospice care who are still mobile and social
- People with life-limiting conditions who have been given a prognosis

### Secondary Users
- Close caregivers/family who want to help their person find connection (facilitator role only)
- Experience partners (vetted businesses offering activities)

### User Realities to Design For
- Energy levels fluctuate daily, sometimes hourly
- Mobility may be limited or unpredictable
- Users may be on medications that affect cognition or mood
- Some users will disappear suddenly — they may die, be hospitalized, or lose energy
- Emotional state varies: some days defiant and adventurous, some days exhausted and wanting quiet company
- Many have experienced friends and family pulling away or treating them differently

---

## 3. TECHNICAL STACK (Recommended)

### Frontend
- **Framework:** React (with TypeScript)
- **Styling:** Tailwind CSS
- **State Management:** Zustand or React Context (keep it simple)
- **PWA Support:** Yes — service worker for offline capability, push notifications
- **Responsive:** Mobile-first, but must work on desktop/tablet

### Backend
- **Runtime:** Node.js with Express or Fastify
- **Language:** TypeScript
- **Database:** PostgreSQL (primary), Redis (caching, sessions, real-time)
- **ORM:** Prisma
- **Authentication:** JWT tokens with refresh rotation
- **File Storage:** S3-compatible (AWS S3 or MinIO for self-hosted)
- **Real-time:** Socket.io or WebSockets for messaging

### Infrastructure
- **Hosting:** Railway, Render, or AWS (start simple, scale later)
- **CDN:** Cloudflare
- **Email:** Resend or SendGrid (transactional)
- **Push Notifications:** Firebase Cloud Messaging (FCM)
- **Monitoring:** Sentry for error tracking

### Third-Party Services
- **Identity Verification:** Jumio, Veriff, or Onfido (selfie + ID match)
- **Moderation:** Perspective API (Google) for text toxicity screening
- **Maps:** Mapbox or Google Maps (for location-based matching and meetup locations)
- **Analytics:** Plausible or PostHog (privacy-respecting)

---

## 4. DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Profile
  display_name VARCHAR(100) NOT NULL,
  age INTEGER,
  location_city VARCHAR(100),
  location_country VARCHAR(100),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  radius_km INTEGER DEFAULT 50, -- how far they're willing to travel
  avatar_url VARCHAR(500),
  
  -- Condition (kept intentionally vague — no medical records)
  condition_summary TEXT, -- free text, user-written. e.g. "Stage 4 lung cancer. Good days and bad days."
  
  -- Energy & Accessibility
  energy_level VARCHAR(20) DEFAULT 'varies', -- 'high', 'moderate', 'low', 'varies'
  mobility_notes TEXT, -- free text. e.g. "Wheelchair some days. Can walk short distances on good days."
  
  -- Profile Prompts (the soul of the app)
  prompt_no_patience_for TEXT,       -- "I have no patience for..."
  prompt_want_company_for TEXT,      -- "I want company for..."
  prompt_body_can_handle TEXT,       -- "Today my body can handle..."
  prompt_dont_talk_to_me_like TEXT,  -- "Don't talk to me like..."
  prompt_before_i_go TEXT,           -- "Before I go, I want to..."
  prompt_freeform TEXT,              -- open field for anything else
  
  -- Verification
  verification_status VARCHAR(20) DEFAULT 'basic', -- 'basic', 'verified', 'community_verified'
  verified_at TIMESTAMPTZ,
  community_code_used VARCHAR(100), -- which org's invite code they used
  
  -- Preferences
  contact_preference VARCHAR(20) DEFAULT 'both', -- 'messages_only', 'meetups_ok', 'both'
  show_online_status BOOLEAN DEFAULT true,
  allow_caregiver_view BOOLEAN DEFAULT false,
  
  -- Memorial Preferences (set while alive)
  memorial_preference VARCHAR(20) DEFAULT 'memorial', -- 'memorial', 'disappear', 'undecided'
  memorial_message TEXT, -- message to display on memorial profile
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_memorial BOOLEAN DEFAULT false, -- flipped when user passes
  memorial_activated_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- soft delete
);
```

### Moment Requests Table (Core Feed)
```sql
CREATE TABLE moment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  title VARCHAR(200) NOT NULL, -- e.g. "Coffee, no small talk"
  description TEXT, -- optional longer description
  category VARCHAR(50) NOT NULL, -- see MOMENT_CATEGORIES enum below
  
  -- Logistics
  location_type VARCHAR(20) DEFAULT 'flexible', -- 'specific', 'flexible', 'virtual'
  location_name VARCHAR(200), -- e.g. "That park by the river" or "Anywhere in Skopje"
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  preferred_date DATE, -- null = open/anytime
  preferred_time_of_day VARCHAR(20), -- 'morning', 'afternoon', 'evening', 'anytime'
  
  -- Matching
  energy_level_needed VARCHAR(20), -- 'low', 'moderate', 'high', null=any
  max_participants INTEGER DEFAULT 1, -- 1 = looking for one person, >1 = group
  
  -- Status
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'matched', 'completed', 'expired', 'cancelled'
  expires_at TIMESTAMPTZ, -- auto-expire old requests
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enum: MOMENT_CATEGORIES
-- 'talk'          — "Coffee, no small talk" / "Just sit with me"
-- 'food'          — "Eat something incredible" / "Cook together"  
-- 'nature'        — "Drive somewhere pretty" / "Watch the sunset"
-- 'adventure'     — "Something I've never done" / "Adrenaline"
-- 'art'           — "Museum, gallery, make something"
-- 'music'         — "Concert, live music, just listen together"
-- 'travel'        — "Day trip" / "Road trip" / "Fly somewhere"
-- 'night_out'     — "Bar, club, just be out at night"
-- 'quiet'         — "Read together" / "Just exist in the same room"
-- 'ridiculous'    — "Something irresponsible but not stupid"
-- 'virtual'       — "Video call, watch a movie together online"
-- 'other'         — freeform
```

### Moment Responses Table
```sql
CREATE TABLE moment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moment_id UUID REFERENCES moment_requests(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  message TEXT, -- optional message with the response
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(moment_id, responder_id) -- one response per user per moment
);
```

### Conversations Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  
  -- Link to moment that started the conversation (optional)
  origin_moment_id UUID REFERENCES moment_requests(id) ON DELETE SET NULL
);

CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  muted BOOLEAN DEFAULT false,
  last_read_at TIMESTAMPTZ,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'system'
  
  -- System messages for events like "X has passed" or "X completed this moment"
  system_event_type VARCHAR(50), -- 'user_memorial', 'moment_completed', etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ
);
```

### Connections Table
```sql
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_b_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  status VARCHAR(20) DEFAULT 'connected', -- 'connected', 'blocked'
  connected_via VARCHAR(50), -- 'moment_request', 'direct', 'group_event'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_a_id, user_b_id)
);
```

### Memorials Table
```sql
CREATE TABLE memorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Activated by: moderator, caregiver, or community report
  activated_by VARCHAR(20), -- 'moderator', 'caregiver', 'community'
  activated_by_user_id UUID REFERENCES users(id),
  
  -- Memorial content
  display_message TEXT, -- the user's pre-set memorial message
  
  -- Memories from connections
  allow_memories BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE memorial_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  content TEXT NOT NULL, -- a memory, a photo description, a "what I learned from you"
  image_url VARCHAR(500),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Reports & Moderation
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  reason VARCHAR(50) NOT NULL, -- 'scam', 'money_request', 'harassment', 'fake_profile', 'exploitation', 'other'
  details TEXT,
  
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'action_taken', 'dismissed'
  reviewed_by VARCHAR(100), -- moderator identifier
  review_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE blocked_phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phrase VARCHAR(200) NOT NULL,
  category VARCHAR(50), -- 'financial_scam', 'crypto', 'fundraising', 'exploitation'
  is_active BOOLEAN DEFAULT true
);
```

### Community Verification Codes
```sql
CREATE TABLE community_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name VARCHAR(200) NOT NULL, -- e.g. "Hospice Sue Ryder Bitola"
  organization_type VARCHAR(50), -- 'hospice', 'hospital', 'ngo', 'support_group'
  code VARCHAR(50) UNIQUE NOT NULL,
  
  is_active BOOLEAN DEFAULT true,
  max_uses INTEGER, -- null = unlimited
  current_uses INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
```

### Group Events Table
```sql
CREATE TABLE group_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- same categories as moment_requests
  
  -- Location
  location_name VARCHAR(200),
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  is_virtual BOOLEAN DEFAULT false,
  virtual_link VARCHAR(500),
  
  -- Timing
  event_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  
  -- Capacity
  max_attendees INTEGER,
  energy_level VARCHAR(20), -- what energy level is needed
  accessibility_notes TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed', 'cancelled'
  
  -- Experience Partner (if sponsored/organized by a business)
  partner_id UUID REFERENCES experience_partners(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE group_event_attendees (
  event_id UUID REFERENCES group_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'going', -- 'going', 'maybe', 'cancelled'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);
```

### Experience Partners Table
```sql
CREATE TABLE experience_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- 'adventure', 'food', 'travel', 'wellness', 'entertainment'
  website_url VARCHAR(500),
  contact_email VARCHAR(255),
  
  -- Location
  location_city VARCHAR(100),
  location_country VARCHAR(100),
  
  -- Vetting
  is_vetted BOOLEAN DEFAULT false,
  vetted_at TIMESTAMPTZ,
  vetted_notes TEXT,
  
  -- What they offer
  offers_description TEXT, -- what they offer Still Here users
  accessibility_info TEXT,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. APPLICATION ARCHITECTURE

### Page/Screen Structure

```
/                           → Landing page (public)
/join                       → Registration flow
/login                      → Login
/onboarding                 → Profile setup (after registration)
/feed                       → Moment requests feed (main screen)
/feed/new                   → Create a moment request
/feed/:id                   → Single moment request detail
/messages                   → Conversations list
/messages/:id               → Single conversation
/events                     → Group events listing
/events/:id                 → Single event detail
/events/new                 → Create group event (verified users)
/profile                    → Own profile view/edit
/profile/:id                → Other user's profile
/profile/:id/memorial       → Memorial page (for deceased users)
/connections                → My connections list
/settings                   → Account settings
/settings/memorial          → Memorial preferences
/settings/privacy           → Privacy settings
/settings/safety            → Safety tools (block list, report history)
/verify                     → Identity verification flow
/admin                      → Moderation dashboard (separate auth)
```

---

## 6. FEATURE SPECIFICATIONS

### 6.1 Landing Page

**Purpose:** Immediately communicate what this is. Filter in the right people, filter out everyone else.

**First Screen Copy:**
```
"If you're here, you already know.
This is a place to find people who won't flinch."

[Join Still Here]        [I'm already a member]
```

**Below the fold:**
- Brief explanation (3-4 sentences max, not a manifesto)
- Example moment requests (real-feeling, not marketing):
  - "Coffee, no small talk. — Ana, Skopje"
  - "I want to laugh until it hurts. — Marko, Belgrade"  
  - "Drive somewhere pretty. Don't tell me where. — Ivana, Zagreb"
- "This is not a support group. It's not therapy. It's a place to do things with people who get it."
- Simple FAQ: Who is this for? Is it free? Is my information safe?

**Design Notes:**
- Dark background, warm text. Not clinical white.
- No stock photos of smiling bald people. No ribbons. No "warrior" language.
- Typography: clean, slightly bold, direct. Think editorial, not medical.
- Minimal animation. Fast load.

### 6.2 Registration & Onboarding

**Registration (minimal — get them in fast):**
1. Email + password (or magic link)
2. Display name (not required to be real name)
3. City/Country (for matching)
4. Done. They're in at "basic" level.

**Onboarding (happens inside the app, not before):**

Screen 1: "Let's set up your profile. You can change any of this later."
- Avatar upload (optional, skip button prominent)
- Age (optional)
- Radius: "How far would you travel to meet someone?" (slider, 5-200km)

Screen 2: "Tell people who you are."
Profile prompts — each is a text input with the prompt as placeholder:
- "I have no patience for..." 
- "I want company for..."
- "Today my body can handle..."
- "Don't talk to me like..."
- "Before I go, I want to..."
- Free text field: "Anything else you want people to know"

**Important:** All prompts are optional. User can fill zero or all. The app works with minimal info.

Screen 3: "One more thing."
- Condition summary: "If you want, tell people what you're dealing with. As much or as little as you want."
  - Free text field, no dropdowns, no medical categories
  - Helper text: "Example: Stage 4 lung cancer. Good days and bad days. Or just: cancer. Or nothing at all."
- Energy level: "On average, how's your energy?" — 'High', 'Moderate', 'Low', 'Varies' (radio buttons)
- Mobility notes (optional free text)

Screen 4: "You're in."
- Show the feed immediately
- Subtle prompt: "Want to unlock full messaging? Verify your identity." (link to /verify, not required)

**Design Notes:**
- Progress indicator but no "step 1 of 7" anxiety
- Every screen has a visible "Skip" or "Do this later"
- No required fields except email, password, display name, city
- Warm, conversational tone throughout

### 6.3 Verification System

**Three tiers:**

**Basic (default on signup):**
- Can browse the feed
- Can post moment requests
- Can respond to moment requests
- Limited DM (can send first message, but capped at 5 new conversations/day)
- Can join group events
- Visual indicator: no badge

**Verified (ID + selfie match):**
- Full DM access, no caps
- Can create group events
- Can do 1:1 meetups
- Visual indicator: small checkmark on profile
- **Process:** Upload government ID + take a live selfie → third-party service matches face → auto-approved or flagged for manual review
- **Turnaround:** Should complete in under 5 minutes

**Community Verified (hospice/NGO invite code):**
- Same permissions as Verified
- Additional visual indicator: org name on profile (e.g. "via Hospice Sue Ryder")
- **Process:** Enter invite code during registration or in settings → instantly verified
- **No medical documents stored by the app. Ever.**

### 6.4 The Feed (Moment Requests) — Core Feature

This is the heart of the app. Not a swipe interface. Not an algorithm. A feed of real requests from real people.

**Feed Layout:**
- Card-based feed, newest first (with option to filter)
- Each card shows:
  - User avatar + display name + verification badge
  - Moment title (large text): "Coffee, no small talk"
  - Category tag: [talk] [adventure] [quiet] etc.
  - Location: "Skopje" or "Virtual" or "Flexible"
  - Time preference: "Tomorrow morning" or "Anytime this week" or "Open"
  - Energy level needed (if set): "Low energy ok" / "Bring your A-game"
  - Number of responses so far
  - "I'm in" button

**Filters (top of feed):**
- Category (multi-select)
- Distance (slider)
- Energy level
- Virtual / In-person / Both
- Time: Today, This week, Anytime

**Creating a Moment Request:**
- Title field (required): placeholder examples rotate:
  - "Coffee, no small talk."
  - "I want to laugh until it hurts."
  - "Drive somewhere pretty."
  - "Something irresponsible but not stupid."
  - "Just sit with me."
- Category (required): pick from list
- Description (optional): more detail
- Location: "Where?" — specific place, general area, virtual, or flexible
- When: specific date, general timeframe, or open
- Energy level needed (optional)
- How many people: 1 person, small group (2-5), open

**"I'm in" Response Flow:**
1. User taps "I'm in" on a card
2. Optional message field: "Add a note" (encouraged but not required)
3. Submit → notification sent to the moment creator
4. Creator sees responses, can view profiles, accept/decline
5. Accepting opens a conversation between them
6. Both can see each other's profiles from the conversation

### 6.5 Messaging

**Conversation List:**
- Sorted by last message
- Unread indicator
- Preview of last message
- Online/last active indicator (if user has it enabled)
- Memorial indicator if a connection has passed (subtle, not alarming — a small icon)

**Conversation View:**
- Standard chat interface
- Text messages
- Image sharing (simple, no elaborate media features)
- System messages for events:
  - "You connected through: Coffee, no small talk"
  - Memorial notification (see section 6.8)
- "Plan a meetup" quick action → opens a simple form:
  - Where, When, Any notes
  - Both users see the plan pinned in the conversation
  - Optional: "Share with a friend" safety feature (sends location/time to an external contact)

**Moderation in messages:**
- Auto-flag messages containing financial language, crypto terms, fundraising URLs
- Flagged messages go to moderation queue; user sees a notice: "This message is being reviewed"
- Report button on every message
- Block user → immediately ends conversation, hides from each other permanently

**Anti-scam blocked phrases (seeded, expandable by moderators):**
- "send money", "wire transfer", "bitcoin", "crypto", "investment opportunity", "GoFundMe", "CashApp", "Venmo", "PayPal me", "donate", "bank account", "financial help", "inheritance"
- These trigger a soft warning first: "Hey — Still Here doesn't allow financial requests between users. This protects everyone."
- Repeated attempts → auto-report to moderation

### 6.6 User Profiles

**Own Profile View:**
- Edit all fields from onboarding
- See your active moment requests
- See your connections
- See your group events
- Memorial preferences link

**Other User Profile View:**
- Avatar, display name, verification badge
- Condition summary (if they've shared it)
- Profile prompts (only the ones they've filled in)
- Energy level, mobility notes
- "Connect" button → opens DM (if verification allows)
- "Report" and "Block" in overflow menu

### 6.7 Group Events

**Listing:**
- Card-based, sorted by date
- Filter by: category, distance, virtual/in-person, energy level
- Each card shows: title, date/time, location, organizer, attendee count, energy level

**Event Detail:**
- Full description
- Map (if in-person)
- Accessibility notes
- Attendee list (avatars + names)
- "I'm going" / "Maybe" / "Can't make it" buttons
- Chat thread for the event (separate from DMs)
- If partner-sponsored: partner info + link

**Creating an Event (verified users only):**
- Title, description, category
- Date, time, duration
- Location (address or virtual link)
- Max attendees (optional)
- Energy level, accessibility notes
- Experience partner (optional — select from vetted list)

### 6.8 Memorial System — CRITICAL FEATURE

This is what separates Still Here from every other social app. People will die. The app must handle this with honesty and grace.

**User Setup (while alive):**
In Settings → Memorial Preferences:
- "When I'm gone, I want my profile to:" 
  - **Become a memorial** — profile stays visible with a memorial indicator. Connections can leave memories.
  - **Disappear** — profile is removed. Conversations archived for the other person but profile link goes away.
  - **I haven't decided yet** — default. If no choice is made, moderators decide based on context (default to memorial).
- Memorial message: "If you want to leave a message for the people you've connected with here, write it below. It'll be shown on your memorial page."
- Designated person: "Is there someone who should let us know when you're gone?" — name + email/phone (optional, stored encrypted)

**Activation Triggers:**
1. Designated person contacts the app (via email or in-app if they have access)
2. A moderator activates it based on community reports ("I think [user] has passed")
3. Extended inactivity (90+ days) triggers a gentle check-in email. If no response after 30 more days, flag for moderator review.

**What Happens When Memorial is Activated:**

For the deceased user's profile:
- Profile gets a subtle visual change (not a giant banner — think a soft border or desaturated avatar)
- Their pre-written memorial message is displayed at the top
- Profile prompts remain visible
- "Leave a memory" button appears — connections can write a short text + optional photo
- Moment requests are archived (not shown in feed)
- Profile is view-only

For their connections:
- Each connection receives a system message in their conversation: "[Name] is no longer with us. Their memorial is open if you'd like to visit it."
- The conversation is preserved but marked as memorial — no new messages can be sent
- A small memorial icon appears on the conversation in the list

For the broader community:
- No public announcement (privacy-respecting)
- Only connections are notified
- Memorial profiles don't appear in search or feed, only accessible via direct link or connections list

**Disappear Option:**
- Profile is soft-deleted
- Conversations are preserved for the other person but the profile link shows "This person is no longer on Still Here"
- No memorial page, no memories

**Grief Support Resources:**
When a connection's memorial is activated, the notification includes:
- "Take a break" button — mutes all notifications for 1 day/3 days/1 week
- "Talk to someone" link — routes to local crisis/grief resources (not in-app — external links)
- "I need a moment" — a way to temporarily step back from the app without losing data

### 6.9 Safety & Meetup Features

**Meetup Safety (opt-in, not forced):**
- When planning a meetup via messages, users can optionally:
  - Share meetup details (location + time) with an external contact via SMS/email
  - Set a check-in timer: "Remind me to check in after 2 hours" → if no check-in, external contact gets a notification
- Default meetup suggestion: public places. But this is a suggestion, not a requirement.
- No tracking. No GPS sharing. This is about autonomy, not surveillance.

**Block & Report:**
- Available on every profile, every message, every moment request
- Block is immediate and permanent (user never sees the blocked person again)
- Report reasons: Scam, Money request, Harassment, Fake profile, Exploitation, Other
- Reports go to moderation queue with full context (messages, profile)

### 6.10 Notifications

**In-app + push (FCM):**
- Someone responded to your moment request
- Your response to a moment was accepted
- New message in a conversation
- Upcoming group event reminder (24h before)
- Memorial notification for a connection
- Moderation action on your report
- Gentle re-engagement: "Haven't seen you in a while. No pressure — just checking in." (after 2 weeks inactive, max once per month)

**What is NOT notified:**
- No "X people viewed your profile" vanity metrics
- No "You have 3 unread moments!" urgency manipulation
- No gamification notifications

### 6.11 Admin/Moderation Dashboard

**Separate interface, separate auth (admin accounts only).**

**Features:**
- **Report Queue:** Pending reports sorted by severity. View full context (reported user's profile, messages, history). Actions: dismiss, warn user, suspend, ban.
- **Flagged Messages:** Auto-flagged financial/scam messages. Review and take action.
- **Memorial Management:** Activate memorials. Review requests. Handle disputed cases.
- **Community Codes:** Create/manage invite codes for partner organizations.
- **Experience Partners:** Manage vetted business profiles.
- **User Management:** Search users, view profiles, see activity. Suspend/ban with reason.
- **Analytics (privacy-respecting):**
  - Total users (active, memorial, inactive)
  - Moment requests created/completed
  - Average time to first connection
  - Reports filed and resolved
  - Retention (careful — "churn" has a different meaning here)

---

## 7. API ENDPOINTS

### Auth
```
POST   /api/auth/register          — Create account
POST   /api/auth/login             — Login (returns JWT)
POST   /api/auth/refresh           — Refresh token
POST   /api/auth/forgot-password   — Send reset email
POST   /api/auth/reset-password    — Reset with token
POST   /api/auth/magic-link        — Send magic link email
```

### Users & Profiles
```
GET    /api/users/me               — Get own profile
PATCH  /api/users/me               — Update own profile
GET    /api/users/:id              — Get another user's profile
POST   /api/users/me/avatar        — Upload avatar (multipart)
DELETE /api/users/me                — Soft delete account
```

### Verification
```
POST   /api/verify/id              — Submit ID + selfie for verification
POST   /api/verify/community-code  — Submit community invite code
GET    /api/verify/status           — Check verification status
```

### Moment Requests
```
GET    /api/moments                 — List moments (with filters as query params)
POST   /api/moments                 — Create moment request
GET    /api/moments/:id             — Get single moment
PATCH  /api/moments/:id             — Update moment (owner only)
DELETE /api/moments/:id             — Delete/cancel moment (owner only)
POST   /api/moments/:id/respond     — Respond to moment ("I'm in")
GET    /api/moments/:id/responses   — List responses (owner only)
PATCH  /api/moments/:id/responses/:respId — Accept/decline response
GET    /api/moments/mine            — List own moments
```

### Conversations & Messages
```
GET    /api/conversations                    — List conversations
GET    /api/conversations/:id                — Get conversation detail
GET    /api/conversations/:id/messages       — List messages (paginated)
POST   /api/conversations/:id/messages       — Send message
PATCH  /api/conversations/:id/read           — Mark as read
POST   /api/conversations/:id/meetup         — Create meetup plan
```

### Connections
```
GET    /api/connections             — List connections
POST   /api/connections/:userId/block — Block a user
DELETE /api/connections/:userId/block — Unblock
```

### Group Events
```
GET    /api/events                  — List events (with filters)
POST   /api/events                  — Create event (verified users)
GET    /api/events/:id              — Get event detail
PATCH  /api/events/:id              — Update event (organizer only)
DELETE /api/events/:id              — Cancel event (organizer only)
POST   /api/events/:id/attend       — RSVP to event
PATCH  /api/events/:id/attend       — Update RSVP
GET    /api/events/:id/attendees    — List attendees
GET    /api/events/:id/messages     — Event chat messages
POST   /api/events/:id/messages     — Post in event chat
```

### Memorials
```
GET    /api/memorials/:userId                — View memorial page
POST   /api/memorials/:userId/memories       — Leave a memory
GET    /api/memorials/:userId/memories       — List memories
PATCH  /api/users/me/memorial-preferences    — Update own memorial preferences
POST   /api/memorials/:userId/activate       — Request memorial activation (moderator/designated person)
```

### Reports & Safety
```
POST   /api/reports                 — File a report
GET    /api/reports/mine            — List own reports and their status
```

### Admin (separate auth middleware)
```
GET    /api/admin/reports            — List pending reports
PATCH  /api/admin/reports/:id        — Take action on report
GET    /api/admin/flagged-messages   — List auto-flagged messages
PATCH  /api/admin/flagged-messages/:id — Review flagged message
GET    /api/admin/users              — Search/list users
PATCH  /api/admin/users/:id          — Suspend/ban/modify user
POST   /api/admin/community-codes    — Create invite code
GET    /api/admin/community-codes    — List codes
PATCH  /api/admin/community-codes/:id — Deactivate code
POST   /api/admin/memorials/:userId/activate — Activate memorial
GET    /api/admin/analytics          — Dashboard stats
POST   /api/admin/partners           — Add experience partner
GET    /api/admin/partners           — List partners
PATCH  /api/admin/partners/:id       — Update partner
```

---

## 8. UI/UX DESIGN GUIDELINES

### Visual Identity

**Color Palette:**
- Primary background: Deep charcoal (#1A1A2E) or very dark navy (#16213E)
- Secondary background: Slightly lighter (#0F3460)
- Accent: Warm amber/gold (#E8B04B) — warm but not clinical, not "hope ribbon" colored
- Text primary: Warm white (#F5F5F0)
- Text secondary: Soft gray (#A0A0A0)
- Success/positive: Soft teal (#4ECDC4)
- Alert/warning: Muted coral (#FF6B6B)
- Memorial indicator: Soft lavender (#B8B8D1)

**Typography:**
- Headings: Inter or Satoshi (clean, modern, not clinical)
- Body: Inter or System UI stack
- Moment request titles: Slightly larger, slightly bolder — these are the headlines of the app

**Design Tone:**
- Dark mode default (feels intimate, not clinical)
- Light mode available (some users may prefer it, especially during daytime)
- No stock photography anywhere
- Minimal iconography — when used, simple line icons
- Generous whitespace
- Cards with subtle borders, not drop shadows
- Avatars are round, with a thin warm-colored ring for verified users

### Component Library (for Codex)

**Key Components to Build:**
```
<MomentCard />          — Feed card for a moment request
<MomentForm />          — Create/edit moment request
<ProfilePrompt />       — Single prompt display (label + user text)
<ProfileCard />         — Compact user profile (for lists, responses)
<ConversationPreview /> — Chat list item
<MessageBubble />       — Single message in chat
<EventCard />           — Group event card
<MemorialBanner />      — Subtle banner on memorial profiles
<MemoryCard />          — Memory left on a memorial
<VerificationBadge />   — Small icon (basic/verified/community)
<EnergyIndicator />     — Visual energy level display
<CategoryTag />         — Moment category pill
<SafetyCheckIn />       — Meetup safety check-in component
<EmptyState />          — Warm empty states (not just "nothing here")
<NotificationItem />    — Single notification
<ReportModal />         — Report filing form
<BlockConfirm />        — Block confirmation dialog
```

**Empty States (important for tone):**
- Feed empty: "No moments near you right now. Be the first — post what you want to do."
- Messages empty: "No conversations yet. Find a moment that speaks to you."
- Connections empty: "You haven't connected with anyone yet. That's ok. Take your time."
- Search no results: "Nothing matching right now. Try widening your filters."

---

## 9. SECURITY & PRIVACY

### Data Protection
- All data encrypted at rest (database-level encryption)
- All traffic over HTTPS
- Passwords hashed with bcrypt (cost factor 12+)
- JWT tokens with short expiry (15 min access, 7 day refresh)
- Medical/condition information is free text only — no structured medical data that could be subpoenaed or demanded by insurers
- GDPR-compliant: users can export all their data, request full deletion
- No data sold to third parties. Ever. This is a core promise.
- Minimal analytics — no behavioral tracking, no ad pixels, no fingerprinting

### Sensitive Data Handling
- Condition summaries, memorial messages, and designated person info stored encrypted (application-level encryption, not just database-level)
- ID verification handled by third-party service — Still Here does not store ID documents
- Community codes are hashed after initial verification
- Message content encrypted in transit, stored encrypted at rest
- Moderators can access message content only for reported conversations

### Account Deletion
- Users can delete their account at any time
- Deletion is soft-delete for 30 days (in case they change their mind), then hard-delete
- Hard delete removes: profile, messages (their side), moment requests, connections
- Memorial profiles are excluded from deletion if already activated (the memories belong to the community now)

---

## 10. DEVELOPMENT PHASES

### Phase 1: MVP (Weeks 1-6)
**Goal: Core loop working — sign up, post a moment, respond, connect, message.**

Build:
- Landing page
- Registration + basic onboarding
- User profiles with prompts
- Moment request feed (create, browse, filter, respond)
- Basic messaging (text only, 1:1)
- Basic notification system
- Report/block functionality
- Simple admin dashboard (user management, report queue)

Skip for now:
- Identity verification (manual review for early users)
- Group events
- Memorial system
- Experience partners
- Meetup safety features
- Community codes (manually assign in DB)

### Phase 2: Trust & Safety (Weeks 7-10)
**Goal: Make it safe enough to open beyond a closed beta.**

Build:
- Identity verification integration (Veriff or similar)
- Community code system
- Auto-flagging for financial scam language
- Enhanced moderation dashboard
- Blocked phrases system
- Verification badges on profiles

### Phase 3: Community (Weeks 11-14)
**Goal: Group experiences and richer interaction.**

Build:
- Group events (create, RSVP, event chat)
- Experience partner profiles and integration
- Image sharing in messages
- Meetup safety features (share with friend, check-in timer)
- Push notifications (FCM)

### Phase 4: Memorial (Weeks 15-18)
**Goal: Handle the hardest part with grace.**

Build:
- Memorial preference settings
- Memorial activation flow
- Memorial pages with memories
- Conversation memorial state
- Grief support resource routing
- "Take a break" feature
- Inactivity check-in system

### Phase 5: Polish & Scale (Weeks 19-24)
**Goal: Production-ready, accessible, performant.**

Build:
- PWA support (installable, offline basics)
- Accessibility audit and fixes (screen readers, keyboard navigation, high contrast)
- Performance optimization
- Email notification digests
- User data export (GDPR)
- Account deletion flow
- Landing page refinement
- Onboarding improvements based on early user feedback
- Light mode

---

## 11. CONTENT & COPY GUIDELINES (For Codex)

### Voice Rules
1. **First person, direct.** "Find people who get it" not "Connect with like-minded individuals."
2. **No euphemisms for death.** "When I'm gone" is fine. "After your journey" is not.
3. **No inspiration porn.** Never use: warrior, brave, fight, battle, inspiring, hero, journey (in the cancer context).
4. **No corporate wellness tone.** Never use: curated, optimize, wellness, holistic, empower.
5. **Warm but not soft.** The app is kind, not gentle. Direct, not blunt. Honest, not harsh.
6. **Short sentences.** The copy should breathe. No long explanatory paragraphs in the UI.

### Example Copy by Context

**Onboarding:**
- "This takes about 2 minutes. Everything's optional except the basics."
- "Tell people who you are. Not your diagnosis. You."

**Feed:**
- "What do you want to do?" (create moment button)
- "Nothing nearby? Post something. Someone's probably waiting for the same thing."

**Messaging:**
- "Say whatever you want. There's no wrong way to start."

**Memorial preferences:**
- "This is about what happens to your profile when you're no longer here. You can change this anytime."
- "Want to leave a message for the people you've met here? Write it below. No pressure."

**Error states:**
- "Something went wrong. We're on it." (not "Oops! Something went wrong 😅")
- "Can't reach the server right now. Your data is safe."

**Safety:**
- "Still Here doesn't allow financial requests between users. This protects everyone."
- "If someone is making you uncomfortable, you can block them instantly. No questions asked."

---

## 12. MATCHING LOGIC

Still Here does NOT use an algorithm to "match" people. The feed is the matchmaker. Users self-select based on what resonates with them.

**Feed ranking (simple, transparent):**
1. Newest first (default)
2. Filter by: category, distance, energy level, virtual/in-person, time
3. Slight boost for moments in the user's city
4. No "engagement optimization" — no hiding posts, no algorithmic curation

**Optional "Suggested Moments" (Phase 5+):**
- Based on categories the user has responded to before
- Based on distance
- Never based on condition or diagnosis
- Always clearly labeled as "Suggested" vs organic feed
- User can turn off suggestions entirely

---

## 13. LOCALIZATION NOTES

**MVP language:** English

**Considerations for future:**
- The app should be i18n-ready from the start (use a library like i18next)
- All UI strings should be in a translation file, not hardcoded
- Profile prompts should be in the user's language
- Moment requests are user-generated text, no translation needed
- Right-to-left (RTL) support for Arabic, Hebrew if expanding to those markets
- Date/time formatting should respect locale

**Initial target regions (based on founder's location + language):**
- Macedonia / Balkans (Macedonian, Serbian, Croatian, Albanian)
- English-speaking (global)
- Expand based on where hospice/NGO partnerships form

---

## 14. TESTING REQUIREMENTS

### Critical User Flows to Test
1. Registration → Onboarding → First moment posted (< 5 minutes total)
2. See moment → Respond → Get accepted → First message sent
3. Report a user → Report appears in admin queue
4. Block a user → Complete invisibility confirmed
5. Memorial activated → Connections notified → Memorial page visible
6. Financial scam phrase sent → Auto-flagged → Moderation notified
7. Community code → Instant verification
8. Account deletion → Data removed after 30 days

### Performance Targets
- Landing page load: < 2 seconds
- Feed load: < 1 second
- Message delivery: < 500ms
- Search/filter: < 500ms
- Registration to first feed view: < 60 seconds

---

## 15. WHAT THIS APP IS NOT

Keep this list visible during development. If a feature request starts pushing toward any of these, reject it.

- **Not a dating app.** No swipe mechanics. No "match percentage." No appearance-based sorting.
- **Not a support group.** No therapy sessions. No medical advice. No "how are you feeling today?" check-ins.
- **Not a crowdfunding platform.** No donations. No fundraising. No "help pay for my treatment."
- **Not a medical app.** No symptom tracking. No treatment journals. No doctor connections.
- **Not an inspirational content platform.** No "daily motivation." No "cancer warrior" posts. No upvote/like mechanics.
- **Not a legacy/bucket list tracker.** Users don't check off items. The value is the connection, not the completion.

---

## 16. FINAL NOTE FOR THE DEVELOPER

The person who conceived this app has done extensive research and thinking about the emotional reality of the users it serves. The technical implementation is straightforward — it's a social platform with messaging, events, and profiles. The hard part is the *tone*.

Every UI decision, every piece of copy, every interaction pattern should be tested against one question:

**"If I had six months to live and I opened this app at 2am, would this screen make me feel seen or managed?"**

If the answer is "managed," redesign it.

Build it with respect. Build it with honesty. Build it fast — because the people who need it don't have time to wait for perfection.

---

*Document prepared for development handoff. Last updated: February 2026.*
*Concept by Virgil. Architecture by Claude (Anthropic).*

Here's the full development plan. It covers everything Codex would need — database schema, API endpoints, feature specs screen-by-screen, the memorial system, moderation architecture, UI/UX guidelines, copy examples, component list, and a phased build timeline.
A few things to flag when you hand this to Codex:
The memorial system (section 6.8) is the most emotionally complex feature and the most technically unique. Make sure it doesn't get simplified into a generic "deactivate account" flow. The distinction between memorial and disappear modes, the designated person system, and how conversations transition — that's what makes this app this app.
The copy guidelines (section 11) matter more than they look. If Codex generates generic placeholder text like "Welcome to our community!" during development, replace it immediately. The tone is the product.
