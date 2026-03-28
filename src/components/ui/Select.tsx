import { clsx } from 'clsx'

type Props = React.SelectHTMLAttributes<HTMLSelectElement>

export default function Select({ className, children, ...props }: Props) {
  return (
    <select
      className={clsx(
        'w-full rounded-md border border-base-border bg-base-bg/40 px-3 py-2 text-sm text-text-primary outline-none focus:border-accent',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

