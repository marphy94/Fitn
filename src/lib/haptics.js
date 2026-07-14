/**
 * Haptics abstraction.
 *
 * On native iOS (via Capacitor / a WKWebView bridge) this maps to the real
 * UIImpactFeedbackGenerator. In a plain browser we fall back to the Vibration
 * API where available so the interaction still feels responsive. The API is
 * intentionally modelled on Apple's feedback styles so the call sites read the
 * same regardless of platform.
 */

const canVibrate =
  typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'

// Native bridge, if present (populated by a Capacitor plugin later).
const bridge =
  typeof window !== 'undefined' ? window.Capacitor?.Plugins?.Haptics : undefined

const patterns = {
  light: 8,
  medium: 12,
  heavy: 18,
  soft: 6,
  rigid: 14,
  success: [10, 40, 14],
  warning: [14, 60, 14],
  error: [18, 40, 18, 40, 18],
  selection: 4,
}

function fire(kind) {
  if (bridge) {
    try {
      if (['success', 'warning', 'error'].includes(kind)) {
        bridge.notification({ type: kind })
      } else if (kind === 'selection') {
        bridge.selectionChanged()
      } else {
        bridge.impact({ style: kind })
      }
      return
    } catch {
      /* fall through to web */
    }
  }
  if (canVibrate) navigator.vibrate(patterns[kind] ?? 8)
}

export const haptics = {
  light: () => fire('light'),
  medium: () => fire('medium'),
  heavy: () => fire('heavy'),
  soft: () => fire('soft'),
  rigid: () => fire('rigid'),
  selection: () => fire('selection'),
  success: () => fire('success'),
  warning: () => fire('warning'),
  error: () => fire('error'),
}

export default haptics
