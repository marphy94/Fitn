import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import Screen from '../components/Screen'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import { exercises, MUSCLE_GROUPS } from '../data/mock'
import haptics from '../lib/haptics'
import './EditExercise.css'

export default function EditExercise() {
  const navigate = useNavigate()
  const { exerciseId } = useParams()
  const editing = exercises.find((e) => e.id === exerciseId)

  const [name, setName] = useState(editing ? 'Sumo Squats' : '')
  const [selected, setSelected] = useState(
    new Set(editing?.groups ?? [])
  )

  const toggle = (group) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(group) ? next.delete(group) : next.add(group)
      return next
    })
  }

  const save = () => {
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
        <Button variant="primary" size="pill" icon={Save} onClick={save}>
          Save
        </Button>
      </header>

      <Screen hasTabBar>
        <h1 className="large-title editor-title">
          {editing ? 'Edit Exercise' : 'New Exercise'}
        </h1>

        <div className="field">
          <label className="field__label" htmlFor="ex-name">
            Excercise Name
          </label>
          <input
            id="ex-name"
            className="input"
            value={name}
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
