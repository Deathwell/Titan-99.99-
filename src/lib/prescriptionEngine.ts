/**
 * Tactical AI Prescription Engine - Elite Sports Science & Longevity Architecture
 * 
 * Synthesizes protocols from world-renowned coaches, sports scientists, and elite athletes:
 * - Dr. Peter Attia & Dr. Andrew Huberman (Longevity, Centenarian Decathlon, Zone 2 & VO2 Max)
 * - Dr. Mike Israetel (Renaissance Periodization - Hypertrophy Volume, Stretch-Mediated Hypertrophy, RIR)
 * - Jeff Nippard & Dr. Brad Schoenfeld (Evidence-Based Biomechanics, Optimal Exercise Sequencing)
 * - Bret Contreras PhD (Glute/Posterior-Chain Biomechanics & Aesthetic Proportioning)
 * - Pavel Tsatsouline & Dan John (Hardstyle Kettlebells, Loaded Carries, Armor Building)
 * - David Goggins & Jocko Willink (Spartan Density, High-Cadence Grit & Military Pyramids)
 * - Jeff Cavaliere MSPT, CSCS (Athlean-X - Joint Integrity, Rotator Cuff & Spine Decompression)
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
  tempo: string; // e.g. "3-1-1-0" (3s eccentric, 1s stretch pause, 1s concentric, 0s top)
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
 * Returns exact age classification and scientific focus
 */
function getAgeProfile(age: number) {
  if (age < 20) {
    return {
      bracket: 'YOUTH / TEEN ATHLETE (15–19)',
      focus: 'Movement Mastery, High Neuroplasticity & Natural GH Surge',
      jointRisk: 'LOW',
      spineDecompressionNeeded: false,
      warmupRatio: 0.10
    };
  } else if (age < 30) {
    return {
      bracket: 'PEAK PHYSIOLOGICAL PRIME (20–29)',
      focus: 'Maximal Powerbuilding, Progressive Overload & High Volume Capacity',
      jointRisk: 'LOW',
      spineDecompressionNeeded: false,
      warmupRatio: 0.10
    };
  } else if (age < 45) {
    return {
      bracket: 'PRIME EXECUTIVE ATHLETE (30–44)',
      focus: 'Hypertrophy Density, Desk-Posture Correction & Joint Longevity',
      jointRisk: 'MODERATE',
      spineDecompressionNeeded: true,
      warmupRatio: 0.15
    };
  } else if (age < 60) {
    return {
      bracket: 'MASTERS LONGEVITY & STRENGTH (45–59)',
      focus: 'High Stimulus-to-Fatigue Ratio (SFR), Rotator Cuff & Metabolic Health',
      jointRisk: 'ELEVATED',
      spineDecompressionNeeded: true,
      warmupRatio: 0.20
    };
  } else {
    return {
      bracket: 'PETER ATTIA CENTENARIAN DECATHLON (60–75+)',
      focus: 'Fall Prevention, Bone Mineral Density, Joint-Sparing Cables & Grip Stability',
      jointRisk: 'HIGH_PRIORITY_CARE',
      spineDecompressionNeeded: true,
      warmupRatio: 0.25
    };
  }
}

export function generateCustomPrescription(params: PrescriptionFilterParams): TacticalPrescription {
  const { age, gender, environment, equipment, intensity, durationMinutes } = params;
  const dur = Math.max(15, Math.min(240, durationMinutes));
  const ageProf = getAgeProfile(age);

  const isIndoor = environment === 'INDOOR';
  const hasEquipment = equipment === 'EQUIPMENT';
  const isFemale = gender === 'FEMALE';
  const isSenior = age >= 60;
  const isMasters = age >= 45 && age < 60;
  const isPrime = age < 45;

  // Calorie & XP Engine
  const intensityMultipliers: Record<IntensityLevel, number> = {
    BEGINNER: 6.8,
    INTERMEDIATE: 9.2,
    ADVANCED: 11.5,
    SUPERHERO: 14.2
  };
  const ageMetabolicFactor = age > 60 ? 0.85 : age > 45 ? 0.92 : 1.0;
  const calorieBurn = Math.round(dur * intensityMultipliers[intensity] * ageMetabolicFactor);
  const xpAward = Math.floor(dur * 1.6);

  // Time segment splits
  const warmupMins = Math.max(3, Math.round(dur * ageProf.warmupRatio));
  const cooldownMins = Math.max(3, Math.round(dur * 0.10));
  const mainWorkMins = Math.max(9, dur - warmupMins - cooldownMins);

  let title = '';
  let subtitle = '';
  let coachingSource = '';
  let targetObjective = '';
  let physiologicalImpact = '';
  let scientificBreakdown: string[] = [];
  const steps: ExerciseStep[] = [];

  // =========================================================================
  // SCENARIO 1: SENIOR / MASTERS LONGEVITY (Age 60 - 75+) - Dr. Peter Attia & Brad Schoenfeld
  // =========================================================================
  if (isSenior) {
    coachingSource = 'Dr. Peter Attia (Outlive) & Dr. Brad Schoenfeld (Joint-Sparing Hypertrophy)';
    title = hasEquipment
      ? 'Centenarian Decathlon: Joint-Sparing Strength & Bone Density'
      : 'Anti-Fragile Calisthenics: Balance, Core & Fall Prevention';
    subtitle = `${dur}m joint-sparing longevity protocol engineered for age ${age} (${intensity.toLowerCase()} tier)`;
    targetObjective = 'Preserve myofibrillar mass, elevate bone mineral density, and bulletproof hips and spine without axial joint crush';
    physiologicalImpact = 'Stimulates type-II muscle motor units, enhances proprioceptive balance, and protects hip cartilage';
    scientificBreakdown = [
      'Zero axial spinal loading (no heavy vertical compression)',
      'High Stimulus-to-Fatigue Ratio (SFR) via controlled 3-second eccentric tempo',
      'Proprioception & grip strength priority to minimize all-cause mortality risk',
      'Rotator cuff & thoracic opening to reverse forward-head kyphosis'
    ];

    // Warmup
    steps.push({
      id: 'step-warmup-1',
      name: 'Cat-Cow + World\'s Greatest Stretch & Thoracic Opener',
      targetMuscle: 'Spine, Hip Flexors, Thoracic Mobility',
      sets: 2,
      reps: '8 Reps / Side',
      restSeconds: 30,
      tempo: '3-2-2-0',
      intensityRirOrRpe: 'RPE 5.0 (Gentle Flow)',
      coachingCue: 'Breathe deeply through belly, mobilize spine segment by segment.',
      sportsScienceRationale: 'Hydrates intervertebral discs and lubricates synovial joint fluid before loading.',
      category: 'WARMUP'
    });

    if (hasEquipment) {
      steps.push({
        id: 'step-senior-1',
        name: 'Seated Chest-Supported Cable / Dumbbell Row',
        targetMuscle: 'Rhomboids, Lats, Mid-Traps & Rotator Cuff',
        sets: intensity === 'SUPERHERO' ? 4 : 3,
        reps: '10–12 Reps',
        restSeconds: 60,
        tempo: '3-1-1-1 (Pause at Squeeze)',
        intensityRirOrRpe: 'RIR 2 (RPE 7.5)',
        coachingCue: 'Chest pinned against pad, pull elbows down and back without shrugging.',
        sportsScienceRationale: 'Zero lower back strain while rebuilding scapular posture and grip power.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'step-senior-2',
        name: 'Supported Goblet Squat onto Box (Knee-Friendly)',
        targetMuscle: 'Quadriceps, Gluteus Maximus & Knee Cartilage',
        sets: intensity === 'SUPERHERO' ? 4 : 3,
        reps: '10 Reps',
        restSeconds: 60,
        tempo: '3-1-1-0',
        intensityRirOrRpe: 'RIR 2 (RPE 7.5)',
        coachingCue: 'Hold light dumbbell at chest, tap hips lightly to box, drive through midfoot.',
        sportsScienceRationale: 'Guaranteed depth control prevents patellofemoral shear while loading hip extensors.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'step-senior-3',
        name: 'Standing Cable / Dumbbell Incline Chest Press',
        targetMuscle: 'Upper Pectorals, Anterior Deltoid & Core Bracing',
        sets: 3,
        reps: '12 Reps',
        restSeconds: 45,
        tempo: '3-0-1-0',
        intensityRirOrRpe: 'RIR 2 (RPE 7.5)',
        coachingCue: 'Stand with split stance, press forward and upward smoothly.',
        sportsScienceRationale: 'Avoids shoulder impingement compared to flat barbell bench press.',
        category: 'HYPERTROPHY_ACCESSORY'
      });

      steps.push({
        id: 'step-senior-4',
        name: 'Farmer\'s Walk Grip & Posture Carry',
        targetMuscle: 'Trapezius, Forearm Grip, Core Stability',
        sets: 3,
        reps: '40 Meters',
        restSeconds: 60,
        tempo: 'Controlled Cadence',
        intensityRirOrRpe: 'RPE 8.0',
        coachingCue: 'Stand tall like a titan, shoulder blades retracted, walk with steady heel-to-toe stride.',
        sportsScienceRationale: 'Peter Attia\'s #1 test for biological resilience and dynamic core stabilization.',
        category: 'ISOLATION_STRETCH'
      });
    } else {
      // Senior Bodyweight / No Equipment
      steps.push({
        id: 'step-senior-bw-1',
        name: 'Chair Squats to Stand with 2-Sec Iso Hold',
        targetMuscle: 'Quads, Glutes & Pelvic Floor',
        sets: 4,
        reps: '12 Reps',
        restSeconds: 45,
        tempo: '3-2-1-0',
        intensityRirOrRpe: 'RIR 2 (RPE 7.0)',
        coachingCue: 'Sit back into hips, pause on chair, stand up tall without rocking.',
        sportsScienceRationale: 'Fundamental independence movement preventing sarcopenia in lower limbs.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'step-senior-bw-2',
        name: 'Incline Wall / Countertop Push-Ups + Scapular Push',
        targetMuscle: 'Chest, Serratus Anterior & Triceps',
        sets: 3,
        reps: '12–15 Reps',
        restSeconds: 45,
        tempo: '3-1-1-0',
        intensityRirOrRpe: 'RIR 2 (RPE 7.0)',
        coachingCue: 'Elbows at 45 degrees, push the wall away aggressively at the top.',
        sportsScienceRationale: 'Activates serratus anterior to lock the shoulder blade and avoid rotator cuff tears.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'step-senior-bw-3',
        name: 'Single-Leg Balance Stance & Tandem Stride',
        targetMuscle: 'Ankle Stabilizers, Glute Medius & Vestibular System',
        sets: 3,
        reps: '30s / Leg',
        restSeconds: 30,
        tempo: 'Static Hold',
        intensityRirOrRpe: 'RPE 6.5',
        coachingCue: 'Fix eyes on a point on the wall, brace core, lift one knee to 90 degrees.',
        sportsScienceRationale: 'Crucial neuromuscular drill to drastically reduce fall vulnerability.',
        category: 'ISOLATION_STRETCH'
      });

      steps.push({
        id: 'step-senior-bw-4',
        name: 'Doorway Isometric Lat Row + Dead-Bug Bracing',
        targetMuscle: 'Lats, Rhomboids & Transverse Abdominis',
        sets: 3,
        reps: '10 Reps + 30s Hold',
        restSeconds: 45,
        tempo: '2-2-1-0',
        intensityRirOrRpe: 'RIR 2',
        coachingCue: 'Grip doorway frame, pull body forward with back muscles; keep lower back flat on floor for dead bugs.',
        sportsScienceRationale: 'Reinforces anterior core stiffness while maintaining neutral lumbar curvature.',
        category: 'HYPERTROPHY_ACCESSORY'
      });
    }

    // Cooldown
    steps.push({
      id: 'step-senior-cool',
      name: 'Nasal Diaphragmatic Breathing & Hamstring Decompression',
      targetMuscle: 'Parasympathetic Nervous System & Posterior Chain',
      sets: 1,
      reps: `${cooldownMins} Minutes`,
      restSeconds: 0,
      tempo: '4s Inhale, 6s Exhale',
      intensityRirOrRpe: 'RPE 2.0 (Deep Reset)',
      coachingCue: 'Lie with legs elevated on a sofa or wall, inhale through nose for 4 seconds, exhale for 6.',
      sportsScienceRationale: 'Transitions the central nervous system from sympathetic fight-or-flight into restorative anabolic repair.',
      category: 'LONGEVITY_RECOVERY'
    });
  }

  // =========================================================================
  // SCENARIO 2: FEMALE AESTHETIC & POSTERIOR CHAIN (Age 15 - 59) - Bret Contreras & Schoenfeld
  // =========================================================================
  else if (isFemale) {
    coachingSource = 'Bret Contreras PhD ("The Glute Guy") & Dr. Brad Schoenfeld (Hypertrophy Mechanics)';
    title = hasEquipment
      ? (intensity === 'SUPERHERO' ? 'Goddess Titan: Heavy Hip Thrust & Hourglass Architecture' : 'Hourglass Hypertrophy: Glutes, Delts & Core V-Taper')
      : 'Calisthenics Glute Sculpt & Tight Core Circuit';
    subtitle = `${dur}m evidence-based glute-to-shoulder ratio protocol tailored for ${age}yo female (${intensity.toLowerCase()})`;
    targetObjective = 'Maximize gluteus maximus/medius mechanical tension, cap lateral deltoids, and tighten transverse abdominis';
    physiologicalImpact = 'Stimulates glute hypertrophy without quad dominance, optimizes lumbar support and pelvic floor tone';
    scientificBreakdown = [
      'High horizontal hip abduction tension to target upper glute shelf',
      'Lengthened-state partials on Romanian Deadlifts for maximal hamstring stretch',
      'Lateral delt emphasis to create optical waist-slimming taper',
      'Zero spinal compressive risk on pelvic structures'
    ];

    // Warmup
    steps.push({
      id: 'step-warmup-female',
      name: 'Glute Bridge Activation + Lateral Band Walks',
      targetMuscle: 'Gluteus Medius, Minimus & Hip Capsule',
      sets: 2,
      reps: '15 Reps',
      restSeconds: 30,
      tempo: '2-1-1-1',
      intensityRirOrRpe: 'RPE 6.0',
      coachingCue: 'Drive knees outward, squeeze glutes at the top until you feel intense burn.',
      sportsScienceRationale: 'Awakens dormant glute motor units before heavy axial loading to avoid quad takeover.',
      category: 'WARMUP'
    });

    if (hasEquipment) {
      steps.push({
        id: 'step-female-1',
        name: 'Barbell / Dumbbell Hip Thrust (Top 2-Sec Lockout)',
        targetMuscle: 'Gluteus Maximus (Peak Shortened Position)',
        sets: intensity === 'SUPERHERO' ? 5 : 4,
        reps: intensity === 'SUPERHERO' ? '8–10 Reps (Heavy)' : '10–12 Reps',
        restSeconds: 75,
        tempo: '2-0-1-2 (2s Squeeze at Top)',
        intensityRirOrRpe: intensity === 'SUPERHERO' ? 'RIR 1 (RPE 9.0)' : 'RIR 2 (RPE 8.0)',
        coachingCue: 'Tuck chin into chest, anterior pelvic tilt at top, drive purely through heels.',
        sportsScienceRationale: 'Highest electromyography (EMG) activation of gluteus maximus in the entire kinesiology literature.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'step-female-2',
        name: 'Dumbbell Romanian Deadlift (Deep Stretch Bias)',
        targetMuscle: 'Hamstrings & Glute-Ham Tie-In',
        sets: 4,
        reps: '10–12 Reps',
        restSeconds: 60,
        tempo: '3-1-1-0',
        intensityRirOrRpe: 'RIR 2 (RPE 8.0)',
        coachingCue: 'Push hips straight back toward the wall behind you, keep dumbbells glued to shins.',
        sportsScienceRationale: 'Triggers stretch-mediated hypertrophy by loading the hamstring in its fully elongated state.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'step-female-3',
        name: 'Dumbbell / Cable Lean-Away Lateral Raises',
        targetMuscle: 'Lateral Deltoids (Shoulder Cap Aesthetics)',
        sets: 4,
        reps: '12–15 Reps',
        restSeconds: 45,
        tempo: '2-0-1-1',
        intensityRirOrRpe: 'RIR 1 (RPE 8.5)',
        coachingCue: 'Lean body 15 degrees, lead with elbows and pinkies, control the negative descent.',
        sportsScienceRationale: 'Builds side delts to create the hourglass visual silhouette against the waistline.',
        category: 'HYPERTROPHY_ACCESSORY'
      });

      steps.push({
        id: 'step-female-4',
        name: 'Cable Kickbacks / Seated Hip Abduction Drop-Set',
        targetMuscle: 'Upper Glute Shelf (Glute Medius)',
        sets: 3,
        reps: '15 Reps + 5 Partial Pulses',
        restSeconds: 45,
        tempo: '2-1-1-1',
        intensityRirOrRpe: 'RIR 0 (To Failure)',
        coachingCue: 'Hinge slightly at hips, kick back at a 45-degree angle, squeeze top for 1 full second.',
        sportsScienceRationale: 'Maximizes metabolic stress and cellular swelling in the upper glute fibers.',
        category: 'ISOLATION_STRETCH'
      });
    } else {
      // Female Bodyweight / No Equipment
      steps.push({
        id: 'step-female-bw-1',
        name: 'Elevated Single-Leg Hip Thrusts (Couch / Bench)',
        targetMuscle: 'Gluteus Maximus & Hamstrings',
        sets: 4,
        reps: '15 Reps / Leg',
        restSeconds: 45,
        tempo: '2-1-1-2',
        intensityRirOrRpe: 'RIR 1',
        coachingCue: 'Place upper back on couch, drive through one heel, pause at top peak lockout.',
        sportsScienceRationale: 'Doubles the load per glute to stimulate mechanical tension without weights.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'step-female-bw-2',
        name: 'Bulgarian Split Squats (Forward Torso Lean)',
        targetMuscle: 'Glute Maximus Stretch & Quads',
        sets: 4,
        reps: '12 Reps / Leg',
        restSeconds: 45,
        tempo: '3-1-1-0',
        intensityRirOrRpe: 'RIR 1',
        coachingCue: 'Lean torso 30 degrees forward to shift 85% of tension directly onto the lead glute.',
        sportsScienceRationale: 'Deepest possible glute stretch under bodyweight leverage.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'step-female-bw-3',
        name: 'Pike Push-Ups / High Incline Push-Ups',
        targetMuscle: 'Delts, Upper Chest & Triceps',
        sets: 3,
        reps: '10–12 Reps',
        restSeconds: 45,
        tempo: '3-0-1-0',
        intensityRirOrRpe: 'RIR 2',
        coachingCue: 'Hips high in the air, lower crown of head gently toward floor.',
        sportsScienceRationale: 'Builds upper body tone and posture without heavy barbell overhead pressing.',
        category: 'HYPERTROPHY_ACCESSORY'
      });

      steps.push({
        id: 'step-female-bw-4',
        name: 'Frog Pumps + Vacuum Abdominal Bracing',
        targetMuscle: 'Glutes Burnout & Transverse Abdominis',
        sets: 3,
        reps: '25 Reps + 30s Vacuum Hold',
        restSeconds: 30,
        tempo: '1-0-1-1',
        intensityRirOrRpe: 'RIR 0 (Metabolic Burn)',
        coachingCue: 'Soles of feet pressed together, pump hips up rapidly; pull belly button to spine for vacuum.',
        sportsScienceRationale: 'Tightens the inner abdominal wall corset while finishing glutes with high lactate accumulation.',
        category: 'METABOLIC_FINISHER'
      });
    }

    // Cooldown
    steps.push({
      id: 'step-female-cool',
      name: 'Pigeon Pose Stretch & 90/90 Hip Mobility Flow',
      targetMuscle: 'Piriformis, Hip Capsule & IT Band',
      sets: 1,
      reps: `${cooldownMins} Minutes`,
      restSeconds: 0,
      tempo: 'Deep Static Hold',
      intensityRirOrRpe: 'RPE 3.0',
      coachingCue: 'Sink weight into lead hip, breathe into tight areas, keep chest open.',
      sportsScienceRationale: 'Prevents piriformis syndrome and maintains optimal hip internal/external rotation balance.',
      category: 'LONGEVITY_RECOVERY'
    });
  }

  // =========================================================================
  // SCENARIO 3: MALE / POWERBUILDING / ATHLETE (Age 15 - 59) - Israetel, Nippard, Huberman
  // =========================================================================
  else {
    if (intensity === 'SUPERHERO') {
      coachingSource = 'David Goggins (Spartan Grit) & Dr. Mike Israetel (Maximum Recoverable Volume)';
      title = hasEquipment
        ? (environment === 'OUTDOOR' ? 'Spartan Outdoor Strongman & Barbell Siege' : 'Titan Olympian Powerbuilding & Hypertrophy Siege')
        : 'David Goggins Spartan Bodyweight Death Circuit';
      subtitle = `${dur}m supreme threshold protocol engineered for elite ${age}yo operator (RPE 9.5–10)`;
      targetObjective = 'Unleash maximal androgenic stimulus, recruit high-threshold motor units, and forge indestructible mental fortitude';
      physiologicalImpact = 'Drives extreme myofibrillar micro-trauma, triggers growth hormone pulse, and crushes fatigue barriers';
      scientificBreakdown = [
        'Maximum Recoverable Volume (MRV) mechanical tension loading',
        'Lengthened partials to absolute concentric failure',
        'High-density rest-pause clusters to recruit dormant motor units',
        'Zone 4/5 lactate threshold metabolic finisher'
      ];
    } else if (intensity === 'ADVANCED') {
      coachingSource = 'Dr. Mike Israetel (RP) & Jeff Nippard (Evidence-Based Biomechanics)';
      title = hasEquipment
        ? 'Heavy Push/Pull Compound Hypertrophy Overload'
        : 'High-Density Advanced Calisthenics & Explosive Power';
      subtitle = `${dur}m progressive overload protocol calibrated for ${ageProf.bracket} (RIR 1–2)`;
      targetObjective = 'Maximize muscle cross-sectional area, strength output, and tendon tensile strength';
      physiologicalImpact = 'Stimulates mTOR pathway, maximizes mechanical tension, and enhances force production';
      scientificBreakdown = [
        'Evidence-based 3-second eccentric tempo for hypertrophic signaling',
        'Lengthened-state overload on primary compound movements',
        'Optimal 2–3 minute rest periods for full ATP/CP re-synthesis',
        'Spinal decompression integration to offset heavy compressive loads'
      ];
    } else if (intensity === 'INTERMEDIATE') {
      coachingSource = 'Jeff Nippard & Dr. Andrew Huberman (Athletic Strength & Longevity)';
      title = hasEquipment
        ? 'Compound Strength & V-Taper Aesthetic Sculpting'
        : 'Full-Body Progressive Calisthenics & Conditioning';
      subtitle = `${dur}m balanced athletic performance protocol for ${age}yo operator`;
      targetObjective = 'Build functional athletic power, upper-body V-taper, and explosive hip drive';
      physiologicalImpact = 'Optimizes hormonal balance, builds lean mass, and improves cardiorespiratory recovery';
      scientificBreakdown = [
        'Compound-first ordering for maximal central nervous system efficiency',
        'RIR 2 (2 reps in reserve) to balance stimulus vs systemic fatigue',
        'Core anti-rotation bracing for athletic spinal armor',
        'Zone 2 active flush cooldown'
      ];
    } else {
      // BEGINNER
      coachingSource = 'Firas Zahabi & Jeff Cavaliere MSPT, CSCS (Movement Mastery)';
      title = hasEquipment
        ? 'Foundational Compound Strength & Joint Armor'
        : 'Zero-Friction Foundation Movement & Mobility';
      subtitle = `${dur}m joint-friendly beginner progression protocol for age ${age}`;
      targetObjective = 'Master biomechanical movement patterns, establish mind-muscle connection, and build tendon durability';
      physiologicalImpact = 'Builds baseline neuromuscular coordination without delayed onset muscle soreness (DOMS)';
      scientificBreakdown = [
        'Focus on submaximal consistency over excessive fatigue',
        'Perfect movement trajectory before increasing load',
        'Rotator cuff and posture strengthening',
        'Aerobic base activation'
      ];
    }

    // Warmup
    steps.push({
      id: 'step-warmup-male',
      name: 'Dynamic Scapular Wall Slides + Hip 90/90 Opener',
      targetMuscle: 'Rotator Cuff, Lower Traps, Hip Joint Capsule',
      sets: 2,
      reps: '10 Reps',
      restSeconds: 30,
      tempo: '2-1-1-1',
      intensityRirOrRpe: 'RPE 5.0 (Warmup)',
      coachingCue: 'Keep elbows and wrists pinned flat against wall, slide upward without arching lower back.',
      sportsScienceRationale: 'Activates serratus anterior and lower trapezius to ensure pain-free shoulder kinematics.',
      category: 'WARMUP'
    });

    if (hasEquipment) {
      if (environment === 'OUTDOOR') {
        // Outdoor with Equipment
        steps.push({
          id: 'step-male-out-1',
          name: 'Heavy Barbell / Sandbag Clean & Strict Overhead Press',
          targetMuscle: 'Full-Body Triple Extension, Shoulders & Upper Back',
          sets: intensity === 'SUPERHERO' ? 5 : 4,
          reps: intensity === 'SUPERHERO' ? '6 Reps (Heavy)' : '8 Reps',
          restSeconds: 90,
          tempo: 'Explosive Up, 2s Down',
          intensityRirOrRpe: intensity === 'SUPERHERO' ? 'RIR 1' : 'RIR 2',
          coachingCue: 'Violently pop hips, catch tight in front rack, drive bar straight through the ceiling.',
          sportsScienceRationale: 'Unifies kinetic chain power from ground to fingertips under outdoor elements.',
          category: 'PRIMARY_COMPOUND'
        });

        steps.push({
          id: 'step-male-out-2',
          name: 'Heavy Farmer\'s Walk / Trap Bar Carries',
          targetMuscle: 'Traps, Forearms, Core Anti-Lateral Flexion',
          sets: 4,
          reps: '50 Meters',
          restSeconds: 60,
          tempo: 'Fast Cadence',
          intensityRirOrRpe: 'RPE 8.5',
          coachingCue: 'Pin shoulders down, puff chest out, march with crushing grip.',
          sportsScienceRationale: 'Builds unbreakable structural connective tissue and core armor.',
          category: 'PRIMARY_COMPOUND'
        });
      } else {
        // Indoor Gym with Full Equipment
        steps.push({
          id: 'step-male-gym-1',
          name: 'Incline Barbell / Dumbbell Bench Press (30-Degree Angle)',
          targetMuscle: 'Clavicular Upper Pectoralis & Anterior Deltoids',
          sets: intensity === 'SUPERHERO' ? 5 : 4,
          reps: intensity === 'SUPERHERO' ? '6–8 Reps (Heavy)' : '8–10 Reps',
          restSeconds: 90,
          tempo: '3-1-1-0 (Controlled 3s Negative)',
          intensityRirOrRpe: intensity === 'SUPERHERO' ? 'RIR 1 (RPE 9.0)' : 'RIR 2 (RPE 8.0)',
          coachingCue: 'Retract and depress scapulae into bench, lower bar to upper chest, explode straight up.',
          sportsScienceRationale: '30-degree incline yields 33% greater upper chest activation with reduced rotator cuff strain compared to flat.',
          category: 'PRIMARY_COMPOUND'
        });

        steps.push({
          id: 'step-male-gym-2',
          name: 'Barbell Romanian Deadlift (RDL) with 1s Stretch Pause',
          targetMuscle: 'Hamstrings, Glutes & Spinal Erectors',
          sets: 4,
          reps: '8–10 Reps',
          restSeconds: 90,
          tempo: '3-1-1-0',
          intensityRirOrRpe: 'RIR 2 (RPE 8.0)',
          coachingCue: 'Hinge hips backwards, maintain flat spine, pause 1 second at maximum hamstring stretch.',
          sportsScienceRationale: 'Peak mechanical tension in lengthened state triggers maximum muscle protein synthesis.',
          category: 'PRIMARY_COMPOUND'
        });

        steps.push({
          id: 'step-male-gym-3',
          name: 'Chest-Supported T-Bar / Dumbbell Row',
          targetMuscle: 'Latissimus Dorsi, Rhomboids, Middle Traps',
          sets: 4,
          reps: '10–12 Reps',
          restSeconds: 60,
          tempo: '2-1-1-1 (1s Peak Squeeze)',
          intensityRirOrRpe: 'RIR 1–2',
          coachingCue: 'Pull with elbows towards hips, avoid shrugging, feel back muscles contract like a vice.',
          sportsScienceRationale: 'Chest support eliminates lower back shear, channeling 100% of stimulus directly to back width.',
          category: 'HYPERTROPHY_ACCESSORY'
        });

        steps.push({
          id: 'step-male-gym-4',
          name: 'Cable / Dumbbell Lateral Raises + Face-Pulls Superset',
          targetMuscle: 'Lateral Deltoids (Cap Width) & External Rotators',
          sets: 4,
          reps: '12–15 Reps Each',
          restSeconds: 45,
          tempo: '2-0-1-1',
          intensityRirOrRpe: 'RIR 1',
          coachingCue: 'Lead with pinkies on laterals; pull rope to eye level with thumbs back on face-pulls.',
          sportsScienceRationale: 'Builds 3D shoulder width while balancing internal rotator dominance from pressing.',
          category: 'ISOLATION_STRETCH'
        });

        steps.push({
          id: 'step-male-gym-5',
          name: 'Incline Dumbbell Biceps Curl + Cable Rope Triceps Pressdown',
          targetMuscle: 'Biceps Long Head & Triceps Lateral/Medial Heads',
          sets: 3,
          reps: '10–12 Reps Each',
          restSeconds: 45,
          tempo: '3-0-1-1',
          intensityRirOrRpe: 'RIR 1',
          coachingCue: 'Full elbow extension at bottom of curl; flare rope apart at bottom of triceps pressdown.',
          sportsScienceRationale: 'Incline bench places long head of biceps under deep stretch, maximizing growth hormone signaling.',
          category: 'ISOLATION_STRETCH'
        });
      }
    } else {
      // Male Calisthenics / Bodyweight (No Equipment)
      steps.push({
        id: 'step-male-bw-1',
        name: intensity === 'SUPERHERO' ? 'Explosive Deficit / Clap Push-Ups' : 'Tempo Deficit Push-Ups (3s Down)',
        targetMuscle: 'Pectoralis Major, Triceps & Anterior Delts',
        sets: intensity === 'SUPERHERO' ? 5 : 4,
        reps: intensity === 'SUPERHERO' ? '20–25 Reps' : '15 Reps',
        restSeconds: 60,
        tempo: '3-1-1-0',
        intensityRirOrRpe: intensity === 'SUPERHERO' ? 'RIR 0 (Failure)' : 'RIR 1',
        coachingCue: 'Hands slightly wider than shoulders, lock core like a steel rod, explode off floor.',
        sportsScienceRationale: 'Maximizes fast-twitch motor unit recruitment under bodyweight biomechanics.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'step-male-bw-2',
        name: 'Doorway / Pull-Up Bar Strict Dead-Hang Pull-Ups or Rows',
        targetMuscle: 'Latissimus Dorsi, Biceps & Forearm Grip',
        sets: 4,
        reps: intensity === 'SUPERHERO' ? '12–15 Reps' : '8–10 Reps',
        restSeconds: 60,
        tempo: '2-1-1-0',
        intensityRirOrRpe: 'RIR 1–2',
        coachingCue: 'Start from dead hang, drive chest up toward the bar, avoid kicking legs.',
        sportsScienceRationale: 'Gold standard vertical pulling movement for lat width and grip endurance.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'step-male-bw-3',
        name: 'Single-Leg Bulgarian Split Squats / Pistol Squats',
        targetMuscle: 'Quadriceps, Glutes & Ankle Proprioception',
        sets: 4,
        reps: '12 Reps / Leg',
        restSeconds: 45,
        tempo: '3-1-1-0',
        intensityRirOrRpe: 'RIR 1',
        coachingCue: 'Rear foot elevated on chair/couch, sink front knee to 90 degrees, push through midfoot.',
        sportsScienceRationale: 'Delivers equivalent quadriceps hypertrophy to barbell back squats without spinal load.',
        category: 'PRIMARY_COMPOUND'
      });

      steps.push({
        id: 'step-male-bw-4',
        name: 'Pike Push-Ups / Wall-Walk Handstand Hold',
        targetMuscle: 'Anterior Deltoids, Clavicular Head & Core Stability',
        sets: 3,
        reps: intensity === 'SUPERHERO' ? '12 Reps + 45s Hold' : '10 Reps',
        restSeconds: 45,
        tempo: '2-1-1-0',
        intensityRirOrRpe: 'RIR 1',
        coachingCue: 'Pike hips high, lower head diagonally forward between hands, push floor away.',
        sportsScienceRationale: 'Transfers bodyweight load vertically to replicate overhead barbell pressing.',
        category: 'HYPERTROPHY_ACCESSORY'
      });

      steps.push({
        id: 'step-male-bw-5',
        name: 'Hanging Leg Raises / Hollow Body Rock Finisher',
        targetMuscle: 'Rectus Abdominis & Deep Transverse Core',
        sets: 3,
        reps: '15 Reps + 45s Hollow Hold',
        restSeconds: 30,
        tempo: '2-0-1-1',
        intensityRirOrRpe: 'RIR 0 (Burnout)',
        coachingCue: 'Posterior pelvic tilt, compress ribs toward pelvis, avoid swinging.',
        sportsScienceRationale: 'High electromyography abdominal recruitment without spinal flexion strain.',
        category: 'METABOLIC_FINISHER'
      });
    }

    // Cooldown
    steps.push({
      id: 'step-male-cool',
      name: 'Spine Decompression Hang + Quadriceps Couch Stretch',
      targetMuscle: 'Lumbar Spine, Psoas & Hip Flexors',
      sets: 1,
      reps: `${cooldownMins} Minutes`,
      restSeconds: 0,
      tempo: 'Static Relaxed Stretch',
      intensityRirOrRpe: 'RPE 2.0 (Parasympathetic Reset)',
      coachingCue: 'Hang passively from bar/doorframe to open intervertebral space; breathe deeply.',
      sportsScienceRationale: 'Reverses compressive axial forces on discs and downregulates cortisol.',
      category: 'LONGEVITY_RECOVERY'
    });
  }

  // =========================================================================
  // LONG-DURATION EXPANSION (90m to 240m)
  // =========================================================================
  if (dur >= 90) {
    // Add Norwegian 4x4 VO2 Max or Zone 2 Aerobic Base
    const aerobicMins = Math.min(45, Math.floor(dur * 0.25));
    steps.splice(steps.length - 1, 0, {
      id: 'step-long-vo2',
      name: intensity === 'SUPERHERO'
        ? 'Norwegian 4x4 Protocol (4 Mins @ 90% HRmax + 3 Mins Active Recovery × 4)'
        : 'Peter Attia Zone 2 Mitochondrial Base Flush (Nasal Breathing)',
      targetMuscle: 'Myocardial Stroke Volume, Mitochondrial Density & Lactate Clearance',
      sets: intensity === 'SUPERHERO' ? 4 : 1,
      reps: `${aerobicMins} Minutes`,
      restSeconds: 0,
      tempo: 'Continuous Aerobic Cadence',
      intensityRirOrRpe: intensity === 'SUPERHERO' ? '90–95% HRmax (Zone 5)' : '65–75% HRmax (Zone 2)',
      coachingCue: intensity === 'SUPERHERO'
        ? 'Push through maximum aerobic ceiling for 4 minutes, recover for 3 minutes, repeat.'
        : 'Maintain steady nasal breathing pace where you can barely speak a full sentence.',
      sportsScienceRationale: 'Dr. Peter Attia & Norwegian sports science gold standard to expand VO2 max and cellular longevity.',
      category: 'METABOLIC_FINISHER'
    });
  }

  return {
    id: `prescript-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    subtitle,
    coachingSource,
    ageBracketLabel: ageProf.bracket,
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
    warmupMinutes: warmupMins,
    workMinutes: mainWorkMins,
    cooldownMinutes: cooldownMins,
    exerciseSteps: steps
  };
}
