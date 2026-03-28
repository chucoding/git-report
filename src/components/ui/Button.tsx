import { clsx } from 'clsx'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export default function Button({
  className,
  variant = 'secondary',
  disabled,
  ...props
}: Props) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'hover:translate-y-[-1px] active:translate-y-0',
        variant === 'primary' &&
          'bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_18px_40px_rgba(2,8,23,0.14)]',
        variant === 'secondary' &&
          'border border-base-border bg-base-surface2/70 text-text-primary hover:bg-base-surface2',
        variant === 'ghost' &&
          'bg-transparent text-text-muted hover:bg-black/5 hover:text-text-primary',
        className
      )}
      {...props}
    />
  )
}

