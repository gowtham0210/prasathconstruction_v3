import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import Band from '../components/Band'
import { testimonials } from '../data/testimonials'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Reviews, version 3: a list of owners on the left (pick one), and that owner's message set large on the right.
 * Nothing moves by itself and no message is cut short.
 * Earlier versions are kept in HomeReviewsClassic.tsx (one message in a thin panel) and HomeReviewsGrid.tsx (three cards).
 */
export default function HomeReviewsTabs() {
  const N = testimonials.length
  const [i, setI] = useState(0)
  const t = testimonials[i]
  const view = { once: true, amount: 0.25 } as const
  const pick = (n: number) => setI((n + N) % N)

  return (
    <Band id="testimonials" labelledby="testimonials-title">
      <div className="px-[clamp(20px,3vw,48px)]" onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') pick(i + 1); if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') pick(i - 1) }}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <motion.p className="pn-eyebrow" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ duration: 0.8, ease }}>Clients Love Our Work</motion.p>
            <motion.h2 id="testimonials-title" className="pn-title mt-3" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.1, ease }}>
              Trusted by homeowners<br />across Tamilnadu.
            </motion.h2>
          </div>
          <span className="text-[0.78rem] tabular-nums text-[#8f8c85]" aria-hidden="true">{String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:gap-8">
          {/* who: one row per owner (a scrolling strip on a phone) */}
          <div role="tablist" aria-label="Choose an owner" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {testimonials.map((o, k) => (
              <button
                key={o.name + k}
                role="tab"
                aria-selected={k === i}
                onClick={() => pick(k)}
                className={`flex shrink-0 items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all duration-300 ${k === i ? 'border-[#d4b483] bg-[#d4b483]/10' : 'border-white/10 hover:border-white/30'}`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.95rem] font-semibold ${k === i ? 'bg-gradient-to-br from-[#e6d0a8] to-[#a98652] text-[#1a1206]' : 'bg-white/10 text-[#ece8df]'}`} aria-hidden="true">{o.name.charAt(0)}</span>
                <span className="leading-tight">
                  <span className={`block text-[0.8rem] ${k === i ? 'text-white' : 'text-[#cfcbc2]'}`}>{o.name}</span>
                  {o.detail && <span className="block text-[0.68rem] text-[#8f8c85]">{o.detail}</span>}
                </span>
              </button>
            ))}
          </div>

          {/* what they said */}
          <div className="pn-card relative flex min-h-[15rem] items-center overflow-hidden px-6 py-8 sm:px-10" role="tabpanel" aria-live="polite">
            <Quote size={120} strokeWidth={0.8} className="pointer-events-none absolute -left-2 -top-3 text-[#d4b483]/15" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
                className="relative"
              >
                <blockquote className="font-serif text-[clamp(1.05rem,1.7vw,1.5rem)] leading-[1.55] text-[#f1ede4]">“{t.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 text-[0.8rem]">
                  <span className="h-px w-8 bg-[#d4b483]" aria-hidden="true" />
                  <span className="text-white">{t.name}</span>
                  {t.detail && <span className="text-[#8f8c85]">· {t.detail}</span>}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Band>
  )
}
