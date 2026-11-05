import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { whatsappLink } from '../config/company'
import { usePrefersReducedMotion } from '../hooks/useEnv'

/** A round WhatsApp button fixed to the bottom-right of every page, with a soft pulsing halo. It steps aside while the menu is open. */
export default function FloatingWhatsApp() {
  const reduced = usePrefersReducedMotion()
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    const el = document.documentElement
    const read = () => setMenu(el.dataset.menu === 'open')
    const mo = new MutationObserver(read)
    mo.observe(el, { attributes: true, attributeFilter: ['data-menu'] })
    read()
    return () => mo.disconnect()
  }, [])
  const href = whatsappLink('Hello, I would like to discuss building a home.')
  if (!href) return null
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-24 right-4 z-[55] grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full sm:bottom-6 sm:right-6"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={menu ? { opacity: 0, scale: 0.6, pointerEvents: 'none' } : { opacity: 1, scale: 1, pointerEvents: 'auto' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* the halo */}
      <span className="absolute inset-0 rounded-full bg-[#25d366]/12" aria-hidden="true" />
      {!reduced && <span className="absolute inset-2 animate-ping rounded-full bg-[#25d366]/25 [animation-duration:2.6s]" aria-hidden="true" />}
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_14px_34px_-10px_rgba(37,211,102,0.75)] transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 32 32" className="h-8 w-8" fill="currentColor" aria-hidden="true">
          <path d="M16.04 3C8.84 3 3 8.83 3 16.02c0 2.3.6 4.54 1.74 6.52L3 29l6.64-1.7a13 13 0 0 0 6.4 1.64h.01C23.24 28.94 29 23.1 29 15.92 29 12.45 27.64 9.2 25.2 6.76A12.9 12.9 0 0 0 16.04 3Zm0 23.7h-.01a10.8 10.8 0 0 1-5.5-1.5l-.4-.23-3.94 1.01 1.05-3.84-.26-.4a10.8 10.8 0 0 1-1.66-5.72c0-5.98 4.88-10.84 10.88-10.84 2.9 0 5.63 1.13 7.68 3.18a10.77 10.77 0 0 1 3.18 7.67c0 5.98-4.88 10.67-10.9 10.67Zm5.96-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.74.17s-.85 1.06-1.04 1.28c-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.63-1.62-.97-.87-1.62-1.94-1.81-2.27-.19-.33-.02-.5.14-.66.15-.15.33-.38.5-.57.16-.2.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41s-1.14 1.11-1.14 2.7 1.17 3.13 1.33 3.35c.16.22 2.3 3.5 5.56 4.91.78.33 1.38.53 1.85.68.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.42.19-1.55-.08-.14-.3-.22-.63-.38Z" />
        </svg>
      </span>
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-white/15 bg-[#131315]/90 px-4 py-2 text-sm text-[#ece8df] opacity-0 shadow-xl backdrop-blur transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 sm:block">Chat on WhatsApp</span>
    </motion.a>
  )
}
