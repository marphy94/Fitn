import { motion } from 'framer-motion'
import './ui.css'

/**
 * The base surface of the app. Glass-optional, hairline border, generous
 * radius. Set `interactive` for press feedback on tappable cards.
 */
export default function Card({
  as = 'div',
  glass = false,
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  const Comp = interactive ? motion[as] ?? motion.div : as
  const motionProps = interactive
    ? { whileTap: { scale: 0.985 }, transition: { duration: 0.14 } }
    : {}

  return (
    <Comp
      className={[
        'card',
        glass ? 'card--glass' : '',
        interactive ? 'card--interactive' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...motionProps}
      {...rest}
    >
      {children}
    </Comp>
  )
}
