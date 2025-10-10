/**
 * AbbreviationCard Component
 *
 * Reusable card component for displaying medical abbreviations
 * with expandable details, safety indicators, and regional context.
 *
 * Features:
 * - Neumorphic design with smooth animations
 * - Color-coded safety levels
 * - Expandable/collapsible content
 * - Region and specialty badges
 * - Gold gradient accents
 */

import { AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { AbbreviationMeaning, DangerLevel, Region, Specialty } from '@/types/medicalAbbreviations';

// Props interface
interface AbbreviationCardProps {
  abbreviation: string;
  meanings: AbbreviationMeaning[];
  isExpanded: boolean;
  onToggleExpand: (abbr: string) => void;
  primaryMeaning?: string;
}

// Danger Badge Sub-component
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
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.containerClass} transition-all duration-300`}>
      {style.icon}
      <span>{style.label}</span>
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

// Main Card Component
export default function AbbreviationCard({
  abbreviation,
  meanings,
  isExpanded,
  onToggleExpand,
  primaryMeaning
}: AbbreviationCardProps) {
  // Check if any meaning is caution or prohibited
  const hasWarning = meanings.some(m => m.dangerLevel === 'caution' || m.dangerLevel === 'prohibited');
  const hasProhibited = meanings.some(m => m.dangerLevel === 'prohibited');

  // Get highest danger level
  const maxDangerLevel: DangerLevel = meanings.reduce((max, m) => {
    if (m.dangerLevel === 'prohibited') return 'prohibited';
    if (m.dangerLevel === 'caution' && max !== 'prohibited') return 'caution';
    return max;
  }, 'safe' as DangerLevel);

  // Get unique regions
  const uniqueRegions = Array.from(new Set(meanings.map(m => m.region)));

  return (
    <div
      onClick={() => onToggleExpand(abbreviation)}
      className={`
        relative
        bg-card
        rounded-2xl
        p-6
        shadow-card
        border-0
        cursor-pointer
        transition-all
        duration-300
        ease-in-out
        overflow-hidden
        ${isExpanded ? 'shadow-gold' : 'hover:shadow-xl'}
        hover:scale-[1.02]
        hover:border
        hover:border-css-gold
        ${hasProhibited ? 'ring-2 ring-red-500/20' : ''}
      `}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Abbreviation with Gold Gradient */}
          <h3 className="text-4xl font-montserrat font-bold text-transparent bg-clip-text bg-gradient-gold mb-2">
            {abbreviation}
          </h3>

          {/* Meaning Count & Warning */}
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-muted-foreground">
              {meanings.length} meaning{meanings.length > 1 ? 's' : ''}
            </p>
            {hasWarning && (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
          </div>

          {/* Primary Meaning Highlight */}
          {primaryMeaning && !isExpanded && (
            <p className="text-sm font-medium text-foreground line-clamp-2 mt-2">
              {primaryMeaning}
            </p>
          )}
        </div>

        {/* Overall Danger Badge */}
        <div className="ml-4">
          <DangerBadge level={maxDangerLevel} />
        </div>
      </div>

      {/* Region Badges (Always Visible) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {uniqueRegions.map(region => (
          <span
            key={region}
            className={`px-2 py-1 rounded-full text-xs font-medium ${getRegionBadgeClass(region)} shadow-sm transition-all duration-300`}
          >
            {region}
          </span>
        ))}
      </div>

      {/* Meanings Section (Expandable) */}
      <div
        className={`
          space-y-3
          transition-all
          duration-300
          ease-in-out
          ${isExpanded ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0 overflow-hidden'}
        `}
      >
        {meanings.map((meaning, index) => {
          // Determine background styling based on danger level
          const meaningStyles = {
            safe: 'bg-css-grey-light border-l-4 border-green-400',
            caution: 'bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-400',
            prohibited: 'bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500'
          };

          return (
            <div
              key={index}
              className={`
                ${meaningStyles[meaning.dangerLevel]}
                p-4
                rounded-xl
                hover:bg-opacity-80
                transition-all
                duration-300
                space-y-3
              `}
            >
              {/* Term Name & Danger Badge */}
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-bold text-css-black dark:text-foreground flex-1">
                  {meaning.term}
                </h4>
                <DangerBadge level={meaning.dangerLevel} />
              </div>

              {/* Region and Specialty Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRegionBadgeClass(meaning.region)} bg-white dark:bg-gray-800 shadow-sm`}>
                  {meaning.region}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 text-css-black dark:text-foreground shadow-sm border border-css-gold/30">
                  {meaning.specialty}
                </span>
              </div>

              {/* Description (Visible when expanded) */}
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {meaning.description}
              </p>

              {/* Clinical Example */}
              {meaning.clinicalExample && (
                <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Clinical Example:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "{meaning.clinicalExample}"
                  </p>
                </div>
              )}

              {/* Common Misinterpretations */}
              {meaning.commonMisinterpretations && meaning.commonMisinterpretations.length > 0 && (
                <div className="bg-yellow-100/50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-300 dark:border-yellow-700">
                  <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Often confused with:
                  </p>
                  <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                    {meaning.commonMisinterpretations.map((misinterp, i) => (
                      <li key={i} className="ml-4 list-disc">{misinterp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Alternative (for prohibited) */}
              {meaning.dangerLevel === 'prohibited' && meaning.recommendedAlternative && (
                <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-300 dark:border-green-700">
                  <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Use Instead:
                  </p>
                  <p className="text-sm font-bold text-css-gold">
                    {meaning.recommendedAlternative}
                  </p>
                </div>
              )}

              {/* Additional Notes */}
              {meaning.notes && (
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-300 dark:border-blue-700">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> {meaning.notes}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer - Click Indicator */}
      <div className={`
        flex items-center justify-center gap-2
        mt-4 pt-4
        border-t border-css-grey-light
        transition-all duration-300
      `}>
        <span className="text-sm text-css-gold hover:text-css-gold-light font-medium transition-colors duration-300">
          {isExpanded ? 'Click to collapse' : 'Click for details'}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-css-gold transition-transform duration-300" />
        ) : (
          <ChevronDown className="h-4 w-4 text-css-gold transition-transform duration-300" />
        )}
      </div>

      {/* Prohibited Indicator Stripe (if any meaning is prohibited) */}
      {hasProhibited && (
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-red-500 to-red-700 rounded-r-2xl" />
      )}
    </div>
  );
}

// Export types for external use
export type { AbbreviationCardProps };
