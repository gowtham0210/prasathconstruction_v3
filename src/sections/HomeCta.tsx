import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import Band from '../components/Band'
import { company } from '../config/company'
import { consultation } from '../data/prasath'

const ease = [0.16, 1, 0.3, 1] as const

/** The closing panel: "let's create something together", the ways to reach us, and a photograph with a "Book Consultation" pill on it. */
export default function HomeCta() {
  const ways = [
    company.phone && { Icon: Phone, label: 'Call us', value: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
    company.email && { Icon: Mail, label: 'Email us', value: company.email, href: `mailto:${company.email}` },
    company.address && { Icon: MapPin, label: 'Visit us', value: company.address, href: undefined as string | undefined },
  ].filter(Boolean) as { Icon: typeof Phone; label: string; value: string; href?: string }[]
  const view = { once: true, amount: 0.25 } as const

  return (
    <Band id="consult-cta" labelledby="consult-cta-title">
      <div className="grid gap-7 px-[clamp(20px,3vw,48px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-center lg:gap-8">
        <div>
          <motion.h2 id="consult-cta-title" className="pn-title" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, ease }}>
            Let&apos;s create something<br />great together.
          </motion.h2>
          <motion.p className="mt-3 max-w-xs text-[0.8rem] leading-relaxed text-[#a9a6a0]" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.15, ease }}>{consultation.text}</motion.p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {ways.map(({ Icon, label, value, href }, i) => {
            const inner = (
              <>
                <Icon size={18} strokeWidth={1.4} className="mt-0.5 shrink-0 text-[#d4b483] transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
                <span className="min-w-0 leading-snug"><span className="block text-[0.62rem] uppercase tracking-[0.18em] text-[#8f8c85]">{label}</span><span className="mt-0.5 block text-[0.78rem] text-[#e4e0d8]">{value}</span></span>
              </>
            )
            return (
              <motion.li key={label} className={label === 'Visit us' ? 'sm:col-span-2' : ''} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease }}>
                {href ? <a href={href} className="group flex items-start gap-3">{inner}</a> : <div className="group flex items-start gap-3">{inner}</div>}
              </motion.li>
            )
          })}
        </ul>

        <motion.a href="/contact" className="group relative block aspect-[16/8] overflow-hidden rounded-[20px] border border-white/10" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 1, ease }} aria-label="Book a consultation">
          <img src="/images/two-living.jpg" alt="" className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105" loading="lazy" />
          <span className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
          <span className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center gap-3 rounded-full bg-[#f1ece2] py-2 pl-5 pr-2 text-[0.8rem] font-medium shadow-xl transition-transform duration-300 group-hover:translate-x-[-4px]" style={{ color: '#131315' }}>
            Book Consultation
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#131315] text-white"><ArrowRight size={14} aria-hidden="true" /></span>
          </span>
        </motion.a>
      </div>
    </Band>
  )
}
