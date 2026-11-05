import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Band from '../components/Band'
import { testimonials } from '../data/testimonials'

const ease = [0.16, 1, 0.3, 1] as const

/** Reviews, as a thin panel: a short heading, and one owner message in a rounded card with an arrow on each side. Nothing moves by itself. */
export default function HomeReviewsClassic() {
  const N = testimonials.length
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const go = (d: number) => { setDir(d); setI((x) => (x + d + N) % N) }
  const t = testimonials[i]
  const view = { once: true, amount: 0.25 } as const

  return (
    <Band id="testimonials" labelledby="testimonials-title">
      <div className="grid gap-6 px-[clamp(20px,3vw,48px)] lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.6fr)] lg:items-center lg:gap-10" onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}>
        <div>
          <motion.p className="pn-eyebrow" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ duration: 0.8, ease }}>Clients Love Our Work</motion.p>
          <motion.h2 id="testimonials-title" className="pn-title mt-3" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.1, ease }}>
            Trusted by homeowners<br />across Tamilnadu.
          </motion.h2>
        </div>

        <div className="flex items-center gap-3" role="group" aria-roledescription="carousel" aria-label="Owner messages" tabIndex={0}>
          <button onClick={() => go(-1)} aria-label="Previous message" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-[#ece8df] transition-all hover:border-[#d4b483] hover:text-[#d4b483]"><ChevronLeft size={17} /></button>
          <div className="pn-card relative min-h-[8.5rem] flex-1 overflow-hidden px-5 py-5 sm:px-7">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.figure
                key={i}
                custom={dir}
                variants={{ enter: (d: number) => ({ opacity: 0, x: 40 * d }), center: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: -40 * d }) }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease }}
                className="flex items-center gap-4 sm:gap-6"
              >
                <Quote size={36} strokeWidth={1.2} className="hidden shrink-0 text-[#d4b483] sm:block" aria-hidden="true" />
                <blockquote className="flex-1 text-[0.86rem] leading-relaxed text-[#e4e0d8]">“{t.quote}”</blockquote>
                <figcaption className="flex shrink-0 items-center gap-3 border-l border-white/10 pl-4 sm:pl-6">
                  <span className="text-right leading-tight"><span className="block text-[0.8rem] text-white">{t.name}</span><span className="block text-[0.68rem] text-[#8f8c85]">{t.detail}</span></span>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#e6d0a8] to-[#a98652] text-[1.05rem] font-semibold text-[#1a1206]" aria-hidden="true">{t.name.charAt(0)}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5" aria-hidden="true">
              {testimonials.map((_, k) => <span key={k} className={`h-1 rounded-full transition-all duration-500 ${k === i ? 'w-5 bg-[#d4b483]' : 'w-1 bg-white/25'}`} />)}
            </div>
          </div>
          <button onClick={() => go(1)} aria-label="Next message" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-[#ece8df] transition-all hover:border-[#d4b483] hover:text-[#d4b483]"><ChevronRight size={17} /></button>
        </div>
      </div>
    </Band>
  )
}
