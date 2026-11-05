import { useEffect, useState } from 'react'
import Band from '../components/Band'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import { Reveal, RevealWords } from '../components/Reveal'
import { company } from '../config/company'
import { videos } from '../data/prasath'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useEnv'

const ease = [0.16, 1, 0.3, 1] as const
const CYCLE = 5000
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hq720.jpg`

/**
 * Hear from our owners: the vertical videos (YouTube Shorts) from owners' homes, as a ring of tall cards. The one in the middle plays
 * quietly on a loop; click it for sound in a larger window, or click a card beside it to bring it forward. Pointing at it, or the pause button, stops the turning.
 */
export default function HomeOwners() {
  const N = videos.length
  const [a, setA] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hold, setHold] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const reduced = usePrefersReducedMotion()
  const mobile = useIsMobile()
  const W = mobile ? 200 : 244
  const H = Math.round((W * 16) / 9)
  const step = W * 0.82
  const go = (n: number) => setA(((n % N) + N) % N)

  // turn on its own, slowly; pointing at the ring, the pause button, or an open video stops it
  useEffect(() => {
    if (reduced || !playing || hold || open) return
    const t = setTimeout(() => go(a + 1), CYCLE)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, playing, hold, open, reduced])

  // the large window: Escape closes it
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const offsetOf = (i: number) => {
    let o = i - a
    if (o > N / 2) o -= N
    if (o < -N / 2) o += N
    return o
  }
  const reach = mobile ? 1 : 3

  return (
    <Band id="stories" tone="light" next="dark" labelledby="stories-title" className="">
      <div className="relative px-[clamp(20px,3vw,48px)] text-center">
        <Reveal>
          <p className="inline-flex items-center gap-4"><span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4b483]/70 sm:w-16" aria-hidden="true" /><span className="pn-eyebrow">Hear from our owners</span><span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4b483]/70 sm:w-16" aria-hidden="true" /></p>
        </Reveal>
        <h2 id="stories-title" className="display mt-4 text-[clamp(1.9rem,3.2vw,3rem)] !leading-[1.06]" aria-label="Real homes. Real stories.">
          <RevealWords as="span" lines={['Real homes. Real stories.']} italic={['stories.']} stagger={0.08} />
        </h2>
        <Reveal delay={0.1} className="mx-auto mt-3 max-w-md text-[0.92rem] leading-relaxed text-[#a9a6a0]">Watch our work on site, and hear from the people we build for.</Reveal>
        {company.social.youtube && (
          <Reveal delay={0.15} className="mt-6">
            <a href={company.social.youtube} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.04] py-2 pl-2 pr-5 text-sm font-medium text-[#ece8df] transition-all duration-300 hover:border-[#ff5a4a]/70 hover:shadow-[0_14px_34px_-14px_rgba(255,80,60,0.7)]">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ff0000] text-white transition-transform duration-300 group-hover:scale-110"><svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8C22 15.2 22 12 22 12s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" /></svg></span>
              Subscribe on YouTube
            </a>
          </Reveal>
        )}
      </div>

      <Reveal y={60} className="mt-8">
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Owner videos"
          className="relative mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
          style={{ height: H + 70 }}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHold(true)}
          onPointerLeave={(e) => e.pointerType === 'mouse' && setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={() => setHold(false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(a + 1)
            if (e.key === 'ArrowLeft') go(a - 1)
          }}
        >
          <span className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-[60%] -translate-x-1/2 rounded-[50%] bg-[#ff8a30]/25 blur-3xl" aria-hidden="true" /><span className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4b483]/10 blur-[90px]" aria-hidden="true" />
          {videos.map((v, i) => {
            const o = offsetOf(i)
            const n = Math.abs(o)
            const front = o === 0
            const shown = n <= reach
            return (
              <motion.div
                key={v.id}
                className="absolute left-1/2 top-4"
                style={{ width: W, height: H, marginLeft: -W / 2, pointerEvents: shown ? 'auto' : 'none' }}
                initial={false}
                animate={{ x: o * step, scale: front ? 1 : 0.88 - (n - 1) * 0.06, opacity: shown ? (front ? 1 : 0.85 - (n - 1) * 0.22) : 0, zIndex: 10 - n }}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 22 }}
              >
                <button
                  onClick={() => (front ? setOpen(v.id) : go(i))}
                  className={`group relative block h-full w-full overflow-hidden rounded-[26px] border bg-[#19191c] text-left transition-shadow duration-700 ${front ? 'border-[#d4b483]/60 shadow-[0_40px_90px_-30px_rgba(212,180,131,0.5)]' : 'border-white/10'}`}
                  aria-label={front ? `Play with sound: ${v.title}` : `Bring forward: ${v.title}`}
                  aria-hidden={!shown}
                  tabIndex={shown ? 0 : -1}
                >
                  <img src={thumb(v.id)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]" />
                  {front && !reduced && (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&mute=1&loop=1&playlist=${v.id}&controls=0&playsinline=1&rel=0&modestbranding=1`}
                      title={v.title}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      loading="lazy"
                    />
                  )}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/0" />
                  {!front && (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-[#d4b483] text-[#1a1206] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-110"><Play size={20} fill="currentColor" className="translate-x-0.5" aria-hidden="true" /></span>
                    </span>
                  )}
                  {front && (
                    <span className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[0.68rem] font-semibold text-white backdrop-blur-md">Tap for sound</span>
                  )}
                  <span className="pointer-events-none absolute inset-x-4 bottom-4 line-clamp-2 text-[0.85rem] font-medium leading-snug text-white">{v.title}</span>
                </button>
              </motion.div>
            )
          })}
        </div>

        <div className="container-x mt-6 flex items-center justify-center gap-4">
          <button onClick={() => go(a - 1)} aria-label="Previous video" className="grid h-12 w-12 place-items-center rounded-full border border-white/30 transition-all hover:-translate-x-0.5 hover:border-[#d4b483] hover:bg-[#d4b483]/15 hover:text-[#d4b483]"><ChevronLeft size={19} strokeWidth={1.7} /></button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose a video">
            {videos.map((v, i) => (
              <button key={v.id} role="tab" aria-selected={i === a} aria-label={`Show ${v.title}`} onClick={() => go(i)} className="grid h-6 place-items-center px-0.5">
                <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === a ? 'w-9 bg-[#d4b483]' : 'w-1.5 bg-white/25 hover:bg-white/50'}`} />
              </button>
            ))}
          </div>
          <button onClick={() => go(a + 1)} aria-label="Next video" className="grid h-12 w-12 place-items-center rounded-full border border-white/30 transition-all hover:translate-x-0.5 hover:border-[#d4b483] hover:bg-[#d4b483]/15 hover:text-[#d4b483]"><ChevronRight size={19} strokeWidth={1.7} /></button>
          {!reduced && (
            <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Stop the carousel turning on its own' : 'Let the carousel turn on its own'} aria-pressed={!playing} className="ml-2 grid h-12 w-12 place-items-center rounded-full border border-white/30 transition-colors hover:border-[#d4b483] hover:bg-[#d4b483]/15 hover:text-[#d4b483]">
              {playing ? <Pause size={17} strokeWidth={1.8} /> : <Play size={17} strokeWidth={1.8} fill="currentColor" />}
            </button>
          )}
        </div>
      </Reveal>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Owner video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div className="relative aspect-[9/16] w-full max-w-[380px] overflow-hidden rounded-[28px] bg-black shadow-2xl" initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.86, opacity: 0 }} transition={{ type: 'spring', damping: 22, stiffness: 260 }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setOpen(null)} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80" aria-label="Close video" autoFocus><X size={19} /></button>
              <iframe src={`https://www.youtube-nocookie.com/embed/${open}?autoplay=1&mute=0&playsinline=1&rel=0`} title="Owner video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="h-full w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Band>
  )
}
