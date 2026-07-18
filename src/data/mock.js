/**
 * Placeholder content used to dress the scaffolded screens. This will be
 * replaced by real state / persistence in a later step.
 */

export const MUSCLE_GROUPS = [
  'Legs',
  'Chest',
  'Lower Back',
  'Back',
  'Shoulders',
  'Arms',
  'Core',
  'Glutes',
  'Adductors',
  'Hamstrings',
  'Quads',
  'Stabilisation',
]

// `rest` is the rest time (in seconds) between sets of this exercise.
export const exercises = [
  { id: 'sumo-squat', name: 'Sumo Squat', groups: ['Glutes', 'Quads', 'Adductors'], rest: 90 },
  { id: 'romanian-dl', name: 'Romanian DL', groups: ['Hamstrings', 'Glutes', 'Lower Back'], rest: 120 },
  { id: 'hip-thrust', name: 'Hip Thrust', groups: ['Glutes', 'Hamstrings', 'Core'], rest: 90 },
  { id: 'goblet-squat', name: 'Goblet Squat', groups: ['Quads', 'Glutes', 'Adductors', 'Core'], rest: 60 },
  { id: 'lunges', name: 'Lunges', groups: ['Quads', 'Glutes', 'Stabilisation'], rest: 60 },
]

export const plans = [
  {
    id: 'leg-day',
    name: 'Leg Day',
    items: [
      { id: 'rest-1', type: 'rest', name: 'Rest', detail: '3 Minuten' },
      { id: 'e-sumo', type: 'exercise', name: 'Sumo Squat', groups: ['Glutes', 'Quads', 'Adductors'] },
      { id: 'e-lunges', type: 'exercise', name: 'Lunges', groups: ['Quads', 'Glutes', 'Stabilisation'] },
      { id: 'e-rdl', type: 'exercise', name: 'Romanian DL', groups: ['Hamstrings', 'Glutes', 'Lower Back'] },
      { id: 'e-hip', type: 'exercise', name: 'Hip Thrust', groups: ['Glutes', 'Hamstrings', 'Core'] },
      { id: 'e-goblet', type: 'exercise', name: 'Goblet Squat', groups: ['Quads', 'Glutes', 'Adductors', 'Core'] },
    ],
  },
  {
    id: 'upper',
    name: 'Upper',
    items: new Array(4).fill(null).map((_, i) => ({ id: `u-${i}`, type: 'exercise', name: 'Exercise' })),
  },
]

export const nextWorkout = { name: 'Upper', exercises: 4 }

export const lastWorkout = {
  name: 'Leg Day',
  date: '02.06.2025',
  entries: [
    { name: 'Sumo Squat', delta: 2.5, sets: ['60 kg x 10 reps', '60 kg x 10 reps', '60 kg x 10 reps'] },
    { name: 'Lunges', delta: 1.5, sets: ['60 kg x 10 reps', '60 kg x 10 reps', '60 kg x 10 reps'] },
    { name: 'Hip Thrust', delta: -0.5, sets: ['60 kg x 10 reps', '60 kg x 10 reps', '60 kg x 10 reps'] },
  ],
}

// Active workout session shown on the Workout screen.
// Each exercise carries its own sets and a `rest` time (seconds) that runs
// automatically after a set is checked off.
const set = (last) => ({ last, kg: 0, reps: 0 })
export const activeSession = {
  planName: 'Leg Day',
  exercises: [
    {
      id: 'sumo',
      name: 'Sumo Squat',
      best: '60 kg x 10 reps',
      rest: 90,
      sets: [
        { last: '60 kg x 10 reps', kg: 60, reps: 10 },
        set('60 kg x 10 reps'),
        set('60 kg x 10 reps'),
      ],
    },
    {
      id: 'lunges',
      name: 'Lunges',
      best: '60 kg x 10 reps',
      rest: 60,
      sets: [set('60 kg x 10 reps'), set('60 kg x 10 reps'), set('60 kg x 10 reps')],
    },
    {
      id: 'rdl',
      name: 'Romanian DL',
      best: '60 kg x 10 reps',
      rest: 120,
      sets: [set('60 kg x 10 reps'), set('60 kg x 10 reps'), set('60 kg x 10 reps')],
    },
    {
      id: 'hip',
      name: 'Hip Thrust',
      best: '60 kg x 10 reps',
      rest: 90,
      sets: [set('60 kg x 10 reps'), set('60 kg x 10 reps'), set('60 kg x 10 reps')],
    },
  ],
}
