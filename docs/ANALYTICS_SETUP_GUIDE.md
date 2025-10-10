# Analytics System Setup Guide

## Quick Start

This guide will help you set up the complete analytics system for Cultural Staffing Solutions.

---

## Prerequisites

- ✅ Node.js installed
- ✅ PostgreSQL database (Neon) running
- ✅ Environment variables configured
- ✅ Backend and frontend servers running

---

## Step 1: Run Database Migration

The analytics system requires 13 additional database tables. Execute the migration script:

### Option A: Using psql (Recommended)

```bash
# Navigate to backend directory
cd backend

# Run the migration script
psql $DATABASE_URL -f src/database/analytics-schema.sql
```

### Option B: Using pg_restore

```bash
# If you have a connection string in .env
export DATABASE_URL="your-connection-string-here"

# Run migration
psql $DATABASE_URL < src/database/analytics-schema.sql
```

### Option C: Using Node.js script

Create a migration runner:

```bash
# Create migration script
cat > backend/src/scripts/run-analytics-migration.ts << 'EOF'
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '../database/analytics-schema.sql'),
      'utf8'
    );

    console.log('Running analytics migration...');
    await pool.query(sql);
    console.log('✅ Analytics migration completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
EOF

# Run the migration
npx tsx backend/src/scripts/run-analytics-migration.ts
```

### Verify Migration

Check that all tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE '%analytics%'
OR table_name IN (
  'performance_metrics',
  'performance_goals',
  'skill_assessments',
  'skill_areas',
  'training_effectiveness',
  'learner_engagement',
  'employee_feedback',
  'sentiment_analysis',
  'retention_predictions',
  'retention_data_points',
  'analytics_alerts',
  'ai_insights',
  'user_interactions'
);
```

Expected output: 13 tables

---

## Step 2: Test API Endpoints

### Test Backend is Running

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-10T...",
  "version": "1.0.0"
}
```

### Test Analytics Endpoint (requires login)

```bash
# First, login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt

# Then, fetch dashboard analytics
curl http://localhost:3001/api/analytics/dashboard \
  -b cookies.txt
```

---

## Step 3: Seed Sample Analytics Data (Optional)

Create sample data for testing:

```sql
-- Insert sample performance metrics
INSERT INTO performance_metrics (
  user_id, period, goal_achievement_rate, work_quality_score,
  productivity_efficiency, engagement_score, overall_performance
) VALUES (
  '0d21d737-353f-4b6d-b0a9-93cccb43730f', -- Replace with actual user ID
  '2025-10',
  85, 90, 82, 88, 86
);

-- Insert sample sentiment analysis
INSERT INTO sentiment_analysis (
  user_id, overall_sentiment, sentiment_score,
  job_satisfaction, work_life_balance, team_dynamics,
  management_support, career_growth, workload,
  burnout_risk, attrition_risk, feedback_analyzed
) VALUES (
  '0d21d737-353f-4b6d-b0a9-93cccb43730f',
  'positive', 75.5,
  80, 70, 85, 75, 72, 68,
  'low', 'low', 3
);

-- Insert sample retention prediction
INSERT INTO retention_predictions (
  user_id, attrition_risk, risk_level, confidence,
  trend_direction, model_version, feature_importance
) VALUES (
  '0d21d737-353f-4b6d-b0a9-93cccb43730f',
  15.5, 'low', 87.2,
  'stable', 'v1.0',
  '{"sentiment_score": 0.35, "engagement_score": 0.25, "overtime_hours": 0.20}'::jsonb
);
```

---

## Step 4: Verify Frontend Integration

### Test Analytics Dashboard

1. Navigate to: `http://localhost:8080/admin/analytics`
2. You should see 5 tabs: Overview, Training, Skills, Sentiment, Retention
3. Currently displays mock data - will show real data after integration

### Test Assessment Analytics Tracking

1. Start an onboarding assessment: `http://localhost:8080/employee/onboarding`
2. Complete all 7 steps (including new sentiment step)
3. Check browser console for analytics data logs
4. Verify interactions are tracked in `user_interactions` table

```sql
SELECT * FROM user_interactions
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC
LIMIT 10;
```

---

## Step 5: Configure Analytics Submission

Update the assessment submission to save analytics data:

### In `backend/src/controllers/assessmentController.ts`

Add analytics saving after learning path creation:

```typescript
// After creating learning path, save analytics data
if (analyticsData) {
  // Save sentiment data
  if (sentimentData) {
    const sentimentScore = (sentimentData.overallFeeling / 5) * 100;

    await db.query(`
      INSERT INTO sentiment_analysis (
        user_id, overall_sentiment, sentiment_score,
        burnout_risk, attrition_risk, feedback_analyzed
      ) VALUES ($1, $2, $3, $4, $5, 1)
    `, [
      userId,
      sentimentScore >= 60 ? 'positive' : 'neutral',
      sentimentScore,
      sentimentScore < 50 ? 'moderate' : 'low',
      sentimentScore < 40 ? 'moderate' : 'low'
    ]);
  }

  // Save interaction tracking
  if (analyticsData.interactions) {
    for (const interaction of analyticsData.interactions) {
      await db.query(`
        INSERT INTO user_interactions (
          user_id, event_type, entity_type, entity_id, metadata
        ) VALUES ($1, $2, $3, $4, $5)
      `, [
        userId,
        interaction.eventType,
        interaction.entityType,
        interaction.entityId,
        interaction.metadata || {}
      ]);
    }
  }
}
```

---

## Step 6: Enable Real-Time Analytics

### Set up periodic calculation jobs

Create a cron job or scheduled task to calculate analytics:

```typescript
// backend/src/jobs/analytics-calculator.ts
import { Pool } from 'pg';
import cron from 'node-cron';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running daily analytics calculations...');

  // Calculate training effectiveness
  await pool.query(`
    INSERT INTO training_effectiveness (course_id, period, ...)
    SELECT ... FROM learner_engagement
    GROUP BY course_id
  `);

  // Update performance metrics
  // Generate alerts
  // etc.

  console.log('✅ Analytics calculations complete');
});
```

---

## Troubleshooting

### Issue: "Table does not exist"
**Solution**: Run the database migration again

### Issue: "Authentication required"
**Solution**: Make sure you're logged in via `/api/auth/login`

### Issue: "CORS error"
**Solution**: Check that backend CORS is configured for your frontend URL

### Issue: "No data showing in dashboard"
**Solution**:
1. Check database has sample data
2. Verify API endpoints return data
3. Check browser console for errors
4. Ensure frontend is calling correct endpoints

---

## Monitoring & Maintenance

### Daily Tasks
- ✅ Check analytics_alerts table for new alerts
- ✅ Review high-risk employees from retention predictions
- ✅ Monitor system performance

### Weekly Tasks
- ✅ Review AI insights for patterns
- ✅ Update training recommendations based on skill gaps
- ✅ Validate ML model accuracy

### Monthly Tasks
- ✅ Generate executive reports
- ✅ Retrain ML models with new data
- ✅ Review and optimize database queries
- ✅ Archive old analytics data

---

## Next Steps

1. **Implement ML Models**
   - Deploy Random Forest for retention prediction
   - Implement NLP for sentiment analysis
   - Add K-NN for skill matching

2. **Build Advanced Features**
   - Manager-specific dashboards
   - Email alerts for critical issues
   - Mobile app integration
   - Predictive scheduling

3. **Optimize Performance**
   - Add database indexes
   - Implement caching (Redis)
   - Optimize API queries
   - Add pagination for large datasets

4. **Enhance Security**
   - Add role-based access control
   - Implement data encryption
   - Add audit logging
   - GDPR compliance features

---

## Support

For questions or issues:
- Check the [API Documentation](./API_ANALYTICS_ENDPOINTS.md)
- Review the [Implementation Guide](./ANALYTICS_IMPLEMENTATION.md)
- Check the database schema: `backend/src/database/analytics-schema.sql`

## Resources

- TypeScript Types: `src/types/analytics.ts`
- Frontend Service: `src/services/analyticsService.ts`
- Backend Routes: `backend/src/routes/analytics.ts`
- Database Schema: `backend/src/database/analytics-schema.sql`
