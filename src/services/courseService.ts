import { db } from '@/db';
import { courses, userCourseProgress, assessments, trainingSessions } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export const courseService = {
  async getAllCourses() {
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  },

  async getCourseById(id: string) {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  },

  async createCourse(data: {
    title: string;
    description?: string;
    category?: string;
    duration?: number;
    content?: any;
  }) {
    const [course] = await db.insert(courses).values(data).returning();
    return course;
  },

  async updateCourse(id: string, data: Partial<typeof courses.$inferInsert>) {
    const [updated] = await db
      .update(courses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updated;
  },

  async getUserCourseProgress(userId: string, courseId: string) {
    const [progress] = await db
      .select()
      .from(userCourseProgress)
      .where(
        and(
          eq(userCourseProgress.userId, userId),
          eq(userCourseProgress.courseId, courseId)
        )
      );
    return progress;
  },

  async updateUserProgress(userId: string, courseId: string, progress: number) {
    const existing = await this.getUserCourseProgress(userId, courseId);
    
    if (existing) {
      const [updated] = await db
        .update(userCourseProgress)
        .set({
          progress,
          lastAccessedAt: new Date(),
          completedAt: progress === 100 ? new Date() : null,
        })
        .where(eq(userCourseProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userCourseProgress)
        .values({
          userId,
          courseId,
          progress,
          completedAt: progress === 100 ? new Date() : null,
        })
        .returning();
      return created;
    }
  },

  async getCourseAssessments(courseId: string) {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.courseId, courseId));
  },

  async getUpcomingSessions() {
    return await db
      .select()
      .from(trainingSessions)
      .where(eq(trainingSessions.status, 'scheduled'))
      .orderBy(trainingSessions.scheduledAt);
  },

  async getCoursesByCategory(category: string) {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.category, category))
      .orderBy(desc(courses.createdAt));
  },
};