import { motion } from 'framer-motion'
import { Armchair, ArrowRight, Hammer, Home, KeyRound, PencilRuler, Sun, type LucideIcon } from 'lucide-react'
import Band from '../components/Band'
import Still from '../components/Still'
import { services } from '../data/services'

const icons: Record<string, LucideIcon> = { 'house-construction': Home, 'interior-design': Armchair, 'turnkey-solutions': KeyRound, architecture: PencilRuler, renovation: Hammer, solar: Sun }
const ease = [0.16, 1, 0.3, 1] as const

/** Services, as a panel: a short heading on the left and a row of small cards on the right, each with a round arrow; a photo fades in behind a card on hover. */
export default function HomeServices() {
  const view = { once: true, amount: 0.25 } as const
  return (
    <Band id="services" labelledby="services-title">
      <div className="grid gap-7 px-[clamp(20px,3vw,48px)] lg:grid-cols-[minmax(0,0.5fr)_minmax(0,2.5fr)] lg:items-center lg:gap-8">
        <div>
          <motion.p className="pn-eyebrow" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ duration: 0.8, ease }}>Our Services</motion.p>
          <motion.h2 id="services-title" className="pn-title mt-3" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.1, ease }}>
            Everything your home needs under one roof.
          </motion.h2>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-6">
          {services.map((s, i) => {
            const Icon = icons[s.id] ?? Home
            return (
              <motion.li key={s.id} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease }} whileHover={{ y: -6 }}>
                <a href={`/services/${s.id}`} className="pn-card group relative flex h-full min-h-[11.5rem] flex-col overflow-hidden p-4 transition-colors duration-500 hover:border-[#d4b483]/50" aria-label={`${s.title}: ${s.headline}`}>
                  <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-35" aria-hidden="true">
                    <Still id={s.image} className="h-full w-full !rounded-none" />
                  </span>
                  <span className="relative">
                    <Icon size={22} strokeWidth={1.3} className="text-[#d4b483]" aria-hidden="true" />
                    <span className="mt-3 block text-[1rem] leading-tight text-[#f1ede4]" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</span>
                    <span className="mt-2 block line-clamp-4 text-[0.7rem] leading-snug text-[#a9a6a0] group-hover:text-[#e4e0d8]">{s.headline}</span>
                  </span>
                  <span className="relative mt-auto grid h-7 w-7 place-items-center rounded-full border border-white/25 text-[#ece8df] transition-all duration-500 group-hover:border-[#d4b483] group-hover:bg-[#d4b483] group-hover:text-[#1a1206]"><ArrowRight size={13} aria-hidden="true" /></span>
                </a>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </Band>
  )
}
