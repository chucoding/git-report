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
        'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:brightness-110',
        variant === 'primary' &&
          'bg-accent text-base-bg hover:brightness-110',
        variant === 'secondary' &&
          'bg-white/5 text-text-primary hover:bg-white/10',
        variant === 'ghost' &&
          'bg-transparent text-text-muted hover:bg-white/5 hover:text-text-primary',
        className
      )}
      {...props}
    />
  )
}

