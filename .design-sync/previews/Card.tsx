import { Card } from 'fitn'

const frame = {
  padding: 24,
  background: 'var(--color-bg)',
  width: 360,
  fontFamily: 'var(--font-body)',
}
const title = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 18,
  color: 'var(--text-primary)',
  margin: 0,
}
const sub = { fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }

export const Basic = () => (
  <div style={frame}>
    <Card style={{ padding: 16 }}>
      <p style={title}>Leg Day</p>
      <p style={sub}>5 exercises</p>
    </Card>
  </div>
)

export const Glass = () => (
  <div style={frame}>
    <Card glass style={{ padding: 16 }}>
      <p style={title}>Next Workout</p>
      <p style={sub}>Upper · 4 exercises</p>
    </Card>
  </div>
)

export const Interactive = () => (
  <div style={frame}>
    <Card interactive style={{ padding: 16 }}>
      <p style={title}>Sumo Squat</p>
      <p style={sub}>Glutes · Quads · Adductors</p>
    </Card>
  </div>
)
