import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/useEnv'
import { LogoMark } from './Logo'

const clips = ['/media/exterior.mp4', '/media/twostorey.mp4', '/media/walkthrough.mp4']

/** which clip sits behind which section */
const byId: Record<string, number> = {
  about: 1, services: 0, projects: 2, testimonials: 1, contact: 0, stats: 0, packages: 2, stories: 1, 'home-gallery': 0, 'home-why': 2, 'consult-cta': 1,
  'projects-grid': 2, 'projects-stats': 0, 'projects-process': 1, 'packages-list': 0, 'packages-process': 2, 'gallery-grid': 1, 'about-mvv': 1, 'about-journey': 0, 'about-trust': 2, 'about-visit': 0,
  'about-story': 1, 'about-why': 0, 'about-gallery': 2, 'about-cta': 1,
  'svc-hero': 1, 'svc-list': 0, 'svc-included': 2, 'svc-cta': 1,
}

/**
 * The film behind the whole page: three looping clips stacked in a fixed layer that cross-fade as you move between sections.
 * A pale veil keeps every card and headline readable. Only the visible clip plays, and a clip downloads only when it is first needed.
 */
function VideoBackdrop({ page = 'home' }: { page?: string }) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [wanted, setWanted] = useState<number[]>([0])
  const refs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    if (reduced) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id in byId) {
            const i = byId[e.target.id]
            setActive(i)
            setWanted((w) => (w.includes(i) ? w : [...w, i]))
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    document.querySelectorAll('main section').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [reduced, page])

  // play only the clip that is showing
  useEffect(() => {
    refs.current.forEach((v, i) => {
      if (!v) return
      if (i === active) v.play().catch(() => {})
      else v.pause()
    })
  }, [active, wanted])

  if (reduced) return null
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#dbe7f7]" aria-hidden="true">
      {clips.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[i] = el
          }}
          src={wanted.includes(i) ? src : undefined}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${i === active ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,247,251,0.8),rgba(219,231,247,0.72)_50%,rgba(247,232,218,0.76))] backdrop-blur-[3px]" />
    </div>
  )
}

/**
 * The home page's own backdrop, with no video: a builder's blueprint in night and gold. A fine drafting grid,
 * the phoenix's warm light, the phoenix mark as a large watermark, and the outline of a street of homes along the bottom.
 */
function HomeBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0b0b0d]" aria-hidden="true">
      {/* drafting paper in gold: a fine grid, with a heavier line every fifth square */}
      <div className="absolute inset-0 opacity-[0.6] [background-image:linear-gradient(rgba(212,180,131,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,180,131,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute inset-0 opacity-[0.6] [background-image:linear-gradient(rgba(212,180,131,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(212,180,131,0.08)_1px,transparent_1px)] [background-size:160px_160px]" />
      {/* warm light, from the phoenix */}
      <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_95%_6%,rgba(212,180,131,0.18),transparent_70%),radial-gradient(50%_40%_at_0%_75%,rgba(212,180,131,0.1),transparent_70%)]" />
      <LogoMark className="absolute -right-24 top-[18%] h-[34rem] w-[34rem] opacity-[0.06] blur-[1px]" />
      {/* a street of homes, drawn in a single line */}
      <svg viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[110px] w-full text-[#d4b483] opacity-[0.14] sm:h-[150px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M0 190H1440" />
        <path d="M30 190V120l60-40 60 40v70M60 190v-40h30v40M110 130h20v20h-20z" />
        <path d="M190 190V90h110v100M190 90l55-45 55 45M215 190v-50h30v50M262 120h24v24h-24zM206 110h18v18h-18z" />
        <path d="M340 190V130h90v60M340 130h-14M430 130h14M365 190v-30h40v30" />
        <path d="M480 190V60h100v130M480 100h100M480 140h100M505 80h20v14h-20zM540 80h20v14h-20zM505 120h20v14h-20zM540 120h20v14h-20zM520 190v-34h20v34" />
        <path d="M630 190V115l50-35 50 35v75M660 190v-45h40v45M740 125h20v20h-20z" />
        <path d="M800 190V70h120v120M800 70h120M825 95h22v16h-22zM872 95h22v16h-22zM825 140h22v16h-22zM872 140h22v16h-22z" />
        <path d="M980 190V125h100v65M980 125l50-38 50 38M1010 190v-40h40v40" />
        <path d="M1130 190V95h90v95M1130 95h90M1150 120h18v16h-18zM1180 120h18v16h-18zM1160 190v-34h24v34" />
        <path d="M1270 190V130l55-38 55 38v60M1300 190v-42h40v42" />
      </svg>
    </div>
  )
}

/** The video backdrop belongs to the inner pages; the home page has its own, still one. */
export default function PageBackdrop({ page = 'home' }: { page?: string }) {
  return page === 'home' || page === 'about' || page === 'contact' || page === 'services' || page === 'service' || page === 'projects' || page === 'gallery' || page === 'interiors' || page === 'modernHomes' || page === 'onSite' || page === 'packages' ? <HomeBackdrop /> : <VideoBackdrop page={page} />
}
