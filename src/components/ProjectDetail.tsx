import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Home, Layers, MapPin, Maximize2, MessageCircle, Phone, Ruler, X } from 'lucide-react'
import { getProject, projects } from '../data/projects'
import Still from './Still'
import Lightbox from './Lightbox'
import { company, whatsappLink } from '../config/company'
import { GALLERY_CAPTIONS, type StillId } from '../data/media'
import { startScroll, stopScroll, scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'
import { LogoMark } from './Logo'
import { usePrefersReducedMotion } from '../hooks/useEnv'

interface Props {
  slug: string
  onClose: (returnTo?: string) => void
  onOpen: (slug: string) => void
}

const ease = [0.16, 1, 0.3, 1] as const
const num = (s: string) => Number(s.replace(/[^\d.]/g, '')) || 0
/** "4,800 sq.ft built-up" → 4800 */
const sqft = (s: string) => num(s.split(' ')[0].replace(/,/g, ''))

/** A number that counts up from zero the first time it scrolls into view. */
function CountUp({ to, suffix = '', className = '' }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    if (reduced) {
      el.textContent = to.toLocaleString('en-IN') + suffix
      return
    }
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => (el.textContent = Math.round(v).toLocaleString('en-IN') + suffix) })
    return () => c.stop()
  }, [inView, to, suffix, reduced])
  return <span ref={ref} className={className}>{reduced ? to.toLocaleString('en-IN') + suffix : '0' + suffix}</span>
}

/** Words that rise out of a mask one after another. */
function RiseWords({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i, all) => (
        <span key={i} aria-hidden="true">
          <span className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] align-bottom">
            <motion.span className={`inline-block ${i === all.length - 1 && all.length > 1 ? 'accent-word' : ''}`} initial={{ y: '115%', rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 1.2, ease, delay: delay + i * 0.09 }}>
              {w}
            </motion.span>
          </span>
          {i < all.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

/** photographs of finished homes and work on site, shown as a strip near the end of every project page */
const siteStrip = ['p-completed-3', 'p-thendral-solar', 'g-06', 'g-01', 'g-24', 'g-45', 'g-31', 'p-kaveri-aerial']
const sections = [
  { id: 'pd-overview', label: 'Overview' },
  { id: 'pd-photo', label: 'Photograph' },
  { id: 'pd-process', label: 'Process' },
  { id: 'pd-sites', label: 'From our sites' },
  { id: 'pd-more', label: 'More projects' },
  { id: 'pd-enquire', label: 'Enquire' },
]

/** Leans toward the pointer in 3D, with a soft light that follows it. Mouse only; touch and reduced motion see a plain card. */
function Tilt({ children, className = '', max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 160, damping: 18 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 160, damping: 18 })
  const glow = useTransform([x, y], ([a, b]: number[]) => `radial-gradient(320px circle at ${(a + 0.5) * 100}% ${(b + 0.5) * 100}%, rgba(255,255,255,0.55), transparent 60%)`)
  return (
    <motion.div
      className={`relative ${className}`}
      style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width - 0.5)
        y.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
      {!reduced && <motion.span className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light" style={{ background: glow }} aria-hidden="true" />}
    </motion.div>
  )
}

/** A paragraph whose words brighten one after another as you scroll it into the middle of the screen. */
function ReadWords({ text, container, className = '' }: { text: string; container: RefObject<HTMLElement | null>; className?: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ container, target: ref, offset: ['start 88%', 'end 58%'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} w={w} i={i} n={words.length} progress={scrollYProgress} still={reduced} />
      ))}
    </p>
  )
}
function Word({ w, i, n, progress, still }: { w: string; i: number; n: number; progress: ReturnType<typeof useScroll>['scrollYProgress']; still: boolean }) {
  const opacity = useTransform(progress, [i / n, Math.min(1, (i + 3) / n)], [0.22, 1])
  return (
    <motion.span style={still ? undefined : { opacity }} aria-hidden="true">
      {w}{' '}
    </motion.span>
  )
}

/** drifting motes in the hero (fixed values so every visit looks the same) */
const motes = [
  { x: 8, s: 3, h: 260, d: 0.2, t: 6 }, { x: 17, s: 2, h: 340, d: 1.6, t: 7.5 }, { x: 26, s: 4, h: 220, d: 0.8, t: 6.5 }, { x: 35, s: 2, h: 300, d: 2.4, t: 8 },
  { x: 44, s: 3, h: 280, d: 1.1, t: 7 }, { x: 53, s: 2, h: 360, d: 3.0, t: 8.5 }, { x: 62, s: 4, h: 240, d: 0.5, t: 6.2 }, { x: 71, s: 3, h: 320, d: 2.0, t: 7.8 },
  { x: 80, s: 2, h: 270, d: 1.4, t: 7.2 }, { x: 89, s: 3, h: 300, d: 2.8, t: 8.2 },
]

const rise = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '0px 0px -12% 0px' }, transition: { duration: 1, ease } }

/** Immersive project page: a parallax hero, count-up facts, a self-drawing process line, the photograph, more projects and an enquiry. */
export default function ProjectDetail({ slug, onClose, onOpen }: Props) {
  const project = getProject(slug)
  const scroller = useRef<HTMLDivElement | null>(null)
  const processList = useRef<HTMLOListElement | null>(null)
  const reduced = usePrefersReducedMotion()
  // the full-screen viewer: which set of photographs (this project's, or the strip from our sites) and which one
  const [lb, setLb] = useState<{ set: 'project' | 'sites'; i: number } | null>(null)
  const zoom = lb !== null
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const photoRef = useRef<HTMLButtonElement | null>(null)
  const [active, setActive] = useState('')
  const number = Math.max(0, projects.findIndex((p) => p.slug === slug)) + 1
  const next = useMemo(() => {
    const i = projects.findIndex((p) => p.slug === slug)
    return projects[(i + 1) % projects.length]
  }, [slug])
  const lbItems = useMemo(() => (lb?.set === 'sites' ? siteStrip : project?.gallery ?? []).map((id) => ({ id: id as StillId, caption: GALLERY_CAPTIONS[id as StillId] ?? project?.name })), [lb?.set, project])
  const others = useMemo(() => projects.filter((p) => p.slug !== slug).slice(0, 4), [slug])

  const { scrollY, scrollYProgress } = useScroll({ container: scroller })
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 })
  const heroY = useTransform(scrollY, [0, 700], [0, reduced ? 0 : 170])
  const heroScale = useTransform(scrollY, [0, 700], [1, reduced ? 1 : 1.12])
  const heroText = useTransform(scrollY, [0, 420], [1, 0])
  const { scrollYProgress: photoP } = useScroll({ container: scroller, target: photoRef, offset: ['start end', 'end start'] })
  const photoY = useTransform(photoP, [0, 1], reduced ? ['0%', '0%'] : ['-9%', '9%'])
  const { scrollYProgress: line } = useScroll({ container: scroller, target: processList, offset: ['start 75%', 'end 55%'] })
  const lineScale = useSpring(line, { stiffness: 120, damping: 26 })

  // own scroll area: pause page scrolling underneath and restore it on close
  useEffect(() => {
    stopScroll()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (!zoom) onClose('projects') }
    }
    window.addEventListener('keydown', onKey)
    scroller.current?.focus()
    return () => {
      document.documentElement.style.overflow = prev
      startScroll()
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, zoom])

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [slug, project])

  // the side rail follows the section that is in view
  useEffect(() => {
    const root = scroller.current
    if (!root) return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { root, rootMargin: '-40% 0px -55% 0px' })
    sections.forEach((x) => {
      const el = document.getElementById(x.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [slug])

  if (!project) {
    return (
      <div className="fixed inset-0 z-[70] grid place-items-center bg-ivory p-8 text-center text-graphite">
        <div>
          <h1 className="font-serif text-4xl">Project not found</h1>
          <button className="btn-primary mt-8" onClick={() => onClose('projects')}>Back to projects</button>
        </div>
      </div>
    )
  }

  const enquire = () => {
    setEnquiryPrefill('House Construction')
    onClose('contact')
    setTimeout(() => scrollToId('contact'), 120)
  }

  const built = sqft(project.builtUp)
  const plot = num(project.specs.find((s) => s.label === 'Plot area')?.value.replace(/,/g, '') ?? '0')
  const portions = project.specs.find((s) => s.label === 'Portions')?.value ?? ''
  const floors = Number(portions.replace(/\D/g, '')) + 1 || 0
  const live = project.category === 'Ongoing'
  const facts = [
    { Icon: Ruler, label: 'Plot area', to: plot, suffix: ' sq.ft' },
    { Icon: Maximize2, label: 'Built-up area', to: built, suffix: ' sq.ft' },
    { Icon: Layers, label: portions ? `Floors (${portions})` : 'Floors', to: floors, suffix: '' },
  ].filter((f) => f.to > 0)

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-y-auto overflow-x-hidden bg-ivory text-graphite outline-none"
      ref={scroller}
      tabIndex={-1}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      exit={{ clipPath: 'inset(100% 0 0 0)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <header className="sticky top-0 z-20 bg-ivory/85 backdrop-blur-md">
        <div className="flex items-center justify-between px-[clamp(20px,4vw,64px)] py-4">
          <button onClick={() => onClose('projects')} className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em]" aria-label="Back to projects">
            <ArrowLeft size={16} strokeWidth={1.4} /> Projects
          </button>
          <span className="hidden items-center gap-3 md:inline-flex"><LogoMark className="h-6 w-6" /><span className="font-serif text-lg uppercase tracking-[0.2em]">{company.name}</span></span>
          <button onClick={() => onClose('projects')} className="grid h-10 w-10 place-items-center rounded-full border border-graphite/25 transition-colors hover:bg-graphite hover:text-white" aria-label="Close project">
            <X size={18} strokeWidth={1.4} />
          </button>
        </div>
        <motion.span className="block h-[3px] origin-left bg-gradient-to-r from-[#8fb3ea] via-olive to-[#ff9a3c]" style={{ scaleX: bar }} aria-hidden="true" />
      </header>

      {/* hero */}
      <div
        className="relative h-[82svh] min-h-[480px] w-full overflow-hidden bg-graphite"
        onPointerMove={(e) => {
          if (reduced || e.pointerType !== 'mouse') return
          const r = e.currentTarget.getBoundingClientRect()
          px.set(-((e.clientX - r.left) / r.width - 0.5) * 36)
          py.set(-((e.clientY - r.top) / r.height - 0.5) * 24)
        }}
      >
        <motion.div className="absolute -inset-x-0 -top-[10%] h-[120%]" style={{ y: heroY, scale: heroScale }}>
          <motion.div className="absolute -inset-[4%]" style={{ x: px, y: py }}>
          <motion.div className="h-full w-full" initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 2.6, ease, delay: 0.3 }}>
            <Still id={project.cover} className="h-full w-full" priority />
          </motion.div>
          </motion.div>
        </motion.div>
        {/* a slow band of light across the photograph, and motes of dust drifting up through it */}
        {!reduced && (
          <>
            <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent" style={{ animation: 'sweep 7s ease-in-out 1.5s infinite' }} aria-hidden="true" />
            {motes.map((m, i) => (
              <motion.span key={i} className="pointer-events-none absolute rounded-full bg-white/70" style={{ left: `${m.x}%`, bottom: '8%', width: m.s, height: m.s, boxShadow: '0 0 8px 2px rgba(255,255,255,0.5)' }} initial={{ y: 0, opacity: 0 }} animate={{ y: -m.h, opacity: [0, 0.9, 0] }} transition={{ duration: m.t, delay: m.d, repeat: Infinity, ease: 'easeOut' }} aria-hidden="true" />
            ))}
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/25 to-graphite/10" />
        <motion.span
          className="pointer-events-none absolute right-[clamp(12px,3vw,56px)] top-24 hidden select-none text-[clamp(7rem,16vw,15rem)] font-semibold leading-none tracking-tighter text-transparent md:block"
          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.35)', opacity: heroText }}
          initial={{ x: 60 }}
          animate={{ x: 0 }}
          transition={{ duration: 1.4, ease, delay: 0.8 }}
          aria-hidden="true"
        >
          {String(number).padStart(2, '0')}
        </motion.span>
        <motion.aside
          className="absolute bottom-14 right-[clamp(20px,4vw,64px)] hidden w-72 rounded-[26px] border border-white/25 bg-white/15 p-5 text-white backdrop-blur-xl xl:block"
          style={{ opacity: heroText }}
          initial={{ y: 50 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 } }}
          aria-label="At a glance"
        >
          <p className="eyebrow text-white/70">At a glance</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3"><Home size={16} strokeWidth={1.7} aria-hidden="true" />{project.category} project</li>
            <li className="flex items-center gap-3"><MapPin size={16} strokeWidth={1.7} aria-hidden="true" />{project.location}</li>
            {built > 0 && <li className="flex items-center gap-3"><Maximize2 size={16} strokeWidth={1.7} aria-hidden="true" />{built.toLocaleString('en-IN')} sq.ft built-up</li>}
            {portions && <li className="flex items-center gap-3"><Layers size={16} strokeWidth={1.7} aria-hidden="true" />{portions} residence</li>}
          </ul>
        </motion.aside>
        <motion.div className="container-x absolute inset-x-0 bottom-0 pb-10 text-white sm:pb-14" style={{ opacity: heroText }}>
          <motion.div className="flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.9 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
              <span className="relative grid h-2 w-2 place-items-center">
                {live && <span className="absolute inset-0 rounded-full bg-[#2fbf71]" style={{ animation: 'pulseRing 1.8s ease-out infinite' }} />}
                <span className={`h-2 w-2 rounded-full ${live ? 'bg-[#2fbf71]' : project.category === 'Completed' ? 'bg-bronze' : 'bg-[#ffb347]'}`} />
              </span>
              {project.category}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium backdrop-blur-md"><MapPin size={14} strokeWidth={1.8} aria-hidden="true" /> {project.location}</span>
          </motion.div>
          <h1 className="display mt-5 text-[clamp(2.6rem,7.4vw,7.2rem)] !leading-[1]">
            <RiseWords text={project.name} delay={0.5} />
          </h1>
          <motion.p className="mt-4 max-w-xl text-[1.05rem] text-white/85" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 1.1 }}>{project.concept}</motion.p>
        </motion.div>
        <motion.span className="absolute bottom-5 right-[clamp(20px,4vw,64px)] hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80 md:inline-flex" style={{ opacity: heroText }} aria-hidden="true">
          Scroll <ArrowDown size={14} style={{ animation: 'bob 2s ease-in-out infinite' }} />
        </motion.span>
      </div>

      {/* facts that count up */}
      <section className="container-x relative z-10 -mt-10 sm:-mt-14" aria-label="Project facts">
        <ul className={`grid gap-4 ${facts.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {facts.map(({ Icon, label, to, suffix }, i) => (
            <motion.li key={label} {...rise} transition={{ duration: 1, ease, delay: i * 0.12 }}>
              <Tilt className="card !rounded-[28px] p-6 sm:p-7">
                <motion.span className="grid h-11 w-11 place-items-center rounded-full bg-olive/10 text-olive" animate={reduced ? undefined : { y: [0, -5, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}><Icon size={20} strokeWidth={1.6} aria-hidden="true" /></motion.span>
                <p className="mt-5 text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-none tracking-tight"><CountUp to={to} suffix={suffix} /></p>
                <p className="mt-2 text-sm font-medium text-ink-2">{label}</p>
              </Tilt>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* overview and details */}
      <div id="pd-overview" className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <motion.p {...rise} className="eyebrow text-olive">Overview</motion.p>
          <motion.p {...rise} transition={{ duration: 1, ease, delay: 0.1 }} className="display mt-6 text-[clamp(1.7rem,3vw,2.7rem)] !leading-[1.15]">{project.concept}.</motion.p>
          <ReadWords text={project.overview} container={scroller} className="mt-8 max-w-2xl text-[1.2rem] leading-[1.7] text-graphite" />
          {plot > 0 && built > 0 && (
            <motion.div {...rise} transition={{ duration: 1, ease, delay: 0.3 }} className="mt-10 max-w-xl space-y-4">
              {[
                { label: 'Plot area', value: plot },
                { label: 'Built-up area', value: built },
              ].map((r, i) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm"><span className="font-medium text-ink-2">{r.label}</span><span className="font-semibold">{r.value.toLocaleString('en-IN')} sq.ft</span></div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-graphite/10">
                    <motion.span className={`block h-full origin-left rounded-full ${i === 0 ? 'bg-gradient-to-r from-[#cfe0f5] to-[#8fb3ea]' : 'bg-gradient-to-r from-[#8fb3ea] to-olive'}`} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease, delay: 0.3 + i * 0.25 }} style={{ width: `${(r.value / Math.max(plot, built)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <motion.div {...rise} className="card !rounded-[28px] p-6 sm:p-8 lg:sticky lg:top-28">
            <p className="eyebrow text-olive">Project details</p>
            <dl className="mt-5 divide-y divide-graphite/10 text-sm">
              {project.specs.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.08 }} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5">
                  <dt className="text-ink-2">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </motion.div>
              ))}
            </dl>
            <button onClick={enquire} className="btn-primary mt-6 w-full justify-center">Enquire about a similar home <ArrowUpRight size={16} strokeWidth={1.5} /></button>
          </motion.div>
        </aside>
      </div>

      {/* the photograph */}
      <div id="pd-photo" className="container-x pb-20 lg:pb-28">
        <motion.p {...rise} className="eyebrow text-olive">Photograph</motion.p>
        <Tilt className="mt-8" max={3}>
          <motion.button
            ref={photoRef}
            initial={{ clipPath: 'inset(14% 10% 14% 10% round 44px)', opacity: 0.4 }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 32px)', opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.5, ease }}
            onClick={() => setLb({ set: 'project', i: 0 })}
            className="group relative block aspect-[4/3] w-full overflow-hidden shadow-[0_40px_90px_-50px_rgba(40,60,110,0.7)] sm:aspect-[16/9]"
            aria-label="View the photograph full size"
          >
            <motion.div className="absolute -inset-y-[10%] inset-x-0" style={{ y: photoY }}>
              <Still id={project.gallery[0]} className="h-full w-full transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]" />
            </motion.div>
            {['left-5 top-5 border-l-2 border-t-2', 'right-5 top-5 border-r-2 border-t-2', 'bottom-5 left-5 border-b-2 border-l-2', 'bottom-5 right-5 border-b-2 border-r-2'].map((c) => (
              <span key={c} className={`pointer-events-none absolute h-8 w-8 border-white/80 opacity-0 transition-all duration-700 group-hover:opacity-100 ${c}`} aria-hidden="true" />
            ))}
            <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100 sm:opacity-100"><Maximize2 size={14} aria-hidden="true" /> View full size</span>
          </motion.button>
        </Tilt>
        {project.gallery.slice(1).map((id, k) => (
          <motion.div key={id} {...rise} className="mt-6 overflow-hidden rounded-[32px]">
            <button type="button" onClick={() => setLb({ set: 'project', i: k + 1 })} className="block aspect-[4/3] w-full cursor-zoom-in sm:aspect-[16/9]" aria-label="View the photograph full size"><Still id={id} className="h-full w-full" /></button>
            <p className="mt-3 text-sm t-muted">Rooftop solar installation.</p>
          </motion.div>
        ))}
      </div>

      {/* how every project is built: a centre line that fills as you scroll, with the steps on either side of it in turn */}
      <div id="pd-process" className="bg-sky-grad py-20 lg:py-28">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <motion.p {...rise} className="eyebrow text-olive">Construction process</motion.p>
            <motion.h2 {...rise} transition={{ duration: 1, ease, delay: 0.1 }} className="display mt-5 text-[clamp(1.9rem,3.4vw,3.2rem)] !leading-[1.05]">How every home is <span className="accent-word">built.</span></motion.h2>
            <motion.p {...rise} transition={{ duration: 1, ease, delay: 0.2 }} className="mx-auto mt-4 max-w-md text-ink-2">Seven milestones, the same fixed-cost process on every project, from the first meeting to the keys.</motion.p>
          </div>
          <div className="relative mx-auto mt-14 max-w-5xl">
            <span className="absolute bottom-0 left-[15px] top-0 w-px -translate-x-1/2 bg-white/12 md:left-1/2" aria-hidden="true" />
            <motion.span className="absolute bottom-0 left-[15px] top-0 w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-[#f1e4cc] via-[#d4b483] to-[#ff9a3c] shadow-[0_0_14px_rgba(212,180,131,0.7)] md:left-1/2" style={{ scaleY: lineScale }} aria-hidden="true" />
            <ol ref={processList} className="relative space-y-6 md:space-y-2">
              {project.process.map((s, i) => {
                const [title, ...rest] = s.split(' — ')
                const right = i % 2 === 1
                return (
                  <li key={s} className="relative pl-12 md:grid md:min-h-[8.5rem] md:grid-cols-2 md:items-center md:pl-0">
                    {/* the stop on the line */}
                    <motion.span className="absolute left-[15px] top-6 z-10 grid h-8 w-8 -translate-x-1/2 place-items-center md:left-1/2 md:top-1/2 md:-translate-y-1/2" initial={{ scale: 0.3, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: '0px 0px -15% 0px' }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} aria-hidden="true">
                      <span className="absolute inset-0 rounded-full border border-[#d4b483]/70 bg-[#131315]" />
                      {!reduced && <span className="absolute inset-0 animate-ping rounded-full border border-[#d4b483]/40 [animation-duration:3s]" />}
                      <span className="relative h-2.5 w-2.5 rounded-full bg-[#d4b483]" />
                    </motion.span>
                    <motion.div
                      className={`card group relative overflow-hidden !rounded-[22px] p-5 sm:p-6 ${right ? 'md:col-start-2 md:ml-14' : 'md:col-start-1 md:mr-14'}`}
                      initial={{ opacity: 0, x: right ? 60 : -60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                      transition={{ duration: 1, ease }}
                      whileHover={reduced ? undefined : { y: -4 }}
                    >
                      {/* a short bridge from the card to the line */}
                      <span className={`pointer-events-none absolute top-1/2 hidden h-px w-14 bg-gradient-to-r md:block ${right ? '-left-14 from-[#d4b483]/60 to-transparent' : '-right-14 from-transparent to-[#d4b483]/60'}`} aria-hidden="true" />
                      <span className="pointer-events-none absolute -right-1 -top-5 select-none text-[5.5rem] font-semibold leading-none text-transparent" style={{ WebkitTextStroke: '1px rgba(212,180,131,0.22)', fontFamily: 'var(--font-display)' }} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <p className="relative text-[0.66rem] uppercase tracking-[0.3em] text-[#9b9890]">Step {String(i + 1).padStart(2, '0')}</p>
                      <h3 className="relative mt-2 text-[1.35rem] leading-tight text-[#f1ede4]" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                      {rest.length > 0 && <p className="relative mt-2 text-[0.92rem] leading-relaxed text-ink-2">{rest.join(' — ')}</p>}
                    </motion.div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* more projects */}
      <div id="pd-sites" className="py-20 lg:py-28">
        <div className="container-x">
          <motion.p {...rise} className="eyebrow text-olive">From our sites</motion.p>
          <motion.h2 {...rise} transition={{ duration: 1, ease, delay: 0.1 }} className="display mt-4 text-[clamp(1.9rem,3.4vw,3.2rem)] !leading-[1.05]">Craft you can <span className="accent-word">see.</span></motion.h2>
          <motion.p {...rise} transition={{ duration: 1, ease, delay: 0.2 }} className="mt-4 max-w-lg text-ink-2">Photographs of finished homes and of work on site, taken across our projects.</motion.p>
        </div>
        <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(20px,4vw,56px)] pb-4" aria-label="Photographs from our sites">
          {siteStrip.map((id, i) => (
            <motion.li key={id} initial={{ opacity: 0, y: 50, rotate: i % 2 ? 1.5 : -1.5 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: '0px 0px -8% 0px' }} transition={{ duration: 1, ease, delay: (i % 4) * 0.08 }} className="w-[72%] shrink-0 snap-start sm:w-[40%] lg:w-[26%]">
              <figure role="button" tabIndex={0} aria-label={`View photograph: ${GALLERY_CAPTIONS[id]}`} onClick={() => setLb({ set: 'sites', i })} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLb({ set: 'sites', i }) } }} className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[28px] shadow-[0_30px_70px_-45px_rgba(40,60,110,0.7)]">
                <Still id={id} className="h-full w-full transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.08]" />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/60 via-transparent to-transparent opacity-80" />
                <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">{GALLERY_CAPTIONS[id]}</figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>
      </div>

      <div id="pd-more" className="container-x py-20 lg:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <motion.p {...rise} className="eyebrow text-olive">More projects</motion.p>
            <motion.h2 {...rise} transition={{ duration: 1, ease, delay: 0.1 }} className="display mt-4 text-[clamp(1.9rem,3.4vw,3.2rem)] !leading-[1.05]">Keep exploring.</motion.h2>
          </div>
          <motion.a {...rise} href="/projects" className="link-line hidden shrink-0 font-medium sm:inline-block" onClick={(e) => { e.preventDefault(); onClose('projects') }}>All projects</motion.a>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {others.map((p, i) => (
            <motion.li key={p.slug} {...rise} transition={{ duration: 1, ease, delay: i * 0.1 }}>
              <Tilt max={6}>
              <button onClick={() => onOpen(p.slug)} className="group block w-full text-left" aria-label={`Open ${p.name}`}>
                <span className="relative block aspect-[4/5] overflow-hidden rounded-[24px] shadow-[0_30px_70px_-45px_rgba(40,60,110,0.7)]">
                  <Still id={p.cover} className="h-full w-full transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.08]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-graphite/70 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[0.7rem] font-semibold backdrop-blur">{p.category}</span>
                  <span className="absolute inset-x-4 bottom-4 text-white">
                    <span className="block text-[1.1rem] font-medium leading-tight tracking-tight">{p.name}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-white/80"><MapPin size={12} aria-hidden="true" /> {p.location}</span>
                  </span>
                </span>
              </button>
              </Tilt>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* closing: enquire, or go on to the next project */}
      <div id="pd-enquire" className="container-x pb-24">
        <motion.div {...rise} className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 sm:px-12 sm:py-20 lg:rounded-[44px]">
          <span className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-white/55 blur-3xl" style={{ animation: 'drift 16s ease-in-out infinite' }} aria-hidden="true" />
          <span className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[#ffd9bd]/70 blur-3xl" style={{ animation: 'drift 20s ease-in-out -8s infinite reverse' }} aria-hidden="true" />
          <div className="relative grid items-end gap-10 md:grid-cols-2">
            <div>
              <h2 className="display text-[clamp(2.2rem,5vw,4.6rem)] !leading-[1.02]">Imagine it on <span className="accent-word">your plot.</span></h2>
              <p className="mt-5 max-w-md text-ink-2">Tell us about your plot and your plans, and we will explore what is possible together.</p>
              <ul className="mt-5 space-y-2 text-[0.95rem]">
                {['Free consultation with a senior architect', 'Fixed-cost estimate, no hidden costs'].map((t) => (
                  <li key={t} className="flex items-center gap-2.5"><span className="grid h-5 w-5 place-items-center rounded-full bg-olive text-white"><Check size={12} strokeWidth={2.6} /></span>{t}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button onClick={enquire} className="btn-primary">
                  Start an enquiry <ArrowUpRight size={16} strokeWidth={1.5} />
                </button>
                {company.phone && (
                  <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="btn-ghost"><Phone size={15} strokeWidth={1.7} aria-hidden="true" /> Call us</a>
                )}
                {whatsappLink(`Hello, I saw ${project.name} and would like to discuss a similar home.`) && (
                  <a href={whatsappLink(`Hello, I saw ${project.name} and would like to discuss a similar home.`)} target="_blank" rel="noreferrer" className="btn-ghost"><MessageCircle size={15} strokeWidth={1.7} aria-hidden="true" /> WhatsApp</a>
                )}
              </div>
            </div>
            <button onClick={() => onOpen(next.slug)} className="group rounded-[28px] bg-white/70 p-6 text-left backdrop-blur-xl transition-colors hover:bg-white md:justify-self-end" aria-label={`Next project: ${next.name}`}>
              <span className="eyebrow text-ink-2">Next project</span>
              <span className="mt-3 flex items-center gap-4 text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium tracking-tight">
                {next.name}
                <ArrowRight className="shrink-0 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1.4} />
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-sm text-ink-2"><Home size={14} aria-hidden="true" /> {next.category} · {next.location}</span>
            </button>
          </div>
        </motion.div>
      </div>

      <nav className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 xl:block" aria-label="Sections of this page">
        <ul className="pointer-events-auto space-y-3">
          {sections.map((x) => {
            const on = active === x.id
            return (
              <li key={x.id} className="flex justify-end">
                <button onClick={() => document.getElementById(x.id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })} className="group flex items-center gap-3" aria-label={x.label} aria-current={on ? 'true' : undefined}>
                  <span className={`rounded-full bg-graphite px-3 py-1 text-xs font-medium text-white transition-all duration-300 ${on ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>{x.label}</span>
                  <span className={`block rounded-full transition-all duration-500 ${on ? 'h-3 w-3 bg-olive shadow-[0_0_0_5px_rgba(68,80,224,0.2)]' : 'h-2 w-2 bg-graphite/30 group-hover:bg-graphite/60'}`} />
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <Lightbox items={lbItems} index={lb ? lb.i : null} onIndex={(i) => setLb(i === null ? null : lb && { ...lb, i })} lockScroll={false} />
    </motion.div>
  )
}
