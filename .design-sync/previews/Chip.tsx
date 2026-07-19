import { Chip } from 'fitn'

const frame = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8,
  padding: 24,
  background: 'var(--color-bg)',
  maxWidth: 360,
  fontFamily: 'var(--font-body)',
}

export const MuscleGroups = () => (
  <div style={frame}>
    <Chip>Legs</Chip>
    <Chip>Chest</Chip>
    <Chip>Lower Back</Chip>
    <Chip selected>Glutes</Chip>
    <Chip>Core</Chip>
    <Chip selected>Quads</Chip>
    <Chip>Adductors</Chip>
  </div>
)

export const States = () => (
  <div style={frame}>
    <Chip>Unselected</Chip>
    <Chip selected>Selected</Chip>
  </div>
)
