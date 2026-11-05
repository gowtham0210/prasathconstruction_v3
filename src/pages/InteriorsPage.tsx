import { Check } from 'lucide-react'
import Magnetic from '../components/Magnetic'
import PageHero from '../components/PageHero'
import PhotoWall from '../components/PhotoWall'
import SectionHead from '../components/SectionHead'
import Still from '../components/Still'
import { Reveal, Stagger } from '../components/Reveal'
import { consultation } from '../data/prasath'
import { services } from '../data/services'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

/** photographs of rooms: finished interiors and interior fit-out on site */
const PHOTOS = ['p-interior', 'two-living', 'walk-hall', 'tour-kitchen', 'two-living2', 'tour-bedroom', 'walk-kitchen', 'tour-living', 'g-08', 'tour-hall', 'g-21', 'g-44']

/** The Interiors page: what the interiors studio covers, a gallery of rooms with a full-screen viewer, and a way to enquire. */
export default function InteriorsPage() {
  const s = services.find((x) => x.id === 'interior-design')
  if (!s) return null
  const enquire = () => {
    setEnquiryPrefill(s.enquiryType)
    scrollToId('contact')
  }

  return (
    <div>
      <PageHero
        id="interiors-hero"
        crumb="Interiors"
        chip="Interior Design"
        lines={['Interiors made', 'for the way you live.']}
        accent={['way you live.']}
        text={s.summary}
        image="two-living"
        focus="50% 55%"
        pills={s.points.slice(0, 3)}
        seal="Our interiors • Prasath Construction •"
        sealTo="interiors-gallery"
        actions={<><Magnetic as="button" onClick={enquire} className="btn-primary on-dark">Enquire about Interiors</Magnetic><Magnetic as="a" href="/services" className="btn-ghost on-dark text-white">All services</Magnetic></>}
      />

      <div className="pn-frame">
        <section id="interiors-about" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="interiors-about-title">
          <div className="container-x">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              <Reveal y={70} className="lg:col-span-6">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] shadow-[0_40px_90px_-50px_rgba(0,0,0,0.8)] lg:rounded-[40px]">
                  <Still id={s.image} className="h-full w-full !rounded-none" />
                </div>
              </Reveal>
              <div className="lg:col-span-6">
                <Reveal><span className="chip">What is included</span></Reveal>
                <Reveal delay={0.05}>
                  <h2 id="interiors-about-title" className="display mt-5 text-[clamp(1.9rem,3.4vw,3rem)] !leading-[1.05]">Interiors, <span className="accent-word">done properly.</span></h2>
                </Reveal>
                <Reveal delay={0.1} className="mt-4 text-[1.02rem] leading-relaxed text-ink-2">{s.summary}</Reveal>
                <Stagger as="ul" className="mt-7 space-y-3" gap={0.08}>
                  {s.points.map((p) => (
                    <li key={p} className="card flex items-center gap-4 !rounded-2xl p-4 text-[1.02rem] font-medium">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-olive/12 text-olive"><Check size={16} strokeWidth={2.4} /></span>
                      {p}
                    </li>
                  ))}
                </Stagger>
                <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Magnetic as="button" onClick={enquire} className="btn-primary">Get a quote</Magnetic>
                  <a href="/gallery" className="link-line font-medium">See the full gallery</a>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section id="interiors-gallery" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="interiors-gallery-title">
          <div className="container-x">
            <SectionHead id="interiors-gallery-title" chip="Rooms" lines={['A look at', 'the rooms.']} accent={['rooms.']} text="Click a photograph to see it full-screen, then swipe or use the arrow keys." />
            <div className="mt-12"><PhotoWall ids={PHOTOS} /></div>
          </div>
        </section>

        <section id="interiors-cta" className="relative pb-[clamp(36px,5vh,64px)] pt-6 text-graphite" aria-labelledby="interiors-cta-title">
          <div className="container-x">
            <Reveal y={70}>
              <div className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 text-center sm:px-12 sm:py-20 lg:rounded-[44px]">
                <div className="relative">
                  <span className="chip">{consultation.chip}</span>
                  <h2 id="interiors-cta-title" className="display mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.4vw,4rem)] !leading-[1.04]">
                    Talk to us about your <span className="accent-word">interiors.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-lg text-ink-2">{consultation.text}</p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Magnetic as="button" onClick={enquire} className="btn-primary">{consultation.cta}</Magnetic>
                    <a href="/services" className="btn-ghost">All services</a>
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
