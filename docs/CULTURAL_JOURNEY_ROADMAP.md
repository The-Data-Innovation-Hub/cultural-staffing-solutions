# Cultural Journey Map - Feature Roadmap

## Phase 1 (Current) ✅

### Core Features
- [x] **GM-015**: Each completed module triggers a stamp on the Cultural Journey Map
- [x] **GM-016**: Stamps and map progression displayed visually on user dashboard
- [x] **GM-017**: Map progress syncs across web + app (cloud stored)
- [x] **GM-018**: Certificate auto-generated when full journey is complete
- [x] **GM-019**: Reflection prompts stored in user profile as micro-journaling

### UI Elements
- [x] Map-style interface (flat iconography, not geographical maps)
- [x] Themed stamp designs linked to module themes:
  - ☀️ Cultural Awareness
  - 💬 Communication
  - ❤️ Cultural Humility
  - 🤝 Patient & Family Engagement
- [x] Circular progress bar surrounding the map (percentage completion)
- [x] Branding: "Earn stamps, progress on your journey, become culturally intelligent"

### Gamification Elements
- [x] Instant stamp celebration with animation (dopamine boost)
- [x] Micro-reflection prompts (mindfulness integration)
- [x] Badge earning per milestone completion
- [x] Cultural Intelligence Certificate (CPD accredited)

---

## Phase 2 (Planned) 🚧

### 2.1 Country-Specific Cultural Onboarding

Extend the Cultural Journey Map to include region-specific tracks for healthcare professionals relocating to different parts of the UK.

#### Proposed Tracks

| Track | Focus Areas |
|-------|-------------|
| **England Track** | NHS England structure, regional dialects, London multicultural dynamics |
| **Scotland Track** | NHS Scotland, Scottish culture & traditions, Gaelic influences |
| **Wales Track** | NHS Wales, Welsh language basics, rural healthcare considerations |
| **Northern Ireland Track** | HSC system, cross-border dynamics, community relations |
| **Republic of Ireland Track** | HSE system, Irish culture, EU healthcare context |

#### Technical Implementation

```typescript
// Proposed type extension
interface RegionalTrack {
  id: string;
  region: 'england' | 'scotland' | 'wales' | 'northern-ireland' | 'ireland';
  name: string;
  flag: string; // Emoji or icon
  description: string;
  modules: CulturalModule[];
  unlockRequirement: 'core-complete' | 'employment-location' | 'user-choice';
}
```

#### Database Schema Addition

```sql
-- Regional tracks for Phase 2
CREATE TABLE IF NOT EXISTS cultural_journey_regional_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  region VARCHAR(50) NOT NULL,
  assigned_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  progress_percentage INTEGER DEFAULT 0,
  
  UNIQUE(user_id, region)
);
```

#### UX Considerations
- Regional tracks unlock AFTER completing core Cultural Journey Map
- User can select their destination region OR auto-assigned based on employment location
- Same gamification mechanics (stamps, badges, reflections)
- Regional certificate addendum to main Cultural Intelligence Certificate

---

### 2.2 Peer Leaderboard (Friendly Competition)

Add optional leaderboard feature for teams/cohorts to encourage healthy competition.

#### Features

| Feature | Description |
|---------|-------------|
| **Team Leaderboards** | Compare progress within your team/ward/department |
| **Cohort Rankings** | Monthly/quarterly rankings for training cohorts |
| **Achievement Showcase** | Display badges and stamps earned publicly |
| **Streak Tracking** | Daily/weekly learning streaks |
| **Points System** | XP points for modules, reflections, and helping peers |

#### Privacy & Opt-In

- Leaderboard participation is **opt-in only**
- Users can choose to:
  - Show full profile
  - Show anonymous (e.g., "Staff Nurse #42")
  - Hide from leaderboards entirely
- Focus on **friendly competition**, not shame-based motivation

#### Technical Implementation

```typescript
// Proposed leaderboard types
interface LeaderboardEntry {
  userId: string;
  displayName: string; // Can be anonymous
  avatarUrl?: string;
  stampsCollected: number;
  badgesEarned: number;
  reflectionsWritten: number;
  currentStreak: number;
  totalXP: number;
  rank: number;
  certificateEarned: boolean;
}

interface LeaderboardConfig {
  id: string;
  type: 'team' | 'department' | 'cohort' | 'organisation' | 'global';
  name: string;
  scope: string; // e.g., team ID, department ID
  timeframe: 'all-time' | 'monthly' | 'weekly';
  participants: LeaderboardEntry[];
}
```

#### Database Schema Addition

```sql
-- Leaderboard for Phase 2
CREATE TABLE IF NOT EXISTS cultural_journey_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  is_anonymous BOOLEAN DEFAULT FALSE,
  opt_in BOOLEAN DEFAULT FALSE,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS cultural_journey_xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  xp_amount INTEGER NOT NULL,
  xp_type VARCHAR(50) NOT NULL, -- 'module_complete', 'reflection', 'streak_bonus', 'badge_earned'
  description TEXT,
  earned_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON cultural_journey_leaderboard(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_streak ON cultural_journey_leaderboard(current_streak DESC);
```

#### XP Points System (Proposed)

| Action | XP Points |
|--------|-----------|
| Complete module | +100 XP |
| Write reflection | +50 XP |
| Complete milestone (earn badge) | +500 XP |
| 7-day streak bonus | +200 XP |
| 30-day streak bonus | +1000 XP |
| Earn certificate | +2000 XP |
| Help a peer (future feature) | +75 XP |

---

## Phase 3 (Future Vision) 🔮

### Potential Features
- **AI-Powered Cultural Coach**: Personalised recommendations based on learning patterns
- **Peer Mentoring**: Match experienced staff with newcomers
- **Real-World Scenarios**: VR/AR cultural simulation experiences
- **Manager Dashboard**: Team cultural competency overview
- **Integration with HR Systems**: Auto-assign tracks based on employee location/role
- **Community Forum**: Discussion boards for sharing cultural experiences
- **Mobile App**: Native iOS/Android with offline mode

---

## Implementation Priority

| Phase | Timeline | Priority |
|-------|----------|----------|
| Phase 1 | ✅ Complete | Critical |
| Phase 2.1 (Regional Tracks) | Q2 2025 | High |
| Phase 2.2 (Leaderboards) | Q3 2025 | Medium |
| Phase 3 | 2026+ | Low (Vision) |

---

## Notes

- All Phase 2 features should maintain the same gamification philosophy (intrinsic motivation, mindfulness, celebration)
- Regional tracks must be reviewed by cultural consultants from each region
- Leaderboards must never create negative pressure or shame - always opt-in
- Mobile-first design consideration for Phase 2

