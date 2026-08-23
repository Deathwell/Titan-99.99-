// "Mom + Boss" AI Excuse Tribunal & Judgment Evaluation Engine
// Evaluates operator excuses: granting biological medical pardons or rejecting BS with strict penalties

import { ExcuseCategory, ExcuseVerdict, TribunalCase } from '../types/titan';

export interface CategoryOption {
  key: ExcuseCategory;
  label: string;
  icon: string;
  defaultSeverity: 'CRITICAL_MEDICAL' | 'POTENTIAL_EXCUSE' | 'HIGH_RISK_BS';
  description: string;
}

export const EXCUSE_CATEGORIES: CategoryOption[] = [
  {
    key: 'ACUTE_ILLNESS_FEVER',
    label: 'Acute Illness / High Fever',
    icon: 'Thermometer',
    defaultSeverity: 'CRITICAL_MEDICAL',
    description: 'Diagnosed illness, high fever (>100°F), vomiting, or acute biological impairment.'
  },
  {
    key: 'SEVERE_INJURY_MEDICAL',
    label: 'Severe Injury / Medical Crisis',
    icon: 'Activity',
    defaultSeverity: 'CRITICAL_MEDICAL',
    description: 'Acute musculoskeletal tear, hospital admission, surgery, or medical immobilization.'
  },
  {
    key: 'FAMILY_CRISIS',
    label: 'Family / Bereavement Crisis',
    icon: 'HeartHandshake',
    defaultSeverity: 'CRITICAL_MEDICAL',
    description: 'Genuine family emergency, bereavement, or sudden crisis requiring immediate presence.'
  },
  {
    key: 'WORK_OVERTIME_PRESSURE',
    label: 'Work / Executive Overtime',
    icon: 'Briefcase',
    defaultSeverity: 'POTENTIAL_EXCUSE',
    description: 'Hostile institutional deadlines, 16+ hour shift, or crisis deal closing.'
  },
  {
    key: 'TRAVEL_TRANSIT',
    label: 'Travel / In-Transit Logistics',
    icon: 'Plane',
    defaultSeverity: 'POTENTIAL_EXCUSE',
    description: 'Cross-continental flights, transit delays, or zero equipment/internet access.'
  },
  {
    key: 'EXHAUSTION_BURNOUT',
    label: 'Exhaustion / Low Energy',
    icon: 'BatteryLow',
    defaultSeverity: 'HIGH_RISK_BS',
    description: 'Felt tired, low willpower, bad sleep, or general lack of energy.'
  },
  {
    key: 'PROCRASTINATION_DISTRACTION',
    label: 'Procrastination / Lost Track of Time',
    icon: 'ClockAlert',
    defaultSeverity: 'HIGH_RISK_BS',
    description: 'Got distracted with social media, gaming, hanging out, or delayed until midnight.'
  },
  {
    key: 'OTHER',
    label: 'Other Unclassified Reason',
    icon: 'HelpCircle',
    defaultSeverity: 'POTENTIAL_EXCUSE',
    description: 'Any other situation not covered by the standard categories above.'
  }
];

// Keywords indicating legitimate biological / severe crises
const GENUINE_MEDICAL_KEYWORDS = [
  'hospital', 'doctor', 'physician', 'fever', '101', '102', '103', '104', 'vomit', 'vomiting',
  'food poisoning', 'surgery', 'fracture', 'broken', 'torn', 'concussion', 'asthma',
  'ambulance', 'er', 'emergency room', 'funeral', 'bereavement', 'icr', 'prescribed', 'infection',
  'migraine', 'flu', 'covid', 'strep', 'crutches', 'blood'
];

// Keywords indicating classic rationalization and laziness
const BULLSHIT_KEYWORDS = [
  'tired', 'lazy', 'netflix', 'youtube', 'instagram', 'reels', 'tiktok', 'game', 'gaming',
  'playstation', 'xbox', 'tomorrow', 'forgot', 'didn\'t feel', 'no mood', 'chilling', 'party',
  'hangout', 'friends', 'movie', 'bored', 'overslept', 'snoozed', 'sore', 'traffic', 'cold weather',
  'later', 'skip today', 'double tomorrow'
];

export function evaluateExcuse(
  category: ExcuseCategory,
  explanationText: string,
  operatorCallsign: string = 'OPERATOR'
): ExcuseVerdict {
  const text = (explanationText || '').toLowerCase().trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  let medicalMatches = 0;
  GENUINE_MEDICAL_KEYWORDS.forEach(kw => {
    if (text.includes(kw)) medicalMatches++;
  });

  let bsMatches = 0;
  BULLSHIT_KEYWORDS.forEach(kw => {
    if (text.includes(kw)) bsMatches++;
  });

  // 1. Critical Medical Emergency Categories
  if (category === 'ACUTE_ILLNESS_FEVER' || category === 'SEVERE_INJURY_MEDICAL' || category === 'FAMILY_CRISIS') {
    // If text is suspiciously weak or admits laziness despite selecting medical
    if (bsMatches >= 2 && medicalMatches === 0 && wordCount < 6) {
      return {
        verdictType: 'BULLSHIT_REJECTED',
        title: 'BULLSHIT DETECTED // FRAUDULENT EMERGENCY CLAIM',
        verdictReason: 'You selected a medical emergency category but your statement reveals basic procrastination and comfort-seeking.',
        realityCheck: `Operator ${operatorCallsign}, the AI Judge sees straight through false claims. Labeling laziness as an emergency insults true high performers. Your penalty is enforced immediately.`,
        voiceTranscript: `Verdict: Absolute Bullshit. You attempted to disguise procrastination as an emergency. The Tribunal rejects your claim. 150 XP deducted and a Black Mark has been stamped on your record. Fix your discipline.`,
        xpAdjustment: -150,
        streakProtected: false,
        blackMarkIssued: true
      };
    }

    // Genuine Medical Pardon Granted (The Mom's Care)
    return {
      verdictType: 'PARDON_GRANTED',
      title: '24-HOUR BIOLOGICAL PARDON GRANTED',
      verdictReason: 'Verified legitimate physiological impairment or family crisis. Biological preservation takes precedence over training volume.',
      realityCheck: `Rest is mandatory when recovering from genuine illness or injury. Pushing through acute fever or injury destroys long-term adaptations. Today is shielded.`,
      voiceTranscript: `Operator ${operatorCallsign}, your medical pardon is granted. Preserving your biological baseline is the highest priority. Your streak and XP are fully shielded today. Drink water, get 8 hours of sleep, and report back tomorrow. No slacking once recovered.`,
      xpAdjustment: 0,
      streakProtected: true,
      blackMarkIssued: false,
      recoveryAdvice: 'Focus on 100% hydration (electrolytes), 8-9 hours uninterrupted sleep, and zero mental stress. Do not attempt heavy lifting until body temperature and inflammation normalize.'
    };
  }

  // 2. High-Risk Bullshit Categories (Exhaustion / Procrastination)
  if (category === 'EXHAUSTION_BURNOUT' || category === 'PROCRASTINATION_DISTRACTION') {
    // Almost always rejected unless extraordinary context
    if (medicalMatches >= 2 && wordCount >= 15) {
      // Borderline probationary pass
      return {
        verdictType: 'PROBATIONARY_PASS',
        title: 'PROBATIONARY PASS // 50% PENALTY IMPOSED',
        verdictReason: 'Extenuating physical circumstances detected, but execution was still avoidable. 50% XP deduction applied.',
        realityCheck: `You felt exhausted, but elite operators execute light mobility or 15 minutes of recovery when tired. You chose total inactivity.`,
        voiceTranscript: `Probationary Pass. You allowed fatigue to dictate your actions. Your streak is spared, but a 50 XP warning penalty is deducted. You owe a double session tomorrow.`,
        xpAdjustment: -50,
        streakProtected: true,
        blackMarkIssued: false,
        recoveryAdvice: 'Tomorrow you must execute a minimum of 45 minutes of aerobic training and 30 minutes of financial modeling to clear probationary status.'
      };
    }

    return {
      verdictType: 'BULLSHIT_REJECTED',
      title: 'BULLSHIT DETECTED // EXCUSE SUMMARILY REJECTED',
      verdictReason: `Your explanation reveals classic cognitive rationalization and low willpower. Over 4.2 Million competitors executed today under identical fatigue.`,
      realityCheck: `Fatigue is a cognitive illusion. When you say 'I was too tired', what you really mean is 'I prioritized short-term comfort over my Top 0.1% objective.'`,
      voiceTranscript: `Verdict: Absolute Bullshit. You claim you were too tired, yet you had the energy to waste hours on distractions. 'I will do double tomorrow' is the universal slogan of the bottom ninety percent. 150 XP deducted and a Black Mark has been stamped on your record. Move tomorrow.`,
      xpAdjustment: -150,
      streakProtected: false,
      blackMarkIssued: true
    };
  }

  // 3. Work / Travel / Other
  if (category === 'WORK_OVERTIME_PRESSURE' || category === 'TRAVEL_TRANSIT' || category === 'OTHER') {
    if (wordCount >= 10 && (text.includes('14 hour') || text.includes('16 hour') || text.includes('flight') || text.includes('deadline') || medicalMatches >= 1)) {
      return {
        verdictType: 'PROBATIONARY_PASS',
        title: 'PROBATIONARY LOGISTICS PASS GRANTED',
        verdictReason: 'Severe logistical constraint or institutional overtime recognized. Streak shielded with mandatory catch-up quota.',
        realityCheck: `High-powered careers generate friction. The streak is preserved today, but tactical operators find 15 minutes in hotel rooms.`,
        voiceTranscript: `Logistics Pass granted. Overtime recognized. Your streak is shielded today, but you are required to log an extended session tomorrow. Stay sharp.`,
        xpAdjustment: 0,
        streakProtected: true,
        blackMarkIssued: false,
        recoveryAdvice: 'Carry resistance bands in transit and review flashcards on flights to prevent 0-output days.'
      };
    }

    // Default rejection for vague or short excuses
    return {
      verdictType: 'BULLSHIT_REJECTED',
      title: 'EXCUSE INSUFFICIENT // PENALTY ENFORCED',
      verdictReason: 'Vague, low-effort explanation provided. Inadequate proof of unavoidable disruption.',
      realityCheck: `Busy is not an excuse. You make time for what you truly value. You chose to let the day slip away.`,
      voiceTranscript: `Verdict: Excuse Rejected. You did not provide adequate justification for breaking your daily protocol. Penalty enforced: 150 XP deducted and Black Mark applied. Rebuild tomorrow.`,
      xpAdjustment: -150,
      streakProtected: false,
      blackMarkIssued: true
    };
  }

  // Fallback
  return {
    verdictType: 'BULLSHIT_REJECTED',
    title: 'BULLSHIT DETECTED // CLAIM DISMISSED',
    verdictReason: 'Excuse fails standard institutional validity criteria.',
    realityCheck: 'Execute your protocols daily. No shortcuts.',
    voiceTranscript: 'Verdict: Bullshit. Penalty enforced.',
    xpAdjustment: -150,
    streakProtected: false,
    blackMarkIssued: true
  };
}
