/**
 * SearchFilters Component
 *
 * Comprehensive search and filter interface for medical abbreviations.
 * Features neumorphic search input, dropdown filters, view toggle, and active filter display.
 *
 * Features:
 * - Neumorphic search input with inset shadow
 * - Debounced search (300ms)
 * - Region, Specialty, and Danger Level filters
 * - View mode toggle (card/list)
 * - Active filter tags with removal
 * - Results count display
 * - Fully responsive layout
 */

import { useState, useCallback, useEffect } from 'react';
import { Search, X, Grid3x3, List, SearchX } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Region, Specialty, DangerLevel } from '@/types/medicalAbbreviations';

// Props interface
interface SearchFiltersProps {
  // Search
  searchTerm: string;
  onSearchChange: (value: string) => void;

  // Filters
  selectedRegion: string;
  onRegionChange: (value: string) => void;
  selectedSpecialty: string;
  onSpecialtyChange: (value: string) => void;
  selectedDangerLevel: string;
  onDangerLevelChange: (value: string) => void;

  // View mode
  viewMode: 'card' | 'list';
  onViewModeChange: (mode: 'card' | 'list') => void;

  // Results
  totalResults: number;
  filteredResults: number;
}

// Filter options
const REGION_OPTIONS: Array<'All' | Region> = [
  'All',
  'Global',
  'US',
  'UK',
  'Australia',
  'Canada',
  'Northern Ireland'
];

const SPECIALTY_OPTIONS = [
  'All',
  'Cardiology',
  'Neurology',
  'Emergency Medicine',
  'Pharmacy',
  'Oncology',
  'Laboratory',
  'Pulmonology',
  'Gastroenterology',
  'Endocrinology',
  'Hematology',
  'Infectious Disease',
  'Radiology',
  'Surgery',
  'Pediatrics',
  'Obstetrics',
  'Psychiatry',
  'Dermatology',
  'Ophthalmology',
  'Orthopedics',
  'Anesthesiology'
];

const DANGER_LEVEL_OPTIONS = [
  'All',
  'Safe',
  'Caution',
  'Prohibited'
];

// Main Component
export default function SearchFilters({
  searchTerm,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedSpecialty,
  onSpecialtyChange,
  selectedDangerLevel,
  onDangerLevelChange,
  viewMode,
  onViewModeChange,
  totalResults,
  filteredResults
}: SearchFiltersProps) {
  // Local state for immediate input display (before debounce)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Clear search handler
  const handleClearSearch = useCallback(() => {
    setLocalSearchTerm('');
    onSearchChange('');
  }, [onSearchChange]);

  // Clear individual filter
  const handleClearFilter = useCallback((filterType: 'region' | 'specialty' | 'danger') => {
    switch (filterType) {
      case 'region':
        onRegionChange('All');
        break;
      case 'specialty':
        onSpecialtyChange('All');
        break;
      case 'danger':
        onDangerLevelChange('All');
        break;
    }
  }, [onRegionChange, onSpecialtyChange, onDangerLevelChange]);

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    setLocalSearchTerm('');
    onSearchChange('');
    onRegionChange('All');
    onSpecialtyChange('All');
    onDangerLevelChange('All');
  }, [onSearchChange, onRegionChange, onSpecialtyChange, onDangerLevelChange]);

  // Check if any filters are active
  const hasActiveFilters =
    localSearchTerm !== '' ||
    selectedRegion !== 'All' ||
    selectedSpecialty !== 'All' ||
    selectedDangerLevel !== 'All';

  return (
    <div className="space-y-6">
      {/* Search Input - Neumorphic Style */}
      <div
        className="
          bg-white
          dark:bg-gray-800
          rounded-xl
          p-4
          transition-all
          duration-300
          focus-within:ring-2
          focus-within:ring-css-gold
        "
        style={{
          boxShadow: 'inset 4px 4px 8px rgba(163,177,198,0.4), inset -4px -4px 8px rgba(255,255,255,0.8)'
        }}
      >
        <div className="flex items-center gap-3">
          {/* Search Icon */}
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />

          {/* Input Field */}
          <input
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            placeholder="Search abbreviations, terms, or descriptions..."
            className="
              flex-1
              bg-transparent
              border-none
              focus:outline-none
              focus:ring-0
              text-css-black
              dark:text-foreground
              placeholder:text-muted-foreground
              text-base
            "
          />

          {/* Clear Button */}
          {localSearchTerm && (
            <button
              onClick={handleClearSearch}
              className="
                p-1
                rounded-full
                text-muted-foreground
                hover:text-css-gold
                hover:bg-css-gold/10
                transition-colors
                duration-200
                flex-shrink-0
              "
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
          {/* Region Filter */}
          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger
              className={`
                shadow-card
                border-0
                rounded-xl
                px-4
                py-2
                transition-all
                duration-200
                ${selectedRegion !== 'All' ? 'bg-gradient-gold text-css-black font-medium' : 'bg-card'}
              `}
            >
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              {REGION_OPTIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Specialty Filter */}
          <Select value={selectedSpecialty} onValueChange={onSpecialtyChange}>
            <SelectTrigger
              className={`
                shadow-card
                border-0
                rounded-xl
                px-4
                py-2
                transition-all
                duration-200
                ${selectedSpecialty !== 'All' ? 'bg-gradient-gold text-css-black font-medium' : 'bg-card'}
              `}
            >
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 shadow-lg rounded-xl max-h-[300px]">
              {SPECIALTY_OPTIONS.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Danger Level Filter */}
          <Select value={selectedDangerLevel} onValueChange={onDangerLevelChange}>
            <SelectTrigger
              className={`
                shadow-card
                border-0
                rounded-xl
                px-4
                py-2
                transition-all
                duration-200
                ${selectedDangerLevel !== 'All' ? 'bg-gradient-gold text-css-black font-medium' : 'bg-card'}
              `}
            >
              <SelectValue placeholder="Safety Level" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              {DANGER_LEVEL_OPTIONS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="bg-card shadow-card rounded-full p-1 flex gap-1">
          {/* Card View Button */}
          <button
            onClick={() => onViewModeChange('card')}
            className={`
              p-2
              rounded-full
              transition-all
              duration-200
              ${
                viewMode === 'card'
                  ? 'bg-gradient-gold text-css-black'
                  : 'bg-transparent text-muted-foreground hover:text-css-gold'
              }
            `}
            aria-label="Card view"
          >
            <Grid3x3 className="h-5 w-5" />
          </button>

          {/* List View Button */}
          <button
            onClick={() => onViewModeChange('list')}
            className={`
              p-2
              rounded-full
              transition-all
              duration-200
              ${
                viewMode === 'list'
                  ? 'bg-gradient-gold text-css-black'
                  : 'bg-transparent text-muted-foreground hover:text-css-gold'
              }
            `}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Search term tag */}
          {localSearchTerm && (
            <div className="inline-flex items-center gap-2 bg-css-gold-light text-css-black px-3 py-1 rounded-full text-sm font-medium">
              <span>Search: "{localSearchTerm}"</span>
              <button
                onClick={handleClearSearch}
                className="text-css-black hover:text-red-600 transition-colors duration-200"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Region tag */}
          {selectedRegion !== 'All' && (
            <div className="inline-flex items-center gap-2 bg-css-gold-light text-css-black px-3 py-1 rounded-full text-sm font-medium">
              <span>Region: {selectedRegion}</span>
              <button
                onClick={() => handleClearFilter('region')}
                className="text-css-black hover:text-red-600 transition-colors duration-200"
                aria-label="Clear region filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Specialty tag */}
          {selectedSpecialty !== 'All' && (
            <div className="inline-flex items-center gap-2 bg-css-gold-light text-css-black px-3 py-1 rounded-full text-sm font-medium">
              <span>Specialty: {selectedSpecialty}</span>
              <button
                onClick={() => handleClearFilter('specialty')}
                className="text-css-black hover:text-red-600 transition-colors duration-200"
                aria-label="Clear specialty filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Danger level tag */}
          {selectedDangerLevel !== 'All' && (
            <div className="inline-flex items-center gap-2 bg-css-gold-light text-css-black px-3 py-1 rounded-full text-sm font-medium">
              <span>Safety: {selectedDangerLevel}</span>
              <button
                onClick={() => handleClearFilter('danger')}
                className="text-css-black hover:text-red-600 transition-colors duration-200"
                aria-label="Clear safety level filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Clear all button */}
          <button
            onClick={handleClearAllFilters}
            className="text-sm text-css-gold hover:text-css-gold-light font-medium transition-colors duration-200 ml-2"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Results Count Banner */}
      <div className="bg-css-grey-light dark:bg-gray-800 rounded-lg p-3">
        {filteredResults > 0 ? (
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-css-gold">{filteredResults}</span> of{' '}
            <span className="font-bold text-css-black dark:text-foreground">{totalResults}</span>{' '}
            abbreviations
          </p>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <SearchX className="h-5 w-5" />
            <p className="text-sm">
              No results found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Export types
export type { SearchFiltersProps };
