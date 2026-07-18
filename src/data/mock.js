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
export const activeSession = {
  planName: 'Leg Day',
  exerciseIndex: 1,
  exerciseTotal: 4,
  current: {
    name: 'Sumo Squads',
    setIndex: 2,
    setTotal: 3,
    best: '60 kg x 10 reps',
    blocks: [
      { kind: 'set', index: 1, last: '60 kg x 10 reps', kg: 60, reps: 10, done: true },
      { kind: 'rest', label: '03:00 Minuten', done: false },
      { kind: 'set', index: 2, last: '60 kg x 10 reps', kg: 0, reps: 0, done: false },
      { kind: 'rest', label: '03:00 Minuten', done: false },
      { kind: 'set', index: 3, last: '60 kg x 10 reps', kg: 0, reps: 0, done: false },
    ],
  },
  upNext: [
    { name: 'Lunges', progress: '0/3', best: '60 kg x 10 reps' },
    { name: 'Romanian DL', progress: '0/3', best: '60 kg x 10 reps' },
  ],
}
