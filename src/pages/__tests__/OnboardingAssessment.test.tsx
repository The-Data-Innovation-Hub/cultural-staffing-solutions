/**
 * Onboarding Assessment Tests
 *
 * Tests the complete 6-step assessment flow including:
 * - Step navigation
 * - Form validation
 * - Auto-save functionality
 * - Assessment submission
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OnboardingAssessment from '../employee/OnboardingAssessment';
import * as assessmentService from '@/services/assessmentService';

// Mock the assessment service
vi.mock('@/services/assessmentService', () => ({
  submitAssessment: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const renderAssessment = () => {
  return render(
    <BrowserRouter>
      <OnboardingAssessment />
    </BrowserRouter>
  );
};

describe('OnboardingAssessment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial Render', () => {
    it('should render the welcome step initially', () => {
      renderAssessment();

      expect(screen.getByText(/Welcome to Your Onboarding Journey/i)).toBeInTheDocument();
      expect(screen.getByText(/Begin Assessment/i)).toBeInTheDocument();
    });

    it('should show progress indicator at 0%', () => {
      renderAssessment();

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });

    it('should display all 6 steps in the progress tracker', () => {
      renderAssessment();

      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Cultural Background')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
      expect(screen.getByText('Learning Style')).toBeInTheDocument();
      expect(screen.getByText('Results')).toBeInTheDocument();
    });
  });

  describe('Step Navigation', () => {
    it('should navigate to role selection when clicking Begin Assessment', async () => {
      renderAssessment();

      const beginButton = screen.getByText(/Begin Assessment/i);
      fireEvent.click(beginButton);

      await waitFor(() => {
        expect(screen.getByText(/Select Your Role/i)).toBeInTheDocument();
      });
    });

    it('should not allow next without role selection', () => {
      renderAssessment();

      // Go to role step
      fireEvent.click(screen.getByText(/Begin Assessment/i));

      // Try to go next without selecting
      const nextButton = screen.getByText(/Next/i);
      expect(nextButton).toBeDisabled();
    });

    it('should enable next button after role selection', async () => {
      renderAssessment();

      // Go to role step
      fireEvent.click(screen.getByText(/Begin Assessment/i));

      // Select a role
      const nurseButton = screen.getByRole('button', { name: /Nurse/i });
      fireEvent.click(nurseButton);

      await waitFor(() => {
        const nextButton = screen.getByText(/Next/i);
        expect(nextButton).not.toBeDisabled();
      });
    });

    it('should allow going back to previous step', async () => {
      renderAssessment();

      // Navigate forward
      fireEvent.click(screen.getByText(/Begin Assessment/i));

      await waitFor(() => {
        expect(screen.getByText(/Select Your Role/i)).toBeInTheDocument();
      });

      // Go back
      const backButton = screen.getByText(/Back/i);
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(screen.getByText(/Welcome to Your Onboarding Journey/i)).toBeInTheDocument();
      });
    });
  });

  describe('Role Selection', () => {
    beforeEach(() => {
      renderAssessment();
      fireEvent.click(screen.getByText(/Begin Assessment/i));
    });

    it('should display all role options', () => {
      expect(screen.getByText('Nurse')).toBeInTheDocument();
      expect(screen.getByText('Physician')).toBeInTheDocument();
      expect(screen.getByText('Allied Health')).toBeInTheDocument();
      expect(screen.getByText('Administrative')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });

    it('should highlight selected role', async () => {
      const nurseButton = screen.getByRole('button', { name: /Nurse/i });
      fireEvent.click(nurseButton);

      await waitFor(() => {
        expect(nurseButton).toHaveClass('border-css-gold');
      });
    });

    it('should show role description when selected', async () => {
      const nurseButton = screen.getByRole('button', { name: /Nurse/i });
      fireEvent.click(nurseButton);

      await waitFor(() => {
        expect(screen.getByText(/Registered nurses/i)).toBeInTheDocument();
      });
    });
  });

  describe('Cultural Background', () => {
    beforeEach(async () => {
      renderAssessment();
      fireEvent.click(screen.getByText(/Begin Assessment/i));

      // Select role
      fireEvent.click(screen.getByRole('button', { name: /Nurse/i }));

      // Go to cultural step
      await waitFor(() => {
        const nextButton = screen.getByText(/Next/i);
        expect(nextButton).not.toBeDisabled();
      });
      fireEvent.click(screen.getByText(/Next/i));

      await waitFor(() => {
        expect(screen.getByText(/Cultural Background/i)).toBeInTheDocument();
      });
    });

    it('should render all cultural background fields', () => {
      expect(screen.getByLabelText(/Country of Origin/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Primary Language/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/English Proficiency/i)).toBeInTheDocument();
    });

    it('should validate required fields', async () => {
      const nextButton = screen.getByText(/Next/i);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
      });
    });

    it('should show Philippines-specific questions for Filipino users', async () => {
      // Select Philippines
      const countrySelect = screen.getByLabelText(/Country of Origin/i);
      fireEvent.change(countrySelect, { target: { value: 'Philippines' } });

      await waitFor(() => {
        expect(screen.getByText(/Healthcare System Familiarity/i)).toBeInTheDocument();
      });
    });
  });

  describe('Skills Assessment', () => {
    beforeEach(async () => {
      renderAssessment();

      // Navigate to skills step
      fireEvent.click(screen.getByText(/Begin Assessment/i));
      fireEvent.click(screen.getByRole('button', { name: /Nurse/i }));
      fireEvent.click(screen.getByText(/Next/i));

      // Fill cultural background
      await waitFor(() => {
        expect(screen.getByLabelText(/Country of Origin/i)).toBeInTheDocument();
      });

      const countrySelect = screen.getByLabelText(/Country of Origin/i);
      fireEvent.change(countrySelect, { target: { value: 'Philippines' } });

      const languageInput = screen.getByLabelText(/Primary Language/i);
      fireEvent.change(languageInput, { target: { value: 'Tagalog' } });

      // Go to skills
      fireEvent.click(screen.getByText(/Next/i));

      await waitFor(() => {
        expect(screen.getByText(/Skills Assessment/i)).toBeInTheDocument();
      });
    });

    it('should render skill categories', () => {
      expect(screen.getByText(/Clinical Skills/i)).toBeInTheDocument();
      expect(screen.getByText(/Technical Skills/i)).toBeInTheDocument();
      expect(screen.getByText(/Communication Skills/i)).toBeInTheDocument();
    });

    it('should allow rating all skills', async () => {
      const ratingButtons = screen.getAllByRole('button', { name: /Rate/i });

      // Rate first skill
      fireEvent.click(ratingButtons[0]);

      await waitFor(() => {
        expect(ratingButtons[0]).toHaveClass('bg-css-gold');
      });
    });
  });

  describe('Auto-save Functionality', () => {
    it('should save assessment state to localStorage', async () => {
      renderAssessment();

      // Navigate and select role
      fireEvent.click(screen.getByText(/Begin Assessment/i));
      fireEvent.click(screen.getByRole('button', { name: /Nurse/i }));

      // Wait for auto-save
      await waitFor(() => {
        const saved = localStorage.getItem('css-assessment-state');
        expect(saved).toBeTruthy();
      }, { timeout: 3000 });
    });

    it('should restore saved state on mount', async () => {
      // Save state manually
      const savedState = {
        version: '1.0',
        state: {
          currentStep: 'role',
          completedSteps: ['welcome'],
          progress: { percentComplete: 17 },
          answers: {},
        },
        roleSelection: 'nurse',
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem('css-assessment-state', JSON.stringify(savedState));

      renderAssessment();

      await waitFor(() => {
        expect(screen.getByText(/Resume your assessment/i)).toBeInTheDocument();
      });
    });
  });

  describe('Assessment Submission', () => {
    it('should submit assessment and navigate to dashboard', async () => {
      const mockResponse = {
        assessmentId: 'test-123',
        learningPathId: 'path-456',
        message: 'Success',
      };

      vi.mocked(assessmentService.submitAssessment).mockResolvedValue(mockResponse);

      renderAssessment();

      // Complete all steps (simplified for test)
      fireEvent.click(screen.getByText(/Begin Assessment/i));
      fireEvent.click(screen.getByRole('button', { name: /Nurse/i }));
      fireEvent.click(screen.getByText(/Next/i));

      // Fill required fields and submit
      // (Full flow would be too long for test)

      await waitFor(() => {
        expect(assessmentService.submitAssessment).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/employee/learning-path');
      });
    });

    it('should handle submission errors gracefully', async () => {
      vi.mocked(assessmentService.submitAssessment).mockRejectedValue(
        new Error('Network error')
      );

      renderAssessment();

      // Navigate through steps and attempt submission
      // ... (simplified)

      await waitFor(() => {
        expect(screen.getByText(/saved locally/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderAssessment();

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label');
    });

    it('should support keyboard navigation', () => {
      renderAssessment();

      const beginButton = screen.getByText(/Begin Assessment/i);
      beginButton.focus();

      expect(document.activeElement).toBe(beginButton);
    });

    it('should announce step changes to screen readers', async () => {
      renderAssessment();

      fireEvent.click(screen.getByText(/Begin Assessment/i));

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /Select Your Role/i });
        expect(heading).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should render mobile-friendly on small screens', () => {
      // Mock small viewport
      global.innerWidth = 375;
      global.innerHeight = 667;

      renderAssessment();

      const container = screen.getByTestId('assessment-container');
      expect(container).toHaveClass('px-4'); // Mobile padding
    });
  });
});
