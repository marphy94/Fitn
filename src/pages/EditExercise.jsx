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

export default function EditExercise() {
  const navigate = useNavigate()
  const { exerciseId } = useParams()
  const isNew = exerciseId === 'new'
  const editing = useExercise(exerciseId)
  const { dispatch } = useStore()

  const [name, setName] = useState(editing?.name ?? '')
  const [selected, setSelected] = useState(new Set(editing?.groups ?? []))

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
