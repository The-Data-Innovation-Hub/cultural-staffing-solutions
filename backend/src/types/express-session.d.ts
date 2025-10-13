/**
 * Express Session Type Extensions
 * Extends the express-session module to include custom session properties
 */

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}
