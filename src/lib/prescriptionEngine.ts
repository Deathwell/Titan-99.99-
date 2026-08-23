/**
 * Tactical AI Prescription Engine - Intelligent Modular Sports Science Algorithm
 * 
 * Synthesizes research from leading sports scientists and coaches:
 * - Dr. Mike Israetel (Renaissance Periodization - Hypertrophy, Volume Landmarks, RIR)
 * - Dr. Peter Attia & Dr. Andrew Huberman (Longevity, Zone 2 Aerobic Base, Stability, Grip)
 * - Jeff Nippard & Dr. Brad Schoenfeld (Evidence-Based Biomechanics & Stimulus-to-Fatigue Ratio)
 * - Bret Contreras PhD (Posterior Chain & Glute Biomechanics)
 * - Pavel Tsatsouline & Dan John (Hardstyle Power, Strength & Loaded Carries)
 * - David Goggins & Jocko Willink (High-Threshold Output, Spartan Density)
 * - Jeff Cavaliere MSPT, CSCS (Athlean-X - Joint Integrity & Rotator Cuff Health)
 * 
 * INTELLIGENT COMPOSABILITY RULES:
 * 1. INTENSITY is the primary driver of exercise difficulty, RPE/RIR, and volume.
 *    (e.g., A 45yo or 55yo who selects Advanced/Superhero trains like a beast with heavy compounds!)
 * 2. AGE is an intelligent physiological modifier (modulates warmup thoroughness, joint-friendly grip angles, and recovery).
 * 3. GENDER modulates aesthetic emphasis (e.g. Glute/Hourglass vs V-Taper vs Hybrid Athletic).
 * 4. ENVIRONMENT & EQUIPMENT dynamically swap the biomechanical modality.
 * 5. DURATION precisely scales the movement count, set volume, supersets, and cardio/mobility phases.
 */

export type IntensityLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'SUPERHERO';
export type EnvironmentType = 'INDOOR' | 'OUTDOOR';
export type EquipmentType = 'EQUIPMENT' | 'NO_EQUIPMENT';
export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';

export interface ExerciseStep {
  id: string;
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  tempo: string; // e.g. "3-1-1-0" (3s eccentric negative, 1s stretch pause, 1s concentric, 0s lockout)
  intensityRirOrRpe: string; // e.g. "RIR 2 (RPE 8.0)"
  coachingCue: string;
  sportsScienceRationale: string;
  category: 'WARMUP' | 'PRIMARY_COMPOUND' | 'HYPERTROPHY_ACCESSORY' | 'ISOLATION_STRETCH' | 'METABOLIC_FINISHER' | 'LONGEVITY_RECOVERY';
}

export interface TacticalPrescription {
  id: string;
  title: string;
  subtitle: string;
  coachingSource: string;
  ageBracketLabel: string;
  durationMinutes: number;
  difficulty: IntensityLevel;
  environment: EnvironmentType;
  equipment: EquipmentType;
  gender: GenderType;
  targetObjective: string;
  physiologicalImpact: string;
  scientificBreakdown: string[];
  calorieBurnEstimate: number;
  xpAward: number;
  warmupMinutes: number;
  workMinutes: number;
  cooldownMinutes: number;
  exerciseSteps: ExerciseStep[];
}

export interface PrescriptionFilterParams {
  age: number;
  gender: GenderType;
  environment: EnvironmentType;
  equipment: EquipmentType;
  intensity: IntensityLevel;
  durationMinutes: number;
}

/**
 * Generates an intelligent, scientifically sound workout program tailored to all 6 parameters.
 */
export function generateCustomPrescription(params: PrescriptionFilterParams): TacticalPrescription {
  const { age, gender, environment, equipment, intensity, durationMinutes } = params;
  const dur = Math.max(15, Math.min(240, durationMinutes));

  const isIndoor = environment === 'INDOOR';
  const hasEquipment = equipment === 'EQUIPMENT';
  const isFemale = gender === 'FEMALE';
  const isMale = gender === 'MALE';

  // 1. AGE MODIFIERS (Common Sense: Modulates warmup, recovery, and joint-angles without neutering capability)
  let ageWarmupMins = 3;
  let ageBracketLabel = 'PEAK PRIME (15–29)';
  let ageJointNote = 'High tendon elasticity & rapid metabolic clearance';

  if (age >= 60) {
    ageWarmupMins = Math.max(5, Math.round(dur * 0.15));
    ageBracketLabel = 'CENTENARIAN LONGEVITY (60–75+)';
    ageJointNote = 'Attia Longevity Protocol: Prioritizing joint-friendly scapular angles & spinal stability';
  } else if (age >= 45) {
    ageWarmupMins = Math.max(4, Math.round(dur * 0.12));
    ageBracketLabel = 'MASTERS PERFORMANCE (45–59)';
    ageJointNote = 'Optimized Stimulus-to-Fatigue Ratio (SFR) with rotator cuff & hip activation';
  } else if (age >= 30) {
    ageWarmupMins = Math.max(4, Math.round(dur * 0.10));
    ageBracketLabel = 'PRIME ATHLETE (30–44)';
    ageJointNote = 'High density progressive overload with posture & thoracic decompression';
  } else {
    ageWarmupMins = Math.max(3, Math.round(dur * 0.08));
    ageBracketLabel = 'PHYSIOLOGICAL PRIME (15–29)';
    ageJointNote = 'Maximal mechanical tension capacity & high volume threshold';
  }

  const cooldownMins = Math.max(3, Math.round(dur * 0.08));
  const workMins = Math.max(9, dur - ageWarmupMins - cooldownMins);

  // 2. INTENSITY & RPE PARAMETERS (The core driver of workload!)
  const rpeMap: Record<IntensityLevel, { rpe: string; rir: string; rest: number; setsMultiplier: number }> = {
    BEGINNER: { rpe: 'RPE 6.5–7.0', rir: 'RIR 3 (3 Reps in Reserve)', rest: 75, setsMultiplier: 3 },
    INTERMEDIATE: { rpe: 'RPE 7.5–8.5', rir: 'RIR 1–2 (Hard Working Sets)', rest: 60, setsMultiplier: 4 },
    ADVANCED: { rpe: 'RPE 8.5–9.5', rir: 'RIR 0–1 (Near Failure)', rest: 60, setsMultiplier: 4 },
    SUPERHERO: { rpe: 'RPE 9.5–10.0', rir: 'RIR 0 (Absolute Failure / Spartan MRV)', rest: 45, setsMultiplier: 5 }
  };

  const currentIntensityConfig = rpeMap[intensity];

  // 3. TARGET CALORIE & XP CALCULATION
  const baseIntensityCalPerMin: Record<IntensityLevel, number> = {
    BEGINNER: 7.2,
    INTERMEDIATE: 9.5,
    ADVANCED: 12.0,
    SUPERHERO: 15.0
  };
  const calorieBurn = Math.round(dur * baseIntensityCalPerMin[intensity]);
  const xpAward = Math.floor(dur * 1.6);

  // 4. SCIENTIFIC FRAMEWORK & TITLES
  let title = '';
  let subtitle = '';
  let coachingSource = '';
  let targetObjective = '';
  let physiologicalImpact = '';
  let scientificBreakdown: string[] = [];

  if (intensity === 'SUPERHERO') {
    coachingSource = 'David Goggins (Spartan Grit) & Dr. Mike Israetel (Maximum Recoverable Volume)';
    title = hasEquipment
      ? (isFemale ? 'Valkyrie Heavy Compound & Glute Overload' : 'Titan Olympian Powerbuilding & Hypertrophy Siege')
      : (environment === 'OUTDOOR' ? 'Spartan Outdoor Calisthenics & Hill Sprint Siege' : 'High-Threshold Bodyweight Death Circuit');
    subtitle = `${dur}m supreme threshold protocol (${intensity}) • Age ${age} Operator`;
    targetObjective = 'Recruit high-threshold motor units, trigger mTOR protein synthesis, and expand psychological grit';
    physiologicalImpact = 'Drives maximal mechanical tension, induces growth hormone surge, and elevates lactate tolerance';
    scientificBreakdown = [
      'Maximum Recoverable Volume (MRV) with lengthened-state partials',
      'Explosive concentric intent to maximize motor unit recruitment',
      'High-density rest periods to challenge anaerobic glycolysis',
      'Active spinal decompression during cooldown'
    ];
  } else if (intensity === 'ADVANCED') {
    coachingSource = isFemale
      ? 'Bret Contreras PhD ("The Glute Guy") & Dr. Brad Schoenfeld'
      : 'Dr. Mike Israetel (Renaissance Periodization) & Jeff Nippard';
    title = hasEquipment
      ? (isFemale ? 'Hourglass Hypertrophy: Heavy Hip Thrusts & Shoulder Cap' : 'Heavy Push/Pull Compound Hypertrophy Overload')
      : 'High-Density Advanced Calisthenics & Power';
    subtitle = `${dur}m progressive overload protocol calibrated for ${age}yo operator (${currentIntensityConfig.rir})`;
    targetObjective = isFemale
      ? 'Maximize gluteus maximus mechanical tension, widen lateral delts for waist taper, and strengthen posterior chain'
      : 'Drive progressive overload on primary compound movements with optimal stimulus-to-fatigue ratio';
    physiologicalImpact = 'Stimulates myofibrillar hypertrophy through deep stretch loading and mechanical tension';
    scientificBreakdown = [
      'Controlled 3-second eccentric tempo to optimize muscle damage vs recovery',
      'Lengthened-state overload on primary compound movements',
      'Targeted 60–90s rest periods for optimal intra-muscular ATP re-synthesis',
      'Rotator cuff & hip capsule pre-activation'
    ];
  } else if (intensity === 'INTERMEDIATE') {
    coachingSource = 'Jeff Nippard (Evidence-Based Kinesiology) & Dr. Andrew Huberman';
    title = hasEquipment
      ? (isFemale ? 'Glute Sculpt, Upper Body Tone & Core Armor' : 'Compound Athletic Strength & V-Taper Hypertrophy')
      : 'Full-Body Progressive Bodyweight Mastery';
    subtitle = `${dur}m balanced athletic performance protocol for ${age}yo operator`;
    targetObjective = 'Build functional athletic power, lean muscle definition, and joint durability';
    physiologicalImpact = 'Optimizes hormonal response, improves insulin sensitivity, and increases metabolic rate';
    scientificBreakdown = [
      'Compound-first sequencing for maximal central nervous system efficiency',
      'RIR 2 (2 reps in reserve) to balance stimulus without excessive central fatigue',
      'Anti-rotation and transverse core bracing',
      'Zone 2 recovery active flush'
    ];
  } else {
    // BEGINNER
    coachingSource = 'Firas Zahabi & Jeff Cavaliere MSPT, CSCS (Movement Mastery & Joint Armor)';
    title = hasEquipment
      ? 'Foundational Compound Strength & Joint Durability'
      : 'Zero-Friction Foundation Calisthenics & Mobility';
    subtitle = `${dur}m joint-friendly beginner progression protocol for ${age}yo operator`;
    targetObjective = 'Master fundamental movement patterns (hinge, squat, push, pull, carry) and build tendon strength';
    physiologicalImpact = 'Enhances neuromuscular coordination and motor learning without debilitating muscle soreness';
    scientificBreakdown = [
      'Submaximal consistency over excessive fatigue (Firas Zahabi methodology)',
      'Establish mind-muscle connection with 1-second pause at contraction',
      'Scapular and pelvic stability reinforcement',
      'Aerobic base activation'
    ];
  }

  // 5. DYNAMIC MOVEMENT POOL BUILDER (COMMON SENSE + MODULAR ARCHITECTURE)
  const steps: ExerciseStep[] = [];

  // PHASE A: DYNAMIC MOBILITY & WARMUP (Customized by age & environment)
  steps.push({
    id: 'warmup-1',
    name: age >= 50
      ? 'Cat-Cow + World\'s Greatest Stretch & Thoracic Opener'
      : 'Dynamic Arm Swings + Scapular Wall Slides + Hip 90/90 Opener',
    targetMuscle: 'Rotator Cuff, Thoracic Spine, Hip Joint Capsule',
    sets: 2,
    reps: '8–10 Reps / Side',
    restSeconds: 30,
    tempo: '2-1-1-1',
    intensityRirOrRpe: 'RPE 5.0 (Dynamic Flow)',
    coachingCue: age >= 50
      ? 'Move slowly through each vertebra, breathe deep through belly, feel thoracic rotation open up.'
      : 'Keep shoulder blades and lower back flat against wall, slide arms upward smoothly.',
    sportsScienceRationale: 'Hydrates intervertebral discs, lubricates synovial joint fluid, and primes serratus anterior.',
    category: 'WARMUP'
  });

  // PHASE B: PRIMARY COMPOUNDS (Selected based on Equipment, Intensity, Gender & Age)
  const setsCount = currentIntensityConfig.setsMultiplier;
  const rirText = currentIntensityConfig.rir;
  const restSec = currentIntensityConfig.rest;

  if (hasEquipment) {
    if (isFemale) {
      // Female Equipment: Hip Thrust / Glute Focus + Incline Press / Row
      steps.push({
        id: 'comp-female-1',
        name: 'Barbell / Heavy Dumbbell Hip Thrust (2-Sec Top Lockout)',
        targetMuscle: 'Gluteus Maximus (Peak Shortened Position)',
        sets: setsCount,
        reps: intensity === 'SUPERHERO' ? '8 Reps (Heavy)' : intensity === 'ADVANCED' ? '10–12 Reps' : '12–15 Reps',
        restSeconds: restSec + 15,
        tempo: '2-0-1-2 (2s Peak Squeeze)',
        intensityRirOrRpe: rirText,
        coachingCue: 'Tuck chin to chest, drive through heels, anterior pelvic tilt at top. Do not hyperextend lower back.',
        sportsScienceRationale: 'Highest electromyography (EMG) glute activation in kinesiology literature (Bret Contreras).',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'comp-female-2',
        name: 'Dumbbell / Barbell Romanian Deadlift (RDL) with Deep Stretch Pause',
        targetMuscle: 'Hamstrings & Glute-Ham Tie-In',
        sets: setsCount,
        reps: '10–12 Reps',
        restSeconds: restSec,
        tempo: '3-1-1-0 (3s Controlled Descent)',
        intensityRirOrRpe: rirText,
        coachingCue: 'Push hips straight back toward the wall, keep weights sliding along shins, pause at deep stretch.',
        sportsScienceRationale: 'Triggers stretch-mediated hypertrophy by loading the hamstring and glute in their elongated state.',
        category: 'PRIMARY_COMPOUND'
      });
    } else {
      // Male / Neutral Equipment: Incline Press + Heavy RDL / Squat
      steps.push({
        id: 'comp-male-1',
        name: age >= 65
          ? 'Chest-Supported Dumbbell / Cable Incline Press (Joint-Friendly 30°)'
          : 'Barbell / Heavy Dumbbell Incline Bench Press (30° Clavicular Angle)',
        targetMuscle: 'Clavicular Upper Pectoralis & Anterior Deltoids',
        sets: setsCount,
        reps: intensity === 'SUPERHERO' ? '6–8 Reps (Heavy)' : intensity === 'ADVANCED' ? '8–10 Reps' : '10–12 Reps',
        restSeconds: restSec + 15,
        tempo: '3-1-1-0 (3s Negative)',
        intensityRirOrRpe: rirText,
        coachingCue: 'Retract and lock shoulder blades into the pad, lower weight smoothly to upper chest, drive up explosively.',
        sportsScienceRationale: '30-degree incline yields 33% greater upper chest activation while significantly reducing rotator cuff impingement.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'comp-male-2',
        name: age >= 65
          ? 'Supported Box Goblet Squat / Trap Bar Deadlift'
          : 'Barbell Romanian Deadlift (RDL) / Trap Bar Deadlift',
        targetMuscle: 'Hamstrings, Gluteus Maximus & Spinal Erectors',
        sets: setsCount,
        reps: intensity === 'SUPERHERO' ? '6–8 Reps' : '8–10 Reps',
        restSeconds: restSec + 15,
        tempo: '3-1-1-0',
        intensityRirOrRpe: rirText,
        coachingCue: 'Hinge hips backwards, maintain rigid neutral spine, push the floor away through midfoot.',
        sportsScienceRationale: 'Maximizes posterior chain mechanical tension without excessive lumbar shear.',
        category: 'PRIMARY_COMPOUND'
      });
    }

    // PHASE C: HYPERTROPHY ACCESSORIES (Scaled by available time!)
    if (dur >= 30) {
      steps.push({
        id: 'acc-1',
        name: 'Chest-Supported T-Bar / Cable Seated Row',
        targetMuscle: 'Latissimus Dorsi, Rhomboids, Middle Trapezius',
        sets: setsCount,
        reps: '10–12 Reps',
        restSeconds: restSec,
        tempo: '2-1-1-1 (1s Squeeze)',
        intensityRirOrRpe: rirText,
        coachingCue: 'Chest pinned to pad, pull with elbows towards your hips, avoid shrugging.',
        sportsScienceRationale: 'Chest support eliminates lower back fatigue, channeling 100% of stimulus to back width and posture.',
        category: 'HYPERTROPHY_ACCESSORY'
      });
    }

    if (dur >= 45) {
      steps.push({
        id: 'acc-2',
        name: isFemale
          ? 'Cable / Dumbbell Lean-Away Lateral Raises (Shoulder Cap Silhouette)'
          : 'Dumbbell Lean-Away Lateral Raises + Face-Pulls Superset',
        targetMuscle: 'Lateral Deltoids & External Rotators',
        sets: Math.min(4, setsCount),
        reps: '12–15 Reps',
        restSeconds: 45,
        tempo: '2-0-1-1',
        intensityRirOrRpe: 'RIR 1',
        coachingCue: 'Lean body slightly, lead with pinkies, control the eccentric descent to feel the shoulder cap burn.',
        sportsScienceRationale: 'Builds lateral delt width to create the golden aesthetic ratio against the waistline.',
        category: 'HYPERTROPHY_ACCESSORY'
      });
    }

    if (dur >= 60) {
      steps.push({
        id: 'acc-3',
        name: isFemale
          ? 'Bulgarian Split Squats (Forward 30° Torso Lean) or Cable Glute Kickbacks'
          : 'Incline Dumbbell Biceps Curls + Overhead Triceps Cable Extension',
        targetMuscle: isFemale ? 'Glute Maximus Deep Stretch & Upper Shelf' : 'Biceps Long Head & Triceps Long Head',
        sets: 3,
        reps: '12 Reps / Side',
        restSeconds: 45,
        tempo: '3-0-1-1',
        intensityRirOrRpe: 'RIR 1 (Near Failure)',
        coachingCue: isFemale
          ? 'Lean torso forward 30 degrees to shift 85% of tension onto lead glute.'
          : 'Full extension at bottom to place long head under deep stretch.',
        sportsScienceRationale: 'Overload in the lengthened position stimulates maximum titin-mediated muscle remodeling.',
        category: 'ISOLATION_STRETCH'
      });
    }

    if (dur >= 75) {
      steps.push({
        id: 'acc-4',
        name: 'Heavy Farmer\'s Walk / Trap Bar Loaded Carries',
        targetMuscle: 'Trapezius, Grip Strength, Transverse Abdominal Armor',
        sets: 3,
        reps: '50 Meters',
        restSeconds: 60,
        tempo: 'Steady Cadence',
        intensityRirOrRpe: 'RPE 8.5',
        coachingCue: 'Shoulders pinned down, chest tall, march with crushing grip and steady nasal breathing.',
        sportsScienceRationale: 'Peter Attia\'s #1 biomarker test for physical resilience and neuromuscular integrity.',
        category: 'ISOLATION_STRETCH'
      });
    }
  } else {
    // =========================================================================
    // NO EQUIPMENT / BODYWEIGHT CALISTHENICS
    // =========================================================================
    steps.push({
      id: 'bw-comp-1',
      name: intensity === 'SUPERHERO'
        ? 'Explosive Deficit / Clap Push-Ups (Feet Elevated)'
        : intensity === 'ADVANCED'
        ? 'Tempo Deficit Push-Ups (3s Down, 1s Stretch Pause, Explode)'
        : 'Incline / Standard Hand-Release Push-Ups',
      targetMuscle: 'Pectoralis Major, Triceps & Anterior Deltoids',
      sets: setsCount,
      reps: intensity === 'SUPERHERO' ? '20–25 Reps' : intensity === 'ADVANCED' ? '15–18 Reps' : '10–12 Reps',
      restSeconds: restSec,
      tempo: '3-1-1-0',
      intensityRirOrRpe: rirText,
      coachingCue: 'Lock core like a steel plank, lower chest to hover above floor, explode up with authority.',
      sportsScienceRationale: 'Recruits high-threshold pectoralis motor units using pure body mass leverage.',
      category: 'PRIMARY_COMPOUND'
    });

    steps.push({
      id: 'bw-comp-2',
      name: environment === 'OUTDOOR'
        ? 'Park Pull-Up Bar Strict Dead-Hang Pull-Ups or Inverted Rows'
        : 'Doorframe / Bed-Sheet Isometric Lat Rows + Single-Leg Romanian Deadlift',
      targetMuscle: 'Latissimus Dorsi, Rhomboids, Biceps & Grip',
      sets: setsCount,
      reps: intensity === 'SUPERHERO' ? '12–15 Reps' : '8–10 Reps',
      restSeconds: restSec,
      tempo: '2-1-1-0',
      intensityRirOrRpe: rirText,
      coachingCue: 'Pull chest up to bar, lead with elbows, avoid kipping or swinging legs.',
      sportsScienceRationale: 'Gold standard vertical pull for lat width and posterior chain balance.',
      category: 'PRIMARY_COMPOUND'
    });

    if (dur >= 30) {
      steps.push({
        id: 'bw-acc-1',
        name: isFemale
          ? 'Elevated Single-Leg Hip Thrusts (Couch/Bench) + Frog Pumps'
          : 'Single-Leg Bulgarian Split Squats / Pistol Squats',
        targetMuscle: isFemale ? 'Gluteus Maximus & Hamstrings' : 'Quadriceps, Glutes & Ankle Stabilizers',
        sets: setsCount,
        reps: '12–15 Reps / Leg',
        restSeconds: 45,
        tempo: '3-1-1-0',
        intensityRirOrRpe: rirText,
        coachingCue: 'Rear foot elevated on chair, sink front knee to 90 degrees, push through midfoot.',
        sportsScienceRationale: 'Unilateral loading doubles effective bodyweight per leg without requiring barbells.',
        category: 'PRIMARY_COMPOUND'
      });
    }

    if (dur >= 45) {
      steps.push({
        id: 'bw-acc-2',
        name: 'Pike Push-Ups / Wall-Walk Handstand Hold',
        targetMuscle: 'Anterior Deltoids, Upper Chest & Triceps Lockout',
        sets: 3,
        reps: intensity === 'SUPERHERO' ? '12 Reps + 45s Hold' : '10 Reps',
        restSeconds: 45,
        tempo: '2-1-1-0',
        intensityRirOrRpe: 'RIR 1',
        coachingCue: 'Hips piked high in air, lower crown of head forward between hands, push floor away.',
        sportsScienceRationale: 'Transfers bodyweight vertically to replicate overhead barbell pressing.',
        category: 'HYPERTROPHY_ACCESSORY'
      });
    }

    if (dur >= 60) {
      steps.push({
        id: 'bw-acc-3',
        name: 'Hanging Leg Raises / Hollow Body Rock Finisher',
        targetMuscle: 'Rectus Abdominis, Transverse Abdominis & Hip Flexors',
        sets: 3,
        reps: '15 Reps + 45s Hollow Hold',
        restSeconds: 30,
        tempo: '2-0-1-1',
        intensityRirOrRpe: 'RIR 0 (Burnout)',
        coachingCue: 'Posterior pelvic tilt, compress ribs down toward pelvis, keep lower back flat on floor.',
        sportsScienceRationale: 'High electromyography abdominal recruitment without spinal flexion shear.',
        category: 'METABOLIC_FINISHER'
      });
    }
  }

  // PHASE D: EXTENDED DURATION AEROBIC & LONGEVITY BLOCKS (For Sessions >= 90m to 240m)
  if (dur >= 90) {
    const aerobicMins = Math.min(45, Math.floor(dur * 0.25));
    steps.push({
      id: 'extended-vo2',
      name: intensity === 'SUPERHERO'
        ? 'Norwegian 4x4 VO2 Max Protocol (4 Mins @ 90% HRmax + 3 Mins Active Recovery × 4)'
        : 'Dr. Peter Attia Zone 2 Mitochondrial Aerobic Base (Nasal Breathing)',
      targetMuscle: 'Myocardial Stroke Volume, Mitochondrial Density & Lactate Clearance',
      sets: intensity === 'SUPERHERO' ? 4 : 1,
      reps: `${aerobicMins} Minutes`,
      restSeconds: 0,
      tempo: 'Continuous Aerobic Cadence',
      intensityRirOrRpe: intensity === 'SUPERHERO' ? '90–95% HRmax (Zone 5)' : '65–75% HRmax (Zone 2)',
      coachingCue: intensity === 'SUPERHERO'
        ? 'Push through maximum aerobic ceiling for 4 minutes, recover for 3 minutes, repeat 4 times.'
        : 'Maintain steady nasal breathing pace where you can barely speak a full sentence.',
      sportsScienceRationale: 'Norwegian sports science gold standard to elevate VO2 max and mitochondrial enzyme density.',
      category: 'METABOLIC_FINISHER'
    });
  }

  // PHASE E: COOLDOWN & SPINAL DECOMPRESSION (Universal Longevity Reset)
  steps.push({
    id: 'cooldown-final',
    name: 'Spine Decompression Hang + Diaphragmatic Parasympathetic Reset',
    targetMuscle: 'Intervertebral Discs, Psoas, Central Nervous System',
    sets: 1,
    reps: `${cooldownMins} Minutes`,
    restSeconds: 0,
    tempo: '4s Inhale, 6s Exhale',
    intensityRirOrRpe: 'RPE 2.0 (Restorative Reset)',
    coachingCue: 'Hang passively from bar or lie on floor with knees supported, inhale through nose for 4s, exhale for 6s.',
    sportsScienceRationale: 'Reverses compressive axial forces on discs and downregulates cortisol to jumpstart protein synthesis.',
    category: 'LONGEVITY_RECOVERY'
  });

  return {
    id: `prescript-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    subtitle,
    coachingSource,
    ageBracketLabel,
    durationMinutes: dur,
    difficulty: intensity,
    environment,
    equipment,
    gender,
    targetObjective,
    physiologicalImpact,
    scientificBreakdown,
    calorieBurnEstimate: calorieBurn,
    xpAward,
    warmupMinutes: ageWarmupMins,
    workMinutes: workMins,
    cooldownMinutes: cooldownMins,
    exerciseSteps: steps
  };
}
