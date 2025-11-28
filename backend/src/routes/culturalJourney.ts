import { Router, Request, Response } from 'express';
import { db } from '../server';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// =====================================================
// GET /api/cultural-journey/progress
// Get user's complete journey progress (GM-017)
// =====================================================
router.get('/progress', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get all module progress
    const progressResult = await db.query(
      `SELECT milestone_id, module_id, completed, completed_at, stamp_earned
       FROM cultural_journey_progress
       WHERE user_id = $1`,
      [userId]
    );

    // Get milestone badges
    const milestonesResult = await db.query(
      `SELECT milestone_id, badge_earned, badge_earned_at, track_reflection
       FROM cultural_journey_milestones
       WHERE user_id = $1`,
      [userId]
    );

    // Get certificate if earned
    const certificateResult = await db.query(
      `SELECT certificate_number, total_stamps, total_milestones, issued_at, cpd_points, pdf_url
       FROM cultural_journey_certificates
       WHERE user_id = $1`,
      [userId]
    );

    // Get journey summary
    const summaryResult = await db.query(
      `SELECT stamps_collected, badges_earned, reflections_written, certificate_earned
       FROM user_journey_summary
       WHERE user_id = $1`,
      [userId]
    );

    res.json({
      progress: progressResult.rows,
      milestones: milestonesResult.rows,
      certificate: certificateResult.rows[0] || null,
      summary: summaryResult.rows[0] || {
        stamps_collected: 0,
        badges_earned: 0,
        reflections_written: 0,
        certificate_earned: false
      }
    });
  } catch (error) {
    console.error('Error fetching journey progress:', error);
    res.status(500).json({ error: 'Failed to fetch journey progress' });
  }
});

// =====================================================
// POST /api/cultural-journey/complete-module
// Mark a module as complete and earn a stamp (GM-015)
// =====================================================
router.post('/complete-module', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { milestoneId, moduleId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!milestoneId || !moduleId) {
      return res.status(400).json({ error: 'milestoneId and moduleId are required' });
    }

    // Upsert module completion
    const result = await db.query(
      `INSERT INTO cultural_journey_progress (user_id, milestone_id, module_id, completed, completed_at, stamp_earned)
       VALUES ($1, $2, $3, TRUE, NOW(), TRUE)
       ON CONFLICT (user_id, milestone_id, module_id)
       DO UPDATE SET completed = TRUE, completed_at = NOW(), stamp_earned = TRUE, updated_at = NOW()
       RETURNING *`,
      [userId, milestoneId, moduleId]
    );

    // Check if milestone is now complete (all modules done)
    const milestoneCheck = await db.query(
      `SELECT COUNT(*) as completed_count
       FROM cultural_journey_progress
       WHERE user_id = $1 AND milestone_id = $2 AND completed = TRUE`,
      [userId, milestoneId]
    );

    res.json({
      success: true,
      progress: result.rows[0],
      milestoneModulesCompleted: parseInt(milestoneCheck.rows[0].completed_count)
    });
  } catch (error) {
    console.error('Error completing module:', error);
    res.status(500).json({ error: 'Failed to complete module' });
  }
});

// =====================================================
// POST /api/cultural-journey/save-reflection (GM-019)
// Save micro-journaling reflection
// =====================================================
router.post('/save-reflection', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { milestoneId, moduleId, reflectionPrompt, reflectionResponse } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!milestoneId || !moduleId || !reflectionPrompt) {
      return res.status(400).json({ error: 'milestoneId, moduleId, and reflectionPrompt are required' });
    }

    // Upsert reflection
    const result = await db.query(
      `INSERT INTO cultural_journey_reflections (user_id, milestone_id, module_id, reflection_prompt, reflection_response)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, milestone_id, module_id)
       DO UPDATE SET reflection_response = $5, updated_at = NOW()
       RETURNING *`,
      [userId, milestoneId, moduleId, reflectionPrompt, reflectionResponse || null]
    );

    res.json({
      success: true,
      reflection: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving reflection:', error);
    res.status(500).json({ error: 'Failed to save reflection' });
  }
});

// =====================================================
// GET /api/cultural-journey/reflections
// Get all user's micro-journaling reflections (GM-019)
// =====================================================
router.get('/reflections', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await db.query(
      `SELECT milestone_id, module_id, reflection_prompt, reflection_response, created_at, updated_at
       FROM cultural_journey_reflections
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [userId]
    );

    res.json({
      reflections: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching reflections:', error);
    res.status(500).json({ error: 'Failed to fetch reflections' });
  }
});

// =====================================================
// POST /api/cultural-journey/complete-milestone
// Mark a milestone as complete and earn badge
// =====================================================
router.post('/complete-milestone', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { milestoneId, trackReflection } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!milestoneId) {
      return res.status(400).json({ error: 'milestoneId is required' });
    }

    // Upsert milestone completion
    const result = await db.query(
      `INSERT INTO cultural_journey_milestones (user_id, milestone_id, badge_earned, badge_earned_at, track_reflection)
       VALUES ($1, $2, TRUE, NOW(), $3)
       ON CONFLICT (user_id, milestone_id)
       DO UPDATE SET badge_earned = TRUE, badge_earned_at = NOW(), track_reflection = $3, updated_at = NOW()
       RETURNING *`,
      [userId, milestoneId, trackReflection || null]
    );

    // Check if all milestones are complete (certificate eligibility)
    const allMilestonesCheck = await db.query(
      `SELECT COUNT(*) as badge_count
       FROM cultural_journey_milestones
       WHERE user_id = $1 AND badge_earned = TRUE`,
      [userId]
    );

    res.json({
      success: true,
      milestone: result.rows[0],
      totalBadgesEarned: parseInt(allMilestonesCheck.rows[0].badge_count)
    });
  } catch (error) {
    console.error('Error completing milestone:', error);
    res.status(500).json({ error: 'Failed to complete milestone' });
  }
});

// =====================================================
// POST /api/cultural-journey/generate-certificate (GM-018)
// Generate certificate when full journey is complete
// =====================================================
router.post('/generate-certificate', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify all milestones are complete
    const milestonesCheck = await db.query(
      `SELECT COUNT(*) as badge_count
       FROM cultural_journey_milestones
       WHERE user_id = $1 AND badge_earned = TRUE`,
      [userId]
    );

    const totalMilestones = 5; // Communication, Respect, Cultural Humility, Dual-Culture, Patient-Centred
    const badgesEarned = parseInt(milestonesCheck.rows[0].badge_count);

    if (badgesEarned < totalMilestones) {
      return res.status(400).json({
        error: 'Journey not complete',
        badgesEarned,
        totalMilestones,
        remaining: totalMilestones - badgesEarned
      });
    }

    // Count total stamps
    const stampsResult = await db.query(
      `SELECT COUNT(*) as stamp_count
       FROM cultural_journey_progress
       WHERE user_id = $1 AND stamp_earned = TRUE`,
      [userId]
    );

    // Count reflections
    const reflectionsResult = await db.query(
      `SELECT COUNT(*) as reflection_count
       FROM cultural_journey_reflections
       WHERE user_id = $1 AND reflection_response IS NOT NULL`,
      [userId]
    );

    // Generate unique certificate number
    const certificateNumber = `CIC-${Date.now().toString(36).toUpperCase()}-${userId.slice(0, 4).toUpperCase()}`;

    // Create or update certificate
    const result = await db.query(
      `INSERT INTO cultural_journey_certificates (user_id, certificate_number, total_stamps, total_milestones, total_reflections)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id)
       DO UPDATE SET total_stamps = $3, total_milestones = $4, total_reflections = $5, issued_at = NOW()
       RETURNING *`,
      [
        userId,
        certificateNumber,
        parseInt(stampsResult.rows[0].stamp_count),
        totalMilestones,
        parseInt(reflectionsResult.rows[0].reflection_count)
      ]
    );

    res.json({
      success: true,
      certificate: result.rows[0],
      message: 'Cultural Intelligence Certificate generated successfully!'
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

// =====================================================
// GET /api/cultural-journey/certificate
// Get user's certificate if earned
// =====================================================
router.get('/certificate', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await db.query(
      `SELECT c.*, u.email, up.role
       FROM cultural_journey_certificates c
       JOIN user_profiles up ON c.user_id = up.id
       LEFT JOIN neon_auth.users_sync u ON up.id = u.id
       WHERE c.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not yet earned' });
    }

    res.json({
      certificate: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

export default router;

