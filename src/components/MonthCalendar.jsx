import './MonthCalendar.css'

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

/**
 * A compact month grid in the spirit of Notion Calendar — a number with a
 * status ring beneath it. Filled rings mark completed workout days.
 */
export default function MonthCalendar({
  year = 2026,
  month = 6, // 0-indexed
  today = 14,
  workoutDays = [2, 3, 14, 15, 16],
}) {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // JS getDay(): 0=Sun..6=Sat -> shift so Monday = 0
  const leading = (first.getDay() + 6) % 7

  const cells = []
  for (let i = 0; i < leading; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="cal">
      <div className="cal__head">
        <h3 className="cal__title">
          {MONTHS[month]} {year}
        </h3>
      </div>

      <div className="cal__weekdays">
        {WEEKDAYS.map((w, i) => (
          <span key={w} className={'cal__wd' + (i >= 5 ? ' cal__wd--we' : '')}>
            {w}
          </span>
        ))}
      </div>

      <div className="cal__grid">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} className="cal__cell" />
          const col = i % 7
          const isWeekend = col >= 5
          const isToday = day === today
          const isWorkout = workoutDays.includes(day)
          return (
            <span
              key={day}
              className={
                'cal__cell' +
                (isWeekend ? ' cal__cell--we' : '') +
                (isToday ? ' cal__cell--today' : '')
              }
            >
              <span className="cal__num">{day}</span>
              <span
                className={
                  'cal__dot' + (isWorkout ? ' cal__dot--done' : '')
                }
              />
            </span>
          )
        })}
      </div>
    </div>
  )
}
