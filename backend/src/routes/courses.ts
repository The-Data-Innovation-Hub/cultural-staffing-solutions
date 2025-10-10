import express from 'express';
import { db } from '../server';

const router = express.Router();

// POST /api/courses/:id/enroll
router.post('/:id/enroll', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    const query = `
      UPDATE recommended_courses
      SET is_enrolled = true
      WHERE course_id = $1
      RETURNING *
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Course not found',
        code: 'NOT_FOUND'
      });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({
      message: 'Failed to enroll in course',
      code: 'INTERNAL_ERROR'
    });
  }
});

// PATCH /api/courses/:id/progress
router.patch('/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { progressPercentage } = req.body;

    if (progressPercentage < 0 || progressPercentage > 100) {
      return res.status(400).json({
        message: 'Progress percentage must be between 0 and 100',
        code: 'VALIDATION_ERROR'
      });
    }

    const query = `
      UPDATE recommended_courses
      SET progress_percentage = $1,
          is_completed = CASE WHEN $1 = 100 THEN true ELSE false END
      WHERE course_id = $2
      RETURNING *
    `;

    const result = await db.query(query, [progressPercentage, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Course not found',
        code: 'NOT_FOUND'
      });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating course progress:', error);
    res.status(500).json({
      message: 'Failed to update course progress',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
