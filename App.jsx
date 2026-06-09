import { useState, useRef, useEffect } from 'react'
import './App.css'
import NoteCard from './components/NoteCard'
import AddNoteModal from './components/AddNoteModal'
import AuthPage from './components/AuthPage'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('notes-current-user')
    return saved ? JSON.parse(saved) : null
  })

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes-app-data')
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Welcome to Notes! ✨ Click + to add your first note.', createdAt: new Date().toISOString() }
    ]
  })
  const [showModal, setShowModal] = useState(false)
  const [editNote, setEditNote] = useState(null)
  const [search, setSearch] = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('notes-app-data', JSON.stringify(notes))
  }, [notes])

  const handleAuth = (userData) => {
    setUser(userData)
    localStorage.setItem('notes-current-user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('notes-current-user')
  }

  const addNote = (text) => {
    if (!text.trim()) return
    const newNote = {
      id: Date.now(),
      text: text.trim(),
      createdAt: new Date().toISOString()
    }
    setNotes(prev => [newNote, ...prev])
    setShowModal(false)
  }

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const saveEdit = (id, newText) => {
    if (!newText.trim()) return
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text: newText.trim() } : n))
    setEditNote(null)
  }

  const filtered = notes.filter(n =>
    n.text.toLowerCase().includes(search.toLowerCase())
  )

  if (!user) {
    return <AuthPage onAuth={handleAuth} />
  }

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase()

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h1 className="logo">Notes</h1>
        </div>
        <div className="header-center">
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>×</button>
            )}
          </div>
        </div>
        <div className="header-right">
          <button className="add-btn" onClick={() => setShowModal(true)} title="New Note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>New Note</span>
          </button>
          <div className="user-menu">
            <div className="user-avatar" title={user.name || user.email}>{initials}</div>
            <div className="user-dropdown">
              <div className="user-info">
                <strong>{user.name || 'User'}</strong>
                <span>{user.email}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="page-top">
          <div>
            <h2 className="page-title">My Notes</h2>
            <p className="page-sub">
              {filtered.length} {filtered.length === 1 ? 'note' : 'notes'}
              {search && <span className="search-tag"> matching "{search}"</span>}
            </p>
          </div>
        </div>

        <div className="grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <p className="empty-title">{search ? 'No notes found' : 'No notes yet'}</p>
              <p className="empty-sub">{search ? `No notes match "${search}"` : 'Click New Note to get started!'}</p>
            </div>
          ) : (
            filtered.map((note, i) => (
              <NoteCard
                key={note.id}
                note={note}
                index={i}
                isEditing={editNote === note.id}
                onEdit={() => setEditNote(note.id)}
                onDelete={() => deleteNote(note.id)}
                onSave={(text) => saveEdit(note.id, text)}
                onCancel={() => setEditNote(null)}
              />
            ))
          )}
        </div>
      </main>

      {showModal && (
        <AddNoteModal
          onAdd={addNote}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default App
