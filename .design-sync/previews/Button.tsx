import { Button } from 'fitn'

const frame = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  gap: 12,
  padding: 24,
  background: 'var(--color-bg)',
  fontFamily: 'var(--font-body)',
}

const Play = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const Plus = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Variants = () => (
  <div style={frame}>
    <Button variant="primary">Start workout</Button>
    <Button variant="outline">Edit</Button>
    <Button variant="ghost">Cancel</Button>
    <Button variant="positive">Save</Button>
    <Button variant="danger">Delete</Button>
  </div>
)

export const Sizes = () => (
  <div style={frame}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
    <Button size="pill" icon={Play}>Start</Button>
  </div>
)

export const WithIcons = () => (
  <div style={frame}>
    <Button variant="primary" icon={Play}>Start</Button>
    <Button variant="outline" icon={Plus}>Add set</Button>
  </div>
)

export const FullWidth = () => (
  <div style={{ ...frame, width: 340 }}>
    <Button variant="primary" size="lg" full>
      End workout
    </Button>
  </div>
)
