import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Play, ChevronRight, ListChecks, Trash2 } from 'lucide-react'
import Screen from '../components/Screen'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useStore, usePlans } from '../store/store'
import haptics from '../lib/haptics'
import './FitnessPlans.css'

export default function FitnessPlans() {
  const navigate = useNavigate()
  const plans = usePlans()
  const { dispatch } = useStore()

  const addPlan = () => {
    haptics.medium()
    dispatch({ type: 'plan/add', payload: { name: 'New Workout' } })
  }

  const removePlan = (id, e) => {
    e.stopPropagation()
    haptics.warning()
    dispatch({ type: 'plan/delete', payload: id })
  }

  const countExercises = (plan) =>
    plan.items.filter((i) => i.type === 'exercise').length

  return (
    <>
      <header className="topbar">
        <h1 className="topbar__title">Workouts</h1>
        <Button
          variant="primary"
          size="pill"
          icon={Plus}
          haptic="medium"
          onClick={addPlan}
        >
          ADD
        </Button>
      </header>

      <Screen hasTabBar>
        {/* Exercise library — kept at the top for quick access */}
        <Card
          className="plan-card lib-card"
          interactive
          onClick={() => {
            haptics.light()
            navigate('/exercises')
          }}
        >
          <div className="plan-card__body">
            <div className="row gap-3">
              <div className="lib-icon">
                <ListChecks size={18} strokeWidth={2.25} />
              </div>
              <div>
                <p className="plan-card__name" style={{ fontSize: 18 }}>
                  Exercises
                </p>
                <p className="plan-card__meta text-secondary">
                  Create &amp; edit movements
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-dulled" strokeWidth={2} />
          </div>
        </Card>

        <span className="section-label" style={{ marginTop: 'var(--space-5)' }}>
          Your workouts
        </span>
        <div className="stack">
          {plans.map((plan) => (
            <Card key={plan.id} className="plan-card">
              <div className="plan-card__row">
                <div className="plan-card__info">
                  <p className="plan-card__name">{plan.name}</p>
                  <p className="plan-card__meta text-secondary">
                    {countExercises(plan)} exercises
                  </p>
                </div>
                <div className="plan-card__actions">
                  <button
                    className="del-btn"
                    aria-label={`Delete ${plan.name}`}
                    onClick={(e) => removePlan(plan.id, e)}
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Pencil}
                    onClick={() => navigate(`/plans/${plan.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Play}
                    haptic="medium"
                    onClick={() => navigate('/workout')}
                    disabled={countExercises(plan) === 0}
                  >
                    Start
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Screen>
    </>
  )
}
