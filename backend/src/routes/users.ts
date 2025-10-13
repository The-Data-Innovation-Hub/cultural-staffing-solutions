import express from 'express';
import { db } from '../server';
import { requireAuth } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/profiles');

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.userId;
    const ext = path.extname(file.originalname);
    cb(null, `profile-${userId}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (ext && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
  }
});

// PATCH /api/users/profile - Update user profile
router.patch('/profile', requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, department, location } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'User ID not found in token',
        code: 'UNAUTHORIZED'
      });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (firstName !== undefined) {
      updates.push(`first_name = $${paramIndex++}`);
      values.push(firstName);
    }

    if (lastName !== undefined) {
      updates.push(`last_name = $${paramIndex++}`);
      values.push(lastName);
    }

    if (department !== undefined) {
      updates.push(`department = $${paramIndex++}`);
      values.push(department);
    }

    if (location !== undefined) {
      updates.push(`location = $${paramIndex++}`);
      values.push(location);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        message: 'No fields to update',
        code: 'VALIDATION_ERROR'
      });
    }

    updates.push(`updated_at = NOW()`);
    values.push(userId);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, first_name, last_name, role, profile_image, department, location, created_at
    `;

    const result = await db.query(query, values);

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
      profileImage: user.profile_image,
      department: user.department,
      location: user.location,
      createdAt: user.created_at
    });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      message: 'Failed to update profile',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/users/profile-image - Upload profile image
router.post('/profile-image', requireAuth, upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'User ID not found in token',
        code: 'UNAUTHORIZED'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'No image file provided',
        code: 'VALIDATION_ERROR'
      });
    }

    // Generate URL for the uploaded image
    const imageUrl = `/uploads/profiles/${req.file.filename}`;

    // Get old profile image to delete it
    const oldImageQuery = 'SELECT profile_image FROM users WHERE id = $1';
    const oldImageResult = await db.query(oldImageQuery, [userId]);

    if (oldImageResult.rows.length > 0 && oldImageResult.rows[0].profile_image) {
      const oldImagePath = path.join(__dirname, '../..', oldImageResult.rows[0].profile_image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user's profile image in database
    const query = `
      UPDATE users
      SET profile_image = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, first_name, last_name, role, profile_image, department, location, created_at
    `;

    const result = await db.query(query, [imageUrl, userId]);

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
      profileImage: user.profile_image,
      department: user.department,
      location: user.location,
      createdAt: user.created_at
    });

  } catch (error: any) {
    console.error('Error uploading profile image:', error);

    // Clean up uploaded file on error
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      message: error.message || 'Failed to upload profile image',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
