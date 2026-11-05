import Magnetic from '../components/Magnetic'
import PageHero from '../components/PageHero'
import PhotoWall from '../components/PhotoWall'
import SectionHead from '../components/SectionHead'
import { Reveal } from '../components/Reveal'
import ProcessBuild from '../sections/ProcessBuild'
import { consultation } from '../data/prasath'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

/** photographs from our sites: work in progress and a site visit with owners */
const PHOTOS = ['g-06', 'g-24', 'g-31', 'g-10', 'g-33', 'g-36', 'g-39', 'g-48']

/** The On-Site Excellence page: how a site is run (the process), a wall of site photographs, and a way to enquire. */
export default function OnSitePage() {
  const enquire = () => {
    setEnquiryPrefill('House Construction')
    scrollToId('contact')
  }

  return (
    <div>
      <PageHero
        id="onsite-hero"
        crumb="On-Site Excellence"
        chip="On-Site Excellence"
        lines={['Every site', 'run with care.']}
        accent={['with care.']}
        text="Daily progress updates and real-time site tracking on every project, with our own engineers and crew on the ground from foundation to handover."
        image="p-ongoing-3"
        focus="50% 45%"
        pills={['Foundations', 'Framing', 'Finishing', 'Handover']}
        seal="On-site excellence • Prasath Construction •"
        sealTo="onsite-process"
        actions={<><Magnetic as="button" onClick={enquire} className="btn-primary on-dark">Book a site visit</Magnetic><Magnetic as="a" href="/gallery" className="btn-ghost on-dark text-white">Full gallery</Magnetic></>}
      />

      <div className="pn-frame">
        <ProcessBuild id="onsite-process" />

        <section id="onsite-gallery" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="onsite-gallery-title">
          <div className="container-x">
            <SectionHead id="onsite-gallery-title" chip="From our sites" lines={['Real sites,', 'real progress.']} accent={['real progress.']} text="Click a photograph to see it full-screen, then swipe or use the arrow keys." />
            <div className="mt-12"><PhotoWall ids={PHOTOS} /></div>
          </div>
        </section>

        <section id="onsite-cta" className="relative pb-[clamp(36px,5vh,64px)] pt-6 text-graphite" aria-labelledby="onsite-cta-title">
          <div className="container-x">
            <Reveal y={70}>
              <div className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 text-center sm:px-12 sm:py-20 lg:rounded-[44px]">
                <div className="relative">
                  <span className="chip">{consultation.chip}</span>
                  <h2 id="onsite-cta-title" className="display mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.4vw,4rem)] !leading-[1.04]">
                    See how we <span className="accent-word">build, up close.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-lg text-ink-2">{consultation.text}</p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Magnetic as="button" onClick={enquire} className="btn-primary">{consultation.cta}</Magnetic>
                    <a href="/projects" className="btn-ghost">See the projects</a>
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
