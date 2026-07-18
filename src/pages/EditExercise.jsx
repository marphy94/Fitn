import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import Screen from '../components/Screen'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import { MUSCLE_GROUPS } from '../data/mock'
import { useStore, useExercise, uid } from '../store/store'
import haptics from '../lib/haptics'
import './EditExercise.css'

/* --- mm:ss helpers for the rest-time field --- */
const toMMSS = (sec) => {
  const s = Math.max(0, Math.floor(sec || 0))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
const parseMMSS = (str) => {
  const digits = String(str).replace(/\D/g, '').slice(-4).padStart(4, '0')
  const m = parseInt(digits.slice(0, 2), 10)
  const s = parseInt(digits.slice(2), 10)
  return m * 60 + Math.min(s, 59)
}
// Progressive mm:ss masking while typing (colon auto-inserted from the right).
const maskMMSS = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return digits.slice(0, digits.length - 2) + ':' + digits.slice(digits.length - 2)
}

export default function EditExercise() {
  const navigate = useNavigate()
  const { exerciseId } = useParams()
  const isNew = exerciseId === 'new'
  const editing = useExercise(exerciseId)
  const { dispatch } = useStore()

  const [name, setName] = useState(editing?.name ?? '')
  const [selected, setSelected] = useState(new Set(editing?.groups ?? []))
  const [rest, setRest] = useState(toMMSS(editing?.rest ?? 90))

  const toggle = (group) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(group) ? next.delete(group) : next.add(group)
      return next
    })
  }

  const canSave = name.trim().length > 0

  const save = () => {
    if (!canSave) {
      haptics.warning()
      return
    }
    dispatch({
      type: 'exercise/save',
      payload: {
        id: isNew ? uid() : exerciseId,
        name: name.trim(),
        groups: [...selected],
        rest: parseMMSS(rest),
      },
    })
    haptics.success()
    navigate(-1)
  }

  return (
    <>
      <header className="topbar">
        <Button
          variant="outline"
          size="pill"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="pill"
          icon={Save}
          onClick={save}
          style={canSave ? undefined : { opacity: 0.5 }}
        >
          Save
        </Button>
      </header>

      <Screen hasTabBar>
        <h1 className="large-title editor-title">
          {isNew ? 'New Exercise' : 'Edit Exercise'}
        </h1>

        <div className="field">
          <label className="field__label" htmlFor="ex-name">
            Excercise Name
          </label>
          <input
            id="ex-name"
            className="input"
            value={name}
            autoFocus={isNew}
            placeholder="e.g. Bulgarian Split Squat"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="ex-rest">
            Rest
          </label>
          <input
            id="ex-rest"
            className="input input--rest"
            value={rest}
            inputMode="numeric"
            placeholder="mm:ss"
            onChange={(e) => setRest(maskMMSS(e.target.value))}
            onBlur={() => setRest(toMMSS(parseMMSS(rest)))}
          />
          <span className="field__hint text-dulled">
            Rest between sets · format mm:ss
          </span>
        </div>

        <div className="field">
          <span className="field__label">Muscle Groups</span>
          <div className="chip-grid">
            {MUSCLE_GROUPS.map((group) => (
              <Chip
                key={group}
                selected={selected.has(group)}
                onClick={() => toggle(group)}
              >
                {group}
              </Chip>
            ))}
          </div>
        </div>
      </Screen>
    </>
  )
}
