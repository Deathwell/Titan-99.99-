/**
 * Comprehensive Sports Science Exercise Guide Database
 * Provides step-by-step form guides, biomechanical breakdowns, common mistakes,
 * pro coaching cues, and SVG visual illustrations for all exercises in Titan Protocol.
 */

export interface ExerciseGuide {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  coachAttribution: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  setupSteps: string[];
  executionSteps: string[];
  commonMistakes: string[];
  proFormCues: string[];
  biomechanicsScience: string;
  illustrationType: 'squat' | 'hinge' | 'press' | 'pull' | 'thrust' | 'lunge' | 'raise' | 'carry' | 'mobility' | 'cardio';
}

export const EXERCISE_GUIDE_DB: Record<string, ExerciseGuide> = {
  'pistol-squat': {
    id: 'pistol-squat',
    name: 'Pistol Squat (Single-Leg Full Squat)',
    aliases: ['pistol squat', 'single leg squat', 'pistols'],
    category: 'Unilateral Quadriceps & Glute Compound',
    targetMuscles: ['Quadriceps (Vastus Medialis/Lateralis)', 'Gluteus Maximus'],
    secondaryMuscles: ['Ankle Stabilizers', 'Hip Flexors', 'Core Bracing'],
    coachAttribution: 'Pavel Tsatsouline & Calisthenics Movement Mastery',
    difficulty: 'Advanced',
    setupSteps: [
      'Stand upright on one leg with arms extended forward for counterbalance.',
      'Extend the non-working leg straight out in front of you, parallel to the ground.',
      'Root the working foot into the floor with 3 points of contact (heel, big toe, pinky toe).'
    ],
    executionSteps: [
      'Initiate the descent by hinging the hips backward and flexing the working knee simultaneously.',
      'Descend under a strict 3-second tempo until your hamstring touches your calf.',
      'Pause for 1 second at the deep bottom position while maintaining an elevated non-working leg.',
      'Drive aggressively through your midfoot and heel to return to a tall standing lockout.'
    ],
    commonMistakes: [
      'Allowing the heel of the working foot to rise off the floor (indicates ankle dorsiflexion restriction).',
      'Collapsing the knee inward (valgus collapse) due to weak glute medius stabilizers.',
      'Rounding the lower back excessively at the bottom.'
    ],
    proFormCues: [
      '💡 "Screw your foot into the ground like you\'re corkscrewing a bottle."',
      '💡 "Keep your arms and chest reaching forward to maintain your center of gravity over the midfoot."'
    ],
    biomechanicsScience: 'Unilateral single-leg squats double the effective relative load on the working leg while eliminating compressive spinal axial shear forces.',
    illustrationType: 'squat'
  },

  'barbell-hip-thrust': {
    id: 'barbell-hip-thrust',
    name: 'Barbell Hip Thrust (2-Sec Top Lockout)',
    aliases: ['hip thrust', 'barbell hip thrust', 'kas glute bridge', 'glute thrust'],
    category: 'Horizontal Posterior Chain Compound',
    targetMuscles: ['Gluteus Maximus (Peak Shortened Position)'],
    secondaryMuscles: ['Hamstrings', 'Adductor Magnus', 'Core Stabilizers'],
    coachAttribution: 'Bret Contreras, PhD ("The Glute Guy")',
    difficulty: 'Intermediate',
    setupSteps: [
      'Sit on the floor with your upper back resting against a sturdy bench just below your shoulder blades.',
      'Roll a padded barbell directly over your hips (use a thick foam pad).',
      'Plant your feet flat on the floor, shoulder-width apart, with toes flared outward 15°.'
    ],
    executionSteps: [
      'Tuck your chin firmly toward your chest and keep your gaze fixed forward at your knees.',
      'Drive forcefully through your heels and midfoot, extending your hips upward toward the ceiling.',
      'At the top lockout (knees at 90°), perform an anterior pelvic tilt (tuck tailbone) and squeeze glutes hard for 2 full seconds.',
      'Lower the weight with a controlled 2-second negative without overarching your lower back.'
    ],
    commonMistakes: [
      'Looking up at the ceiling or overarching the lumbar spine at lockout.',
      'Placing feet too far forward (loads hamstrings) or too close (loads quads). Target 90° shin angle at top.',
      'Failing to pause and squeeze at full horizontal hip extension.'
    ],
    proFormCues: [
      '💡 "Tuck your chin to your chest like you\'re holding an orange under your neck throughout the entire set."',
      '💡 "Crush a walnut between your glutes at the very top of the lockout."'
    ],
    biomechanicsScience: 'Electromyography (EMG) studies by Contreras show horizontal hip extension achieves 200% greater peak gluteus maximus activation than vertical squats.',
    illustrationType: 'thrust'
  },

  'incline-bench-press': {
    id: 'incline-bench-press',
    name: 'Incline Bench Press (30° Clavicular Angle)',
    aliases: ['incline bench', 'incline dumbbell press', 'incline press', 'barbell incline press'],
    category: 'Upper Body Horizontal / Clavicular Press',
    targetMuscles: ['Clavicular Upper Pectoralis Major', 'Anterior Deltoids'],
    secondaryMuscles: ['Triceps Brachii', 'Serratus Anterior'],
    coachAttribution: 'Jeff Nippard & Dr. Mike Israetel',
    difficulty: 'Intermediate',
    setupSteps: [
      'Set an adjustable bench to exactly 30 degrees (steep 45° angles shift too much load to shoulders).',
      'Lie back with your eyes aligned beneath the bar or dumbbells held at shoulder level.',
      'Retract your shoulder blades and pin them firmly into the bench pad with a subtle natural arch.'
    ],
    executionSteps: [
      'Unrack the weight and establish vertical wrist alignment directly over your elbows.',
      'Lower the weight with a strict 3-second eccentric tempo to touch the upper chest (clavicular area).',
      'Pause for 1 second in the lengthened stretch position on the chest.',
      'Press upward and slightly backward along the natural clavicular fiber line of drive.'
    ],
    commonMistakes: [
      'Setting bench angle at 45° to 60° (turns the movement into an overhead shoulder press).',
      'Flaring elbows out at 90° (causes subacromial rotator cuff impingement). Keep elbows tucked at 45°–60°.',
      'Bouncing the bar off the ribcage.'
    ],
    proFormCues: [
      '💡 "Pull the bar down toward your upper chest like you are bending the bar in half."',
      '💡 "Think about bringing your biceps together toward the center of your collarbone."'
    ],
    biomechanicsScience: 'Kinesiology fiber mapping confirms a 30-degree incline maximizes upper pectoral fiber recruitment while reducing anterior shoulder joint sheer.',
    illustrationType: 'press'
  },

  'romanian-deadlift': {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL) with Deep Stretch Focus',
    aliases: ['rdl', 'romanian deadlift', 'dumbbell rdl', 'deficit rdl', 'barbell rdl'],
    category: 'Hip-Hinge Posterior Chain Compound',
    targetMuscles: ['Hamstrings (Biceps Femoris/Semitendinosus)', 'Gluteus Maximus (Lengthened State)'],
    secondaryMuscles: ['Erector Spinae', 'Latissimus Dorsi', 'Forearm Grip'],
    coachAttribution: 'Dr. Mike Israetel & Dr. Brad Schoenfeld',
    difficulty: 'Intermediate',
    setupSteps: [
      'Stand tall with feet hip-width apart, holding barbell or dumbbells with a double-overhand grip.',
      'Unlock your knees slightly (maintain a 15° soft bend throughout the entire lift).',
      'Pull your shoulders back, engage your lats, and take a 360° diaphragmatic breath to brace core.'
    ],
    executionSteps: [
      'Push your hips straight backward toward the wall behind you as if closing a car door with your glutes.',
      'Keep the weights sliding in continuous contact down along your thighs and shins.',
      'Descend under a 3-second negative until your hamstrings reach maximum stretch (usually mid-shin).',
      'Pause for 1 second in the deep stretch, then squeeze glutes to drive hips forward back to starting lockout.'
    ],
    commonMistakes: [
      'Bending the knees too much (turns the movement into a squat and removes hamstring stretch).',
      'Letting the weights drift away from the legs, which creates extreme shear torque on the lower back.',
      'Rounding the thoracic or lumbar spine.'
    ],
    proFormCues: [
      '💡 "Imagine a rope attached to your hips pulling your pelvis straight backward into the wall."',
      '💡 "Keep the bar shaving your leg hair on the way down."'
    ],
    biomechanicsScience: 'Loading the hamstring and glute fibers under tension in their lengthened state triggers stretch-mediated hypertrophy (titin kinase phosphorylation).',
    illustrationType: 'hinge'
  },

  'bulgarian-split-squat': {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat (30° Torso Forward Pitch)',
    aliases: ['bulgarian split squat', 'split squat', 'rear foot elevated split squat', 'rfess'],
    category: 'Unilateral Lower Body Compound',
    targetMuscles: ['Gluteus Maximus (Lengthened State)', 'Quadriceps'],
    secondaryMuscles: ['Gluteus Medius', 'Adductor Magnus', 'Core'],
    coachAttribution: 'Bret Contreras, PhD & Lauren Simpson',
    difficulty: 'Intermediate',
    setupSteps: [
      'Stand roughly 2 to 3 feet in front of a bench or chair.',
      'Place the top of your rear foot flat on the bench behind you.',
      'Step the front foot forward so that your front knee stays roughly above your ankle when descending.'
    ],
    executionSteps: [
      'Pitch your torso forward roughly 30° at the hips (this aligns line of gravity with the working glute).',
      'Lower your back knee toward the floor under a controlled 3-second tempo.',
      'Descend until your front hip reaches a deep stretch position at or below parallel.',
      'Drive powerfully through the front midfoot and heel to return to the top.'
    ],
    commonMistakes: [
      'Staying completely upright with torso (forces 90% load onto rear quad flexor instead of front glute).',
      'Taking a stride that is too short, pushing front knee past toes with heel lifting off ground.',
      'Losing pelvic alignment and wobbling side-to-side.'
    ],
    proFormCues: [
      '💡 "Pitch your ribcage forward over your front thigh and sink straight down into your front heel."',
      '💡 "All weight is on the front leg; the back leg is merely an elevator guide wire."'
    ],
    biomechanicsScience: 'A 30° forward torso lean increases the hip moment arm by 40%, channeling maximum mechanical tension directly into the gluteus maximus.',
    illustrationType: 'lunge'
  },

  'pull-up': {
    id: 'pull-up',
    name: 'Strict Dead-Hang Pull-Up',
    aliases: ['pull-up', 'pull up', 'chin-up', 'dead hang pull up', 'lat pull-up'],
    category: 'Vertical Pull Compound',
    targetMuscles: ['Latissimus Dorsi', 'Teres Major', 'Rhomboids'],
    secondaryMuscles: ['Biceps Brachii', 'Brachialis', 'Forearm Grip', 'Core'],
    coachAttribution: 'David Goggins & Jeff Cavaliere MSPT',
    difficulty: 'Intermediate',
    setupSteps: [
      'Grip an overhead pull-up bar with hands slightly wider than shoulder-width, palms facing away (pronated).',
      'Hang in a full dead-hang with arms completely straight and shoulders elevated comfortably.',
      'Cross your feet, squeeze glutes, and engage your core into a hollow-body position.'
    ],
    executionSteps: [
      'Initiate by depressing and retracting your shoulder blades (scapular pull).',
      'Drive your elbows straight down toward your hip pockets, pulling your upper chest to touch the bar.',
      'Pause for 1 second at the top with chin completely over the bar.',
      'Lower yourself under strict 2-second control all the way back into a complete dead-hang.'
    ],
    commonMistakes: [
      'Kipping, swinging legs, or using momentum.',
      'Performing half reps (failing to return to full dead-hang at bottom or not clearing chin at top).',
      'Shrugging shoulders upward at the top.'
    ],
    proFormCues: [
      '💡 "Lead with your sternum and drive your elbows into your back pockets."',
      '💡 "Do not pull yourself up to the bar; imagine pulling the bar down to your chest."'
    ],
    biomechanicsScience: 'Full dead-hang initiation recruits lower lat fibers at maximal passive stretch before motor unit firing.',
    illustrationType: 'pull'
  },

  'deficit-push-up': {
    id: 'deficit-push-up',
    name: 'Deficit Tempo Push-Up (3s Negative + Stretch Pause)',
    aliases: ['push-up', 'pushup', 'deficit push-up', 'deficit push up', 'clap push up'],
    category: 'Horizontal Bodyweight Push Compound',
    targetMuscles: ['Pectoralis Major (Deep Stretch Overload)'],
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoids', 'Transverse Abdominis'],
    coachAttribution: 'Dr. Mike Israetel & Athlean-X',
    difficulty: 'Beginner',
    setupSteps: [
      'Place hands on two elevated surfaces (blocks, books, or push-up handles) 2–4 inches off the floor.',
      'Assume a rigid plank position with hands slightly wider than shoulder-width.',
      'Tuck pelvis into posterior tilt, squeeze glutes, and lock quads.'
    ],
    executionSteps: [
      'Lower your body with a strict 3-second negative.',
      'Descend until your chest sinks 1–2 inches below hand level for a full pectoral stretch.',
      'Hold the deep stretch for 1 second without touching the floor.',
      'Explode upward forcefully to full lockout, spreading your shoulder blades at the top.'
    ],
    commonMistakes: [
      'Sagging the hips or letting lower back arch (core disengagement).',
      'Flaring elbows out to 90° (leads to shoulder impingement). Keep elbows at 45° angle.',
      'Rushing through the bottom stretch.'
    ],
    proFormCues: [
      '💡 "Your body is a solid steel crowbar; only your elbows and shoulders bend."',
      '💡 "Push the floor away through the palms of your hands at the top."'
    ],
    biomechanicsScience: 'Deficit depth increases the active range of motion by 30%, triggering stretch-mediated hypertrophy without weights.',
    illustrationType: 'press'
  },

  'lateral-raise': {
    id: 'lateral-raise',
    name: 'Lean-Away Cable / Dumbbell Lateral Raise',
    aliases: ['lateral raise', 'cable lateral raise', 'side delt raise', 'dumbbell lateral raise'],
    category: 'Shoulder Isolation & Aesthetic Silhouette',
    targetMuscles: ['Lateral Deltoids (Shoulder Cap)'],
    secondaryMuscles: ['Anterior/Posterior Deltoids', 'Supraspinatus', 'Trapezius'],
    coachAttribution: 'Jeff Nippard & Lauren Simpson',
    difficulty: 'Beginner',
    setupSteps: [
      'Hold dumbbell or cable handle at your side with handle set at wrist/hip height.',
      'Lean your torso slightly away (15°–20°) from the anchor point or bench.',
      'Keep a micro-bend in the elbows.'
    ],
    executionSteps: [
      'Raise the weight outward in the scapular plane (roughly 20°–30° in front of your body line).',
      'Lead with your elbows and keep pinkies slightly higher than thumbs at peak.',
      'Raise until arm is parallel to floor (shoulder height), pause for 1 second.',
      'Lower smoothly under a 2-second negative.'
    ],
    commonMistakes: [
      'Shrugging traps upward to heave the weight up (use lighter weight).',
      'Raising weights purely to the side in the coronal plane, which pinches the rotator cuff.',
      'Swinging torso for momentum.'
    ],
    proFormCues: [
      '💡 "Pour out a pitcher of water at the top of the raise."',
      '💡 "Think about pushing the walls away to your sides rather than lifting the weight up."'
    ],
    biomechanicsScience: 'Raising in the scapular plane prevents subacromial friction while isolating lateral deltoid pennation angles.',
    illustrationType: 'raise'
  },

  'farmers-walk': {
    id: 'farmers-walk',
    name: 'Heavy Farmer\'s Walk / Loaded Carry (Attia Longevity Standard)',
    aliases: ['farmer\'s walk', 'farmers walk', 'loaded carry', 'trap bar carry'],
    category: 'Full-Body Structural Armor & Grip Resilience',
    targetMuscles: ['Forearm Flexors / Crushing Grip', 'Trapezius', 'Transverse Abdominal Wall'],
    secondaryMuscles: ['Gluteus Medius', 'Quadriceps', 'Cardiovascular System'],
    coachAttribution: 'Dr. Peter Attia & Dan John',
    difficulty: 'Intermediate',
    setupSteps: [
      'Stand between two heavy dumbbells, kettlebells, or a loaded trap bar.',
      'Hinge hips back, grip handles with a vice-like crushing hold, and stand tall.',
      'Pin shoulder blades down and back, engage lats, and pull ribs down.'
    ],
    executionSteps: [
      'Take short, deliberate, heel-to-toe marching strides in a straight line.',
      'Maintain tall posture with zero side-to-side torso sway.',
      'Breathe deeply through your nose while maintaining intra-abdominal core tension.',
      'Carry for the prescribed distance (typically 50 meters), set weights down under control with a hip hinge.'
    ],
    commonMistakes: [
      'Slumping shoulders forward or allowing weights to bang against thighs.',
      'Taking long, hurried strides and wobbling laterally.',
      'Rounding the lower back when picking up or putting down the weights.'
    ],
    proFormCues: [
      '💡 "Walk like a military general with a crown on your head."',
      '💡 "Crush the handles like you\'re trying to leave your fingerprints in the steel."'
    ],
    biomechanicsScience: 'Grip strength and loaded carries are Dr. Peter Attia\'s #1 correlated biomarker for all-cause longevity and physical durability.',
    illustrationType: 'carry'
  },

  'norwegian-4x4': {
    id: 'norwegian-4x4',
    name: 'Norwegian 4x4 VO2 Max Protocol',
    aliases: ['norwegian 4x4', 'vo2 max protocol', 'zone 5 intervals', 'interval sprint'],
    category: 'High-Threshold Aerobic & Myocardial Output',
    targetMuscles: ['Myocardial Left Ventricle (Stroke Volume)', 'Mitochondrial Density'],
    secondaryMuscles: ['Cardiorespiratory System', 'Lactate Clearance Enzymes'],
    coachAttribution: 'Norwegian University of Science & Technology & Dr. Peter Attia',
    difficulty: 'Elite',
    setupSteps: [
      'Select your modality: Treadmill at 5–8% incline, Airdyne bike, rowing ergometer, or outdoor hill.',
      'Perform a 5-minute easy aerobic warmup to elevate heart rate into Zone 2.'
    ],
    executionSteps: [
      'INTERVAL 1: Push at 90–95% HRmax (high threshold where speaking is impossible) for 4 full minutes.',
      'RECOVERY 1: Drop to active recovery pace (60–70% HRmax) for 3 minutes.',
      'Repeat for a total of 4 working intervals and 3 active recovery periods (28 minutes total).',
      'Cool down with 3 minutes of nasal walking.'
    ],
    commonMistakes: [
      'Going at an all-out 100% sprint in the first minute and burning out before minute 4 (pace at 90–95%).',
      'Sitting down or stopping completely during the 3-minute active recovery.',
      'Failing to reach 90% HRmax.'
    ],
    proFormCues: [
      '💡 "Find a rhythm where you are working as hard as you can sustain for exactly 4 minutes."',
      '💡 "Use active nasal recovery during the 3-minute valley."'
    ],
    biomechanicsScience: 'The 4x4 protocol is proven in clinical exercise trials to produce the largest measurable increases in VO2 max and left ventricular stroke volume.',
    illustrationType: 'cardio'
  },

  'cat-cow-mobility': {
    id: 'cat-cow-mobility',
    name: 'Cat-Cow + World\'s Greatest Stretch & Thoracic Opener',
    aliases: ['cat-cow', 'cat cow', 'world\'s greatest stretch', 'thoracic opener', 'warmup'],
    category: 'Dynamic Spinal & Joint Capsule Mobility',
    targetMuscles: ['Intervertebral Discs', 'Thoracic Spine', 'Hip Capsule', 'Rotator Cuff'],
    secondaryMuscles: ['Psoas', 'Hamstrings', 'Serratus Anterior'],
    coachAttribution: 'Jeff Cavaliere MSPT, CSCS & Dr. Andrew Huberman',
    difficulty: 'Beginner',
    setupSteps: [
      'Start on hands and knees with wrists directly under shoulders and knees directly under hips.',
      'Maintain a neutral spine and take a deep diaphragmatic breath in through your nose.'
    ],
    executionSteps: [
      'COW: Inhale, drop belly toward floor, arch spine smoothly, and look gently upward.',
      'CAT: Exhale fully, round your spine toward the ceiling, tuck tailbone, and drop head between shoulders.',
      'Transition into World\'s Greatest Stretch: Step right foot forward into a deep lunge, rotate right arm up toward ceiling.',
      'Perform 8–10 fluid cycles per side without forcing any restricted range.'
    ],
    commonMistakes: [
      'Moving too fast without connecting breath to spinal flexion and extension.',
      'Cranking the neck aggressively in cow position.',
      'Holding breath.'
    ],
    proFormCues: [
      '💡 "Move through your spine vertebra by vertebra like a wave on water."',
      '💡 "Fill your entire abdomen with oxygen on the expansion."'
    ],
    biomechanicsScience: 'Hydrates avascular spinal discs through imbibition and primes synovial joint fluid for heavy compound loading.',
    illustrationType: 'mobility'
  }
};

/**
 * Helper to match any exercise name string to its richest guide in the database
 */
export function findExerciseGuide(exerciseName: string): ExerciseGuide {
  const normalized = exerciseName.toLowerCase();

  // 1. Direct key match
  for (const [key, guide] of Object.entries(EXERCISE_GUIDE_DB)) {
    if (normalized.includes(key)) {
      return guide;
    }
  }

  // 2. Alias match
  for (const guide of Object.values(EXERCISE_GUIDE_DB)) {
    if (guide.aliases.some(alias => normalized.includes(alias.toLowerCase()))) {
      return guide;
    }
  }

  // 3. Keyword fallbacks
  if (normalized.includes('squat')) return EXERCISE_GUIDE_DB['pistol-squat'];
  if (normalized.includes('thrust') || normalized.includes('glute')) return EXERCISE_GUIDE_DB['barbell-hip-thrust'];
  if (normalized.includes('bench') || normalized.includes('press')) return EXERCISE_GUIDE_DB['incline-bench-press'];
  if (normalized.includes('deadlift') || normalized.includes('rdl') || normalized.includes('hinge')) return EXERCISE_GUIDE_DB['romanian-deadlift'];
  if (normalized.includes('split') || normalized.includes('lunge')) return EXERCISE_GUIDE_DB['bulgarian-split-squat'];
  if (normalized.includes('pull') || normalized.includes('chin') || normalized.includes('row')) return EXERCISE_GUIDE_DB['pull-up'];
  if (normalized.includes('push')) return EXERCISE_GUIDE_DB['deficit-push-up'];
  if (normalized.includes('raise') || normalized.includes('delt')) return EXERCISE_GUIDE_DB['lateral-raise'];
  if (normalized.includes('carry') || normalized.includes('walk') || normalized.includes('farmer')) return EXERCISE_GUIDE_DB['farmers-walk'];
  if (normalized.includes('vo2') || normalized.includes('cardio') || normalized.includes('sprint') || normalized.includes('zone')) return EXERCISE_GUIDE_DB['norwegian-4x4'];

  // Default fallback
  return EXERCISE_GUIDE_DB['cat-cow-mobility'];
}
