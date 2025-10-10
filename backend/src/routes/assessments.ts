import express from 'express';
import { submitAssessment, getAssessmentHistory } from '../controllers/assessmentController';

const router = express.Router();

// POST /api/assessments - Submit assessment
router.post('/', submitAssessment);

// GET /api/assessments/history - Get assessment history
router.get('/history', getAssessmentHistory);

export default router;
