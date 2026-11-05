import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Band from '../components/Band'
import { testimonials } from '../data/testimonials'
import { useIsMobile } from '../hooks/useEnv'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Reviews, version 2: a heading with arrows on the left, and three owner messages side by side as tall cards (one on a phone).
 * The arrows move the row one message at a time. Nothing moves by itself, and no message is cut short.
 * The first version (one message in a thin panel) is kept in HomeReviewsClassic.tsx.
 */
export default function HomeReviewsGrid() {
  const N = testimonials.length
  const mobile = useIsMobile()
  const shown = mobile ? 1 : Math.min(3, N)
  const [start, setStart] = useState(0)
  const [dir, setDir] = useState(1)
  const last = Math.max(0, N - shown)
  useEffect(() => setStart((s) => Math.min(s, last)), [last])
  const go = (d: number) => {
    const next = Math.min(last, Math.max(0, start + d))
    if (next === start) return
    setDir(d)
    setStart(next)
  }
  const view = { once: true, amount: 0.25 } as const

  return (
    <Band id="testimonials" labelledby="testimonials-title">
      <div className="grid gap-8 px-[clamp(20px,3vw,48px)] lg:grid-cols-[minmax(0,0.7fr)_minmax(0,2.3fr)] lg:items-center lg:gap-10" onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}>
        <div>
          <motion.p className="pn-eyebrow" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ duration: 0.8, ease }}>Clients Love Our Work</motion.p>
          <motion.h2 id="testimonials-title" className="pn-title mt-3" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.1, ease }}>
            Trusted by homeowners<br />across Tamilnadu.
          </motion.h2>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => go(-1)} disabled={start === 0} aria-label="Previous messages" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-[#ece8df] transition-all hover:border-[#d4b483] hover:text-[#d4b483] disabled:pointer-events-none disabled:opacity-35"><ChevronLeft size={18} /></button>
            <button onClick={() => go(1)} disabled={start === last} aria-label="Next messages" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-[#ece8df] transition-all hover:border-[#d4b483] hover:text-[#d4b483] disabled:pointer-events-none disabled:opacity-35"><ChevronRight size={18} /></button>
            <span className="ml-2 text-[0.78rem] tabular-nums text-[#8f8c85]" aria-hidden="true">{String(start + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
          </div>
        </div>

        <div role="group" aria-roledescription="carousel" aria-label="Owner messages" aria-live="polite" tabIndex={0}>
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={start}
              custom={dir}
              initial={{ opacity: 0, x: 40 * dir }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.55, ease } }}
              exit={{ opacity: 0, x: -30 * dir, transition: { duration: 0.2 } }}
              className="grid items-stretch gap-4 min-[821px]:grid-cols-3"
            >
              {testimonials.slice(start, start + shown).map((t, k) => (
                <figure key={t.name + k} className="pn-card relative flex flex-col justify-between gap-5 px-5 pb-5 pt-6 sm:px-6">
                  <Quote size={28} strokeWidth={1.2} className="text-[#d4b483]" aria-hidden="true" />
                  <blockquote className="flex-1 text-[0.86rem] leading-relaxed text-[#e4e0d8]">“{t.quote}”</blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-white/10 pt-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#e6d0a8] to-[#a98652] text-[1rem] font-semibold text-[#1a1206]" aria-hidden="true">{t.name.charAt(0)}</span>
                    <span className="leading-tight"><span className="block text-[0.8rem] text-white">{t.name}</span><span className="block text-[0.68rem] text-[#8f8c85]">{t.detail}</span></span>
                  </figcaption>
                </figure>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Band>
  )
}
