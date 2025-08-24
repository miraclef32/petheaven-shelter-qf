import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Scroll to anchor smoothly after route change
      const el = document.querySelector(hash)
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
      else { window.scrollTo({ top: 0, behavior: 'smooth' }) }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pathname, hash])
  return null
}
