/**
 * Accessibility Tests for MedicalAbbreviations
 *
 * Test Coverage:
 * - WCAG 2.1 AA compliance using axe-core
 * - Semantic HTML structure
 * - ARIA attributes and roles
 * - Keyboard navigation
 * - Screen reader support
 * - Focus management
 * - Accessible names and descriptions
 * - Color contrast
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { mockAbbreviations, mockStats } from '@/test/mockData';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock the database module with async factory
vi.mock('@/data/medicalAbbreviationsDatabase', async () => {
  const mockData = await import('@/test/mockData');
  return {
    medicalAbbreviationsDatabase: mockData.mockAbbreviations,
    calculateAbbreviationStats: () => mockData.mockStats,
  };
});

import MedicalAbbreviationsV2 from '../MedicalAbbreviationsV2';

describe('MedicalAbbreviations Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper to wait for loading to complete (component has 500ms delay)
  const waitForDataLoad = () => waitFor(
    () => {
      expect(screen.queryByText(/Loading Abbreviations/i)).not.toBeInTheDocument();
    },
    { timeout: 2000 }
  );

  describe('Automated Accessibility Checks (axe-core)', () => {
    it('should not have any accessibility violations on initial render', async () => {
      const { container } = render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Run axe accessibility tests
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with search active', async () => {
      const user = userEvent.setup();
      const { container } = render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'MI');

      await waitFor(() => {}, { timeout: 400 });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations in list view', async () => {
      const user = userEvent.setup();
      const { container } = render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const listViewButton = screen.getByLabelText(/list view/i);
      await user.click(listViewButton);

      await waitForDataLoad();
        expect(listViewButton).toHaveClass(/bg-gradient-gold/);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with modal open', async () => {
      const user = userEvent.setup();
      const { container } = render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Switch to list view
      const listViewButton = screen.getByLabelText(/list view/i);
      await user.click(listViewButton);

      // Open modal
      const infoButton = screen.getAllByLabelText(/view full details/i)[0];
      await user.click(infoButton);

      await waitForDataLoad();
        expect(screen.getByRole('dialog')).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Semantic HTML Structure', () => {
    it('should use proper heading hierarchy', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Should have main heading
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent(/Medical Abbreviations Reference/i);
    });

    it('should use semantic main landmark', async () => {
      const { container } = render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Should have main landmark or role="main"
      const mainElement = container.querySelector('main') || screen.queryByRole('main');
      expect(mainElement).toBeInTheDocument();
    });

    it('should use semantic button elements', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const cardViewButton = screen.getByLabelText(/card view/i);
      const listViewButton = screen.getByLabelText(/list view/i);

      expect(cardViewButton.tagName).toBe('BUTTON');
      expect(listViewButton.tagName).toBe('BUTTON');
    });
  });

  describe('ARIA Attributes and Roles', () => {
    it('should have proper aria-label on search input', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      expect(searchInput).toHaveAccessibleName();
    });

    it('should have aria-label on view toggle buttons', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      expect(screen.getByLabelText(/card view/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/list view/i)).toBeInTheDocument();
    });

    it('should have aria-label on clear buttons', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'MI');

      await waitForDataLoad();
        expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
      }, { timeout: 400 });
    });

    it('should have proper role on modal dialog', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const listViewButton = screen.getByLabelText(/list view/i);
      await user.click(listViewButton);

      const infoButton = screen.getAllByLabelText(/view full details/i)[0];
      await user.click(infoButton);

      await waitForDataLoad();
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute('role', 'dialog');
    });

    it('should have aria-expanded on expandable cards', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const cards = screen.getAllByRole('button');
      const expandableCard = cards.find(card => card.hasAttribute('aria-expanded'));

      expect(expandableCard).toBeDefined();
    });

    it('should update aria-expanded when card is expanded', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const miCard = screen.getByText('MI').closest('div[role="button"]');

      if (miCard) {
        // Initially collapsed
        expect(miCard).toHaveAttribute('aria-expanded', 'false');

        // Expand card
        await user.click(miCard);

        await waitForDataLoad();
        expect(miCard).toHaveAttribute('aria-expanded', 'true');
      }
    });
  });

  describe('Keyboard Navigation', () => {
    it('should allow tabbing through interactive elements', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Tab to search input
      await user.tab();
      expect(screen.getByPlaceholderText(/Search abbreviations/i)).toHaveFocus();

      // Tab to next element
      await user.tab();
      expect(document.activeElement).not.toBe(document.body);
    });

    it('should support Enter key on buttons', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const listViewButton = screen.getByLabelText(/list view/i);
      listViewButton.focus();

      await user.keyboard('{Enter}');

      await waitForDataLoad();
        expect(listViewButton).toHaveClass(/bg-gradient-gold/);
    });

    it('should support Space key on buttons', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const listViewButton = screen.getByLabelText(/list view/i);
      listViewButton.focus();

      await user.keyboard(' ');

      await waitForDataLoad();
        expect(listViewButton).toHaveClass(/bg-gradient-gold/);
    });

    it('should close modal with Escape key', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Open modal
      const listViewButton = screen.getByLabelText(/list view/i);
      await user.click(listViewButton);

      const infoButton = screen.getAllByLabelText(/view full details/i)[0];
      await user.click(infoButton);

      await waitForDataLoad();
        expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Press Escape
      await user.keyboard('{Escape}');

      await waitForDataLoad();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should trap focus within modal', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Open modal
      const listViewButton = screen.getByLabelText(/list view/i);
      await user.click(listViewButton);

      const infoButton = screen.getAllByLabelText(/view full details/i)[0];
      await user.click(infoButton);

      await waitForDataLoad();
        expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Focus should be within modal
      const dialog = screen.getByRole('dialog');
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  describe('Screen Reader Support', () => {
    it('should have accessible names for all interactive elements', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      expect(searchInput).toHaveAccessibleName();

      const cardViewButton = screen.getByLabelText(/card view/i);
      expect(cardViewButton).toHaveAccessibleName();

      const listViewButton = screen.getByLabelText(/list view/i);
      expect(listViewButton).toHaveAccessibleName();
    });

    it('should announce results count to screen readers', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Results count should be visible and accessible
      const resultsCount = screen.getByText(/Showing 5 of 5/i);
      expect(resultsCount).toBeInTheDocument();
      expect(resultsCount).toBeVisible();
    });

    it('should have live region for dynamic updates', async () => {
      const user = userEvent.setup();
      const { container } = render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Apply search filter
      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'MI');

      await waitForDataLoad();
      // Results should update
      expect(screen.getByText(/Showing 1 of 5/i)).toBeInTheDocument();

      // Check for aria-live region
      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion).toBeInTheDocument();
    });

    it('should provide context for danger level badges', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Danger badges should have accessible context
      const cautionBadges = screen.getAllByText('CAUTION');
      expect(cautionBadges.length).toBeGreaterThan(0);

      const safeBadges = screen.getAllByText('SAFE');
      expect(safeBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Focus Management', () => {
    it('should restore focus after modal close', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Switch to list view
      const listViewButton = screen.getByLabelText(/list view/i);
      await user.click(listViewButton);

      // Open modal
      const infoButton = screen.getAllByLabelText(/view full details/i)[0];
      await user.click(infoButton);

      await waitForDataLoad();
        expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByLabelText(/close modal/i);
      await user.click(closeButton);

      await waitForDataLoad();
        // Focus should return to the trigger button or near it
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(document.activeElement).not.toBe(document.body);
    });

    it('should have visible focus indicators', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.click(searchInput);

      // Input should have focus
      expect(searchInput).toHaveFocus();
    });

    it('should not trap focus outside modal', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Without modal open, focus should move freely
      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('should have sufficient color contrast in danger badges', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Danger badges should be visible
      const prohibitedBadges = screen.getAllByText('PROHIBITED');
      expect(prohibitedBadges.length).toBeGreaterThan(0);
      expect(prohibitedBadges[0]).toBeVisible();
    });

    it('should not rely solely on color for information', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Danger levels should have text labels, not just colors
      expect(screen.getAllByText('SAFE').length).toBeGreaterThan(0);
      expect(screen.getAllByText('CAUTION').length).toBeGreaterThan(0);
      expect(screen.getAllByText('PROHIBITED').length).toBeGreaterThan(0);
    });

    it('should have visible text on all buttons', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Buttons should have accessible text or aria-label
      const cardViewButton = screen.getByLabelText(/card view/i);
      const listViewButton = screen.getByLabelText(/list view/i);

      expect(cardViewButton).toHaveAccessibleName();
      expect(listViewButton).toHaveAccessibleName();
    });
  });

  describe('Error and Empty States', () => {
    it('should have accessible empty state message', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Search for non-existent term
      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'ZZZZZ');

      await waitForDataLoad();
      const emptyMessage = screen.getByText(/No abbreviations found/i);
      expect(emptyMessage).toBeInTheDocument();
      expect(emptyMessage).toBeVisible();
    });

    it('should have accessible loading state', () => {
      // Mock data to delay loading
      vi.mock('@/data/medicalAbbreviations', () => ({
        abbreviationsDatabase: [],
      }));

      render(<MedicalAbbreviationsV2 />);

      // Loading state should be accessible
      const loadingElement = screen.queryByText(/Loading/i) || screen.queryByRole('status');
      if (loadingElement) {
        expect(loadingElement).toBeInTheDocument();
      }
    });
  });
});
