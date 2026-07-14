import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Reorder, useDragControls, AnimatePresence, motion } from 'framer-motion'
import { Pencil, Trash2, GripVertical, Search, Timer, Plus, Check } from 'lucide-react'
import Button from '../components/ui/Button'
import { useStore, usePlan, uid } from '../store/store'
import { useExercises } from '../store/store'
import haptics from '../lib/haptics'
import './EditFitnessPlan.css'

function PlanItem({ item, onDelete }) {
  const controls = useDragControls()
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="plan-item card"
      whileDrag={{ scale: 1.02, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
    >
      <div className="plan-item__info">
        <p className="plan-item__name">
          {item.type === 'rest' && (
            <Timer size={15} strokeWidth={2.25} className="plan-item__resticon" />
          )}
          {item.name}
        </p>
        <p className="plan-item__sub text-dulled">
          {item.type === 'rest' ? item.detail : item.groups?.join(' · ')}
        </p>
      </div>

      <div className="plan-item__actions">
        {item.type === 'exercise' && (
          <Button variant="outline" size="sm" icon={Pencil}>
            Edit
          </Button>
        )}
        <button
          className="del-btn"
          aria-label={`Delete ${item.name}`}
          onClick={() => {
            haptics.warning()
            onDelete(item.id)
          }}
        >
          <Trash2 size={17} strokeWidth={2} />
        </button>
        <button
          className="grip"
          aria-label="Drag to reorder"
          onPointerDown={(e) => {
            haptics.selection()
            controls.start(e)
          }}
        >
          <GripVertical size={18} strokeWidth={2} />
        </button>
      </div>
    </Reorder.Item>
  )
}

export default function EditFitnessPlan() {
  const navigate = useNavigate()
  const { planId } = useParams()
  const plan = usePlan(planId)
  const library = useExercises()
  const { dispatch } = useStore()

  const [query, setQuery] = useState('')
  const [picking, setPicking] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [nameDraft, setNameDraft] = useState(plan?.name ?? '')

  const items = plan?.items ?? []

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return library
    return library.filter((e) => e.name.toLowerCase().includes(q))
  }, [library, query])

  if (!plan) {
    return (
      <div className="plan-editor">
        <div className="empty" style={{ paddingTop: 120 }}>
          <p className="empty__title">Plan not found</p>
          <Button variant="outline" size="md" onClick={() => navigate('/plans')}>
            Back to plans
          </Button>
        </div>
      </div>
    )
  }

  const reorder = (next) =>
    dispatch({ type: 'plan/reorder', payload: { id: plan.id, items: next } })

  const removeItem = (itemId) =>
    dispatch({ type: 'plan/removeItem', payload: { planId: plan.id, itemId } })

  const addExercise = (ex) => {
    haptics.success()
    dispatch({
      type: 'plan/addItem',
      payload: {
        id: plan.id,
        item: {
          id: uid(),
          type: 'exercise',
          exerciseId: ex.id,
          name: ex.name,
          groups: ex.groups,
        },
      },
    })
    setQuery('')
    setPicking(false)
  }

  const addRest = () => {
    haptics.success()
    dispatch({
      type: 'plan/addItem',
      payload: {
        id: plan.id,
        item: { id: uid(), type: 'rest', name: 'Rest', detail: '3 Minuten' },
      },
    })
    setPicking(false)
  }

  const commitRename = () => {
    const name = nameDraft.trim() || plan.name
    dispatch({ type: 'plan/rename', payload: { id: plan.id, name } })
    setRenaming(false)
    haptics.light()
  }

  return (
    <div className="plan-editor">
      <header className="topbar plan-editor__topbar">
        {renaming ? (
          <input
            className="plan-editor__rename"
            value={nameDraft}
            autoFocus
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => e.key === 'Enter' && commitRename()}
          />
        ) : (
          <button
            className="plan-editor__title"
            onClick={() => {
              haptics.light()
              setNameDraft(plan.name)
              setRenaming(true)
            }}
          >
            <span className="topbar__title">{plan.name}</span>
            <Pencil size={16} strokeWidth={2.25} className="text-accent" />
          </button>
        )}
        <Button variant="ghost" size="sm" onClick={() => navigate('/plans')}>
          Done
        </Button>
      </header>

      <div className="screen screen--padded plan-editor__scroll">
        {items.length === 0 ? (
          <div className="empty" style={{ paddingTop: 40 }}>
            <p className="empty__title">Empty plan</p>
            <p className="empty__sub text-secondary">
              Add exercises or a rest block from the bar below.
            </p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={items} onReorder={reorder} className="stack">
            {items.map((item) => (
              <PlanItem key={item.id} item={item} onDelete={removeItem} />
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Add picker */}
      <div className="plan-add">
        <AnimatePresence>
          {picking && (
            <motion.div
              className="picker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <button className="picker__row picker__row--rest" onClick={addRest}>
                <span className="picker__name">
                  <Timer size={15} strokeWidth={2.25} /> Rest block
                </span>
                <Plus size={16} strokeWidth={2.5} className="text-accent" />
              </button>
              {matches.map((ex) => (
                <button
                  key={ex.id}
                  className="picker__row"
                  onClick={() => addExercise(ex)}
                >
                  <span className="picker__info">
                    <span className="picker__name">{ex.name}</span>
                    <span className="picker__sub text-dulled">
                      {ex.groups.join(' · ')}
                    </span>
                  </span>
                  <Plus size={16} strokeWidth={2.5} className="text-accent" />
                </button>
              ))}
              {matches.length === 0 && (
                <div className="picker__empty text-dulled">No exercises match</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="plan-add__field">
          <input
            className="plan-add__input"
            placeholder="Add an exercise"
            value={query}
            onFocus={() => {
              haptics.light()
              setPicking(true)
            }}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="plan-add__toggle"
            aria-label={picking ? 'Close' : 'Search'}
            onClick={() => setPicking((p) => !p)}
          >
            {picking ? (
              <Check size={18} strokeWidth={2.5} className="text-accent" />
            ) : (
              <Search size={18} strokeWidth={2} className="text-dulled" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
