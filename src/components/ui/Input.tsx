import { clsx } from 'clsx'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export default function Input({ className, ...props }: Props) {
  return (
    <input
      className={clsx(
        'w-full rounded-md border border-base-border bg-base-bg/40 px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent',
        className
      )}
      {...props}
    />
  )
}

