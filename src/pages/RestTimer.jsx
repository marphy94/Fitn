import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Pause, Play, RotateCcw, Plus } from 'lucide-react'
import Button from '../components/ui/Button'
import haptics from '../lib/haptics'
import './RestTimer.css'

const TOTAL = 180 // 3:00

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function RestTimer() {
  const navigate = useNavigate()
  const [remaining, setRemaining] = useState(TOTAL)
  const [total, setTotal] = useState(TOTAL)
  const [running, setRunning] = useState(true)
  const tick = useRef(null)

  useEffect(() => {
    if (!running) return
    tick.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(tick.current)
          haptics.success()
          setRunning(false)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(tick.current)
  }, [running])

  const R = 130
  const CIRC = 2 * Math.PI * R
  const pct = total === 0 ? 0 : remaining / total
  const offset = CIRC * (1 - pct)

  const addTime = () => {
    haptics.light()
    setTotal((t) => t + 30)
    setRemaining((r) => r + 30)
  }
  const reset = () => {
    haptics.medium()
    setRemaining(total)
    setRunning(true)
  }

  return (
    <div className="rest">
      <header className="topbar rest__top">
        <span className="section-label" style={{ margin: 0 }}>
          Rest
        </span>
        <button
          className="icon-btn"
          aria-label="Skip rest"
          onClick={() => {
            haptics.medium()
            navigate(-1)
          }}
        >
          <X size={22} strokeWidth={2} />
        </button>
      </header>

      <div className="rest__body">
        <div className="rest__dial">
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle
              cx="150"
              cy="150"
              r={R}
              className="rest__track"
              fill="none"
              strokeWidth="10"
            />
            <circle
              cx="150"
              cy="150"
              r={R}
              className={'rest__arc' + (remaining === 0 ? ' rest__arc--done' : '')}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              transform="rotate(-90 150 150)"
            />
          </svg>
          <div className="rest__readout">
            <span className="rest__time">{fmt(remaining)}</span>
            <span className="rest__hint text-dulled">
              {remaining === 0 ? 'Ready' : 'until next set'}
            </span>
          </div>
        </div>

        <div className="rest__controls">
          <button className="rest__ctrl" aria-label="Restart" onClick={reset}>
            <RotateCcw size={22} strokeWidth={2} />
          </button>
          <button
            className="rest__ctrl rest__ctrl--primary"
            aria-label={running ? 'Pause' : 'Resume'}
            onClick={() => {
              haptics.medium()
              setRunning((r) => !r)
            }}
          >
            {running ? (
              <Pause size={28} strokeWidth={2.5} />
            ) : (
              <Play size={28} strokeWidth={2.5} />
            )}
          </button>
          <button className="rest__ctrl" aria-label="Add 30 seconds" onClick={addTime}>
            <Plus size={22} strokeWidth={2} />
            <span className="rest__ctrl-badge">30s</span>
          </button>
        </div>
      </div>

      <div className="rest__foot">
        <Button
          variant="outline"
          size="lg"
          full
          onClick={() => {
            haptics.medium()
            navigate(-1)
          }}
        >
          Skip rest
        </Button>
      </div>
    </div>
  )
}
