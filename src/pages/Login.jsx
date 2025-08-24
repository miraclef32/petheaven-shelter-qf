import React, { useRef, useState } from 'react'

export default function Login() {
  const ensureValidity = (form) => {
    if (!form.checkValidity()) {
      form.classList.add('was-validated')
      form.reportValidity()
      return false
    }
    form.classList.remove('was-validated')
    return true
  }
  const [tab, setTab] = useState('login')
  const [showLi, setShowLi] = useState(false)
  const [showSu, setShowSu] = useState(false)
  const liErrorRef = useRef(null)

  const onLogin = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!ensureValidity(form)) return

    const email = form.liEmail.value.trim()
    const pw = form.liPassword.value
    if ((email === 'admin@petheaven.sg' && pw === 'admin123') || (email === 'user@example.com' && pw === '1234')) {
      alert('Login successful (demo)')
    } else {
      if (liErrorRef.current) liErrorRef.current.style.display = 'block'
      alert('Incorrect email or password (demo). For real auth, connect your backend.')
    }
  }

  const onSignup = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!ensureValidity(form)) return

    const d = Object.fromEntries(new FormData(form).entries())
    if (d.suPassword !== d.suConfirm) {
      form.classList.add('was-validated')
      alert('Passwords do not match')
      return
    }
    alert('Account created (demo)')
  }

  return (
    <main>
      <div className="auth-shell">
        {/* Left column */}
        <section className="auth-intro">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to track adoptions, manage releases, and view your application status.</p>
          <ul className="auth-highlights">
            <li><i>❤️</i> Save favourite pets</li>
            <li><i>📋</i> Manage appointments</li>
            <li><i>🔔</i> Get updates faster</li>
          </ul>
          <div className="auth-quicklinks">
            <a className="btn btn-ghost" href="/adoption">Browse pets</a>
            <a className="btn btn-ghost" href="/releasing">Release a pet</a>
          </div>
        </section>

        {/* Right column: tabs */}
        <section className="auth-card" role="region" aria-labelledby="auth-tabs">
          <div id="auth-tabs" className="auth-tabs" role="tablist" aria-label="Authentication">
            <button id="tab-login"  className={'auth-tab ' + (tab==='login' ? 'active':'')} role="tab" aria-selected={tab==='login'} aria-controls="panel-login" onClick={()=>setTab('login')}>Log in</button>
            <button id="tab-signup" className={'auth-tab ' + (tab==='signup' ? 'active':'')} role="tab" aria-selected={tab==='signup'} aria-controls="panel-signup" onClick={()=>setTab('signup')}>Sign up</button>
          </div>

          {/* LOGIN PANEL */}
          {tab==='login' && (
            <div id="panel-login" className="auth-panel" role="tabpanel" aria-labelledby="tab-login">
              <h2 className="auth-panel-title">Login</h2>
              <form id="loginForm" className="grid" onSubmit={onLogin} noValidate>
                <div className="control">
                  <label htmlFor="liEmail">Email</label>
                  <input id="liEmail" name="liEmail" type="email" placeholder="you@example.com" required />
                </div>
                <div className="control">
                  <div className="label-row">
                    <label htmlFor="liPassword">Password</label>
                    <button id="toggleLiPw" type="button" className="control__btn" onClick={()=>setShowLi(s=>!s)}>{showLi ? 'Hide' : 'Show'}</button>
                  </div>
                  <input id="liPassword" name="liPassword" type={showLi ? 'text' : 'password'} placeholder="••••••••" required />
                </div>
                <div className="auth-row">
                  <label className="checkbox"><input id="remember" type="checkbox" /> Remember me</label>
                  <a className="link-muted" href="#">Forgot password?</a>
                </div>
                <button className="btn btn-brand btn-block" type="submit">Log In</button>
                <div id="liError" className="auth-error" ref={liErrorRef} role="alert" style={{display:'none'}}>Incorrect email or password.</div>
                <div className="auth-note auth-note--split">
                  <span>Don't have an account?</span>
                  <button type="button" id="goSignup" className="btn btn-ghost" onClick={()=>setTab('signup')}>Sign up</button>
                </div>
                <p className="auth-demo">Demo users: <strong>admin@petheaven.sg / admin123</strong> | <strong>user@example.com / 1234</strong></p>
              </form>
            </div>
          )}

          {/* SIGNUP PANEL */}
          {tab==='signup' && (
            <div id="panel-signup" className="auth-panel" role="tabpanel" aria-labelledby="tab-signup" tabIndex={-1}>
              <h2 className="auth-panel-title">Create your account</h2>
              <form id="suForm" className="grid" onSubmit={onSignup} noValidate>
                <div className="grid-2">
                  <div className="control">
                    <label htmlFor="suFirst">First name</label>
                    <input id="suFirst" name="suFirst" type="text" placeholder="Jamie" required />
                  </div>
                  <div className="control">
                    <label htmlFor="suLast">Last name</label>
                    <input id="suLast" name="suLast" type="text" placeholder="Tan" required />
                  </div>
                </div>
                <div className="control">
                  <label htmlFor="suEmail">Email</label>
                  <input id="suEmail" name="suEmail" type="email" placeholder="you@example.com" required />
                </div>
                <div className="grid-2">
                  <div className="control">
                    <div className="label-row">
                      <label htmlFor="suPassword">Password</label>
                      <button id="toggleSuPw" type="button" className="control__btn" onClick={()=>setShowSu(s=>!s)}>{showSu ? 'Hide' : 'Show'}</button>
                    </div>
                    <input id="suPassword" name="suPassword" type={showSu ? 'text' : 'password'} placeholder="Choose a password" minLength={6} required />
                  </div>
                  <div className="control">
                    <label htmlFor="suConfirm">Confirm password</label>
                    <input id="suConfirm" name="suConfirm" type={showSu ? 'text' : 'password'} placeholder="Re-enter password" minLength={6} required />
                  </div>
                </div>
                <button className="btn btn-brand btn-block" type="submit">Create account</button>
                <div id="suError" className="auth-error" role="alert" style={{display:'none'}}></div>
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
