/**
 * Mock data for testing Medical Abbreviations feature
 * Contains representative test cases for different scenarios
 */

import type { MedicalAbbreviation, AbbreviationMeaning } from '@/types/medicalAbbreviations';

// Mock abbreviations for testing
export const mockAbbreviations: MedicalAbbreviation[] = [
  {
    abbr: 'MI',
    primaryMeaning: 'Myocardial Infarction (Heart Attack)',
    overallRisk: 'caution',
    searchTerms: ['heart attack', 'cardiac', 'infarction'],
    meanings: [
      {
        term: 'Myocardial Infarction',
        region: 'Global',
        specialty: 'Cardiology',
        dangerLevel: 'safe',
        description: 'Heart attack caused by blocked blood flow to the heart muscle, resulting in tissue damage',
        clinicalExample: 'Patient presented with chest pain and elevated troponin, diagnosed with acute MI',
        notes: 'Most common meaning in cardiology context'
      },
      {
        term: 'Mitral Insufficiency',
        region: 'US',
        specialty: 'Cardiology',
        dangerLevel: 'caution',
        description: 'Valve disorder where the mitral valve does not close properly, allowing blood to flow backward',
        clinicalExample: 'Echocardiogram revealed severe MI with regurgitant fraction of 45%',
        notes: 'Less common but important cardiac meaning'
      }
    ]
  },
  {
    abbr: 'MS',
    primaryMeaning: 'Multiple meanings - HIGH RISK',
    overallRisk: 'prohibited',
    searchTerms: ['morphine', 'sclerosis', 'magnesium'],
    meanings: [
      {
        term: 'Multiple Sclerosis',
        region: 'Global',
        specialty: 'Neurology',
        dangerLevel: 'caution',
        description: 'Autoimmune disease affecting the central nervous system by damaging myelin sheaths',
        clinicalExample: 'MRI showed demyelinating lesions consistent with MS diagnosis',
        notes: 'Most common meaning in neurology'
      },
      {
        term: 'Morphine Sulfate',
        region: 'US',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED by Joint Commission - Can be confused with magnesium sulfate or mitral stenosis',
        commonMisinterpretations: ['Mitral Stenosis', 'Magnesium Sulfate', 'Multiple Sclerosis'],
        recommendedAlternative: 'Write "morphine sulfate" in full',
        notes: 'Has caused fatal medication errors'
      },
      {
        term: 'Mitral Stenosis',
        region: 'Global',
        specialty: 'Cardiology',
        dangerLevel: 'caution',
        description: 'Narrowing of the mitral valve opening',
        clinicalExample: 'Patient with rheumatic heart disease developed severe MS',
      },
      {
        term: 'Magnesium Sulfate',
        region: 'US',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED - Easily confused with morphine sulfate',
        recommendedAlternative: 'Write "magnesium sulfate" in full',
      }
    ]
  },
  {
    abbr: 'CA',
    primaryMeaning: 'Multiple meanings - verify context',
    overallRisk: 'caution',
    searchTerms: ['cancer', 'cardiac arrest', 'calcium'],
    meanings: [
      {
        term: 'Cardiac Arrest',
        region: 'Global',
        specialty: 'Emergency Medicine',
        dangerLevel: 'safe',
        description: 'Sudden loss of heart function, breathing, and consciousness',
        clinicalExample: 'Patient experienced CA in emergency department, CPR initiated immediately',
      },
      {
        term: 'Cancer',
        region: 'Global',
        specialty: 'Oncology',
        dangerLevel: 'caution',
        description: 'Malignant tumor or carcinoma',
        clinicalExample: 'Biopsy confirmed CA of the lung, stage IIIA',
        commonMisinterpretations: ['Cardiac Arrest', 'Calcium']
      },
      {
        term: 'Calcium',
        region: 'Global',
        specialty: 'Laboratory',
        dangerLevel: 'caution',
        description: 'Chemical element and electrolyte measured in blood tests',
        clinicalExample: 'Serum CA level elevated at 11.2 mg/dL',
      }
    ]
  },
  {
    abbr: 'BP',
    primaryMeaning: 'Blood Pressure',
    overallRisk: 'safe',
    searchTerms: ['blood pressure', 'hypertension'],
    meanings: [
      {
        term: 'Blood Pressure',
        region: 'Global',
        specialty: 'Cardiology',
        dangerLevel: 'safe',
        description: 'Force of blood against artery walls, measured in mmHg',
        clinicalExample: 'Patient\'s BP was 140/90 mmHg on presentation',
      }
    ]
  },
  {
    abbr: 'U',
    primaryMeaning: 'PROHIBITED - Do Not Use',
    overallRisk: 'prohibited',
    searchTerms: ['unit', 'units'],
    meanings: [
      {
        term: 'Unit',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED by Joint Commission - Mistaken for "0" (zero), "4" (four), or "cc"',
        commonMisinterpretations: ['Mistaken for 0', 'Mistaken for 4', 'Mistaken for cc'],
        recommendedAlternative: 'Write "unit" in full',
        notes: 'Joint Commission official "Do Not Use" list'
      }
    ]
  }
];

// Mock statistics for testing
export const mockStats = {
  totalAbbreviations: 5,
  ambiguousCount: 3,
  prohibitedCount: 3,
  avgMeaningsPerAbbr: 2.0
};

// Single abbreviation for detailed testing
export const mockSingleAbbreviation: MedicalAbbreviation = mockAbbreviations[0];

// Prohibited abbreviation for warning tests
export const mockProhibitedAbbreviation: MedicalAbbreviation = mockAbbreviations[1];

// Safe abbreviation for safety tests
export const mockSafeAbbreviation: MedicalAbbreviation = mockAbbreviations[3];
