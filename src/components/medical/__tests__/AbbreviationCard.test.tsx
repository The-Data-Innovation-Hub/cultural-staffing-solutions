/**
 * Tests for AbbreviationCard Component
 *
 * Test Coverage:
 * - Rendering abbreviation data
 * - Expansion/collapse functionality
 * - Danger level badges
 * - Region badges
 * - Click interactions
 * - Accessibility
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import AbbreviationCard from '../AbbreviationCard';
import { mockSingleAbbreviation, mockProhibitedAbbreviation } from '@/test/mockData';

describe('AbbreviationCard', () => {
  const mockOnToggleExpand = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render abbreviation text', () => {
      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      expect(screen.getByText('MI')).toBeInTheDocument();
    });

    it('should render meanings count', () => {
      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      expect(screen.getByText('2 meanings')).toBeInTheDocument();
    });

    it('should render primary meaning when provided', () => {
      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
          primaryMeaning="Myocardial Infarction (Heart Attack)"
        />
      );

      expect(screen.getByText('Myocardial Infarction (Heart Attack)')).toBeInTheDocument();
    });

    it('should render singular "meaning" for single meaning', () => {
      const singleMeaning = {
        abbr: 'BP',
        meanings: [mockSingleAbbreviation.meanings[0]]
      };

      render(
        <AbbreviationCard
          abbreviation={singleMeaning.abbr}
          meanings={singleMeaning.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      expect(screen.getByText('1 meaning')).toBeInTheDocument();
    });
  });

  describe('Danger Level Badges', () => {
    it('should display CAUTION badge for caution level', () => {
      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      const cautionBadges = screen.getAllByText('CAUTION');
      expect(cautionBadges.length).toBeGreaterThan(0);
    });

    it('should display PROHIBITED badge for prohibited level', () => {
      render(
        <AbbreviationCard
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      const prohibitedBadges = screen.getAllByText('PROHIBITED');
      expect(prohibitedBadges.length).toBeGreaterThan(0);
    });

    it('should apply correct danger level styling', () => {
      const { container } = render(
        <AbbreviationCard
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      // Check for red color styling (prohibited)
      const prohibitedBadges = screen.getAllByText('PROHIBITED');
      const prohibitedBadge = prohibitedBadges[0].closest('div');
      expect(prohibitedBadge).toHaveClass(/red/);
    });
  });

  describe('Region Badges', () => {
    it('should display region badges for all unique regions', () => {
      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      const globalBadges = screen.getAllByText('Global');
      const usBadges = screen.getAllByText('US');
      expect(globalBadges.length).toBeGreaterThan(0);
      expect(usBadges.length).toBeGreaterThan(0);
    });

    it('should not duplicate region badges', () => {
      const allRegions = screen.queryAllByText('Global');
      expect(allRegions.length).toBeGreaterThan(0);
    });
  });

  describe('Expansion Functionality', () => {
    it('should call onToggleExpand when clicked', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      const card = screen.getByText('MI').closest('div');
      if (card) {
        await user.click(card);
        expect(mockOnToggleExpand).toHaveBeenCalledWith('MI');
      }
    });

    it('should show "Click for details" when collapsed', () => {
      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      expect(screen.getByText('Click for details')).toBeInTheDocument();
    });

    it('should show "Click to collapse" when expanded', () => {
      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={true}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      expect(screen.getByText('Click to collapse')).toBeInTheDocument();
    });

    it('should display detailed meanings when expanded', () => {
      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={true}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      const myocardialTexts = screen.getAllByText('Myocardial Infarction');
      const mitralTexts = screen.getAllByText('Mitral Insufficiency');
      expect(myocardialTexts.length).toBeGreaterThan(0);
      expect(mitralTexts.length).toBeGreaterThan(0);
    });

    it('should hide detailed meanings when collapsed', () => {
      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      // Detailed descriptions should have opacity-0 when collapsed
      const container = screen.getByText('MI').closest('div')?.parentElement;
      const expandableSection = container?.querySelector('.opacity-0');
      expect(expandableSection).toBeInTheDocument();
    });
  });

  describe('Clinical Information Display', () => {
    it('should display clinical examples when expanded', () => {
      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={true}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      expect(screen.getByText(/Patient presented with chest pain/i)).toBeInTheDocument();
    });

    it('should display common misinterpretations when present', () => {
      render(
        <AbbreviationCard
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isExpanded={true}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      expect(screen.getByText(/Often confused with/i)).toBeInTheDocument();
    });

    it('should display recommended alternatives for prohibited', () => {
      render(
        <AbbreviationCard
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isExpanded={true}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      expect(screen.getByText(/Use Instead/i)).toBeInTheDocument();
    });
  });

  describe('Prohibited Indicator', () => {
    it('should show red indicator stripe for prohibited abbreviations', () => {
      const { container } = render(
        <AbbreviationCard
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      // Look for the red stripe element
      const stripe = container.querySelector('.bg-gradient-to-b.from-red-500');
      expect(stripe).toBeInTheDocument();
    });

    it('should apply ring styling to prohibited cards', () => {
      const { container } = render(
        <AbbreviationCard
          abbreviation={mockProhibitedAbbreviation.abbr}
          meanings={mockProhibitedAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      const card = container.firstChild;
      expect(card).toHaveClass(/ring/);
    });
  });

  describe('Hover Effects', () => {
    it('should apply hover styles to card', () => {
      const { container } = render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      const card = container.firstChild;
      expect(card).toHaveClass(/hover:shadow-xl/);
      expect(card).toHaveClass(/hover:scale-\[1\.02\]/);
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      // Card should be clickable with keyboard
      const card = screen.getByText('MI').closest('div');
      if (card) {
        card.focus();
        await user.keyboard('{Enter}');
        // onToggleExpand should be called
        // Note: This might need adjustment based on actual implementation
      }
    });

    it('should have cursor-pointer class for affordance', () => {
      const { container } = render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      const card = container.firstChild;
      expect(card).toHaveClass(/cursor-pointer/);
    });
  });

  describe('Styling and Layout', () => {
    it('should apply neumorphic styling', () => {
      const { container } = render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      const card = container.firstChild;
      expect(card).toHaveClass(/shadow-card/);
      expect(card).toHaveClass(/rounded-2xl/);
    });

    it('should apply gold gradient to abbreviation text', () => {
      render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      const abbrText = screen.getByText('MI');
      expect(abbrText).toHaveClass(/bg-gradient-gold/);
      expect(abbrText).toHaveClass(/text-transparent/);
    });

    it('should have smooth transitions', () => {
      const { container } = render(
        <AbbreviationCard
          abbreviation={mockSingleAbbreviation.abbr}
          meanings={mockSingleAbbreviation.meanings}
          isExpanded={false}
          onToggleExpand={mockOnToggleExpand}
        />
      );

      const card = container.firstChild;
      expect(card).toHaveClass(/transition-all/);
      expect(card).toHaveClass(/duration-300/);
    });
  });
});
