import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import Still from '../components/Still'
import type { StillId } from '../data/media'
import { timeline } from '../data/prasath'

/** the photographs on the cards at the right, as they were */
const cardImages: StillId[] = ['g-10', 'p-completed-2', 'p-interior', 'g-08', 'p-completed-3']
/** the film stage at the left */
const photos = ['/images/journey-1.webp', '/images/journey-2.webp', '/images/journey-3.webp', '/images/journey-4.webp', '/images/journey-5.webp']
const alts = ['Three architects planning the layout on an empty plot at sunrise', 'A family receiving the keys to their finished home', 'A design studio table with material samples and a furnished room beyond', 'A site inspector checking reinforcement on an organised construction site', 'Finished homes in a Tamilnadu neighbourhood at golden hour']
const ease = [0.16, 1, 0.3, 1] as const
const serif = { fontFamily: 'var(--font-display)' }

/** Each photograph gets its own camera move, so the stage feels like footage: a slow push, a drift left or right, a rise. */
const moves = [
  { x: ['-3%', '3%'], y: ['1%', '-1%'], s: [1.12, 1.2] },
  { x: ['3%', '-2%'], y: ['0%', '-2%'], s: [1.1, 1.22] },
  { x: ['-2%', '3%'], y: ['2%', '-1%'], s: [1.12, 1.18] },
  { x: ['2%', '-3%'], y: ['-1%', '2%'], s: [1.14, 1.22] },
  { x: ['0%', '0%'], y: ['3%', '-3%'], s: [1.1, 1.2] },
]

/**
 * The picture beside the story, made to feel like film: each milestone's photograph is wiped in from the left (the one before stays under it
 * and fades), then it keeps moving with its own slow camera drift. A light sweeps over the lens now and then, a vignette closes the edges,
 * and a clock of years runs along the bottom.
 */
function JourneyFrames({ active }: { active: number }) {
  const still = !!useReducedMotion()
  const m = moves[active % moves.length]
  return (
    <div className="relative mx-auto aspect-[16/9] w-full max-w-[40rem] overflow-hidden rounded-[22px] border border-white/12 bg-[#0e0e10] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]">
      <AnimatePresence initial={false}>
        <motion.img
          key={active}
          src={photos[active]}
          alt={alts[active]}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ clipPath: 'inset(0 100% 0 0)', scale: 1.4, x: '6%', y: 0, filter: 'brightness(1.5) blur(6px)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)', scale: still ? 1.1 : m.s, x: still ? '0%' : m.x, y: still ? '0%' : m.y, filter: 'brightness(1) blur(0px)' }}
          exit={{ opacity: 0, transition: { duration: 1.4, delay: 0.5 } }}
          transition={{ clipPath: { duration: 1.2, ease }, filter: { duration: 1.4, ease }, scale: { duration: still ? 0 : 12, ease: 'linear' }, x: { duration: still ? 0 : 12, ease: 'linear' }, y: { duration: still ? 0 : 12, ease: 'linear' } }}
        />
      </AnimatePresence>
      {/* a vignette, and a soft light that slides across the lens */}
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.55))]" />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />
      {!still && <motion.span key={`sweep-${active}`} className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-[#f1e4cc]/25 to-transparent" initial={{ x: '0%' }} animate={{ x: '700%' }} transition={{ duration: 1.8, delay: 0.5, ease: 'easeInOut' }} aria-hidden="true" />}
      {/* the year, like a timecode, and the caption */}
      <span className="pointer-events-none absolute left-4 top-3.5 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[0.7rem] tracking-[0.2em] text-[#f1e4cc] backdrop-blur-md">
        <span className="relative grid h-2 w-2 place-items-center"><span className="absolute inset-0 animate-ping rounded-full bg-[#ff9a3c]/70" /><span className="h-1.5 w-1.5 rounded-full bg-[#ff9a3c]" /></span>
        <motion.span key={timeline[active].year} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>{timeline[active].year}</motion.span>
      </span>
      <span className="pointer-events-none absolute inset-x-4 bottom-3.5 block">
        <motion.span key={timeline[active].title} className="block text-[1.05rem] text-[#f1e4cc]" style={serif} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease }}>{timeline[active].title}</motion.span>
      </span>
    </div>
  )
}

export default function AboutJourney() {
  const still = !!useReducedMotion()
  const wrap = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start 45%', 'end 85%'] })
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })
  const lineH = useTransform(grow, [0, 1], ['0%', '100%'])
  const N = timeline.length
  // the first milestone at the very start and the last at the very end, whatever the card positions
  useMotionValueEvent(scrollYProgress, 'change', (p) => { if (p <= 0.03) setActive(0); else if (p >= 0.97) setActive(N - 1) })

  return (
    <section id="about-journey" className="relative py-[clamp(48px,8vh,96px)]" aria-label="Our journey">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-16">
          {/* left: the heading and a tower that grows with the story (sticky on laptops) */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)] lg:self-start">
            <div className="flex h-full flex-col">
              <motion.p className="pn-eyebrow" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>Our journey</motion.p>
              <motion.h2 className="mt-3 text-[clamp(2rem,3.6vw,3.4rem)] !leading-[1.05]" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1, ease }}>
                Ten years.<br /><span className="accent-word">One obsession.</span>
              </motion.h2>
              <div className="relative mt-6 hidden min-h-0 flex-1 lg:block">
                <JourneyFrames active={active} />
              </div>
              <div className="mt-4 hidden items-end justify-between lg:flex">
                <div>
                  <p className="text-[clamp(3rem,5vw,4.6rem)] leading-none text-[#d4b483]" style={serif}>
                    <motion.span key={timeline[active].year} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="inline-block">{timeline[active].year}</motion.span>
                  </p>
                  <p className="mt-1 text-sm text-[#a9a6a0]">{String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* right: the milestones, joined by a line that draws itself as you scroll */}
          <div ref={wrap} className="relative">
            <span className="absolute bottom-0 left-[15px] top-0 w-px bg-white/10 sm:left-[19px]" aria-hidden="true" />
            <motion.span className="absolute left-[14px] top-0 w-[3px] origin-top rounded-full bg-gradient-to-b from-[#e6d0a8] via-[#d4b483] to-[#a98652] shadow-[0_0_16px_rgba(212,180,131,0.7)] sm:left-[18px]" style={{ height: still ? '100%' : lineH }} aria-hidden="true" />
            <ol className="space-y-[clamp(40px,10vh,110px)]">
              {timeline.map((t, i) => {
                const on = i <= active
                return (
                  <motion.li key={t.year} className="relative pl-12 sm:pl-16" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1, ease }}>
                    <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0" viewport={{ margin: '-47% 0px -47% 0px' }} onViewportEnter={() => setActive(i)} />
                    {/* the node on the line */}
                    <span className="absolute left-0 top-3 grid h-8 w-8 place-items-center sm:h-10 sm:w-10" aria-hidden="true">
                      <span className={`absolute inset-0 rounded-full border transition-all duration-700 ${on ? 'border-[#d4b483] bg-[#d4b483]/15' : 'border-white/20'}`} />
                      {!still && on && i === active && <span className="absolute inset-0 animate-ping rounded-full border border-[#d4b483]/60" />}
                      <span className={`h-2.5 w-2.5 rounded-full transition-colors duration-700 ${on ? 'bg-[#d4b483]' : 'bg-white/30'}`} />
                    </span>
                    <div className="group relative grid gap-5 overflow-hidden rounded-[26px] border border-white/10 bg-[#1b1b1d]/80 p-4 backdrop-blur-sm transition-colors duration-500 hover:border-[#d4b483]/50 sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-center">
                      <span className="pointer-events-none absolute -right-2 -top-6 select-none text-[clamp(5rem,11vw,9rem)] font-semibold leading-none text-transparent" style={{ WebkitTextStroke: '1.2px rgba(212,180,131,0.22)', ...serif }} aria-hidden="true">{t.year}</span>
                      <div className="relative order-2 px-1 md:order-1 md:px-3">
                        <p className="text-[0.66rem] uppercase tracking-[0.3em] text-[#9b9890]">{String(i + 1).padStart(2, '0')} — {t.year}</p>
                        <h3 className="mt-2 text-[clamp(1.35rem,2vw,1.85rem)] leading-tight text-[#f1ede4]" style={serif}>{t.title}</h3>
                        <p className="mt-2.5 text-[0.92rem] leading-relaxed text-[#b0ada6]">{t.text}</p>
                      </div>
                      <div className="relative order-1 aspect-[16/10] overflow-hidden rounded-[18px] md:order-2">
                        <Still id={cardImages[i]} className="h-full w-full !rounded-none transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.08]" />
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                      </div>
                    </div>
                  </motion.li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
