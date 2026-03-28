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
        'rounded-xl border border-base-border bg-base-surface/60 p-4 shadow-sm backdrop-blur',
        className
      )}
    >
      {children}
    </section>
  )
}

