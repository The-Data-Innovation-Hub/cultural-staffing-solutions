/**
 * Medical Abbreviations Type Definitions
 *
 * Based on research:
 * - 30-50% of clinical text contains abbreviations
 * - 81% of abbreviations are ambiguous (avg 16 meanings each)
 * - Regional differences cause significant confusion
 * - Joint Commission maintains "Do Not Use" list for patient safety
 */

export type Region = 'US' | 'UK' | 'Australia' | 'Global' | 'Canada' | 'Northern Ireland';

export type Specialty =
  | 'Cardiology'
  | 'Neurology'
  | 'Emergency Medicine'
  | 'Pharmacy'
  | 'Laboratory'
  | 'Oncology'
  | 'Radiology'
  | 'Surgery'
  | 'Pediatrics'
  | 'Obstetrics'
  | 'Psychiatry'
  | 'Orthopedics'
  | 'Pulmonology'
  | 'Gastroenterology'
  | 'Endocrinology'
  | 'Hematology'
  | 'Nephrology'
  | 'Infectious Disease'
  | 'General Medicine'
  | 'Critical Care'
  | 'Primary Care'
  | 'Urology'
  | 'Dermatology'
  | 'Ophthalmology';

export type DangerLevel =
  | 'safe'        // No known confusion risk
  | 'caution'     // Context-dependent, potential for misinterpretation
  | 'prohibited'; // Joint Commission "Do Not Use" list

export interface AbbreviationMeaning {
  /** Full expansion of the abbreviation */
  term: string;

  /** Geographic region where this meaning is used */
  region: Region;

  /** Medical specialty context */
  specialty: Specialty;

  /** Safety level based on confusion risk */
  dangerLevel: DangerLevel;

  /** Detailed clinical explanation */
  description: string;

  /** Common ways this abbreviation is misinterpreted */
  commonMisinterpretations?: string[];

  /** Recommended alternative for prohibited abbreviations */
  recommendedAlternative?: string;

  /** Clinical example usage */
  clinicalExample?: string;

  /** Additional context or notes */
  notes?: string;
}

export interface MedicalAbbreviation {
  /** The abbreviation itself */
  abbr: string;

  /** All possible meanings across regions and specialties */
  meanings: AbbreviationMeaning[];

  /** Most commonly used interpretation (if applicable) */
  primaryMeaning?: string;

  /** Overall risk level (highest danger level among all meanings) */
  overallRisk?: DangerLevel;

  /** Additional search terms */
  searchTerms?: string[];
}

export interface AbbreviationFilters {
  region?: Region;
  specialty?: Specialty;
  dangerLevel?: DangerLevel;
  searchQuery?: string;
}

export interface AbbreviationStats {
  totalAbbreviations: number;
  safeCount: number;
  cautionCount: number;
  prohibitedCount: number;
  ambiguousCount: number;
  avgMeaningsPerAbbr: number;
}
