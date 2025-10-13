import express from 'express';
import { db } from '../server';

const router = express.Router();

// Authentication middleware
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: 'Authentication required',
      code: 'UNAUTHORIZED'
    });
  }
  next();
};

// ============================================================================
// Dashboard & Overview Analytics
// ============================================================================

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get organization-wide analytics overview
 *     description: Aggregates key metrics across performance, training, retention, and alerts for the specified time period
 *     tags: [Analytics - Dashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by organization (optional)
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [current-week, current-month, current-quarter, current-year, last-30-days, last-90-days]
 *           default: current-month
 *         description: Time period for analytics
 *     responses:
 *       200:
 *         description: Dashboard analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                 dateRange:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       format: date-time
 *                     end:
 *                       type: string
 *                       format: date-time
 *                 metrics:
 *                   type: object
 *                   properties:
 *                     total_employees:
 *                       type: integer
 *                     avg_performance:
 *                       type: number
 *                     avg_engagement:
 *                       type: number
 *                     active_employees:
 *                       type: integer
 *                 training:
 *                   type: object
 *                   properties:
 *                     avg_completion_rate:
 *                       type: number
 *                     avg_training_engagement:
 *                       type: number
 *                     avg_knowledge_gain:
 *                       type: number
 *                 retention:
 *                   type: object
 *                   properties:
 *                     total_assessed:
 *                       type: integer
 *                     low_risk:
 *                       type: integer
 *                     moderate_risk:
 *                       type: integer
 *                     high_risk:
 *                       type: integer
 *                     critical_risk:
 *                       type: integer
 *                     avg_attrition_risk:
 *                       type: number
 *                 alerts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       severity:
 *                         type: string
 *                       count:
 *                         type: integer
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const { organizationId, period = 'current-month' } = req.query;

    // Calculate date range based on period
    const dateRange = calculateDateRange(period as string);

    // Aggregate metrics across organization
    const metricsQuery = `
      SELECT
        COUNT(DISTINCT user_id) as total_employees,
        AVG(overall_performance) as avg_performance,
        AVG(engagement_score) as avg_engagement,
        COUNT(DISTINCT CASE WHEN updated_at >= $1 THEN user_id END) as active_employees
      FROM performance_metrics
      WHERE updated_at >= $1 AND updated_at <= $2
      ${organizationId ? 'AND organization_id = $3' : ''}
    `;

    const params: (Date | string)[] = [dateRange.start, dateRange.end];
    if (organizationId) params.push(organizationId as string);

    const metricsResult = await db.query(metricsQuery, params);

    // Get training metrics
    const trainingQuery = `
      SELECT
        AVG(completion_rate) as avg_completion_rate,
        AVG(engagement_score) as avg_training_engagement,
        AVG(knowledge_improvement) as avg_knowledge_gain
      FROM training_effectiveness
      WHERE last_calculated >= $1 AND last_calculated <= $2
    `;

    const trainingResult = await db.query(trainingQuery, [dateRange.start, dateRange.end]);

    // Get retention metrics
    const retentionQuery = `
      SELECT
        COUNT(*) as total_assessed,
        COUNT(CASE WHEN risk_level = 'low' THEN 1 END) as low_risk,
        COUNT(CASE WHEN risk_level = 'moderate' THEN 1 END) as moderate_risk,
        COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risk,
        COUNT(CASE WHEN risk_level = 'critical' THEN 1 END) as critical_risk,
        AVG(attrition_risk) as avg_attrition_risk
      FROM retention_predictions
      WHERE prediction_date >= $1 AND prediction_date <= $2
    `;

    const retentionResult = await db.query(retentionQuery, [dateRange.start, dateRange.end]);

    // Get alerts
    const alertsQuery = `
      SELECT severity, COUNT(*) as count
      FROM analytics_alerts
      WHERE created_at >= $1 AND created_at <= $2 AND resolved_at IS NULL
      GROUP BY severity
    `;

    const alertsResult = await db.query(alertsQuery, [dateRange.start, dateRange.end]);

    res.json({
      period: period,
      dateRange,
      metrics: metricsResult.rows[0],
      training: trainingResult.rows[0],
      retention: retentionResult.rows[0],
      alerts: alertsResult.rows,
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard analytics',
      code: 'ANALYTICS_ERROR'
    });
  }
});

// ============================================================================
// Performance Metrics
// ============================================================================

/**
 * @swagger
 * /api/analytics/performance/{userId}:
 *   get:
 *     summary: Get individual performance metrics and goals
 *     description: Retrieves performance metrics and associated goals for a specific user
 *     tags: [Analytics - Performance]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *         description: Specific period (e.g., "2025-10")
 *     responses:
 *       200:
 *         description: Performance metrics and goals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metrics:
 *                   $ref: '#/components/schemas/PerformanceMetrics'
 *                 goals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PerformanceGoal'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/performance/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { period } = req.query;

    // Get performance metrics
    const metricsQuery = `
      SELECT *
      FROM performance_metrics
      WHERE user_id = $1
      ${period ? 'AND period = $2' : 'ORDER BY created_at DESC LIMIT 1'}
    `;

    const params = period ? [userId, period] : [userId];
    const metricsResult = await db.query(metricsQuery, params);

    // Get performance goals
    const goalsQuery = `
      SELECT *
      FROM performance_goals
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const goalsResult = await db.query(goalsQuery, [userId]);

    res.json({
      metrics: metricsResult.rows[0] || null,
      goals: goalsResult.rows,
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({
      message: 'Failed to fetch performance metrics',
      code: 'ANALYTICS_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/analytics/performance:
 *   post:
 *     summary: Create or update performance metrics
 *     description: Creates new performance metrics or updates existing ones for a user period
 *     tags: [Analytics - Performance]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - period
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               period:
 *                 type: string
 *                 example: "2025-10"
 *               goalAchievementRate:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               workQualityScore:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               productivityEfficiency:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               engagementScore:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               overallPerformance:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       201:
 *         description: Performance metrics created or updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PerformanceMetrics'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/performance', requireAuth, async (req, res) => {
  try {
    const {
      userId,
      period,
      goalAchievementRate,
      workQualityScore,
      productivityEfficiency,
      engagementScore,
      overallPerformance
    } = req.body;

    const query = `
      INSERT INTO performance_metrics (
        user_id, period, goal_achievement_rate, work_quality_score,
        productivity_efficiency, engagement_score, overall_performance
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id, period)
      DO UPDATE SET
        goal_achievement_rate = EXCLUDED.goal_achievement_rate,
        work_quality_score = EXCLUDED.work_quality_score,
        productivity_efficiency = EXCLUDED.productivity_efficiency,
        engagement_score = EXCLUDED.engagement_score,
        overall_performance = EXCLUDED.overall_performance,
        updated_at = NOW()
      RETURNING *
    `;

    const result = await db.query(query, [
      userId,
      period,
      goalAchievementRate,
      workQualityScore,
      productivityEfficiency,
      engagementScore,
      overallPerformance
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create performance metrics error:', error);
    res.status(500).json({
      message: 'Failed to create performance metrics',
      code: 'ANALYTICS_ERROR'
    });
  }
});

// ============================================================================
// Skill Gap Analysis
// ============================================================================

/**
 * @swagger
 * /api/analytics/skills/{userId}:
 *   get:
 *     summary: Get skill gap analysis for a user
 *     description: Retrieves the latest skill assessment and associated skill areas with gap analysis
 *     tags: [Analytics - Skills]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: Skill assessment and gap analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assessment:
 *                   $ref: '#/components/schemas/SkillAssessment'
 *                 skillAreas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SkillArea'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/skills/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get latest skill assessment
    const assessmentQuery = `
      SELECT *
      FROM skill_assessments
      WHERE user_id = $1
      ORDER BY assessment_date DESC
      LIMIT 1
    `;

    const assessmentResult = await db.query(assessmentQuery, [userId]);

    if (assessmentResult.rows.length === 0) {
      return res.json({ assessment: null, skillAreas: [] });
    }

    const assessment = assessmentResult.rows[0];

    // Get skill areas for this assessment
    const areasQuery = `
      SELECT *
      FROM skill_areas
      WHERE assessment_id = $1
      ORDER BY priority DESC, gap DESC
    `;

    const areasResult = await db.query(areasQuery, [assessment.id]);

    res.json({
      assessment,
      skillAreas: areasResult.rows,
    });
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    res.status(500).json({
      message: 'Failed to fetch skill gap analysis',
      code: 'ANALYTICS_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/analytics/skills:
 *   post:
 *     summary: Create skill assessment with gap analysis
 *     description: Creates a new skill assessment and automatically calculates gaps and priorities
 *     tags: [Analytics - Skills]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - skillAreas
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               skillAreas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                       example: "Clinical Skills"
 *                     skillName:
 *                       type: string
 *                       example: "Patient Assessment"
 *                     currentLevel:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 100
 *                     requiredLevel:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 100
 *                     trainingRecommendations:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       201:
 *         description: Skill assessment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assessment:
 *                   $ref: '#/components/schemas/SkillAssessment'
 *                 skillAreas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SkillArea'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/skills', requireAuth, async (req, res) => {
  try {
    const { userId, skillAreas } = req.body;

    // Calculate overall gap score
    const overallGapScore = skillAreas.reduce((sum: number, area: any) => sum + (area.gap || 0), 0) / skillAreas.length;

    // Insert skill assessment
    const assessmentQuery = `
      INSERT INTO skill_assessments (user_id, overall_gap_score)
      VALUES ($1, $2)
      RETURNING *
    `;

    const assessmentResult = await db.query(assessmentQuery, [userId, Math.round(overallGapScore)]);
    const assessment = assessmentResult.rows[0];

    // Insert skill areas
    const areasInsertPromises = skillAreas.map((area: any) => {
      const gap = area.requiredLevel - area.currentLevel;
      const priority = gap >= 30 ? 'critical' : gap >= 20 ? 'high' : gap >= 10 ? 'medium' : 'low';

      const query = `
        INSERT INTO skill_areas (
          assessment_id, category, skill_name, current_level,
          required_level, gap, priority, training_recommendations
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      return db.query(query, [
        assessment.id,
        area.category,
        area.skillName,
        area.currentLevel,
        area.requiredLevel,
        gap,
        priority,
        area.trainingRecommendations || []
      ]);
    });

    const areasResults = await Promise.all(areasInsertPromises);
    const areas = areasResults.map(r => r.rows[0]);

    res.status(201).json({
      assessment,
      skillAreas: areas,
    });
  } catch (error) {
    console.error('Create skill assessment error:', error);
    res.status(500).json({
      message: 'Failed to create skill assessment',
      code: 'ANALYTICS_ERROR'
    });
  }
});

// ============================================================================
// Training Effectiveness
// ============================================================================

/**
 * @swagger
 * /api/analytics/training/{courseId}:
 *   get:
 *     summary: Get training effectiveness metrics for a course
 *     description: Retrieves comprehensive training effectiveness data including completion rates, engagement, and knowledge improvement
 *     tags: [Analytics - Training]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *         description: Specific period (e.g., "2025-10")
 *     responses:
 *       200:
 *         description: Training effectiveness metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 course_id:
 *                   type: string
 *                 period:
 *                   type: string
 *                 completion_rate:
 *                   type: number
 *                 average_time_to_complete:
 *                   type: number
 *                 engagement_score:
 *                   type: integer
 *                 pre_assessment_average:
 *                   type: number
 *                 post_assessment_average:
 *                   type: number
 *                 knowledge_improvement:
 *                   type: number
 *                 pass_rate:
 *                   type: number
 *                 time_to_competency:
 *                   type: number
 *                 transfer_of_training:
 *                   type: integer
 *                 manager_satisfaction_score:
 *                   type: integer
 *                 productivity_increase:
 *                   type: number
 *                 error_reduction:
 *                   type: number
 *                 patient_satisfaction_impact:
 *                   type: number
 *                 total_enrollments:
 *                   type: integer
 *                 sample_size:
 *                   type: integer
 *                 last_calculated:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/training/:courseId', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { period } = req.query;

    const query = `
      SELECT *
      FROM training_effectiveness
      WHERE course_id = $1
      ${period ? 'AND period = $2' : 'ORDER BY last_calculated DESC LIMIT 1'}
    `;

    const params = period ? [courseId, period] : [courseId];
    const result = await db.query(query, params);

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Training effectiveness error:', error);
    res.status(500).json({
      message: 'Failed to fetch training effectiveness',
      code: 'ANALYTICS_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/analytics/training/learner/{userId}:
 *   get:
 *     summary: Get learner engagement metrics for a user
 *     description: Retrieves detailed engagement data for all courses a user is enrolled in
 *     tags: [Analytics - Training]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: Learner engagement metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   user_id:
 *                     type: string
 *                     format: uuid
 *                   course_id:
 *                     type: string
 *                   time_spent:
 *                     type: integer
 *                     description: Time spent in minutes
 *                   videos_watched:
 *                     type: integer
 *                   interactions_completed:
 *                     type: integer
 *                   quizzes_attempted:
 *                     type: integer
 *                   resources_downloaded:
 *                     type: integer
 *                   forum_participation:
 *                     type: integer
 *                   last_activity:
 *                     type: string
 *                     format: date-time
 *                   engagement_score:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/training/learner/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT *
      FROM learner_engagement
      WHERE user_id = $1
      ORDER BY updated_at DESC
    `;

    const result = await db.query(query, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Learner engagement error:', error);
    res.status(500).json({
      message: 'Failed to fetch learner engagement',
      code: 'ANALYTICS_ERROR'
    });
  }
});

// ============================================================================
// Sentiment Analysis
// ============================================================================

/**
 * @swagger
 * /api/analytics/sentiment/{userId}:
 *   get:
 *     summary: Get sentiment analysis and feedback for a user
 *     description: Retrieves sentiment analysis history and employee feedback for a specific user
 *     tags: [Analytics - Sentiment]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records to return
 *     responses:
 *       200:
 *         description: Sentiment analysis and feedback data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sentiment:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SentimentAnalysis'
 *                 feedback:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       user_id:
 *                         type: string
 *                         format: uuid
 *                       feedback_type:
 *                         type: string
 *                       responses:
 *                         type: object
 *                       raw_text:
 *                         type: string
 *                       sentiment_score:
 *                         type: number
 *                       analyzed_themes:
 *                         type: array
 *                         items:
 *                           type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/sentiment/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    // Get sentiment analysis history
    const sentimentQuery = `
      SELECT *
      FROM sentiment_analysis
      WHERE user_id = $1
      ORDER BY analysis_date DESC
      LIMIT $2
    `;

    const sentimentResult = await db.query(sentimentQuery, [userId, limit]);

    // Get recent feedback
    const feedbackQuery = `
      SELECT *
      FROM employee_feedback
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;

    const feedbackResult = await db.query(feedbackQuery, [userId, limit]);

    res.json({
      sentiment: sentimentResult.rows,
      feedback: feedbackResult.rows,
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({
      message: 'Failed to fetch sentiment analysis',
      code: 'ANALYTICS_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/analytics/sentiment:
 *   post:
 *     summary: Create sentiment analysis from feedback
 *     description: Analyzes employee feedback and generates sentiment scores with automatic risk assessment
 *     tags: [Analytics - Sentiment]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - feedbackType
 *               - sentimentScore
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               feedbackType:
 *                 type: string
 *                 enum: [survey, interview, check-in, exit]
 *                 example: "survey"
 *               responses:
 *                 type: object
 *                 description: Structured feedback responses
 *               rawText:
 *                 type: string
 *                 description: Free-form feedback text
 *               sentimentScore:
 *                 type: number
 *                 minimum: -100
 *                 maximum: 100
 *               analyzedThemes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["work-life balance", "team collaboration"]
 *     responses:
 *       201:
 *         description: Sentiment analysis created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedback:
 *                   type: object
 *                 sentiment:
 *                   $ref: '#/components/schemas/SentimentAnalysis'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/sentiment', requireAuth, async (req, res) => {
  try {
    const {
      userId,
      feedbackType,
      responses,
      rawText,
      sentimentScore,
      analyzedThemes
    } = req.body;

    // Store feedback
    const feedbackQuery = `
      INSERT INTO employee_feedback (
        user_id, feedback_type, responses, raw_text,
        sentiment_score, analyzed_themes
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const feedbackResult = await db.query(feedbackQuery, [
      userId,
      feedbackType,
      responses,
      rawText,
      sentimentScore,
      analyzedThemes || []
    ]);

    // Calculate sentiment analysis (simplified version - would use ML in production)
    const overallSentiment = sentimentScore >= 60 ? 'very_positive' :
                             sentimentScore >= 40 ? 'positive' :
                             sentimentScore >= 20 ? 'neutral' :
                             sentimentScore >= 0 ? 'negative' : 'very_negative';

    const burnoutRisk = sentimentScore < 30 ? 'high' :
                       sentimentScore < 50 ? 'moderate' : 'low';

    const attritionRisk = sentimentScore < 20 ? 'critical' :
                         sentimentScore < 40 ? 'high' :
                         sentimentScore < 60 ? 'moderate' : 'low';

    const sentimentQuery = `
      INSERT INTO sentiment_analysis (
        user_id, overall_sentiment, sentiment_score,
        burnout_risk, attrition_risk, feedback_analyzed
      )
      VALUES ($1, $2, $3, $4, $5, 1)
      RETURNING *
    `;

    const sentimentResult = await db.query(sentimentQuery, [
      userId,
      overallSentiment,
      sentimentScore,
      burnoutRisk,
      attritionRisk
    ]);

    res.status(201).json({
      feedback: feedbackResult.rows[0],
      sentiment: sentimentResult.rows[0],
    });
  } catch (error) {
    console.error('Create sentiment analysis error:', error);
    res.status(500).json({
      message: 'Failed to create sentiment analysis',
      code: 'ANALYTICS_ERROR'
    });
  }
});

// ============================================================================
// Retention Predictions
// ============================================================================

/**
 * @swagger
 * /api/analytics/retention/high-risk:
 *   get:
 *     summary: Get all high-risk employees
 *     description: Retrieves a list of employees with high or critical attrition risk for intervention planning
 *     tags: [Analytics - Retention]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by organization (optional)
 *     responses:
 *       200:
 *         description: List of high-risk employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/RetentionPrediction'
 *                   - type: object
 *                     properties:
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/retention/high-risk', requireAuth, async (req, res) => {
  try {
    const { organizationId } = req.query;

    const query = `
      SELECT
        rp.*,
        u.first_name,
        u.last_name,
        u.email,
        u.role
      FROM retention_predictions rp
      JOIN users u ON rp.user_id = u.id
      WHERE rp.risk_level IN ('high', 'critical')
      AND rp.prediction_date >= NOW() - INTERVAL '30 days'
      ORDER BY rp.attrition_risk DESC
    `;

    const params = organizationId ? [organizationId] : [];
    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('High-risk employees error:', error);
    res.status(500).json({
      message: 'Failed to fetch high-risk employees',
      code: 'ANALYTICS_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/analytics/retention/{userId}:
 *   get:
 *     summary: Get retention prediction for a user
 *     description: Retrieves ML-powered attrition risk prediction and contributing factors for a specific employee
 *     tags: [Analytics - Retention]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to get retention prediction for
 *     responses:
 *       200:
 *         description: Retention prediction data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetentionPrediction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Retention prediction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/retention/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      `SELECT * FROM retention_predictions
       WHERE user_id = $1
       ORDER BY prediction_date DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Retention prediction not found for this user',
        code: 'NOT_FOUND'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Retention prediction error:', error);
    res.status(500).json({
      message: 'Failed to fetch retention prediction',
      code: 'ANALYTICS_ERROR'
    });
  }
});

// ============================================================================
// Alerts & Insights
// ============================================================================

/**
 * @swagger
 * /api/analytics/alerts:
 *   get:
 *     summary: Get analytics alerts
 *     description: Retrieves system-generated alerts for performance, training, sentiment, or retention issues
 *     tags: [Analytics - Alerts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [performance, training, sentiment, retention]
 *         description: Filter by alert category
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [info, warning, critical]
 *         description: Filter by severity level
 *       - in: query
 *         name: resolved
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter by resolution status
 *     responses:
 *       200:
 *         description: List of alerts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alert'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/alerts', requireAuth, async (req, res) => {
  try {
    const { category, severity, resolved } = req.query;

    let query = `
      SELECT *
      FROM analytics_alerts
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category = $${paramIndex++}`;
      params.push(category);
    }

    if (severity) {
      query += ` AND severity = $${paramIndex++}`;
      params.push(severity);
    }

    if (resolved === 'true') {
      query += ` AND resolved_at IS NOT NULL`;
    } else if (resolved === 'false') {
      query += ` AND resolved_at IS NULL`;
    }

    query += ` ORDER BY created_at DESC LIMIT 50`;

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({
      message: 'Failed to fetch alerts',
      code: 'ANALYTICS_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/analytics/insights:
 *   get:
 *     summary: Get AI-generated insights
 *     description: Retrieves machine learning insights including patterns, anomalies, predictions, and recommendations
 *     tags: [Analytics - Alerts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by insight category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of insights to return
 *     responses:
 *       200:
 *         description: List of AI insights
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AIInsight'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/insights', requireAuth, async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;

    let query = `
      SELECT *
      FROM ai_insights
      WHERE 1=1
    `;

    const params: any[] = [];

    if (category) {
      query += ` AND category = $1`;
      params.push(category);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({
      message: 'Failed to fetch insights',
      code: 'ANALYTICS_ERROR'
    });
  }
});

// ============================================================================
// Interaction Tracking
// ============================================================================

/**
 * @swagger
 * /api/analytics/interactions:
 *   post:
 *     summary: Track user interaction
 *     description: Records user interactions for ML training and engagement analytics
 *     tags: [Analytics - Interactions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventType
 *               - entityType
 *             properties:
 *               eventType:
 *                 type: string
 *                 example: "course_complete"
 *                 description: "Event types: step_view, role_select, sentiment_select, course_start, course_complete, quiz_attempt, etc."
 *               entityType:
 *                 type: string
 *                 example: "course"
 *                 description: "Entity types: assessment, course, quiz, resource, etc."
 *               entityId:
 *                 type: string
 *                 example: "CULT-101"
 *                 description: Identifier of the entity being interacted with
 *               metadata:
 *                 type: object
 *                 description: Additional context data (scores, time, selections, etc.)
 *                 example: {"completionTime": 180, "score": 92}
 *     responses:
 *       201:
 *         description: Interaction tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 user_id:
 *                   type: string
 *                   format: uuid
 *                 event_type:
 *                   type: string
 *                 entity_type:
 *                   type: string
 *                 entity_id:
 *                   type: string
 *                 metadata:
 *                   type: object
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/interactions', requireAuth, async (req, res) => {
  try {
    const { eventType, entityType, entityId, metadata } = req.body;
    const userId = req.session.userId;

    const query = `
      INSERT INTO user_interactions (
        user_id, event_type, entity_type, entity_id, metadata
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await db.query(query, [
      userId,
      eventType,
      entityType,
      entityId || null,
      metadata || {}
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Track interaction error:', error);
    res.status(500).json({
      message: 'Failed to track interaction',
      code: 'ANALYTICS_ERROR'
    });
  }
});

// ============================================================================
// Helper Functions
// ============================================================================

function calculateDateRange(period: string): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date();
  let start = new Date();

  switch (period) {
    case 'current-week':
      start.setDate(now.getDate() - now.getDay());
      break;
    case 'current-month':
      start.setDate(1);
      break;
    case 'current-quarter':
      start.setMonth(Math.floor(now.getMonth() / 3) * 3, 1);
      break;
    case 'current-year':
      start.setMonth(0, 1);
      break;
    case 'last-30-days':
      start.setDate(now.getDate() - 30);
      break;
    case 'last-90-days':
      start.setDate(now.getDate() - 90);
      break;
    default:
      start.setDate(1); // Default to current month
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export default router;
