import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Check, Plus, Timer, ChevronDown, X, Clock } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { activeSession } from '../data/mock'
import haptics from '../lib/haptics'
import './Workout.css'

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

function CheckToggle({ done, onToggle }) {
  return (
    <button
      className={'check-toggle' + (done ? ' is-done check-toggle--positive' : '')}
      aria-pressed={done}
      aria-label={done ? 'Mark set incomplete' : 'Mark set complete'}
      onClick={onToggle}
    >
      <Check size={16} strokeWidth={3} />
    </button>
  )
}

function SetRow({ setNo, block, active, done, onToggle }) {
  const [kg, setKg] = useState(block.kg ? String(block.kg) : '')
  const [reps, setReps] = useState(block.reps ? String(block.reps) : '')

  return (
    <div className={'set-row' + (active ? ' set-row--active' : '')}>
      <div className="set-row__meta">
        <div className="set-row__index">
          <span className="set-row__k">Set</span>
          <span className="set-row__v">{setNo}</span>
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

      <CheckToggle done={done} onToggle={onToggle} />
    </div>
  )
}

function RestRow({ seconds, active, remaining, onSkip }) {
  return (
    <div className={'rest-row' + (active ? ' rest-row--active' : '')}>
      <div className="rest-row__info">
        <span className="rest-row__k">
          <Timer size={12} strokeWidth={2.5} /> Rest
        </span>
        <span className="rest-row__v">
          {active ? fmt(remaining) : fmt(seconds)}
          {active && <span className="rest-row__running"> · resting…</span>}
        </span>
      </div>
      {active ? (
        <button className="rest-row__skip" aria-label="Skip rest" onClick={onSkip}>
          <X size={16} strokeWidth={2.5} />
        </button>
      ) : (
        <span className="rest-row__idle">
          <Timer size={15} strokeWidth={2} />
        </span>
      )}
    </div>
  )
}

export default function Workout() {
  const navigate = useNavigate()
  const session = activeSession
  const exercises = session.exercises

  const [openIndex, setOpenIndex] = useState(0)
  const [checked, setChecked] = useState(() =>
    exercises.map((ex) => ex.sets.map(() => false))
  )
  // Currently running rest: { ex, set, remaining } | null
  const [rest, setRest] = useState(null)
  const restTimer = useRef(null)

  // Elapsed workout time, counting up from when the session opens.
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => () => clearInterval(restTimer.current), [])

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const startRest = (exIndex, setIndex, seconds) => {
    clearInterval(restTimer.current)
    setRest({ ex: exIndex, set: setIndex, remaining: seconds })
    restTimer.current = setInterval(() => {
      setRest((prev) => {
        if (!prev) {
          clearInterval(restTimer.current)
          return null
        }
        if (prev.remaining <= 1) {
          clearInterval(restTimer.current)
          haptics.success()
          return null
        }
        return { ...prev, remaining: prev.remaining - 1 }
      })
    }, 1000)
  }

  const skipRest = () => {
    clearInterval(restTimer.current)
    haptics.light()
    setRest(null)
  }

  const toggleSet = (exIndex, setIndex) => {
    const wasChecked = checked[exIndex][setIndex]
    setChecked((prev) =>
      prev.map((arr, e) =>
        e === exIndex
          ? arr.map((v, s) => (s === setIndex ? !v : v))
          : arr
      )
    )
    if (!wasChecked) {
      // Just checked a set off → automatically run the following rest.
      haptics.success()
      const ex = exercises[exIndex]
      if (setIndex < ex.sets.length - 1) {
        startRest(exIndex, setIndex, ex.rest)
      }
    } else {
      haptics.light()
      // Un-checking the set cancels its running rest.
      if (rest && rest.ex === exIndex && rest.set === setIndex) skipRest()
    }
  }

  const openExercise = (index) => {
    haptics.selection()
    setOpenIndex((cur) => (cur === index ? -1 : index))
  }

  const doneCount = (exIndex) => checked[exIndex].filter(Boolean).length
  const isComplete = (exIndex) => doneCount(exIndex) === exercises[exIndex].sets.length
  const completedExercises = exercises.filter((_, i) => isComplete(i)).length

  return (
    <div className="workout">
      {/* Progress header */}
      <header className="workout__top">
        <div className="workout__progress">
          {exercises.map((ex, i) => (
            <span
              key={ex.id}
              className={'seg' + (isComplete(i) ? ' seg--full' : '')}
            />
          ))}
        </div>
        <div className="workout__topmeta">
          <span className="workout__count text-dulled">
            {completedExercises}/{exercises.length}
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
        <div className="workout__head">
          <p className="workout__plan text-secondary">{session.planName}</p>
          <div className="workout__timer" aria-label="Elapsed workout time">
            <Clock size={14} strokeWidth={2.25} />
            <span>{fmt(elapsed)}</span>
          </div>
        </div>

        <div className="stack">
          {exercises.map((ex, exIndex) => {
            const open = openIndex === exIndex
            const done = doneCount(exIndex)
            const complete = isComplete(exIndex)
            const activeSetIndex = checked[exIndex].findIndex((v) => !v)

            return (
              <Card
                key={ex.id}
                className={'ex-item' + (complete ? ' ex-item--complete' : '')}
              >
                <button
                  className="ex-item__head"
                  onClick={() => openExercise(exIndex)}
                  aria-expanded={open}
                >
                  <div className="ex-item__title">
                    <p className="ex-item__name">{ex.name}</p>
                    <p className="ex-item__meta">
                      <span className="text-accent">
                        Set {done}/{ex.sets.length}
                      </span>
                      <span className="ex-item__best text-secondary">
                        Best: {ex.best}
                      </span>
                    </p>
                  </div>
                  <ChevronDown
                    className={'ex-item__chev' + (open ? ' is-open' : '')}
                    size={20}
                    strokeWidth={2.25}
                  />
                </button>

                {open && (
                  <div className="ex-item__body">
                    {ex.sets.map((block, setIndex) => (
                      <div key={setIndex}>
                        <SetRow
                          setNo={setIndex + 1}
                          block={block}
                          active={setIndex === activeSetIndex}
                          done={checked[exIndex][setIndex]}
                          onToggle={() => toggleSet(exIndex, setIndex)}
                        />
                        {setIndex < ex.sets.length - 1 && (
                          <RestRow
                            seconds={ex.rest}
                            active={
                              rest &&
                              rest.ex === exIndex &&
                              rest.set === setIndex
                            }
                            remaining={rest ? rest.remaining : 0}
                            onSkip={skipRest}
                          />
                        )}
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="md"
                      full
                      icon={Plus}
                      className="ex-item__addset"
                    >
                      Set
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
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
