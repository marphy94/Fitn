import haptics from '../../lib/haptics'
import './ui.css'

/**
 * A small selectable token — used for muscle groups, filters and tags.
 */
export default function Chip({
  selected = false,
  onClick,
  children,
  className = '',
  ...rest
}) {
  const handleClick = (e) => {
    haptics.selection()
    onClick?.(e)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        'chip',
        selected ? 'chip--selected' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-pressed={selected}
      {...rest}
    >
      {children}
    </button>
  )
}
