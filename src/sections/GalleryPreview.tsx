import { useMemo, useState } from 'react'
import Lightbox from '../components/Lightbox'
import SectionHead from '../components/SectionHead'
import Still from '../components/Still'
import { Reveal, Stagger } from '../components/Reveal'
import { galleryIds, GALLERY_CAPTIONS } from '../data/media'

/** A strip of site photographs with a link to the full Gallery page. */
export default function GalleryPreview() {
  const [open, setOpen] = useState<number | null>(null)
  const items = useMemo(() => galleryIds.map((id) => ({ id, caption: GALLERY_CAPTIONS[id] })), [])
  return (
    <section id="home-gallery" className="relative py-[clamp(36px,5vh,64px)] text-graphite" aria-labelledby="home-gallery-title">
      <div className="container-x">
        <SectionHead id="home-gallery-title" chip="Gallery" lines={['Inside the homes', "we've built."]} accent={['built.']} text="Foundations, framing, finishing and handover — a real look at how we build." />
        <Stagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-5" gap={0.07}>
          {galleryIds.slice(0, 8).map((id, i) => (
            <button key={id} type="button" onClick={() => setOpen(i)} className="group relative aspect-square overflow-hidden rounded-[24px] shadow-[0_24px_60px_-40px_rgba(40,60,110,0.6)]" aria-label={`View photograph: ${GALLERY_CAPTIONS[id]}`}>
              <Still id={id} className="h-full w-full !rounded-none transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.1]" />
            </button>
          ))}
        </Stagger>
        <Reveal className="mt-10 text-center">
          <a href="/gallery" className="btn-primary">View Full Gallery</a>
        </Reveal>
      </div>
      <Lightbox items={items} index={open} onIndex={setOpen} />
    </section>
  )
}
