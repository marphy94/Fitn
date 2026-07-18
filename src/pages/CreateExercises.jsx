import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Dumbbell, ArrowLeft } from 'lucide-react'
import Screen from '../components/Screen'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useStore, useExercises } from '../store/store'
import haptics from '../lib/haptics'
import './CreateExercises.css'

export default function CreateExercises() {
  const navigate = useNavigate()
  const exercises = useExercises()
  const { dispatch } = useStore()

  const remove = (id) => {
    haptics.warning()
    dispatch({ type: 'exercise/delete', payload: id })
  }

  return (
    <>
      <header className="topbar">
        <Button
          variant="outline"
          size="pill"
          icon={ArrowLeft}
          onClick={() => navigate('/plans')}
        >
          Back
        </Button>
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
        <h1 className="large-title editor-title">Exercises</h1>

        {exercises.length === 0 ? (
          <div className="empty">
            <div className="empty__icon">
              <Dumbbell size={22} strokeWidth={2} />
            </div>
            <p className="empty__title">No exercises yet</p>
            <p className="empty__sub text-secondary">
              Add your first movement to start building plans.
            </p>
            <Button
              variant="outline"
              size="md"
              icon={Plus}
              onClick={() => navigate('/exercises/new/edit')}
            >
              New exercise
            </Button>
          </div>
        ) : (
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
                    onClick={() => remove(ex.id)}
                  >
                    <Trash2 size={17} strokeWidth={2} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Screen>
    </>
  )
}
