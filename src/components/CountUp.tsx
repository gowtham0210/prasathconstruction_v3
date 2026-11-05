import { useEffect, useRef } from 'react'
import { animate, useInView } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/useEnv'

/** A number that counts up from zero the first time it scrolls into view. */
export default function CountUp({ to, suffix = '', decimals = 0, className = '' }: { to: number; suffix?: string; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = usePrefersReducedMotion()
  const show = (v: number) => v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    if (reduced) {
      el.textContent = show(to)
      return
    }
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => (el.textContent = show(v)) })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, reduced])
  return <span ref={ref} className={className}>{reduced ? show(to) : show(0)}</span>
}
