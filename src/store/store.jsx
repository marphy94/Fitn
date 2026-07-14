import { createContext, useContext, useEffect, useReducer } from 'react'
import { exercises as seedExercises, plans as seedPlans } from '../data/mock'

/**
 * A small persisted store for Fitn. State lives in a reducer and is mirrored to
 * localStorage, seeded from the mock data on first run. This replaces the
 * static placeholders with real, editable data.
 */

const STORAGE_KEY = 'fitn.state.v1'

export const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'id-' + Math.random().toString(36).slice(2, 10)

function seed() {
  return {
    exercises: seedExercises.map((e) => ({ ...e })),
    plans: seedPlans.map((p) => ({
      ...p,
      items: p.items.map((i) => ({ ...i })),
    })),
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    const parsed = JSON.parse(raw)
    if (!parsed?.exercises || !parsed?.plans) return seed()
    return parsed
  } catch {
    return seed()
  }
}

function reducer(state, action) {
  switch (action.type) {
    /* ---- Exercises ---- */
    case 'exercise/save': {
      const { id, name, groups } = action.payload
      const exists = state.exercises.some((e) => e.id === id)
      const exercises = exists
        ? state.exercises.map((e) => (e.id === id ? { ...e, name, groups } : e))
        : [...state.exercises, { id, name, groups }]
      return { ...state, exercises }
    }
    case 'exercise/delete':
      return {
        ...state,
        exercises: state.exercises.filter((e) => e.id !== action.payload),
      }

    /* ---- Plans ---- */
    case 'plan/add': {
      const plan = {
        id: uid(),
        name: action.payload?.name || 'New Workout',
        items: [],
      }
      return { ...state, plans: [...state.plans, plan] }
    }
    case 'plan/rename':
      return {
        ...state,
        plans: state.plans.map((p) =>
          p.id === action.payload.id ? { ...p, name: action.payload.name } : p
        ),
      }
    case 'plan/delete':
      return {
        ...state,
        plans: state.plans.filter((p) => p.id !== action.payload),
      }
    case 'plan/reorder':
      return {
        ...state,
        plans: state.plans.map((p) =>
          p.id === action.payload.id ? { ...p, items: action.payload.items } : p
        ),
      }
    case 'plan/addItem':
      return {
        ...state,
        plans: state.plans.map((p) =>
          p.id === action.payload.id
            ? { ...p, items: [...p.items, action.payload.item] }
            : p
        ),
      }
    case 'plan/removeItem':
      return {
        ...state,
        plans: state.plans.map((p) =>
          p.id === action.payload.planId
            ? { ...p, items: p.items.filter((i) => i.id !== action.payload.itemId) }
            : p
        ),
      }

    case 'state/reset':
      return seed()

    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [state])

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}

/* ---- Selectors ---- */
export const useExercises = () => useStore().state.exercises
export const usePlans = () => useStore().state.plans
export const useExercise = (id) =>
  useStore().state.exercises.find((e) => e.id === id) || null
export const usePlan = (id) =>
  useStore().state.plans.find((p) => p.id === id) || null
