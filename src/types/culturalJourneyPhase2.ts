/**
 * Cultural Journey Map - Phase 2 Types
 * 
 * These types support future implementation of:
 * - Regional/Country-specific cultural onboarding tracks
 * - Peer leaderboard with friendly competition
 * 
 * DO NOT USE until Phase 2 development begins
 */

// =====================================================
// PHASE 2.1: REGIONAL TRACKS
// =====================================================

export type RegionId = 
  | 'england' 
  | 'scotland' 
  | 'wales' 
  | 'northern-ireland' 
  | 'ireland';

export type HealthcareSystem = 
  | 'NHS England' 
  | 'NHS Scotland' 
  | 'NHS Wales' 
  | 'HSC' // Northern Ireland
  | 'HSE'; // Ireland

export interface Region {
  id: RegionId;
  name: string;
  country: string;
  flagEmoji: string;
  description: string;
  healthcareSystem: HealthcareSystem;
  moduleCount: number;
  isActive: boolean;
}

export interface RegionalModule {
  id: string;
  regionId: RegionId;
  moduleId: string;
  title: string;
  description: string;
  stampEmoji: string;
  orderIndex: number;
  proTip?: string;
  culturalInsight?: string;
  reflectionPrompt?: string;
  isActive: boolean;
}

export type RegionalAssignmentReason = 
  | 'employment' // Auto-assigned based on job location
  | 'user_choice' // User selected during onboarding
  | 'manager_assigned'; // Manager assigned the track

export interface RegionalTrackProgress {
  id: string;
  userId: string;
  regionId: RegionId;
  assignedAt: string;
  assignmentReason: RegionalAssignmentReason;
  startedAt?: string;
  completedAt?: string;
  progressPercentage: number;
  stampsCollected: number;
  badgeEarned: boolean;
}

export interface RegionalModuleProgress {
  id: string;
  userId: string;
  regionId: RegionId;
  moduleId: string;
  completed: boolean;
  completedAt?: string;
  stampEarned: boolean;
  reflectionResponse?: string;
}

// Predefined regions for UK & Ireland
export const REGIONS: Region[] = [
  {
    id: 'england',
    name: 'England',
    country: 'United Kingdom',
    flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    description: 'NHS England cultural onboarding - London, Birmingham, Manchester & more',
    healthcareSystem: 'NHS England',
    moduleCount: 0,
    isActive: false,
  },
  {
    id: 'scotland',
    name: 'Scotland',
    country: 'United Kingdom',
    flagEmoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    description: 'NHS Scotland cultural onboarding - Edinburgh, Glasgow, Aberdeen & more',
    healthcareSystem: 'NHS Scotland',
    moduleCount: 0,
    isActive: false,
  },
  {
    id: 'wales',
    name: 'Wales',
    country: 'United Kingdom',
    flagEmoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    description: 'NHS Wales cultural onboarding - Cardiff, Swansea, Newport & more',
    healthcareSystem: 'NHS Wales',
    moduleCount: 0,
    isActive: false,
  },
  {
    id: 'northern-ireland',
    name: 'Northern Ireland',
    country: 'United Kingdom',
    flagEmoji: '🇬🇧',
    description: 'HSC Northern Ireland cultural onboarding - Belfast, Derry, Lisburn & more',
    healthcareSystem: 'HSC',
    moduleCount: 0,
    isActive: false,
  },
  {
    id: 'ireland',
    name: 'Republic of Ireland',
    country: 'Ireland',
    flagEmoji: '🇮🇪',
    description: 'HSE Ireland cultural onboarding - Dublin, Cork, Galway & more',
    healthcareSystem: 'HSE',
    moduleCount: 0,
    isActive: false,
  },
];


// =====================================================
// PHASE 2.2: PEER LEADERBOARD
// =====================================================

export type XPType = 
  | 'module_complete'
  | 'reflection_submit'
  | 'milestone_badge'
  | 'streak_7_day'
  | 'streak_30_day'
  | 'certificate_core'
  | 'certificate_regional'
  | 'peer_help';

export interface XPConfig {
  id: XPType;
  xpAmount: number;
  description: string;
  isActive: boolean;
}

// Default XP values
export const XP_VALUES: Record<XPType, number> = {
  module_complete: 100,
  reflection_submit: 50,
  milestone_badge: 500,
  streak_7_day: 200,
  streak_30_day: 1000,
  certificate_core: 2000,
  certificate_regional: 1000,
  peer_help: 75,
};

export interface XPTransaction {
  id: string;
  userId: string;
  xpAmount: number;
  xpType: XPType;
  description?: string;
  relatedModuleId?: string;
  relatedMilestoneId?: string;
  earnedAt: string;
}

export interface LeaderboardProfile {
  id: string;
  userId: string;
  
  // Privacy settings
  optIn: boolean;
  isAnonymous: boolean;
  displayName?: string;
  showAvatar: boolean;
  showBadges: boolean;
  showReflectionsCount: boolean;
  
  // Stats
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  
  // Computed ranks
  globalRank?: number;
  teamRank?: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  isAnonymous: boolean;
  avatarUrl?: string;
  showAvatar: boolean;
  totalXP: number;
  currentStreak: number;
  badgesEarned: number;
  stampsCollected: number;
  certificateEarned: boolean;
  rank: number;
}

export type TeamType = 
  | 'team' 
  | 'department' 
  | 'ward' 
  | 'cohort' 
  | 'organisation';

export interface Team {
  id: string;
  name: string;
  type: TeamType;
  organisationId?: string;
  managerUserId?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export type TeamMemberRole = 'member' | 'lead' | 'manager';

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamMemberRole;
  joinedAt: string;
}

export type LeaderboardTimeframe = 'all-time' | 'monthly' | 'weekly';

export interface Leaderboard {
  id: string;
  type: 'global' | TeamType;
  name: string;
  scope?: string; // Team ID, org ID, etc.
  timeframe: LeaderboardTimeframe;
  entries: LeaderboardEntry[];
  totalParticipants: number;
  updatedAt: string;
}

// =====================================================
// PHASE 2 HOOKS (Placeholder signatures)
// =====================================================

/**
 * Hook for regional track management (Phase 2.1)
 * 
 * @example
 * const { 
 *   availableRegions, 
 *   assignedRegion, 
 *   regionalProgress,
 *   selectRegion,
 *   completeRegionalModule
 * } = useRegionalTracks();
 */
export interface UseRegionalTracksReturn {
  availableRegions: Region[];
  assignedRegion: Region | null;
  regionalProgress: RegionalTrackProgress | null;
  moduleProgress: RegionalModuleProgress[];
  isLoading: boolean;
  error: string | null;
  selectRegion: (regionId: RegionId) => Promise<void>;
  completeRegionalModule: (moduleId: string) => Promise<void>;
  submitRegionalReflection: (moduleId: string, response: string) => Promise<void>;
}

/**
 * Hook for leaderboard management (Phase 2.2)
 * 
 * @example
 * const {
 *   profile,
 *   globalLeaderboard,
 *   teamLeaderboard,
 *   optIn,
 *   optOut,
 *   updatePrivacy
 * } = useLeaderboard();
 */
export interface UseLeaderboardReturn {
  profile: LeaderboardProfile | null;
  globalLeaderboard: Leaderboard | null;
  teamLeaderboard: Leaderboard | null;
  myRank: number | null;
  isLoading: boolean;
  error: string | null;
  optIn: () => Promise<void>;
  optOut: () => Promise<void>;
  updatePrivacy: (settings: Partial<LeaderboardProfile>) => Promise<void>;
  refreshLeaderboard: () => Promise<void>;
}

