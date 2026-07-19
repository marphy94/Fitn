import { MonthCalendar } from 'fitn'

const frame = {
  padding: 24,
  background: 'var(--color-bg)',
  width: 380,
  fontFamily: 'var(--font-body)',
}

export const Month = () => (
  <div style={frame}>
    <MonthCalendar year={2026} month={6} workoutDays={[2, 3, 14, 15, 16]} />
  </div>
)

export const NoWorkouts = () => (
  <div style={frame}>
    <MonthCalendar year={2026} month={0} workoutDays={[]} />
  </div>
)
