/**
 * Medical Abbreviations Reference Page (Version 2)
 *
 * A comprehensive, accessible medical abbreviations dictionary with:
 * - Real-time debounced search (300ms) and advanced filtering
 * - Regional and specialty context (UK, US, Australia, Canada, Northern Ireland)
 * - Safety level indicators (Safe, Caution, Prohibited)
 * - Multiple view modes (Card grid, Compact list)
 * - Detailed expandable information with clinical examples
 * - Full WCAG AA accessibility compliance
 * - Error handling and loading states
 * - Mobile-responsive design
 *
 * Based on Joint Commission "Do Not Use" list and medical standards research
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  AlertTriangle,
  Grid3x3,
  List,
  Filter,
  X,
  Globe,
  Stethoscope,
  AlertCircle,
  Loader2,
  SearchX,
  FileX
} from 'lucide-react';
import { medicalAbbreviationsDatabase, calculateAbbreviationStats } from '@/data/medicalAbbreviationsDatabase';
import AbbreviationCard from '@/components/medical/AbbreviationCard';
import AbbreviationList from '@/components/medical/AbbreviationList';
import AbbreviationDetailModal from '@/components/medical/AbbreviationDetailModal';
import type { MedicalAbbreviation, Region, Specialty } from '@/types/medicalAbbreviations';

/**
 * Custom hook for debouncing values
 * Delays updating the returned value until the input has been stable for the specified delay
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced value
 */
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Skeleton loader component for loading states
 */
const SkeletonCard = () => (
  <Card className="shadow-card border-0">
    <CardContent className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-8 bg-gradient-to-r from-css-grey-light via-white to-css-grey-light rounded animate-pulse" />
          <div className="h-4 w-24 bg-gradient-to-r from-css-grey-light via-white to-css-grey-light rounded animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-gradient-to-r from-css-grey-light via-white to-css-grey-light rounded-full animate-pulse" />
      </div>
      <div className="h-16 bg-gradient-to-r from-css-grey-light via-white to-css-grey-light rounded animate-pulse" />
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-gradient-to-r from-css-grey-light via-white to-css-grey-light rounded-full animate-pulse" />
        <div className="h-6 w-20 bg-gradient-to-r from-css-grey-light via-white to-css-grey-light rounded-full animate-pulse" />
      </div>
      <div className="h-10 bg-gradient-to-r from-css-grey-light via-white to-css-grey-light rounded animate-pulse" />
    </CardContent>
  </Card>
);

export default function MedicalAbbreviationsV2() {
  // ============================================================================
  // PAGE METADATA
  // ============================================================================
  useEffect(() => {
    document.title = 'Medical Abbreviations Reference | Cultural Staffing Solutions';
    return () => {
      document.title = 'Cultural Staffing Solutions';
    };
  }, []);

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedDangerLevel, setSelectedDangerLevel] = useState<string>('All');

  // View state
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Modal state
  const [selectedAbbreviation, setSelectedAbbreviation] = useState<MedicalAbbreviation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Debounced search term for performance optimization
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    // Simulate loading delay and handle potential errors
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay in development
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify database loaded successfully
        if (!medicalAbbreviationsDatabase || medicalAbbreviationsDatabase.length === 0) {
          throw new Error('Database is empty or failed to load');
        }

        setHasError(false);
      } catch (error) {
        console.error('Failed to load medical abbreviations:', error);
        setHasError(true);
        toast.error('Failed to load abbreviations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  // Calculate statistics from database
  const stats = useMemo(() => {
    try {
      return calculateAbbreviationStats();
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalAbbreviations: 0,
        ambiguousCount: 0,
        prohibitedCount: 0,
        avgMeaningsPerAbbr: 0
      };
    }
  }, []);

  // Extract unique regions from database
  const regions = useMemo(() => {
    const regionSet = new Set<Region>();
    medicalAbbreviationsDatabase.forEach(abbr => {
      abbr.meanings.forEach(meaning => regionSet.add(meaning.region));
    });
    return ['All', ...Array.from(regionSet).sort()];
  }, []);

  // Extract unique specialties from database
  const specialties = useMemo(() => {
    const specialtySet = new Set<Specialty>();
    medicalAbbreviationsDatabase.forEach(abbr => {
      abbr.meanings.forEach(meaning => specialtySet.add(meaning.specialty));
    });
    return ['All', ...Array.from(specialtySet).sort()];
  }, []);

  // ============================================================================
  // FILTERING LOGIC
  // ============================================================================

  // Filter abbreviations based on search and filter criteria
  const filteredAbbreviations = useMemo(() => {
    return medicalAbbreviationsDatabase.filter(abbr => {
      // SEARCH FILTER - Case insensitive, searches across multiple fields
      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const matchesAbbr = abbr.abbr.toLowerCase().includes(searchLower);
        const matchesPrimary = abbr.primaryMeaning?.toLowerCase().includes(searchLower);
        const matchesMeanings = abbr.meanings.some(m =>
          m.term.toLowerCase().includes(searchLower) ||
          m.description.toLowerCase().includes(searchLower)
        );
        const matchesSearchTerms = abbr.searchTerms?.some(term =>
          term.toLowerCase().includes(searchLower)
        );

        if (!matchesAbbr && !matchesPrimary && !matchesMeanings && !matchesSearchTerms) {
          return false;
        }
      }

      // REGION FILTER - Include "Global" abbreviations for all regions
      if (selectedRegion !== 'All') {
        const hasRegion = abbr.meanings.some(m =>
          m.region === selectedRegion || m.region === 'Global'
        );
        if (!hasRegion) return false;
      }

      // SPECIALTY FILTER - Exact match on specialty
      if (selectedSpecialty !== 'All') {
        const hasSpecialty = abbr.meanings.some(m => m.specialty === selectedSpecialty);
        if (!hasSpecialty) return false;
      }

      // DANGER LEVEL FILTER - Matches safety classification
      if (selectedDangerLevel !== 'All') {
        const hasDangerLevel = abbr.meanings.some(m =>
          m.dangerLevel === selectedDangerLevel.toLowerCase()
        );
        if (!hasDangerLevel) return false;
      }

      return true;
    });
  }, [debouncedSearchTerm, selectedRegion, selectedSpecialty, selectedDangerLevel]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Clear all active filters and search
   */
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedRegion('All');
    setSelectedSpecialty('All');
    setSelectedDangerLevel('All');

    // Announce to screen readers
    setTimeout(() => {
      toast.info('All filters cleared');
    }, 100);
  }, []);

  /**
   * Check if any filters are currently active
   */
  const hasActiveFilters = searchTerm || selectedRegion !== 'All' ||
    selectedSpecialty !== 'All' || selectedDangerLevel !== 'All';

  /**
   * Handle abbreviation card click - opens detail modal
   */
  const handleSelectAbbreviation = useCallback((abbr: MedicalAbbreviation) => {
    setSelectedAbbreviation(abbr);
    setIsDetailModalOpen(true);

    // Announce to screen readers
    const meaningCount = abbr.meanings.length;
    console.log(`Opening details for ${abbr.abbr} with ${meaningCount} meaning${meaningCount > 1 ? 's' : ''}`);
  }, []);

  /**
   * Toggle card expansion in card view
   */
  const handleToggleCardExpansion = useCallback((abbrId: string) => {
    setExpandedCardId(prev => prev === abbrId ? null : abbrId);
  }, []);

  /**
   * Handle detail modal close
   */
  const handleCloseModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedAbbreviation(null);
  }, []);

  /**
   * Retry loading data after error
   */
  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    window.location.reload();
  }, []);

  // ============================================================================
  // RENDER - LOADING STATE
  // ============================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-3">
            <div className="h-10 w-96 bg-gradient-to-r from-css-grey-light via-white to-css-grey-light rounded animate-pulse" />
            <div className="h-4 w-full max-w-3xl bg-gradient-to-r from-css-grey-light via-white to-css-grey-light rounded animate-pulse" />
          </div>

          {/* Loading Message */}
          <Card className="shadow-card border-0">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 text-css-gold mx-auto mb-4 animate-spin" />
              <h3 className="font-montserrat font-bold text-lg text-foreground mb-2">
                Loading Abbreviations...
              </h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we load the medical abbreviations database
              </p>
            </CardContent>
          </Card>

          {/* Card Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER - ERROR STATE
  // ============================================================================

  if (hasError) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card border-0 border-l-4 border-l-red-500">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="font-montserrat font-bold text-2xl text-foreground mb-2">
                Unable to Load Medical Abbreviations
              </h3>
              <p className="text-base text-muted-foreground mb-6">
                We encountered an error while loading the abbreviations database.
                This could be due to a network issue or server problem.
              </p>
              <Button
                onClick={handleRetry}
                className="bg-gradient-gold text-css-black hover:bg-css-gold font-bold px-8 py-3"
              >
                Retry Loading
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER - EMPTY DATABASE STATE
  // ============================================================================

  if (stats.totalAbbreviations === 0) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card border-0">
            <CardContent className="p-12 text-center">
              <FileX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-montserrat font-bold text-2xl text-foreground mb-2">
                No Abbreviations Available Yet
              </h3>
              <p className="text-base text-muted-foreground">
                Check back soon! The medical abbreviations database is being prepared.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER - MAIN CONTENT
  // ============================================================================

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ====================================================================
            HEADER SECTION
        ==================================================================== */}
        <div className="space-y-3">
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-foreground">
            Medical Abbreviations Reference
          </h1>
          <p className="text-base text-muted-foreground max-w-3xl">
            Search and understand medical abbreviations across different regions and specialties.
            View safety classifications based on Joint Commission guidelines and regional healthcare standards.
          </p>
        </div>

        {/* ====================================================================
            STATISTICS BANNER
        ==================================================================== */}
        <Card className="shadow-card border-0 bg-gradient-gold" role="region" aria-label="Statistics">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-2xl md:text-3xl font-montserrat font-bold text-css-black">
                  {stats.totalAbbreviations}
                </p>
                <p className="text-sm text-css-black/80">Total Abbreviations</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-montserrat font-bold text-css-black">
                  {stats.ambiguousCount}
                </p>
                <p className="text-sm text-css-black/80">Ambiguous Terms</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-montserrat font-bold text-css-black">
                  {stats.prohibitedCount}
                </p>
                <p className="text-sm text-css-black/80">Prohibited</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-montserrat font-bold text-css-black">
                  {stats.avgMeaningsPerAbbr}
                </p>
                <p className="text-sm text-css-black/80">Avg Meanings Each</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====================================================================
            SAFETY WARNING BANNER
        ==================================================================== */}
        <Card
          className="shadow-card border-0 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20"
          role="alert"
          aria-live="polite"
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <h3 className="font-montserrat font-bold text-base text-red-900 dark:text-red-100 mb-2">
                  Critical Safety Information
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                  81% of medical abbreviations are ambiguous with an average of 16 different meanings.
                  Some abbreviations are prohibited by the Joint Commission due to fatal medication errors.
                  Always verify context, consider regional differences, and when in doubt, write terms in full.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====================================================================
            SEARCH AND FILTER SECTION
        ==================================================================== */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-montserrat text-xl flex items-center gap-3">
              <Search className="h-6 w-6 text-css-gold" aria-hidden="true" />
              Search & Filters
            </CardTitle>
            <CardDescription>
              Filter by region, specialty, or safety level to find relevant abbreviations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <label htmlFor="search-input" className="sr-only">
                Search medical abbreviations
              </label>
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="search-input"
                type="search"
                placeholder="Search abbreviations, terms, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base bg-white dark:bg-gray-800 shadow-card border-0 focus-visible:ring-2 focus-visible:ring-css-gold focus-visible:ring-offset-2 transition-all duration-300"
                aria-label="Search medical abbreviations"
                aria-describedby="search-description"
              />
              <span id="search-description" className="sr-only">
                Search for abbreviations by name, term, or description
              </span>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Region Filter */}
              <div className="space-y-2">
                <label htmlFor="region-filter" className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-css-gold" aria-hidden="true" />
                  Region
                </label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger
                    id="region-filter"
                    className="bg-card shadow-card border-0 h-11 focus:ring-2 focus:ring-css-gold focus:ring-offset-2"
                    aria-label="Filter by region"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specialty Filter */}
              <div className="space-y-2">
                <label htmlFor="specialty-filter" className="text-sm font-medium flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-css-gold" aria-hidden="true" />
                  Specialty
                </label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger
                    id="specialty-filter"
                    className="bg-card shadow-card border-0 h-11 focus:ring-2 focus:ring-css-gold focus:ring-offset-2"
                    aria-label="Filter by specialty"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Safety Level Filter */}
              <div className="space-y-2">
                <label htmlFor="safety-filter" className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-css-gold" aria-hidden="true" />
                  Safety Level
                </label>
                <Select value={selectedDangerLevel} onValueChange={setSelectedDangerLevel}>
                  <SelectTrigger
                    id="safety-filter"
                    className="bg-card shadow-card border-0 h-11 focus:ring-2 focus:ring-css-gold focus:ring-offset-2"
                    aria-label="Filter by safety level"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Levels</SelectItem>
                    <SelectItem value="Safe">Safe</SelectItem>
                    <SelectItem value="Caution">Caution</SelectItem>
                    <SelectItem value="Prohibited">Prohibited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4 text-css-gold" aria-hidden="true" />
                  View Mode
                </label>
                <div className="flex items-center gap-2 h-11" role="group" aria-label="View mode">
                  <Button
                    onClick={() => setViewMode('card')}
                    className={`flex-1 h-full transition-all duration-300 hover:scale-105 ${
                      viewMode === 'card'
                        ? 'bg-gradient-gold text-css-black hover:bg-css-gold shadow-gold'
                        : 'bg-card text-muted-foreground hover:bg-muted'
                    }`}
                    aria-label="Card view"
                    aria-pressed={viewMode === 'card'}
                  >
                    <Grid3x3 className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Card view</span>
                  </Button>
                  <Button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 h-full transition-all duration-300 hover:scale-105 ${
                      viewMode === 'list'
                        ? 'bg-gradient-gold text-css-black hover:bg-css-gold shadow-gold'
                        : 'bg-card text-muted-foreground hover:bg-muted'
                    }`}
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <List className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count and Clear Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t">
              <div
                className="flex items-center gap-3"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <p className="text-sm font-medium text-foreground">
                  Showing <span className="text-css-gold font-bold">{filteredAbbreviations.length}</span> of {stats.totalAbbreviations} abbreviations
                </p>
                {selectedRegion === 'Northern Ireland' && (
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                    <Globe className="h-3 w-3 mr-1" aria-hidden="true" />
                    HSC Focus
                  </Badge>
                )}
              </div>
              {hasActiveFilters && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  className="transition-all duration-300 hover:scale-105 hover:border-css-gold hover:text-css-gold focus:ring-2 focus:ring-css-gold focus:ring-offset-2"
                  aria-label="Clear all filters"
                >
                  <X className="h-4 w-4 mr-2" aria-hidden="true" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ====================================================================
            RESULTS SECTION
        ==================================================================== */}
        {filteredAbbreviations.length === 0 ? (
          // No Results State
          <Card className="shadow-card border-0" role="status" aria-live="polite">
            <CardContent className="p-12 text-center">
              <SearchX className="h-16 w-16 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-montserrat font-bold text-xl text-foreground mb-2">
                No Abbreviations Found
                {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
              </h3>
              <div className="text-sm text-muted-foreground mb-6 space-y-1">
                <p>Try different keywords or broaden your search</p>
                <p>Clear filters to see all results</p>
              </div>
              {hasActiveFilters && (
                <Button
                  onClick={handleClearFilters}
                  className="bg-gradient-gold text-css-black hover:bg-css-gold hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-css-gold focus:ring-offset-2"
                >
                  <X className="h-4 w-4 mr-2" aria-hidden="true" />
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === 'card' ? (
          // Card View
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Medical abbreviations in card view"
          >
            {filteredAbbreviations.map((abbr) => (
              <div key={abbr.abbr} role="listitem">
                <AbbreviationCard
                  abbreviation={abbr.abbr}
                  meanings={abbr.meanings}
                  isExpanded={expandedCardId === abbr.abbr}
                  onToggleExpand={handleToggleCardExpansion}
                  primaryMeaning={abbr.primaryMeaning}
                />
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div role="list" aria-label="Medical abbreviations in list view">
            <AbbreviationList
              abbreviations={filteredAbbreviations}
              onSelectAbbreviation={handleSelectAbbreviation}
            />
          </div>
        )}

        {/* ====================================================================
            DETAIL MODAL
        ==================================================================== */}
        {selectedAbbreviation && (
          <AbbreviationDetailModal
            abbreviation={selectedAbbreviation.abbr}
            meanings={selectedAbbreviation.meanings}
            isOpen={isDetailModalOpen}
            onClose={handleCloseModal}
            primaryMeaning={selectedAbbreviation.primaryMeaning}
          />
        )}
      </div>
    </div>
  );
}
