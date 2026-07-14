import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Screen from '../components/Screen'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { exercises } from '../data/mock'
import haptics from '../lib/haptics'
import './CreateExercises.css'

export default function CreateExercises() {
  const navigate = useNavigate()

  return (
    <>
      <header className="topbar">
        <h1 className="topbar__title">Exercises</h1>
        <Button
          variant="primary"
          size="pill"
          icon={Plus}
          haptic="medium"
          onClick={() => navigate('/exercises/new/edit')}
        >
          ADD
        </Button>
      </header>

      <Screen hasTabBar>
        <div className="stack">
          {exercises.map((ex) => (
            <Card key={ex.id} className="exercise-row">
              <div className="exercise-row__info">
                <p className="exercise-row__name">{ex.name}</p>
                <p className="exercise-row__groups text-dulled">
                  {ex.groups.join(' · ')}
                </p>
              </div>
              <div className="exercise-row__actions">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Pencil}
                  onClick={() => navigate(`/exercises/${ex.id}/edit`)}
                >
                  Edit
                </Button>
                <button
                  className="del-btn"
                  aria-label={`Delete ${ex.name}`}
                  onClick={() => haptics.warning()}
                >
                  <Trash2 size={17} strokeWidth={2} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </Screen>
    </>
  )
}
