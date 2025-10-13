import express from 'express';
import crypto from 'crypto';
import { db } from '../server';
import { requireAuth } from '../middleware/auth';
import { convertKeysToCamelCase } from '../utils/caseConverter';

const router = express.Router();

/**
 * @openapi
 * /api/waitlist:
 *   post:
 *     tags:
 *       - Waitlist
 *     summary: Add entry to waitlist
 *     description: Allows anyone to join the waitlist (public endpoint)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               profession:
 *                 type: string
 *               yearsOfExperience:
 *                 type: integer
 *               interestedServices:
 *                 type: array
 *                 items:
 *                   type: string
 *               message:
 *                 type: string
 *               referralSource:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added to waitlist
 *       400:
 *         description: Email already exists on waitlist
 */
router.post('/', async (req, res) => {
  try {
    const { email, firstName, lastName, phone, profession, yearsOfExperience, interestedServices, message, referralSource } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    const ipAddress = req.ip || req.socket.remoteAddress;

    const query = `
      INSERT INTO waitlist (
        email, first_name, last_name, phone, profession, years_of_experience,
        interested_services, message, referral_source, confirmation_token,
        status, confirmed_email, ip_address
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const result = await db.query(query, [
      email,
      firstName || null,
      lastName || null,
      phone || null,
      profession || null,
      yearsOfExperience || null,
      interestedServices ? JSON.stringify(interestedServices) : null,
      message || null,
      referralSource || null,
      confirmationToken,
      'waitlisted',
      false,
      ipAddress
    ]);

    res.status(201).json({ success: true, data: convertKeysToCamelCase(result.rows[0]) });
  } catch (error: any) {
    // Check for duplicate email
    if (error.code === '23505') {
      return res.status(400).json({ success: false, error: 'Email already exists on waitlist' });
    }
    console.error('Error adding to waitlist:', error);
    res.status(500).json({ success: false, error: 'Failed to add to waitlist' });
  }
});

/**
 * @openapi
 * /api/waitlist:
 *   get:
 *     tags:
 *       - Waitlist
 *     summary: Get waitlist entries (admin only)
 *     description: Retrieve all waitlist entries with optional filtering
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: confirmedEmail
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: searchTerm
 *         in: query
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of waitlist entries
 *       401:
 *         description: Unauthorized
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { status, confirmedEmail, searchTerm, limit, offset } = req.query;

    let query = 'SELECT * FROM waitlist WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (confirmedEmail !== undefined) {
      query += ` AND confirmed_email = $${paramIndex}`;
      params.push(confirmedEmail === 'true');
      paramIndex++;
    }

    if (searchTerm) {
      query += ` AND (email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`;
      params.push(`%${searchTerm}%`);
      paramIndex++;
    }

    query += ' ORDER BY signup_date DESC';

    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit as string));
      paramIndex++;
    }

    if (offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(parseInt(offset as string));
      paramIndex++;
    }

    const result = await db.query(query, params);
    res.json({ success: true, data: convertKeysToCamelCase(result.rows) });
  } catch (error) {
    console.error('Error fetching waitlist entries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch waitlist entries' });
  }
});

/**
 * @openapi
 * /api/waitlist/{id}:
 *   get:
 *     tags:
 *       - Waitlist
 *     summary: Get single waitlist entry (admin only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Waitlist entry details
 *       404:
 *         description: Entry not found
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM waitlist WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Entry not found' });
    }

    res.json({ success: true, data: convertKeysToCamelCase(result.rows[0]) });
  } catch (error) {
    console.error('Error fetching waitlist entry:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch waitlist entry' });
  }
});

/**
 * @openapi
 * /api/waitlist/{id}/status:
 *   patch:
 *     tags:
 *       - Waitlist
 *     summary: Update waitlist entry status (admin only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminUserId = req.user?.userId;
    const ipAddress = req.ip || req.socket.remoteAddress;

    // Get current entry
    const current = await db.query('SELECT * FROM waitlist WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Entry not found' });
    }

    const previousStatus = current.rows[0].status;
    const contactedAt = status === 'contacted' ? new Date() : current.rows[0].contactedAt;

    // Update status
    const updateQuery = `
      UPDATE waitlist
      SET status = $1, contacted_at = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    const result = await db.query(updateQuery, [status, contactedAt, id]);

    // Log the change
    await db.query(
      `INSERT INTO waitlist_audit_log (waitlist_id, admin_user_id, action, previous_value, new_value, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, adminUserId, 'status_change', previousStatus, status, ipAddress]
    );

    res.json({ success: true, data: convertKeysToCamelCase(result.rows[0]) });
  } catch (error) {
    console.error('Error updating waitlist status:', error);
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
});

/**
 * @openapi
 * /api/waitlist/{id}/notes:
 *   patch:
 *     tags:
 *       - Waitlist
 *     summary: Update waitlist entry notes (admin only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notes
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notes updated successfully
 */
router.patch('/:id/notes', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminUserId = req.user?.userId;
    const ipAddress = req.ip || req.socket.remoteAddress;

    // Get current entry
    const current = await db.query('SELECT * FROM waitlist WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Entry not found' });
    }

    const previousNotes = current.rows[0].notes;

    // Update notes
    const updateQuery = `
      UPDATE waitlist
      SET notes = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(updateQuery, [notes, id]);

    // Log the change
    await db.query(
      `INSERT INTO waitlist_audit_log (waitlist_id, admin_user_id, action, previous_value, new_value, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, adminUserId, 'note_added', previousNotes || '', notes, ipAddress]
    );

    res.json({ success: true, data: convertKeysToCamelCase(result.rows[0]) });
  } catch (error) {
    console.error('Error updating waitlist notes:', error);
    res.status(500).json({ success: false, error: 'Failed to update notes' });
  }
});

/**
 * @openapi
 * /api/waitlist/confirm/{token}:
 *   post:
 *     tags:
 *       - Waitlist
 *     summary: Confirm email with token
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 *       404:
 *         description: Invalid token
 */
router.post('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const updateQuery = `
      UPDATE waitlist
      SET confirmed_email = true, updated_at = NOW()
      WHERE confirmation_token = $1
      RETURNING *
    `;
    const result = await db.query(updateQuery, [token]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Invalid confirmation token' });
    }

    res.json({ success: true, data: convertKeysToCamelCase(result.rows[0]) });
  } catch (error) {
    console.error('Error confirming email:', error);
    res.status(500).json({ success: false, error: 'Failed to confirm email' });
  }
});

/**
 * @openapi
 * /api/waitlist/stats:
 *   get:
 *     tags:
 *       - Waitlist
 *     summary: Get waitlist statistics (admin only)
 *     responses:
 *       200:
 *         description: Waitlist statistics
 */
router.get('/stats/summary', requireAuth, async (req, res) => {
  try {
    const statsQuery = `
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE confirmed_email = true) as confirmed,
        COUNT(*) FILTER (WHERE status = 'contacted') as contacted,
        COUNT(*) FILTER (WHERE status = 'registered') as registered
      FROM waitlist
    `;
    const result = await db.query(statsQuery);

    res.json({
      success: true,
      data: {
        total: parseInt(result.rows[0].total),
        confirmed: parseInt(result.rows[0].confirmed),
        contacted: parseInt(result.rows[0].contacted),
        registered: parseInt(result.rows[0].registered),
      },
    });
  } catch (error) {
    console.error('Error fetching waitlist stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

/**
 * @openapi
 * /api/waitlist/{id}/audit-log:
 *   get:
 *     tags:
 *       - Waitlist
 *     summary: Get audit log for waitlist entry (admin only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audit log entries
 */
router.get('/:id/audit-log', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM waitlist_audit_log WHERE waitlist_id = $1 ORDER BY timestamp DESC',
      [id]
    );

    res.json({ success: true, data: convertKeysToCamelCase(result.rows) });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch audit log' });
  }
});

export default router;
