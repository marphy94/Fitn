import { motion } from 'framer-motion'
import haptics from '../../lib/haptics'
import './ui.css'

/**
 * Variants:
 *  - primary  : filled accent (main actions)
 *  - outline  : hairline accent border (secondary emphasis)
 *  - ghost    : text only
 *  - positive : filled positive
 *  - danger   : filled / outline negative
 * Sizes: sm | md | lg | pill
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  icon: Icon,
  iconRight: IconRight,
  haptic = 'light',
  className = '',
  children,
  onClick,
  ...rest
}) {
  const handleClick = (e) => {
    if (haptic && haptics[haptic]) haptics[haptic]()
    onClick?.(e)
  }

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.12 }}
      onClick={handleClick}
      className={[
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        full ? 'btn--full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {Icon && <Icon size={size === 'sm' ? 15 : 17} strokeWidth={2.25} />}
      {children && <span>{children}</span>}
      {IconRight && (
        <IconRight size={size === 'sm' ? 15 : 17} strokeWidth={2.25} />
      )}
    </motion.button>
  )
}
