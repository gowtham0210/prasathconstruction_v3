import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { packages } from '../data/prasath'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

const ease = [0.16, 1, 0.3, 1] as const
const serif = { fontFamily: "'Playfair Display', Georgia, serif" }
const photos = ['/images/two-gate.jpg', '/images/walk-front.jpg', '/images/ext-villa.jpg']
const badges = ['Basic', 'Most popular', 'Deluxe']

/** The three package cards: a photo, a badge, the name, the price per sq.ft, what is included, and a "Get Started" button. The middle one is raised and lit. */
export default function PackageCards({ className = '' }: { className?: string }) {
  const enquire = () => { setEnquiryPrefill('House Construction'); scrollToId('contact') }
  return (
    <ul className={`mx-auto mt-[clamp(20px,3.6vh,40px)] grid max-w-[1320px] items-center gap-6 lg:grid-cols-3 lg:gap-8 ${className}`}>
          {packages.map((p, i) => {
            const hot = !!p.popular
            return (
              <motion.li key={p.name} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -6% 0px' }} transition={{ duration: 1, ease, delay: i * 0.12 }} className={hot ? 'lg:-my-3' : ''}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`group flex h-full flex-col rounded-[26px] p-4 sm:p-[1.1rem] ${hot ? 'border border-[#d4b483] bg-gradient-to-b from-[#272522] to-[#211f1c] shadow-[0_40px_80px_-35px_rgba(212,180,131,0.55)]' : 'border border-white/6 bg-[#202023] shadow-[0_30px_60px_-40px_rgba(255,255,255,0.4)]'}`}
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <img src={photos[i % photos.length]} alt={`${p.name} package home`} className="aspect-[2/1] w-full object-cover object-[50%_45%] transition-transform duration-[1400ms] ease-out group-hover:scale-110" loading="lazy" />
                    <span className={`absolute left-3 top-3 rounded-lg px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] ${hot ? 'bg-[#d4b483] text-white' : 'bg-white/92 text-[#d4b483]'}`}>{badges[i] ?? p.tag}</span>
                  </div>
                  <div className="px-2 pb-1 pt-[clamp(8px,1.6vh,16px)]">
                    <h3 className="text-[2rem] leading-none text-[#ece8df]" style={serif}>{p.name}</h3>
                    <p className="mt-1.5 min-h-[2.4rem] text-[0.84rem] leading-snug text-[#a9a6a0]">{p.text}</p>
                    <p className="mt-[clamp(6px,1.2vh,12px)] flex items-baseline gap-1.5 text-[#d4b483]">
                      <span className="text-[1.6rem]" style={serif}>₹</span>
                      <span className="text-[clamp(2.1rem,min(3vw,5.6vh),3rem)] font-medium leading-none" style={serif}>{p.price}</span>
                      <span className="text-sm text-[#a9a6a0]">/ sq.ft</span>
                    </p>
                    <ul className="mt-[clamp(8px,1.6vh,16px)] space-y-[clamp(4px,0.9vh,8px)]">
                      {p.features.slice(0, 4).map((f) => (
                        <li key={f} className="flex items-center gap-3 text-[0.86rem] text-[#b0ada6]">
                          <span className="grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-full bg-[#d4b483] text-[#1a1206]"><Check size={11} strokeWidth={3} aria-hidden="true" /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={enquire}
                      className={`group/btn relative mt-[clamp(10px,2vh,20px)] inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-2.5 text-sm font-medium transition-all duration-500 ${hot ? 'w-full bg-[#d4b483] hover:bg-[#d4b483] hover:shadow-[0_18px_36px_-14px_rgba(212,180,131,0.8)]' : 'border border-white/30 bg-transparent hover:border-[#d4b483] hover:bg-[#2b2721]'}`}
                      style={{ color: hot ? '#1a1206' : '#ece8df' }}
                    >
                      Get Started <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              </motion.li>
            )
          })}
        </ul>
  )
}
