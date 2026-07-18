import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Check,
  Plus,
  Timer,
  ChevronDown,
  X,
  Clock,
  AlertCircle,
  Trash2,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { activeSession } from '../data/mock'
import { uid } from '../store/store'
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
      // Keep the focused input from blurring first, so a tap here doesn't race
      // the automatic check-on-blur.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onToggle}
    >
      <Check size={16} strokeWidth={3} />
    </button>
  )
}

// Swipe a row right-to-left to reveal and trigger deletion.
function SwipeRow({ onDelete, children }) {
  return (
    <div className="swipe">
      <div className="swipe__action" aria-hidden="true">
        <Trash2 size={18} strokeWidth={2} />
      </div>
      <motion.div
        className="swipe__content"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.7, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -90) onDelete()
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

function SetRow({ setNo, block, active, done, onChange, onToggle }) {
  const [error, setError] = useState(false)

  const kg = block.kg
  const reps = block.reps
  const kgEmpty = kg.trim() === ''
  const repsEmpty = reps.trim() === ''

  const clearError = () => error && setError(false)

  const handleToggle = () => {
    // A set may only be checked off once its fields are filled in.
    if (!done && (kgEmpty || repsEmpty)) {
      setError(true)
      haptics.error()
      return
    }
    setError(false)
    onToggle()
  }

  // Once both fields are filled and the user leaves the field, check the set
  // off automatically.
  const autoCheck = () => {
    if (!done && !kgEmpty && !repsEmpty) {
      setError(false)
      onToggle()
    }
  }

  return (
    <>
      <div
        className={
          'set-row' +
          (active ? ' set-row--active' : '') +
          (error ? ' set-row--error' : '')
        }
      >
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
            className={'mini-input' + (error && kgEmpty ? ' mini-input--error' : '')}
            inputMode="numeric"
            value={kg}
            onChange={(e) => {
              onChange({ kg: e.target.value })
              clearError()
            }}
            onBlur={autoCheck}
            aria-label="Weight in kilograms"
          />
          <span className="set-row__unit">kg</span>
          <span className="set-row__x">×</span>
          <input
            className={'mini-input' + (error && repsEmpty ? ' mini-input--error' : '')}
            inputMode="numeric"
            value={reps}
            onChange={(e) => {
              onChange({ reps: e.target.value })
              clearError()
            }}
            onBlur={autoCheck}
            aria-label="Repetitions"
          />
          <span className="set-row__unit">reps</span>
        </div>

        <CheckToggle done={done} onToggle={handleToggle} />
      </div>

      {error && (
        <p className="set-error" role="alert">
          <AlertCircle size={13} strokeWidth={2.5} />
          Enter weight and reps to complete this set.
        </p>
      )}
    </>
  )
}

function RestRow({ seconds, active, remaining, onAdjust, onSkip }) {
  return (
    <div className={'rest-row' + (active ? ' rest-row--active' : '')}>
      <div className="rest-row__info">
        <span className="rest-row__k">
          <Timer size={12} strokeWidth={2.5} /> Rest
        </span>
        <span className="rest-row__v">{active ? fmt(remaining) : fmt(seconds)}</span>
      </div>
      {active ? (
        <div className="rest-row__actions">
          <button className="rest-adj" onClick={() => onAdjust(-30)}>
            −30s
          </button>
          <button className="rest-adj" onClick={() => onAdjust(30)}>
            +30s
          </button>
          <button className="rest-row__skip" aria-label="Skip rest" onClick={onSkip}>
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <span className="rest-row__idle">
          <Timer size={15} strokeWidth={2} />
        </span>
      )}
    </div>
  )
}

// Build the mutable session model from the (static) plan data.
const initExercises = () =>
  activeSession.exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    best: ex.best,
    rest: ex.rest,
    sets: ex.sets.map((s) => ({
      id: uid(),
      last: s.last,
      kg: s.kg ? String(s.kg) : '',
      reps: s.reps ? String(s.reps) : '',
      done: false,
    })),
  }))

export default function Workout() {
  const navigate = useNavigate()
  const session = activeSession

  const [exercises, setExercises] = useState(initExercises)
  const [openIndex, setOpenIndex] = useState(0)
  // Running rest: { setId, remaining } | null
  const [rest, setRest] = useState(null)
  const restTimer = useRef(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => () => clearInterval(restTimer.current), [])
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const startRest = (setId, seconds) => {
    clearInterval(restTimer.current)
    setRest({ setId, remaining: seconds })
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

  const adjustRest = (delta) => {
    haptics.light()
    setRest((prev) =>
      prev ? { ...prev, remaining: Math.max(1, prev.remaining + delta) } : prev
    )
  }

  const updateSet = (exIndex, setIndex, patch) =>
    setExercises((prev) =>
      prev.map((ex, e) =>
        e === exIndex
          ? { ...ex, sets: ex.sets.map((s, i) => (i === setIndex ? { ...s, ...patch } : s)) }
          : ex
      )
    )

  const toggleSet = (exIndex, setIndex) => {
    const ex = exercises[exIndex]
    const setObj = ex.sets[setIndex]
    const wasDone = setObj.done
    updateSet(exIndex, setIndex, { done: !wasDone })

    if (!wasDone) {
      haptics.success()
      const nowComplete = ex.sets.every((s, i) => (i === setIndex ? true : s.done))
      if (nowComplete) {
        // Exercise finished → collapse it and open the next one below.
        clearInterval(restTimer.current)
        setRest(null)
        setTimeout(() => {
          setOpenIndex(exIndex + 1 < exercises.length ? exIndex + 1 : -1)
        }, 550)
      } else {
        // Otherwise automatically run this set's rest.
        startRest(setObj.id, ex.rest)
      }
    } else {
      haptics.light()
      if (rest && rest.setId === setObj.id) skipRest()
    }
  }

  const addSet = (exIndex) => {
    haptics.medium()
    setExercises((prev) =>
      prev.map((ex, e) =>
        e === exIndex
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                { id: uid(), last: '—', kg: '', reps: '', done: false },
              ],
            }
          : ex
      )
    )
  }

  const removeSet = (exIndex, setIndex) => {
    const ex = exercises[exIndex]
    if (ex.sets.length <= 1) {
      haptics.warning()
      return
    }
    const setObj = ex.sets[setIndex]
    if (rest && rest.setId === setObj.id) skipRest()
    haptics.warning()
    setExercises((prev) =>
      prev.map((x, e) =>
        e === exIndex ? { ...x, sets: x.sets.filter((_, i) => i !== setIndex) } : x
      )
    )
  }

  const openExercise = (index) => {
    haptics.selection()
    setOpenIndex((cur) => (cur === index ? -1 : index))
  }

  const doneCount = (ex) => ex.sets.filter((s) => s.done).length
  const isComplete = (ex) => ex.sets.length > 0 && ex.sets.every((s) => s.done)
  const completedExercises = exercises.filter(isComplete).length

  return (
    <div className="workout">
      {/* Progress header */}
      <header className="workout__top">
        <div className="workout__progress">
          {exercises.map((ex) => (
            <span
              key={ex.id}
              className={'seg' + (isComplete(ex) ? ' seg--full' : '')}
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
            const done = doneCount(ex)
            const complete = isComplete(ex)
            const activeSetIndex = ex.sets.findIndex((s) => !s.done)

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
                    <AnimatePresence initial={false}>
                      {ex.sets.map((block, setIndex) => (
                        <motion.div
                          key={block.id}
                          className="set-unit"
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -60 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SwipeRow onDelete={() => removeSet(exIndex, setIndex)}>
                            <SetRow
                              setNo={setIndex + 1}
                              block={block}
                              active={setIndex === activeSetIndex}
                              done={block.done}
                              onChange={(patch) => updateSet(exIndex, setIndex, patch)}
                              onToggle={() => toggleSet(exIndex, setIndex)}
                            />
                          </SwipeRow>
                          <RestRow
                            seconds={ex.rest}
                            active={rest && rest.setId === block.id}
                            remaining={rest ? rest.remaining : 0}
                            onAdjust={adjustRest}
                            onSkip={skipRest}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <Button
                      variant="outline"
                      size="md"
                      full
                      icon={Plus}
                      className="ex-item__addset"
                      onClick={() => addSet(exIndex)}
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
