import jwt from 'jsonwebtoken';

// Validate JWT_SECRET at module load time
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ CRITICAL SECURITY ERROR: JWT_SECRET environment variable is not set.');
  console.error('❌ The application cannot start without a secure JWT secret.');
  console.error('❌ Please set JWT_SECRET in your environment variables.');
  console.error('❌ Example: JWT_SECRET=your-secure-random-secret-at-least-32-characters-long');
  process.exit(1);
}

// Enforce minimum secret length for security (256 bits = 32 characters minimum)
if (JWT_SECRET.length < 32) {
  console.error('❌ CRITICAL SECURITY ERROR: JWT_SECRET is too short.');
  console.error(`❌ Current length: ${JWT_SECRET.length} characters`);
  console.error('❌ Required length: at least 32 characters for adequate security.');
  console.error('❌ Please use a longer, cryptographically secure random string.');
  process.exit(1);
}

// Warn if using an obvious placeholder value
const INSECURE_PATTERNS = [
  'secret',
  'password',
  'changeme',
  'change-me',
  'change_me',
  'your-jwt-secret',
  'your_jwt_secret',
  'jwt-secret',
  'jwt_secret',
  'production',
  'development',
  'test123',
  'admin'
];

const secretLower = JWT_SECRET.toLowerCase();
const hasInsecurePattern = INSECURE_PATTERNS.some(pattern => secretLower.includes(pattern));

if (hasInsecurePattern) {
  console.error('⚠️  SECURITY WARNING: JWT_SECRET appears to contain common words or patterns.');
  console.error('⚠️  This significantly reduces security. Please use a cryptographically random secret.');
  console.error('⚠️  Generate a secure secret with: openssl rand -base64 48');
  console.error('⚠️  Application will start in 5 seconds, but you should fix this immediately!');
  // Allow startup but warn loudly
  setTimeout(() => {
    console.error('⚠️  REMINDER: Replace your insecure JWT_SECRET!');
  }, 5000);
}

console.log('✅ JWT_SECRET validated successfully');

// Type assertion: JWT_SECRET is guaranteed to be a string after validation above
const VALIDATED_JWT_SECRET: string = JWT_SECRET;

const JWT_EXPIRES_IN = '24h'; // Token expires in 24 hours
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Refresh token expires in 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
}

/**
 * Generate an access token
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, VALIDATED_JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Generate a refresh token
 */
export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, VALIDATED_JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

/**
 * Verify and decode a token
 */
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, VALIDATED_JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}
