import { clsx } from 'clsx'

type Props = React.SelectHTMLAttributes<HTMLSelectElement>

export default function Select({ className, children, ...props }: Props) {
  return (
    <select
      className={clsx(
        'w-full rounded-xl border border-base-border bg-base-surface/80 px-3 py-2.5 text-sm text-text-primary outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

