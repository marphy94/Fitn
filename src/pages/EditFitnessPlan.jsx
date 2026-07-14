import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Reorder, useDragControls } from 'framer-motion'
import { Pencil, Trash2, GripVertical, Search, Timer } from 'lucide-react'
import Button from '../components/ui/Button'
import { plans } from '../data/mock'
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
        <Button variant="outline" size="sm" icon={Pencil}>
          Edit
        </Button>
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
  const plan = plans.find((p) => p.id === planId) ?? plans[0]

  const [items, setItems] = useState(plan.items)

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  return (
    <div className="plan-editor">
      <header className="topbar plan-editor__topbar">
        <button
          className="plan-editor__title"
          onClick={() => {
            haptics.light()
            navigate(-1)
          }}
        >
          <span className="topbar__title">{plan.name}</span>
          <Pencil size={16} strokeWidth={2.25} className="text-accent" />
        </button>
      </header>

      <div className="screen screen--padded plan-editor__scroll">
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="stack"
        >
          {items.map((item) => (
            <PlanItem key={item.id} item={item} onDelete={remove} />
          ))}
        </Reorder.Group>
      </div>

      {/* Bottom add bar */}
      <div className="plan-add">
        <div className="plan-add__field">
          <input
            className="plan-add__input"
            placeholder="Add an exercise"
            onFocus={() => haptics.light()}
          />
          <Search size={18} strokeWidth={2} className="text-dulled" />
        </div>
      </div>
    </div>
  )
}
