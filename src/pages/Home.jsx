import { useNavigate } from 'react-router-dom'
import { Settings, Play, ArrowRight } from 'lucide-react'
import Screen from '../components/Screen'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import MonthCalendar from '../components/MonthCalendar'
import { lastWorkout } from '../data/mock'
import { usePlans } from '../store/store'
import haptics from '../lib/haptics'
import './Home.css'

function DeltaBadge({ value }) {
  const positive = value >= 0
  return (
    <span className={'delta ' + (positive ? 'delta--up' : 'delta--down')}>
      {positive ? '+' : '−'} {Math.abs(value)} kg
    </span>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const plans = usePlans()
  const nextPlan = plans[0]
  const nextWorkout = {
    name: nextPlan?.name ?? 'No plan yet',
    exercises: nextPlan
      ? nextPlan.items.filter((i) => i.type === 'exercise').length
      : 0,
  }

  return (
    <>
      <header className="topbar">
        <h1 className="topbar__title">Hallo Maria</h1>
        <button
          className="icon-btn"
          aria-label="Settings"
          onClick={() => haptics.light()}
        >
          <Settings size={22} strokeWidth={2} />
        </button>
      </header>

      <Screen hasTabBar>
        {/* Next workout */}
        <Card className="next-workout">
          <div className="next-workout__meta">
            <span className="section-label" style={{ margin: 0 }}>
              Next Workout
            </span>
            <p className="next-workout__name">{nextWorkout.name}</p>
            <p className="next-workout__sub text-secondary">
              {nextWorkout.exercises} exercises
            </p>
          </div>
          <Button
            variant="primary"
            size="pill"
            icon={Play}
            haptic="medium"
            onClick={() => navigate(nextPlan ? '/workout' : '/plans')}
          >
            Start
          </Button>
        </Card>

        {/* Calendar */}
        <Card className="calendar-card">
          <MonthCalendar year={2026} month={6} />
        </Card>

        {/* Last workout header */}
        <div className="last-workout-head">
          <div>
            <span className="section-label" style={{ margin: 0 }}>
              Last Workout • {lastWorkout.date}
            </span>
            <p className="last-workout-head__name">{lastWorkout.name}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconRight={ArrowRight}
            onClick={() => navigate('/statistics')}
          >
            Statics
          </Button>
        </div>

        {/* Last workout results */}
        <div className="stack">
          {lastWorkout.entries.map((entry) => (
            <Card key={entry.name} className="result-card">
              <div className="result-card__head">
                <p className="result-card__name">{entry.name}</p>
                <DeltaBadge value={entry.delta} />
              </div>
              <div className="result-card__sets">
                {entry.sets.map((s, i) => (
                  <div className="set-cell" key={i}>
                    <span className="set-cell__label">Set {i + 1}</span>
                    <span className="set-cell__value">{s}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Screen>
    </>
  )
}
