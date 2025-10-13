import express from 'express';
import { db } from '../server';
import bcrypt from 'bcrypt';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        code: 'VALIDATION_ERROR'
      });
    }

    // Query user by email
    const query = `
      SELECT id, email, password, first_name, last_name, role, profile_image
      FROM users
      WHERE email = $1
    `;

    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Set session
    req.session.userId = user.id;

    console.log(`🔐 Login attempt for user ${user.id}, session ID: ${req.sessionID}`);

    // Explicitly save session to ensure cookie is set
    req.session.save((err) => {
      if (err) {
        console.error('❌ Error saving session:', err);
        return res.status(500).json({
          message: 'Failed to create session',
          code: 'SESSION_ERROR'
        });
      }

      console.log(`✅ Session saved successfully for user ${user.id}`);

      // Return user data (excluding password)
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        profileImage: user.profile_image
      });
    });

  } catch (error: any) {
    console.error('Error during login:', error);
    res.status(500).json({
      message: 'Login failed',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: 'Logout failed',
        code: 'INTERNAL_ERROR'
      });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'Not authenticated',
        code: 'UNAUTHORIZED'
      });
    }

    const query = `
      SELECT id, email, first_name, last_name, role, profile_image
      FROM users
      WHERE id = $1
    `;

    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found',
        code: 'NOT_FOUND'
      });
    }

    const user = result.rows[0];

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      profileImage: user.profile_image
    });

  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      message: 'Failed to fetch user',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
