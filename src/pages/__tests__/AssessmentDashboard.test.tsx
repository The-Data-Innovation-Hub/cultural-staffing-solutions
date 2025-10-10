/**
 * Assessment Dashboard Tests
 *
 * Tests the learning path dashboard including:
 * - Data loading and display
 * - Course enrollment
 * - Progress tracking
 * - Milestone completion
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssessmentDashboard from '../employee/AssessmentDashboard';
import * as assessmentHooks from '@/hooks/useAssessmentData';

// Mock the assessment hooks
vi.mock('@/hooks/useAssessmentData', () => ({
  useDashboardData: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
  };
});

const mockLearningPath = {
  id: 'lp-123',
  userId: 'user-456',
  assessmentId: 'assess-789',
  pathName: 'Nurse Cultural Integration & Development',
  pathDescription: 'Personalized learning journey',
  overallScore: 72,
  culturalCompetencyScore: 68,
  skillsScore: 76,
  estimatedCompletionWeeks: 12,
  difficultyLevel: 'intermediate' as const,
  isActive: true,
  status: 'in_progress' as const,
  createdAt: '2025-01-01T00:00:00Z',
  startedAt: '2025-01-01T00:00:00Z',
};

const mockPriorityAreas = [
  {
    id: 'pa-1',
    learningPathId: 'lp-123',
    category: 'cultural' as const,
    title: 'Cultural Competency',
    description: 'Understanding healthcare culture',
    importance: 'critical' as const,
    currentLevel: 2,
    targetLevel: 4,
    estimatedTimeWeeks: 4,
    isCompleted: false,
    priorityOrder: 1,
  },
  {
    id: 'pa-2',
    learningPathId: 'lp-123',
    category: 'technical' as const,
    title: 'EMR Systems',
    description: 'Electronic medical records',
    importance: 'high' as const,
    currentLevel: 3,
    targetLevel: 5,
    estimatedTimeWeeks: 3,
    isCompleted: false,
    priorityOrder: 2,
  },
];

const mockCourses = [
  {
    id: 'course-1',
    learningPathId: 'lp-123',
    courseId: 'c-001',
    courseTitle: 'Cultural Competency 101',
    courseDescription: 'Introduction to cultural awareness',
    category: 'Cultural',
    durationMinutes: 120,
    difficultyLevel: 'beginner' as const,
    contentTypes: ['video', 'reading'],
    priorityOrder: 1,
    isRequired: true,
    isEnrolled: true,
    isCompleted: false,
    progressPercentage: 45,
  },
  {
    id: 'course-2',
    learningPathId: 'lp-123',
    courseId: 'c-002',
    courseTitle: 'EMR Fundamentals',
    courseDescription: 'Electronic medical records basics',
    category: 'Technical',
    durationMinutes: 90,
    difficultyLevel: 'beginner' as const,
    contentTypes: ['video', 'interactive'],
    priorityOrder: 2,
    isRequired: true,
    isEnrolled: false,
    isCompleted: false,
    progressPercentage: 0,
  },
];

const mockMilestones = [
  {
    id: 'ms-1',
    learningPathId: 'lp-123',
    title: '30-Day Check-in',
    description: 'Complete initial orientation',
    milestoneType: 'cultural' as const,
    targetDate: '2025-02-01T00:00:00Z',
    scheduledWeek: 4,
    associatedCourseIds: ['c-001'],
    requiredActivities: ['Complete cultural competency course'],
    isCompleted: false,
    rewards: ['Certificate of Completion'],
    badgeAwarded: 'Cultural Foundation',
    milestoneOrder: 1,
  },
];

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <AssessmentDashboard />
    </BrowserRouter>
  );
};

describe('AssessmentDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner when data is loading', () => {
      vi.mocked(assessmentHooks.useDashboardData).mockReturnValue({
        learningPath: null,
        priorityAreas: [],
        courses: [],
        milestones: [],
        reviewCycle: null,
        isLoading: true,
        hasError: false,
        refetchAll: vi.fn(),
        enrollInCourse: vi.fn(),
        updateCourseProgress: vi.fn(),
        completeMilestone: vi.fn(),
        totalProgress: 0,
        enrolledCourses: [],
        completedCourses: [],
        nextMilestone: undefined,
        daysElapsed: 0,
        daysRemaining: 0,
      });

      renderDashboard();

      expect(screen.getByText(/Loading Your Learning Path/i)).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when no assessment found', () => {
      vi.mocked(assessmentHooks.useDashboardData).mockReturnValue({
        learningPath: null,
        priorityAreas: [],
        courses: [],
        milestones: [],
        reviewCycle: null,
        isLoading: false,
        hasError: true,
        refetchAll: vi.fn(),
        enrollInCourse: vi.fn(),
        updateCourseProgress: vi.fn(),
        completeMilestone: vi.fn(),
        totalProgress: 0,
        enrolledCourses: [],
        completedCourses: [],
        nextMilestone: undefined,
        daysElapsed: 0,
        daysRemaining: 0,
      });

      renderDashboard();

      expect(screen.getByText(/No Assessment Found/i)).toBeInTheDocument();
      expect(screen.getByText(/Take Onboarding Assessment/i)).toBeInTheDocument();
    });

    it('should provide link to take assessment', () => {
      vi.mocked(assessmentHooks.useDashboardData).mockReturnValue({
        learningPath: null,
        priorityAreas: [],
        courses: [],
        milestones: [],
        reviewCycle: null,
        isLoading: false,
        hasError: true,
        refetchAll: vi.fn(),
        enrollInCourse: vi.fn(),
        updateCourseProgress: vi.fn(),
        completeMilestone: vi.fn(),
        totalProgress: 0,
        enrolledCourses: [],
        completedCourses: [],
        nextMilestone: undefined,
        daysElapsed: 0,
        daysRemaining: 0,
      });

      renderDashboard();

      const link = screen.getByText(/Take Onboarding Assessment/i);
      expect(link).toHaveAttribute('href', '/employee/onboarding');
    });
  });

  describe('Learning Path Display', () => {
    beforeEach(() => {
      vi.mocked(assessmentHooks.useDashboardData).mockReturnValue({
        learningPath: mockLearningPath,
        priorityAreas: mockPriorityAreas,
        courses: mockCourses,
        milestones: mockMilestones,
        reviewCycle: null,
        isLoading: false,
        hasError: false,
        refetchAll: vi.fn(),
        enrollInCourse: vi.fn(),
        updateCourseProgress: vi.fn(),
        completeMilestone: vi.fn(),
        totalProgress: 45,
        enrolledCourses: [mockCourses[0]],
        completedCourses: [],
        nextMilestone: mockMilestones[0],
        daysElapsed: 7,
        daysRemaining: 77,
      });
    });

    it('should display learning path title', () => {
      renderDashboard();
      expect(screen.getByText(mockLearningPath.pathName)).toBeInTheDocument();
    });

    it('should show overall score', () => {
      renderDashboard();
      expect(screen.getByText(/72%/)).toBeInTheDocument();
    });

    it('should display cultural competency score', () => {
      renderDashboard();
      expect(screen.getByText(/Cultural Competency/i)).toBeInTheDocument();
      expect(screen.getByText(/68%/)).toBeInTheDocument();
    });

    it('should show skills score', () => {
      renderDashboard();
      expect(screen.getByText(/Skills Proficiency/i)).toBeInTheDocument();
      expect(screen.getByText(/76%/)).toBeInTheDocument();
    });

    it('should display estimated completion time', () => {
      renderDashboard();
      expect(screen.getByText(/12 weeks/i)).toBeInTheDocument();
    });
  });

  describe('Priority Areas', () => {
    beforeEach(() => {
      vi.mocked(assessmentHooks.useDashboardData).mockReturnValue({
        learningPath: mockLearningPath,
        priorityAreas: mockPriorityAreas,
        courses: mockCourses,
        milestones: mockMilestones,
        reviewCycle: null,
        isLoading: false,
        hasError: false,
        refetchAll: vi.fn(),
        enrollInCourse: vi.fn(),
        updateCourseProgress: vi.fn(),
        completeMilestone: vi.fn(),
        totalProgress: 45,
        enrolledCourses: [mockCourses[0]],
        completedCourses: [],
        nextMilestone: mockMilestones[0],
        daysElapsed: 7,
        daysRemaining: 77,
      });
    });

    it('should display all priority areas', () => {
      renderDashboard();

      expect(screen.getByText('Cultural Competency')).toBeInTheDocument();
      expect(screen.getByText('EMR Systems')).toBeInTheDocument();
    });

    it('should show importance badges', () => {
      renderDashboard();

      expect(screen.getByText(/Critical/i)).toBeInTheDocument();
      expect(screen.getByText(/High/i)).toBeInTheDocument();
    });

    it('should display progress for each area', () => {
      renderDashboard();

      // Level 2 → 4 (Cultural)
      expect(screen.getByText(/Level 2 → 4/)).toBeInTheDocument();

      // Level 3 → 5 (Technical)
      expect(screen.getByText(/Level 3 → 5/)).toBeInTheDocument();
    });
  });

  describe('Course Enrollment', () => {
    const mockEnroll = vi.fn();

    beforeEach(() => {
      vi.mocked(assessmentHooks.useDashboardData).mockReturnValue({
        learningPath: mockLearningPath,
        priorityAreas: mockPriorityAreas,
        courses: mockCourses,
        milestones: mockMilestones,
        reviewCycle: null,
        isLoading: false,
        hasError: false,
        refetchAll: vi.fn(),
        enrollInCourse: mockEnroll,
        updateCourseProgress: vi.fn(),
        completeMilestone: vi.fn(),
        totalProgress: 45,
        enrolledCourses: [mockCourses[0]],
        completedCourses: [],
        nextMilestone: mockMilestones[0],
        daysElapsed: 7,
        daysRemaining: 77,
      });
    });

    it('should display enrolled courses', () => {
      renderDashboard();
      expect(screen.getByText('Cultural Competency 101')).toBeInTheDocument();
    });

    it('should show enrollment button for unenrolled courses', () => {
      renderDashboard();

      const enrollButton = screen.getByRole('button', { name: /Enroll/i });
      expect(enrollButton).toBeInTheDocument();
    });

    it('should call enrollInCourse when enrollment button clicked', async () => {
      renderDashboard();

      const enrollButton = screen.getByRole('button', { name: /Enroll/i });
      fireEvent.click(enrollButton);

      await waitFor(() => {
        expect(mockEnroll).toHaveBeenCalledWith('c-002');
      });
    });

    it('should display course progress for enrolled courses', () => {
      renderDashboard();
      expect(screen.getByText(/45%/)).toBeInTheDocument();
    });

    it('should show required badge for required courses', () => {
      renderDashboard();
      expect(screen.getAllByText(/Required/i).length).toBeGreaterThan(0);
    });
  });

  describe('Milestones', () => {
    beforeEach(() => {
      vi.mocked(assessmentHooks.useDashboardData).mockReturnValue({
        learningPath: mockLearningPath,
        priorityAreas: mockPriorityAreas,
        courses: mockCourses,
        milestones: mockMilestones,
        reviewCycle: null,
        isLoading: false,
        hasError: false,
        refetchAll: vi.fn(),
        enrollInCourse: vi.fn(),
        updateCourseProgress: vi.fn(),
        completeMilestone: vi.fn(),
        totalProgress: 45,
        enrolledCourses: [mockCourses[0]],
        completedCourses: [],
        nextMilestone: mockMilestones[0],
        daysElapsed: 7,
        daysRemaining: 77,
      });
    });

    it('should display milestone titles', () => {
      renderDashboard();
      expect(screen.getByText('30-Day Check-in')).toBeInTheDocument();
    });

    it('should show milestone target dates', () => {
      renderDashboard();
      expect(screen.getByText(/Week 4/i)).toBeInTheDocument();
    });

    it('should display milestone rewards', () => {
      renderDashboard();
      expect(screen.getByText(/Cultural Foundation/i)).toBeInTheDocument();
    });

    it('should highlight next upcoming milestone', () => {
      renderDashboard();

      const nextMilestone = screen.getByText('30-Day Check-in').closest('div');
      expect(nextMilestone).toHaveClass('border-css-gold');
    });
  });

  describe('Mock Data Indicator', () => {
    it('should show development indicator when using mock data', () => {
      vi.mocked(assessmentHooks.useDashboardData).mockReturnValue({
        learningPath: null,
        priorityAreas: [],
        courses: [],
        milestones: [],
        reviewCycle: null,
        isLoading: false,
        hasError: false,
        refetchAll: vi.fn(),
        enrollInCourse: vi.fn(),
        updateCourseProgress: vi.fn(),
        completeMilestone: vi.fn(),
        totalProgress: 0,
        enrolledCourses: [],
        completedCourses: [],
        nextMilestone: undefined,
        daysElapsed: 0,
        daysRemaining: 0,
      });

      renderDashboard();

      // Should fallback to mock data and show indicator
      expect(screen.getByText(/Development Mode/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      vi.mocked(assessmentHooks.useDashboardData).mockReturnValue({
        learningPath: mockLearningPath,
        priorityAreas: mockPriorityAreas,
        courses: mockCourses,
        milestones: mockMilestones,
        reviewCycle: null,
        isLoading: false,
        hasError: false,
        refetchAll: vi.fn(),
        enrollInCourse: vi.fn(),
        updateCourseProgress: vi.fn(),
        completeMilestone: vi.fn(),
        totalProgress: 45,
        enrolledCourses: [mockCourses[0]],
        completedCourses: [],
        nextMilestone: mockMilestones[0],
        daysElapsed: 7,
        daysRemaining: 77,
      });
    });

    it('should use grid layout for priority areas', () => {
      renderDashboard();

      const priorityGrid = screen.getByTestId('priority-areas-grid');
      expect(priorityGrid).toHaveClass('grid');
    });

    it('should stack cards on mobile', () => {
      // Mock mobile viewport
      global.innerWidth = 375;

      renderDashboard();

      const container = screen.getByTestId('dashboard-container');
      expect(container).toHaveClass('grid-cols-1');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      vi.mocked(assessmentHooks.useDashboardData).mockReturnValue({
        learningPath: mockLearningPath,
        priorityAreas: mockPriorityAreas,
        courses: mockCourses,
        milestones: mockMilestones,
        reviewCycle: null,
        isLoading: false,
        hasError: false,
        refetchAll: vi.fn(),
        enrollInCourse: vi.fn(),
        updateCourseProgress: vi.fn(),
        completeMilestone: vi.fn(),
        totalProgress: 45,
        enrolledCourses: [mockCourses[0]],
        completedCourses: [],
        nextMilestone: mockMilestones[0],
        daysElapsed: 7,
        daysRemaining: 77,
      });
    });

    it('should have proper heading hierarchy', () => {
      renderDashboard();

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it('should have ARIA labels on interactive elements', () => {
      renderDashboard();

      const enrollButton = screen.getByRole('button', { name: /Enroll/i });
      expect(enrollButton).toHaveAccessibleName();
    });

    it('should announce loading state to screen readers', () => {
      vi.mocked(assessmentHooks.useDashboardData).mockReturnValue({
        learningPath: null,
        priorityAreas: [],
        courses: [],
        milestones: [],
        reviewCycle: null,
        isLoading: true,
        hasError: false,
        refetchAll: vi.fn(),
        enrollInCourse: vi.fn(),
        updateCourseProgress: vi.fn(),
        completeMilestone: vi.fn(),
        totalProgress: 0,
        enrolledCourses: [],
        completedCourses: [],
        nextMilestone: undefined,
        daysElapsed: 0,
        daysRemaining: 0,
      });

      renderDashboard();

      const loadingMessage = screen.getByText(/Loading/i);
      expect(loadingMessage).toBeInTheDocument();
    });
  });
});
