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
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'hover:translate-y-[-1px] hover:brightness-105 active:translate-y-0',
        variant === 'primary' &&
          'bg-gradient-to-br from-accent to-accent2 text-base-bg shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_12px_30px_rgba(0,0,0,0.35)]',
        variant === 'secondary' &&
          'border border-base-border/80 bg-white/5 text-text-primary hover:bg-white/9',
        variant === 'ghost' &&
          'bg-transparent text-text-muted hover:bg-white/5 hover:text-text-primary',
        className
      )}
      {...props}
    />
  )
}

