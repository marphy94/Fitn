import './Screen.css'

/**
 * The scrollable content region of a screen. Pass `padded` (default) for the
 * standard 16px gutters, or `flush` when a child manages its own padding.
 * `hasTabBar` reserves space for the floating bottom navigation.
 */
export default function Screen({
  children,
  padded = true,
  hasTabBar = false,
  className = '',
}) {
  return (
    <div
      className={[
        'screen',
        padded ? 'screen--padded' : '',
        hasTabBar ? 'screen--tabbar' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
