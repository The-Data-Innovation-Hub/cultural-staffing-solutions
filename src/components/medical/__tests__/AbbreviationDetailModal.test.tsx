/**
 * Tests for AbbreviationDetailModal Component
 *
 * Test Coverage:
 * - Modal rendering and visibility
 * - Abbreviation display
 * - Prohibited warning banner
 * - Meanings display in accordion
 * - Danger level badges
 * - Clinical information sections
 * - Safety summary statistics
 * - Report issue functionality with toast
 * - Close button behavior
 * - Keyboard navigation (Escape to close)
 * - Accessibility features
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import AbbreviationDetailModal from '../AbbreviationDetailModal';
import { mockSingleAbbreviation, mockProhibitedAbbreviation } from '@/test/mockData';
import { toast } from 'sonner';

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AbbreviationDetailModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Visibility', () => {
    it('should render when isOpen is true', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={false}
          onClose={mockOnClose}
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Abbreviation Display', () => {
    it('should display the abbreviation prominently', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Should have large title with abbreviation
      const title = screen.getByText('MI');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(/text-5xl/);
    });

    it('should display meanings count', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText(/2 different meanings/i)).toBeInTheDocument();
    });

    it('should display singular "meaning" for single meaning', () => {
      const singleMeaning = [mockSingleAbbreviation.meanings[0]];

      render(
        <AbbreviationDetailModal
          abbreviation="BP"
          meanings={singleMeaning}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText(/1 different meaning/i)).toBeInTheDocument();
    });

    it('should display primary meaning when provided', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
          primaryMeaning="Myocardial Infarction (Heart Attack)"
        />
      );

      expect(screen.getByText('Primary Usage:')).toBeInTheDocument();
      expect(screen.getByText('Myocardial Infarction (Heart Attack)')).toBeInTheDocument();
    });
  });

  describe('Prohibited Warning Banner', () => {
    it('should show warning banner for prohibited abbreviations', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText(/PROHIBITED ABBREVIATION - DO NOT USE/i)).toBeInTheDocument();
      expect(screen.getByText(/Joint Commission/i)).toBeInTheDocument();
    });

    it('should not show warning banner for safe abbreviations', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.queryByText(/PROHIBITED ABBREVIATION/i)).not.toBeInTheDocument();
    });
  });

  describe('Meanings Accordion', () => {
    it('should display all meanings in accordion', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Myocardial Infarction')).toBeInTheDocument();
      expect(screen.getByText('Mitral Insufficiency')).toBeInTheDocument();
    });

    it('should expand accordion item when clicked', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const accordionTrigger = screen.getByText('Myocardial Infarction').closest('button');
      if (accordionTrigger) {
        await user.click(accordionTrigger);

        // Should show detailed description
        await waitFor(() => {
          expect(screen.getByText(/Heart attack caused by blocked blood flow/i)).toBeInTheDocument();
        });
      }
    });

    it('should display danger badges for each meaning', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const safeBadges = screen.getAllByText('SAFE');
      const cautionBadges = screen.getAllByText('CAUTION');

      expect(safeBadges.length + cautionBadges.length).toBeGreaterThan(0);
    });

    it('should apply correct border color based on danger level', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const morphineSulfate = screen.getByText('Morphine Sulfate').closest('div[class*="border"]');
      expect(morphineSulfate).toHaveClass(/border-red-500/);
    });
  });

  describe('Clinical Information Display', () => {
    it('should display region badges', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Expand first accordion
      const accordionTrigger = screen.getByText('Myocardial Infarction').closest('button');
      if (accordionTrigger) {
        await user.click(accordionTrigger);

        await waitFor(() => {
          expect(screen.getByText('Global')).toBeInTheDocument();
        });
      }
    });

    it('should display specialty badges', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const accordionTrigger = screen.getByText('Myocardial Infarction').closest('button');
      if (accordionTrigger) {
        await user.click(accordionTrigger);

        await waitFor(() => {
          expect(screen.getByText('Cardiology')).toBeInTheDocument();
        });
      }
    });

    it('should display clinical examples when present', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const accordionTrigger = screen.getByText('Myocardial Infarction').closest('button');
      if (accordionTrigger) {
        await user.click(accordionTrigger);

        await waitFor(() => {
          expect(screen.getByText('Clinical Example')).toBeInTheDocument();
          expect(screen.getByText(/Patient presented with chest pain/i)).toBeInTheDocument();
        });
      }
    });

    it('should display common misinterpretations when present', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const accordionTrigger = screen.getByText('Morphine Sulfate').closest('button');
      if (accordionTrigger) {
        await user.click(accordionTrigger);

        await waitFor(() => {
          expect(screen.getByText('Common Misinterpretations')).toBeInTheDocument();
        });
      }
    });

    it('should display recommended alternative for prohibited meanings', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const accordionTrigger = screen.getByText('Morphine Sulfate').closest('button');
      if (accordionTrigger) {
        await user.click(accordionTrigger);

        await waitFor(() => {
          expect(screen.getByText('Recommended Alternative')).toBeInTheDocument();
          expect(screen.getByText(/Write "morphine sulfate" in full/i)).toBeInTheDocument();
        });
      }
    });

    it('should display additional notes when present', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const accordionTrigger = screen.getByText('Myocardial Infarction').closest('button');
      if (accordionTrigger) {
        await user.click(accordionTrigger);

        await waitFor(() => {
          expect(screen.getByText(/Most common meaning in cardiology context/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Safety Summary', () => {
    it('should display total meanings count', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Safety Summary')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument(); // MS has 4 meanings
      expect(screen.getByText('Total Meanings')).toBeInTheDocument();
    });

    it('should display prohibited count', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // MS has 2 prohibited meanings
      const prohibitedCounts = screen.getAllByText('2');
      expect(prohibitedCounts.length).toBeGreaterThan(0);
      expect(screen.getByText('Prohibited')).toBeInTheDocument();
    });

    it('should display unique regions count', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Regions')).toBeInTheDocument();
    });
  });

  describe('Report Issue Functionality', () => {
    it('should have Report an Issue button', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Report an Issue')).toBeInTheDocument();
    });

    it('should show toast notification when Report Issue clicked', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const reportButton = screen.getByText('Report an Issue');
      await user.click(reportButton);

      expect(toast.success).toHaveBeenCalledWith(
        'Thank you! Issue reported to administrators.',
        expect.objectContaining({
          description: 'Our team will review your feedback shortly.',
          duration: 4000,
        })
      );
    });

    it('should log abbreviation to console when reporting', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const reportButton = screen.getByText('Report an Issue');
      await user.click(reportButton);

      expect(consoleSpy).toHaveBeenCalledWith('Report issue for abbreviation:', 'MI');

      consoleSpy.mockRestore();
    });
  });

  describe('Close Functionality', () => {
    it('should have close button in header', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
    });

    it('should call onClose when header close button clicked', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText('Close modal');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should have Close button in footer', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButtons = screen.getAllByText('Close');
      expect(closeButtons.length).toBeGreaterThan(0);
    });

    it('should call onClose when footer Close button clicked', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getAllByText('Close')[0];
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when Escape key pressed', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have role="dialog"', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have accessible close button', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Tab through interactive elements
      await user.tab();

      // Should focus on close button or accordion trigger
      expect(document.activeElement).not.toBe(document.body);
    });

    it('should support Enter key on accordion triggers', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const accordionTrigger = screen.getByText('Myocardial Infarction').closest('button');
      if (accordionTrigger) {
        accordionTrigger.focus();
        await user.keyboard('{Enter}');

        await waitFor(() => {
          expect(screen.getByText('Description')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Styling and Animation', () => {
    it('should apply gold gradient to abbreviation text', () => {
      render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const title = screen.getByText('MI');
      expect(title).toHaveClass(/bg-gradient-gold/);
    });

    it('should apply fade-in animation', () => {
      const { container } = render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const dialog = container.querySelector('[class*="fade-in"]');
      expect(dialog).toBeInTheDocument();
    });

    it('should have scrollable content area', () => {
      const { container } = render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const scrollableArea = container.querySelector('[class*="overflow-y-auto"]');
      expect(scrollableArea).toBeInTheDocument();
    });

    it('should apply max height to prevent overflow', () => {
      const { container } = render(
        <AbbreviationDetailModal
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const dialog = container.querySelector('[class*="max-h-"]');
      expect(dialog).toBeInTheDocument();
    });
  });
});
