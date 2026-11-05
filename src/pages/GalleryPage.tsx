import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Lightbox from '../components/Lightbox'
import Magnetic from '../components/Magnetic'
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { galleryIds, GALLERY_CAPTIONS, GALLERY_RATIOS, STILLS } from '../data/media'
import { consultation } from '../data/prasath'
import { gsap, scrollToId } from '../lib/smooth'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useEnv'

/** The Gallery page: every site photograph in a flowing grid with a full-screen viewer. */
export default function GalleryPage() {
  const root = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState<number | null>(null)

  const mobile = useIsMobile()
  const cols = mobile ? 2 : 4

  // deal the photographs out to the shortest column each time, then swap and move a few so every column ends at nearly the same height
  const columns = useMemo(() => {
    const gap = cols === 2 ? 0.1 : 0.06 // the space between tiles, as a fraction of a column's width
    const h = (i: number) => 1 / GALLERY_RATIOS[i] + gap
    const out: number[][] = Array.from({ length: cols }, () => [])
    const heights: number[] = new Array(cols).fill(0)
    galleryIds.forEach((_, i) => {
      const c = heights.indexOf(Math.min(...heights))
      out[c].push(i)
      heights[c] += h(i)
    })
    const spread = () => Math.max(...heights) - Math.min(...heights)
    for (let pass = 0; pass < 200; pass++) {
      const hi = heights.indexOf(Math.max(...heights))
      const lo = heights.indexOf(Math.min(...heights))
      const before = spread()
      let best: { kind: 'move' | 'swap'; a: number; b?: number; gain: number } | null = null
      // move one tile from the tallest column to the shortest, or swap a pair between them
      out[hi].forEach((ti, ai) => {
        const dm = Math.abs(heights[hi] - h(ti) - (heights[lo] + h(ti)))
        if (heights[hi] - h(ti) >= heights[lo] + h(ti) - 1e-9 || dm < heights[hi] - heights[lo]) {
          const gain = heights[hi] - heights[lo] - dm
          if (gain > 1e-6 && (!best || gain > best.gain)) best = { kind: 'move', a: ai, gain }
        }
        out[lo].forEach((tj, bj) => {
          const d = h(ti) - h(tj)
          const gain = heights[hi] - heights[lo] - Math.abs(heights[hi] - heights[lo] - 2 * d)
          if (gain > 1e-6 && (!best || gain > best.gain)) best = { kind: 'swap', a: ai, b: bj, gain }
        })
      })
      if (!best) break
      const m = best as { kind: 'move' | 'swap'; a: number; b?: number }
      if (m.kind === 'move') {
        const [t] = out[hi].splice(m.a, 1)
        out[lo].push(t)
        heights[hi] -= h(t)
        heights[lo] += h(t)
      } else {
        const ti = out[hi][m.a]
        const tj = out[lo][m.b as number]
        out[hi][m.a] = tj
        out[lo][m.b as number] = ti
        heights[hi] += h(tj) - h(ti)
        heights[lo] += h(ti) - h(tj)
      }
      if (spread() >= before) break
    }
    // keep each column in the original viewing order
    out.forEach((c) => c.sort((x, y) => x - y))
    return out
  }, [cols])

  // each photograph opens when it really appears on screen (measured after the columns have moved)
  useEffect(() => {
    const tiles = Array.from(document.querySelectorAll<HTMLElement>('[data-tile]'))
    if (reduced || !('IntersectionObserver' in window)) {
      tiles.forEach((t) => t.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))), { rootMargin: '0px 0px -6% 0px' })
    tiles.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [reduced, cols])

  // four columns that travel at different speeds as you scroll, each photograph opening with a mask
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const speeds = mobile ? [16, -16] : [26, -26, 26, -26]
      gsap.utils.toArray<HTMLElement>('[data-col]').forEach((col, i) => {
        gsap.fromTo(col, { y: speeds[i] }, { y: -speeds[i], ease: 'none', scrollTrigger: { trigger: '#gallery-grid', start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
      })
    }, root)
    return () => ctx.revert()
  }, [reduced, mobile])

  const lightboxItems = useMemo(() => galleryIds.map((id) => ({ id, caption: GALLERY_CAPTIONS[id] })), [])

  return (
    <div ref={root}>
      <PageHero
        id="gallery-hero"
        crumb="Gallery"
        chip="Gallery"
        lines={['Every site', 'tells a story.']}
        accent={['story.']}
        text="Foundations, framing, finishing and handover — a real look at how we build, straight from our sites across Tamilnadu."
        image="p-ongoing-3"
        focus="50% 45%"
        pills={['Foundations', 'Framing', 'Finishing', 'Handover']}
        facts={[{ v: '54', l: 'Site photographs' }, { v: '4', l: 'Stages shown' }, { v: 'Live', l: 'Real sites' }]}
        seal="Our gallery • Real sites •"
        sealTo="gallery-grid"
        actions={<><Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary on-dark">Book a Consultation</Magnetic><Magnetic as="button" onClick={() => scrollToId('projects')} className="btn-ghost on-dark text-white">See the projects</Magnetic></>}
      />

      <div className="pn-frame">
      <section id="gallery-grid" className="relative overflow-hidden py-[clamp(30px,4.5vh,56px)] text-graphite" aria-label="Photographs">
        <div className="container-x">
          <div className="grid items-start gap-4 lg:gap-5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {columns.map((idxs, c) => (
              <div key={c} data-col className="flex flex-col gap-4 will-change-transform lg:gap-5">
                {idxs.map((i) => { const id = galleryIds[i]; return (
                  <button key={id} data-tile onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-[24px] bg-[#dfe6f2] shadow-[0_24px_60px_-40px_rgba(40,60,110,0.6)]" style={{ aspectRatio: GALLERY_RATIOS[i] }} aria-label={`Open photograph ${i + 1} of ${galleryIds.length}: ${GALLERY_CAPTIONS[id]}`}>
                    <img src={STILLS[id].image} alt={STILLS[id].alt} loading="lazy" decoding="async" className="block h-full w-full object-cover group-hover:!scale-[1.08]" />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full bg-white/90 py-1.5 pl-3 pr-4 text-xs font-medium text-graphite backdrop-blur">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-olive" />
                      <span className="truncate">{GALLERY_CAPTIONS[id]}</span>
                    </span>
                  </button>
                ) })}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery-cta" className="relative pb-[clamp(36px,5vh,64px)] pt-6 text-graphite" aria-labelledby="gallery-cta-title">
        <div className="container-x">
          <Reveal y={70}>
            <div className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 text-center sm:px-12 sm:py-20 lg:rounded-[44px]">
              <div className="relative">
                <span className="chip sec-chip">{consultation.chip}</span>
                <h2 id="gallery-cta-title" className="display mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.4vw,4rem)] !leading-[1.04]">
                  Your dream home is <span className="accent-word">just one conversation away.</span>
                </h2>
                <div className="mt-8">
                  <Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary">{consultation.cta}</Magnetic>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      </div>

      <Lightbox items={lightboxItems} index={open} onIndex={setOpen} />
    </div>
  )
}
