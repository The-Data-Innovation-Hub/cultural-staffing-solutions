import express from 'express';
import { db } from '../server';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { requireAuth } from '../middleware/auth';

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

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    console.log(`✅ JWT tokens generated for user ${user.id}`);

    // Set tokens in httpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Also return tokens in response body for flexibility
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      profileImage: user.profile_image,
      accessToken,
      refreshToken
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
  // Clear JWT cookies
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.accessToken || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'Not authenticated',
        code: 'UNAUTHORIZED'
      });
    }

    // Verify and decode token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        message: 'Invalid or expired token',
        code: 'UNAUTHORIZED'
      });
    }

    const query = `
      SELECT id, email, first_name, last_name, role, profile_image
      FROM users
      WHERE id = $1
    `;

    const result = await db.query(query, [decoded.userId]);

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

// PATCH /api/auth/change-password
router.patch('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'User ID not found in token',
        code: 'UNAUTHORIZED'
      });
    }

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required',
        code: 'VALIDATION_ERROR'
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long',
        code: 'VALIDATION_ERROR'
      });
    }

    // Get user's current password hash
    const userQuery = `
      SELECT password FROM users WHERE id = $1
    `;
    const userResult = await db.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found',
        code: 'NOT_FOUND'
      });
    }

    const user = userResult.rows[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Current password is incorrect',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const updateQuery = `
      UPDATE users
      SET password = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email
    `;

    const updateResult = await db.query(updateQuery, [hashedPassword, userId]);

    console.log(`✅ Password changed for user ${userId}`);

    res.json({
      message: 'Password changed successfully',
      user: {
        id: updateResult.rows[0].id,
        email: updateResult.rows[0].email
      }
    });

  } catch (error: any) {
    console.error('Error changing password:', error);
    res.status(500).json({
      message: 'Failed to change password',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
