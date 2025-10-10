# Analytics API Endpoints Documentation

## Base URL
```
http://localhost:3001/api/analytics
```

All endpoints require authentication via session cookie.

---

## Table of Contents
1. [Dashboard & Overview](#dashboard--overview)
2. [Performance Metrics](#performance-metrics)
3. [Skill Gap Analysis](#skill-gap-analysis)
4. [Training Effectiveness](#training-effectiveness)
5. [Sentiment Analysis](#sentiment-analysis)
6. [Retention Predictions](#retention-predictions)
7. [Alerts & Insights](#alerts--insights)
8. [Interaction Tracking](#interaction-tracking)

---

## Dashboard & Overview

### GET /dashboard
Get organization-wide analytics overview

**Query Parameters:**
- `organizationId` (optional): Filter by organization
- `period` (optional): Time period (default: "current-month")
  - Options: `current-week`, `current-month`, `current-quarter`, `current-year`, `last-30-days`, `last-90-days`

**Response:**
```json
{
  "period": "current-month",
  "dateRange": {
    "start": "2025-10-01T00:00:00.000Z",
    "end": "2025-10-31T23:59:59.999Z"
  },
  "metrics": {
    "total_employees": 150,
    "avg_performance": 78.5,
    "avg_engagement": 82.3,
    "active_employees": 145
  },
  "training": {
    "avg_completion_rate": 87.2,
    "avg_training_engagement": 79.8,
    "avg_knowledge_gain": 24.5
  },
  "retention": {
    "total_assessed": 150,
    "low_risk": 112,
    "moderate_risk": 30,
    "high_risk": 6,
    "critical_risk": 2,
    "avg_attrition_risk": 18.5
  },
  "alerts": [
    { "severity": "info", "count": 5 },
    { "severity": "warning", "count": 3 },
    { "severity": "critical", "count": 1 }
  ]
}
```

---

## Performance Metrics

### GET /performance/:userId
Get performance metrics for a specific user

**Parameters:**
- `userId` (path): User ID

**Query Parameters:**
- `period` (optional): Specific period (e.g., "2025-10")

**Response:**
```json
{
  "metrics": {
    "id": "uuid",
    "user_id": "uuid",
    "period": "2025-10",
    "goal_achievement_rate": 85,
    "work_quality_score": 90,
    "productivity_efficiency": 82,
    "engagement_score": 88,
    "overall_performance": 86,
    "created_at": "2025-10-01T00:00:00.000Z",
    "updated_at": "2025-10-10T00:00:00.000Z"
  },
  "goals": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "goal_type": "clinical",
      "title": "Complete 5 patient assessments",
      "description": "...",
      "target_value": 5,
      "current_value": 4,
      "deadline": "2025-10-31T00:00:00.000Z",
      "status": "on_track",
      "completion_rate": 80
    }
  ]
}
```

### POST /performance
Create or update performance metrics

**Request Body:**
```json
{
  "userId": "uuid",
  "period": "2025-10",
  "goalAchievementRate": 85,
  "workQualityScore": 90,
  "productivityEfficiency": 82,
  "engagementScore": 88,
  "overallPerformance": 86
}
```

**Response:** Created performance metric object (201)

---

## Skill Gap Analysis

### GET /skills/:userId
Get skill gap analysis for a user

**Parameters:**
- `userId` (path): User ID

**Response:**
```json
{
  "assessment": {
    "id": "uuid",
    "user_id": "uuid",
    "assessment_date": "2025-10-10T00:00:00.000Z",
    "overall_gap_score": 25,
    "created_at": "2025-10-10T00:00:00.000Z"
  },
  "skillAreas": [
    {
      "id": "uuid",
      "assessment_id": "uuid",
      "category": "Clinical Skills",
      "skill_name": "Patient Assessment",
      "current_level": 60,
      "required_level": 90,
      "gap": 30,
      "priority": "high",
      "training_recommendations": [
        "Advanced Patient Assessment Course",
        "Clinical Decision Making Workshop"
      ]
    }
  ]
}
```

### POST /skills
Create skill assessment

**Request Body:**
```json
{
  "userId": "uuid",
  "skillAreas": [
    {
      "category": "Clinical Skills",
      "skillName": "Patient Assessment",
      "currentLevel": 60,
      "requiredLevel": 90,
      "trainingRecommendations": ["Course 1", "Course 2"]
    }
  ]
}
```

**Response:** Created assessment and skill areas (201)

---

## Training Effectiveness

### GET /training/:courseId
Get training effectiveness metrics for a course

**Parameters:**
- `courseId` (path): Course ID

**Query Parameters:**
- `period` (optional): Specific period (e.g., "2025-10")

**Response:**
```json
{
  "id": "uuid",
  "course_id": "CULT-101",
  "period": "2025-10",
  "completion_rate": 87.5,
  "average_time_to_complete": 8.5,
  "engagement_score": 82,
  "pre_assessment_average": 65.2,
  "post_assessment_average": 89.8,
  "knowledge_improvement": 24.6,
  "pass_rate": 92.3,
  "time_to_competency": 12.5,
  "transfer_of_training": 78,
  "manager_satisfaction_score": 85,
  "productivity_increase": 15.2,
  "error_reduction": 22.5,
  "patient_satisfaction_impact": 8.3,
  "total_enrollments": 45,
  "sample_size": 40,
  "last_calculated": "2025-10-10T00:00:00.000Z"
}
```

### GET /training/learner/:userId
Get learner engagement for a user

**Parameters:**
- `userId` (path): User ID

**Response:** Array of learner engagement objects

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "course_id": "CULT-101",
    "time_spent": 180,
    "videos_watched": 8,
    "interactions_completed": 15,
    "quizzes_attempted": 3,
    "resources_downloaded": 5,
    "forum_participation": 2,
    "last_activity": "2025-10-10T00:00:00.000Z",
    "engagement_score": 85
  }
]
```

---

## Sentiment Analysis

### GET /sentiment/:userId
Get sentiment analysis for a user

**Parameters:**
- `userId` (path): User ID

**Query Parameters:**
- `limit` (optional): Number of records (default: 10)

**Response:**
```json
{
  "sentiment": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "analysis_date": "2025-10-10T00:00:00.000Z",
      "overall_sentiment": "positive",
      "sentiment_score": 75.5,
      "job_satisfaction": 80,
      "work_life_balance": 70,
      "team_dynamics": 85,
      "management_support": 75,
      "career_growth": 72,
      "workload": 68,
      "burnout_risk": "low",
      "attrition_risk": "low",
      "feedback_analyzed": 3,
      "key_themes": ["collaboration", "growth opportunities", "work-life balance"],
      "positive_indicators": ["Strong team support", "Clear career path"],
      "concern_indicators": ["Workload concerns"]
    }
  ],
  "feedback": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "feedback_type": "survey",
      "responses": {
        "overallFeeling": 4,
        "confidence": 4,
        "topPriority": "Career growth"
      },
      "raw_text": "I'm feeling confident about my role...",
      "sentiment_score": 80,
      "analyzed_themes": ["confidence", "career development"],
      "created_at": "2025-10-10T00:00:00.000Z"
    }
  ]
}
```

### POST /sentiment
Create sentiment analysis from feedback

**Request Body:**
```json
{
  "userId": "uuid",
  "feedbackType": "survey",
  "responses": {
    "overallFeeling": 4,
    "confidence": 4,
    "topPriority": "Career growth"
  },
  "rawText": "I'm feeling confident about my role...",
  "sentimentScore": 80,
  "analyzedThemes": ["confidence", "career development"]
}
```

**Response:** Created feedback and sentiment analysis (201)

---

## Retention Predictions

### GET /retention/:userId
Get retention prediction for a user

**Parameters:**
- `userId` (path): User ID

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "prediction_date": "2025-10-10T00:00:00.000Z",
  "attrition_risk": 15.5,
  "risk_level": "low",
  "confidence": 87.2,
  "trend_direction": "stable",
  "model_version": "v1.0",
  "feature_importance": {
    "sentiment_score": 0.35,
    "engagement_score": 0.25,
    "overtime_hours": 0.20,
    "training_completion": 0.10,
    "manager_relationship": 0.10
  },
  "created_at": "2025-10-10T00:00:00.000Z"
}
```

### GET /retention/high-risk
Get all high-risk employees

**Query Parameters:**
- `organizationId` (optional): Filter by organization

**Response:** Array of high-risk employee predictions with user details

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "attrition_risk": 75.3,
    "risk_level": "high",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "nurse"
  }
]
```

---

## Alerts & Insights

### GET /alerts
Get analytics alerts

**Query Parameters:**
- `category` (optional): Filter by category (performance, training, sentiment, retention)
- `severity` (optional): Filter by severity (info, warning, critical)
- `resolved` (optional): Filter by resolution status (true/false)

**Response:**
```json
[
  {
    "id": "uuid",
    "severity": "warning",
    "category": "retention",
    "title": "High attrition risk detected",
    "description": "3 employees showing elevated attrition risk",
    "affected_users": ["uuid1", "uuid2", "uuid3"],
    "action_required": true,
    "recommendations": [
      "Schedule 1:1 meetings",
      "Review workload distribution"
    ],
    "resolved_at": null,
    "created_at": "2025-10-10T00:00:00.000Z"
  }
]
```

### GET /insights
Get AI-generated insights

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Number of results (default: 20)

**Response:**
```json
[
  {
    "id": "uuid",
    "insight_type": "pattern",
    "category": "training",
    "title": "Improved engagement with video content",
    "description": "Courses with video content show 25% higher engagement",
    "confidence": 92.5,
    "impact": "high",
    "suggested_actions": [
      "Add more video content to existing courses",
      "Prioritize video production for new modules"
    ],
    "data_points": {
      "video_courses_engagement": 87.2,
      "text_courses_engagement": 62.1
    },
    "created_at": "2025-10-10T00:00:00.000Z"
  }
]
```

---

## Interaction Tracking

### POST /interactions
Track user interaction

**Request Body:**
```json
{
  "eventType": "course_complete",
  "entityType": "course",
  "entityId": "CULT-101",
  "metadata": {
    "completionTime": 180,
    "score": 92
  }
}
```

**Response:** Created interaction record (201)

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "event_type": "course_complete",
  "entity_type": "course",
  "entity_id": "CULT-101",
  "metadata": {
    "completionTime": 180,
    "score": 92
  },
  "created_at": "2025-10-10T00:00:00.000Z"
}
```

---

## Common Event Types

### Interaction Event Types
- `step_view` - User viewed an assessment step
- `role_select` - User selected their role
- `sentiment_select` - User selected sentiment emoji
- `sentiment_adjust` - User adjusted confidence slider
- `priority_select` - User selected top priority
- `feedback_input` - User entered feedback text
- `course_start` - User started a course
- `course_complete` - User completed a course
- `quiz_attempt` - User attempted a quiz
- `resource_download` - User downloaded a resource

---

## Error Responses

All endpoints return standard error responses:

**401 Unauthorized:**
```json
{
  "message": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Failed to fetch analytics",
  "code": "ANALYTICS_ERROR"
}
```

---

## Authentication

All analytics endpoints require an active session. Users must be logged in via `/api/auth/login` before accessing analytics data.

Session is validated using the `requireAuth` middleware which checks for `req.session.userId`.

---

## Next Steps

1. **Run Database Migration**: Execute `analytics-schema.sql` to create all tables
2. **Test Endpoints**: Use Postman or curl to test each endpoint
3. **Integrate Frontend**: Connect frontend analytics service to these endpoints
4. **Deploy ML Models**: Implement advanced sentiment analysis and retention prediction models
5. **Set Up Cron Jobs**: Schedule periodic analytics calculations and aggregations
