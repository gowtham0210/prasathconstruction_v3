import { motion } from 'framer-motion'
import { ArrowRight, Check, Sun } from 'lucide-react'
import Band from '../components/Band'
import Still from '../components/Still'
import { getProject } from '../data/projects'
import { services } from '../data/services'
import type { StillId } from '../data/media'

const ease = [0.16, 1, 0.3, 1] as const
/** the homes that carry a rooftop solar installation, and the photograph of their panels */
const SOLAR_HOMES: { slug: string; photo: StillId }[] = [
  { slug: 'thendral-villa', photo: 'p-thendral-solar' },
  { slug: 'kaveri-residency', photo: 'p-kaveri-panels' },
]

/**
 * Solar highlight: the Solar Solutions service (its wording is the service's own, from services.ts) beside two real homes that have rooftop solar.
 * Each home opens its project page.
 */
export default function HomeSolar({ onOpen }: { onOpen: (slug: string) => void }) {
  const solar = services.find((s) => s.id === 'solar')
  const view = { once: true, amount: 0.25 } as const
  if (!solar) return null

  return (
    <Band id="solar" labelledby="solar-title">
      <div className="grid gap-8 px-[clamp(20px,3vw,48px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:items-center lg:gap-10">
        <div>
          <motion.p className="pn-eyebrow" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ duration: 0.8, ease }}>Solar Solutions</motion.p>
          <motion.h2 id="solar-title" className="pn-title mt-3" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.1, ease }}>
            Build your home.<br />Power it with sunshine.
          </motion.h2>
          <motion.p className="mt-4 max-w-md text-[0.9rem] leading-relaxed text-[#a9a6a0]" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.2, ease }}>{solar.summary}</motion.p>
          <motion.ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.3, ease }}>
            {solar.points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[0.8rem] leading-snug text-[#e4e0d8]">
                <Check size={15} className="mt-0.5 shrink-0 text-[#d4b483]" aria-hidden="true" />{p}
              </li>
            ))}
          </motion.ul>
          <motion.div className="mt-6 flex flex-wrap gap-3" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.4, ease }}>
            <a href="/services/solar" className="pn-pill group">Explore Solar Solutions <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" /></a>
          </motion.div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {SOLAR_HOMES.map(({ slug, photo }, i) => {
            const p = getProject(slug)
            if (!p) return null
            return (
              <motion.li key={slug} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease }}>
                <button onClick={() => onOpen(slug)} className="pn-card group relative block aspect-[4/3] w-full overflow-hidden text-left sm:aspect-[3/4] lg:aspect-[4/5]" aria-label={`Open ${p.name}, a home with rooftop solar`}>
                  <Still id={photo} className="absolute inset-0 h-full w-full !rounded-none transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]" />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.16em] text-[#f1e4cc] backdrop-blur"><Sun size={12} className="text-[#d4b483]" aria-hidden="true" />Rooftop solar installed</span>
                  <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                    <span className="leading-tight">
                      <span className="block text-[1.15rem] text-white" style={{ fontFamily: 'var(--font-display)' }}>{p.name}</span>
                      <span className="mt-1 block text-[0.7rem] text-white/75">{p.location} · {p.concept}</span>
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/40 text-white transition-all duration-500 group-hover:border-[#d4b483] group-hover:bg-[#d4b483] group-hover:text-[#1a1206]"><ArrowRight size={14} aria-hidden="true" /></span>
                  </span>
                </button>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </Band>
  )
}
