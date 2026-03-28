import { clsx } from 'clsx'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export default function Input({ className, ...props }: Props) {
  return (
    <input
      className={clsx(
        'w-full rounded-xl border border-base-border/80 bg-base-bg/30 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/45',
        className
      )}
      {...props}
    />
  )
}

