import express from 'express';
import { db } from '../server';

const router = express.Router();

// GET /api/learning-paths/me - Get current user's learning path
router.get('/me', async (req, res) => {
  try {
    const userId = req.user?.userId;

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
router.get('/:id/priority-areas', async (req, res) => {
  try {
    const { id } = req.params;

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
router.get('/:id/courses', async (req, res) => {
  try {
    const { id } = req.params;

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
router.get('/:id/milestones', async (req, res) => {
  try {
    const { id } = req.params;

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
