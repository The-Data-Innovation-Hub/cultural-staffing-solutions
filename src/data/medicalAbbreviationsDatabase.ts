/**
 * Medical Abbreviations Database
 *
 * Comprehensive database of medical abbreviations with regional variations,
 * safety classifications, and contextual information.
 *
 * Sources:
 * - Joint Commission "Do Not Use" List
 * - ISMP List of Error-Prone Abbreviations
 * - NHS Clinical Abbreviations
 * - Regional healthcare system variations (US, UK, AU, CA, NI)
 */

import type { MedicalAbbreviation, DangerLevel } from '@/types/medicalAbbreviations';

export const medicalAbbreviationsDatabase: MedicalAbbreviation[] = [
  // ========== JOINT COMMISSION PROHIBITED ABBREVIATIONS ==========
  {
    abbr: 'U',
    primaryMeaning: 'PROHIBITED - Unit',
    overallRisk: 'prohibited',
    meanings: [
      {
        term: 'Unit',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED by Joint Commission - Mistaken for "0" (zero), the number "4" (four), or "cc"',
        commonMisinterpretations: ['Zero (0)', 'Four (4)', 'cc'],
        recommendedAlternative: 'Write "unit" in full',
        clinicalExample: 'WRONG: 10U insulin | CORRECT: 10 units insulin',
        notes: 'This abbreviation has caused fatal medication errors'
      }
    ]
  },
  {
    abbr: 'IU',
    primaryMeaning: 'PROHIBITED - International Unit',
    overallRisk: 'prohibited',
    meanings: [
      {
        term: 'International Unit',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED by Joint Commission - Mistaken for IV (intravenous) or the number 10',
        commonMisinterpretations: ['IV (intravenous)', 'Number 10'],
        recommendedAlternative: 'Write "international unit" in full',
        clinicalExample: 'WRONG: Vitamin D 400IU | CORRECT: Vitamin D 400 international units'
      }
    ]
  },
  {
    abbr: 'µg',
    primaryMeaning: 'PROHIBITED - Microgram',
    overallRisk: 'prohibited',
    meanings: [
      {
        term: 'Microgram',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED - Symbol mistaken for "mg" (milligrams) resulting in 1000-fold dosing errors',
        commonMisinterpretations: ['mg (milligram) - 1000x overdose risk'],
        recommendedAlternative: 'Write "mcg" or "microgram"',
        clinicalExample: 'WRONG: 100µg | CORRECT: 100 mcg',
        notes: 'Has caused fatal overdoses'
      }
    ]
  },
  {
    abbr: 'QD',
    primaryMeaning: 'PROHIBITED - Once daily',
    overallRisk: 'prohibited',
    meanings: [
      {
        term: 'Once daily (quaque die)',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED - Mistaken for QID (four times daily) or OD',
        commonMisinterpretations: ['QID (four times daily)', 'OD (right eye)'],
        recommendedAlternative: 'Write "daily"',
        clinicalExample: 'WRONG: Take medication QD | CORRECT: Take medication daily'
      }
    ]
  },
  {
    abbr: 'QOD',
    primaryMeaning: 'PROHIBITED - Every other day',
    overallRisk: 'prohibited',
    meanings: [
      {
        term: 'Every other day (quaque altera die)',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED - Mistaken for QD (daily) or QID (four times daily)',
        commonMisinterpretations: ['QD (daily)', 'QID (four times daily)'],
        recommendedAlternative: 'Write "every other day"',
        clinicalExample: 'WRONG: Take QOD | CORRECT: Take every other day'
      }
    ]
  },
  {
    abbr: 'SC',
    primaryMeaning: 'PROHIBITED - Subcutaneous',
    overallRisk: 'prohibited',
    meanings: [
      {
        term: 'Subcutaneous',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED - Mistaken for SL (sublingual) or "5C"',
        commonMisinterpretations: ['SL (sublingual)', '5C'],
        recommendedAlternative: 'Write "subcut" or "subcutaneous"',
        clinicalExample: 'WRONG: Insulin SC | CORRECT: Insulin subcutaneous'
      }
    ]
  },
  {
    abbr: 'TIW',
    primaryMeaning: 'PROHIBITED - Three times a week',
    overallRisk: 'prohibited',
    meanings: [
      {
        term: 'Three times a week',
        region: 'US',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED - Mistaken for "three times a day" or "twice a week"',
        commonMisinterpretations: ['Three times a day', 'Twice a week'],
        recommendedAlternative: 'Write "3 times weekly"',
        clinicalExample: 'WRONG: Dialysis TIW | CORRECT: Dialysis 3 times weekly'
      }
    ]
  },

  // ========== HIGHLY AMBIGUOUS ABBREVIATIONS ==========
  {
    abbr: 'MS',
    primaryMeaning: 'Multiple meanings - HIGH RISK',
    overallRisk: 'prohibited',
    meanings: [
      {
        term: 'Multiple Sclerosis',
        region: 'Global',
        specialty: 'Neurology',
        dangerLevel: 'caution',
        description: 'Autoimmune disease affecting central nervous system myelin',
        clinicalExample: 'Patient with relapsing-remitting MS on disease-modifying therapy',
        notes: 'Most common interpretation in neurology'
      },
      {
        term: 'Morphine Sulfate',
        region: 'US',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED when used for morphine sulfate - Can be confused with magnesium sulfate or mitral stenosis',
        commonMisinterpretations: ['Mitral Stenosis', 'Magnesium Sulfate', 'Multiple Sclerosis'],
        recommendedAlternative: 'Write "morphine sulfate" in full',
        clinicalExample: 'WRONG: MS 10mg IV | CORRECT: Morphine sulfate 10mg IV',
        notes: 'Has caused fatal medication errors'
      },
      {
        term: 'Mitral Stenosis',
        region: 'Global',
        specialty: 'Cardiology',
        dangerLevel: 'caution',
        description: 'Narrowing of the mitral valve opening, often from rheumatic fever',
        clinicalExample: 'Echo shows severe MS with valve area 0.9 cm²'
      },
      {
        term: 'Magnesium Sulfate',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'caution',
        description: 'Medication for eclampsia prevention and hypomagnesemia',
        clinicalExample: 'Pre-eclampsia protocol: MgSO₄ loading dose'
      }
    ]
  },
  {
    abbr: 'MI',
    primaryMeaning: 'Context-dependent',
    overallRisk: 'caution',
    meanings: [
      {
        term: 'Myocardial Infarction',
        region: 'Global',
        specialty: 'Cardiology',
        dangerLevel: 'caution',
        description: 'Heart attack - death of heart muscle due to ischemia',
        clinicalExample: 'Patient presenting with acute anterior STEMI',
        notes: 'Most common interpretation - medical emergency'
      },
      {
        term: 'Mitral Insufficiency',
        region: 'Global',
        specialty: 'Cardiology',
        dangerLevel: 'caution',
        description: 'Mitral regurgitation - backflow through mitral valve',
        clinicalExample: 'Echo shows moderate MI with dilated left atrium',
        commonMisinterpretations: ['Myocardial Infarction']
      },
      {
        term: 'Mental Illness',
        region: 'Global',
        specialty: 'Psychiatry',
        dangerLevel: 'safe',
        description: 'General term for psychiatric conditions',
        clinicalExample: 'History of MI requiring psychiatric care'
      }
    ]
  },
  {
    abbr: 'CA',
    primaryMeaning: 'Multiple critical meanings',
    overallRisk: 'caution',
    meanings: [
      {
        term: 'Cardiac Arrest',
        region: 'Global',
        specialty: 'Emergency Medicine',
        dangerLevel: 'caution',
        description: 'Sudden loss of heart function - medical emergency',
        clinicalExample: 'Patient had witnessed CA, CPR started immediately',
        notes: 'Life-threatening emergency'
      },
      {
        term: 'Cancer/Carcinoma',
        region: 'Global',
        specialty: 'Oncology',
        dangerLevel: 'caution',
        description: 'Malignant neoplasm',
        clinicalExample: 'Breast CA with lymph node involvement',
        commonMisinterpretations: ['Cardiac Arrest', 'Calcium']
      },
      {
        term: 'Calcium',
        region: 'Global',
        specialty: 'Laboratory',
        dangerLevel: 'safe',
        description: 'Serum calcium level',
        clinicalExample: 'CA 11.2 mg/dL (elevated)',
        notes: 'Usually clear from context'
      },
      {
        term: 'Coronary Artery',
        region: 'Global',
        specialty: 'Cardiology',
        dangerLevel: 'safe',
        description: 'Blood vessels supplying the heart',
        clinicalExample: 'Left CA 90% stenosis'
      }
    ]
  },
  {
    abbr: 'RA',
    primaryMeaning: 'Multiple meanings',
    overallRisk: 'caution',
    meanings: [
      {
        term: 'Rheumatoid Arthritis',
        region: 'Global',
        specialty: 'Orthopedics',
        dangerLevel: 'safe',
        description: 'Autoimmune inflammatory arthritis',
        clinicalExample: 'Seropositive RA with joint deformities'
      },
      {
        term: 'Right Atrium',
        region: 'Global',
        specialty: 'Cardiology',
        dangerLevel: 'caution',
        description: 'Upper right chamber of the heart',
        clinicalExample: 'Enlarged RA on echocardiogram',
        commonMisinterpretations: ['Rheumatoid Arthritis']
      },
      {
        term: 'Room Air',
        region: 'Global',
        specialty: 'Pulmonology',
        dangerLevel: 'safe',
        description: 'Breathing without supplemental oxygen',
        clinicalExample: 'SpO₂ 92% on RA'
      }
    ]
  },
  {
    abbr: 'PE',
    primaryMeaning: 'Context-dependent emergency',
    overallRisk: 'caution',
    meanings: [
      {
        term: 'Pulmonary Embolism',
        region: 'Global',
        specialty: 'Pulmonology',
        dangerLevel: 'caution',
        description: 'Blood clot in lung arteries - medical emergency',
        clinicalExample: 'CTPA confirms bilateral PE',
        notes: 'Life-threatening condition'
      },
      {
        term: 'Physical Examination',
        region: 'Global',
        specialty: 'General Medicine',
        dangerLevel: 'safe',
        description: 'Clinical assessment by healthcare provider',
        clinicalExample: 'PE reveals decreased breath sounds',
        commonMisinterpretations: ['Pulmonary Embolism']
      },
      {
        term: 'Pleural Effusion',
        region: 'Global',
        specialty: 'Pulmonology',
        dangerLevel: 'safe',
        description: 'Fluid accumulation in pleural space',
        clinicalExample: 'CXR shows right-sided PE'
      }
    ]
  },
  {
    abbr: 'PT',
    primaryMeaning: 'Context-dependent',
    overallRisk: 'caution',
    meanings: [
      {
        term: 'Physical Therapy',
        region: 'Global',
        specialty: 'Orthopedics',
        dangerLevel: 'safe',
        description: 'Rehabilitation treatment',
        clinicalExample: 'Referred to PT for mobility training'
      },
      {
        term: 'Prothrombin Time',
        region: 'Global',
        specialty: 'Laboratory',
        dangerLevel: 'caution',
        description: 'Coagulation test for blood clotting',
        clinicalExample: 'PT 18 seconds (elevated), INR 2.1',
        commonMisinterpretations: ['Physical Therapy', 'Patient']
      },
      {
        term: 'Patient',
        region: 'Global',
        specialty: 'General Medicine',
        dangerLevel: 'safe',
        description: 'The individual receiving medical care',
        clinicalExample: 'Pt is a 65-year-old male'
      }
    ]
  },
  {
    abbr: 'PC',
    primaryMeaning: 'Regional variation',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'After meals (post cibum)',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'safe',
        description: 'Medication timing instruction',
        clinicalExample: 'Take one tablet PC'
      },
      {
        term: 'Presenting Complaint',
        region: 'UK',
        specialty: 'Emergency Medicine',
        dangerLevel: 'safe',
        description: 'Chief complaint - main symptom reported',
        clinicalExample: 'PC: chest pain for 2 hours',
        notes: 'UK/Commonwealth term for chief complaint'
      }
    ]
  },
  {
    abbr: 'BP',
    primaryMeaning: 'Generally clear',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Blood Pressure',
        region: 'Global',
        specialty: 'General Medicine',
        dangerLevel: 'safe',
        description: 'Force of blood against arterial walls',
        clinicalExample: 'BP 140/90 mmHg (hypertensive)'
      },
      {
        term: 'Bipolar Disorder',
        region: 'Global',
        specialty: 'Psychiatry',
        dangerLevel: 'safe',
        description: 'Mood disorder with manic and depressive episodes',
        clinicalExample: 'Diagnosis: BP Type I with psychotic features'
      }
    ]
  },
  {
    abbr: 'CBC',
    primaryMeaning: 'Complete Blood Count',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Complete Blood Count',
        region: 'Global',
        specialty: 'Laboratory',
        dangerLevel: 'safe',
        description: 'Panel measuring various blood components',
        clinicalExample: 'CBC shows WBC 15,000/µL with left shift'
      }
    ]
  },

  // ========== REGIONAL DIFFERENCES ==========
  {
    abbr: 'A&E',
    primaryMeaning: 'Accident & Emergency (UK term)',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Accident & Emergency',
        region: 'UK',
        specialty: 'Emergency Medicine',
        dangerLevel: 'safe',
        description: 'UK term for emergency department',
        clinicalExample: 'Patient presented to A&E with acute abdomen',
        notes: 'Equivalent to ER (US) or ED (Global)'
      },
      {
        term: 'Accident & Emergency',
        region: 'Northern Ireland',
        specialty: 'Emergency Medicine',
        dangerLevel: 'safe',
        description: 'Northern Ireland HSC term for emergency department',
        clinicalExample: 'Transferred to A&E at Royal Victoria Hospital'
      }
    ]
  },
  {
    abbr: 'ER',
    primaryMeaning: 'Emergency Room',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Emergency Room',
        region: 'US',
        specialty: 'Emergency Medicine',
        dangerLevel: 'safe',
        description: 'US term for emergency department (older usage)',
        clinicalExample: 'Brought to ER via ambulance',
        notes: 'Modern term is ED (Emergency Department)'
      },
      {
        term: 'Estrogen Receptor',
        region: 'Global',
        specialty: 'Oncology',
        dangerLevel: 'safe',
        description: 'Protein receptor for estrogen hormones',
        clinicalExample: 'Breast cancer: ER positive, PR positive'
      }
    ]
  },
  {
    abbr: 'ED',
    primaryMeaning: 'Emergency Department',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Emergency Department',
        region: 'Global',
        specialty: 'Emergency Medicine',
        dangerLevel: 'safe',
        description: 'Modern global term for emergency services',
        clinicalExample: 'Patient triaged in ED as ESI Level 2'
      },
      {
        term: 'Erectile Dysfunction',
        region: 'Global',
        specialty: 'Urology',
        dangerLevel: 'safe',
        description: 'Inability to achieve or maintain erection',
        clinicalExample: 'Chief complaint: ED for 6 months',
        notes: 'Context usually makes meaning clear'
      }
    ]
  },
  {
    abbr: 'GP',
    primaryMeaning: 'General Practitioner',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'General Practitioner',
        region: 'UK',
        specialty: 'Primary Care',
        dangerLevel: 'safe',
        description: 'Primary care physician in UK/Commonwealth systems',
        clinicalExample: 'Referred by GP for cardiology consultation',
        notes: 'Equivalent to PCP (US) or Family Doctor'
      },
      {
        term: 'General Practitioner',
        region: 'Australia',
        specialty: 'Primary Care',
        dangerLevel: 'safe',
        description: 'Primary care physician in Australian system',
        clinicalExample: 'See your GP for follow-up'
      },
      {
        term: 'General Practitioner',
        region: 'Northern Ireland',
        specialty: 'Primary Care',
        dangerLevel: 'safe',
        description: 'Primary care physician in Northern Ireland HSC',
        clinicalExample: 'GP surgery appointment'
      }
    ]
  },
  {
    abbr: 'HSC',
    primaryMeaning: 'Regional health system',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Health and Social Care',
        region: 'Northern Ireland',
        specialty: 'General Medicine',
        dangerLevel: 'safe',
        description: 'Northern Ireland integrated health and social care system',
        clinicalExample: 'Belfast HSC Trust provides both health and social services',
        notes: 'Unique to Northern Ireland - includes social care unlike NHS'
      },
      {
        term: 'Health Service Commission',
        region: 'UK',
        specialty: 'General Medicine',
        dangerLevel: 'safe',
        description: 'UK health oversight body',
        clinicalExample: 'HSC report on hospital performance'
      }
    ]
  },
  {
    abbr: 'NBM',
    primaryMeaning: 'Nil By Mouth (UK/Commonwealth)',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Nil By Mouth',
        region: 'UK',
        specialty: 'Surgery',
        dangerLevel: 'safe',
        description: 'Nothing to eat or drink - pre-operative instruction',
        clinicalExample: 'Patient NBM from midnight for morning surgery',
        notes: 'Equivalent to NPO (US)'
      },
      {
        term: 'Nil By Mouth',
        region: 'Northern Ireland',
        specialty: 'Surgery',
        dangerLevel: 'safe',
        description: 'Pre-operative fasting instruction in NI HSC',
        clinicalExample: 'NBM for theatre tomorrow morning'
      },
      {
        term: 'Nil By Mouth',
        region: 'Australia',
        specialty: 'Surgery',
        dangerLevel: 'safe',
        description: 'Pre-operative fasting instruction',
        clinicalExample: 'NBM after midnight for procedure'
      }
    ]
  },
  {
    abbr: 'NPO',
    primaryMeaning: 'Nothing by mouth (US)',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Nothing by mouth (nil per os)',
        region: 'US',
        specialty: 'Surgery',
        dangerLevel: 'safe',
        description: 'Nothing to eat or drink - US term',
        clinicalExample: 'NPO after midnight for endoscopy',
        notes: 'Latin: nil per os. Equivalent to NBM (UK/AU)'
      },
      {
        term: 'Nothing by mouth (nil per os)',
        region: 'Global',
        specialty: 'Surgery',
        dangerLevel: 'safe',
        description: 'International medical term for fasting',
        clinicalExample: 'Keep NPO for procedure'
      }
    ]
  },

  // ========== SPECIALTY-SPECIFIC ABBREVIATIONS ==========
  {
    abbr: 'OD',
    primaryMeaning: 'DANGEROUS - Multiple meanings',
    overallRisk: 'prohibited',
    meanings: [
      {
        term: 'Once daily (omni die)',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'prohibited',
        description: 'PROHIBITED - Mistaken for right eye or overdose',
        commonMisinterpretations: ['OD (right eye)', 'Overdose'],
        recommendedAlternative: 'Write "daily" or "once daily"',
        clinicalExample: 'WRONG: Take OD | CORRECT: Take once daily'
      },
      {
        term: 'Right eye (oculus dexter)',
        region: 'Global',
        specialty: 'Ophthalmology',
        dangerLevel: 'caution',
        description: 'Right eye designation - easily confused',
        clinicalExample: 'Instill drops OD',
        commonMisinterpretations: ['Once daily', 'Overdose'],
        recommendedAlternative: 'Write "right eye" in full'
      },
      {
        term: 'Overdose',
        region: 'Global',
        specialty: 'Emergency Medicine',
        dangerLevel: 'caution',
        description: 'Drug toxicity emergency',
        clinicalExample: 'Patient presents with suspected opioid OD',
        commonMisinterpretations: ['Once daily', 'Right eye']
      }
    ]
  },
  {
    abbr: 'OS',
    primaryMeaning: 'Left eye',
    overallRisk: 'caution',
    meanings: [
      {
        term: 'Left eye (oculus sinister)',
        region: 'Global',
        specialty: 'Ophthalmology',
        dangerLevel: 'caution',
        description: 'Left eye designation',
        clinicalExample: 'Visual acuity OS: 20/40',
        recommendedAlternative: 'Write "left eye" in full to avoid confusion'
      },
      {
        term: 'Opening Snap',
        region: 'Global',
        specialty: 'Cardiology',
        dangerLevel: 'safe',
        description: 'Heart sound in mitral stenosis',
        clinicalExample: 'Auscultation reveals OS after S2'
      }
    ]
  },
  {
    abbr: 'OU',
    primaryMeaning: 'Both eyes',
    overallRisk: 'caution',
    meanings: [
      {
        term: 'Both eyes (oculi uterque)',
        region: 'Global',
        specialty: 'Ophthalmology',
        dangerLevel: 'caution',
        description: 'Both eyes designation',
        clinicalExample: 'Apply ointment OU at bedtime',
        recommendedAlternative: 'Write "both eyes" in full'
      }
    ]
  },
  {
    abbr: 'BID',
    primaryMeaning: 'Twice daily',
    overallRisk: 'caution',
    meanings: [
      {
        term: 'Twice daily (bis in die)',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'caution',
        description: 'Medication frequency - can be confused with QID',
        clinicalExample: 'Amoxicillin 500mg BID',
        commonMisinterpretations: ['QID (four times daily)']
      }
    ]
  },
  {
    abbr: 'TID',
    primaryMeaning: 'Three times daily',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Three times daily (ter in die)',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'safe',
        description: 'Medication frequency',
        clinicalExample: 'Metformin 500mg TID with meals'
      }
    ]
  },
  {
    abbr: 'QID',
    primaryMeaning: 'Four times daily',
    overallRisk: 'caution',
    meanings: [
      {
        term: 'Four times daily (quater in die)',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'caution',
        description: 'Medication frequency - can be confused with QD or TID',
        clinicalExample: 'Eye drops QID',
        commonMisinterpretations: ['QD (daily)', 'TID (three times daily)']
      }
    ]
  },
  {
    abbr: 'PRN',
    primaryMeaning: 'As needed',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'As needed (pro re nata)',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'safe',
        description: 'Take medication when necessary',
        clinicalExample: 'Ibuprofen 400mg PRN for pain'
      }
    ]
  },
  {
    abbr: 'AC',
    primaryMeaning: 'Before meals',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Before meals (ante cibum)',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'safe',
        description: 'Medication timing',
        clinicalExample: 'Take AC for optimal absorption'
      },
      {
        term: 'Acromioclavicular',
        region: 'Global',
        specialty: 'Orthopedics',
        dangerLevel: 'safe',
        description: 'Shoulder joint',
        clinicalExample: 'AC joint separation Grade III'
      }
    ]
  },
  {
    abbr: 'HS',
    primaryMeaning: 'At bedtime',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'At bedtime (hora somni)',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'safe',
        description: 'Take medication at bedtime',
        clinicalExample: 'Melatonin 3mg HS'
      }
    ]
  },
  {
    abbr: 'STAT',
    primaryMeaning: 'Immediately',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Immediately (statim)',
        region: 'Global',
        specialty: 'Pharmacy',
        dangerLevel: 'safe',
        description: 'Urgent medication administration',
        clinicalExample: 'Give aspirin 325mg STAT for chest pain'
      }
    ]
  },

  // ========== COMMON LABORATORY ABBREVIATIONS ==========
  {
    abbr: 'WBC',
    primaryMeaning: 'White Blood Cell count',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'White Blood Cell count',
        region: 'Global',
        specialty: 'Laboratory',
        dangerLevel: 'safe',
        description: 'Number of white blood cells per volume',
        clinicalExample: 'WBC 18,000/µL suggests infection'
      }
    ]
  },
  {
    abbr: 'RBC',
    primaryMeaning: 'Red Blood Cell count',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Red Blood Cell count',
        region: 'Global',
        specialty: 'Laboratory',
        dangerLevel: 'safe',
        description: 'Number of red blood cells per volume',
        clinicalExample: 'RBC 3.2 million/µL (anemia)'
      }
    ]
  },
  {
    abbr: 'Hgb',
    primaryMeaning: 'Hemoglobin',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Hemoglobin',
        region: 'Global',
        specialty: 'Laboratory',
        dangerLevel: 'safe',
        description: 'Oxygen-carrying protein in red blood cells',
        clinicalExample: 'Hgb 8.5 g/dL (low)',
        notes: 'Also abbreviated as Hb'
      }
    ]
  },
  {
    abbr: 'BMP',
    primaryMeaning: 'Basic Metabolic Panel',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Basic Metabolic Panel',
        region: 'US',
        specialty: 'Laboratory',
        dangerLevel: 'safe',
        description: 'Blood test measuring electrolytes, glucose, and kidney function',
        clinicalExample: 'BMP shows K+ 5.8 mEq/L (hyperkalemia)'
      }
    ]
  },
  {
    abbr: 'CMP',
    primaryMeaning: 'Comprehensive Metabolic Panel',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Comprehensive Metabolic Panel',
        region: 'US',
        specialty: 'Laboratory',
        dangerLevel: 'safe',
        description: 'Extended metabolic panel including liver function',
        clinicalExample: 'CMP reveals elevated ALT and AST'
      }
    ]
  },

  // ========== CRITICAL CARE ABBREVIATIONS ==========
  {
    abbr: 'ICU',
    primaryMeaning: 'Intensive Care Unit',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Intensive Care Unit',
        region: 'Global',
        specialty: 'Critical Care',
        dangerLevel: 'safe',
        description: 'Critical care ward for severely ill patients',
        clinicalExample: 'Patient admitted to ICU for septic shock'
      }
    ]
  },
  {
    abbr: 'CCU',
    primaryMeaning: 'Regional variation',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Coronary Care Unit',
        region: 'US',
        specialty: 'Cardiology',
        dangerLevel: 'safe',
        description: 'Specialized ICU for cardiac patients',
        clinicalExample: 'Post-MI patient monitored in CCU'
      },
      {
        term: 'Critical Care Unit',
        region: 'UK',
        specialty: 'Critical Care',
        dangerLevel: 'safe',
        description: 'UK term for intensive care',
        clinicalExample: 'Transfer to CCU for ventilatory support'
      },
      {
        term: 'Critical Care Unit',
        region: 'Northern Ireland',
        specialty: 'Critical Care',
        dangerLevel: 'safe',
        description: 'Northern Ireland HSC term for intensive care',
        clinicalExample: 'Admitted to CCU at Belfast Trust'
      }
    ]
  },
  {
    abbr: 'DNR',
    primaryMeaning: 'Do Not Resuscitate',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Do Not Resuscitate',
        region: 'Global',
        specialty: 'Critical Care',
        dangerLevel: 'safe',
        description: 'Order to not perform CPR',
        clinicalExample: 'Patient has DNR/DNI order in place',
        notes: 'Critical advance directive - verify documentation'
      }
    ]
  },
  {
    abbr: 'DNI',
    primaryMeaning: 'Do Not Intubate',
    overallRisk: 'safe',
    meanings: [
      {
        term: 'Do Not Intubate',
        region: 'Global',
        specialty: 'Critical Care',
        dangerLevel: 'safe',
        description: 'Order to not place on mechanical ventilation',
        clinicalExample: 'DNI but full code otherwise',
        notes: 'Critical advance directive - verify documentation'
      }
    ]
  }
];

// Helper function to calculate statistics
export function calculateAbbreviationStats() {
  const stats = {
    totalAbbreviations: medicalAbbreviationsDatabase.length,
    safeCount: 0,
    cautionCount: 0,
    prohibitedCount: 0,
    ambiguousCount: 0,
    avgMeaningsPerAbbr: 0
  };

  let totalMeanings = 0;

  medicalAbbreviationsDatabase.forEach(abbr => {
    totalMeanings += abbr.meanings.length;

    if (abbr.meanings.length > 1) {
      stats.ambiguousCount++;
    }

    const maxDanger = abbr.overallRisk || 'safe';
    if (maxDanger === 'safe') stats.safeCount++;
    else if (maxDanger === 'caution') stats.cautionCount++;
    else if (maxDanger === 'prohibited') stats.prohibitedCount++;
  });

  stats.avgMeaningsPerAbbr = Number((totalMeanings / stats.totalAbbreviations).toFixed(1));

  return stats;
}
