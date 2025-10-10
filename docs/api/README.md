# Assessment API Documentation

## 📚 Overview

This directory contains the OpenAPI 3.0 specification for the Cultural Staffing Solutions Assessment API. The API provides comprehensive endpoints for managing healthcare worker assessments, personalized learning paths, course enrollment, and progress tracking.

## 🎯 Features

- **Interactive Documentation**: Full Swagger UI integration for exploring and testing APIs
- **Type-Safe**: Complete TypeScript types generated from OpenAPI spec
- **Real Examples**: Production-ready request/response examples
- **Authentication**: Session-based authentication with cookie support
- **Comprehensive Coverage**: 20+ endpoints across 8 functional areas

## 📖 Accessing the Documentation

### In the Application

Navigate to the API Documentation page in the admin panel:

```
http://localhost:8080/admin/api-docs
```

This provides an interactive Swagger UI where you can:
- Browse all available endpoints
- View request/response schemas
- Test API calls directly in the browser
- Download the OpenAPI specification

### Viewing the Raw Spec

The OpenAPI specification is available at:

```
/docs/api/assessment-api.yaml
```

You can also view it in any OpenAPI-compatible tool:
- [Swagger Editor](https://editor.swagger.io/) - Paste the YAML content
- [Postman](https://www.postman.com/) - Import the file
- [Insomnia](https://insomnia.rest/) - Import the specification

## 🚀 API Endpoints Overview

### Assessments
- `POST /assessments` - Submit completed assessment
- `GET /assessments/history` - Get assessment history
- `POST /assessments/retake` - Start new assessment

### Learning Paths
- `GET /learning-paths/me` - Get current user's learning path
- `GET /learning-paths/{userId}` - Get specific user's path (admin)
- `PATCH /learning-paths/{learningPathId}` - Update progress

### Priority Areas
- `GET /learning-paths/{learningPathId}/priority-areas` - Get focus areas
- `PATCH /priority-areas/{areaId}` - Update progress

### Courses
- `GET /learning-paths/{learningPathId}/courses` - Get recommended courses
- `POST /courses/{courseId}/enroll` - Enroll in course
- `PATCH /courses/{courseId}/progress` - Update progress

### Milestones
- `GET /learning-paths/{learningPathId}/milestones` - Get milestones
- `POST /milestones/{milestoneId}/complete` - Complete milestone

### Review Cycles
- `GET /review-cycles/current` - Get active review cycle
- `POST /check-ins` - Submit progress check-in

### Analytics
- `GET /analytics/assessments/me` - Get personal analytics
- `GET /analytics/assessments/{userId}` - Get user analytics (admin)

### Health
- `GET /health` - API health check

## 🔧 Backend Implementation Guide

### Prerequisites

1. **Database Setup**
   ```bash
   # Apply the schema from docs/assessment-database-schema.md
   psql -U postgres -d culturalstaffing < docs/assessment-database-schema.md
   ```

2. **Environment Variables**
   ```bash
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   API_PORT=3001
   SESSION_SECRET=your-secret-key
   ```

### Implementation Steps

1. **Install Dependencies**
   ```bash
   npm install express cors cookie-parser express-session pg
   npm install --save-dev @types/express @types/cors @types/cookie-parser @types/express-session
   ```

2. **Create Express Server**
   ```typescript
   import express from 'express';
   import cors from 'cors';
   import cookieParser from 'cookie-parser';
   import session from 'express-session';

   const app = express();

   app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
   app.use(express.json());
   app.use(cookieParser());
   app.use(session({
     secret: process.env.SESSION_SECRET!,
     resave: false,
     saveUninitialized: false,
     cookie: { secure: false, httpOnly: true }
   }));

   // Import routes
   import assessmentRoutes from './routes/assessments';
   import learningPathRoutes from './routes/learning-paths';

   app.use('/api/assessments', assessmentRoutes);
   app.use('/api/learning-paths', learningPathRoutes);

   app.listen(3001, () => {
     console.log('Assessment API running on port 3001');
   });
   ```

3. **Implement Learning Path Generation**

   See `docs/backend-integration-guide.md` for the complete algorithm, including:
   - Priority scoring formulas
   - Course recommendation logic
   - Milestone creation strategy
   - Cultural customization

4. **Add Authentication Middleware**
   ```typescript
   export const requireAuth = (req, res, next) => {
     if (!req.session.userId) {
       return res.status(401).json({
         message: 'Authentication required',
         code: 'UNAUTHORIZED'
       });
     }
     next();
   };
   ```

5. **Test Endpoints**
   ```bash
   # Submit assessment
   curl -X POST http://localhost:3001/api/assessments \
     -H "Content-Type: application/json" \
     -d @examples/nurse-assessment.json

   # Get learning path
   curl http://localhost:3001/api/learning-paths/me \
     --cookie "session=your-session-id"
   ```

## 📝 Request/Response Examples

### Submit Assessment

**Request:**
```json
{
  "role": "nurse",
  "culturalBackground": {
    "countryOfOrigin": "Philippines",
    "primaryLanguage": "Tagalog",
    "englishProficiency": 4,
    "yearsInTargetCountry": 0,
    "previousInternationalExperience": false,
    "culturalAdaptationConcerns": [
      "Communication style differences",
      "Healthcare system navigation"
    ]
  },
  "skillRatings": {
    "patient_assessment": 4,
    "medication_administration": 5,
    "wound_care": 3,
    "ehr_systems": 2,
    "medical_equipment": 3,
    "documentation": 3,
    "patient_communication": 4,
    "team_collaboration": 4,
    "cultural_sensitivity": 3,
    "hipaa_privacy": 2,
    "infection_control": 5,
    "safety_protocols": 4
  },
  "learningPreferences": {
    "primaryStyle": "visual",
    "secondaryStyle": "kinesthetic",
    "preferredContentTypes": ["video", "interactive"],
    "timeCommitment": "moderate",
    "notificationFrequency": "weekly"
  },
  "assessmentState": {
    "currentStep": "results",
    "completedSteps": ["welcome", "role", "cultural", "skills", "preferences", "results"],
    "progress": {
      "percentComplete": 100,
      "stepsCompleted": 6,
      "totalSteps": 6
    }
  }
}
```

**Response:**
```json
{
  "assessmentId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "learningPathId": "lp-9876-5432-1098-7654",
  "message": "Assessment submitted successfully. Your personalized learning path has been created!"
}
```

### Get Learning Path

**Response:**
```json
{
  "id": "lp-9876-5432-1098-7654",
  "userId": "user-123",
  "assessmentId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "pathName": "Nurse Cultural Integration & Development",
  "pathDescription": "Personalized learning journey focusing on cultural competency and EHR systems",
  "overallScore": 72,
  "culturalCompetencyScore": 68,
  "skillsScore": 76,
  "estimatedCompletionWeeks": 12,
  "difficultyLevel": "intermediate",
  "isActive": true,
  "status": "in_progress",
  "createdAt": "2025-01-10T12:00:00Z",
  "startedAt": "2025-01-10T12:00:00Z"
}
```

## 🔐 Authentication

All endpoints (except `/health`) require authentication via session cookies:

```typescript
// Frontend request example
const response = await fetch(`${API_BASE_URL}/learning-paths/me`, {
  method: 'GET',
  credentials: 'include', // Important: Send cookies
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## 🧪 Testing

### Manual Testing with cURL

```bash
# Health check (no auth required)
curl http://localhost:3001/api/health

# Submit assessment (with session)
curl -X POST http://localhost:3001/api/assessments \
  -H "Content-Type: application/json" \
  -b "session=your-session-id" \
  -d @test-data/nurse-assessment.json

# Get learning path
curl http://localhost:3001/api/learning-paths/me \
  -b "session=your-session-id"

# Enroll in course
curl -X POST http://localhost:3001/api/courses/c-001/enroll \
  -b "session=your-session-id"

# Update course progress
curl -X PATCH http://localhost:3001/api/courses/c-001/progress \
  -H "Content-Type: application/json" \
  -b "session=your-session-id" \
  -d '{"progressPercentage": 45}'
```

### Testing with Swagger UI

1. Navigate to `/admin/api-docs`
2. Click "Try it out" on any endpoint
3. Fill in request parameters
4. Click "Execute"
5. View response

## 📊 Learning Path Generation Algorithm

The backend should implement the following algorithm when generating learning paths:

```typescript
// Priority Score Calculation
const calculatePriorityScore = (area) => {
  const gapSize = (area.targetLevel - area.currentLevel) / 4; // 0-1
  const importanceWeight = {
    critical: 1.0,
    high: 0.75,
    medium: 0.5,
    low: 0.25
  };

  return (
    gapSize * 0.4 +
    importanceWeight[area.importance] * 0.3 +
    area.roleRelevance * 0.2 +
    area.culturalRelevance * 0.1
  );
};

// Course Recommendation
const recommendCourses = (priorityAreas, userProfile) => {
  const courses = [];

  for (const area of priorityAreas.sort((a, b) => b.priority - a.priority)) {
    const matchingCourses = findCoursesForArea(area);

    for (const course of matchingCourses) {
      const score = calculateCourseScore(course, userProfile, area);
      courses.push({ ...course, score });
    }
  }

  return courses
    .sort((a, b) => b.score - a.score)
    .slice(0, 15); // Top 15 courses
};
```

See `docs/backend-integration-guide.md` for complete implementation details.

## 🗂️ File Structure

```
docs/api/
├── README.md                 # This file
├── assessment-api.yaml       # OpenAPI 3.0 specification
└── examples/
    ├── nurse-assessment.json
    ├── physician-assessment.json
    └── allied-health-assessment.json

public/docs/api/
└── assessment-api.yaml       # Copy for Swagger UI

src/pages/admin/
└── APIDocumentation.tsx      # Swagger UI page

src/services/
└── assessmentService.ts      # API client

src/hooks/
└── useAssessmentData.ts      # React hooks for data fetching
```

## 🔄 Updating the API Spec

When making changes to the API:

1. Edit `docs/api/assessment-api.yaml`
2. Copy to public directory:
   ```bash
   cp docs/api/assessment-api.yaml public/docs/api/
   ```
3. Rebuild the frontend:
   ```bash
   npm run build
   ```
4. Verify changes in Swagger UI at `/admin/api-docs`

## 📚 Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [Backend Integration Guide](../backend-integration-guide.md)
- [Database Schema](../assessment-database-schema.md)
- [Assessment Feature Guide](../assessment-feature-guide.md)

## 🤝 Contributing

When adding new endpoints:

1. Add the endpoint definition to `assessment-api.yaml`
2. Include request/response examples
3. Update this README with usage examples
4. Implement the frontend service method in `assessmentService.ts`
5. Add React hooks if needed in `useAssessmentData.ts`
6. Test in Swagger UI

## 📞 Support

For questions or issues with the API:
- Review the Swagger UI documentation
- Check the backend integration guide
- Contact the development team
