// Medical Abbreviations Database with Regional Variations
// Based on research: 81% of abbreviations are ambiguous with avg 16 meanings each

export interface AbbreviationMeaning {
  definition: string;
  region: 'UK' | 'US' | 'AU' | 'Global' | 'NI'; // NI = Northern Ireland
  specialty?: string;
  dangerLevel?: 'safe' | 'caution' | 'dangerous'; // Based on Joint Commission guidelines
  context?: string;
  example?: string;
}

export interface MedicalAbbreviation {
  abbreviation: string;
  meanings: AbbreviationMeaning[];
  commonUsage?: string; // Most common interpretation
}

export const medicalAbbreviations: MedicalAbbreviation[] = [
  {
    abbreviation: "AC",
    commonUsage: "Before meals (ante cibum)",
    meanings: [
      {
        definition: "Before meals (ante cibum)",
        region: "Global",
        specialty: "Pharmacy",
        dangerLevel: "safe",
        context: "Medication timing",
        example: "Take medication AC"
      },
      {
        definition: "Acromioclavicular",
        region: "Global",
        specialty: "Orthopedics",
        dangerLevel: "safe",
        context: "Joint reference",
        example: "AC joint separation"
      },
      {
        definition: "Air Conditioning",
        region: "Global",
        specialty: "General",
        dangerLevel: "safe",
        context: "Environmental control"
      }
    ]
  },
  {
    abbreviation: "AE",
    commonUsage: "Accident & Emergency (UK/NI) / Adverse Event (US)",
    meanings: [
      {
        definition: "Accident & Emergency",
        region: "UK",
        specialty: "Emergency Medicine",
        dangerLevel: "safe",
        context: "UK/NI emergency department designation",
        example: "Patient presented to AE"
      },
      {
        definition: "Accident & Emergency",
        region: "NI",
        specialty: "Emergency Medicine",
        dangerLevel: "safe",
        context: "Northern Ireland HSC emergency department",
        example: "Transferred to AE at Royal Victoria"
      },
      {
        definition: "Adverse Event",
        region: "US",
        specialty: "Clinical Trials",
        dangerLevel: "caution",
        context: "Medication or treatment side effect",
        example: "Report all AEs within 24 hours"
      }
    ]
  },
  {
    abbreviation: "BID",
    commonUsage: "Twice daily",
    meanings: [
      {
        definition: "Twice daily (bis in die)",
        region: "Global",
        specialty: "Pharmacy",
        dangerLevel: "caution",
        context: "Medication dosing - can be confused with QID",
        example: "Administer medication BID"
      }
    ]
  },
  {
    abbreviation: "CA",
    commonUsage: "Multiple critical meanings - HIGH AMBIGUITY",
    meanings: [
      {
        definition: "Cardiac Arrest",
        region: "Global",
        specialty: "Emergency Medicine",
        dangerLevel: "dangerous",
        context: "Life-threatening emergency",
        example: "Patient had CA in ED"
      },
      {
        definition: "Carcinoma (Cancer)",
        region: "Global",
        specialty: "Oncology",
        dangerLevel: "dangerous",
        context: "Cancer diagnosis",
        example: "Diagnosed with breast CA"
      },
      {
        definition: "Calcium",
        region: "Global",
        specialty: "Laboratory",
        dangerLevel: "caution",
        context: "Lab values",
        example: "CA levels elevated"
      },
      {
        definition: "Coronary Artery",
        region: "Global",
        specialty: "Cardiology",
        dangerLevel: "safe",
        context: "Cardiac anatomy",
        example: "Left CA blockage"
      }
    ]
  },
  {
    abbreviation: "CCU",
    commonUsage: "Critical Care Unit (UK/NI) / Coronary Care Unit (US)",
    meanings: [
      {
        definition: "Critical Care Unit",
        region: "UK",
        specialty: "Intensive Care",
        dangerLevel: "safe",
        context: "General intensive care designation in UK",
        example: "Patient transferred to CCU"
      },
      {
        definition: "Critical Care Unit",
        region: "NI",
        specialty: "Intensive Care",
        dangerLevel: "safe",
        context: "Northern Ireland HSC intensive care",
        example: "Admitted to CCU at Belfast Trust"
      },
      {
        definition: "Coronary Care Unit",
        region: "US",
        specialty: "Cardiology",
        dangerLevel: "safe",
        context: "Cardiac-specific intensive care in US",
        example: "Post-MI patient in CCU"
      }
    ]
  },
  {
    abbreviation: "ED",
    commonUsage: "Emergency Department",
    meanings: [
      {
        definition: "Emergency Department",
        region: "Global",
        specialty: "Emergency Medicine",
        dangerLevel: "safe",
        context: "Modern global term for emergency services",
        example: "Patient presented to ED"
      },
      {
        definition: "Erectile Dysfunction",
        region: "Global",
        specialty: "Urology",
        dangerLevel: "caution",
        context: "Medical condition - context dependent",
        example: "Patient complains of ED"
      }
    ]
  },
  {
    abbreviation: "GP",
    commonUsage: "General Practitioner",
    meanings: [
      {
        definition: "General Practitioner",
        region: "UK",
        specialty: "Primary Care",
        dangerLevel: "safe",
        context: "Primary care physician in UK/NI",
        example: "Referred by GP"
      },
      {
        definition: "General Practitioner",
        region: "NI",
        specialty: "Primary Care",
        dangerLevel: "safe",
        context: "Northern Ireland HSC primary care doctor",
        example: "GP surgery appointment"
      },
      {
        definition: "General Practitioner",
        region: "AU",
        specialty: "Primary Care",
        dangerLevel: "safe",
        context: "Primary care physician in Australia",
        example: "See your GP"
      }
    ]
  },
  {
    abbreviation: "HSC",
    commonUsage: "Health and Social Care (Northern Ireland)",
    meanings: [
      {
        definition: "Health and Social Care",
        region: "NI",
        specialty: "General",
        dangerLevel: "safe",
        context: "Northern Ireland's integrated health and social care system",
        example: "HSC Trust employs both health and social care staff"
      },
      {
        definition: "Health Service Commission",
        region: "UK",
        specialty: "Administration",
        dangerLevel: "safe",
        context: "UK health oversight body"
      }
    ]
  },
  {
    abbreviation: "ICU",
    commonUsage: "Intensive Care Unit",
    meanings: [
      {
        definition: "Intensive Care Unit",
        region: "Global",
        specialty: "Critical Care",
        dangerLevel: "safe",
        context: "Critical care ward",
        example: "Patient admitted to ICU"
      }
    ]
  },
  {
    abbreviation: "MI",
    commonUsage: "Myocardial Infarction (Heart Attack)",
    meanings: [
      {
        definition: "Myocardial Infarction",
        region: "Global",
        specialty: "Cardiology",
        dangerLevel: "dangerous",
        context: "Heart attack - medical emergency",
        example: "Patient presented with acute MI"
      },
      {
        definition: "Mitral Insufficiency",
        region: "Global",
        specialty: "Cardiology",
        dangerLevel: "caution",
        context: "Heart valve condition",
        example: "Diagnosed with mild MI"
      }
    ]
  },
  {
    abbreviation: "MS",
    commonUsage: "Multiple meanings - context critical",
    meanings: [
      {
        definition: "Multiple Sclerosis",
        region: "Global",
        specialty: "Neurology",
        dangerLevel: "safe",
        context: "Neurological condition",
        example: "Patient with MS diagnosis"
      },
      {
        definition: "Mitral Stenosis",
        region: "Global",
        specialty: "Cardiology",
        dangerLevel: "caution",
        context: "Heart valve narrowing",
        example: "Severe MS requiring surgery"
      },
      {
        definition: "Morphine Sulphate",
        region: "Global",
        specialty: "Pharmacy",
        dangerLevel: "dangerous",
        context: "Pain medication - controlled substance",
        example: "Administer MS 10mg IV"
      },
      {
        definition: "Mental Status",
        region: "Global",
        specialty: "Psychiatry",
        dangerLevel: "safe",
        context: "Cognitive assessment",
        example: "MS examination shows confusion"
      }
    ]
  },
  {
    abbreviation: "NBM",
    commonUsage: "Nil By Mouth (UK/NI)",
    meanings: [
      {
        definition: "Nil By Mouth",
        region: "UK",
        specialty: "Surgery",
        dangerLevel: "caution",
        context: "Pre-operative fasting instruction",
        example: "Patient NBM from midnight"
      },
      {
        definition: "Nil By Mouth",
        region: "NI",
        specialty: "Surgery",
        dangerLevel: "caution",
        context: "Northern Ireland HSC pre-op protocol",
        example: "NBM for theatre tomorrow"
      }
    ]
  },
  {
    abbreviation: "NPO",
    commonUsage: "Nothing by mouth (US equivalent of NBM)",
    meanings: [
      {
        definition: "Nothing by mouth (nil per os)",
        region: "US",
        specialty: "Surgery",
        dangerLevel: "caution",
        context: "Pre-operative fasting - US term",
        example: "Patient NPO after midnight"
      },
      {
        definition: "Nothing by mouth (nil per os)",
        region: "Global",
        specialty: "Surgery",
        dangerLevel: "caution",
        context: "International medical term",
        example: "Keep NPO for procedure"
      }
    ]
  },
  {
    abbreviation: "OD",
    commonUsage: "DANGEROUS - Multiple critical meanings",
    meanings: [
      {
        definition: "Once daily (omni die)",
        region: "Global",
        specialty: "Pharmacy",
        dangerLevel: "dangerous",
        context: "Medication frequency - Joint Commission 'Do Not Use' list",
        example: "Take medication OD"
      },
      {
        definition: "Right eye (oculus dexter)",
        region: "Global",
        specialty: "Ophthalmology",
        dangerLevel: "dangerous",
        context: "Eye designation - easily confused",
        example: "Apply drops to OD"
      },
      {
        definition: "Overdose",
        region: "Global",
        specialty: "Emergency Medicine",
        dangerLevel: "dangerous",
        context: "Drug toxicity emergency",
        example: "Patient presents with OD"
      }
    ]
  },
  {
    abbreviation: "PC",
    commonUsage: "After meals (post cibum)",
    meanings: [
      {
        definition: "After meals (post cibum)",
        region: "Global",
        specialty: "Pharmacy",
        dangerLevel: "safe",
        context: "Medication timing",
        example: "Take PC"
      },
      {
        definition: "Presenting Complaint",
        region: "UK",
        specialty: "General",
        dangerLevel: "safe",
        context: "Chief complaint in UK medical notes",
        example: "PC: chest pain"
      }
    ]
  },
  {
    abbreviation: "PRN",
    commonUsage: "As needed (pro re nata)",
    meanings: [
      {
        definition: "As needed (pro re nata)",
        region: "Global",
        specialty: "Pharmacy",
        dangerLevel: "safe",
        context: "Medication frequency",
        example: "Pain relief PRN"
      }
    ]
  },
  {
    abbreviation: "QID",
    commonUsage: "Four times daily",
    meanings: [
      {
        definition: "Four times daily (quater in die)",
        region: "Global",
        specialty: "Pharmacy",
        dangerLevel: "caution",
        context: "Medication dosing - can be confused with QD",
        example: "Administer QID"
      }
    ]
  },
  {
    abbreviation: "TID",
    commonUsage: "Three times daily",
    meanings: [
      {
        definition: "Three times daily (ter in die)",
        region: "Global",
        specialty: "Pharmacy",
        dangerLevel: "safe",
        context: "Medication dosing",
        example: "Take TID with meals"
      }
    ]
  },
  {
    abbreviation: "U",
    commonUsage: "BANNED - Joint Commission 'Do Not Use'",
    meanings: [
      {
        definition: "Unit (BANNED - write 'unit' instead)",
        region: "Global",
        specialty: "Pharmacy",
        dangerLevel: "dangerous",
        context: "Joint Commission banned - mistaken for '0' or '4'",
        example: "NEVER USE: 10U insulin. Write: 10 units"
      }
    ]
  },
  {
    abbreviation: "μg",
    commonUsage: "DANGEROUS - Write 'mcg' instead",
    meanings: [
      {
        definition: "Microgram (use 'mcg' instead)",
        region: "Global",
        specialty: "Pharmacy",
        dangerLevel: "dangerous",
        context: "Symbol easily mistaken for 'mg' - 1000x dose error",
        example: "NEVER USE: 100μg. Write: 100 mcg"
      }
    ]
  }
];

// Pre-computed lists for filters
export const regions = ['Global', 'UK', 'US', 'AU', 'NI'] as const;
export const specialties = [
  'All Specialties',
  'Emergency Medicine',
  'Pharmacy',
  'Cardiology',
  'Orthopedics',
  'Oncology',
  'Laboratory',
  'Intensive Care',
  'Primary Care',
  'Surgery',
  'Ophthalmology',
  'Neurology',
  'Psychiatry',
  'Urology',
  'Clinical Trials',
  'Administration',
  'General'
] as const;

export const dangerLevels = ['safe', 'caution', 'dangerous'] as const;

// Helper function to search abbreviations
export function searchAbbreviations(
  query: string,
  region?: string,
  specialty?: string,
  dangerLevel?: string
): MedicalAbbreviation[] {
  const lowerQuery = query.toLowerCase().trim();

  return medicalAbbreviations.filter(abbr => {
    // Text search
    const matchesSearch =
      abbr.abbreviation.toLowerCase().includes(lowerQuery) ||
      abbr.commonUsage?.toLowerCase().includes(lowerQuery) ||
      abbr.meanings.some(m => m.definition.toLowerCase().includes(lowerQuery));

    if (!matchesSearch) return false;

    // Region filter
    if (region && region !== 'Global') {
      const hasRegion = abbr.meanings.some(m =>
        m.region === region || m.region === 'Global'
      );
      if (!hasRegion) return false;
    }

    // Specialty filter
    if (specialty && specialty !== 'All Specialties') {
      const hasSpecialty = abbr.meanings.some(m => m.specialty === specialty);
      if (!hasSpecialty) return false;
    }

    // Danger level filter
    if (dangerLevel) {
      const hasDangerLevel = abbr.meanings.some(m => m.dangerLevel === dangerLevel);
      if (!hasDangerLevel) return false;
    }

    return true;
  });
}
