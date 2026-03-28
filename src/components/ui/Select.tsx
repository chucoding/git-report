import { clsx } from 'clsx'

type Props = React.SelectHTMLAttributes<HTMLSelectElement>

export default function Select({ className, children, ...props }: Props) {
  return (
    <select
      className={clsx(
        'w-full rounded-xl border border-base-border/80 bg-base-bg/30 px-3 py-2.5 text-sm text-text-primary outline-none transition focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/45',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

