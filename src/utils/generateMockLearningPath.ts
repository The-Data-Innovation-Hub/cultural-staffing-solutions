/**
 * Generate Mock Learning Path from Assessment Data
 *
 * When the backend is not available, this function generates a realistic
 * learning path based on the user's completed assessment stored in localStorage
 */

import type {
  LearningPath,
  PriorityArea,
  RecommendedCourse,
  Milestone,
  UserRole,
  CulturalBackground,
} from '@/types/assessment';

interface AssessmentData {
  roleSelection?: UserRole;
  culturalBackground?: Partial<CulturalBackground>;
  skillRatings?: Record<string, number>;
  learningPreferences?: {
    primaryStyle?: string;
    secondaryStyle?: string;
    timeCommitment?: string;
  };
}

export const generateMockLearningPath = (assessmentData: AssessmentData): {
  learningPath: LearningPath;
  priorityAreas: PriorityArea[];
  courses: RecommendedCourse[];
  milestones: Milestone[];
} => {
  const now = new Date().toISOString();
  const userId = 'mock-user-123';
  const assessmentId = 'mock-assessment-456';
  const learningPathId = 'mock-lp-789';

  // Calculate scores based on skill ratings
  const skillRatings = assessmentData.skillRatings || {};
  const skillValues = Object.values(skillRatings);
  const avgSkillScore = skillValues.length > 0
    ? Math.round((skillValues.reduce((a, b) => a + b, 0) / skillValues.length) * 20)
    : 70;

  // Cultural competency score based on English proficiency and experience
  const englishProficiency = assessmentData.culturalBackground?.englishProficiency || 3;
  const yearsExperience = assessmentData.culturalBackground?.yearsInTargetCountry || 0;
  const culturalScore = Math.round((englishProficiency * 15) + (Math.min(yearsExperience, 5) * 5));

  const overallScore = Math.round((avgSkillScore + culturalScore) / 2);

  // Determine difficulty level
  let difficultyLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate';
  if (overallScore < 60) difficultyLevel = 'beginner';
  else if (overallScore > 80) difficultyLevel = 'advanced';

  // Estimate completion time (weeks)
  const lowSkillCount = Object.values(skillRatings).filter(v => v <= 2).length;
  const estimatedWeeks = 8 + (lowSkillCount * 2);

  // Role-based path name
  const roleNames: Record<string, string> = {
    nurse: 'Nurse Cultural Integration & Development',
    physician: 'Physician Clinical Excellence Program',
    'allied-health': 'Allied Health Professional Development',
    administrative: 'Healthcare Administration Mastery',
    other: 'Healthcare Professional Development Path',
  };

  const pathName = roleNames[assessmentData.roleSelection || 'other'] || 'Personalized Learning Journey';

  // Generate Learning Path
  const learningPath: LearningPath = {
    id: learningPathId,
    userId,
    assessmentId,
    pathName,
    pathDescription: `Customized learning path based on your ${assessmentData.roleSelection} role and ${assessmentData.culturalBackground?.countryOfOrigin || 'international'} background`,
    overallScore,
    culturalCompetencyScore: culturalScore,
    skillsScore: avgSkillScore,
    estimatedCompletionWeeks: estimatedWeeks,
    difficultyLevel,
    isActive: true,
    status: 'in_progress',
    createdAt: now,
    startedAt: now,
  };

  // Generate Priority Areas based on low skills
  const priorityAreas: PriorityArea[] = [];
  let priorityOrder = 1;

  // Cultural competency (if needed)
  if (culturalScore < 75) {
    priorityAreas.push({
      id: `pa-cultural-${priorityOrder}`,
      learningPathId,
      category: 'cultural',
      title: 'Cultural Competency & Communication',
      description: 'Enhance cultural awareness and communication in healthcare settings',
      importance: 'critical',
      currentLevel: Math.ceil(culturalScore / 20),
      targetLevel: 5,
      estimatedTimeWeeks: 4,
      isCompleted: false,
      priorityOrder: priorityOrder++,
    });
  }

  // Low-rated skills become priority areas
  Object.entries(skillRatings).forEach(([skill, rating]) => {
    if (rating <= 2) {
      const categoryMap: Record<string, 'technical' | 'cultural' | 'language' | 'compliance'> = {
        'EHR Systems': 'technical',
        'Medical Equipment': 'technical',
        'Documentation': 'technical',
        'HIPAA/Privacy': 'compliance',
        'Infection Control': 'compliance',
        'Safety Protocols': 'compliance',
      };

      priorityAreas.push({
        id: `pa-${skill.toLowerCase().replace(/\s+/g, '-')}-${priorityOrder}`,
        learningPathId,
        category: categoryMap[skill] || 'technical',
        title: skill,
        description: `Improve proficiency in ${skill.toLowerCase()}`,
        importance: rating === 1 ? 'critical' : 'high',
        currentLevel: rating,
        targetLevel: 4,
        estimatedTimeWeeks: 3,
        isCompleted: false,
        priorityOrder: priorityOrder++,
      });
    }
  });

  // If no priority areas, add general ones
  if (priorityAreas.length === 0) {
    priorityAreas.push({
      id: 'pa-general-1',
      learningPathId,
      category: 'cultural',
      title: 'Advanced Cultural Competency',
      description: 'Deepen cultural understanding and patient care excellence',
      importance: 'high',
      currentLevel: 4,
      targetLevel: 5,
      estimatedTimeWeeks: 4,
      isCompleted: false,
      priorityOrder: 1,
    });
  }

  // Generate Recommended Courses
  const courses: RecommendedCourse[] = [];
  let courseOrder = 1;

  // Cultural course (always recommended for international workers)
  // Auto-enroll in first course with some progress to simulate active learning
  courses.push({
    id: `course-cultural-${courseOrder}`,
    learningPathId,
    courseId: 'c-cultural-101',
    // Required properties
    title: 'Cultural Competency in Healthcare',
    description: 'Navigate cultural differences and provide patient-centered care',
    category: 'Cultural',
    duration: 120,
    difficulty: 'beginner',
    // Backward compatibility properties
    courseTitle: 'Cultural Competency in Healthcare',
    courseDescription: 'Navigate cultural differences and provide patient-centered care',
    durationMinutes: 120,
    difficultyLevel: 'beginner',
    contentTypes: ['video', 'reading', 'interactive'],
    priorityOrder: courseOrder++,
    isRequired: true,
    isEnrolled: true,  // Auto-enroll in first course
    isCompleted: false,
    progressPercentage: 35,  // Show some progress
    enrolledAt: now,
  });

  // Add courses for low-rated skills
  // Auto-enroll in first low-skill course
  let enrolledInSkillCourse = false;
  Object.entries(skillRatings).forEach(([skill, rating]) => {
    if (rating <= 2) {
      const isFirstSkillCourse = !enrolledInSkillCourse;
      const courseTitle = `${skill} Fundamentals`;
      const courseDesc = `Master essential ${skill.toLowerCase()} skills`;
      courses.push({
        id: `course-${skill.toLowerCase().replace(/\s+/g, '-')}-${courseOrder}`,
        learningPathId,
        courseId: `c-${skill.toLowerCase().replace(/\s+/g, '-')}`,
        // Required properties
        title: courseTitle,
        description: courseDesc,
        category: 'Technical',
        duration: 90,
        difficulty: difficultyLevel,
        // Backward compatibility properties
        courseTitle,
        courseDescription: courseDesc,
        durationMinutes: 90,
        difficultyLevel,
        contentTypes: assessmentData.learningPreferences?.primaryStyle === 'visual'
          ? ['video', 'interactive']
          : ['reading', 'quiz'],
        priorityOrder: courseOrder++,
        isRequired: true,
        isEnrolled: isFirstSkillCourse,  // Enroll in first low-skill course
        isCompleted: false,
        progressPercentage: isFirstSkillCourse ? 0 : 0,
        enrolledAt: isFirstSkillCourse ? now : undefined,
      });
      if (isFirstSkillCourse) enrolledInSkillCourse = true;
    }
  });

  // Add some general courses
  const roleCourses: Record<string, string[]> = {
    nurse: ['Patient Assessment Mastery', 'Medication Safety', 'Clinical Documentation'],
    physician: ['Clinical Decision Making', 'Evidence-Based Medicine', 'Patient Communication'],
    'allied-health': ['Therapeutic Techniques', 'Patient Care Standards', 'Documentation Excellence'],
    administrative: ['Healthcare Operations', 'Compliance Management', 'Team Leadership'],
    other: ['Healthcare Fundamentals', 'Professional Development', 'Communication Skills'],
  };

  const generalCourses = roleCourses[assessmentData.roleSelection || 'other'] || roleCourses.other;
  generalCourses.slice(0, 3).forEach((courseTitle) => {
    const courseDesc = `Enhance your ${courseTitle.toLowerCase()} capabilities`;
    courses.push({
      id: `course-general-${courseOrder}`,
      learningPathId,
      courseId: `c-${courseTitle.toLowerCase().replace(/\s+/g, '-')}`,
      // Required properties
      title: courseTitle,
      description: courseDesc,
      category: 'Professional Development',
      duration: 60,
      difficulty: difficultyLevel,
      // Backward compatibility properties
      courseTitle,
      courseDescription: courseDesc,
      durationMinutes: 60,
      difficultyLevel,
      contentTypes: ['video', 'reading'],
      priorityOrder: courseOrder++,
      isRequired: false,
      isEnrolled: false,
      isCompleted: false,
      progressPercentage: 0,
    });
  });

  // Generate Milestones (30/60/90 day)
  const milestones: Milestone[] = [
    {
      id: 'milestone-30',
      learningPathId,
      title: '30-Day Check-in',
      description: 'Complete initial orientation and cultural training',
      milestoneType: 'cultural',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      scheduledWeek: 4,
      associatedCourseIds: courses.slice(0, 3).map(c => c.courseId),
      requiredActivities: [
        'Complete Cultural Competency course',
        'Review healthcare protocols',
        'Meet with supervisor',
      ],
      isCompleted: false,
      rewards: ['Cultural Foundation Certificate'],
      badgeAwarded: 'Cultural Competency - Level 1',
      milestoneOrder: 1,
    },
    {
      id: 'milestone-60',
      learningPathId,
      title: '60-Day Progress Review',
      description: 'Demonstrate technical skills and patient care competency',
      milestoneType: 'skills',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      scheduledWeek: 8,
      associatedCourseIds: courses.slice(3, 6).map(c => c.courseId),
      requiredActivities: [
        'Complete technical training modules',
        'Pass skills assessment',
        'Participate in team meetings',
      ],
      isCompleted: false,
      rewards: ['Technical Proficiency Badge'],
      badgeAwarded: 'Skills Mastery - Level 2',
      milestoneOrder: 2,
    },
    {
      id: 'milestone-90',
      learningPathId,
      title: '90-Day Full Integration',
      description: 'Achieve full integration and independent practice',
      milestoneType: 'general',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      scheduledWeek: 12,
      associatedCourseIds: courses.map(c => c.courseId),
      requiredActivities: [
        'Complete all required courses',
        'Demonstrate clinical competency',
        'Receive positive performance review',
      ],
      isCompleted: false,
      rewards: ['Integration Excellence Certificate', 'Professional Development Badge'],
      badgeAwarded: 'Fully Integrated Professional',
      milestoneOrder: 3,
    },
  ];

  return {
    learningPath,
    priorityAreas,
    courses,
    milestones,
  };
};

export const getAssessmentFromLocalStorage = (): AssessmentData | null => {
  try {
    const saved = localStorage.getItem('css_assessment_state');
    if (!saved) return null;

    const data = JSON.parse(saved);

    // Convert skillRatings from Map to object if needed
    let skillRatings = data.skillRatings;
    if (skillRatings && typeof skillRatings === 'object' && !Array.isArray(skillRatings)) {
      skillRatings = skillRatings;
    }

    return {
      roleSelection: data.roleSelection,
      culturalBackground: data.culturalBackground,
      skillRatings,
      learningPreferences: data.learningPreferences,
    };
  } catch (error) {
    console.error('Error reading assessment from localStorage:', error);
    return null;
  }
};
