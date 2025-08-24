import React, { useMemo, useState, useEffect } from 'react'

const PETS = [
  { id:1,  kind:'dog', size:'medium', age:'adult', name:'Toby — Beagle',            img:'/images/beagle.jpg',     note:'4 years • curious • friendly' },
  { id:2,  kind:'cat', size:'medium', age:'adult', name:'Nori — British Shorthair', img:'/images/british.jpg',    note:'5 years • calm • indoor-ready' },
  { id:3,  kind:'cat', size:'small',  age:'adult', name:'Piper — Calico',           img:'/images/calico.jpg',     note:'4 years • sweet • quiet home' },
  { id:4,  kind:'dog', size:'large',  age:'adult', name:'Skye — Collie',            img:'/images/collie.jpg',     note:'5 years • intelligent • gentle' },
  { id:5,  kind:'dog', size:'small',  age:'young', name:'Cocoa — Corgi',            img:'/images/corgi.jpg',      note:'1 year • playful • food-motivated' },
  { id:6,  kind:'dog', size:'large',  age:'adult', name:'Max — German Shepherd',    img:'/images/german.jpg',     note:'4 years • loyal • trained' },
  { id:7,  kind:'dog', size:'large',  age:'young', name:'Buddy — Golden Retriever', img:'/images/golden.jpg',     note:'2 years • friendly • healthy' },
  { id:8,  kind:'dog', size:'large',  age:'adult', name:'Milo — Labrador',          img:'/images/labrador.jpg',   note:'3 years • active • fetch-lover' },
  { id:9,  kind:'cat', size:'medium', age:'adult', name:'Maine — Maine Coon',       img:'/images/maine.jpg',      note:'4 years • fluffy • gentle giant' },
  { id:10, kind:'cat', size:'small',  age:'senior', name:'Snow — Persian',          img:'/images/persian.jpg',    note:'8 years • gentle • indoor' },
  { id:11, kind:'cat', size:'medium', age:'adult', name:'Rags — Ragdoll',           img:'/images/ragdoll.jpg',    note:'4 years • calm • affectionate' },
  { id:12, kind:'cat', size:'small',  age:'adult', name:'Scotty — Scottish Fold',   img:'/images/scottish.jpg',   note:'3 years • curious • neat' },
  { id:13, kind:'dog', size:'medium', age:'young', name:'Nala — Shiba',             img:'/images/shiba.jpg',      note:'2 years • energetic • bright' },
  { id:14, kind:'cat', size:'small',  age:'adult', name:'Mochi — Shorthair',        img:'/images/shorthair.jpg',  note:'3 years • calm • indoor' },
  { id:15, kind:'cat', size:'small',  age:'young', name:'Luna — Tabby',             img:'/images/tabby.jpg',      note:'1 year • gentle • lap cat' },
  { id:16, kind:'dog', size:'small',  age:'adult', name:'Bailey — Pug',             img:'/images/pug.jpg',        note:'4 years • goofy • leash-trained' },
];

export default function Adoption() {
  const [filters, setFilters] = useState({ species:'', size:'', age:'', q:'' })
  const [modal, setModal] = useState({ open:false, pet:null, mode:'card' })
  const [submissionStatus, setSubmissionStatus] = useState('idle') // idle, sending, success, error

useEffect(() => {
  document.body.classList.toggle('modal-open', modal.open);
  return () => document.body.classList.remove('modal-open');
}, [modal.open]);

  // Initialize EmailJS
  useEffect(() => {
    if (window.emailjs && !window.__emailjs_adoption_inited) {
      try {
        window.emailjs.init('AdYMCl6FkthJDhmqn')
        window.__emailjs_adoption_inited = true
        console.log('EmailJS initialized for adoption forms')
      } catch (error) {
        console.error('EmailJS initialization failed:', error)
      }
    }
  }, [])
  

  const results = useMemo(() => {
    return PETS.filter(p => {
      if (filters.species && p.kind !== filters.species) return false
      if (filters.size && p.size !== filters.size) return false
      if (filters.age && p.age !== filters.age) return false
      if (filters.q && !p.name.toLowerCase().includes(filters.q.toLowerCase())) return false
      return true
    })
  }, [filters])

  const openCard = (pet) => setModal({ open:true, pet, mode:'card' })
  const openQuick = () => setModal({ open:true, pet:null, mode:'quick' })
  const close = () => {
    setModal({ open:false, pet:null, mode:'card' })
    setSubmissionStatus('idle')
  }

  // EmailJS form submission handler
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    
    // Basic validation
    if (!form.checkValidity()) {
      form.classList.add('was-validated')
      form.reportValidity()
      return
    }

    setSubmissionStatus('sending')

    try {
      // Prepare template parameters for EmailJS
      const formData = new FormData(form)
      const templateParams = {
        // Pet Information
        petName: modal.mode === 'card' && modal.pet ? modal.pet.name : formData.get('petName') || 'General Adoption Inquiry',
        
        // Applicant Information
        firstName: formData.get('firstName') || '',
        lastName: formData.get('lastName') || '',
        email: formData.get('email') || '',
        contact: formData.get('contact') || formData.get('phone') || '',
        
        // Appointment Details
        date: formData.get('date') || 'Not specified',
        time: formData.get('time') || 'Not specified',
        
        // Additional Information
        message: formData.get('message') || formData.get('notes') || 'No additional message',
        
        // System Information
        submissionDate: new Date().toLocaleString(),
        formType: modal.mode === 'card' ? 'Specific Pet Adoption' : 'General Adoption Inquiry'
      }

      console.log('Sending email with params:', templateParams)

      // Send email via EmailJS
      const response = await window.emailjs.send(
        'service_5rcpoaf',      // Your Service ID
        'template_s0sik5b',     // Your Adoption Template ID
        templateParams,
        'AdYMCl6FkthJDhmqn'    // Your Public Key
      )

      console.log('EmailJS response:', response)
      
      if (response.status === 200) {
        setSubmissionStatus('success')
        form.reset()
        
        // Show success message and auto-close modal after delay
        setTimeout(() => {
          close()
        }, 3000)
      } else {
        throw new Error('Email service returned an error')
      }

    } catch (error) {
      console.error('Failed to send adoption application:', error)
      setSubmissionStatus('error')
      
      // Reset status after delay
      setTimeout(() => {
        setSubmissionStatus('idle')
      }, 4000)
    }
  }

  return (
    <main className="adopt">
      <section className="ph-container">
        <div className="adopt-heading-row adopt-heading-spaced">
          <h1 className="section-title adoption-title">Find Your New Best Friend</h1>
          <button onClick={openQuick} className="btn-primary">Request Adoption</button>
        </div>

        {/* Filter bar */}
        <div className="adopt-toolbar adopt-toolbar-spaced">
          <form className="adopt-filterbar compact" onSubmit={(e)=>e.preventDefault()}>
            <div className="control">
              <label htmlFor="species">Species</label>
              <select id="species" className="select" value={filters.species} onChange={e=>setFilters({...filters, species:e.target.value})}>
                <option value="">All</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
              </select>
            </div>
            <div className="control">
              <label htmlFor="size">Size</label>
              <select id="size" className="select" value={filters.size} onChange={e=>setFilters({...filters, size:e.target.value})}>
                <option value="">All</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="control">
              <label htmlFor="age">Age</label>
              <select id="age" className="select" value={filters.age} onChange={e=>setFilters({...filters, age:e.target.value})}>
                <option value="">All</option>
                <option value="young">Young</option>
                <option value="adult">Adult</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <div className="control">
              <label htmlFor="search">Search by name</label>
              <input id="search" className="input" type="text" placeholder="Type name…" value={filters.q} onChange={e=>setFilters({...filters, q:e.target.value})} />
            </div>
          </form>
        </div>

        {/* Grid */}
        <div className="adopt-grid">
          {results.map(p => (
            <article key={p.id} className="pet-card" data-kind={p.kind} data-size={p.size} data-age={p.age}>
              <img className="pet-img" src={p.img} alt={p.name}
                   onError={(e)=> e.currentTarget.src='https://via.placeholder.com/480x320?text=No+Image'} />
              <div className="pet-body">
                <div>
                  <div className="pet-meta"><span className={'tag ' + (p.kind==='cat' ? 'cat': '')}>{p.kind[0].toUpperCase()+p.kind.slice(1)}</span><span className="tag">{p.size[0].toUpperCase()+p.size.slice(1)}</span></div>
                  <h3 className="pet-name">{p.name}</h3>
                  <p className="muted">{p.note}</p>
                </div>
                <a className="pet-cta" href="#apply" onClick={(e)=>{ e.preventDefault(); openCard(p); }}>Adopt Now</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Appointment Modal with EmailJS Integration */}
      <div className={"modal" + (modal.open ? ' is-open' : '')} role="dialog" aria-modal="true" aria-labelledby="appointmentTitle">
        <div className="modal-content adopt-modal-content" id="adoptModal" data-mode={modal.mode}>
          <span className="close" onClick={close} aria-label="Close">×</span>
          <h2 id="appointmentTitle">
            {modal.mode === 'card' && modal.pet
              ? <>Book Appointment with <span className="pet-accent">{modal.pet.name}</span>!</>
              : 'Book an Appointment'
            }
          </h2>
          
          {/* Status Messages */}
          {submissionStatus === 'success' && (
            <div className="form-status success adoption-success">
              ✅ Application submitted successfully! We'll contact you within 24 hours.
            </div>
          )}
          
          {submissionStatus === 'error' && (
            <div className="form-status error adoption-error">
              ❌ Failed to submit application. Please try again or contact us directly.
            </div>
          )}
          
          <div className="appointment-body adopt-appointment-body" data-mode={modal.mode}>
            {modal.mode === 'quick' ? (
              // Quick Request Form
              <form className="appointment-form clean-request" onSubmit={handleFormSubmit} noValidate>
                <div className="grid-1">
                  <label htmlFor="rqPet">Pet name (or "Any available pet")</label>
                  <input id="rqPet" name="petName" type="text" required placeholder="e.g., Mochi, Buddy, or Any available pet" />
                </div>
                <div className="grid-2">
                  <div className="fc">
                    <label htmlFor="rqFirstName">First Name *</label>
                    <input id="rqFirstName" name="firstName" type="text" required placeholder="Jamie" />
                  </div>
                  <div className="fc">
                    <label htmlFor="rqLastName">Last Name *</label>
                    <input id="rqLastName" name="lastName" type="text" required placeholder="Tan" />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="fc">
                    <label htmlFor="rqEmail">Email *</label>
                    <input id="rqEmail" name="email" type="email" required placeholder="you@example.com" />
                  </div>
                  <div className="fc">
                    <label htmlFor="rqContact">Contact Number *</label>
                    <input id="rqContact" name="contact" type="tel" required placeholder="+65 9XXXXXXX" />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="fc">
                    <label htmlFor="rqDate">Preferred Date</label>
                    <input id="rqDate" name="date" type="date" min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="fc">
                    <label htmlFor="rqTime">Select Time</label>
                    <input id="rqTime" name="time" type="time" />
                  </div>
                </div>
                <div className="grid-1">
                  <label htmlFor="rqMessage">Tell us about yourself and why you want to adopt</label>
                  <textarea id="rqMessage" name="message" placeholder="Tell us about your living situation, family, other pets, why you want to adopt, etc." rows="4"></textarea>
                </div>
                <button 
                  className="btn-primary btn-block adoption-submit-btn" 
                  type="submit"
                  disabled={submissionStatus === 'sending'}
                >
                  {submissionStatus === 'sending' ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            ) : (
              // Specific Pet Adoption Form
              <>
                {modal.pet && (
                  <div className="pet-preview adopt-pet-preview">
                    <img src={modal.pet.img} alt={modal.pet.name} onError={(e)=> e.currentTarget.src='https://via.placeholder.com/400x250?text=No+Image'} />
                  </div>
                )}
                <form className="appointment-form clean-request card-request" onSubmit={handleFormSubmit} noValidate>
                  <div className="grid-1">
                    <label htmlFor="cpPet">Pet name</label>
                    <input id="cpPet" name="petName" type="text" required defaultValue={modal.pet?.name || ''} placeholder="e.g., Mochi, Buddy" readOnly={!!modal.pet} />
                  </div>
                  <div className="grid-2">
                    <div className="fc">
                      <label htmlFor="cpFirstName">First Name *</label>
                      <input id="cpFirstName" name="firstName" type="text" required placeholder="Jamie" />
                    </div>
                    <div className="fc">
                      <label htmlFor="cpLastName">Last Name *</label>
                      <input id="cpLastName" name="lastName" type="text" required placeholder="Tan" />
                    </div>
                  </div>
                  <div className="grid-2">
                    <div className="fc">
                      <label htmlFor="cpEmail">Email *</label>
                      <input id="cpEmail" name="email" type="email" required placeholder="you@example.com" />
                    </div>
                    <div className="fc">
                      <label htmlFor="cpContact">Contact Number *</label>
                      <input id="cpContact" name="contact" type="tel" required placeholder="+65 9XXXXXXX" />
                    </div>
                  </div>
                  <div className="grid-2">
                    <div className="fc">
                      <label htmlFor="cpDate">Preferred Date</label>
                      <input id="cpDate" name="date" type="date" min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="fc">
                      <label htmlFor="cpTime">Select Time</label>
                      <input id="cpTime" name="time" type="time" />
                    </div>
                  </div>
                  <div className="grid-1">
                    <label htmlFor="cpMessage">Why are you interested in {modal.pet?.name || 'this pet'}? *</label>
                    <textarea id="cpMessage" name="message" required placeholder="Tell us about your living situation, experience with pets, why you want to adopt, etc." rows="4"></textarea>
                  </div>
                  <button 
                    className="btn-primary btn-block adoption-submit-btn" 
                    type="submit"
                    disabled={submissionStatus === 'sending'}
                  >
                    {submissionStatus === 'sending' ? 'Submitting...' : 'Submit Adoption Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}