import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Home() {
  const slidesRef = useRef([])
  const [volunteerModal, setVolunteerModal] = useState(false)
  const [volunteerStatus, setVolunteerStatus] = useState('idle') // idle, sending, success, error

  // Initialize EmailJS for volunteer form
  useEffect(() => {
    if (window.emailjs && !window.__emailjs_volunteer_inited) {
      try {
        window.emailjs.init('AdYMCl6FkthJDhmqn')
        window.__emailjs_volunteer_inited = true
        console.log('EmailJS initialized for volunteer forms')
      } catch (error) {
        console.error('EmailJS initialization failed:', error)
      }
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const slides = slidesRef.current
      if (!slides || slides.length === 0) return
      let idx = slides.findIndex(s => s.classList.contains('is-active'))
      if (idx === -1) idx = 0
      slides[idx]?.classList.remove('is-active')
      idx = (idx + 1) % slides.length
      slides[idx]?.classList.add('is-active')
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    document.body.style.overflow = volunteerModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [volunteerModal]);  

  const showPrev = () => {
    const slides = slidesRef.current
    if (!slides || slides.length === 0) return
    let idx = slides.findIndex(s => s.classList.contains('is-active'))
    if (idx === -1) idx = 0
    slides[idx]?.classList.remove('is-active')
    idx = (idx - 1 + slides.length) % slides.length
    slides[idx]?.classList.add('is-active')
  }

  const showNext = () => {
    const slides = slidesRef.current
    if (!slides || slides.length === 0) return
    let idx = slides.findIndex(s => s.classList.contains('is-active'))
    if (idx === -1) idx = 0
    slides[idx]?.classList.remove('is-active')
    idx = (idx + 1) % slides.length
    slides[idx]?.classList.add('is-active')
  }

  const openVolunteerModal = () => setVolunteerModal(true)
  const closeVolunteerModal = () => {
    setVolunteerModal(false)
    setVolunteerStatus('idle')
  }

  // Handle volunteer form submission
  const handleVolunteerSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    
    if (!form.checkValidity()) {
      form.classList.add('was-validated')
      form.reportValidity()
      return
    }

    setVolunteerStatus('sending')

    try {
      const formData = new FormData(form)
      const templateParams = {
        from_name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        reply_to: formData.get('email'),
        phone: formData.get('phone') || 'Not provided',
        subject: 'Volunteer Registration Application',
        message: `
VOLUNTEER APPLICATION DETAILS:

Personal Information:
- Name: ${formData.get('firstName')} ${formData.get('lastName')}
- Email: ${formData.get('email')}
- Phone: ${formData.get('phone') || 'Not provided'}
- Age: ${formData.get('age')}

Availability:
- Preferred Days: ${formData.get('availability')}
- Time Commitment: ${formData.get('timeCommitment')}

Experience & Interests:
- Pet Experience: ${formData.get('experience')}
- Volunteer Areas: ${formData.get('volunteerAreas')}
- Previous Volunteer Work: ${formData.get('previousVolunteer') || 'None specified'}

Additional Information:
${formData.get('additionalInfo') || 'No additional information provided'}

Emergency Contact:
- Name: ${formData.get('emergencyName') || 'Not provided'}
- Phone: ${formData.get('emergencyPhone') || 'Not provided'}
        `,
        sent_time: new Date().toLocaleString()
      }

      // Send via EmailJS using Contact form template
      const response = await window.emailjs.send(
        'service_5rcpoaf',
        'template_bo4svh6', // Using contact form template for volunteer applications
        templateParams,
        'AdYMCl6FkthJDhmqn'
      )

      if (response.status === 200) {
        setVolunteerStatus('success')
        form.reset()
        setTimeout(() => {
          closeVolunteerModal()
        }, 3000)
      } else {
        throw new Error('Email service error')
      }

    } catch (error) {
      console.error('Failed to send volunteer application:', error)
      setVolunteerStatus('error')
      setTimeout(() => {
        setVolunteerStatus('idle')
      }, 4000)
    }
  }

  return (
    <div>
      {/* Hero (slideshow) - Updated buttons */}
      <section className="hero" id="hero">
        <div className="hero-slides" aria-hidden="true">
          {[
            "/images/cute1.jpg",
            "/images/cute2.jpg", 
            "/images/cute3.jpg",
          ].map((url, i) => (
            <div key={i}
                 ref={el => slidesRef.current[i] = el}
                 className={"hero-slide" + (i===0 ? " is-active" : "")}
                 style={{"--bg": `url('${url}')`}} />
          ))}
        </div>
        <div className="hero-overlay"></div>

        <button className="hero-nav hero-prev" aria-label="Previous slide" onClick={showPrev}>‹</button>
        <button className="hero-nav hero-next" aria-label="Next slide" onClick={showNext}>›</button>

        <div className="hero-inner hero-right-align">
          <h1 className="hero-title">Give Every Pet a Second Chance</h1>
          <p className="hero-subtitle">Together, we can create forever homes and provide safe releasing for pets in need.</p>
          <div className="hero-ctas right-ctas">
            <button onClick={openVolunteerModal} className="btn-hero">Volunteer Now</button>
            <NavLink to="/releasing" className="btn-hero">Release now</NavLink>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="ph-section ph-impact" aria-labelledby="impactTitle">
        <div className="ph-container">
          <h2 id="impactTitle" className="visually-hidden">Our Impact</h2>
          <div className="about-stats about-stats-row top">
            <div className="stat"><span className="num">1,200+</span><span className="label">Pets Rehomed</span></div>
            <div className="stat"><span className="num">300+</span><span className="label">Active Volunteers</span></div>
            <div className="stat"><span className="num">98%</span><span className="label">Care Satisfaction</span></div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="about" aria-labelledby="aboutTitle">
        <div className="ph-container about-inner">
          <h2 id="aboutTitle">About Us</h2>
          <p className="lead">
            At Pet Heaven, our mission is to create a world where every abandoned pet has the chance to find safety,
            love, and a forever home. We believe every life matters, and we work tirelessly to connect animals in need
            with families who are ready to provide care and companionship.
          </p>
          <p className="lead">
            Our vision goes beyond rehoming. We're building a compassionate community that champions responsible pet
            ownership, supports rehabilitation for animals in crisis, and spreads awareness to reduce abandonment.
            Together, we turn uncertainty into second chances.
          </p>
        </div>
      </section>

      {/* Services (cards) - Updated volunteer card */}
      <section className="ph-section ph-services" id="services">
        <div className="ph-container">
          <div className="ph-grid-4">
            <article className="ph-card ph-card-outline" id="adoption">
              <div className="ph-card-icon" aria-hidden="true">🏡</div>
              <h3 className="ph-card-title">Forever Homes</h3>
              <p className="ph-card-text">We match pets with the right families so every animal gets a safe, happy future.</p>
              <NavLink to="/adoption" className="ph-link">Explore adoptions »</NavLink>
            </article>

            <article className="ph-card ph-card-outline" id="releasing">
              <div className="ph-card-icon" aria-hidden="true">🤝</div>
              <h3 className="ph-card-title">Safe Surrender</h3>
              <p className="ph-card-text">When keeping a pet isn't possible, we provide a compassionate, responsible handover.</p>
              <NavLink to="/releasing" className="ph-link">How it works »</NavLink>
            </article>

            <article className="ph-card ph-card-outline">
              <div className="ph-card-icon" aria-hidden="true">🩺</div>
              <h3 className="ph-card-title">Healing & Care</h3>
              <p className="ph-card-text">Every pet receives medical attention, vaccinations, and behavioral support.</p>
              <a href="#care" className="ph-link">See our care »</a>
            </article>

            <article className="ph-card ph-card-outline" id="volunteer">
              <div className="ph-card-icon" aria-hidden="true">❤️</div>
              <h3 className="ph-card-title">Join Our Team</h3>
              <p className="ph-card-text">Become a volunteer and help us care for animals while building community connections.</p>
              <button onClick={openVolunteerModal} className="ph-link volunteer-link-btn">
                Volunteer with us »
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* Adopt carousel (homepage preview) */}
      <section className="ph-section ph-carousel" id="adopt-carousel">
        <div className="ph-container">
          <h2 className="ph-section-title center">Ready to Adopt?</h2>
          <p className="ph-section-subtitle center">Explore pets that are available for adoption!</p>

          <div className="carousel">
            <button className="car-btn prev" aria-label="Previous" onClick={() => {
              const track = document.getElementById('carouselTrack')
              track && (track.scrollLeft -= 280)
            }}>‹</button>
            <div className="car-track" id="carouselTrack" tabIndex={0} aria-label="Adoptable pets">
              <article className="car-item">
                <img src="/images/golden.jpg" alt="Golden Retriever Buddy" loading="lazy"
                     onError={(e)=> e.currentTarget.src='https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop'} />
                <div className="car-caption"><strong>Buddy</strong> — Golden Retriever, playful & friendly</div>
              </article>
              <article className="car-item">
                <img src="/images/tabby.jpg" alt="Tabby Luna" loading="lazy"
                     onError={(e)=> e.currentTarget.src='https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop'} />
                <div className="car-caption"><strong>Luna</strong> — Tabby, gentle lap cat</div>
              </article>
              <article className="car-item">
                <img src="/images/labrador.jpg" alt="Labrador Milo" loading="lazy"
                     onError={(e)=> e.currentTarget.src='https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1200&auto=format&fit=crop'} />
                <div className="car-caption"><strong>Milo</strong> — Labrador, active & fetch-lover</div>
              </article>
              <article className="car-item">
                <img src="/images/shorthair.jpg" alt="Domestic Shorthair Mochi" loading="lazy"
                     onError={(e)=> e.currentTarget.src='https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop'} />
                <div className="car-caption"><strong>Mochi</strong> — Domestic Shorthair, calm & indoor-ready</div>
              </article>
              <article className="car-item">
                <img src="/images/corgi.jpg" alt="Corgi Cocoa" loading="lazy"
                     onError={(e)=> e.currentTarget.src='https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop'} />
                <div className="car-caption"><strong>Cocoa</strong> — Corgi, playful & food-motivated</div>
              </article>
              <article className="car-item">
                <img src="/images/british.jpg" alt="British Shorthair Nori" loading="lazy"
                     onError={(e)=> e.currentTarget.src='https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop'} />
                <div className="car-caption"><strong>Nori</strong> — British Shorthair, curious & calm</div>
              </article>
            </div>
            <button className="car-btn next" aria-label="Next" onClick={() => {
              const track = document.getElementById('carouselTrack')
              track && (track.scrollLeft += 280)
            }}>›</button>
          </div>
          <div className="explore-pets-btn">
            <NavLink to="/adoption" className="btn-primary">Explore all pets</NavLink>
          </div>
        </div>
      </section>

      {/* Volunteer Registration Modal */}
      <div className={"modal" + (volunteerModal ? ' is-open' : '')} role="dialog" aria-modal="true" aria-labelledby="volunteerTitle">
        <div className="modal-content volunteer-modal-content">
          <span className="close" onClick={closeVolunteerModal} aria-label="Close">×</span>
          <h2 id="volunteerTitle" className="volunteer-modal-title">
            Join Our Volunteer Team
          </h2>
          
          {/* Status Messages */}
          {volunteerStatus === 'success' && (
            <div className="form-status success volunteer-success">
              ✅ Volunteer application submitted successfully! We'll contact you within 2-3 business days.
            </div>
          )}
          
          {volunteerStatus === 'error' && (
            <div className="form-status error volunteer-error">
              ❌ Failed to submit application. Please try again or email us directly.
            </div>
          )}
          
          <form onSubmit={handleVolunteerSubmit} className="volunteer-form" noValidate>
            
            {/* Personal Information */}
            <div className="volunteer-section">
              <h3 className="volunteer-section-title">Personal Information</h3>
              <div className="volunteer-grid-2">
                <div className="volunteer-field">
                  <label htmlFor="vFirstName">First Name *</label>
                  <input id="vFirstName" name="firstName" type="text" required placeholder="John" className="volunteer-input" />
                </div>
                <div className="volunteer-field">
                  <label htmlFor="vLastName">Last Name *</label>
                  <input id="vLastName" name="lastName" type="text" required placeholder="Smith" className="volunteer-input" />
                </div>
              </div>
              <div className="volunteer-grid-3">
                <div className="volunteer-field">
                  <label htmlFor="vEmail">Email Address *</label>
                  <input id="vEmail" name="email" type="email" required placeholder="john@example.com" className="volunteer-input" />
                </div>
                <div className="volunteer-field">
                  <label htmlFor="vPhone">Phone Number</label>
                  <input id="vPhone" name="phone" type="tel" placeholder="+65 9XXX XXXX" className="volunteer-input" />
                </div>
                <div className="volunteer-field">
                  <label htmlFor="vAge">Age *</label>
                  <select id="vAge" name="age" required className="volunteer-input">
                    <option value="">Select</option>
                    <option value="16-17">16-17</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-50">36-50</option>
                    <option value="51+">51+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="volunteer-section">
              <h3 className="volunteer-section-title">Availability</h3>
              <div className="volunteer-grid-2">
                <div className="volunteer-field">
                  <label htmlFor="vAvailability">Preferred Days *</label>
                  <select id="vAvailability" name="availability" required className="volunteer-input">
                    <option value="">Select</option>
                    <option value="Weekdays only">Weekdays only</option>
                    <option value="Weekends only">Weekends only</option>
                    <option value="Both weekdays and weekends">Both weekdays and weekends</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                <div className="volunteer-field">
                  <label htmlFor="vTimeCommitment">Time Commitment *</label>
                  <select id="vTimeCommitment" name="timeCommitment" required className="volunteer-input">
                    <option value="">Select</option>
                    <option value="1-2 hours per week">1-2 hours per week</option>
                    <option value="3-5 hours per week">3-5 hours per week</option>
                    <option value="6-10 hours per week">6-10 hours per week</option>
                    <option value="More than 10 hours per week">More than 10 hours per week</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Experience & Interests */}
            <div className="volunteer-section">
              <h3 className="volunteer-section-title">Experience & Interests</h3>
              <div className="volunteer-field volunteer-field-mb">
                <label htmlFor="vExperience">Experience with Animals *</label>
                <select id="vExperience" name="experience" required className="volunteer-input">
                  <option value="">Select</option>
                  <option value="No experience but eager to learn">No experience but eager to learn</option>
                  <option value="Some experience with pets">Some experience with pets</option>
                  <option value="Extensive experience with pets">Extensive experience with pets</option>
                  <option value="Professional experience (vet, trainer, etc.)">Professional experience (vet, trainer, etc.)</option>
                </select>
              </div>
              <div className="volunteer-field volunteer-field-mb">
                <label htmlFor="vVolunteerAreas">Volunteer Areas of Interest *</label>
                <select id="vVolunteerAreas" name="volunteerAreas" required className="volunteer-input">
                  <option value="">Select primary interest</option>
                  <option value="Animal care and feeding">Animal care and feeding</option>
                  <option value="Dog walking and exercise">Dog walking and exercise</option>
                  <option value="Cat socialization">Cat socialization</option>
                  <option value="Administrative support">Administrative support</option>
                  <option value="Event planning and fundraising">Event planning and fundraising</option>
                  <option value="Photography and social media">Photography and social media</option>
                  <option value="Transport and rescue">Transport and rescue</option>
                  <option value="Education and outreach">Education and outreach</option>
                </select>
              </div>
              <div className="volunteer-field">
                <label htmlFor="vPreviousVolunteer">Previous Volunteer Experience</label>
                <input id="vPreviousVolunteer" name="previousVolunteer" type="text" placeholder="e.g., Local animal shelter, Red Cross, etc." className="volunteer-input" />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="volunteer-section">
              <h3 className="volunteer-section-title">Emergency Contact</h3>
              <div className="volunteer-grid-2">
                <div className="volunteer-field">
                  <label htmlFor="vEmergencyName">Contact Name</label>
                  <input id="vEmergencyName" name="emergencyName" type="text" placeholder="Emergency contact name" className="volunteer-input" />
                </div>
                <div className="volunteer-field">
                  <label htmlFor="vEmergencyPhone">Contact Phone</label>
                  <input id="vEmergencyPhone" name="emergencyPhone" type="tel" placeholder="+65 9XXX XXXX" className="volunteer-input" />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="volunteer-field">
              <label htmlFor="vAdditionalInfo">Additional Information</label>
              <textarea id="vAdditionalInfo" name="additionalInfo" rows="4" 
                        placeholder="Tell us anything else you'd like us to know about your interest in volunteering, special skills, languages spoken, etc."
                        className="volunteer-input volunteer-textarea" />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={volunteerStatus === 'sending'}
              className={`volunteer-submit-btn ${volunteerStatus === 'sending' ? 'volunteer-submit-loading' : ''}`}
            >
              {volunteerStatus === 'sending' ? '🔄 Submitting Application...' : 'Submit Volunteer Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}