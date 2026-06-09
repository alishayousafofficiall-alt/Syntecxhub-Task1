import { useState, useRef, useEffect } from 'react'
import './NoteCard.css'

const CARD_ACCENTS = ['#c17f3e','#5b8a6e','#6b7fc4','#b05a7a','#7a8a4e','#5a8aaa']

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function NoteCard({ note, index, isEditing, onEdit, onDelete, onSave, onCancel }) {
  const [editText, setEditText] = useState(note.text)
  const textareaRef = useRef(null)
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(editText.length, editText.length)
    }
  }, [isEditing])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) onSave(editText)
    if (e.key === 'Escape') { setEditText(note.text); onCancel() }
  }

  return (
    <div
      className={`note-card ${isEditing ? 'editing' : ''}`}
      style={{ '--card-accent': accent }}
    >
      <div className="note-body">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="note-textarea"
            maxLength={500}
            rows={5}
          />
        ) : (
          <p className="note-text">{note.text}</p>
        )}
      </div>

      <div className="note-footer">
        <span className="note-date">{formatDate(note.createdAt)}</span>
        {isEditing ? (
          <div className="note-actions">
            <button className="btn-save" onClick={() => onSave(editText)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              Save
            </button>
            <button className="btn-cancel" onClick={() => { setEditText(note.text); onCancel() }}>Cancel</button>
          </div>
        ) : (
          <div className="note-actions">
            <button className="btn-edit" onClick={onEdit}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              edit
            </button>
            <button className="btn-delete" onClick={onDelete}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
              delete
            </button>
          </div>
        )}
      </div>
      {isEditing && <div className="char-count">{editText.length}/500 · Ctrl+Enter to save</div>}
    </div>
  )
}

export default NoteCard
