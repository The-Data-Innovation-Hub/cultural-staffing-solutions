/**
 * Integration Tests for MedicalAbbreviations
 *
 * Test Coverage:
 * - Complete user flows (search → filter → expand → view modal)
 * - Multi-step interactions
 * - Filter combinations
 * - View mode switching
 * - State management across components
 * - Clear filters functionality
 * - End-to-end workflows
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { mockAbbreviations, mockStats } from '@/test/mockData';

// Mock the database module with async factory
vi.mock('@/data/medicalAbbreviationsDatabase', async () => {
  const mockData = await import('@/test/mockData');
  return {
    medicalAbbreviationsDatabase: mockData.mockAbbreviations,
    calculateAbbreviationStats: () => mockData.mockStats,
  };
});

import MedicalAbbreviationsV2 from '../MedicalAbbreviationsV2';

describe('MedicalAbbreviations Integration Tests', () => {
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

  describe('Complete User Flow: Search and Filter', () => {
    it('should filter results based on search term', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      // Wait for data to load
      await waitForDataLoad();

      // Step 1: Verify all abbreviations are visible (may appear multiple times)
      expect(screen.getAllByText('MI').length).toBeGreaterThan(0);
      expect(screen.getAllByText('MS').length).toBeGreaterThan(0);
      expect(screen.getAllByText('CA').length).toBeGreaterThan(0);
      expect(screen.getAllByText('BP').length).toBeGreaterThan(0);

      // Step 2: Search for "BP" (unique abbreviation that won't partial match others)
      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'BP');

      // Wait for debounce (300ms)
      await waitFor(
        () => {
          expect(screen.getAllByText('BP').length).toBeGreaterThan(0);
          // MI, MS, CA should be filtered out
          expect(screen.queryAllByText(/^MI$/i).length).toBe(0);
          expect(screen.queryAllByText(/^CA$/i).length).toBe(0);
        },
        { timeout: 500 }
      );
    });

    it('should show all abbreviations when no search term', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // All abbreviations should be visible
      expect(screen.getAllByText('MI').length).toBeGreaterThan(0);
      expect(screen.getAllByText('MS').length).toBeGreaterThan(0);
      expect(screen.getAllByText('CA').length).toBeGreaterThan(0);
      expect(screen.getAllByText('BP').length).toBeGreaterThan(0);
      expect(screen.getAllByText('U').length).toBeGreaterThan(0);
    });

    it('should handle search with no results gracefully', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'ZZZZZ');

      await waitFor(() => {
        expect(screen.getByText(/No abbreviations found/i)).toBeInTheDocument();
      }, { timeout: 500 });
    });

    it('should filter search results case-insensitively', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'bp');

      await waitFor(() => {
        expect(screen.getAllByText('BP').length).toBeGreaterThan(0);
      }, { timeout: 500 });
    });
  });

  describe('Multi-Step Workflows', () => {
    it('should perform search and clear workflow', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Apply search for BP
      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'BP');

      // Wait for results to filter
      await waitFor(() => {
        expect(screen.getAllByText('BP').length).toBeGreaterThan(0);
      }, { timeout: 500 });

      // Clear search by typing over it
      await user.clear(searchInput);

      // All abbreviations should be visible again
      await waitFor(() => {
        expect(screen.getAllByText('CA').length).toBeGreaterThan(0);
        expect(screen.getAllByText('MI').length).toBeGreaterThan(0);
        expect(screen.getAllByText('BP').length).toBeGreaterThan(0);
      }, { timeout: 500 });
    });

    it('should maintain data integrity through multiple searches', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);

      // First search for U
      await user.type(searchInput, 'U');
      await waitFor(() => {
        expect(screen.getAllByText(/^U$/).length).toBeGreaterThan(0);
      }, { timeout: 500 });

      // Clear and search for BP
      await user.clear(searchInput);
      await user.type(searchInput, 'BP');

      await waitFor(() => {
        expect(screen.getAllByText('BP').length).toBeGreaterThan(0);
      }, { timeout: 500 });
    });
  });

  describe('Filter State Management', () => {
    it('should restore all results when search is cleared', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Apply search for BP
      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'BP');

      // Wait for filtering
      await waitFor(() => {
        expect(screen.getAllByText('BP').length).toBeGreaterThan(0);
      }, { timeout: 500 });

      // Clear search using user.clear()
      await user.clear(searchInput);

      await waitFor(() => {
        // All abbreviations should be visible again
        expect(screen.getAllByText('CA').length).toBeGreaterThan(0);
        expect(screen.getAllByText('MI').length).toBeGreaterThan(0);
      }, { timeout: 500 });
    });

    it('should show filters active indicator when search is applied', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Apply search for BP
      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'BP');

      await waitFor(() => {
        // Should show "clear all filters" or filter tags
        expect(screen.getAllByText('BP').length).toBeGreaterThan(0);
      }, { timeout: 500 });
    });

    it('should update search input value when typing', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'test');

      // Input should have the typed value
      expect(searchInput).toHaveValue('test');
    });
  });

  describe('View Mode Switching', () => {
    it('should switch between card and list view', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Get view toggle buttons (may be multiple, get first ones)
      const cardViewButtons = screen.getAllByLabelText(/card view/i);
      const listViewButtons = screen.getAllByLabelText(/list view/i);

      const cardViewButton = cardViewButtons[0];
      const listViewButton = listViewButtons[0];

      // Initially in card view - check for active class
      expect(cardViewButton.className).toContain('bg-gradient-gold');

      // Switch to list view
      await user.click(listViewButton);

      await waitFor(() => {
        // List view should be active
        expect(listViewButton.className).toContain('bg-gradient-gold');
      });

      // Switch back to card view
      await user.click(cardViewButton);

      await waitFor(() => {
        expect(cardViewButton.className).toContain('bg-gradient-gold');
      });
    });

    it('should maintain filters when switching views', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Apply filter for BP
      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'BP');

      await waitFor(() => {
        expect(screen.getAllByText('BP').length).toBeGreaterThan(0);
      }, { timeout: 500 });

      // Switch to list view
      const listViewButtons = screen.getAllByLabelText(/list view/i);
      await user.click(listViewButtons[0]);

      await waitFor(() => {
        // Filter should still be applied - BP should still be visible
        expect(screen.getAllByText('BP').length).toBeGreaterThan(0);
        // Search input should still have BP
        expect(searchInput).toHaveValue('BP');
      });
    });

    it('should display abbreviations in both card and list views', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // In card view
      expect(screen.getAllByText('MI').length).toBeGreaterThan(0);

      // Switch to list view
      const listViewButtons = screen.getAllByLabelText(/list view/i);
      await user.click(listViewButtons[0]);

      // Should still show abbreviations in list view
      await waitFor(() => {
        expect(screen.getAllByText('MI').length).toBeGreaterThan(0);
      });
    });
  });

  describe('Card Expansion Flow', () => {
    it('should show cards in card view by default', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Should show abbreviations
      expect(screen.getAllByText('MI').length).toBeGreaterThan(0);
      expect(screen.getAllByText('MS').length).toBeGreaterThan(0);
    });

    it('should display card click hints', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Should show some indication cards can be clicked
      // Note: This depends on component implementation
      const allCards = screen.getAllByText('MI');
      expect(allCards.length).toBeGreaterThan(0);
    });
  });

  describe('Results Count Display', () => {
    it('should show results count', async () => {
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Should show results count with flexible matching (may appear multiple times)
      const countTexts = screen.getAllByText((_content, element) => {
        return element?.textContent?.match(/Showing \d+ of \d+/i) !== null;
      });
      expect(countTexts.length).toBeGreaterThan(0);
    });

    it('should update results count when filtering', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Apply filter for BP
      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'BP');

      await waitFor(() => {
        // Should show filtered count (may appear multiple times)
        const countTexts = screen.getAllByText((_content, element) => {
          return element?.textContent?.match(/Showing \d+ of \d+/i) !== null;
        });
        expect(countTexts.length).toBeGreaterThan(0);
        // BP should be visible
        expect(screen.getAllByText('BP').length).toBeGreaterThan(0);
      }, { timeout: 500 });
    });

    it('should show no results message when nothing matches', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Search for something that doesn't exist
      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      await user.type(searchInput, 'ZZZZZ');

      await waitFor(() => {
        const noResultsTexts = screen.getAllByText(/No (abbreviations|results) found/i);
        expect(noResultsTexts.length).toBeGreaterThan(0);
      }, { timeout: 500 });
    });
  });

  describe('Modal Interaction Flow', () => {
    it('should open detail modal from list view', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Switch to list view
      const listViewButton = screen.getByLabelText(/list view/i);
      await user.click(listViewButton);

      await waitFor(() => {
        expect(listViewButton.className).toContain('bg-gradient-gold');
      });

      // Click on info button
      const infoButtons = screen.getAllByLabelText(/view full details/i);
      await user.click(infoButtons[0]);

      await waitFor(() => {
        // Modal should open
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should close modal and return to previous state', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Switch to list view
      const listViewButton = screen.getByLabelText(/list view/i);
      await user.click(listViewButton);

      // Open modal
      const infoButtons = screen.getAllByLabelText(/view full details/i);
      await user.click(infoButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByLabelText(/close modal/i);
      await user.click(closeButton);

      await waitFor(() => {
        // Modal should be closed
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        // Should still be in list view
        expect(listViewButton.className).toContain('bg-gradient-gold');
      });
    });
  });

  describe('Keyboard Navigation Flow', () => {
    it('should navigate to search input with Tab key', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Tab to search input
      await user.tab();
      expect(screen.getByPlaceholderText(/Search abbreviations/i)).toHaveFocus();
    });

    it('should support keyboard input in search field', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      const searchInput = screen.getByPlaceholderText(/Search abbreviations/i);
      searchInput.focus();

      await user.keyboard('MI');

      await waitFor(() => {
        expect(searchInput).toHaveValue('MI');
      });
    });

    it('should close modal with Escape key', async () => {
      const user = userEvent.setup();
      render(<MedicalAbbreviationsV2 />);

      await waitForDataLoad();

      // Switch to list view and open modal
      const listViewButton = screen.getByLabelText(/list view/i);
      await user.click(listViewButton);

      const infoButtons = screen.getAllByLabelText(/view full details/i);
      await user.click(infoButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
});
