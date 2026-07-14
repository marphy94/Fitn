import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, BarChart3 } from 'lucide-react'
import haptics from '../lib/haptics'
import './TabBar.css'

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/plans', label: 'Workout', icon: Dumbbell },
  { to: '/statistics', label: 'Statics', icon: BarChart3 },
]

export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Primary">
      <div className="tabbar__glass">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => haptics.selection()}
            className={({ isActive }) =>
              'tabbar__item' + (isActive ? ' is-active' : '')
            }
          >
            <Icon className="tabbar__icon" size={20} strokeWidth={2.25} />
            <span className="tabbar__label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
