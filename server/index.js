import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

// Initialize database
const DATABASE_URL = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
const sql = neon(DATABASE_URL);
const db = drizzle(sql);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Resend
const resendApiKey = process.env.VITE_RESEND_API_KEY;
let resend = null;

if (resendApiKey && resendApiKey !== 'your-resend-api-key-here') {
  resend = new Resend(resendApiKey);
}

// Middleware - Allow multiple origins for development
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  process.env.VITE_APP_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(null, true); // Allow in development, restrict in production
    }
  },
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', emailConfigured: resend !== null });
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Query user from database
    const result = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const user = result[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Return user without password, mapping snake_case to camelCase
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        profileImage: user.profile_image,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during login'
    });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'employee' } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, first name, and last name are required'
      });
    }

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await sql`
      INSERT INTO users (email, password, first_name, last_name, role)
      VALUES (${email}, ${hashedPassword}, ${firstName}, ${lastName}, ${role})
      RETURNING id, email, first_name, last_name, role, profile_image, created_at, updated_at
    `;

    res.json({
      success: true,
      user: {
        id: result[0].id,
        email: result[0].email,
        firstName: result[0].first_name,
        lastName: result[0].last_name,
        role: result[0].role,
        profileImage: result[0].profile_image,
        createdAt: result[0].created_at,
        updatedAt: result[0].updated_at
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during signup'
    });
  }
});

// Send simple waitlist welcome email (no verification needed)
app.post('/api/emails/waitlist-welcome', async (req, res) => {
  if (!resend) {
    return res.status(503).json({
      success: false,
      error: 'Email service not configured'
    });
  }

  const { to, name } = req.body;

  if (!to) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: to'
    });
  }

  const FROM_EMAIL = process.env.VITE_FROM_EMAIL || 'onboarding@resend.dev';
  const APP_URL = process.env.VITE_APP_URL || 'http://localhost:8080';
  const greeting = name ? `Hi ${name}` : 'Hello';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Cultural Staffing Solutions</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #D4A574 0%, #C4963B 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #1A1A1A; margin: 0; font-size: 28px;">Welcome! 🎉</h1>
        </div>

        <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1A1A1A; margin-top: 0;">You're on the List!</h2>

          <p style="font-size: 16px; color: #555;">${greeting},</p>

          <p style="font-size: 16px; color: #555;">
            Thank you for joining the Cultural Staffing Solutions waitlist! We're thrilled to have you and excited to help you advance your healthcare career in Northern Ireland.
          </p>

          <div style="background: #f0f7ff; padding: 20px; border-left: 4px solid #C4963B; margin: 25px 0;">
            <h3 style="color: #1A1A1A; margin-top: 0; font-size: 18px;">What Happens Next?</h3>
            <ol style="color: #555; font-size: 14px; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Our team will review your information</li>
              <li style="margin-bottom: 10px;">You'll receive regular updates about our programs</li>
              <li style="margin-bottom: 10px;">We'll contact you when new opportunities arise</li>
              <li>Get ready to transform your healthcare career!</li>
            </ol>
          </div>

          <h3 style="color: #1A1A1A; font-size: 18px;">About Our Programs</h3>
          <p style="font-size: 14px; color: #555;">
            We offer comprehensive training and support in:
          </p>
          <ul style="color: #555; font-size: 14px;">
            <li>Healthcare Professional Training</li>
            <li>Cultural Orientation for Northern Ireland</li>
            <li>HSC-Approved Certifications</li>
            <li>Recruitment & Placement Services</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}"
               style="background: linear-gradient(135deg, #D4A574 0%, #C4963B 100%);
                      color: #1A1A1A;
                      padding: 14px 32px;
                      text-decoration: none;
                      border-radius: 6px;
                      font-weight: bold;
                      display: inline-block;
                      font-size: 16px;">
              Visit Our Website
            </a>
          </div>

          <p style="font-size: 14px; color: #777; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            Have questions? Simply reply to this email - we'd love to hear from you!
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>Cultural Staffing Solutions<br>
          UK's Premier Cultural Healthcare Solutions</p>
          <p>&copy; ${new Date().getFullYear()} Cultural Staffing Solutions. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Welcome to Cultural Staffing Solutions Waitlist!',
      html: html,
    });

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
});

// Send welcome email
app.post('/api/emails/welcome', async (req, res) => {
  if (!resend) {
    return res.status(503).json({
      success: false,
      error: 'Email service not configured'
    });
  }

  const { to, name } = req.body;

  if (!to) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: to'
    });
  }

  const FROM_EMAIL = process.env.VITE_FROM_EMAIL || 'onboarding@resend.dev';
  const APP_URL = process.env.VITE_APP_URL || 'http://localhost:8080';
  const greeting = name ? `Hi ${name}` : 'Hello';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Cultural Staffing Solutions</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #D4A574 0%, #C4963B 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #1A1A1A; margin: 0; font-size: 28px;">Welcome! 🎉</h1>
        </div>

        <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1A1A1A; margin-top: 0;">You're on the List!</h2>

          <p style="font-size: 16px; color: #555;">${greeting},</p>

          <p style="font-size: 16px; color: #555;">
            Your email has been confirmed and you're officially on our waitlist! We're thrilled to have you join the Cultural Staffing Solutions community.
          </p>

          <div style="background: #f0f7ff; padding: 20px; border-left: 4px solid #C4963B; margin: 25px 0;">
            <h3 style="color: #1A1A1A; margin-top: 0; font-size: 18px;">What Happens Now?</h3>
            <ol style="color: #555; font-size: 14px; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Our team will review your application</li>
              <li style="margin-bottom: 10px;">You'll receive regular updates about our programs</li>
              <li style="margin-bottom: 10px;">We'll contact you with next steps and opportunities</li>
              <li>Get ready to transform your healthcare career!</li>
            </ol>
          </div>

          <h3 style="color: #1A1A1A; font-size: 18px;">About Our Programs</h3>
          <p style="font-size: 14px; color: #555;">
            We offer comprehensive training in:
          </p>
          <ul style="color: #555; font-size: 14px;">
            <li>Healthcare Professional Training</li>
            <li>Cultural Orientation for Northern Ireland</li>
            <li>HSC-Approved Certifications</li>
            <li>Recruitment & Placement Services</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}"
               style="background: linear-gradient(135deg, #D4A574 0%, #C4963B 100%);
                      color: #1A1A1A;
                      padding: 14px 32px;
                      text-decoration: none;
                      border-radius: 6px;
                      font-weight: bold;
                      display: inline-block;
                      font-size: 16px;">
              Visit Our Website
            </a>
          </div>

          <p style="font-size: 14px; color: #777; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            Have questions? Reply to this email or visit our website for more information.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>Cultural Staffing Solutions<br>
          UK's Premier Cultural Healthcare Solutions</p>
          <p>&copy; ${new Date().getFullYear()} Cultural Staffing Solutions. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Welcome to Cultural Staffing Solutions!',
      html: html,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
});

// Send admin notification
app.post('/api/emails/admin-notification', async (req, res) => {
  if (!resend) {
    return res.status(503).json({
      success: false,
      error: 'Email service not configured'
    });
  }

  const { email, firstName, lastName, profession, interestedServices } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: email'
    });
  }

  const adminEmail = process.env.VITE_ADMIN_EMAIL;
  if (!adminEmail) {
    return res.status(503).json({
      success: false,
      error: 'Admin email not configured'
    });
  }

  const FROM_EMAIL = process.env.VITE_FROM_EMAIL || 'onboarding@resend.dev';
  const APP_URL = process.env.VITE_APP_URL || 'http://localhost:8080';
  const name = firstName && lastName ? `${firstName} ${lastName}` : 'Name not provided';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Waitlist Signup</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1A1A1A; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #D4A574; margin: 0; font-size: 24px;">New Waitlist Signup</h1>
        </div>

        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #555; margin-top: 0;">
            A new candidate has joined the waitlist:
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1A1A1A;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; color: #555;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1A1A1A;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; color: #555;">${email}</td>
            </tr>
            ${profession ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1A1A1A;">Profession:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; color: #555;">${profession.replace('_', ' ')}</td>
            </tr>
            ` : ''}
            ${interestedServices && interestedServices.length > 0 ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1A1A1A;">Interested In:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; color: #555;">${interestedServices.join(', ')}</td>
            </tr>
            ` : ''}
          </table>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/admin/waitlist"
               style="background: linear-gradient(135deg, #D4A574 0%, #C4963B 100%);
                      color: #1A1A1A;
                      padding: 12px 28px;
                      text-decoration: none;
                      border-radius: 6px;
                      font-weight: bold;
                      display: inline-block;
                      font-size: 14px;">
              View in Admin Dashboard
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [adminEmail],
      subject: 'New Waitlist Signup - Cultural Staffing Solutions',
      html: html,
    });

    if (error) {
      console.error('Error sending admin notification:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error sending admin notification:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Email API server running on http://localhost:${PORT}`);
  console.log(`📧 Email configured: ${resend !== null ? 'Yes' : 'No'}`);
  console.log(`🌐 CORS origin: ${process.env.VITE_APP_URL || 'http://localhost:8080'}`);
});
