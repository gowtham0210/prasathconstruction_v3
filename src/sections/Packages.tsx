import { Check, X } from 'lucide-react'
import PackageCards from '../components/PackageCards'
import SectionHead from '../components/SectionHead'
import { Reveal, Stagger } from '../components/Reveal'
import { packages, packagesCommon, packagesIntro, packagesNotIncluded } from '../data/prasath'
import PackageCompare from '../components/PackageCompare'
import CostEstimator from '../components/CostEstimator'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

/** Fixed-cost construction packages, priced per sq.ft of built-up area. `more` adds a link to the Packages page. */
export default function Packages({ more = false, compare = false, id = 'packages' }: { more?: boolean; compare?: boolean; id?: string }) {
  return (
    <section id={id} className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby={`${id}-title`}>
      <div className="container-x">
        <SectionHead id={`${id}-title`} chip={packagesIntro.chip} lines={packagesIntro.lines} accent={['surprises.']} text={packagesIntro.text} />
        <PackageCards className="!mt-14" />

        <Reveal className="mx-auto mt-10 max-w-6xl">
          <div className="card flex flex-col gap-4 !rounded-[28px] p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-7">
            <p className="eyebrow shrink-0 text-olive">In every package</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {packagesCommon.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[0.95rem] font-medium">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-olive/12 text-olive"><Check size={12} strokeWidth={2.4} /></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {packagesNotIncluded.length > 0 && (
            <div className="mt-4 rounded-[28px] border border-graphite/10 bg-white/70 p-6 sm:p-7">
              <p className="eyebrow text-ink-2">Not included</p>
              <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                {packagesNotIncluded.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[0.95rem] text-graphite/80"><X size={14} strokeWidth={2.2} className="text-ink-3" />{f}</li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>

        {compare && (
          <>
            <PackageCompare />
            <CostEstimator />
          </>
        )}
        {more && (
          <Reveal className="mt-12 text-center">
            <a href="/packages" className="btn-primary">View Packages</a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
