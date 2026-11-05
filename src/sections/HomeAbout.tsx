import { ArrowRight, HardHat, Handshake, Layers } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import Band from '../components/Band'

const ease = [0.16, 1, 0.3, 1] as const

const pillars = [
  { icon: HardHat, title: 'Expert Team', text: 'Architects, engineers and project managers.' },
  { icon: Layers, title: 'Quality Materials', text: 'Branded, durable materials for long-lasting homes.' },
  { icon: Handshake, title: 'Complete Transparency', text: 'Fixed cost and timeline, no hidden costs.' },
]

/** About, as a panel: the story on the left with three promises, the home on the right with a small glass card on its corner. */
export default function HomeAbout() {
  const still = !!useReducedMotion()
  const view = { once: true, amount: 0.25 } as const
  const rise = (d: number) => ({ initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: view, transition: { duration: 0.9, delay: d, ease } })
  const lineIn = { hidden: { y: '110%' }, show: (d: number) => ({ y: 0, transition: { duration: 1, delay: d, ease } }) }

  return (
    <Band id="about" labelledby="about-title">
      <div className="grid gap-8 px-[clamp(20px,3vw,48px)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-12">
        <div>
          <motion.p className="pn-eyebrow" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ duration: 0.8, ease }}>About Prasath Construction</motion.p>
          <motion.h2 id="about-title" className="pn-title mt-3" initial="hidden" whileInView="show" viewport={view} aria-label="Built on Trust. Designed for Life.">
            <span className="block overflow-hidden pb-[0.1em]" aria-hidden="true"><motion.span className="block" variants={lineIn} custom={0.1}>Built on Trust.</motion.span></span>
            <span className="block overflow-hidden pb-[0.1em]" aria-hidden="true"><motion.span className="block" variants={lineIn} custom={0.25}>Designed for Life.</motion.span></span>
          </motion.h2>
          <motion.p className="mt-4 max-w-md text-[0.84rem] leading-relaxed text-[#a9a6a0]" {...rise(0.4)}>
            With 12+ years of experience, we have delivered 320+ homes across Tamilnadu. We believe in complete transparency with fixed cost and timeline, and uncompromising quality — from design to handover.
          </motion.p>

          <ul className="mt-6 grid grid-cols-3 gap-4">
            {pillars.map((x, i) => {
              const Icon = x.icon
              return (
                <motion.li key={x.title} className="group" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease }}>
                  <Icon size={22} strokeWidth={1.3} className="text-[#d4b483] transition-transform duration-500 group-hover:-translate-y-1" aria-hidden="true" />
                  <p className="mt-2.5 text-[0.82rem] text-[#ece8df]" style={{ fontFamily: 'var(--font-display)' }}>{x.title}</p>
                  <p className="mt-1 text-[0.76rem] leading-snug text-[#9a9790]">{x.text}</p>
                </motion.li>
              )
            })}
          </ul>

          <motion.div className="mt-6" {...rise(0.8)}>
            <a href="/about" className="pn-pill group">More About Us <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" /></a>
          </motion.div>
        </div>

        <motion.div className="relative" initial="hidden" whileInView="show" viewport={view} variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 1.1, ease } } }}>
          <div className="group relative aspect-[16/10] overflow-hidden rounded-[20px] border border-white/10 lg:aspect-[2.4/1]">
            <motion.img src="/images/ext-villa.jpg" alt="A home built by Prasath Construction" className="h-full w-full object-cover" variants={{ hidden: { scale: 1.15 }, show: { scale: 1, transition: { duration: 2, ease } } }} loading="lazy" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            {!still && <motion.span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent" animate={{ x: ['0%', '620%'] }} transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }} aria-hidden="true" />}
          </div>
          <motion.div className="absolute -bottom-3 left-4 rounded-2xl border border-white/20 bg-[#2a2a2d]/80 px-5 py-4 shadow-2xl backdrop-blur-xl sm:left-6" animate={still ? undefined : { y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#a9a6a0]">Experience</p>
            <p className="mt-0.5 text-[2rem] leading-none text-white" style={{ fontFamily: 'var(--font-display)' }}>12+ years</p>
            <p className="mt-1 text-[0.62rem] leading-snug text-[#a9a6a0]">Building trust.<br />Designing the future.</p>
          </motion.div>
        </motion.div>
      </div>
    </Band>
  )
}
