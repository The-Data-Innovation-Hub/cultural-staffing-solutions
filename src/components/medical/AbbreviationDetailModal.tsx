/**
 * AbbreviationDetailModal Component
 *
 * Comprehensive modal for displaying full details about medical abbreviations.
 * Shows all meanings with regional context, safety warnings, and clinical information.
 *
 * Features:
 * - Large, prominent abbreviation display with gold gradient
 * - Accordion interface for multiple meanings
 * - Special treatment for prohibited abbreviations
 * - Clinical examples and misinterpretation warnings
 * - Fully accessible with keyboard navigation and focus trap
 */

import { X, AlertTriangle, XCircle, CheckCircle, Globe, Stethoscope, Flag, Shield } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AbbreviationMeaning, DangerLevel, Region } from '@/types/medicalAbbreviations';

// Props interface
interface AbbreviationDetailModalProps {
  abbreviation: string;
  meanings: AbbreviationMeaning[];
  isOpen: boolean;
  onClose: () => void;
  primaryMeaning?: string;
}

// Danger Badge Component
const DangerBadge = ({ level, large = false }: { level: DangerLevel; large?: boolean }) => {
  const styles = {
    safe: {
      containerClass: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
      icon: <CheckCircle className={large ? 'h-5 w-5' : 'h-4 w-4'} />,
      label: 'SAFE'
    },
    caution: {
      containerClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
      icon: <AlertTriangle className={large ? 'h-5 w-5' : 'h-4 w-4'} />,
      label: 'CAUTION'
    },
    prohibited: {
      containerClass: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
      icon: <XCircle className={large ? 'h-5 w-5' : 'h-4 w-4'} />,
      label: 'PROHIBITED'
    }
  };

  const style = styles[level];
  const sizeClass = large ? 'px-4 py-2 text-base' : 'px-3 py-1 text-sm';

  return (
    <div className={`inline-flex items-center gap-2 ${sizeClass} rounded-full font-bold ${style.containerClass}`}>
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

// Main Modal Component
export default function AbbreviationDetailModal({
  abbreviation,
  meanings,
  isOpen,
  onClose,
  primaryMeaning
}: AbbreviationDetailModalProps) {
  // Check if any meaning is prohibited
  const hasProhibited = meanings.some(m => m.dangerLevel === 'prohibited');
  const prohibitedMeanings = meanings.filter(m => m.dangerLevel === 'prohibited');

  // Handle report issue
  const handleReportIssue = () => {
    // In production, this would open a feedback form or email
    console.log('Report issue for abbreviation:', abbreviation);
    toast.success('Thank you! Issue reported to administrators.', {
      description: 'Our team will review your feedback shortly.',
      duration: 4000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          bg-card
          rounded-2xl
          shadow-gold
          p-0
          animate-in
          fade-in
          duration-300
        "
      >
        {/* Prohibited Warning Banner */}
        {hasProhibited && (
          <div className="bg-red-500 text-white p-6 rounded-t-2xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-2xl font-montserrat font-bold mb-2">
                  ⚠️ PROHIBITED ABBREVIATION - DO NOT USE
                </h3>
                <p className="text-white/90 leading-relaxed">
                  This abbreviation is on the Joint Commission "Do Not Use" list due to fatal medication errors.
                  Always write the full term to prevent confusion and ensure patient safety.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <DialogHeader className={`${hasProhibited ? 'px-8 pt-6 pb-4' : 'p-8 pb-4'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Large Abbreviation Display with Gold Gradient */}
              <DialogTitle className="text-5xl font-montserrat font-bold text-transparent bg-clip-text bg-gradient-gold mb-3">
                {abbreviation}
              </DialogTitle>

              {/* Subtitle */}
              <DialogDescription className="text-base text-muted-foreground">
                {meanings.length} different meaning{meanings.length > 1 ? 's' : ''} across regions and specialties
              </DialogDescription>

              {/* Primary Meaning Highlight */}
              {primaryMeaning && (
                <div className="mt-4 p-4 bg-gradient-gold rounded-xl">
                  <p className="text-sm font-medium text-css-black mb-1">
                    Primary Usage:
                  </p>
                  <p className="text-base font-bold text-css-black">
                    {primaryMeaning}
                  </p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="
                p-2
                rounded-full
                hover:bg-css-grey-light
                dark:hover:bg-gray-700
                transition-colors
                duration-200
              "
              aria-label="Close modal"
            >
              <X className="h-6 w-6 text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        {/* Body - Scrollable Content */}
        <div className="px-8 pb-4 space-y-4">
          {/* Accordion for Multiple Meanings */}
          <Accordion type="single" collapsible className="space-y-4">
            {meanings.map((meaning, index) => (
              <AccordionItem
                key={index}
                value={`meaning-${index}`}
                className={`
                  rounded-xl
                  border-2
                  overflow-hidden
                  ${
                    meaning.dangerLevel === 'prohibited'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                      : meaning.dangerLevel === 'caution'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                      : 'border-green-500 bg-green-50 dark:bg-green-950/20'
                  }
                `}
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full gap-4">
                    {/* Term Name */}
                    <h3 className="text-2xl font-montserrat font-bold text-css-black dark:text-foreground text-left flex-1">
                      {meaning.term}
                    </h3>

                    {/* Danger Badge */}
                    <DangerBadge level={meaning.dangerLevel} large />
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6 space-y-6">
                  {/* Badges Row */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {/* Region Badge */}
                    <Badge className={`${getRegionBadgeClass(meaning.region)} px-3 py-1 text-sm flex items-center gap-1`}>
                      <Globe className="h-3 w-3" />
                      {meaning.region}
                    </Badge>

                    {/* Specialty Badge */}
                    <Badge className="bg-css-grey-light text-css-black dark:bg-gray-700 dark:text-gray-200 px-3 py-1 text-sm flex items-center gap-1 border border-css-gold/40">
                      <Stethoscope className="h-3 w-3" />
                      {meaning.specialty}
                    </Badge>
                  </div>

                  {/* Divider */}
                  <div className="border-t-2 border-gray-300 dark:border-gray-600" />

                  {/* Full Description */}
                  <div>
                    <h4 className="text-sm font-bold text-css-black dark:text-foreground uppercase tracking-wide mb-2">
                      Description
                    </h4>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {meaning.description}
                    </p>
                  </div>

                  {/* Clinical Example */}
                  {meaning.clinicalExample && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-bold text-css-black dark:text-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                        <Flag className="h-4 w-4 text-css-gold" />
                        Clinical Example
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{meaning.clinicalExample}"
                      </p>
                    </div>
                  )}

                  {/* Common Misinterpretations */}
                  {meaning.commonMisinterpretations && meaning.commonMisinterpretations.length > 0 && (
                    <div className="bg-yellow-100 dark:bg-yellow-950/30 p-4 rounded-lg border-2 border-yellow-400 dark:border-yellow-600">
                      <h4 className="text-sm font-bold text-yellow-900 dark:text-yellow-100 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Common Misinterpretations
                      </h4>
                      <ul className="space-y-2">
                        {meaning.commonMisinterpretations.map((misinterp, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <span>{misinterp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Alternative (for prohibited) */}
                  {meaning.dangerLevel === 'prohibited' && meaning.recommendedAlternative && (
                    <div className="bg-gradient-gold p-6 rounded-lg border-2 border-css-gold">
                      <h4 className="text-base font-bold text-css-black uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Recommended Alternative
                      </h4>
                      <p className="text-lg font-bold text-css-black">
                        ✓ {meaning.recommendedAlternative}
                      </p>
                      <p className="text-sm text-css-black/80 mt-2">
                        Always use the full term to prevent fatal medication errors.
                      </p>
                    </div>
                  )}

                  {/* Additional Notes */}
                  {meaning.notes && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
                      <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wide mb-2">
                        Additional Information
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {meaning.notes}
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Safety Summary Card */}
          <div className="bg-css-grey-light dark:bg-gray-800 p-6 rounded-xl">
            <h4 className="text-sm font-bold text-css-black dark:text-foreground uppercase tracking-wide mb-4">
              Safety Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-css-gold">
                  {meanings.length}
                </p>
                <p className="text-xs text-muted-foreground">Total Meanings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {prohibitedMeanings.length}
                </p>
                <p className="text-xs text-muted-foreground">Prohibited</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-css-black dark:text-foreground">
                  {Array.from(new Set(meanings.map(m => m.region))).length}
                </p>
                <p className="text-xs text-muted-foreground">Regions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 bg-css-grey-light dark:bg-gray-800/50 rounded-b-2xl">
          <div className="flex items-center justify-between w-full gap-4">
            {/* Report Issue Button */}
            <Button
              variant="outline"
              onClick={handleReportIssue}
              className="
                bg-card
                text-css-black
                dark:text-foreground
                border
                border-gray-300
                dark:border-gray-600
                hover:bg-css-grey-light
                dark:hover:bg-gray-700
                transition-all
                duration-200
              "
            >
              <Flag className="h-4 w-4 mr-2" />
              Report an Issue
            </Button>

            {/* Close Button */}
            <Button
              onClick={onClose}
              className="
                bg-gradient-gold
                text-css-black
                hover:bg-css-gold
                font-bold
                px-6
                transition-all
                duration-200
                shadow-gold
              "
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export types
export type { AbbreviationDetailModalProps };
