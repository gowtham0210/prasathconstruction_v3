import { ArrowUpRight } from 'lucide-react'
import Magnetic from '../components/Magnetic'
import PageHero from '../components/PageHero'
import PhotoWall from '../components/PhotoWall'
import SectionHead from '../components/SectionHead'
import Still from '../components/Still'
import { Reveal, Stagger } from '../components/Reveal'
import { consultation } from '../data/prasath'
import { projects } from '../data/projects'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

/** finished homes and renderings of contemporary elevations */
const PHOTOS = ['p-completed-3', 'two-front', 'p-completed-2', 'tour-balcony', 'walk-front', 'p-completed-1', 'ext-villa', 'tour-dusk', 'g-01', 'tour-porch', 'g-45', 'ext-timber']

/** The Modern Homes page: our completed and ongoing homes (each opens its project page), a wall of photographs, and a way to enquire. */
export default function ModernHomesPage() {
  const homes = projects.filter((p) => p.category !== 'Upcoming')
  const enquire = () => {
    setEnquiryPrefill('House Construction')
    scrollToId('contact')
  }

  return (
    <div>
      <PageHero
        id="modern-hero"
        crumb="Modern Homes"
        chip="Modern Homes"
        lines={['Modern homes,', 'built with care.']}
        accent={['built with care.']}
        text="Contemporary homes designed by our architects and built by our own team, from the first drawing to handover, at a fixed cost."
        image="p-completed-3"
        focus="50% 40%"
        pills={['Architect-led design', 'Fixed cost', 'Turnkey delivery']}
        seal="Modern homes • Prasath Construction •"
        sealTo="modern-homes"
        actions={<><Magnetic as="button" onClick={enquire} className="btn-primary on-dark">Plan my home</Magnetic><Magnetic as="a" href="/projects" className="btn-ghost on-dark text-white">All projects</Magnetic></>}
      />

      <div className="pn-frame">
        <section id="modern-homes" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="modern-homes-title">
          <div className="container-x">
            <SectionHead id="modern-homes-title" chip="Our homes" lines={['Homes we have', 'built and are building.']} accent={['building.']} text="Open any home to see its photographs, size and location." />
            <Stagger as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
              {homes.map((p) => (
                <li key={p.slug}>
                  <a href={`/projects/${p.slug}`} className="card card-hover group flex h-full flex-col p-3" aria-label={`Open ${p.name}, ${p.category}, ${p.location}`}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
                      <Still id={p.cover} className="h-full w-full !rounded-none transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.07]" />
                      <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-[#e6d0a8] backdrop-blur">{p.category}</span>
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-3 p-3">
                      <span className="leading-snug">
                        <span className="block text-[1.05rem] font-medium tracking-tight">{p.name}</span>
                        <span className="mt-0.5 block text-[0.78rem] text-ink-2">{p.location} · {p.concept}</span>
                      </span>
                      <ArrowUpRight size={18} strokeWidth={1.6} className="shrink-0 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
                    </div>
                  </a>
                </li>
              ))}
            </Stagger>
          </div>
        </section>

        <section id="modern-gallery" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="modern-gallery-title">
          <div className="container-x">
            <SectionHead id="modern-gallery-title" chip="Photographs" lines={['A look at', 'the homes.']} accent={['homes.']} text="Click a photograph to see it full-screen, then swipe or use the arrow keys." />
            <div className="mt-12"><PhotoWall ids={PHOTOS} /></div>
          </div>
        </section>

        <section id="modern-cta" className="relative pb-[clamp(36px,5vh,64px)] pt-6 text-graphite" aria-labelledby="modern-cta-title">
          <div className="container-x">
            <Reveal y={70}>
              <div className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 text-center sm:px-12 sm:py-20 lg:rounded-[44px]">
                <div className="relative">
                  <span className="chip">{consultation.chip}</span>
                  <h2 id="modern-cta-title" className="display mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.4vw,4rem)] !leading-[1.04]">
                    Ready to plan your <span className="accent-word">modern home?</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-lg text-ink-2">{consultation.text}</p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Magnetic as="button" onClick={enquire} className="btn-primary">{consultation.cta}</Magnetic>
                    <a href="/packages" className="btn-ghost">See package prices</a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  )
}
