import type { ReactNode } from 'react'

export type Tone = 'dark' | 'light'

/**
 * One section of the home page. The sections sit one under another inside a single dark frame (`.pn-frame`), divided by thin lines, each with a small label,
 * a serif heading and its content. `tone`, `next`, `prev` and `mark` are kept so older call sites still compile; they no longer change anything.
 */
export default function Band({ id, labelledby, children, className = '' }: { id: string; tone?: Tone; next?: Tone; prev?: Tone; labelledby: string; children: ReactNode; className?: string; mark?: boolean }) {
  return (
    <section id={id} data-tone="dark" aria-labelledby={labelledby} className={`relative overflow-hidden ${className}`}>
      {children}
    </section>
  )
}
