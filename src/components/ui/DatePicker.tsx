import { clsx } from 'clsx'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'

import Calendar from './Calendar'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

export default function DatePicker({
  value,
  onChange,
  placeholder = '날짜 선택',
  disabled
}: {
  value: string
  onChange: (isoDate: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  const parsed = value ? parseISO(value) : undefined
  const selected =
    parsed && Number.isFinite(parsed.getTime()) ? parsed : undefined

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={clsx(
            'flex w-full items-center justify-between gap-3 rounded-xl border border-base-border bg-base-surface/80 px-3 py-2.5 text-left text-sm text-text-primary transition',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25',
            disabled
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-base-surface'
          )}
        >
          <span className={clsx(!value && 'text-text-muted')}>
            {value ? value : placeholder}
          </span>
          <CalendarDays className="h-4 w-4 text-text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-2">
        <Calendar
          mode="single"
          locale={ko}
          selected={selected}
          onSelect={(d) => {
            if (!d) return
            onChange(format(d, 'yyyy-MM-dd'))
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

