import { PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate Learning Path
 *
 * Implements the algorithm documented in docs/backend-integration-guide.md
 * Creates a personalized learning path based on assessment results
 */
export const generateLearningPath = async (
  client: PoolClient,
  userId: string,
  assessmentId: string,
  role: string,
  culturalBackground: any,
  skillRatings: Record<string, number>,
  learningPreferences: any
) => {
  // Calculate scores
  const skillValues = Object.values(skillRatings);
  const avgSkillScore = Math.round((skillValues.reduce((a, b) => a + b, 0) / skillValues.length) * 20);

  const englishProficiency = culturalBackground.englishProficiency || 3;
  const yearsExperience = culturalBackground.yearsInTargetCountry || 0;
  const culturalScore = Math.round((englishProficiency * 15) + (Math.min(yearsExperience, 5) * 5));

  const overallScore = Math.round((avgSkillScore + culturalScore) / 2);

  // Determine difficulty level
  let difficultyLevel = 'intermediate';
  if (overallScore < 60) difficultyLevel = 'beginner';
  else if (overallScore > 80) difficultyLevel = 'advanced';

  // Estimate completion time
  const lowSkillCount = Object.values(skillRatings).filter(v => v <= 2).length;
  const estimatedWeeks = 8 + (lowSkillCount * 2);

  // Role-based path names
  const roleNames: Record<string, string> = {
    nurse: 'Nurse Cultural Integration & Development',
    physician: 'Physician Clinical Excellence Program',
    'allied-health': 'Allied Health Professional Development',
    administrative: 'Healthcare Administration Mastery',
    other: 'Healthcare Professional Development Path',
  };

  const pathName = roleNames[role] || 'Personalized Learning Journey';

  // Insert learning path
  const learningPathId = uuidv4();
  const pathDescription = `Customized learning path for ${role} from ${culturalBackground.countryOfOrigin || 'international'} background`;

  const insertPathQuery = `
    INSERT INTO learning_paths (
      id, user_id, assessment_id, path_name, path_description,
      title, description,
      overall_score, cultural_competency_score, skills_score,
      estimated_completion_weeks, difficulty_level, is_active,
      status, created_at, started_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *
  `;

  const pathResult = await client.query(insertPathQuery, [
    learningPathId,
    userId,
    assessmentId,
    pathName,
    pathDescription,
    pathName,  // Also populate title for backward compatibility
    pathDescription,  // Also populate description for backward compatibility
    overallScore,
    culturalScore,
    avgSkillScore,
    estimatedWeeks,
    difficultyLevel,
    true,
    'in_progress',
    new Date().toISOString(),
    new Date().toISOString()
  ]);

  // Generate priority areas based on low skills
  let priorityOrder = 1;

  // Add cultural competency if needed
  if (culturalScore < 75) {
    await client.query(`
      INSERT INTO priority_areas (
        id, learning_path_id, category, title, description,
        importance, current_level, target_level,
        estimated_time_weeks, is_completed, priority_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      uuidv4(),
      learningPathId,
      'cultural',
      'Cultural Competency & Communication',
      'Enhance cultural awareness and communication in healthcare settings',
      'critical',
      Math.ceil(culturalScore / 20),
      5,
      4,
      false,
      priorityOrder++
    ]);
  }

  // Add priority areas for low skills
  for (const [skill, rating] of Object.entries(skillRatings)) {
    if (rating <= 2) {
      const categoryMap: Record<string, string> = {
        'EHR Systems': 'technical',
        'Medical Equipment': 'technical',
        'Documentation': 'technical',
        'HIPAA/Privacy': 'compliance',
        'Infection Control': 'compliance',
        'Safety Protocols': 'compliance',
      };

      await client.query(`
        INSERT INTO priority_areas (
          id, learning_path_id, category, title, description,
          importance, current_level, target_level,
          estimated_time_weeks, is_completed, priority_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        uuidv4(),
        learningPathId,
        categoryMap[skill] || 'technical',
        skill,
        `Improve proficiency in ${skill.toLowerCase()}`,
        rating === 1 ? 'critical' : 'high',
        rating,
        4,
        3,
        false,
        priorityOrder++
      ]);
    }
  }

  // Generate recommended courses
  let courseOrder = 1;

  // Cultural course (always recommended)
  await client.query(`
    INSERT INTO recommended_courses (
      id, learning_path_id, course_id, course_title, course_description,
      category, duration_minutes, difficulty_level, content_types,
      priority_order, is_required, is_enrolled, is_completed, progress_percentage
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  `, [
    uuidv4(),
    learningPathId,
    'c-cultural-101',
    'Cultural Competency in Healthcare',
    'Navigate cultural differences and provide patient-centered care',
    'Cultural',
    120,
    'beginner',
    ['video', 'reading', 'interactive'],
    courseOrder++,
    true,
    false,
    false,
    0
  ]);

  // Add courses for low skills
  for (const [skill, rating] of Object.entries(skillRatings)) {
    if (rating <= 2) {
      await client.query(`
        INSERT INTO recommended_courses (
          id, learning_path_id, course_id, course_title, course_description,
          category, duration_minutes, difficulty_level, content_types,
          priority_order, is_required, is_enrolled, is_completed, progress_percentage
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        uuidv4(),
        learningPathId,
        `c-${skill.toLowerCase().replace(/\s+/g, '-')}`,
        `${skill} Fundamentals`,
        `Master essential ${skill.toLowerCase()} skills`,
        'Technical',
        90,
        difficultyLevel,
        learningPreferences.primaryStyle === 'visual' ? ['video', 'interactive'] : ['reading', 'quiz'],
        courseOrder++,
        true,
        false,
        false,
        0
      ]);
    }
  }

  // Generate milestones (30/60/90 day)
  const milestones = [
    {
      title: '30-Day Check-in',
      description: 'Complete initial orientation and cultural training',
      type: 'cultural',
      week: 4,
      days: 30,
      order: 1
    },
    {
      title: '60-Day Progress Review',
      description: 'Demonstrate technical skills and patient care competency',
      type: 'skills',
      week: 8,
      days: 60,
      order: 2
    },
    {
      title: '90-Day Full Integration',
      description: 'Achieve full integration and independent practice',
      type: 'general',
      week: 12,
      days: 90,
      order: 3
    }
  ];

  for (const milestone of milestones) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + milestone.days);

    await client.query(`
      INSERT INTO milestones (
        id, learning_path_id, title, description, milestone_type,
        target_date, scheduled_week, is_completed, milestone_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      uuidv4(),
      learningPathId,
      milestone.title,
      milestone.description,
      milestone.type,
      targetDate.toISOString(),
      milestone.week,
      false,
      milestone.order
    ]);
  }

  return pathResult.rows[0];
};
