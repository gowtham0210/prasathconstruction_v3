import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { STILLS, type StillId } from '../data/media'
import { stillSrc } from './Still'
import { startScroll, stopScroll } from '../lib/smooth'

export interface LightboxItem {
  id: StillId
  caption?: string
}

interface Props {
  items: LightboxItem[]
  /** the photograph on show, or null when the viewer is closed */
  index: number | null
  /** called with the new photograph, or null to close */
  onIndex: (i: number | null) => void
  /** pause page scrolling while open (leave off when the page underneath already has scrolling paused) */
  lockScroll?: boolean
}

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Full-screen photograph viewer. Swipe or drag sideways, use the arrows, or the left / right keys (Home and End jump to the ends).
 * Escape, the close button or a tap on the dark background closes it.
 */
export default function Lightbox({ items, index, onIndex, lockScroll = true }: Props) {
  const open = index !== null
  const N = items.length
  const dir = useRef(1)
  const closeBtn = useRef<HTMLButtonElement | null>(null)

  const go = useCallback((to: number) => {
    if (index === null || N === 0) return
    const next = (to + N) % N
    dir.current = to >= index ? 1 : -1
    onIndex(next)
  }, [index, N, onIndex])

  // keys, page scroll lock, and focus back to where it was
  useEffect(() => {
    if (!open) return
    const before = document.activeElement as HTMLElement | null
    if (lockScroll) stopScroll()
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onIndex(null)
      else if (e.key === 'ArrowRight') go((index as number) + 1)
      else if (e.key === 'ArrowLeft') go((index as number) - 1)
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(N - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (lockScroll) startScroll()
      before?.focus?.()
    }
  }, [open, lockScroll, go, index, N, onIndex])

  // load the photographs either side so a swipe is instant
  useEffect(() => {
    if (index === null || N < 2) return
    ;[index + 1, index - 1].forEach((k) => { const im = new Image(); im.src = stillSrc(items[(k + N) % N].id) })
  }, [index, items, N])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -500) go((index as number) + 1)
    else if (info.offset.x > 70 || info.velocity.x > 500) go((index as number) - 1)
  }

  const cur = index !== null ? items[index] : null

  return (
    <AnimatePresence>
      {open && cur && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col bg-[#0c0b09]/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => onIndex(null)}
        >
          <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6" onClick={(e) => e.stopPropagation()}>
            <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium tabular-nums text-white/90">{(index as number) + 1} / {N}</span>
            <button ref={closeBtn} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-black" aria-label="Close" onClick={() => onIndex(null)}>
              <X size={18} strokeWidth={1.6} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-20">
            {N > 1 && (
              <>
                <button className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-white hover:text-black sm:h-12 sm:w-12" aria-label="Previous photograph" onClick={(e) => { e.stopPropagation(); go((index as number) - 1) }}>
                  <ArrowLeft size={18} strokeWidth={1.6} />
                </button>
                <button className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-white hover:text-black sm:h-12 sm:w-12" aria-label="Next photograph" onClick={(e) => { e.stopPropagation(); go((index as number) + 1) }}>
                  <ArrowRight size={18} strokeWidth={1.6} />
                </button>
              </>
            )}
            <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
              <motion.img
                key={index}
                src={stillSrc(cur.id)}
                alt={STILLS[cur.id].alt}
                draggable={false}
                custom={dir.current}
                variants={{ enter: (d: number) => ({ opacity: 0, x: 80 * d }), center: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: -80 * d }) }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease }}
                drag={N > 1 ? 'x' : false}
                dragSnapToOrigin
                dragElastic={0.35}
                onDragEnd={onDragEnd}
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full cursor-grab select-none rounded-[14px] object-contain shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] active:cursor-grabbing"
              />
            </AnimatePresence>
          </div>

          {cur.caption && (
            <div className="shrink-0 px-4 pb-5 pt-3 sm:px-6" onClick={(e) => e.stopPropagation()}>
              <p className="text-center text-sm text-white/85">{cur.caption}</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
