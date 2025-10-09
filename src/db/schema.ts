import { pgTable, serial, text, varchar, integer, timestamp, boolean, decimal, json, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // 'employee', 'manager', 'admin'
  profileImage: text('profile_image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Courses table
export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  duration: integer('duration'), // in minutes
  thumbnail: text('thumbnail'),
  content: json('content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User Course Progress
export const userCourseProgress = pgTable('user_course_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  courseId: uuid('course_id').notNull().references(() => courses.id),
  progress: integer('progress').default(0).notNull(), // percentage 0-100
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  lastAccessedAt: timestamp('last_accessed_at').defaultNow().notNull(),
});

// Assessments table
export const assessments = pgTable('assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').references(() => courses.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  questions: json('questions').notNull(),
  passingScore: integer('passing_score').default(70).notNull(),
  timeLimit: integer('time_limit'), // in minutes
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Assessment Results
export const assessmentResults = pgTable('assessment_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  assessmentId: uuid('assessment_id').notNull().references(() => assessments.id),
  score: integer('score').notNull(),
  passed: boolean('passed').notNull(),
  answers: json('answers'),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
});

// Certificates table
export const certificates = pgTable('certificates', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  courseId: uuid('course_id').references(() => courses.id),
  assessmentId: uuid('assessment_id').references(() => assessments.id),
  certificateNumber: varchar('certificate_number', { length: 100 }).unique().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
});

// Training Sessions (Live sessions)
export const trainingSessions = pgTable('training_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').references(() => courses.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  instructorId: uuid('instructor_id').references(() => users.id),
  scheduledAt: timestamp('scheduled_at').notNull(),
  duration: integer('duration'), // in minutes
  meetingLink: text('meeting_link'),
  maxParticipants: integer('max_participants'),
  status: varchar('status', { length: 50 }).default('scheduled'), // scheduled, in-progress, completed, cancelled
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Training Session Registrations
export const sessionRegistrations = pgTable('session_registrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull().references(() => trainingSessions.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
  attended: boolean('attended').default(false),
  feedback: text('feedback'),
});

// Learning Paths
export const learningPaths = pgTable('learning_paths', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  courses: json('courses'), // array of course IDs in order
  targetRole: varchar('target_role', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User Learning Path Progress
export const userLearningPaths = pgTable('user_learning_paths', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  learningPathId: uuid('learning_path_id').notNull().references(() => learningPaths.id),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  progress: integer('progress').default(0).notNull(), // percentage 0-100
});

// Achievements
export const achievements = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  badge: text('badge'), // URL to badge image
  criteria: json('criteria'), // JSON object defining achievement criteria
  points: integer('points').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User Achievements
export const userAchievements = pgTable('user_achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  achievementId: uuid('achievement_id').notNull().references(() => achievements.id),
  earnedAt: timestamp('earned_at').defaultNow().notNull(),
});

// Learning Analytics
export const learningAnalytics = pgTable('learning_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  courseId: uuid('course_id').references(() => courses.id),
  sessionDuration: integer('session_duration'), // in seconds
  pagesViewed: integer('pages_viewed'),
  videosWatched: integer('videos_watched'),
  assignmentsCompleted: integer('assignments_completed'),
  date: timestamp('date').defaultNow().notNull(),
});

// Waitlist table
export const waitlist = pgTable('waitlist', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  profession: varchar('profession', { length: 100 }), // e.g., 'nurse', 'doctor', 'care_assistant'
  yearsOfExperience: integer('years_of_experience'),
  interestedServices: json('interested_services'), // array of service types
  message: text('message'),
  status: varchar('status', { length: 50 }).default('waitlisted').notNull(), // waitlisted, contacted, registered, removed
  signupDate: timestamp('signup_date').defaultNow().notNull(),
  confirmedEmail: boolean('confirmed_email').default(false).notNull(),
  confirmationToken: varchar('confirmation_token', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 50 }),
  referralSource: varchar('referral_source', { length: 100 }), // how they heard about us
  notes: text('notes'), // admin notes
  contactedAt: timestamp('contacted_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Waitlist Audit Log table
export const waitlistAuditLog = pgTable('waitlist_audit_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  waitlistId: uuid('waitlist_id').notNull().references(() => waitlist.id),
  adminUserId: uuid('admin_user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(), // e.g., 'status_change', 'note_added', 'contacted'
  previousValue: text('previous_value'),
  newValue: text('new_value'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  courseProgress: many(userCourseProgress),
  assessmentResults: many(assessmentResults),
  certificates: many(certificates),
  sessionRegistrations: many(sessionRegistrations),
  learningPaths: many(userLearningPaths),
  achievements: many(userAchievements),
  analytics: many(learningAnalytics),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  progress: many(userCourseProgress),
  assessments: many(assessments),
  certificates: many(certificates),
  sessions: many(trainingSessions),
  analytics: many(learningAnalytics),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assessments.courseId],
    references: [courses.id],
  }),
  results: many(assessmentResults),
  certificates: many(certificates),
}));