import { Request, Response } from 'express';
import { db } from '../server';
import { v4 as uuidv4 } from 'uuid';
import { generateLearningPath } from '../services/learningPathService';

/**
 * Submit Assessment
 * POST /api/assessments
 */
export const submitAssessment = async (req: Request, res: Response) => {
  try {
    const {
      role,
      culturalBackground,
      skillRatings,
      learningPreferences,
      assessmentState
    } = req.body;

    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }

    // Validate required fields
    if (!role || !culturalBackground || !skillRatings || !learningPreferences) {
      return res.status(400).json({
        message: 'Missing required fields',
        code: 'VALIDATION_ERROR',
        details: {
          required: ['role', 'culturalBackground', 'skillRatings', 'learningPreferences']
        }
      });
    }

    // Start transaction
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // Insert assessment
      const assessmentId = uuidv4();
      const insertAssessmentQuery = `
        INSERT INTO user_assessments (
          id, user_id, current_step, completed_steps,
          percent_complete, started_at, completed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const assessmentResult = await client.query(insertAssessmentQuery, [
        assessmentId,
        userId,
        'results',
        assessmentState.progress?.completedSteps || [],
        100,
        assessmentState.progress?.startedAt || new Date().toISOString(),
        new Date().toISOString()
      ]);

      // Store cultural background
      const insertCulturalQuery = `
        INSERT INTO cultural_backgrounds (
          id, assessment_id, country_of_origin, primary_language,
          english_proficiency, years_in_target_country,
          previous_international_experience, cultural_adaptation_concerns
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;

      await client.query(insertCulturalQuery, [
        uuidv4(),
        assessmentId,
        culturalBackground.countryOfOrigin,
        culturalBackground.primaryLanguage,
        culturalBackground.englishProficiency,
        culturalBackground.yearsInTargetCountry || 0,
        culturalBackground.previousInternationalExperience || false,
        culturalBackground.culturalAdaptationConcerns || []
      ]);

      // Store skill ratings
      for (const [skill, rating] of Object.entries(skillRatings)) {
        const insertSkillQuery = `
          INSERT INTO skill_ratings (
            id, assessment_id, skill_name, rating_value
          ) VALUES ($1, $2, $3, $4)
        `;

        await client.query(insertSkillQuery, [
          uuidv4(),
          assessmentId,
          skill,
          rating
        ]);
      }

      // Store learning preferences
      const insertPreferencesQuery = `
        INSERT INTO learning_preferences (
          id, assessment_id, primary_style, secondary_style,
          preferred_content_types, time_commitment, notification_frequency
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      await client.query(insertPreferencesQuery, [
        uuidv4(),
        assessmentId,
        learningPreferences.primaryStyle,
        learningPreferences.secondaryStyle,
        learningPreferences.preferredContentTypes || [],
        learningPreferences.timeCommitment,
        learningPreferences.notificationFrequency
      ]);

      // Generate learning path
      const learningPath = await generateLearningPath(
        client,
        userId,
        assessmentId,
        role,
        culturalBackground,
        skillRatings as Record<string, number>,
        learningPreferences
      );

      await client.query('COMMIT');

      res.status(201).json({
        assessmentId,
        learningPathId: learningPath.id,
        message: 'Assessment submitted successfully. Your personalized learning path has been created!'
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({
      message: 'Failed to submit assessment',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
};

/**
 * Get Assessment History
 * GET /api/assessments/history
 */
export const getAssessmentHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }

    const query = `
      SELECT * FROM user_assessments
      WHERE user_id = $1
      ORDER BY completed_at DESC
    `;

    const result = await db.query(query, [userId]);

    res.json(result.rows);

  } catch (error: any) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({
      message: 'Failed to fetch assessment history',
      code: 'INTERNAL_ERROR'
    });
  }
};
