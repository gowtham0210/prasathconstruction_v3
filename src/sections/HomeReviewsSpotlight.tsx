import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Band from '../components/Band'
import { testimonials } from '../data/testimonials'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Reviews, version 4: a centred spotlight. Heading in the middle, one owner message set large beneath it,
 * and a row of owner avatars under that (the chosen one is larger and gold-ringed), with an arrow on each side.
 * Nothing moves by itself and no message is cut short.
 * Earlier versions: HomeReviewsClassic.tsx (thin panel), HomeReviewsGrid.tsx (three cards), HomeReviewsTabs.tsx (list + quote).
 */
export default function HomeReviewsSpotlight() {
  const N = testimonials.length
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const pick = (n: number) => { const next = (n + N) % N; setDir(next >= i ? 1 : -1); setI(next) }
  const t = testimonials[i]
  const view = { once: true, amount: 0.25 } as const

  return (
    <Band id="testimonials" labelledby="testimonials-title">
      <div className="px-[clamp(20px,3vw,48px)] text-center" onKeyDown={(e) => { if (e.key === 'ArrowRight') pick(i + 1); if (e.key === 'ArrowLeft') pick(i - 1) }}>
        <motion.p className="pn-eyebrow" initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.8, ease }}>Clients Love Our Work</motion.p>
        <motion.h2 id="testimonials-title" className="pn-title mt-3" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.1, ease }}>
          Trusted by homeowners across Tamilnadu.
        </motion.h2>

        <div className="mx-auto mt-6 flex max-w-4xl items-center gap-3 sm:gap-5" role="group" aria-roledescription="carousel" aria-label="Owner messages" tabIndex={0}>
          <button onClick={() => pick(i - 1)} aria-label="Previous message" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 text-[#ece8df] transition-all hover:border-[#d4b483] hover:text-[#d4b483]"><ChevronLeft size={18} /></button>
          <div className="relative min-w-0 flex-1 overflow-hidden" aria-live="polite">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.figure
                key={i}
                custom={dir}
                variants={{ enter: (d: number) => ({ opacity: 0, x: 40 * d }), center: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: -40 * d }) }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease }}
                className="flex flex-col items-center"
              >
                <Quote size={30} strokeWidth={1.2} className="text-[#d4b483]" aria-hidden="true" />
                <blockquote className="mt-3 font-serif text-[clamp(1rem,1.6vw,1.4rem)] leading-[1.55] text-[#f1ede4]">“{t.quote}”</blockquote>
                <figcaption className="mt-4 leading-tight">
                  <span className="block text-[0.85rem] text-white">{t.name}</span>
                  {t.detail && <span className="mt-0.5 block text-[0.7rem] text-[#8f8c85]">{t.detail}</span>}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <button onClick={() => pick(i + 1)} aria-label="Next message" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 text-[#ece8df] transition-all hover:border-[#d4b483] hover:text-[#d4b483]"><ChevronRight size={18} /></button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2.5" role="tablist" aria-label="Choose an owner">
          {testimonials.map((o, k) => (
            <button
              key={o.name + k}
              role="tab"
              aria-selected={k === i}
              aria-label={`Show ${o.name}`}
              onClick={() => pick(k)}
              className={`grid place-items-center rounded-full font-semibold transition-all duration-300 ${k === i ? 'h-12 w-12 bg-gradient-to-br from-[#e6d0a8] to-[#a98652] text-[1.05rem] text-[#1a1206] ring-2 ring-[#d4b483] ring-offset-2 ring-offset-[#14120e]' : 'h-9 w-9 bg-white/10 text-[0.85rem] text-[#ece8df] opacity-70 hover:opacity-100'}`}
            >
              {o.name.charAt(0)}
            </button>
          ))}
        </div>
      </div>
    </Band>
  )
}
