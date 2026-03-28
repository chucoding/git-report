import { clsx } from 'clsx'

export default function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  return (
    <section
      className={clsx(
        'relative overflow-hidden rounded-2xl border border-base-border bg-base-surface/80 p-5 shadow-surface backdrop-blur',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/60 before:opacity-70',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:bg-[radial-gradient(120%_90%_at_10%_0%,rgba(14,165,233,0.14),transparent_58%),radial-gradient(100%_80%_at_90%_10%,rgba(132,204,22,0.12),transparent_60%)]',
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </section>
  )
}
