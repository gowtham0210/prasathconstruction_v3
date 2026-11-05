import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Band from '../components/Band'
import Still from '../components/Still'
import { testimonials } from '../data/testimonials'
import type { StillId } from '../data/media'

const ease = [0.16, 1, 0.3, 1] as const
/** a photograph of a finished Prasath home beside each message (decorative: the messages carry no project names, so these are not the owners' own homes) */
const photos: StillId[] = ['p-completed-3', 'p-completed-2', 'p-completed-1', 'p-kaveri-aerial', 'p-thendral-solar', 'g-01']

/**
 * Reviews, version 5: photo-led. Each owner message sits beside a large photograph of a finished home that changes with it,
 * and a strip of small photo tiles below lets you jump to any message. Nothing moves by itself and no message is cut short.
 * Earlier versions: HomeReviewsClassic / HomeReviewsGrid / HomeReviewsTabs / HomeReviewsSpotlight (.tsx, same folder).
 */
export default function HomeReviewsPhotos() {
  const N = testimonials.length
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const pick = (n: number) => { const next = (n + N) % N; setDir(next >= i ? 1 : -1); setI(next) }
  const t = testimonials[i]
  const view = { once: true, amount: 0.25 } as const

  return (
    <Band id="testimonials" labelledby="testimonials-title">
      <div className="px-[clamp(20px,3vw,48px)]" onKeyDown={(e) => { if (e.key === 'ArrowRight') pick(i + 1); if (e.key === 'ArrowLeft') pick(i - 1) }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.p className="pn-eyebrow" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ duration: 0.8, ease }}>Clients Love Our Work</motion.p>
            <motion.h2 id="testimonials-title" className="pn-title mt-3" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.1, ease }}>
              Trusted by homeowners<br />across Tamilnadu.
            </motion.h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="mr-1 text-[0.78rem] tabular-nums text-[#8f8c85]" aria-hidden="true">{String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
            <button onClick={() => pick(i - 1)} aria-label="Previous message" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-[#ece8df] transition-all hover:border-[#d4b483] hover:text-[#d4b483]"><ChevronLeft size={18} /></button>
            <button onClick={() => pick(i + 1)} aria-label="Next message" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-[#ece8df] transition-all hover:border-[#d4b483] hover:text-[#d4b483]"><ChevronRight size={18} /></button>
          </div>
        </div>

        {/* photograph + message */}
        <div className="pn-card mt-6 grid overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]" role="group" aria-roledescription="carousel" aria-label="Owner messages" aria-live="polite" tabIndex={0}>
          <div className="relative h-56 md:h-auto md:min-h-[19rem]">
            <AnimatePresence initial={false}>
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease } }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                className="absolute inset-0"
              >
                <Still id={photos[i % photos.length]} className="h-full w-full !rounded-none" />
              </motion.div>
            </AnimatePresence>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#242427]/70" aria-hidden="true" />
            <span className="absolute bottom-3 left-4 text-[0.66rem] uppercase tracking-[0.22em] text-white/80">A finished Prasath home</span>
          </div>

          <div className="relative flex items-center overflow-hidden px-6 py-8 sm:px-10">
            <Quote size={110} strokeWidth={0.8} className="pointer-events-none absolute -right-2 -top-3 text-[#d4b483]/12" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.figure
                key={i}
                custom={dir}
                variants={{ enter: (d: number) => ({ opacity: 0, x: 36 * d }), center: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: -30 * d }) }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease }}
                className="relative"
              >
                <blockquote className="font-serif text-[clamp(1rem,1.55vw,1.35rem)] leading-[1.6] text-[#f1ede4]">“{t.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#e6d0a8] to-[#a98652] text-[1.05rem] font-semibold text-[#1a1206]" aria-hidden="true">{t.name.charAt(0)}</span>
                  <span className="leading-tight"><span className="block text-[0.85rem] text-white">{t.name}</span>{t.detail && <span className="block text-[0.7rem] text-[#8f8c85]">{t.detail}</span>}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>

        {/* photo tiles: one per message */}
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6" role="tablist" aria-label="Choose an owner">
          {testimonials.map((o, k) => (
            <button
              key={o.name + k}
              role="tab"
              aria-selected={k === i}
              aria-label={`Show ${o.name}`}
              onClick={() => pick(k)}
              className={`group relative aspect-[16/10] overflow-hidden rounded-xl border transition-all duration-300 ${k === i ? 'border-[#d4b483]' : 'border-white/10 opacity-70 hover:opacity-100'}`}
            >
              <Still id={photos[k % photos.length]} className="h-full w-full !rounded-none" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
              <span className="absolute inset-x-2 bottom-1.5 truncate text-left text-[0.68rem] text-white">{o.name}</span>
            </button>
          ))}
        </div>
      </div>
    </Band>
  )
}
