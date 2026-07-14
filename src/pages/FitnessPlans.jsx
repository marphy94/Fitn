import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Play, ChevronRight, ListChecks } from 'lucide-react'
import Screen from '../components/Screen'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { plans } from '../data/mock'
import haptics from '../lib/haptics'
import './FitnessPlans.css'

export default function FitnessPlans() {
  const navigate = useNavigate()

  return (
    <>
      <header className="topbar">
        <h1 className="topbar__title">Fitness Plans</h1>
        <Button
          variant="primary"
          size="pill"
          icon={Plus}
          haptic="medium"
          onClick={() => navigate('/plans/leg-day/edit')}
        >
          ADD
        </Button>
      </header>

      <Screen hasTabBar>
        <span className="section-label">Your plans</span>
        <div className="stack">
          {plans.map((plan) => (
            <Card key={plan.id} className="plan-card" interactive>
              <div
                className="plan-card__body"
                onClick={() => {
                  haptics.light()
                  navigate(`/plans/${plan.id}/edit`)
                }}
              >
                <div className="plan-card__info">
                  <p className="plan-card__name">{plan.name}</p>
                  <p className="plan-card__meta text-secondary">
                    {plan.items.filter((i) => i.type === 'exercise').length}{' '}
                    exercises
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-dulled"
                  strokeWidth={2}
                />
              </div>
              <div className="plan-card__foot">
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
                >
                  Start
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <span className="section-label" style={{ marginTop: 'var(--space-5)' }}>
          Library
        </span>
        <Card
          className="plan-card"
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
      </Screen>
    </>
  )
}
