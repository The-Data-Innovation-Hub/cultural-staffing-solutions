import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cultural Staffing Solutions - Analytics API',
      version: '1.0.0',
      description: `
# Healthcare Workforce Analytics API

Comprehensive analytics system for monitoring staff performance, training effectiveness,
sentiment analysis, and retention predictions.

## Features

- **Performance Metrics**: Track employee goal achievement, work quality, and productivity
- **Skill Gap Analysis**: Identify training needs and prioritize learning paths
- **Training Effectiveness**: Measure course completion, engagement, and knowledge improvement
- **Sentiment Analysis**: Monitor employee satisfaction and burnout risk
- **Retention Predictions**: ML-powered attrition risk assessment
- **Alerts & Insights**: AI-generated recommendations and early warnings
- **Interaction Tracking**: Detailed user engagement analytics

## Authentication

All endpoints require session-based authentication. Users must login via \`/api/auth/login\`
before accessing analytics endpoints.

## Data Privacy

All analytics data is confidential and used solely for employee development and organizational
improvement. GDPR and HIPAA compliant.
      `,
      contact: {
        name: 'API Support',
        email: 'support@culturalstaffing.com'
      },
      license: {
        name: 'Proprietary',
        url: 'https://culturalstaffing.com/license'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.culturalstaffing.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Analytics - Dashboard',
        description: 'Organization-wide analytics overview'
      },
      {
        name: 'Analytics - Performance',
        description: 'Employee performance metrics and goal tracking'
      },
      {
        name: 'Analytics - Skills',
        description: 'Skill gap analysis and training recommendations'
      },
      {
        name: 'Analytics - Training',
        description: 'Training effectiveness and learner engagement'
      },
      {
        name: 'Analytics - Sentiment',
        description: 'Employee sentiment analysis and feedback'
      },
      {
        name: 'Analytics - Retention',
        description: 'Attrition risk prediction and intervention'
      },
      {
        name: 'Analytics - Alerts',
        description: 'System alerts and AI-generated insights'
      },
      {
        name: 'Analytics - Interactions',
        description: 'User interaction tracking for ML training'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
          description: 'Session cookie obtained from /api/auth/login'
        }
      },
      schemas: {
        PerformanceMetrics: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            period: { type: 'string', example: '2025-10' },
            goal_achievement_rate: { type: 'integer', minimum: 0, maximum: 100 },
            work_quality_score: { type: 'integer', minimum: 0, maximum: 100 },
            productivity_efficiency: { type: 'integer', minimum: 0, maximum: 100 },
            engagement_score: { type: 'integer', minimum: 0, maximum: 100 },
            overall_performance: { type: 'integer', minimum: 0, maximum: 100 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        PerformanceGoal: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            goal_type: { type: 'string', enum: ['clinical', 'cultural', 'technical', 'compliance'] },
            title: { type: 'string' },
            description: { type: 'string' },
            target_value: { type: 'number' },
            current_value: { type: 'number' },
            deadline: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['on_track', 'at_risk', 'behind', 'completed'] },
            completion_rate: { type: 'integer', minimum: 0, maximum: 100 }
          }
        },
        SkillAssessment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            assessment_date: { type: 'string', format: 'date-time' },
            overall_gap_score: { type: 'integer', minimum: 0, maximum: 100 },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        SkillArea: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            assessment_id: { type: 'string', format: 'uuid' },
            category: { type: 'string', example: 'Clinical Skills' },
            skill_name: { type: 'string', example: 'Patient Assessment' },
            current_level: { type: 'integer', minimum: 0, maximum: 100 },
            required_level: { type: 'integer', minimum: 0, maximum: 100 },
            gap: { type: 'integer' },
            priority: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
            training_recommendations: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        SentimentAnalysis: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            analysis_date: { type: 'string', format: 'date-time' },
            overall_sentiment: {
              type: 'string',
              enum: ['very_positive', 'positive', 'neutral', 'negative', 'very_negative']
            },
            sentiment_score: { type: 'number', minimum: -100, maximum: 100 },
            job_satisfaction: { type: 'integer', minimum: 0, maximum: 100 },
            work_life_balance: { type: 'integer', minimum: 0, maximum: 100 },
            team_dynamics: { type: 'integer', minimum: 0, maximum: 100 },
            management_support: { type: 'integer', minimum: 0, maximum: 100 },
            career_growth: { type: 'integer', minimum: 0, maximum: 100 },
            workload: { type: 'integer', minimum: 0, maximum: 100 },
            burnout_risk: { type: 'string', enum: ['low', 'moderate', 'high', 'critical'] },
            attrition_risk: { type: 'string', enum: ['low', 'moderate', 'high', 'critical'] },
            key_themes: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        RetentionPrediction: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            prediction_date: { type: 'string', format: 'date-time' },
            attrition_risk: { type: 'number', minimum: 0, maximum: 100 },
            risk_level: { type: 'string', enum: ['low', 'moderate', 'high', 'critical'] },
            confidence: { type: 'number', minimum: 0, maximum: 100 },
            trend_direction: { type: 'string', enum: ['improving', 'stable', 'declining'] },
            model_version: { type: 'string' },
            feature_importance: { type: 'object' }
          }
        },
        Alert: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            severity: { type: 'string', enum: ['info', 'warning', 'critical'] },
            category: {
              type: 'string',
              enum: ['performance', 'training', 'sentiment', 'retention']
            },
            title: { type: 'string' },
            description: { type: 'string' },
            affected_users: {
              type: 'array',
              items: { type: 'string', format: 'uuid' }
            },
            action_required: { type: 'boolean' },
            recommendations: {
              type: 'array',
              items: { type: 'string' }
            },
            resolved_at: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        AIInsight: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            insight_type: {
              type: 'string',
              enum: ['pattern', 'anomaly', 'prediction', 'recommendation']
            },
            category: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            confidence: { type: 'number', minimum: 0, maximum: 100 },
            impact: { type: 'string', enum: ['low', 'medium', 'high'] },
            suggested_actions: {
              type: 'array',
              items: { type: 'string' }
            },
            data_points: { type: 'object' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        cookieAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
