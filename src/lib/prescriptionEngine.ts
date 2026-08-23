/**
 * Tactical AI Prescription Engine
 * Generates tailored workouts and study curricula based on:
 * - Age
 * - Gender
 * - Environment (Indoor / Outdoor)
 * - Equipment (Equipment / No Equipment)
 * - Intensity (Beginner, Intermediate, Advanced, Superhero)
 * - Time Commitment (15 mins to 240 mins in 15-min intervals)
 */

export type IntensityLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'SUPERHERO';
export type EnvironmentType = 'INDOOR' | 'OUTDOOR';
export type EquipmentType = 'EQUIPMENT' | 'NO_EQUIPMENT';
export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';

export interface ExerciseStep {
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  intensityRpe: string;
  cue: string;
}

export interface TacticalPrescription {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  difficulty: IntensityLevel;
  environment: EnvironmentType;
  equipment: EquipmentType;
  gender: GenderType;
  targetObjective: string;
  physiologicalImpact: string;
  calorieBurnEstimate: number;
  xpAward: number;
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

export function generateCustomPrescription(params: PrescriptionFilterParams): TacticalPrescription {
  const { age, gender, environment, equipment, intensity, durationMinutes } = params;
  const dur = Math.max(15, Math.min(240, durationMinutes));

  // Intensity RPE mapping
  const rpeMap: Record<IntensityLevel, string> = {
    BEGINNER: 'RPE 6.5–7.0',
    INTERMEDIATE: 'RPE 7.5–8.5',
    ADVANCED: 'RPE 8.5–9.5',
    SUPERHERO: 'RPE 9.5–10.0 (TITAN MAX)'
  };

  const restSecondsMap: Record<IntensityLevel, number> = {
    BEGINNER: 75,
    INTERMEDIATE: 60,
    ADVANCED: 45,
    SUPERHERO: 30
  };

  const isIndoor = environment === 'INDOOR';
  const hasEquipment = equipment === 'EQUIPMENT';

  // Base Calorie Calculation: intensity factor * minutes * age modifier
  const intensityCalorieMultipliers: Record<IntensityLevel, number> = {
    BEGINNER: 6.5,
    INTERMEDIATE: 8.5,
    ADVANCED: 10.5,
    SUPERHERO: 13.0
  };
  const ageFactor = age > 50 ? 0.9 : 1.0;
  const calorieBurn = Math.round(dur * intensityCalorieMultipliers[intensity] * ageFactor);
  const xpAward = Math.floor(dur * 1.5);

  // Generate dynamic tailored title and steps
  let title = '';
  let subtitle = '';
  let targetObjective = '';
  let physiologicalImpact = '';
  let steps: ExerciseStep[] = [];

  const rpe = rpeMap[intensity];
  const rest = restSecondsMap[intensity];

  // Logic Matrix: Equipment vs No Equipment + Indoor vs Outdoor + Intensity
  if (!hasEquipment) {
    // Bodyweight / Calisthenics / Park / Home
    if (environment === 'OUTDOOR') {
      title = intensity === 'SUPERHERO'
        ? 'Spartan Outdoor Calisthenics Siege'
        : intensity === 'ADVANCED'
        ? 'Outdoor Athletic Conditioning & Sprints'
        : intensity === 'INTERMEDIATE'
        ? 'Park Bodyweight & Hill Stamina Drill'
        : 'Outdoor Fresh-Air Mobilization & Stride';

      subtitle = `${dur}m bodyweight circuit under natural sunlight (${intensity.toLowerCase()} tier)`;
      targetObjective = 'Explosive body control, functional strength, and high-cadence oxygen uptake';
      physiologicalImpact = 'Drives lymphatic drainage, Vitamin D synthesis, and athletic posture';

      steps = [
        {
          name: intensity === 'SUPERHERO' ? 'Hill Sprints & Depth Jumps' : 'Brisk Stride & High Knees',
          targetMuscle: 'Cardiorespiratory Engine & Fast-Twitch Fibers',
          sets: intensity === 'SUPERHERO' ? 8 : intensity === 'ADVANCED' ? 6 : 4,
          reps: '30s Sprints',
          restSeconds: rest,
          intensityRpe: rpe,
          cue: 'Drive arms violently, strike ground with midfoot spring.'
        },
        {
          name: 'Park Bench / Bar Pull-Ups or Inverted Rows',
          targetMuscle: 'Lats, Rhomboids, Biceps',
          sets: intensity === 'SUPERHERO' ? 5 : 4,
          reps: intensity === 'SUPERHERO' ? '12–15 Reps' : '8–10 Reps',
          restSeconds: rest,
          intensityRpe: rpe,
          cue: 'Full dead-hang stretch, pull chest toward bar.'
        },
        {
          name: 'Explosive Push-Ups (Clap or Deficit)',
          targetMuscle: 'Chest, Triceps, Anterior Delts',
          sets: intensity === 'SUPERHERO' ? 5 : 4,
          reps: intensity === 'SUPERHERO' ? '20–25 Reps' : '12–15 Reps',
          restSeconds: rest,
          intensityRpe: rpe,
          cue: 'Tight core, elbows at 45 degrees, explode off ground.'
        },
        {
          name: 'Walking Jump Lunges & Bulgarian Split Squats',
          targetMuscle: 'Quadriceps & Glute Medius',
          sets: 4,
          reps: '15 Reps / Leg',
          restSeconds: rest,
          intensityRpe: rpe,
          cue: 'Keep torso tall, absorb landing softly through heel.'
        },
        {
          name: 'Hanging Knee/Leg Raises & Plank Hold',
          targetMuscle: 'Core & Anti-Extension',
          sets: 3,
          reps: '15 Reps + 60s Hold',
          restSeconds: 30,
          intensityRpe: rpe,
          cue: 'Tuck pelvis, compress lower abdominals continuously.'
        }
      ];
    } else {
      // INDOOR + NO EQUIPMENT
      title = intensity === 'SUPERHERO'
        ? 'Titan Bodyweight Hypertrophy Decathlon'
        : intensity === 'ADVANCED'
        ? 'High-Density Calisthenics Burn'
        : intensity === 'INTERMEDIATE'
        ? 'Full-Body Isometric & Hypertrophy Routine'
        : 'Foundation Movement & Joint Activation';

      subtitle = `${dur}m zero-equipment home routine tailored for ${gender.toLowerCase() === 'female' ? 'glute/core aesthetics' : 'V-taper definition'}`;
      targetObjective = 'Maximum time-under-tension using pure biomechanics and body mass';
      physiologicalImpact = 'Stimulates myofibrillar density without joint compression';

      steps = [
        {
          name: 'Tempo Push-Ups (3s Down, 1s Pause, Explode)',
          targetMuscle: 'Chest, Shoulders, Triceps',
          sets: intensity === 'SUPERHERO' ? 6 : 4,
          reps: intensity === 'SUPERHERO' ? '20 Reps' : '12–15 Reps',
          restSeconds: rest,
          intensityRpe: rpe,
          cue: 'Lock core like a plank, maintain 3-second descent tempo.'
        },
        {
          name: 'Pike Push-Ups / Handstand Hold',
          targetMuscle: 'Anterior Deltoids & Upper Traps',
          sets: 4,
          reps: intensity === 'SUPERHERO' ? '12 Reps' : '8–10 Reps',
          restSeconds: rest,
          intensityRpe: rpe,
          cue: 'Elevate feet on chair/couch, lower head between hands.'
        },
        {
          name: 'Single-Leg Pistol Squat / Skater Squats',
          targetMuscle: 'Quads, Glutes & Ankle Stability',
          sets: 4,
          reps: '10 Reps / Leg',
          restSeconds: rest,
          intensityRpe: rpe,
          cue: 'Reach arms forward for counter-balance, push through midfoot.'
        },
        {
          name: 'Doorframe / Towel Isometric Rows',
          targetMuscle: 'Lats & Upper Back Retraction',
          sets: 4,
          reps: '15 Reps (2s Squeeze)',
          restSeconds: rest,
          intensityRpe: rpe,
          cue: 'Drive elbows back, aggressively pinch shoulder blades.'
        },
        {
          name: 'Hollow Body Rock & V-Up Finisher',
          targetMuscle: 'Rectus Abdominis & Deep Core',
          sets: 3,
          reps: '45s Work / 15s Rest',
          restSeconds: 30,
          intensityRpe: rpe,
          cue: 'Lower back glued flat against the floor at all times.'
        }
      ];
    }
  } else {
    // FULL EQUIPMENT (GYM / BARBELLS / DUMBBELLS / MACHINES)
    if (environment === 'OUTDOOR') {
      title = intensity === 'SUPERHERO'
        ? 'Outdoor Strongman & Heavy Ruck Siege'
        : 'Outdoor Kettlebell & Barbell Conditioning';

      subtitle = `${dur}m heavy outdoor iron & functional power complex`;
      targetObjective = 'Systemic functional armor, grip endurance, and anaerobic power';
      physiologicalImpact = 'Unlocks high androgenic signaling and mental resilience';

      steps = [
        {
          name: 'Heavy Kettlebell / Barbell Clean & Press',
          targetMuscle: 'Full-Body Power & Shoulders',
          sets: intensity === 'SUPERHERO' ? 6 : 4,
          reps: '8 Reps',
          restSeconds: rest,
          intensityRpe: rpe,
          cue: 'Pop hips explosively, catch in rack position, strict press.'
        },
        {
          name: 'Heavy Farmer Walk Carries',
          targetMuscle: 'Traps, Forearms, Core Stability',
          sets: 5,
          reps: '60 Meters',
          restSeconds: 60,
          intensityRpe: rpe,
          cue: 'Shoulders pinned down and back, march with tall spine.'
        },
        {
          name: 'Sandbag / Dumbbell Front Squats',
          targetMuscle: 'Quadriceps, Core, Thoracic Extensors',
          sets: 4,
          reps: '10–12 Reps',
          restSeconds: rest,
          intensityRpe: rpe,
          cue: 'Keep elbows high, sink hips below knee parallel.'
        },
        {
          name: 'Weighted Vest Incline Power Ruck',
          targetMuscle: 'Cardiovascular & Posterior Chain',
          sets: 1,
          reps: `${Math.max(10, Math.floor(dur * 0.3))} Minutes`,
          restSeconds: 0,
          intensityRpe: 'Zone 3',
          cue: 'Aggressive 3.8 mph march, focus on nasal breathing.'
        }
      ];
    } else {
      // INDOOR + FULL EQUIPMENT (GOLD STANDARD GYM)
      title = intensity === 'SUPERHERO'
        ? 'Titan Olympian Compound Overload'
        : intensity === 'ADVANCED'
        ? 'Heavy Push/Pull Hypertrophy Architecture'
        : intensity === 'INTERMEDIATE'
        ? 'Compound Strength & Aesthetic Sculpting'
        : 'Smart Machine & Dumbbell Progression';

      subtitle = `${dur}m institutional barbell & dumbbell mastery tailored for ${age}yr old ${gender.toLowerCase()}`;
      targetObjective = 'Progressive mechanical tension, myofibrillar growth, and VO2 conditioning';
      physiologicalImpact = 'Maximizes growth hormone, muscle protein synthesis, and bone mineral density';

      steps = [
        {
          name: 'Barbell Flat / Incline Bench Press',
          targetMuscle: 'Pectoralis Major & Anterior Deltoids',
          sets: intensity === 'SUPERHERO' ? 5 : 4,
          reps: intensity === 'SUPERHERO' ? '5 Reps (Heavy)' : '8–10 Reps',
          restSeconds: rest + 30,
          intensityRpe: rpe,
          cue: 'Retract scapulae, drive heels into floor, controlled 3s negative.'
        },
        {
          name: 'Barbell Romanian Deadlifts (RDL)',
          targetMuscle: 'Hamstrings, Glutes, Spinal Erectors',
          sets: 4,
          reps: '8–10 Reps',
          restSeconds: rest + 15,
          intensityRpe: rpe,
          cue: 'Hinge hips straight backward, feel deep stretch in hamstrings.'
        },
        {
          name: 'Chest-Supported Row or Lat Pulldown',
          targetMuscle: 'Latissimus Dorsi & Middle Traps',
          sets: 4,
          reps: '10–12 Reps',
          restSeconds: rest,
          intensityRpe: rpe,
          cue: 'Pull with elbows, 1-second squeeze at full contraction.'
        },
        {
          name: 'Dumbbell Lateral Raises (Lean-in Angle)',
          targetMuscle: 'Lateral Deltoids (Shoulder Cap)',
          sets: 4,
          reps: '12–15 Reps',
          restSeconds: 45,
          intensityRpe: rpe,
          cue: 'Lead with pinkies, control the eccentric descent.'
        },
        {
          name: 'Cable Triceps Pressdown + Incline Biceps Superset',
          targetMuscle: 'Triceps Horseshoe & Biceps Peak',
          sets: 3,
          reps: '12 Reps Each',
          restSeconds: 45,
          intensityRpe: rpe,
          cue: 'Pin elbows to sides, full supination and peak lockout.'
        }
      ];
    }
  }

  // If long session (>90m), adjust sets/steps for volume
  if (dur >= 90 && steps.length < 6) {
    steps.push({
      name: 'Zone 2 Cardio Cool-Down Flush',
      targetMuscle: 'Cardiovascular Clearance & Cellular Reset',
      sets: 1,
      reps: `${Math.min(30, Math.floor(dur * 0.25))} Minutes`,
      restSeconds: 0,
      intensityRpe: 'Zone 2 (120–135 BPM)',
      cue: 'Flush lactic acid, transition nervous system into anabolic recovery.'
    });
  }

  return {
    id: `prescript-${Date.now()}`,
    title,
    subtitle,
    durationMinutes: dur,
    difficulty: intensity,
    environment,
    equipment,
    gender,
    targetObjective,
    physiologicalImpact,
    calorieBurnEstimate: calorieBurn,
    xpAward,
    exerciseSteps: steps
  };
}
