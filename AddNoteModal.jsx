import { useState, useRef, useEffect } from 'react'
import './AddNoteModal.css'

function AddNoteModal({ onAdd, onClose }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleAdd()
    if (e.key === 'Escape') onClose()
  }

  const handleAdd = () => {
    if (text.trim()) onAdd(text)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">New Note</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your note here..."
          className="modal-textarea"
          maxLength={500}
          rows={6}
        />

        <div className="modal-footer">
          <span className="modal-hint">Ctrl + Enter to save · Esc to close</span>
          <div className="modal-btns">
            <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button
              className="modal-btn-add"
              onClick={handleAdd}
              disabled={!text.trim()}
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNoteModal
