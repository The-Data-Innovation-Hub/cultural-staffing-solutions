/**
 * Tests for SearchFilters Component
 *
 * Test Coverage:
 * - Search input rendering and interaction
 * - Debounced search functionality
 * - Clear search button
 * - Filter dropdown rendering
 * - Filter selection and callbacks
 * - Active filter styling (gold gradient)
 * - View mode toggle
 * - Active filter tags display
 * - Individual filter tag removal
 * - Clear all filters functionality
 * - Results count display
 * - No results message
 * - Accessibility features
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import SearchFilters from '../SearchFilters';

describe('SearchFilters', () => {
  const mockProps = {
    searchTerm: '',
    onSearchChange: vi.fn(),
    selectedRegion: 'All',
    onRegionChange: vi.fn(),
    selectedSpecialty: 'All',
    onSpecialtyChange: vi.fn(),
    selectedDangerLevel: 'All',
    onDangerLevelChange: vi.fn(),
    viewMode: 'card' as const,
    onViewModeChange: vi.fn(),
    totalResults: 100,
    filteredResults: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Search Input', () => {
    it('should render search input', () => {
      render(<SearchFilters {...mockProps} />);

      const searchInput = screen.getByPlaceholderText(
        /Search abbreviations, terms, or descriptions/i
      );
      expect(searchInput).toBeInTheDocument();
    });

    it('should display search term from props', () => {
      render(<SearchFilters {...mockProps} searchTerm="MI" />);

      const searchInput = screen.getByDisplayValue('MI');
      expect(searchInput).toBeInTheDocument();
    });

    it('should update input value when user types', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} />);

      const searchInput = screen.getByPlaceholderText(
        /Search abbreviations, terms, or descriptions/i
      );

      await user.type(searchInput, 'test');

      expect(searchInput).toHaveValue('test');
    });

    it('should debounce search callback (300ms)', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} />);

      const searchInput = screen.getByPlaceholderText(
        /Search abbreviations, terms, or descriptions/i
      );

      await user.type(searchInput, 'MI');

      // Should not call immediately
      expect(mockProps.onSearchChange).not.toHaveBeenCalled();

      // Wait for debounce
      await waitFor(
        () => {
          expect(mockProps.onSearchChange).toHaveBeenCalledWith('MI');
        },
        { timeout: 500 }
      );
    });

    it('should apply neumorphic inset shadow styling', () => {
      const { container } = render(<SearchFilters {...mockProps} />);

      const searchContainer = container.querySelector('[style*="inset"]');
      expect(searchContainer).toBeInTheDocument();
    });

    it('should show search icon', () => {
      render(<SearchFilters {...mockProps} />);

      const searchIcon = document.querySelector('svg[class*="lucide-search"]');
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe('Clear Search Button', () => {
    it('should not show clear button when search is empty', () => {
      render(<SearchFilters {...mockProps} searchTerm="" />);

      const clearButton = screen.queryByLabelText('Clear search');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should show clear button when search has text', () => {
      render(<SearchFilters {...mockProps} searchTerm="MI" />);

      // May have multiple clear buttons
      const clearButtons = screen.getAllByLabelText('Clear search');
      expect(clearButtons.length).toBeGreaterThan(0);
    });

    it('should clear search when clear button clicked', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} searchTerm="MI" />);

      // Get first clear button
      const clearButtons = screen.getAllByLabelText('Clear search');
      await user.click(clearButtons[0]);

      expect(mockProps.onSearchChange).toHaveBeenCalledWith('');
    });
  });

  describe('Filter Dropdowns', () => {
    it('should render all three filter dropdowns', () => {
      render(<SearchFilters {...mockProps} />);

      // Check for filter triggers (may appear multiple times)
      const regionElements = screen.getAllByText('Region');
      const specialtyElements = screen.getAllByText('Specialty');
      const safetyElements = screen.getAllByText('Safety Level');

      expect(regionElements.length).toBeGreaterThan(0);
      expect(specialtyElements.length).toBeGreaterThan(0);
      expect(safetyElements.length).toBeGreaterThan(0);
    });

    it('should display selected region', () => {
      render(<SearchFilters {...mockProps} selectedRegion="US" />);

      expect(screen.getByText('US')).toBeInTheDocument();
    });

    it('should display selected specialty', () => {
      render(<SearchFilters {...mockProps} selectedSpecialty="Cardiology" />);

      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });

    it('should display selected danger level', () => {
      render(<SearchFilters {...mockProps} selectedDangerLevel="Prohibited" />);

      expect(screen.getByText('Prohibited')).toBeInTheDocument();
    });

    it('should call onRegionChange when region selected', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} />);

      // Get first region trigger
      const regionTriggers = screen.getAllByText('Region');
      await user.click(regionTriggers[0]);

      // Select US option
      const usOptions = await screen.findAllByText('US');
      await user.click(usOptions[0]);

      expect(mockProps.onRegionChange).toHaveBeenCalledWith('US');
    });

    it('should call onSpecialtyChange when specialty selected', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} />);

      // Get first specialty trigger
      const specialtyTriggers = screen.getAllByText('Specialty');
      await user.click(specialtyTriggers[0]);

      // Select Cardiology option
      const cardiologyOptions = await screen.findAllByText('Cardiology');
      await user.click(cardiologyOptions[0]);

      expect(mockProps.onSpecialtyChange).toHaveBeenCalledWith('Cardiology');
    });

    it('should call onDangerLevelChange when danger level selected', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} />);

      // Get first safety level trigger
      const dangerTriggers = screen.getAllByText('Safety Level');
      await user.click(dangerTriggers[0]);

      // Select Prohibited option
      const prohibitedOptions = await screen.findAllByText('Prohibited');
      await user.click(prohibitedOptions[0]);

      expect(mockProps.onDangerLevelChange).toHaveBeenCalledWith('Prohibited');
    });
  });

  describe('Active Filter Styling', () => {
    it('should apply gold gradient to active region filter', () => {
      render(<SearchFilters {...mockProps} selectedRegion="US" />);

      const regionTrigger = screen.getByText('US').closest('button');
      expect(regionTrigger).toHaveClass(/bg-gradient-gold/);
    });

    it('should apply gold gradient to active specialty filter', () => {
      render(<SearchFilters {...mockProps} selectedSpecialty="Cardiology" />);

      const specialtyTrigger = screen.getByText('Cardiology').closest('button');
      expect(specialtyTrigger).toHaveClass(/bg-gradient-gold/);
    });

    it('should apply gold gradient to active danger level filter', () => {
      render(<SearchFilters {...mockProps} selectedDangerLevel="Prohibited" />);

      const dangerTrigger = screen.getByText('Prohibited').closest('button');
      expect(dangerTrigger).toHaveClass(/bg-gradient-gold/);
    });

    it('should not apply gold gradient when filter is "All"', () => {
      render(<SearchFilters {...mockProps} selectedRegion="All" />);

      // Get first region trigger
      const regionTriggers = screen.getAllByText('Region');
      const regionTrigger = regionTriggers[0].closest('button');
      // Check that it doesn't have gold gradient class
      const hasGoldGradient = regionTrigger?.className.includes('bg-gradient-gold');
      expect(hasGoldGradient).toBeFalsy();
    });
  });

  describe('View Mode Toggle', () => {
    it('should render card and list view buttons', () => {
      render(<SearchFilters {...mockProps} />);

      expect(screen.getByLabelText('Card view')).toBeInTheDocument();
      expect(screen.getByLabelText('List view')).toBeInTheDocument();
    });

    it('should highlight active view mode', () => {
      render(<SearchFilters {...mockProps} viewMode="card" />);

      const cardButton = screen.getByLabelText('Card view');
      expect(cardButton).toHaveClass(/bg-gradient-gold/);
    });

    it('should call onViewModeChange when card view clicked', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} viewMode="list" />);

      const cardButton = screen.getByLabelText('Card view');
      await user.click(cardButton);

      expect(mockProps.onViewModeChange).toHaveBeenCalledWith('card');
    });

    it('should call onViewModeChange when list view clicked', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} viewMode="card" />);

      const listButton = screen.getByLabelText('List view');
      await user.click(listButton);

      expect(mockProps.onViewModeChange).toHaveBeenCalledWith('list');
    });
  });

  describe('Active Filter Tags', () => {
    it('should not show filter tags when no filters active', () => {
      render(<SearchFilters {...mockProps} />);

      expect(screen.queryByText(/Clear all filters/i)).not.toBeInTheDocument();
    });

    it('should show search term tag when search is active', () => {
      render(<SearchFilters {...mockProps} searchTerm="MI" />);

      expect(screen.getByText('Search: "MI"')).toBeInTheDocument();
    });

    it('should show region tag when region filter is active', () => {
      render(<SearchFilters {...mockProps} selectedRegion="US" />);

      expect(screen.getByText('Region: US')).toBeInTheDocument();
    });

    it('should show specialty tag when specialty filter is active', () => {
      render(<SearchFilters {...mockProps} selectedSpecialty="Cardiology" />);

      expect(screen.getByText('Specialty: Cardiology')).toBeInTheDocument();
    });

    it('should show danger level tag when danger filter is active', () => {
      render(<SearchFilters {...mockProps} selectedDangerLevel="Prohibited" />);

      expect(screen.getByText('Safety: Prohibited')).toBeInTheDocument();
    });

    it('should show all active filter tags simultaneously', () => {
      render(
        <SearchFilters
          {...mockProps}
          searchTerm="MI"
          selectedRegion="US"
          selectedSpecialty="Cardiology"
          selectedDangerLevel="Prohibited"
        />
      );

      expect(screen.getByText('Search: "MI"')).toBeInTheDocument();
      expect(screen.getByText('Region: US')).toBeInTheDocument();
      expect(screen.getByText('Specialty: Cardiology')).toBeInTheDocument();
      expect(screen.getByText('Safety: Prohibited')).toBeInTheDocument();
    });
  });

  describe('Individual Filter Removal', () => {
    it('should clear search when search tag remove clicked', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} searchTerm="MI" />);

      const removeButton = screen.getAllByLabelText('Clear search')[0];
      await user.click(removeButton);

      expect(mockProps.onSearchChange).toHaveBeenCalledWith('');
    });

    it('should clear region when region tag remove clicked', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} selectedRegion="US" />);

      const removeButton = screen.getByLabelText('Clear region filter');
      await user.click(removeButton);

      expect(mockProps.onRegionChange).toHaveBeenCalledWith('All');
    });

    it('should clear specialty when specialty tag remove clicked', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} selectedSpecialty="Cardiology" />);

      const removeButton = screen.getByLabelText('Clear specialty filter');
      await user.click(removeButton);

      expect(mockProps.onSpecialtyChange).toHaveBeenCalledWith('All');
    });

    it('should clear danger level when danger tag remove clicked', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} selectedDangerLevel="Prohibited" />);

      const removeButton = screen.getByLabelText('Clear safety level filter');
      await user.click(removeButton);

      expect(mockProps.onDangerLevelChange).toHaveBeenCalledWith('All');
    });
  });

  describe('Clear All Filters', () => {
    it('should show clear all button when filters are active', () => {
      render(<SearchFilters {...mockProps} searchTerm="MI" />);

      expect(screen.getByText(/Clear all filters/i)).toBeInTheDocument();
    });

    it('should clear all filters when clear all clicked', async () => {
      const user = userEvent.setup();

      render(
        <SearchFilters
          {...mockProps}
          searchTerm="MI"
          selectedRegion="US"
          selectedSpecialty="Cardiology"
          selectedDangerLevel="Prohibited"
        />
      );

      const clearAllButton = screen.getByText(/Clear all filters/i);
      await user.click(clearAllButton);

      expect(mockProps.onSearchChange).toHaveBeenCalledWith('');
      expect(mockProps.onRegionChange).toHaveBeenCalledWith('All');
      expect(mockProps.onSpecialtyChange).toHaveBeenCalledWith('All');
      expect(mockProps.onDangerLevelChange).toHaveBeenCalledWith('All');
    });
  });

  describe('Results Count Display', () => {
    it('should display results count when results exist', () => {
      render(<SearchFilters {...mockProps} filteredResults={50} totalResults={100} />);

      // Text may appear multiple times or be broken across elements
      const showingElements = screen.getAllByText('Showing');
      const abbreviationsElements = screen.getAllByText('abbreviations');

      expect(showingElements.length).toBeGreaterThan(0);
      expect(abbreviationsElements.length).toBeGreaterThan(0);
    });

    it('should highlight filtered count in gold', () => {
      render(<SearchFilters {...mockProps} filteredResults={50} totalResults={100} />);

      const filteredCount = screen.getByText('50');
      expect(filteredCount).toHaveClass(/text-css-gold/);
    });

    it('should highlight total count', () => {
      render(<SearchFilters {...mockProps} filteredResults={50} totalResults={100} />);

      const totalCount = screen.getByText('100');
      expect(totalCount).toHaveClass(/font-bold/);
    });
  });

  describe('No Results Message', () => {
    it('should display no results message when filteredResults is 0', () => {
      render(<SearchFilters {...mockProps} filteredResults={0} totalResults={100} />);

      expect(screen.getByText(/No results found/i)).toBeInTheDocument();
      expect(screen.getByText(/Try adjusting your filters/i)).toBeInTheDocument();
    });

    it('should show SearchX icon in no results state', () => {
      render(<SearchFilters {...mockProps} filteredResults={0} totalResults={100} />);

      const searchXIcon = document.querySelector('svg[class*="lucide-search-x"]');
      expect(searchXIcon).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible labels on view toggle buttons', () => {
      render(<SearchFilters {...mockProps} />);

      expect(screen.getByLabelText('Card view')).toBeInTheDocument();
      expect(screen.getByLabelText('List view')).toBeInTheDocument();
    });

    it('should have accessible labels on clear buttons', () => {
      render(
        <SearchFilters
          {...mockProps}
          searchTerm="MI"
          selectedRegion="US"
          selectedSpecialty="Cardiology"
          selectedDangerLevel="Prohibited"
        />
      );

      expect(screen.getAllByLabelText('Clear search').length).toBeGreaterThan(0);
      expect(screen.getByLabelText('Clear region filter')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear specialty filter')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear safety level filter')).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} />);

      // Tab to search input
      await user.tab();
      expect(screen.getByPlaceholderText(/Search abbreviations/i)).toHaveFocus();
    });

    it('should support Enter key on view toggle buttons', async () => {
      const user = userEvent.setup();

      render(<SearchFilters {...mockProps} viewMode="card" />);

      const listButton = screen.getByLabelText('List view');
      listButton.focus();
      await user.keyboard('{Enter}');

      expect(mockProps.onViewModeChange).toHaveBeenCalledWith('list');
    });
  });

  describe('Responsive Layout', () => {
    it('should render in mobile-friendly flex layout', () => {
      const { container } = render(<SearchFilters {...mockProps} />);

      const filtersRow = container.querySelector('[class*="flex-col"]');
      expect(filtersRow).toBeInTheDocument();
    });

    it('should wrap filter tags on small screens', () => {
      render(
        <SearchFilters
          {...mockProps}
          searchTerm="MI"
          selectedRegion="US"
          selectedSpecialty="Cardiology"
          selectedDangerLevel="Prohibited"
        />
      );

      const tagsContainer = screen.getByText('Search: "MI"').closest('div[class*="flex-wrap"]');
      expect(tagsContainer).toBeInTheDocument();
    });
  });

  describe('Styling and Transitions', () => {
    it('should apply transition classes to search input', () => {
      const { container } = render(<SearchFilters {...mockProps} />);

      const searchContainer = container.querySelector('[class*="transition-all"]');
      expect(searchContainer).toBeInTheDocument();
    });

    it('should apply focus ring to search input on focus', async () => {
      const user = userEvent.setup();
      const { container } = render(<SearchFilters {...mockProps} />);

      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.click(searchInput);

      const searchContainer = container.querySelector('[class*="focus-within:ring"]');
      expect(searchContainer).toBeInTheDocument();
    });

    it('should have rounded corners on all interactive elements', () => {
      const { container } = render(<SearchFilters {...mockProps} />);

      const roundedElements = container.querySelectorAll('[class*="rounded"]');
      expect(roundedElements.length).toBeGreaterThan(0);
    });
  });
});
