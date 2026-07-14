import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Check, Plus, Timer } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { activeSession } from '../data/mock'
import haptics from '../lib/haptics'
import './Workout.css'

function CheckToggle({ done, onToggle, tone = 'accent' }) {
  return (
    <button
      className={
        'check-toggle' +
        (done ? ` is-done check-toggle--${tone}` : '')
      }
      aria-pressed={done}
      aria-label={done ? 'Mark set incomplete' : 'Mark set complete'}
      onClick={() => {
        done ? haptics.light() : haptics.success()
        onToggle()
      }}
    >
      <Check size={16} strokeWidth={3} />
    </button>
  )
}

function SetRow({ block, active, done, onToggle }) {
  const [kg, setKg] = useState(block.kg ? String(block.kg) : '')
  const [reps, setReps] = useState(block.reps ? String(block.reps) : '')

  return (
    <Card className={'set-row' + (active ? ' set-row--active' : '')}>
      <div className="set-row__meta">
        <div className="set-row__index">
          <span className="set-row__k">Set</span>
          <span className="set-row__v">{block.index}</span>
        </div>
        <div className="set-row__last">
          <span className="set-row__k">Last</span>
          <span className="set-row__v">{block.last}</span>
        </div>
      </div>

      <div className="set-row__inputs">
        <input
          className="mini-input"
          inputMode="numeric"
          value={kg}
          onChange={(e) => setKg(e.target.value)}
          aria-label="Weight in kilograms"
        />
        <span className="set-row__unit">kg</span>
        <span className="set-row__x">×</span>
        <input
          className="mini-input"
          inputMode="numeric"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          aria-label="Repetitions"
        />
        <span className="set-row__unit">reps</span>
      </div>

      <CheckToggle done={done} tone="positive" onToggle={onToggle} />
    </Card>
  )
}

function RestRow({ block, done, onToggle, onOpen }) {
  return (
    <Card className="rest-row">
      <button
        className="rest-row__info"
        onClick={() => {
          haptics.light()
          onOpen()
        }}
        aria-label={`Open rest timer, ${block.label}`}
      >
        <span className="rest-row__k">
          <Timer size={12} strokeWidth={2.5} /> Time
        </span>
        <span className="rest-row__v">{block.label}</span>
      </button>
      <CheckToggle done={done} onToggle={onToggle} />
    </Card>
  )
}

export default function Workout() {
  const navigate = useNavigate()
  const s = activeSession
  const c = s.current

  const [checked, setChecked] = useState(() =>
    c.blocks.map((b) => !!b.done)
  )

  const toggle = (i) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  const activeSetIndex = c.blocks.findIndex(
    (b, i) => b.kind === 'set' && !checked[i]
  )

  return (
    <div className="workout">
      {/* Progress header */}
      <header className="workout__top">
        <div className="workout__progress">
          {Array.from({ length: s.exerciseTotal }).map((_, i) => (
            <span
              key={i}
              className={
                'seg' +
                (i < s.exerciseIndex ? ' seg--full' : '') +
                (i === s.exerciseIndex ? ' seg--current' : '')
              }
            />
          ))}
        </div>
        <div className="workout__topmeta">
          <span className="workout__count text-dulled">
            {s.exerciseIndex}/{s.exerciseTotal}
          </span>
          <button
            className="icon-btn"
            aria-label="Workout settings"
            onClick={() => haptics.light()}
          >
            <Settings size={20} strokeWidth={2} />
          </button>
        </div>
      </header>

      <div className="screen screen--padded workout__scroll">
        {/* Current exercise heading */}
        <div className="workout__heading">
          <h1 className="large-title">{c.name}</h1>
          <p className="workout__set text-accent">
            Set {c.setIndex}/{c.setTotal}
          </p>
          <p className="workout__best text-secondary">Best: {c.best}</p>
        </div>

        {/* Set / rest blocks */}
        <div className="stack-2">
          {c.blocks.map((block, i) =>
            block.kind === 'set' ? (
              <SetRow
                key={i}
                block={block}
                active={i === activeSetIndex}
                done={checked[i]}
                onToggle={() => toggle(i)}
              />
            ) : (
              <RestRow
                key={i}
                block={block}
                done={checked[i]}
                onToggle={() => toggle(i)}
                onOpen={() => navigate('/rest')}
              />
            )
          )}
        </div>

        <Button
          variant="outline"
          size="lg"
          full
          icon={Plus}
          className="workout__addset"
        >
          Set
        </Button>

        {/* Up next */}
        <div className="stack">
          {s.upNext.map((ex) => (
            <Card key={ex.name} className="upnext">
              <p className="upnext__name">{ex.name}</p>
              <p className="upnext__meta text-accent">Set {ex.progress}</p>
              <p className="upnext__best text-secondary">Best: {ex.best}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* End workout */}
      <div className="workout__end">
        <Button
          variant="primary"
          size="lg"
          full
          haptic="heavy"
          onClick={() => {
            haptics.success()
            navigate('/')
          }}
        >
          End workout
        </Button>
      </div>
    </div>
  )
}
