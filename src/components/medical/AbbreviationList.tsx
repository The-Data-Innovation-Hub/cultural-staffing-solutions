/**
 * AbbreviationList Component
 *
 * Compact list/table view for displaying medical abbreviations.
 * Optimized for quick scanning and information density.
 *
 * Features:
 * - Table-like structure with flexible div layout
 * - Alternating row backgrounds
 * - Compact information display
 * - Click to view full details
 * - Mobile responsive stacking
 */

import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { MedicalAbbreviation, AbbreviationMeaning, DangerLevel, Region } from '@/types/medicalAbbreviations';

// Props interface
interface AbbreviationListProps {
  abbreviations: MedicalAbbreviation[];
  onSelectAbbreviation: (abbr: MedicalAbbreviation) => void;
}

// Danger Badge Component (same as card view for consistency)
const DangerBadge = ({ level }: { level: DangerLevel }) => {
  const styles = {
    safe: {
      containerClass: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
      icon: <CheckCircle className="h-3 w-3" />,
      label: 'SAFE'
    },
    caution: {
      containerClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
      icon: <AlertTriangle className="h-3 w-3" />,
      label: 'CAUTION'
    },
    prohibited: {
      containerClass: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
      icon: <XCircle className="h-3 w-3" />,
      label: 'PROHIBITED'
    }
  };

  const style = styles[level];

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.containerClass}`}>
      {style.icon}
      <span className="hidden sm:inline">{style.label}</span>
    </div>
  );
};

// Region Badge styling helper
const getRegionBadgeClass = (region: Region): string => {
  const styles: Record<Region, string> = {
    'Northern Ireland': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    'UK': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
    'US': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
    'Australia': 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200',
    'Canada': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200',
    'Global': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
  };
  return styles[region] || styles['Global'];
};

// Get primary (most important) meaning
const getPrimaryMeaning = (meanings: AbbreviationMeaning[]): AbbreviationMeaning => {
  // Priority: safe > caution > prohibited (safest first for primary display)
  const safeMeanings = meanings.filter(m => m.dangerLevel === 'safe');
  if (safeMeanings.length > 0) return safeMeanings[0];

  const cautionMeanings = meanings.filter(m => m.dangerLevel === 'caution');
  if (cautionMeanings.length > 0) return cautionMeanings[0];

  return meanings[0]; // fallback to first
};

// Main List Component
export default function AbbreviationList({
  abbreviations,
  onSelectAbbreviation
}: AbbreviationListProps) {
  return (
    <div className="bg-card shadow-card rounded-xl overflow-hidden">
      {/* Header Row - Desktop Only */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 bg-css-grey-light p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="col-span-2 font-bold text-sm text-css-black dark:text-foreground">
          Abbreviation
        </div>
        <div className="col-span-4 font-bold text-sm text-css-black dark:text-foreground">
          Primary Meaning
        </div>
        <div className="col-span-2 font-bold text-sm text-css-black dark:text-foreground">
          Region
        </div>
        <div className="col-span-2 font-bold text-sm text-css-black dark:text-foreground">
          Specialty
        </div>
        <div className="col-span-1 font-bold text-sm text-css-black dark:text-foreground text-center">
          Safety
        </div>
        <div className="col-span-1 font-bold text-sm text-css-black dark:text-foreground text-center">
          Details
        </div>
      </div>

      {/* Data Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {abbreviations.map((abbr, index) => {
          const primaryMeaning = getPrimaryMeaning(abbr.meanings);
          const uniqueRegions = Array.from(new Set(abbr.meanings.map(m => m.region)));
          const maxDangerLevel: DangerLevel = abbr.overallRisk || 'safe';

          // Alternating background colors
          const bgColor = index % 2 === 0
            ? 'bg-white dark:bg-gray-900'
            : 'bg-css-grey-light dark:bg-gray-800';

          // Rounded corners for first and last items
          const roundedClass = index === 0
            ? 'rounded-t-xl'
            : index === abbreviations.length - 1
            ? 'rounded-b-xl'
            : '';

          return (
            <div
              key={abbr.abbr}
              onClick={() => onSelectAbbreviation(abbr)}
              className={`
                ${bgColor}
                ${roundedClass}
                p-4
                cursor-pointer
                transition-all
                duration-200
                hover:bg-gradient-gold
                hover:bg-opacity-10
                ${index === abbreviations.length - 1 ? '' : 'border-b border-gray-200 dark:border-gray-700'}
              `}
            >
              {/* Desktop Layout - Grid */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                {/* Abbreviation Column */}
                <div className="col-span-2">
                  <span className="font-bold text-css-gold text-lg">
                    {abbr.abbr}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {abbr.meanings.length} meaning{abbr.meanings.length > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Primary Meaning Column */}
                <div className="col-span-4">
                  <p className="text-sm text-css-black dark:text-foreground font-medium line-clamp-2">
                    {primaryMeaning.term}
                  </p>
                  {abbr.primaryMeaning && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {abbr.primaryMeaning}
                    </p>
                  )}
                </div>

                {/* Region Tags Column */}
                <div className="col-span-2 flex flex-wrap gap-1">
                  {uniqueRegions.slice(0, 2).map(region => (
                    <span
                      key={region}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRegionBadgeClass(region)}`}
                    >
                      {region === 'Northern Ireland' ? 'NI' : region}
                    </span>
                  ))}
                  {uniqueRegions.length > 2 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-css-grey-light text-css-black dark:bg-gray-700 dark:text-gray-300">
                      +{uniqueRegions.length - 2}
                    </span>
                  )}
                </div>

                {/* Specialty Tag Column */}
                <div className="col-span-2">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-css-grey-light text-css-black dark:bg-gray-700 dark:text-gray-300 border border-css-gold/30">
                    {primaryMeaning.specialty}
                  </span>
                  {abbr.meanings.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      +{abbr.meanings.length - 1} more
                    </p>
                  )}
                </div>

                {/* Danger Badge Column */}
                <div className="col-span-1 flex justify-center">
                  <DangerBadge level={maxDangerLevel} />
                </div>

                {/* Info Icon Column */}
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAbbreviation(abbr);
                    }}
                    className="text-css-gold hover:text-css-gold-light transition-colors duration-200 p-2 hover:bg-css-gold/10 rounded-full"
                    aria-label="View full details"
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Layout - Stacked */}
              <div className="md:hidden space-y-3">
                {/* Top Row: Abbreviation + Danger Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="font-bold text-css-gold text-xl">
                      {abbr.abbr}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {abbr.meanings.length} meaning{abbr.meanings.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <DangerBadge level={maxDangerLevel} />
                </div>

                {/* Primary Meaning */}
                <div>
                  <p className="text-sm text-css-black dark:text-foreground font-medium">
                    {primaryMeaning.term}
                  </p>
                  {abbr.primaryMeaning && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {abbr.primaryMeaning}
                    </p>
                  )}
                </div>

                {/* Region Tags */}
                <div className="flex flex-wrap gap-2">
                  {uniqueRegions.map(region => (
                    <span
                      key={region}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRegionBadgeClass(region)}`}
                    >
                      {region === 'Northern Ireland' ? 'NI' : region}
                    </span>
                  ))}
                </div>

                {/* View Details Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAbbreviation(abbr);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-sm text-css-gold hover:text-css-gold-light font-medium py-2 hover:bg-css-gold/10 rounded-lg transition-all duration-200"
                >
                  <Info className="h-4 w-4" />
                  View Full Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {abbreviations.length === 0 && (
        <div className="p-12 text-center">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            No abbreviations to display
          </p>
        </div>
      )}
    </div>
  );
}

// Export types
export type { AbbreviationListProps };
