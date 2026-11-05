import { ArrowRight, Clock, Handshake, Headphones, Home, Leaf, MapPin, ShieldCheck, Star, Users } from 'lucide-react'
import Band from '../components/Band'
import CountUp from '../components/CountUp'

/** Wireframe blueprint illustration in background */
function BlueprintBackground() {
  return (
    <svg
      viewBox="0 0 600 300"
      className="pointer-events-none absolute -bottom-10 left-[10%] z-0 h-[280px] w-[520px] select-none text-[#d4b483] opacity-15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <rect x="50" y="80" width="220" height="180" />
      <polygon points="50,80 160,20 270,80" />
      <rect x="270" y="110" width="180" height="150" />
      <polygon points="270,110 360,50 450,110" />
      <line x1="160" y1="20" x2="160" y2="80" />
      <rect x="90" y="120" width="45" height="55" />
      <rect x="185" y="120" width="45" height="55" />
      <rect x="140" y="195" width="40" height="65" />
      <rect x="300" y="140" width="50" height="50" />
      <rect x="375" y="140" width="50" height="50" />
    </svg>
  )
}

const features = [
  {
    icon: Users,
    title: 'Skilled Experts',
    desc: 'An experienced team of architects, engineers and project managers at your service.',
  },
  {
    icon: Handshake,
    title: 'Transparent Pricing',
    desc: 'No hidden costs. Just honest and fair value for your investment.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Assurance',
    desc: 'We use the best materials and modern techniques for long-lasting results.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Approach',
    desc: 'Greener spaces for a brighter future.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    desc: 'We respect your time and ensure every project is completed as promised.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    desc: 'From consultation to handover, we are with you at every step.',
  },
]

const stats = [
  { icon: Home, to: 320, suffix: '+', label: 'Homes Delivered', decimals: 0 },
  { icon: MapPin, to: 15, suffix: '+', label: 'Areas Covered', decimals: 0 },
  { icon: Clock, to: 98, suffix: '%', label: 'On-Time Delivery', decimals: 0 },
  { icon: Star, to: 4.9, suffix: '★', label: 'Owner Rating', decimals: 1 },
]

const tiles = [
  { href: '/modern-homes', src: '/images/two-front.jpg', label: 'Modern Homes' },
  { href: '/interiors', src: '/images/two-living.jpg', label: 'Elegant Interiors' },
  { href: '/on-site', src: '/prasath/gallery/site-05.jpg', label: 'On-Site Excellence' },
]

const serif = { fontFamily: "'Playfair Display', Georgia, serif" }

export default function HomeWhy() {
  return (
    <Band id="home-why" tone="dark" next="light" labelledby="home-why-title" className="">
      <BlueprintBackground />
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-[#d4b483]/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-[#d4b483]/10 blur-[140px]" />

      <div className="relative px-[clamp(20px,3vw,48px)] z-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* Left: heading, story, six reasons, button */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d4b483] sm:text-[0.76rem]">Why Choose Us</span>
              <span className="h-[1.5px] w-12 bg-[#d4b483]" />
            </div>
            <h2 id="home-why-title" className="mt-3 text-[clamp(1.7rem,2.5vw,2.5rem)] font-medium leading-[1.04] tracking-tight text-[#f3efe6]" style={serif}>
              Your Dream Home,
              <br />
              <span className="text-[#d4b483]">Our Commitment.</span>
            </h2>
            <p className="mt-[clamp(10px,1.8vh,18px)] max-w-lg text-sm leading-relaxed text-white/70 sm:text-[0.95rem]">
              With a legacy of trust and a passion for excellence, Prasath Construction is the preferred choice for families who value quality, transparency and timely delivery.
            </p>

            <div className="mt-[clamp(14px,3vh,30px)] grid grid-cols-1 gap-x-8 gap-y-[clamp(10px,2.4vh,26px)] sm:grid-cols-2">
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="flex items-start gap-3.5">
                    <div className="grid h-[clamp(42px,6.2vh,56px)] w-[clamp(42px,6.2vh,56px)] shrink-0 place-items-center rounded-2xl border border-[#d4b483]/45 bg-[#202023] text-[#d4b483] shadow-[0_14px_30px_-14px_rgba(212,180,131,0.45)]">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[1.15rem] font-medium leading-tight text-white" style={serif}>{f.title}</h3>
                      <p className="mt-1 text-[0.78rem] leading-snug text-white/65">{f.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-[clamp(14px,3vh,30px)]">
              <a href="/services" className="group inline-flex items-center gap-3.5 rounded-full bg-[#f1ece2] py-2.5 pl-6 pr-2.5 text-sm font-medium shadow-xl transition-all duration-300 hover:shadow-2xl sm:text-base" style={{ backgroundColor: '#f1ece2', color: '#131315' }}>
                <span style={{ color: '#131315' }}>Explore Our Services</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d4b483] text-[#1a1206] transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight size={16} strokeWidth={2.2} />
                </span>
              </a>
            </div>
          </div>

          {/* Right: the villa with the numbers beside it, and three views below */}
          <div className="flex flex-col gap-4 lg:col-span-6">
            <div className="relative min-h-[300px] flex-1 lg:min-h-0">
              <div className="absolute -left-3 -top-3 h-32 w-[58%] rounded-tl-[28px] bg-[#d4b483]" aria-hidden="true" />
              <div className="absolute inset-0 overflow-hidden rounded-[26px] border border-white/10 bg-[#1e1e21] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
                <img src="/images/walk-front.jpg" alt="A Prasath Construction home" className="h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0e0e10]/40" />
              </div>
              <div className="absolute inset-y-4 right-4 z-20 hidden w-[clamp(170px,26%,215px)] flex-col justify-between rounded-[22px] border border-white/12 bg-[#1b1b1e]/92 px-5 py-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-md min-[560px]:flex">
                {stats.map((x, i) => {
                  const Icon = x.icon
                  return (
                    <div key={x.label} className={`flex items-center gap-3.5 ${i ? 'border-t border-white/10 pt-3' : ''}`}>
                      <Icon size={26} strokeWidth={1.5} className="shrink-0 text-[#d4b483]" />
                      <div>
                        <p className="text-[1.7rem] leading-none text-[#d4b483]" style={serif}><CountUp to={x.to} suffix={x.suffix} decimals={x.decimals} /></p>
                        <p className="mt-1 text-[0.72rem] text-white/75">{x.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 min-[560px]:hidden">
              {stats.map((x) => {
                const Icon = x.icon
                return (
                  <div key={x.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1b1b1e] p-4">
                    <Icon size={22} className="shrink-0 text-[#d4b483]" />
                    <div>
                      <p className="text-xl text-[#d4b483]" style={serif}>{x.to}{x.suffix}</p>
                      <p className="text-[0.68rem] text-white/70">{x.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-[22px] border border-white/10 bg-[#1b1b1e]/80 p-3 sm:gap-4 sm:p-3.5">
              {tiles.map((t) => (
                <a key={t.label} href={t.href} className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-white/20 bg-[#1e1e21] shadow-lg lg:aspect-auto lg:h-[clamp(84px,14vh,130px)]">
                  <img src={t.src} alt={t.label} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-2 pt-6 text-[0.85rem] text-white sm:text-[0.95rem]" style={serif}>
                    {t.label}
                    <ArrowRight size={15} className="text-[#d4b483] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Band>
  )
}
