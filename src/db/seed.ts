import { db } from './index';
import { users, courses, trainingSessions, achievements, learningPaths } from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Create sample users
    console.log('Creating users...');
    const [employee1, manager1, admin1] = await db.insert(users).values([
      {
        email: 'sarah.employee@example.com',
        password: 'password123', // In production, this should be hashed
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'employee',
      },
      {
        email: 'michael.manager@example.com',
        password: 'password123',
        firstName: 'Michael',
        lastName: 'Chen',
        role: 'manager',
      },
      {
        email: 'admin@culturalstaffing.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      },
    ]).returning();

    // Create sample courses
    console.log('Creating courses...');
    const coursesData = await db.insert(courses).values([
      {
        title: 'Cultural Sensitivity in Healthcare',
        description: 'Learn essential cultural awareness skills for healthcare professionals working in Northern Ireland.',
        category: 'Cultural Training',
        duration: 120,
        content: {
          modules: [
            { title: 'Introduction to Northern Ireland Culture', duration: 30 },
            { title: 'Healthcare Communication', duration: 30 },
            { title: 'Patient Interaction Guidelines', duration: 30 },
            { title: 'Case Studies and Practice', duration: 30 },
          ]
        }
      },
      {
        title: 'Northern Ireland Healthcare Regulations',
        description: 'Comprehensive overview of healthcare regulations and compliance requirements in Northern Ireland.',
        category: 'Compliance',
        duration: 90,
        content: {
          modules: [
            { title: 'HSC Structure and Organization', duration: 30 },
            { title: 'Patient Rights and GDPR', duration: 30 },
            { title: 'Healthcare Standards', duration: 30 },
          ]
        }
      },
      {
        title: 'Emergency Response Protocols',
        description: 'Essential emergency response training for healthcare workers.',
        category: 'Clinical Skills',
        duration: 180,
        content: {
          modules: [
            { title: 'Basic Life Support', duration: 60 },
            { title: 'Emergency Triage', duration: 60 },
            { title: 'Critical Incident Management', duration: 60 },
          ]
        }
      },
      {
        title: 'Professional Communication Skills',
        description: 'Develop effective communication skills for healthcare settings.',
        category: 'Soft Skills',
        duration: 60,
        content: {
          modules: [
            { title: 'Active Listening', duration: 20 },
            { title: 'Empathetic Communication', duration: 20 },
            { title: 'Conflict Resolution', duration: 20 },
          ]
        }
      },
      {
        title: 'Medical Documentation Standards',
        description: 'Learn proper documentation practices for Northern Ireland healthcare.',
        category: 'Compliance',
        duration: 45,
        content: {
          modules: [
            { title: 'Documentation Requirements', duration: 15 },
            { title: 'Electronic Health Records', duration: 15 },
            { title: 'Audit and Compliance', duration: 15 },
          ]
        }
      },
    ]).returning();

    // Create training sessions
    console.log('Creating training sessions...');
    await db.insert(trainingSessions).values([
      {
        courseId: coursesData[0].id,
        title: 'Live Q&A: Cultural Sensitivity',
        description: 'Interactive session on cultural awareness in healthcare',
        instructorId: manager1.id,
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: 60,
        maxParticipants: 50,
        status: 'scheduled',
      },
      {
        courseId: coursesData[1].id,
        title: 'HSE Compliance Workshop',
        description: 'Deep dive into HSE regulations and requirements',
        instructorId: manager1.id,
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
        duration: 90,
        maxParticipants: 30,
        status: 'scheduled',
      },
    ]);

    // Create achievements
    console.log('Creating achievements...');
    await db.insert(achievements).values([
      {
        title: 'First Steps',
        description: 'Complete your first course',
        badge: '/badges/first-steps.svg',
        criteria: { coursesCompleted: 1 },
        points: 10,
      },
      {
        title: 'Quick Learner',
        description: 'Complete 5 courses',
        badge: '/badges/quick-learner.svg',
        criteria: { coursesCompleted: 5 },
        points: 50,
      },
      {
        title: 'Expert Level',
        description: 'Complete 10 courses',
        badge: '/badges/expert.svg',
        criteria: { coursesCompleted: 10 },
        points: 100,
      },
      {
        title: 'Perfect Score',
        description: 'Score 100% on an assessment',
        badge: '/badges/perfect.svg',
        criteria: { perfectScore: true },
        points: 25,
      },
    ]);

    // Create learning paths
    console.log('Creating learning paths...');
    await db.insert(learningPaths).values([
      {
        title: 'Healthcare Professional Onboarding',
        description: 'Complete onboarding pathway for new healthcare professionals in Ireland',
        courses: coursesData.slice(0, 3).map(c => c.id),
        targetRole: 'Healthcare Worker',
      },
      {
        title: 'Compliance Specialist',
        description: 'Become proficient in Irish healthcare compliance and regulations',
        courses: [coursesData[1].id, coursesData[4].id],
        targetRole: 'Compliance Officer',
      },
    ]);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();