import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, CalendarCheck, Check, Clock, Headphones, Home, ShieldCheck, Users, Award } from 'lucide-react'
import Band from '../components/Band'
import PackageCards from '../components/PackageCards'
import { packages } from '../data/prasath'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

const ease = [0.16, 1, 0.3, 1] as const
const serif = { fontFamily: "'Playfair Display', Georgia, serif" }
const script = { fontFamily: "'Segoe Script','Brush Script MT','Snell Roundhand',cursive" }

const photos = ['/images/two-gate.jpg', '/images/walk-front.jpg', '/images/ext-villa.jpg']
const badges = ['Basic', 'Most popular', 'Deluxe']

const trust = [
  { icon: ShieldCheck, label: 'Transparent\nPricing' },
  { icon: Award, label: 'Quality\nMaterials' },
  { icon: Clock, label: 'On-Time\nDelivery' },
  { icon: Users, label: 'Dedicated\nSupport' },
]

const promises = [
  { icon: Home, title: 'Customizable Packages', text: 'Tailored to your needs and budget.' },
  { icon: ShieldCheck, title: 'Premium Quality', text: 'Only the best materials and workmanship.' },
  { icon: CalendarCheck, title: 'Timely Completion', text: 'Because your time matters.' },
  { icon: Headphones, title: 'End-to-End Support', text: 'From planning to handover.' },
]

/** Packages, on cream: a header with the promises beside it, three cards with a photo each (the popular one raised and lit in orange), and a strip of what we stand for. */
export default function HomePackages() {
  const still = !!useReducedMotion()
  const view = { once: true, amount: 0.2 } as const
  const enquire = () => { setEnquiryPrefill('House Construction'); scrollToId('contact') }

  return (
    <Band id="packages" tone="light" next="dark" mark={false} labelledby="packages-title" className="">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(212,180,131,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(212,180,131,0.045)_1px,transparent_1px)] [background-size:56px_56px]" aria-hidden="true" />
      <motion.div className="pointer-events-none absolute -right-24 top-[30%] h-[28rem] w-[28rem] rounded-full bg-[#d4b483]/18 blur-[130px]" animate={still ? undefined : { opacity: [0.5, 1, 0.5] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} aria-hidden="true" />

      <div className="relative w-full px-[clamp(20px,3vw,48px)]">
        {/* header */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ duration: 0.8, ease }}>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d4b483]">Construction Packages</span>
              <span className="h-px w-14 bg-[#d4b483]/40" />
            </motion.div>
            <motion.h2 id="packages-title" className="mt-3 text-[clamp(1.7rem,2.5vw,2.5rem)] font-normal leading-[1.05] tracking-tight text-[#ece8df]" style={serif} initial="hidden" whileInView="show" viewport={view} aria-label="Choose the Perfect Plan for Your Dream Home.">
              {['Choose the Perfect Plan', 'for Your Dream Home.'].map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[0.1em]" aria-hidden="true">
                  <motion.span className={`block ${i ? 'text-[#d4b483]' : ''}`} variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 1, delay: 0.1 + i * 0.16, ease } } }}>{l}</motion.span>
                </span>
              ))}
            </motion.h2>
            <motion.p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[#b0ada6]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.4, ease }}>
              Fixed-cost, per sq.ft packages on built-up area. Design, approvals, materials, labor and supervision are included, so you know the price before we begin.{' '}
              <a href="/packages" className="inline-flex items-center gap-1 font-semibold text-[#d4b483] underline-offset-4 hover:underline">Compare all <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" /></a>
            </motion.p>
          </div>

          <motion.div className="flex flex-wrap items-center gap-x-2 gap-y-6 lg:flex-nowrap" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.3, ease }}>
            {trust.map((t) => {
              const Icon = t.icon
              return (
                <div key={t.label} className="group flex w-[7.2rem] flex-col items-center gap-2.5 border-r border-white/12 px-2 text-center last:border-r-0">
                  <span className="grid h-[3.4rem] w-[3.4rem] place-items-center rounded-full bg-[#2b2721] text-[#d4b483] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"><Icon size={22} strokeWidth={1.6} /></span>
                  <span className="whitespace-pre-line text-[0.82rem] leading-snug text-[#e4e0d8]">{t.label}</span>
                </div>
              )
            })}
            <motion.p className="ml-4 hidden -rotate-[8deg] text-[1.9rem] leading-[1.05] text-[#d4b483] xl:block" style={script} animate={still ? undefined : { rotate: [-8, -6, -8] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} aria-hidden="true">
              Build<br />&nbsp;Your Future<br />&nbsp;&nbsp;with Us
            </motion.p>
          </motion.div>
        </div>

        {/* the three packages */}
        <PackageCards />

        {/* what we stand for */}
        <motion.ul className="mx-auto mt-[clamp(16px,3.2vh,34px)] grid max-w-[1320px] grid-cols-1 gap-y-6 sm:grid-cols-2 lg:grid-cols-4" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay: 0.2, ease }}>
          {promises.map((m) => {
            const Icon = m.icon
            return (
              <li key={m.title} className="group flex items-center gap-4 border-white/12 px-2 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                <span className="grid h-[3.3rem] w-[3.3rem] shrink-0 place-items-center rounded-full bg-[#2b2721] text-[#d4b483] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"><Icon size={22} strokeWidth={1.6} /></span>
                <span>
                  <span className="block text-[1.02rem] text-[#ece8df]" style={serif}>{m.title}</span>
                  <span className="mt-0.5 block text-[0.78rem] leading-snug text-[#9a9791]">{m.text}</span>
                </span>
              </li>
            )
          })}
        </motion.ul>

      </div>
    </Band>
  )
}
