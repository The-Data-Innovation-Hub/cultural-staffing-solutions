import express from 'express';
import { db } from '../server';

const router = express.Router();

// POST /api/milestones/:id/complete
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE milestones
      SET is_completed = true,
          completed_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Milestone not found',
        code: 'NOT_FOUND'
      });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error completing milestone:', error);
    res.status(500).json({
      message: 'Failed to complete milestone',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
