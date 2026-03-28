import { clsx } from 'clsx'

export default function Card({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={clsx(
        'relative overflow-hidden rounded-2xl border border-base-border bg-base-surface/55 p-5 shadow-surface backdrop-blur',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/5 before:opacity-90',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:bg-[radial-gradient(120%_90%_at_10%_0%,rgba(184,255,90,0.08),transparent_55%),radial-gradient(100%_80%_at_90%_10%,rgba(101,213,255,0.06),transparent_55%)]',
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </section>
  )
}
