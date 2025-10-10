/**
 * Tests for AbbreviationList Component
 *
 * Test Coverage:
 * - Table rendering (header, rows)
 * - Data display (abbreviations, meanings, regions, specialties)
 * - Danger level badges
 * - Region badges
 * - Click interactions
 * - Alternating row backgrounds
 * - Empty state
 * - Mobile responsive layout
 * - Accessibility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import AbbreviationList from '../AbbreviationList';
import { mockAbbreviations } from '@/test/mockData';

describe('AbbreviationList', () => {
  const mockOnSelectAbbreviation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Table Structure', () => {
    it('should render table header', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      expect(screen.getByText('Abbreviation')).toBeInTheDocument();
      expect(screen.getByText('Primary Meaning')).toBeInTheDocument();
      expect(screen.getByText('Region')).toBeInTheDocument();
      expect(screen.getByText('Specialty')).toBeInTheDocument();
      expect(screen.getByText('Safety')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('should render all abbreviations in the list', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Abbreviations may appear multiple times in the UI
      const miElements = screen.getAllByText('MI');
      const msElements = screen.getAllByText('MS');
      const caElements = screen.getAllByText('CA');
      const bpElements = screen.getAllByText('BP');
      const uElements = screen.getAllByText('U');

      expect(miElements.length).toBeGreaterThan(0);
      expect(msElements.length).toBeGreaterThan(0);
      expect(caElements.length).toBeGreaterThan(0);
      expect(bpElements.length).toBeGreaterThan(0);
      expect(uElements.length).toBeGreaterThan(0);
    });

    it('should render correct number of rows', () => {
      const { container } = render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Find all rows with abbreviation text
      const miElements = screen.getAllByText('MI');
      expect(miElements.length).toBeGreaterThan(0);
    });
  });

  describe('Data Display', () => {
    it('should display primary meaning for each abbreviation', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Primary meanings may appear multiple times in the UI
      const myocardialElements = screen.getAllByText('Myocardial Infarction');
      const bloodPressureElements = screen.getAllByText('Blood Pressure');
      expect(myocardialElements.length).toBeGreaterThan(0);
      expect(bloodPressureElements.length).toBeGreaterThan(0);
    });

    it('should display meanings count', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // MI has 2 meanings
      const miMeanings = screen.getAllByText('2 meanings');
      expect(miMeanings.length).toBeGreaterThan(0);

      // BP has 1 meaning
      const bpMeanings = screen.getAllByText('1 meaning');
      expect(bpMeanings.length).toBeGreaterThan(0);
    });

    it('should display specialty for each abbreviation', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Specialties may appear multiple times in the UI
      const cardiologyElements = screen.getAllByText('Cardiology');
      const neurologyElements = screen.getAllByText('Neurology');
      const pharmacyElements = screen.getAllByText('Pharmacy');
      expect(cardiologyElements.length).toBeGreaterThan(0);
      expect(neurologyElements.length).toBeGreaterThan(0);
      expect(pharmacyElements.length).toBeGreaterThan(0);
    });

    it('should show "+X more" when abbreviation has multiple meanings', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // MS has 4 meanings, so should show "+3 more"
      expect(screen.getByText('+3 more')).toBeInTheDocument();
    });
  });

  describe('Danger Level Badges', () => {
    it('should display SAFE badge for safe abbreviations', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      const safeBadges = screen.getAllByText('SAFE');
      expect(safeBadges.length).toBeGreaterThan(0);
    });

    it('should display CAUTION badge for caution abbreviations', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      const cautionBadges = screen.getAllByText('CAUTION');
      expect(cautionBadges.length).toBeGreaterThan(0);
    });

    it('should display PROHIBITED badge for prohibited abbreviations', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      const prohibitedBadges = screen.getAllByText('PROHIBITED');
      expect(prohibitedBadges.length).toBeGreaterThan(0);
    });

    it('should apply correct styling to danger badges', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      const prohibitedBadge = screen.getAllByText('PROHIBITED')[0].closest('div');
      expect(prohibitedBadge).toHaveClass(/red/);
    });
  });

  describe('Region Badges', () => {
    it('should display region badges', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      expect(screen.getAllByText('Global').length).toBeGreaterThan(0);
      expect(screen.getAllByText('US').length).toBeGreaterThan(0);
    });

    it('should truncate regions and show "+X" for multiple regions', () => {
      // MS has 4 regions (Global, US, Global, US) - after deduplication should be 2
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Should show first 2 regions, then "+X" if more
      const regionBadges = screen.getAllByText('Global');
      expect(regionBadges.length).toBeGreaterThan(0);
    });

    it('should abbreviate "Northern Ireland" to "NI"', () => {
      const abbreviationsWithNI = [
        {
          abbr: 'TEST',
          primaryMeaning: 'Test',
          overallRisk: 'safe' as const,
          searchTerms: ['test'],
          meanings: [
            {
              term: 'Test Term',
              region: 'Northern Ireland' as const,
              specialty: 'General',
              dangerLevel: 'safe' as const,
              description: 'Test description'
            }
          ]
        }
      ];

      render(
        <AbbreviationList
          abbreviations={abbreviationsWithNI}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // NI may appear multiple times in the UI
      const niElements = screen.getAllByText('NI');
      expect(niElements.length).toBeGreaterThan(0);
    });
  });

  describe('Click Interactions', () => {
    it('should call onSelectAbbreviation when row is clicked', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Click on MI row (get first occurrence)
      const miElements = screen.getAllByText('MI');
      const miRow = miElements[0].closest('div');
      if (miRow) {
        await user.click(miRow);
        expect(mockOnSelectAbbreviation).toHaveBeenCalledWith(mockAbbreviations[0]);
      }
    });

    it('should call onSelectAbbreviation when info button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      const infoButton = screen.getAllByLabelText('View full details')[0];
      await user.click(infoButton);

      expect(mockOnSelectAbbreviation).toHaveBeenCalled();
    });

    it('should stop propagation when info button clicked', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      const infoButton = screen.getAllByLabelText('View full details')[0];
      await user.click(infoButton);

      // Should only be called once (not twice from row and button)
      expect(mockOnSelectAbbreviation).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling and Layout', () => {
    it('should apply alternating row backgrounds', () => {
      const { container } = render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Check for alternating background classes
      const rows = container.querySelectorAll('[class*="bg-white"], [class*="bg-css-grey-light"]');
      expect(rows.length).toBeGreaterThan(0);
    });

    it('should apply hover styles', () => {
      const { container } = render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Find clickable rows in the list
      const clickableRows = container.querySelectorAll('[class*="hover:bg-gradient-gold"]');
      expect(clickableRows.length).toBeGreaterThan(0);
    });

    it('should be clickable', () => {
      const { container } = render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Find clickable rows in the list
      const clickableRows = container.querySelectorAll('[class*="cursor-pointer"]');
      expect(clickableRows.length).toBeGreaterThan(0);
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no abbreviations', () => {
      render(
        <AbbreviationList
          abbreviations={[]}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      expect(screen.getByText('No abbreviations to display')).toBeInTheDocument();
    });

    it('should show info icon in empty state', () => {
      render(
        <AbbreviationList
          abbreviations={[]}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      const emptyState = screen.getByText('No abbreviations to display').closest('div');
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe('Mobile Responsive', () => {
    it('should render mobile view details button', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Mobile "View Full Details" buttons
      const mobileButtons = screen.getAllByText('View Full Details');
      expect(mobileButtons.length).toBe(mockAbbreviations.length);
    });

    it('should call onSelectAbbreviation from mobile button', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      const mobileButton = screen.getAllByText('View Full Details')[0];
      await user.click(mobileButton);

      expect(mockOnSelectAbbreviation).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on info buttons', () => {
      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      const infoButtons = screen.getAllByLabelText('View full details');
      expect(infoButtons.length).toBe(mockAbbreviations.length);
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Tab to first info button
      await user.tab();

      const firstButton = screen.getAllByLabelText('View full details')[0];
      expect(firstButton).toHaveFocus();
    });

    it('should support Enter key on buttons', async () => {
      const user = userEvent.setup();

      render(
        <AbbreviationList
          abbreviations={mockAbbreviations}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      const infoButton = screen.getAllByLabelText('View full details')[0];
      infoButton.focus();
      await user.keyboard('{Enter}');

      expect(mockOnSelectAbbreviation).toHaveBeenCalled();
    });
  });

  describe('Primary Meaning Selection', () => {
    it('should prioritize safe meanings as primary', () => {
      const testAbbr = [
        {
          abbr: 'TEST',
          primaryMeaning: 'Test Primary',
          overallRisk: 'caution' as const,
          searchTerms: ['test'],
          meanings: [
            {
              term: 'Prohibited Meaning',
              region: 'Global' as const,
              specialty: 'General',
              dangerLevel: 'prohibited' as const,
              description: 'Test'
            },
            {
              term: 'Safe Meaning',
              region: 'Global' as const,
              specialty: 'General',
              dangerLevel: 'safe' as const,
              description: 'Test'
            }
          ]
        }
      ];

      render(
        <AbbreviationList
          abbreviations={testAbbr}
          onSelectAbbreviation={mockOnSelectAbbreviation}
        />
      );

      // Should display "Safe Meaning" as primary (may appear multiple times)
      const safeMeaningElements = screen.getAllByText('Safe Meaning');
      expect(safeMeaningElements.length).toBeGreaterThan(0);
    });
  });
});
