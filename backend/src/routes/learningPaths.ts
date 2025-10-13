import express from 'express';
import { db } from '../server';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

/**
 * Helper function to check if user can access a learning path
 * - Users can access their own learning paths
 * - Admins can access all learning paths
 * - Managers can access learning paths (simplified for demo)
 */
async function canAccessLearningPath(req: express.Request, learningPathId: string): Promise<boolean> {
  const currentUser = req.user;

  if (!currentUser) {
    return false;
  }

  // Admin can access all data
  if (currentUser.role === 'admin') {
    return true;
  }

  // Check if learning path belongs to the user
  const result = await db.query(
    'SELECT user_id FROM learning_paths WHERE id = $1',
    [learningPathId]
  );

  if (result.rows.length === 0) {
    return false;
  }

  const learningPathUserId = result.rows[0].user_id;

  // User accessing their own learning path
  if (currentUser.userId === learningPathUserId) {
    return true;
  }

  // Manager can access (simplified - in production, check org membership)
  if (currentUser.role === 'manager') {
    return true;
  }

  return false;
}

// GET /api/learning-paths/me - Get current user's learning path
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'User ID not found in token',
        code: 'UNAUTHORIZED'
      });
    }

    const query = `
      SELECT * FROM learning_paths
      WHERE user_id = $1 AND is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'No learning path found',
        code: 'NOT_FOUND'
      });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({
      message: 'Failed to fetch learning path',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/learning-paths/:id/priority-areas
router.get('/:id/priority-areas', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Authorization check: ensure user can access this learning path
    if (!(await canAccessLearningPath(req, id))) {
      return res.status(403).json({
        message: 'You do not have permission to access this learning path',
        code: 'FORBIDDEN'
      });
    }

    const query = `
      SELECT * FROM priority_areas
      WHERE learning_path_id = $1
      ORDER BY priority_order ASC
    `;

    const result = await db.query(query, [id]);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching priority areas:', error);
    res.status(500).json({
      message: 'Failed to fetch priority areas',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/learning-paths/:id/courses
router.get('/:id/courses', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Authorization check: ensure user can access this learning path
    if (!(await canAccessLearningPath(req, id))) {
      return res.status(403).json({
        message: 'You do not have permission to access this learning path',
        code: 'FORBIDDEN'
      });
    }

    const query = `
      SELECT * FROM recommended_courses
      WHERE learning_path_id = $1
      ORDER BY priority_order ASC
    `;

    const result = await db.query(query, [id]);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      message: 'Failed to fetch courses',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/learning-paths/:id/milestones
router.get('/:id/milestones', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Authorization check: ensure user can access this learning path
    if (!(await canAccessLearningPath(req, id))) {
      return res.status(403).json({
        message: 'You do not have permission to access this learning path',
        code: 'FORBIDDEN'
      });
    }

    const query = `
      SELECT * FROM milestones
      WHERE learning_path_id = $1
      ORDER BY milestone_order ASC
    `;

    const result = await db.query(query, [id]);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({
      message: 'Failed to fetch milestones',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
