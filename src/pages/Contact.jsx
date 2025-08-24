import React, { useEffect, useState } from 'react'

export default function Contact() {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    // Init EmailJS if available (optional, matches your HTML usage)
    if (window.emailjs && !window.__emailjs_inited) {
      try {
        // Put your public key here if you have one
        window.emailjs.init({ publicKey: 'AdYMCl6FkthJDhmqn' })
        window.__emailjs_inited = true
      } catch {}
    }
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const errs = {}
    if (!data.from_name) errs.name = 'Please enter your name.'
    if (!data.reply_to || !data.reply_to.includes('@')) errs.email = 'Please enter a valid email.'
    if (!data.subject) errs.subject = 'Please select a topic.'
    if (!data.message) errs.message = 'Please enter a message.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setStatus('sending')
    try {
      if (window.emailjs) {
        await window.emailjs.send('service_5rcpoaf', 'template_bo4svh6', data)
      } else {
        await new Promise(r => setTimeout(r, 800)) // simulate
      }
      setStatus('success')
      form.reset()
      setTimeout(()=> setStatus('idle'), 1500)
    } catch (err) {
      setStatus('error')
      setTimeout(()=> setStatus('idle'), 1500)
    }
  }

  return (
    <main>
      <section className="ph-section">
        <div className="ph-container">
          <h1 style={{margin:'0 0 6px'}}>Contact Us</h1>
          <p className="muted" style={{margin:0}}>Questions about adoption, releasing, or volunteering? We're here to help.</p>
        </div>
      </section>

      <section className="ph-section" style={{paddingTop:16, paddingBottom:8}}>
        <div className="ph-container" style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:32}}>
          {/* Details card */}
          <article className="ph-card">
            <div className="ph-card-body">
              <h3 style={{margin:'0 0 4px'}}>Shelter Details</h3>
              <p className="muted" style={{margin:'0 0 16px'}}>Reach out via phone, email, or drop by during visiting hours.</p>

              <div style={{display:'grid', gap:14, marginTop:8}}>
                <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                  <div style={{fontSize:20, lineHeight:1.1}}>📍</div>
                  <div>
                    <div><strong>Address</strong></div>
                    <div className="muted">Hougang Central, Block 851, Singapore 530851</div>
                  </div>
                </div>

                <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                  <div style={{fontSize:20, lineHeight:1.1}}>🕒</div>
                  <div>
                    <div><strong>Hours</strong></div>
                    <div className="muted">Mon—Sun: 10:00 AM — 6:00 PM (SGT)</div>
                  </div>
                </div>

                <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                  <div style={{fontSize:20, lineHeight:1.1}}>☎️</div>
                  <div>
                    <div><strong>Phone</strong></div>
                    <div className="muted">+65 8888 8888</div>
                  </div>
                </div>

                <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                  <div style={{fontSize:20, lineHeight:1.1}}>✉️</div>
                  <div>
                    <div><strong>Email</strong></div>
                    <div className="muted"><a href="mailto:petheaven123@hotmail.com">petheaven123@hotmail.com</a></div>
                  </div>
                </div>
              </div>

              <div style={{marginTop:18}}>
                <h3 style={{margin:'0 0 10px'}}>Quick Links</h3>
                <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                  <a className="btn-primary" href="/adoption">Browse Pets</a>
                  <a className="btn-primary" href="/releasing" style={{background:'#475569'}}>Release a Pet</a>
                </div>
              </div>
            </div>
          </article>

          {/* Form card */}
          <article className="ph-card">
            <div className="ph-card-body">
              <h3 style={{margin:'0 0 10px'}}>Send us a message</h3>
              <form id="contactForm" className="contact-form" onSubmit={onSubmit} noValidate>
                <div className="form-row" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                  <div className="form-field">
                    <label htmlFor="name">Full Name *</label>
                    <input id="name" name="from_name" type="text" placeholder="Jane Tan" />
                    <div className="field-error" id="name-error">{errors.name || ''}</div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone">Phone (optional)</label>
                    <input id="phone" name="phone" type="tel" placeholder="+65 8XXX XXXX" />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email *</label>
                  <input id="email" name="reply_to" type="email" placeholder="you@example.com" />
                  <div className="field-error" id="email-error">{errors.email || ''}</div>
                </div>

                <div className="form-field">
                  <label htmlFor="subject">Subject *</label>
                  <select id="subject" name="subject">
                    <option value="" disabled> Select a topic</option>
                    <option value="Adoption Enquiry">Adoption Enquiry</option>
                    <option value="Release a Pet">Release a Pet</option>
                    <option value="Volunteering">Volunteering</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Others">Others</option>
                  </select>
                  <div className="field-error" id="subject-error">{errors.subject || ''}</div>
                </div>

                <div className="form-field">
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" name="message" placeholder="Tell us how we can help…"></textarea>
                  <div className="field-error" id="message-error">{errors.message || ''}</div>
                </div>

                <button className="btn-primary" type="submit" id="submitBtn">
                  {status === 'sending' ? <span><i className="fas fa-spinner fa-spin"></i> Sending…</span> : 'Send Message'}
                </button>

                <div id="formStatus" className="form-status" style={{marginTop:8}}>
                  {status === 'success' && <span style={{color:'#16a34a'}}>Sent! We'll reply soon.</span>}
                  {status === 'error' && <span style={{color:'#b91c1c'}}>Failed to send. Please try again.</span>}
                </div>
              </form>
            </div>
          </article>
        </div>
      </section>

      {/* Map embed */}
      <section className="ph-section" style={{paddingTop:0}}>
        <div className="ph-container">
          <div className="ph-card" style={{overflow:'hidden'}}>
            <div className="ph-card-body" style={{padding:0}}>
              <iframe
                title="PetHeaven — Hougang Central"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{border:0, width:'100%', height:420, display:'block'}}
                src="https://www.google.com/maps?q=Hougang%20Central%20Block%20851%20Singapore%20530851&output=embed"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
