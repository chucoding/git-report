import { clsx } from 'clsx'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export default function Input({ className, ...props }: Props) {
  return (
    <input
      className={clsx(
        'w-full rounded-xl border border-base-border bg-base-surface/80 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25',
        className
      )}
      {...props}
    />
  )
}

