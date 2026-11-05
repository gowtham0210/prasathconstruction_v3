import { useMemo, useState } from 'react'
import { Maximize2 } from 'lucide-react'
import Lightbox from './Lightbox'
import { GALLERY_CAPTIONS, STILLS } from '../data/media'

/** what a photograph shows: the site's own caption for gallery photographs, otherwise the description of the picture */
export const captionOf = (id: string) => (id.startsWith('g-') || GALLERY_CAPTIONS[id] ? GALLERY_CAPTIONS[id] : STILLS[id].alt)

/** A masonry wall of photographs at their own proportions. Clicking one opens the full-screen viewer over the whole set. */
export default function PhotoWall({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const items = useMemo(() => ids.map((id) => ({ id, caption: captionOf(id) })), [ids])
  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-5">
        {ids.map((id, i) => (
          <button key={id} type="button" onClick={() => setOpen(i)} className="group relative mb-4 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-[24px] bg-[#1e1e21] shadow-[0_24px_60px_-40px_rgba(0,0,0,0.8)] lg:mb-5" aria-label={`View photograph full size: ${captionOf(id)}`}>
            <img src={STILLS[id].image ?? `/images/${id}.jpg`} alt={STILLS[id].alt} loading="lazy" decoding="async" className="block h-auto w-full transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.05]" />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="pointer-events-none absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-graphite opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100"><Maximize2 size={15} aria-hidden="true" /></span>
          </button>
        ))}
      </div>
      <Lightbox items={items} index={open} onIndex={setOpen} />
    </>
  )
}
