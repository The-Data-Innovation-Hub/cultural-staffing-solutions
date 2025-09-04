import { db } from '@/db';
import { users, userCourseProgress, certificates, userAchievements } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const userService = {
  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  },

  async getUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  async updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  },

  async getUserProgress(userId: string) {
    return await db
      .select()
      .from(userCourseProgress)
      .where(eq(userCourseProgress.userId, userId));
  },

  async getUserCertificates(userId: string) {
    return await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId));
  },

  async getUserAchievements(userId: string) {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
  },

  async getUserStats(userId: string) {
    const progress = await this.getUserProgress(userId);
    const certs = await this.getUserCertificates(userId);
    const achievements = await this.getUserAchievements(userId);

    const completedCourses = progress.filter(p => p.progress === 100).length;
    const totalLearningTime = progress.reduce((acc, p) => {
      const time = p.lastAccessedAt.getTime() - p.startedAt.getTime();
      return acc + time;
    }, 0);

    return {
      coursesCompleted: completedCourses,
      certificatesEarned: certs.length,
      achievementsUnlocked: achievements.length,
      learningTime: Math.round(totalLearningTime / (1000 * 60 * 60)), // in hours
      overallProgress: progress.length > 0 
        ? Math.round(progress.reduce((acc, p) => acc + p.progress, 0) / progress.length)
        : 0,
    };
  },
};