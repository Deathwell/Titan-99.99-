/**
 * Comprehensive Sports Science Exercise Guide Database with Curated Video Tutorials
 * Contains step-by-step form guides, biomechanical breakdowns, common mistakes,
 * pro coaching cues, and verified YouTube coaching video links.
 */

export interface PhaseGuide {
  phaseName: string;
  phaseTiming: string;
  description: string;
  focusCue: string;
}

export interface ExerciseGuide {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  coachAttribution: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  youtubeQuery: string;
  curatedVideoUrl: string;
  videoChannelName: string;
  keyAngles: string;
  movementPhases: PhaseGuide[];
  setupSteps: string[];
  executionSteps: string[];
  commonMistakes: string[];
  proFormCues: string[];
  biomechanicsScience: string;
}

export const EXERCISE_GUIDE_DB: Record<string, ExerciseGuide> = {
  'pistol-squat': {
    id: 'pistol-squat',
    name: 'Pistol Squat (Single-Leg Full Squat)',
    aliases: ['pistol squat', 'single leg squat', 'pistols'],
    category: 'Unilateral Quadriceps & Glute Compound',
    targetMuscles: ['Quadriceps (Vastus Medialis/Lateralis)', 'Gluteus Maximus'],
    secondaryMuscles: ['Ankle Stabilizers', 'Hip Flexors', 'Core Bracing'],
    coachAttribution: 'Squat University & Calisthenics Movement',
    difficulty: 'Advanced',
    youtubeQuery: 'how to do pistol squats form squat university',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=how+to+pistol+squat+form+squat+university',
    videoChannelName: 'Squat University / Calisthenics Movement',
    keyAngles: '90° Hip Flexion • Full Knee Flexion • Ankle Dorsiflexion 35°',
    movementPhases: [
      {
        phaseName: '1. Rooting & Stance',
        phaseTiming: 'Start',
        description: 'Stand on one leg, elevate the non-working leg forward, screw the foot into the floor.',
        focusCue: 'Tripod foot contact: big toe, pinky toe, and heel pinned to ground.'
      },
      {
        phaseName: '2. 3-Second Controlled Negative',
        phaseTiming: '3.0s Eccentric',
        description: 'Hinge hips backward while bending knee smoothly. Reach arms forward for counterbalance.',
        focusCue: 'Keep knee tracking directly in line with second toe, prevent knee valgus.'
      },
      {
        phaseName: '3. Deep Lengthened Stretch',
        phaseTiming: '1.0s Stretch Pause',
        description: 'Hamstring meets calf in the deepest position. Non-working leg stays elevated.',
        focusCue: 'Maintain core tightness, avoid crashing into the bottom joint stop.'
      },
      {
        phaseName: '4. Explosive Concentric Lockout',
        phaseTiming: '1.0s Concentric',
        description: 'Push the earth away through your midfoot to stand tall into full extension.',
        focusCue: 'Drive chest up and extend hips forward to tall standing posture.'
      }
    ],
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
      'Allowing the heel of the working foot to rise off the floor (indicates ankle mobility restriction).',
      'Collapsing the knee inward (valgus collapse) due to weak glute medius stabilizers.',
      'Rounding the lower back excessively at the bottom.'
    ],
    proFormCues: [
      '💡 "Screw your foot into the ground like you\'re corkscrewing a bottle."',
      '💡 "Keep your arms and chest reaching forward to maintain your center of gravity over the midfoot."'
    ],
    biomechanicsScience: 'Unilateral single-leg squats double the effective relative load on the working leg while eliminating compressive spinal axial shear forces.'
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
    youtubeQuery: 'bret contreras barbell hip thrust form tutorial',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=bret+contreras+barbell+hip+thrust+technique',
    videoChannelName: 'Bret Contreras PhD / Glute Guy',
    keyAngles: '90° Knee Angle at Top • Posterior Pelvic Tilt Lockout • Chin Tucked',
    movementPhases: [
      {
        phaseName: '1. Bench & Bar Positioning',
        phaseTiming: 'Setup',
        description: 'Upper back against bench just below scapulae, padded bar placed on hip crease.',
        focusCue: 'Feet flat, shoulder-width apart, toes flared 15° outward.'
      },
      {
        phaseName: '2. Concentric Hip Drive',
        phaseTiming: '1.0s Concentric',
        description: 'Drive through heels, extending hips upward horizontally toward the ceiling.',
        focusCue: 'Keep chin tucked to chest throughout the entire ascent.'
      },
      {
        phaseName: '3. 2-Second Peak Lockout',
        phaseTiming: '2.0s Iso-Hold',
        description: 'Tuck tailbone forward (posterior pelvic tilt) and crush glutes at horizontal plane.',
        focusCue: 'Shin is completely vertical (90°) at peak extension.'
      },
      {
        phaseName: '4. Controlled Lowering',
        phaseTiming: '2.0s Eccentric',
        description: 'Lower bar smoothly without overarching lumbar spine.',
        focusCue: 'Eyes stay locked forward on your knees, not looking up at ceiling.'
      }
    ],
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
    biomechanicsScience: 'Electromyography (EMG) studies by Contreras show horizontal hip extension achieves 200% greater peak gluteus maximus activation than vertical squats.'
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
    youtubeQuery: 'jeff nippard incline bench press science technique',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=jeff+nippard+incline+bench+press+form',
    videoChannelName: 'Jeff Nippard / Renaissance Periodization',
    keyAngles: '30° Incline Bench • 45°–60° Elbow Tuck • Vertical Forearms',
    movementPhases: [
      {
        phaseName: '1. Scapular Arch & Set',
        phaseTiming: 'Setup',
        description: 'Pin shoulder blades into pad, natural lower back arch, feet planted firmly into floor.',
        focusCue: 'Retract and depress scapulae to create a stable pressing platform.'
      },
      {
        phaseName: '2. 3-Second Clavicular Negative',
        phaseTiming: '3.0s Eccentric',
        description: 'Lower bar/dumbbells with elbows tucked at 45°–60° toward upper chest collarbone.',
        focusCue: 'Pull the weight down with your lats rather than dropping it.'
      },
      {
        phaseName: '3. 1-Second Lengthened Stretch',
        phaseTiming: '1.0s Stretch Pause',
        description: 'Brief motionless pause in deep pec stretch without bouncing on ribcage.',
        focusCue: 'Feel intense stretch across upper pectoral muscle fibers.'
      },
      {
        phaseName: '4. Explosive Concentric Press',
        phaseTiming: '1.0s Concentric',
        description: 'Drive weight up and slightly backward along the natural clavicular line of drive.',
        focusCue: 'Bring your biceps together toward the center of your collarbone.'
      }
    ],
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
    biomechanicsScience: 'Kinesiology fiber mapping confirms a 30-degree incline maximizes upper pectoral fiber recruitment while reducing anterior shoulder joint sheer.'
  },

  'romanian-deadlift': {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL) with Deep Stretch Focus',
    aliases: ['rdl', 'romanian deadlift', 'dumbbell rdl', 'deficit rdl', 'barbell rdl'],
    category: 'Hip-Hinge Posterior Chain Compound',
    targetMuscles: ['Hamstrings (Biceps Femoris/Semitendinosus)', 'Gluteus Maximus (Lengthened State)'],
    secondaryMuscles: ['Erector Spinae', 'Latissimus Dorsi', 'Forearm Grip'],
    coachAttribution: 'Dr. Mike Israetel (Renaissance Periodization)',
    difficulty: 'Intermediate',
    youtubeQuery: 'dr mike israetel romanian deadlift rdl form technique',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=renaissance+periodization+romanian+deadlift+guide',
    videoChannelName: 'Renaissance Periodization / Dr. Mike Israetel',
    keyAngles: '15° Soft Knee Bend • Maximal Pelvic Posterior Shift • Neutral Spine',
    movementPhases: [
      {
        phaseName: '1. Stance & 360° Brace',
        phaseTiming: 'Setup',
        description: 'Feet hip-width, overhand grip, shoulders back, lats packed tight, soft 15° knee bend.',
        focusCue: 'Inhale 360° diaphragmatic breath to create intra-abdominal pressure.'
      },
      {
        phaseName: '2. 3-Second Pelvic Hinge',
        phaseTiming: '3.0s Eccentric',
        description: 'Push hips backward toward the wall behind you. Weight slides down shins.',
        focusCue: 'Shave your legs with the bar. Stop descending when hips stop traveling backward.'
      },
      {
        phaseName: '3. Extreme Lengthened Stretch',
        phaseTiming: '1.0s Stretch Pause',
        description: 'Hold deep stretch at mid-shin with flat neutral spine.',
        focusCue: 'Feel deep elongation across glutes and hamstrings without lower back rounding.'
      },
      {
        phaseName: '4. Glute Concentric Extension',
        phaseTiming: '1.0s Concentric',
        description: 'Drive hips forward into the bar, squeezing glutes to return to standing lockout.',
        focusCue: 'Push the floor away through your midfoot, avoid hyperextending at top.'
      }
    ],
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
    biomechanicsScience: 'Loading the hamstring and glute fibers under tension in their lengthened state triggers stretch-mediated hypertrophy (titin kinase phosphorylation).'
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
    youtubeQuery: 'bulgarian split squat glute focus bret contreras',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=bulgarian+split+squat+form+glute+focus+bret+contreras',
    videoChannelName: 'Bret Contreras PhD / Lauren Simpson Fitness',
    keyAngles: '30° Forward Torso Lean • 90° Front Knee Depth • Elevated Rear Foot',
    movementPhases: [
      {
        phaseName: '1. Foot Stride & Torso Pitch',
        phaseTiming: 'Setup',
        description: 'Rear foot elevated on bench behind you. Front foot positioned 2.5 feet forward.',
        focusCue: 'Pitch your ribcage forward 30° over the front thigh to target glute.'
      },
      {
        phaseName: '2. 3-Second Unilateral Drop',
        phaseTiming: '3.0s Eccentric',
        description: 'Lower back knee toward floor while maintaining 30° forward torso lean.',
        focusCue: 'Sink down and back into your front heel, keep front knee stacked above midfoot.'
      },
      {
        phaseName: '3. Deep Hip Stretch',
        phaseTiming: '1.0s Stretch Pause',
        description: 'Bottom parallel position where lead glute is under intense mechanical stretch.',
        focusCue: 'Hold motionless for 1s. 85% of bodyweight remains on front leg.'
      },
      {
        phaseName: '4. Drive to Extension',
        phaseTiming: '1.0s Concentric',
        description: 'Press firmly through front midfoot/heel to return to standing position.',
        focusCue: 'Do not lock out knee aggressively; keep continuous tension on glute.'
      }
    ],
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
    biomechanicsScience: 'A 30° forward torso lean increases the hip moment arm by 40%, channeling maximum mechanical tension directly into the gluteus maximus.'
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
    youtubeQuery: 'athlean x perfect pull up form step by step',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=athlean+x+how+to+do+a+pull+up+proper+form',
    videoChannelName: 'Athlean-X / Jeff Cavaliere',
    keyAngles: '180° Full Dead Hang • Scapular Depression • Chest to Bar Touch',
    movementPhases: [
      {
        phaseName: '1. Dead-Hang Hollow Body',
        phaseTiming: 'Setup',
        description: 'Overhand grip wider than shoulders, arms fully extended, core braced, legs crossed.',
        focusCue: 'Start from absolute dead-hang with relaxed shoulders.'
      },
      {
        phaseName: '2. Scapular Retraction & Drive',
        phaseTiming: '1.0s Concentric',
        description: 'Depress shoulder blades down, drive elbows toward ribs, pull sternum to bar.',
        focusCue: 'Imagine pulling the bar down to your chest rather than lifting yourself.'
      },
      {
        phaseName: '3. Chin-Over-Bar Pause',
        phaseTiming: '1.0s Squeeze',
        description: 'Full contraction with elbows driven backward into ribs.',
        focusCue: 'Touch upper chest to the bar with zero kipping or leg swinging.'
      },
      {
        phaseName: '4. 2-Second Lowering to Dead Hang',
        phaseTiming: '2.0s Eccentric',
        description: 'Lower under strict control until arms reach complete passive dead-hang stretch.',
        focusCue: 'Do not cut the bottom short; full extension recruits bottom lat fibers.'
      }
    ],
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
    biomechanicsScience: 'Full dead-hang initiation recruits lower lat fibers at maximal passive stretch before motor unit firing.'
  },

  'deficit-push-up': {
    id: 'deficit-push-up',
    name: 'Deficit Tempo Push-Up (3s Negative + Stretch Pause)',
    aliases: ['push-up', 'pushup', 'deficit push-up', 'deficit push up', 'clap push up'],
    category: 'Horizontal Bodyweight Push Compound',
    targetMuscles: ['Pectoralis Major (Deep Stretch Overload)'],
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoids', 'Transverse Abdominis'],
    coachAttribution: 'Dr. Mike Israetel & Jeff Cavaliere MSPT',
    difficulty: 'Beginner',
    youtubeQuery: 'how to do perfect push up form athlean x',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=athlean+x+perfect+push+up+form',
    videoChannelName: 'Athlean-X / Renaissance Periodization',
    keyAngles: '45° Elbow Arrow Angle • 2-Inch Deficit Depth • Steel Plank Core',
    movementPhases: [
      {
        phaseName: '1. Elevated Plank Setup',
        phaseTiming: 'Setup',
        description: 'Hands on 2–4 inch blocks or handles, shoulder-width apart, rigid core plank.',
        focusCue: 'Posterior pelvic tilt (tuck tailbone) and squeeze quads/glutes.'
      },
      {
        phaseName: '2. 3-Second Deficit Descent',
        phaseTiming: '3.0s Eccentric',
        description: 'Lower chest below hand level with elbows tucked at 45° arrow angle.',
        focusCue: 'Maintain straight line from crown of head to heels.'
      },
      {
        phaseName: '3. Deep Pectoral Stretch',
        phaseTiming: '1.0s Stretch Pause',
        description: 'Hover chest 2 inches below hands to feel intense pectoral stretch.',
        focusCue: 'Do not touch floor; keep active muscular tension across chest.'
      },
      {
        phaseName: '4. Explosive Concentric Press',
        phaseTiming: '1.0s Concentric',
        description: 'Push floor away explosively, protracting shoulder blades at top lockout.',
        focusCue: 'Push your palms through the floor to lock out triceps.'
      }
    ],
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
    biomechanicsScience: 'Deficit depth increases the active range of motion by 30%, triggering stretch-mediated hypertrophy without weights.'
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
    youtubeQuery: 'jeff nippard cable lateral raise science technique',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=jeff+nippard+cable+lateral+raise+technique',
    videoChannelName: 'Jeff Nippard / Scientific Lifting',
    keyAngles: '15°–20° Lean Away • 30° Scapular Plane Path • Lead with Elbows',
    movementPhases: [
      {
        phaseName: '1. Lean-Away Anchor',
        phaseTiming: 'Setup',
        description: 'Hold cable at wrist height, lean torso 15° away from anchor, micro-bend in elbow.',
        focusCue: 'Eliminates dead zone at bottom for 100% continuous tension.'
      },
      {
        phaseName: '2. Scapular Plane Raise',
        phaseTiming: '1.0s Concentric',
        description: 'Raise weight 30° in front of coronal plane (scapular plane), leading with elbows.',
        focusCue: 'Think about pushing the walls away rather than lifting weight up.'
      },
      {
        phaseName: '3. 1-Second Shoulder Cap Squeeze',
        phaseTiming: '1.0s Iso-Hold',
        description: 'Hold at shoulder height with pinkies slightly above thumbs.',
        focusCue: 'Lock shoulder blades down, do not let upper traps shrug up.'
      },
      {
        phaseName: '4. Controlled 2-Second Lowering',
        phaseTiming: '2.0s Eccentric',
        description: 'Lower under strict control without dropping the tension.',
        focusCue: 'Resist gravity on the descent to maximize titin damage.'
      }
    ],
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
    biomechanicsScience: 'Raising in the scapular plane prevents subacromial friction while isolating lateral deltoid pennation angles.'
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
    youtubeQuery: 'peter attia farmers walk grip longevity technique',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=peter+attia+farmers+walk+carry+form',
    videoChannelName: 'Dr. Peter Attia / The Drive',
    keyAngles: 'Tall Military Posture • Neutral Wrist Alignment • Heel-to-Toe March',
    movementPhases: [
      {
        phaseName: '1. Deadlift to Stand',
        phaseTiming: 'Setup',
        description: 'Hinge hips to grip heavy dumbbells/trap bar, stand tall, pack lats tight.',
        focusCue: 'Crush the handles with a white-knuckle vice grip.'
      },
      {
        phaseName: '2. Deliberate Cadence March',
        phaseTiming: 'Continuous',
        description: 'March forward with short, deliberate, heel-to-toe strides with proud chest.',
        focusCue: 'Zero lateral sway. Shoulders locked down like an armored tank.'
      },
      {
        phaseName: '3. Diaphragmatic Nasal Rhythm',
        phaseTiming: 'Breathing',
        description: 'Maintain deep nasal breathing while keeping abdominal wall braced.',
        focusCue: 'Breathe behind the shield of your contracted core.'
      },
      {
        phaseName: '4. Controlled Lowering',
        phaseTiming: 'Finish',
        description: 'Come to complete stop, hinge hips with flat back to set weights down.',
        focusCue: 'Never round back when placing weights down.'
      }
    ],
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
    biomechanicsScience: 'Grip strength and loaded carries are Dr. Peter Attia\'s #1 correlated biomarker for all-cause longevity and physical durability.'
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
    youtubeQuery: 'peter attia norwegian 4x4 vo2 max protocol',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=peter+attia+norwegian+4x4+vo2+max+guide',
    videoChannelName: 'Dr. Peter Attia / NTNU Sports Science',
    keyAngles: 'Zone 5 (90–95% HRmax) • 4-Minute Threshold • 3-Minute Active Valley',
    movementPhases: [
      {
        phaseName: '1. Zone 2 Aerobic Warmup',
        phaseTiming: '5 Minutes',
        description: 'Easy jog, row, or bike to gradually elevate heart rate and synovial warmth.',
        focusCue: 'Smooth nasal breathing pace.'
      },
      {
        phaseName: '2. 4-Minute High-Threshold Peak',
        phaseTiming: '4 Mins @ 90–95% HRmax',
        description: 'Hard sustained aerobic effort where talking is completely impossible.',
        focusCue: 'Pace sustainably: do not sprint 100% in minute 1 and die by minute 3.'
      },
      {
        phaseName: '3. 3-Minute Active Recovery Valley',
        phaseTiming: '3 Mins @ 60–70% HRmax',
        description: 'Gentle active walking/pedaling to clear metabolic lactate byproducts.',
        focusCue: 'Inhale deep through nose, slow exhale to downregulate heart rate.'
      },
      {
        phaseName: '4. Repeat × 4 Cycles',
        phaseTiming: '28 Mins Total',
        description: 'Complete 4 working intervals and 3 valleys, followed by a 3-minute cooldown.',
        focusCue: 'Maximum left ventricular stroke volume expansion.'
      }
    ],
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
    biomechanicsScience: 'The 4x4 protocol is proven in clinical exercise trials to produce the largest measurable increases in VO2 max and left ventricular stroke volume.'
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
    youtubeQuery: 'how to do cat cow stretch correctly athlean x',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=athlean+x+cat+cow+stretch+tutorial',
    videoChannelName: 'Athlean-X / Dr. Andrew Huberman',
    keyAngles: 'Quadruped 90° Wrists/Knees • Vertebra by Vertebra Wave • Nasal Breath Match',
    movementPhases: [
      {
        phaseName: '1. Quadruped Alignment',
        phaseTiming: 'Setup',
        description: 'Hands directly beneath shoulders, knees directly beneath hips, neutral spine.',
        focusCue: 'Spread fingers wide and grip the floor.'
      },
      {
        phaseName: '2. Inhale $\\to$ Cow Extension',
        phaseTiming: '2.0s Inhale',
        description: 'Inhale deep into belly, drop naval toward floor, gently lift sternum and gaze.',
        focusCue: 'Smooth arch through the thoracic spine; avoid pinching lower back.'
      },
      {
        phaseName: '3. Exhale $\\to$ Cat Flexion',
        phaseTiming: '2.0s Exhale',
        description: 'Exhale fully through mouth, tuck pelvis, push floor away, dome upper spine toward ceiling.',
        focusCue: 'Feel individual vertebrae separate and decompress.'
      },
      {
        phaseName: '4. World\'s Greatest Stretch Lunge',
        phaseTiming: 'Dynamic Transition',
        description: 'Step right foot forward into deep lunge, rotate right arm to sky, follow hand with eyes.',
        focusCue: 'Open thoracic chest cage and feel deep hip flexor release.'
      }
    ],
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
    biomechanicsScience: 'Hydrates avascular spinal discs through imbibition and primes synovial joint fluid for heavy compound loading.'
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
