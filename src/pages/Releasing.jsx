import React, { useMemo, useState } from 'react'

export default function Releasing() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({})

  const maxStep = 4
  const validateActiveStep = () => {
    const panel = document.querySelector('.release-step.is-active')
    if (!panel) return true
    // add validation style class
    const formEl = document.getElementById('releaseForm') || panel.closest('form')
    if (formEl) formEl.classList.add('was-validated')
    const invalid = panel.querySelector(':invalid')
    if (invalid) { invalid.reportValidity && invalid.reportValidity(); return false }
    return true
  }
  const go = (delta) => setStep(s => Math.min(maxStep, Math.max(1, s + delta)))

  const reviewList = useMemo(() => {
    return Object.entries(form).map(([k,v]) => (
      <div key={k} style={{display:'grid', gridTemplateColumns:'160px 1fr', gap:10}}>
        <div className="muted" style={{fontWeight:600}}>{k}</div>
        <div>{v || <span className="muted">—</span>}</div>
      </div>
    ))
  }, [form])

  const onChange = (e) => setForm(prev => ({...prev, [e.target.name]: e.target.value}))

  return (
    <div className="release">
      <main className="release-card">
        {/* Progress */}
        <div className="release-progress" aria-label="Form progress">
          <div className="rp-line"></div>
          <div className="rp-fill" style={{position:'absolute', left:18, right:18, top:24, height:2, background:'#3b82f6', width: `${(step-1)/(maxStep-1)*100}%`}}></div>
          {[1,2,3,4].map(i => (
            <div key={i} className={'rp-step ' + (i===step ? 'is-active':'')} data-title={['Owner','Pet','Release','Confirm'][i-1]}>{i}</div>
          ))}
        </div>

        <form id="releaseForm" className="release-form" onSubmit={(e)=>e.preventDefault()} noValidate>
          <section className="release-steps">

            {/* STEP 1 */}
            <div className={'release-step ' + (step===1 ? 'is-active' : '')} data-step="1">
              <h2 className="release-h2">Your Details</h2>
              <div className="grid-2">
                <div>
                  <label className="release-label">Full Name *</label>
                  <input className="release-input" type="text" name="owner_name" onChange={onChange} placeholder="e.g., Jamie Tan" required />
                </div>
                <div>
                  <label className="release-label">Phone *</label>
                  <input className="release-input" type="tel" name="owner_phone" onChange={onChange} placeholder="+65 9XXXXXXX" required />
                </div>
              </div>
              <label className="release-label">Email *</label>
              <input className="release-input" type="email" name="owner_email" onChange={onChange} placeholder="you@example.com" required />
              <div className="grid-2">
                <div>
                  <label className="release-label">Street</label>
                  <input className="release-input" type="text" name="addr_street" onChange={onChange} placeholder="Block / Street" />
                </div>
                <div>
                  <label className="release-label">Unit (Optional)</label>
                  <input className="release-input" type="text" name="addr_unit" onChange={onChange} placeholder="#12-345" />
                </div>
              </div>
              <div className="grid-4">
                <div>
                  <label className="release-label">City</label>
                  <input className="release-input" type="text" name="addr_city" onChange={onChange} placeholder="City" />
                </div>
                <div>
                  <label className="release-label">State</label>
                  <input className="release-input" type="text" name="addr_state" onChange={onChange} placeholder="State" />
                </div>
                <div>
                  <label className="release-label">Postal</label>
                  <input className="release-input" type="text" name="addr_postal" onChange={onChange} placeholder="Postal" />
                </div>
                <div>
                  <label className="release-label">Country</label>
                  <input className="release-input" type="text" name="addr_country" onChange={onChange} placeholder="Country" />
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className={'release-step ' + (step===2 ? 'is-active' : '')} data-step="2">
              <h2 className="release-h2">Your Pet's Details</h2>
              <div className="grid-2">
                <div>
                  <label className="release-label">Pet Name *</label>
                  <input className="release-input" type="text" name="pet_name" onChange={onChange} placeholder="e.g., Mochi" required />
                </div>
                <div>
                  <label className="release-label">Type *</label>
                  <select className="release-input" name="pet_type" onChange={onChange} required>
                    <option value="">Select</option>
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="grid-3">
                <div>
                  <label className="release-label">Breed</label>
                  <input className="release-input" type="text" name="pet_breed" onChange={onChange} placeholder="e.g., Singapore Special" />
                </div>
                <div>
                  <label className="release-label">Age</label>
                  <input className="release-input" type="text" name="pet_age" onChange={onChange} placeholder="e.g., 2 years" />
                </div>
                <div>
                  <label className="release-label">Vaccination</label>
                  <select className="release-input" name="pet_vax" onChange={onChange}>
                    <option value="">Select</option>
                    <option>Up-to-date</option>
                    <option>Partial</option>
                    <option>Not vaccinated</option>
                  </select>
                </div>
              </div>

              <label className="release-label">Neutered</label>
              <div className="neuter-group" role="radiogroup" aria-label="Neutered" style={{display:'flex',gap:12}}>
                {['yes','no','unsure'].map(v => (
                  <label key={v} className="neuter-pill" style={{border:'1px solid #e5e7eb', borderRadius:999, padding:'6px 12px'}}>
                    <input type="radio" name="pet_neutered" value={v} onChange={onChange} /> <span style={{marginLeft:6}}>{v[0].toUpperCase()+v.slice(1)}</span>
                  </label>
                ))}
              </div>

              <label className="release-label" htmlFor="pet_notes">Temperament / Notes (Optional)</label>
              <textarea id="pet_notes" className="release-input release-textarea" name="pet_notes" onChange={onChange}
                        placeholder="e.g., friendly and calm, good with kids, shy with new people, loves walks at 6pm…" />
            </div>

            {/* STEP 3 */}
            <div className={'release-step ' + (step===3 ? 'is-active' : '')} data-step="3">
              <h2 className="release-h2">Release Details</h2>
              
              {/* Date and Time in same row */}
              <div className="grid-date-time-reason">
                <div>
                  <label className="release-label">Preferred Date</label>
                  <input className="release-input" type="date" name="release_date" required onChange={onChange} />
                </div>
                <div>
                  <label className="release-label">Preferred Time</label>
                  <input className="release-input" type="time" name="release_time" onChange={onChange} />
                </div>
                
                {/* Reason spans full width below date/time */}
                <div className="grid-reason-full">
                  <label className="release-label">Reason</label>
                  <input className="release-input" type="text" name="release_reason" onChange={onChange} placeholder="Short reason" />
                </div>
              </div>
              
              <label className="release-label">Additional Notes</label>
              <textarea className="release-input release-textarea" name="release_notes" onChange={onChange}
                        placeholder="Anything important we should know?"></textarea>
            </div>

            {/* STEP 4 */}
            <div className={'release-step ' + (step===4 ? 'is-active' : '')} data-step="4">
              
              <div className="review-card">
                <h3 className="review-title">Owner</h3>
                <div className="review-list">
                  <div className="review-row"><span>Full Name</span><b>{form.owner_name || '—'}</b></div>
                  <div className="review-row"><span>Phone</span><b>{form.owner_phone || '—'}</b></div>
                  <div className="review-row"><span>Email</span><b>{form.owner_email || '—'}</b></div>
                  <div className="review-row"><span>Street</span><b>{form.addr_street || '—'}</b></div>
                  <div className="review-row"><span>Unit</span><b>{form.addr_unit || '—'}</b></div>
                  <div className="review-row"><span>City</span><b>{form.addr_city || '—'}</b></div>
                  <div className="review-row"><span>State</span><b>{form.addr_state || '—'}</b></div>
                  <div className="review-row"><span>Postal</span><b>{form.addr_postal || '—'}</b></div>
                  <div className="review-row"><span>Country</span><b>{form.addr_country || '—'}</b></div>
                </div>

                <h3 className="review-title">Pet</h3>
                <div className="review-list">
                  <div className="review-row"><span>Pet Name</span><b>{form.pet_name || '—'}</b></div>
                  <div className="review-row"><span>Type</span><b>{form.pet_type || '—'}</b></div>
                  <div className="review-row"><span>Breed</span><b>{form.pet_breed || '—'}</b></div>
                  <div className="review-row"><span>Age</span><b>{form.pet_age || '—'}</b></div>
                  <div className="review-row"><span>Vaccination</span><b>{form.pet_vax || '—'}</b></div>
                  <div className="review-row"><span>Neutered</span><b>{form.pet_neutered || '—'}</b></div>
                  <div className="review-row"><span>Temperament / Notes</span><b>{form.pet_notes || '—'}</b></div>
                </div>

                <h3 className="review-title">Release</h3>
                <div className="review-list">
                  <div className="review-row"><span>Preferred Date</span><b>{form.release_date || '—'}</b></div>
                  <div className="review-row"><span>Preferred Time</span><b>{form.release_time || '—'}</b></div>
                  <div className="review-row"><span>Reason</span><b>{form.release_reason || '—'}</b></div>
                  <div className="review-row"><span>Additional Notes</span><b>{form.release_notes || '—'}</b></div>
                </div>
              </div>

              <h2 className="release-h2 gentle" style={{marginTop:12}}>A Gentle Reminder</h2>
              <p className="gentle-p">Please consider alternatives such as:</p>
              <ul className="gentle-list">
                <li>Rehoming with trusted friends or family</li>
                <li>Support from pet welfare organizations</li>
                <li>Addressing behavioral or medical concerns with a professional</li>
              </ul>
              <p className="gentle-p">If you still wish to proceed, we'll help you with care.</p>
            </div>

          </section>

          {/* Nav buttons */}
          <div className="release-nav">
            <div className="release-nav-left">
              <button type="button" className="btn btn-ghost" id="btnBack" onClick={()=>go(-1)} disabled={step===1}>Back</button>
            </div>
            <div className="release-nav-right">
              <button type="button" className="btn-primary" id="btnNext" onClick={()=> (step<maxStep ? (validateActiveStep() && go(1)) : (validateActiveStep() && alert('Submitted!'))) }>
                {step < maxStep ? 'Next' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
        
      </main>
    </div>
  )
}