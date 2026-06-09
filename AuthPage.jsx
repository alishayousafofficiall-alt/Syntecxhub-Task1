import { useState, useRef, useEffect } from 'react'
import './AuthPage.css'

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const emailRef = useRef(null)

  useEffect(() => {
    emailRef.current?.focus()
    setError('')
    setSuccess('')
    setForm({ name: '', email: '', password: '' })
  }, [mode])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (mode === 'register' && !form.name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (mode === 'register') {
      const users = JSON.parse(localStorage.getItem('notes-users') || '[]')
      if (users.find(u => u.email === form.email)) {
        setError('An account with this email already exists.')
        return
      }
      users.push({ name: form.name, email: form.email, password: form.password })
      localStorage.setItem('notes-users', JSON.stringify(users))
      setSuccess('Account created! Logging you in...')
      setTimeout(() => onAuth({ name: form.name, email: form.email }), 900)
    } else {
      const users = JSON.parse(localStorage.getItem('notes-users') || '[]')
      const user = users.find(u => u.email === form.email && u.password === form.password)
      if (!user) {
        setError('Incorrect email or password.')
        return
      }
      onAuth({ name: user.name, email: user.email })
    }
  }

  return (
    <div className="auth-page">
      {/* Decorative blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <span className="auth-logo-text">Notes</span>
        </div>

        {/* Toggle */}
        <div className="auth-toggle">
          <div
            className="toggle-pill"
            style={{ transform: mode === 'register' ? 'translateX(100%)' : 'translateX(0)' }}
          />
          <button
            className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={`toggle-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Sign Up
          </button>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1 className="auth-title">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to access your notes'
              : 'Start capturing your thoughts'}
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="field-group fade-in">
              <label className="field-label">Full Name</label>
              <div className="field-wrap">
                <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="field-input"
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="field-group">
            <label className="field-label">Email Address</label>
            <div className="field-wrap">
              <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                ref={emailRef}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="field-input"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={mode === 'register' ? 'Min. 6 characters' : 'Your password'}
                className="field-input"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              />
            </div>
          </div>

          {error && (
            <div className="auth-error fade-in">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success fade-in">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
              {success}
            </div>
          )}

          <button type="submit" className="auth-submit">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </form>

        {/* Footer hint */}
        <p className="auth-footer">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className="auth-link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>

        {/* Demo hint */}
        <div className="auth-demo">
          <span>Demo: register any email/password to try</span>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
