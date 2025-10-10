# Backend Integration Guide

## Overview

This guide explains how to implement the backend API endpoints for the Assessment System. The frontend is already integrated and will automatically connect to the backend when the API_URL is configured.

## Configuration

### Environment Variables

Create or update `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
```

For production:

```env
VITE_API_URL=https://api.culturalstaffingsolutions.com/api
```

## Frontend Integration Status

✅ **Complete** - The frontend is fully integrated and ready to connect:

- **Service Layer:** `src/services/assessmentService.ts` - All API calls defined
- **Data Hooks:** `src/hooks/useAssessmentData.ts` - React hooks with loading/error states
- **Components:** Assessment & Dashboard integrated with real data
- **Fallback:** Mock data displayed when backend unavailable
- **Error Handling:** Graceful degradation with user-friendly messages

## Required API Endpoints

### 1. Assessment Submission

**POST** `/api/assessments`

Submit completed assessment and generate learning path.

**Request Body:**
```typescript
{
  role: "nurse" | "physician" | "allied-health" | "administrative" | "other",
  culturalBackground: {
    countryOfOrigin: string,
    primaryLanguage: string,
    englishProficiency: 1-5,
    yearsInTargetCountry?: number,
    previousInternationalExperience?: boolean,
    culturalAdaptationConcerns?: string[]
  },
  skillRatings: {
    [skillName: string]: 1-5
  },
  learningPreferences: {
    primaryStyle: "visual" | "auditory" | "reading-writing" | "kinesthetic",
    secondaryStyle?: string,
    preferredContentTypes?: string[],
    timeCommitment: "light" | "moderate" | "intensive",
    notificationFrequency: "daily" | "weekly" | "biweekly" | "monthly"
  },
  assessmentState: {
    progress: { ... },
    answers: { ... }
  }
}
```

**Response:**
```typescript
{
  assessmentId: string,
  learningPathId: string,
  message: string
}
```

**Implementation Steps:**
1. Validate request data
2. Insert into `user_assessments` table
3. Insert responses into `assessment_responses` table
4. Insert into `cultural_backgrounds` table
5. Create `skills_assessment` record
6. Insert `skill_ratings` records
7. Insert into `learning_preferences` table
8. **Generate learning path** (call learning path service)
9. Return assessment and learning path IDs

### 2. Learning Path Retrieval

**GET** `/api/learning-paths/me`
**GET** `/api/learning-paths/:userId`

Retrieve active learning path for user.

**Response:**
```typescript
{
  id: string,
  userId: string,
  assessmentId: string,
  pathName: string,
  pathDescription: string,
  overallScore: number,
  culturalCompetencyScore: number,
  skillsScore: number,
  estimatedCompletionWeeks: number,
  difficultyLevel: "beginner" | "intermediate" | "advanced",
  isActive: boolean,
  status: "in_progress" | "completed" | "on_hold" | "abandoned",
  createdAt: string,
  startedAt?: string,
  completedAt?: string
}
```

**Implementation:**
```sql
SELECT * FROM learning_paths
WHERE user_id = $1 AND is_active = true
ORDER BY created_at DESC
LIMIT 1;
```

### 3. Priority Areas

**GET** `/api/learning-paths/:learningPathId/priority-areas`

Get priority focus areas for a learning path.

**Response:**
```typescript
[
  {
    id: string,
    learningPathId: string,
    category: "cultural" | "technical" | "language" | "compliance",
    title: string,
    description: string,
    importance: "critical" | "high" | "medium" | "low",
    currentLevel: number,
    targetLevel: number,
    estimatedTimeWeeks: number,
    isCompleted: boolean,
    priorityOrder: number
  }
]
```

**Implementation:**
```sql
SELECT * FROM priority_areas
WHERE learning_path_id = $1
ORDER BY priority_order ASC;
```

**PATCH** `/api/priority-areas/:areaId`

Update priority area progress.

### 4. Recommended Courses

**GET** `/api/learning-paths/:learningPathId/courses`

Get recommended courses for a learning path.

**Response:**
```typescript
[
  {
    id: string,
    learningPathId: string,
    courseId?: string,
    courseTitle: string,
    courseDescription: string,
    category: string,
    durationMinutes: number,
    difficultyLevel: "beginner" | "intermediate" | "advanced",
    contentTypes: string[],
    priorityOrder: number,
    isRequired: boolean,
    isEnrolled: boolean,
    isCompleted: boolean,
    progressPercentage: number
  }
]
```

**Implementation:**
```sql
SELECT * FROM recommended_courses
WHERE learning_path_id = $1
ORDER BY priority_order ASC;
```

**POST** `/api/courses/:courseId/enroll`

Enroll user in a course.

**PATCH** `/api/courses/:courseId/progress`

Update course progress.

**Request Body:**
```typescript
{
  progressPercentage: number
}
```

### 5. Milestones

**GET** `/api/learning-paths/:learningPathId/milestones`

Get milestones for a learning path.

**Response:**
```typescript
[
  {
    id: string,
    learningPathId: string,
    title: string,
    description: string,
    milestoneType: "cultural" | "skills" | "course_completion" | "general",
    targetDate: string,
    scheduledWeek: number,
    associatedCourseIds: string[],
    requiredActivities: string[],
    isCompleted: boolean,
    completedAt?: string,
    rewards?: string[],
    badgeAwarded?: string,
    milestoneOrder: number
  }
]
```

**POST** `/api/milestones/:milestoneId/complete`

Mark milestone as completed.

### 6. Review Cycles & Check-ins

**GET** `/api/review-cycles/current`

Get current active review cycle.

**POST** `/api/check-ins`

Submit a progress check-in.

**Request Body:**
```typescript
{
  reviewCycleId: string,
  userId: string,
  checkInDate: string,
  daysSinceStart: number,
  progressRating: 1-5,
  challengesFaced: string[],
  successesAchieved: string[],
  supportNeeded: string[],
  coursesCompletedSinceLastCheckIn: number,
  hoursSpentLearning: number
}
```

### 7. Analytics

**GET** `/api/analytics/assessments/me`
**GET** `/api/analytics/assessments/:userId`

Get assessment analytics.

**Response:**
```typescript
{
  userId: string,
  assessmentId: string,
  completionRate: number,
  timeSpent: number,
  retakeCount: number,
  role: string,
  countryOfOrigin: string,
  culturalCompetencyScore: number,
  skillsScore: number,
  engagementScore: number,
  progressOverTime: [
    {
      date: string,
      culturalCompetencyScore: number,
      skillsScore: number,
      coursesCompleted: number,
      milestonesAchieved: number
    }
  ]
}
```

### 8. Utility Endpoints

**GET** `/api/health`

Health check endpoint.

**Response:**
```typescript
{
  status: "healthy" | "degraded" | "down",
  timestamp: string
}
```

## Learning Path Generation Algorithm

This is the core logic that creates personalized learning paths based on assessment data.

### Input Data

```typescript
{
  role: UserRole,
  culturalBackground: CulturalBackground,
  skillRatings: Map<string, SkillLevel>,
  culturalCompetencyScore: number,
  skillsScore: number
}
```

### Algorithm Steps

#### 1. Identify Priority Areas

```pseudo
FOR each skill category (Clinical, Technical, Communication, Compliance):
  Calculate average skill level
  Calculate gap to target (role-based target)
  Determine importance based on:
    - Role requirements
    - Cultural factors
    - Compliance needs

  IF gap >= 2 levels:
    Create Priority Area with importance "critical"
  ELSE IF gap >= 1 level:
    Create Priority Area with importance "high"
  ELSE:
    Create Priority Area with importance "medium"
END FOR

// Add cultural competency as priority if score < 75
IF culturalCompetencyScore < 75:
  Add Priority Area:
    category: "cultural"
    importance: "critical"
    currentLevel: culturalCompetencyScore
    targetLevel: 85
```

#### 2. Calculate Priority Scores

```typescript
function calculatePriorityScore(area: PriorityArea): number {
  const gap = area.targetLevel - area.currentLevel;
  const importanceWeight = {
    critical: 1.0,
    high: 0.7,
    medium: 0.4,
    low: 0.2
  };

  const roleRelevance = getRoleRelevance(area.category, userRole);
  const culturalRelevance = getCulturalRelevance(area.category, culturalBackground);

  return (
    gap * 0.4 +
    importanceWeight[area.importance] * 100 * 0.3 +
    roleRelevance * 0.2 +
    culturalRelevance * 0.1
  );
}
```

#### 3. Recommend Courses

```pseudo
FOR each Priority Area (sorted by priority score DESC):
  Find courses that address this area

  FOR each course:
    Calculate recommendation score:
      - Role match: Does course match user role?
      - Learning style match: Does format match preferences?
      - Prerequisites met: Has user completed prerequisites?
      - Gap addressed: Does course improve this priority area?

    Assign as required if:
      - Priority area is "critical"
      - Course is compliance-related
      - Role requires certification

  Sort courses by recommendation score
  Add top N courses to recommended list
END FOR

// Ensure variety
Balance courses across categories
Respect time commitment (Light: 4 courses, Moderate: 8, Intensive: 12)
```

#### 4. Create Milestones

```pseudo
Define milestones based on estimated completion time:

IF estimatedWeeks >= 12:
  Create 3 milestones:
    - 30-day (cultural + compliance)
    - 60-day (technical skills)
    - 90-day (complete integration)
ELSE IF estimatedWeeks >= 8:
  Create 2 milestones:
    - Mid-point review
    - Completion
ELSE:
  Create 1 milestone:
    - Completion

FOR each milestone:
  Associate relevant courses
  Define required activities
  Set rewards and badges
  Calculate target date
END FOR
```

#### 5. Set Difficulty Level

```typescript
function calculateDifficultyLevel(
  skillsScore: number,
  culturalScore: number,
  yearsExperience: number
): 'beginner' | 'intermediate' | 'advanced' {
  const overallScore = (skillsScore + culturalScore) / 2;

  if (overallScore >= 80 || yearsExperience >= 5) {
    return 'advanced';
  } else if (overallScore >= 60 || yearsExperience >= 2) {
    return 'intermediate';
  } else {
    return 'beginner';
  }
}
```

#### 6. Estimate Completion Time

```typescript
function estimateCompletionWeeks(
  priorityAreas: PriorityArea[],
  courses: Course[],
  timeCommitment: string
): number {
  const totalLearningMinutes = courses.reduce((sum, c) => sum + c.duration, 0);

  const weeklyMinutes = {
    light: 90,      // 1.5 hours/week
    moderate: 240,  // 4 hours/week
    intensive: 420  // 7 hours/week
  };

  const baseWeeks = Math.ceil(totalLearningMinutes / weeklyMinutes[timeCommitment]);

  // Add buffer for practice, assessments, check-ins
  const buffer = 1.3;

  return Math.min(Math.ceil(baseWeeks * buffer), 16); // Cap at 16 weeks
}
```

### Example Implementation (Node.js/TypeScript)

```typescript
async function generateLearningPath(
  userId: string,
  assessmentData: AssessmentData
): Promise<LearningPath> {
  // 1. Identify priority areas
  const priorityAreas = identifyPriorityAreas(
    assessmentData.skillRatings,
    assessmentData.role,
    assessmentData.culturalCompetencyScore
  );

  // 2. Calculate priority scores and sort
  priorityAreas.forEach(area => {
    area.priorityScore = calculatePriorityScore(area, assessmentData);
  });
  priorityAreas.sort((a, b) => b.priorityScore - a.priorityScore);

  // 3. Recommend courses
  const courses = await recommendCourses(
    priorityAreas,
    assessmentData.role,
    assessmentData.learningPreferences
  );

  // 4. Create milestones
  const estimatedWeeks = estimateCompletionWeeks(
    priorityAreas,
    courses,
    assessmentData.learningPreferences.timeCommitment
  );

  const milestones = createMilestones(
    courses,
    estimatedWeeks,
    priorityAreas
  );

  // 5. Calculate difficulty
  const difficulty = calculateDifficultyLevel(
    assessmentData.skillsScore,
    assessmentData.culturalCompetencyScore,
    assessmentData.culturalBackground.yearsInTargetCountry || 0
  );

  // 6. Create learning path
  const learningPath: LearningPath = {
    userId,
    assessmentId: assessmentData.assessmentId,
    pathName: `${assessmentData.role} Cultural Integration & Development`,
    pathDescription: `Personalized learning journey for ${assessmentData.culturalBackground.countryOfOrigin} healthcare professionals`,
    overallScore: (assessmentData.skillsScore + assessmentData.culturalCompetencyScore) / 2,
    culturalCompetencyScore: assessmentData.culturalCompetencyScore,
    skillsScore: assessmentData.skillsScore,
    estimatedCompletionWeeks: estimatedWeeks,
    difficultyLevel: difficulty,
    isActive: true,
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
  };

  // 7. Save to database
  const savedPath = await db.learningPaths.create(learningPath);
  await db.priorityAreas.createMany(priorityAreas.map(a => ({
    ...a,
    learningPathId: savedPath.id
  })));
  await db.recommendedCourses.createMany(courses.map(c => ({
    ...c,
    learningPathId: savedPath.id
  })));
  await db.milestones.createMany(milestones.map(m => ({
    ...m,
    learningPathId: savedPath.id
  })));

  // 8. Create review cycle
  await createReviewCycle(userId, savedPath.id, estimatedWeeks);

  return savedPath;
}
```

## Database Setup

### Tables Required

See `docs/assessment-database-schema.md` for complete schema.

**Quick Setup:**
1. Run schema creation scripts in order
2. Add indexes
3. Create views
4. Set up row-level security
5. Insert seed data for courses

### Seed Data Needed

Create seed data for:
- **Courses:** Standard healthcare onboarding courses
- **Course Categories:** Clinical, Technical, Communication, Compliance, Cultural
- **Default Milestones:** Templates for 30/60/90-day milestones

## Authentication & Authorization

### Required Middleware

```typescript
// Verify user is authenticated
authMiddleware: (req, res, next) => {
  // Check session/JWT
  // Set req.userId
}

// Verify user owns resource
ownershipMiddleware: (req, res, next) => {
  // Check resource belongs to req.userId
  // Or user is admin
}
```

### Endpoints Security

- All `/api/*` routes require authentication
- `/api/learning-paths/:userId` requires ownership or admin role
- `/api/analytics/*` requires admin role (except `/me` endpoint)

## Testing Strategy

### Unit Tests

Test learning path generation logic:
- Priority area identification
- Course recommendation
- Milestone creation
- Score calculation

### Integration Tests

Test API endpoints:
- Assessment submission flow
- Learning path retrieval
- Course enrollment
- Progress updates

### E2E Tests

Test complete user journey:
1. Submit assessment
2. Retrieve learning path
3. Enroll in course
4. Update progress
5. Complete milestone

## Performance Considerations

### Caching

Cache these expensive operations:
- Learning path retrieval (5 min TTL)
- Course catalog (1 hour TTL)
- Priority areas (5 min TTL)

### Async Processing

Consider async for:
- Learning path generation (can take 2-3 seconds)
- Analytics calculation
- Email notifications

### Database Indexes

Ensure indexes on:
- `user_assessments.user_id`
- `learning_paths.user_id, is_active`
- `recommended_courses.learning_path_id, priority_order`
- `milestones.learning_path_id, is_completed`

## Monitoring & Logging

### Metrics to Track

- Assessment submission rate
- Average completion time
- Learning path generation time
- API response times
- Error rates by endpoint

### Alerts

Set up alerts for:
- API error rate > 5%
- Response time > 2 seconds
- Failed submissions
- Database connection issues

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Seed data inserted
- [ ] API endpoints tested
- [ ] CORS configured for frontend domain
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Monitoring dashboards created
- [ ] Backup strategy in place
- [ ] Documentation updated

## Frontend Changes Required

✅ **None!** Frontend is already integrated.

Once backend is deployed:
1. Update `VITE_API_URL` environment variable
2. Frontend will automatically connect
3. Mock data will stop showing
4. Real user data will display

## Support

For questions or issues:
- 📧 Technical: dev@culturalstaffingsolutions.com
- 📚 Documentation: See `docs/` folder
- 🐛 Bugs: GitHub Issues

---

**Last Updated:** January 2025
**Status:** Ready for Backend Implementation
