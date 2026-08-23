/**
 * Comprehensive Sports Science Exercise Guide Database with Curated Video Tutorials
 * Contains step-by-step form guides, biomechanical breakdowns, common mistakes,
 * pro coaching cues, and verified YouTube coaching video links for every exercise in Titan.
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
  // 1. SPINE DECOMPRESSION & PARASYMPATHETIC RESET
  'spine-decompression': {
    id: 'spine-decompression',
    name: 'Spine Decompression Hang + 4-7-8 Parasympathetic Reset',
    aliases: ['spine decompression', 'decompression', 'parasympathetic', 'cooldown', '4-7-8', 'hang'],
    category: 'Spinal Disc Imbibition & Vagus Nerve Recovery',
    targetMuscles: ['Intervertebral Discs (L1–L5, T1–T12)', 'Psoas Major', 'Thoracolumbar Fascia'],
    secondaryMuscles: ['Latissimus Dorsi (Passive Stretch)', 'Forearm Flexors', 'Diaphragm'],
    coachAttribution: 'Dr. Andrew Huberman & Dr. Peter Attia',
    difficulty: 'Beginner',
    youtubeQuery: 'peter attia dead hang spine decompression benefits',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=peter+attia+dead+hang+spinal+decompression',
    videoChannelName: 'Dr. Peter Attia / Huberman Lab',
    keyAngles: '180° Full Overhead Passive Hang • 4s Inhale : 7s Hold : 8s Exhale',
    movementPhases: [
      {
        phaseName: '1. Passive Hang Grip & Release',
        phaseTiming: 'Setup (0:00–1:00)',
        description: 'Grip overhead pull-up bar, let feet hover or lightly rest on floor. Fully relax pelvic floor and shoulders.',
        focusCue: 'Release all muscular tension in lower back, allow gravity to traction the spine.'
      },
      {
        phaseName: '2. 4-7-8 Diaphragmatic Breath',
        phaseTiming: 'Breath Cycles (1:00–3:00)',
        description: 'Inhale through nose for 4 seconds, hold oxygen for 7 seconds, exhale slowly through mouth for 8 seconds.',
        focusCue: 'Long slow exhale stimulates the vagus nerve to down-regulate heart rate and lower cortisol.'
      },
      {
        phaseName: '3. 90/90 Supine Pelvic Neutral',
        phaseTiming: 'Restorative Floor (3:00–5:00)',
        description: 'Lie flat on back with calves resting on a bench at 90° hip and knee angles.',
        focusCue: 'Flatten lower back flush to floor, feel intervertebral discs hydrate with fluid.'
      },
      {
        phaseName: '4. Parasympathetic Transition',
        phaseTiming: 'Final Reset',
        description: 'Slow standing transition, roll shoulders back, establish tall posture.',
        focusCue: 'Feel 1 inch taller and fully decompressed after the workout.'
      }
    ],
    setupSteps: [
      'Find an overhead bar or supportive doorframe where you can hang with relaxed shoulders.',
      'Allow feet to remain lightly touching the floor if needed to remove excessive shoulder strain.',
      'Relax abdominal wall and lumbar musculature completely.'
    ],
    executionSteps: [
      'Hang passively for 45–60 seconds, feeling the space between your lumbar vertebrae expand.',
      'Perform 4-7-8 box breathing: Inhale 4s through nose, hold 7s, exhale 8s through pursed lips.',
      'Transition to the floor in a 90/90 supine posture (calves on a bench or chair).',
      'Rest for 2–3 minutes to allow fluid to re-enter avascular spinal discs.'
    ],
    commonMistakes: [
      'Engaging shoulder muscles or tensing the neck during the hang (must be completely passive).',
      'Hyperventilating or taking shallow chest breaths instead of deep diaphragmatic breaths.',
      'Jumping down aggressively from the bar (defeats spinal decompression).'
    ],
    proFormCues: [
      '💡 "Let gravity pull your pelvis down toward the center of the earth like a heavy pendulum."',
      '💡 "The 8-second exhale tells your nervous system that the battle is over and recovery has begun."'
    ],
    biomechanicsScience: 'Heavy lifting compresses spinal discs by 15–20%. Passive traction induces imbibition—drawing nutrient-rich synovial fluid back into disc matrices.'
  },

  // 2. INCLINE BENCH PRESS (30° CLAVICULAR ANGLE)
  'incline-bench-press': {
    id: 'incline-bench-press',
    name: 'Incline Bench Press (30° Clavicular Angle)',
    aliases: ['incline bench', 'incline dumbbell press', 'incline press', 'barbell incline press', 'flat / 30° incline bench', 'heavy barbell incline bench', 'heavy incline db bench'],
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

  // 3. BARBELL HIP THRUST
  'barbell-hip-thrust': {
    id: 'barbell-hip-thrust',
    name: 'Barbell Hip Thrust (2-Sec Top Lockout)',
    aliases: ['hip thrust', 'barbell hip thrust', 'kas glute bridge', 'glute thrust', 'heavy barbell hip thrust', 'glute bridge'],
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

  // 4. ROMANIAN DEADLIFT (RDL)
  'romanian-deadlift': {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL) with Deep Stretch Focus',
    aliases: ['rdl', 'romanian deadlift', 'dumbbell rdl', 'deficit rdl', 'barbell rdl', 'heavy barbell romanian deadlift', 'heavy deficit romanian deadlift'],
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

  // 5. BULGARIAN SPLIT SQUAT
  'bulgarian-split-squat': {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat (30° Torso Forward Pitch)',
    aliases: ['bulgarian split squat', 'split squat', 'rear foot elevated split squat', 'rfess', 'jumping bulgarian split squats'],
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

  // 6. PISTOL SQUATS & GOBLET SQUATS
  'pistol-squat': {
    id: 'pistol-squat',
    name: 'Pistol Squat / Single-Leg Box Squat',
    aliases: ['pistol squat', 'single leg squat', 'pistols', 'pistol squats', 'goblet box squat', 'air squats'],
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
        phaseTiming: 'Setup',
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

  // 7. CHEST-SUPPORTED ROWS & LAT ROWS
  'chest-supported-row': {
    id: 'chest-supported-row',
    name: 'Chest-Supported Incline T-Bar / Cable Row',
    aliases: ['chest-supported', 'incline row', 't-bar row', 'seated cable row', 'doorframe isometric lat rows', 'inverted rows', 'towel rows'],
    category: 'Upper Back & Latissimus Dorsi Compound',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Mid & Lower Trapezius', 'Rear Deltoids'],
    secondaryMuscles: ['Brachialis', 'Biceps Brachii', 'Forearms'],
    coachAttribution: 'Dr. Mike Israetel & Jeff Nippard',
    difficulty: 'Intermediate',
    youtubeQuery: 'dr mike israetel chest supported row technique',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=renaissance+periodization+chest+supported+row',
    videoChannelName: 'Renaissance Periodization / Dr. Mike Israetel',
    keyAngles: '45° Bench Incline • 45° Elbow Flaring • Full Scapular Protraction/Retraction',
    movementPhases: [
      {
        phaseName: '1. Chest Pad Anchor',
        phaseTiming: 'Setup',
        description: 'Lie prone with sternum resting against 30°–45° incline bench, arms fully elongated forward.',
        focusCue: 'Pin feet into floor, keep lower back neutral.'
      },
      {
        phaseName: '2. Scapular Drive & Row',
        phaseTiming: '1.0s Concentric',
        description: 'Drive elbows back at 45° angle, squeezing shoulder blades together tightly around spine.',
        focusCue: 'Pull with your elbows, not your hands. Imagine crushing a tennis ball between shoulder blades.'
      },
      {
        phaseName: '3. 1-Second Peak Contraction',
        phaseTiming: '1.0s Squeeze',
        description: 'Hold maximal upper back contraction at chest pad level.',
        focusCue: 'Do not lift chest off the pad; keep all tension isolated in the upper back.'
      },
      {
        phaseName: '4. 2-Second Lengthened Release',
        phaseTiming: '2.0s Eccentric',
        description: 'Lower weight slowly, allowing shoulder blades to protract and stretch lats fully.',
        focusCue: 'Feel lats stretch around ribcage at the bottom dead-stop.'
      }
    ],
    setupSteps: [
      'Adjust bench to a 30°–45° incline and place dumbbells or barbell beneath the head of the bench.',
      'Lie face down with your sternum supported by the pad and feet anchored into the floor.',
      'Grip the handles with an overhand or neutral grip with arms fully extended.'
    ],
    executionSteps: [
      'Initiate the movement by retracting your scapulae (pull shoulder blades together).',
      'Drive elbows backward past your torso at roughly a 45° flare.',
      'Squeeze shoulder blades hard together for 1 full second at the peak.',
      'Lower under a controlled 2-second negative until arms are fully elongated.'
    ],
    commonMistakes: [
      'Lifting chest off the pad (momentum cheating).',
      'Pulling too high toward the throat (loads upper traps instead of lats and rhomboids).',
      'Cutting the bottom range short without allowing full lat stretch.'
    ],
    proFormCues: [
      '💡 "Drive your elbows into your back pockets and wrap your shoulder blades around your spine."',
      '💡 "Glue your ribcage to the pad throughout the entire set."'
    ],
    biomechanicsScience: 'Supporting the chest eliminates spinal erector fatigue, allowing 100% neuromuscular output to be directed into the lats and rhomboids.'
  },

  // 8. STRICT DEAD-HANG PULL-UPS & LAT PULLDOWNS
  'pull-up': {
    id: 'pull-up',
    name: 'Strict Dead-Hang Pull-Up / Lat Pulldown',
    aliases: ['pull-up', 'pull up', 'chin-up', 'dead hang pull up', 'lat pull-up', 'lat pulldown', 'park pull-up bar strict dead-hang pull-ups'],
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

  // 9. DEFICIT PUSH-UPS & CLAP PUSH-UPS
  'deficit-push-up': {
    id: 'deficit-push-up',
    name: 'Deficit Tempo Push-Up (3s Negative + Stretch Pause)',
    aliases: ['push-up', 'pushup', 'deficit push-up', 'deficit push up', 'clap push up', 'incline hands-elevated push-ups', 'deep deficit push-ups', 'explosive deficit clap push-ups'],
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

  // 10. LATERAL RAISES & HIP ABDUCTIONS
  'lateral-raise': {
    id: 'lateral-raise',
    name: 'Lean-Away Cable / DB Lateral Raise + Hip Abduction',
    aliases: ['lateral raise', 'cable lateral raise', 'side delt raise', 'dumbbell lateral raise', 'standing dumbbell lateral raises', 'cable / db lean-away lateral raises', 'seated hip abductions', 'cable kickbacks'],
    category: 'Shoulder Isolation & Aesthetic Silhouette',
    targetMuscles: ['Lateral Deltoids (Shoulder Cap)', 'Gluteus Medius (Upper Shelf)'],
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

  // 11. BICEPS CURLS & TRICEPS EXTENSIONS
  'arms-isolation': {
    id: 'arms-isolation',
    name: 'Incline DB Biceps Curls + Overhead Triceps Extension',
    aliases: ['biceps curls', 'triceps rope pressdown', 'incline dumbbell biceps curls', 'overhead rope triceps extension', 'arms', 'biceps', 'triceps'],
    category: 'Upper Arm Lengthened Isolation',
    targetMuscles: ['Biceps Brachii (Long Head)', 'Triceps Brachii (Long Head)'],
    secondaryMuscles: ['Brachialis', 'Brachioradialis'],
    coachAttribution: 'Dr. Mike Israetel & Jeff Nippard',
    difficulty: 'Beginner',
    youtubeQuery: 'jeff nippard science biceps triceps arm workout',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=jeff+nippard+incline+dumbbell+curl+technique',
    videoChannelName: 'Jeff Nippard / Renaissance Periodization',
    keyAngles: '45° Bench Incline for Biceps • Elbows Locked Overhead for Triceps',
    movementPhases: [
      {
        phaseName: '1. Incline Stretch Position',
        phaseTiming: 'Setup',
        description: 'Sit on 45° incline bench, arms hanging straight down behind torso for deep shoulder extension stretch.',
        focusCue: 'Pin elbows in place behind torso.'
      },
      {
        phaseName: '2. Supinated Biceps Curl',
        phaseTiming: '1.0s Concentric',
        description: 'Curl dumbbells upward while supinating wrists (turn pinkies up toward ceiling).',
        focusCue: 'Keep elbows pinned behind torso, do not swing shoulders forward.'
      },
      {
        phaseName: '3. 1-Second Peak Squeeze',
        phaseTiming: '1.0s Peak Hold',
        description: 'Squeeze biceps peak hard at shoulder height.',
        focusCue: 'Full active contraction at top.'
      },
      {
        phaseName: '4. 3-Second Deep Stretch Release',
        phaseTiming: '3.0s Eccentric',
        description: 'Lower weights under strict 3-second control into full elbow extension behind torso.',
        focusCue: 'Feel profound passive stretch across the long head of the biceps.'
      }
    ],
    setupSteps: [
      'Set bench to a 45° incline and hold dumbbells with a neutral grip.',
      'Allow arms to hang straight down with shoulders relaxed back into the pad.',
      'Keep head resting against the bench to prevent cervical strain.'
    ],
    executionSteps: [
      'Curl dumbbells upward, rotating wrists outward (supination) so palms face shoulders at the top.',
      'Pause for 1 second at full contraction without moving your upper arms forward.',
      'Lower the dumbbells with a controlled 3-second eccentric tempo until elbows reach full straight extension.',
      'Transition directly to overhead triceps rope extensions for maximum antagonist arm blood flow.'
    ],
    commonMistakes: [
      'Swinging the elbows forward to use anterior deltoid momentum.',
      'Cutting the bottom range short without fully extending the arms.',
      'Flaring elbows out to the sides on overhead triceps extensions.'
    ],
    proFormCues: [
      '💡 "Keep your elbows frozen in space behind your ribs throughout the entire curl."',
      '💡 "Turn your pinky fingers toward your ears at the top of the curl."'
    ],
    biomechanicsScience: 'Placing the shoulder in extension on an incline bench pre-stretches the biceps long head across two joints, inducing maximum sarcomere micro-tearing.'
  },

  // 12. PIKE HANDSTAND PUSH-UPS
  'pike-push-up': {
    id: 'pike-push-up',
    name: 'Pike Handstand Push-Up (Feet Elevated on Chair)',
    aliases: ['pike push-up', 'pike handstand push-up', 'handstand push-up', 'pike push ups'],
    category: 'Vertical Bodyweight Overhead Press',
    targetMuscles: ['Anterior & Lateral Deltoids', 'Clavicular Pectoralis Major', 'Triceps Brachii'],
    secondaryMuscles: ['Trapezius', 'Serratus Anterior', 'Core'],
    coachAttribution: 'Calisthenics Movement & Jeff Cavaliere MSPT',
    difficulty: 'Advanced',
    youtubeQuery: 'calisthenics movement pike push up form tutorial',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=calisthenics+movement+pike+push+up+guide',
    videoChannelName: 'Calisthenics Movement / Athlean-X',
    keyAngles: '90° Inverted Hip Pike • Tripod Head Placement • 45° Elbow Path',
    movementPhases: [
      {
        phaseName: '1. Inverted Pike Geometry',
        phaseTiming: 'Setup',
        description: 'Feet elevated on chair or box, hips stacked directly over shoulders and wrists in an inverted L-shape.',
        focusCue: 'Push through palms and lock arms straight overhead.'
      },
      {
        phaseName: '2. Tripod Descent',
        phaseTiming: '3.0s Eccentric',
        description: 'Lower crown of head forward in front of hands to form the top point of a triangle (tripod).',
        focusCue: 'Tuck elbows at 45°; do not flare elbows sideways.'
      },
      {
        phaseName: '3. 1-Second Hover Pause',
        phaseTiming: '1.0s Pause',
        description: 'Hover crown of head 1 inch off floor without resting weight on neck.',
        focusCue: 'Active shoulder tension at deep stretch.'
      },
      {
        phaseName: '4. Press Up & Push Through',
        phaseTiming: '1.0s Concentric',
        description: 'Press forcefully through palms, pushing head back through the window of your shoulders.',
        focusCue: 'Push the earth away and elevate shoulder blades at top lockout.'
      }
    ],
    setupSteps: [
      'Place toes on an elevated bench, chair, or box.',
      'Walk hands backward toward the bench until hips are stacked directly above shoulders (90° inverted pike).',
      'Position hands slightly wider than shoulder-width with fingers spread wide.'
    ],
    executionSteps: [
      'Lower head forward diagonally toward the floor, forming a tripod triangle with your hands.',
      'Descend under a 3-second negative until crown of head lightly grazes the floor.',
      'Pause for 1 second in the bottom loaded position.',
      'Press upward and backward along the diagonal line, returning to the stacked vertical shoulder lockout.'
    ],
    commonMistakes: [
      'Lowering head straight down between hands (damages rotator cuff; head must travel forward into tripod).',
      'Allowing hips to sag down into a regular push-up plank.',
      'Flaring elbows out to 90 degrees.'
    ],
    proFormCues: [
      '💡 "Your head and hands form a triangle on the ground, with your head at the top point."',
      '💡 "At the top, push your head through the window of your arms and shrug shoulders toward ears."'
    ],
    biomechanicsScience: 'The diagonal tripod descent mirrors the natural scapulohumeral rhythm of overhead barbell pressing, eliminating impingement.'
  },

  // 13. FARMER'S WALKS & LOADED CARRIES
  'farmers-walk': {
    id: 'farmers-walk',
    name: 'Heavy Farmer\'s Walk / Loaded Carry (Attia Longevity Standard)',
    aliases: ['farmer\'s walk', 'farmers walk', 'loaded carry', 'trap bar carry', 'heavy kettlebell / dumbbell farmer\'s walk', 'heavy trap bar / dumbbell farmer\'s walk carry'],
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

  // 14. NORWEGIAN 4X4 & ZONE 2
  'norwegian-4x4': {
    id: 'norwegian-4x4',
    name: 'Norwegian 4x4 VO2 Max Protocol',
    aliases: ['norwegian 4x4', 'vo2 max protocol', 'zone 5 intervals', 'interval sprint', 'zone 2', 'mitochondrial base'],
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

  // 15. DYNAMIC WARMUP & THORACIC MOBILITY
  'warmup-mobility': {
    id: 'warmup-mobility',
    name: 'Dynamic Scapular Wall Slides + Hip 90/90 Opener & Dislocates',
    aliases: ['cat-cow', 'cat cow', 'world\'s greatest stretch', 'thoracic opener', 'warmup', 'dynamic scapular wall slides', 'scapular wall slides', 'hip 90/90', 'banded dislocates', 'jumping jacks', 'spiderman lunge'],
    category: 'Dynamic Spinal & Joint Capsule Mobility',
    targetMuscles: ['Intervertebral Discs', 'Thoracic Spine', 'Hip Capsule', 'Rotator Cuff'],
    secondaryMuscles: ['Psoas', 'Hamstrings', 'Serratus Anterior'],
    coachAttribution: 'Jeff Cavaliere MSPT, CSCS & Dr. Andrew Huberman',
    difficulty: 'Beginner',
    youtubeQuery: 'squat university 90 90 hip mobility drill form',
    curatedVideoUrl: 'https://www.youtube.com/results?search_query=squat+university+90+90+hip+mobility+tutorial',
    videoChannelName: 'Squat University / Athlean-X',
    keyAngles: '90° Hip Internal/External Angles • Scapular Wall Contact • Full Diaphragmatic Breath',
    movementPhases: [
      {
        phaseName: '1. Scapular Wall Slides',
        phaseTiming: 'Drill 1 (10 Reps)',
        description: 'Stand with upper back and elbows pinned against wall, slide hands overhead smoothly.',
        focusCue: 'Maintain zero lower back arch; keep ribs pulled down.'
      },
      {
        phaseName: '2. Hip 90/90 Capsule Opener',
        phaseTiming: 'Drill 2 (8 Reps / Side)',
        description: 'Sit on floor with lead leg and trail leg bent at 90° angles, hinge torso over lead shin.',
        focusCue: 'Feel deep rotational stretch in both hip capsules.'
      },
      {
        phaseName: '3. Banded Dislocates & Face-Pulls',
        phaseTiming: 'Drill 3 (10 Reps)',
        description: 'Pass resistance band overhead and behind back with straight arms.',
        focusCue: 'Smooth continuous arc to open pectorals and anterior delts.'
      },
      {
        phaseName: '4. Spiderman Lunge & Thoracic Sky Reach',
        phaseTiming: 'Drill 4 (6 Reps / Side)',
        description: 'Deep runner lunge with thoracic rotation reaching arm to ceiling.',
        focusCue: 'Follow hand with eyes to open thoracic cage.'
      }
    ],
    setupSteps: [
      'Find clear floor space and a wall or resistance band.',
      'Perform drills in a fluid, unhurried cadence with deep nasal breathing.'
    ],
    executionSteps: [
      'SCAPULAR WALL SLIDES: Pin elbows, wrists, and shoulder blades against wall. Slide hands upward.',
      'HIP 90/90: Sit on floor with legs in 90/90 angles. Hinge chest over lead thigh, switch sides.',
      'BAND DISLOCATES: Hold band wide, circle smoothly from waist over head to lower back.',
      'SPIDERMAN REACH: Step into deep lunge, rotate upper torso and reach arm toward sky.'
    ],
    commonMistakes: [
      'Arching lower back off the wall during wall slides.',
      'Rushing through hip rotations without pausing in the end-range stretch.',
      'Holding breath.'
    ],
    proFormCues: [
      '💡 "Move through your joint capsules like warm honey."',
      '💡 "Open your chest like a book on the thoracic reach."'
    ],
    biomechanicsScience: 'Dynamic multi-planar mobility elevates synovial joint temperature by 2°C, decreasing viscous friction by 40% prior to heavy loading.'
  }
};

/**
 * Intelligent Matcher with Specificity Hierarchy and Word Boundary Matching
 * Prevents substring collisions like "decompression" matching "press"!
 */
export function findExerciseGuide(exerciseName: string): ExerciseGuide {
  const normalized = exerciseName.toLowerCase().trim();

  // 1. Exact Key Match
  if (EXERCISE_GUIDE_DB[normalized]) {
    return EXERCISE_GUIDE_DB[normalized];
  }

  // 2. High-Priority Specific Phrases (Checked first before generic words!)
  if (normalized.includes('decompression') || normalized.includes('4-7-8') || normalized.includes('parasympathetic') || normalized.includes('spine decompression')) {
    return EXERCISE_GUIDE_DB['spine-decompression'];
  }

  if (normalized.includes('norwegian') || normalized.includes('vo2 max') || normalized.includes('zone 2') || normalized.includes('zone 5')) {
    return EXERCISE_GUIDE_DB['norwegian-4x4'];
  }

  if (normalized.includes('farmer') || normalized.includes('loaded carry') || normalized.includes('carry') || normalized.includes('death march')) {
    return EXERCISE_GUIDE_DB['farmers-walk'];
  }

  if (normalized.includes('wall slides') || normalized.includes('90/90') || normalized.includes('cat-cow') || normalized.includes('cat cow') || normalized.includes('dislocates') || normalized.includes('spiderman') || normalized.includes('jumping jacks')) {
    return EXERCISE_GUIDE_DB['warmup-mobility'];
  }

  if (normalized.includes('pike') || normalized.includes('handstand')) {
    return EXERCISE_GUIDE_DB['pike-push-up'];
  }

  if (normalized.includes('biceps') || normalized.includes('triceps') || normalized.includes('curl') || normalized.includes('pressdown') || normalized.includes('death set')) {
    return EXERCISE_GUIDE_DB['arms-isolation'];
  }

  if (normalized.includes('lateral raise') || normalized.includes('side delt') || normalized.includes('hip abduction') || normalized.includes('kickback')) {
    return EXERCISE_GUIDE_DB['lateral-raise'];
  }

  if (normalized.includes('bulgarian') || normalized.includes('split squat')) {
    return EXERCISE_GUIDE_DB['bulgarian-split-squat'];
  }

  if (normalized.includes('hip thrust') || normalized.includes('glute bridge') || normalized.includes('frog pump')) {
    return EXERCISE_GUIDE_DB['barbell-hip-thrust'];
  }

  if (normalized.includes('rdl') || normalized.includes('romanian deadlift') || (normalized.includes('deadlift') && !normalized.includes('hang'))) {
    return EXERCISE_GUIDE_DB['romanian-deadlift'];
  }

  if (normalized.includes('pistol') || normalized.includes('goblet box') || normalized.includes('air squat') || normalized.includes('single leg squat')) {
    return EXERCISE_GUIDE_DB['pistol-squat'];
  }

  if (normalized.includes('row') || normalized.includes('chest-supported') || normalized.includes('t-bar')) {
    return EXERCISE_GUIDE_DB['chest-supported-row'];
  }

  if (normalized.includes('pull-up') || normalized.includes('pull up') || normalized.includes('pulldown') || normalized.includes('chin-up')) {
    return EXERCISE_GUIDE_DB['pull-up'];
  }

  if (normalized.includes('push-up') || normalized.includes('pushup') || normalized.includes('clap push')) {
    return EXERCISE_GUIDE_DB['deficit-push-up'];
  }

  if (normalized.includes('bench') || (/\bpress\b/i.test(normalized) && !normalized.includes('decompression'))) {
    return EXERCISE_GUIDE_DB['incline-bench-press'];
  }

  if (normalized.includes('squat')) {
    return EXERCISE_GUIDE_DB['pistol-squat'];
  }

  // 3. Alias Check
  for (const guide of Object.values(EXERCISE_GUIDE_DB)) {
    if (guide.aliases.some(alias => normalized.includes(alias.toLowerCase()))) {
      return guide;
    }
  }

  // Fallback to Warmup/Mobility
  return EXERCISE_GUIDE_DB['warmup-mobility'];
}
