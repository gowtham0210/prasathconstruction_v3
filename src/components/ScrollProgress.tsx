import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/smooth'
import { usePrefersReducedMotion } from '../hooks/useEnv'

/** A hairline at the very top of the page that fills as you read down it. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  useLayoutEffect(() => {
    if (reduced || !bar.current) return
    const t = gsap.to(bar.current, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    })
    return () => {
      t.scrollTrigger?.kill()
      t.kill()
    }
  }, [reduced])
  if (reduced) return null
  return <div ref={bar} className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#a98652] via-[#ff9a3c] to-[#f1e4cc] shadow-[0_0_12px_rgba(255,150,60,0.7)]" style={{ transform: 'scaleX(0)' }} aria-hidden="true" />
}
