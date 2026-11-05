import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, MapPin, Ruler } from 'lucide-react'
import Band from '../components/Band'
import Still from '../components/Still'
import { projectFilters, projects } from '../data/projects'

type Filter = (typeof projectFilters)[number]
const ease = [0.16, 1, 0.3, 1] as const

/** where the building sits in each photo, so a card shows the house and not the ground */
const FOCUS: Record<string, string> = { 'p-completed-1': '50% 45%', 'p-completed-2': '50% 28%', 'p-completed-3': '50% 38%' }

/** the project shown large under the row of cards */
const FEATURED = 'thendral-villa'

/**
 * Projects, as a panel: a heading with small filters and an "Explore all" pill, a row of four photographs, and under it one featured project
 * with its facts and a wide picture.
 */
export default function Projects({ onOpen }: { onOpen: (slug: string) => void }) {
  const [filter, setFilter] = useState<Filter>('All Projects')
  const list = useMemo(() => (filter === 'All Projects' ? projects : projects.filter((p) => p.category === filter)), [filter])
  const shown = list.slice(0, 4)
  const featured = projects.find((p) => p.slug === FEATURED) ?? projects[0]
  const view = { once: true, amount: 0.2 } as const

  return (
    <Band id="projects" labelledby="projects-title">
      <div className="px-[clamp(20px,3vw,48px)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.p className="pn-eyebrow" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ duration: 0.8, ease }}>Selected Projects</motion.p>
            <motion.h2 id="projects-title" className="pn-title mt-3" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.1, ease }}>
              Spaces designed<br />for better living.
            </motion.h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-1.5">
              {projectFilters.map((f) => (
                <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={`rounded-full px-3.5 py-1.5 text-[0.72rem] transition-colors duration-300 ${filter === f ? 'bg-[#d4b483] font-semibold text-[#1a1206]' : 'border border-white/15 text-[#b0ada6] hover:border-white/40 hover:text-white'}`}>{f}</button>
              ))}
            </div>
            <a href="/projects" className="pn-pill group">Explore All Projects <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" /></a>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => (
              <motion.button
                key={`${filter}-${p.slug}`}
                layout
                onClick={() => onOpen(p.slug)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.7, ease, delay: i * 0.07 }}
                className="group relative aspect-[3/2] overflow-hidden rounded-[18px] border border-white/10 text-left"
                aria-label={`Open ${p.name}, ${p.category}, ${p.location}`}
              >
                <span className="absolute inset-0 block transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.08]"><Still id={p.cover} focus={FOCUS[p.cover] ?? '50% 45%'} className="h-full w-full !rounded-none" /></span>
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-[#e6d0a8] backdrop-blur">{p.category}</span>
                <span className="absolute inset-x-3.5 bottom-3 block">
                  <span className="block text-[1.05rem] leading-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>{p.name}</span>
                  <span className="mt-0.5 block text-[0.7rem] text-white/70">{p.location}</span>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
          {shown.length === 0 && <p className="col-span-full py-10 text-center text-[#a9a6a0]">No projects in this category yet.</p>}
        </div>
      </div>

      {featured && (
        <div className="mx-[clamp(20px,3vw,48px)] mt-7 grid gap-6 border-t border-white/10 pt-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:items-center lg:gap-10">
          <div>
            <p className="pn-eyebrow">Featured Project</p>
            <h3 className="pn-title mt-3">{featured.name}</h3>
            <p className="mt-3 max-w-xs text-[0.8rem] leading-relaxed text-[#a9a6a0]">{featured.concept}</p>
            <ul className="mt-4 space-y-1.5 text-[0.75rem] text-[#b0ada6]">
              <li className="flex items-center gap-2"><MapPin size={13} className="text-[#d4b483]" aria-hidden="true" /> Location: {featured.location}</li>
              <li className="flex items-center gap-2"><Ruler size={13} className="text-[#d4b483]" aria-hidden="true" /> Area: {featured.builtUp.replace(' (concept)', '')}</li>
            </ul>
            <button onClick={() => onOpen(featured.slug)} className="pn-pill group mt-5">View Project <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" /></button>
          </div>
          <motion.button onClick={() => onOpen(featured.slug)} className="group relative aspect-[21/8] overflow-hidden rounded-[20px] border border-white/10" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 1, ease }} aria-label={`Open ${featured.name}`}>
            <span className="absolute inset-0 block transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.05]"><Still id={featured.cover} focus={FOCUS[featured.cover] ?? '50% 45%'} className="h-full w-full !rounded-none" /></span>
            <span className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.button>
        </div>
      )}
    </Band>
  )
}
