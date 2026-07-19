import { useState } from 'react'
import { TrendingUp, TrendingDown, Dumbbell } from 'lucide-react'
import Screen from '../components/Screen'
import Card from '../components/ui/Card'
import haptics from '../lib/haptics'
import './Statistics.css'

const RANGES = ['Week', 'Month', 'Year']
const BARS = [40, 62, 48, 78, 55, 88, 70]
const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const trends = [
  { name: 'Sumo Squat', value: '62.5 kg', delta: 2.5 },
  { name: 'Hip Thrust', value: '80 kg', delta: 5 },
  { name: 'Romanian DL', value: '55 kg', delta: -0.5 },
  { name: 'Goblet Squat', value: '30 kg', delta: 1.5 },
]

export default function Statistics() {
  const [range, setRange] = useState('Week')

  return (
    <>
      <header className="topbar">
        <h1 className="topbar__title">Statistics</h1>
      </header>

      <Screen hasTabBar>
        {/* Range selector */}
        <div className="segment" role="tablist" aria-label="Time range">
          {RANGES.map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={range === r}
              className={'segment__item' + (range === r ? ' is-active' : '')}
              onClick={() => {
                haptics.selection()
                setRange(r)
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Summary tiles */}
        <div className="stat-tiles">
          <Card className="stat-tile">
            <div className="stat-tile__icon">
              <Dumbbell size={16} strokeWidth={2.25} />
            </div>
            <span className="stat-tile__value">12</span>
            <span className="stat-tile__label text-secondary">Workouts</span>
          </Card>
          <Card className="stat-tile">
            <div className="stat-tile__icon">
              <TrendingUp size={16} strokeWidth={2.25} />
            </div>
            <span className="stat-tile__value">18,240 kg</span>
            <span className="stat-tile__label text-secondary">Total volume</span>
          </Card>
        </div>

        {/* Volume chart */}
        <Card className="chart-card">
          <div className="chart-card__head">
            <div>
              <span className="section-label" style={{ margin: 0 }}>
                Volume
              </span>
              <p className="chart-card__total">18,240 kg</p>
            </div>
            <span className="delta delta--up">+ 12%</span>
          </div>
          <div className="chart">
            {BARS.map((h, i) => (
              <div className="chart__col" key={i}>
                <div
                  className={'chart__bar' + (h === Math.max(...BARS) ? ' is-peak' : '')}
                  style={{ height: `${h}%` }}
                />
                <span className="chart__x text-dulled">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Per-exercise trends */}
        <span className="section-label">Personal records</span>
        <div className="stack">
          {trends.map((t) => {
            const up = t.delta >= 0
            return (
              <Card key={t.name} className="trend-row">
                <div className="trend-row__info">
                  <p className="trend-row__name">{t.name}</p>
                  <p className="trend-row__value text-secondary">{t.value}</p>
                </div>
                <span className={'trend-row__delta ' + (up ? 'text-positive' : 'text-negative')}>
                  {up ? (
                    <TrendingUp size={15} strokeWidth={2.5} />
                  ) : (
                    <TrendingDown size={15} strokeWidth={2.5} />
                  )}
                  {up ? '+' : '−'}
                  {Math.abs(t.delta)} kg
                </span>
              </Card>
            )
          })}
        </div>
      </Screen>
    </>
  )
}
