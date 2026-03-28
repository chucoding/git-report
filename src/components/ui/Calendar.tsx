import { clsx } from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export default function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  labels,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={clsx('p-2', className)}
      labels={{
        labelNext: () => '다음 달',
        labelPrevious: () => '이전 달',
        labelMonthDropdown: () => '월 선택',
        labelYearDropdown: () => '연도 선택',
        ...labels
      }}
      classNames={{
        months: 'flex flex-col gap-4 sm:flex-row sm:gap-6',
        month: 'space-y-4',
        caption: 'flex items-center justify-between px-1',
        caption_label: 'font-display text-sm font-semibold text-text-primary',
        nav: 'flex items-center gap-1',
        nav_button:
          'inline-flex h-8 w-8 items-center justify-center rounded-xl border border-base-border bg-base-surface2/70 text-text-primary transition hover:bg-base-surface2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25',
        head_row: 'flex',
        head_cell: 'w-9 text-center text-[11px] font-medium text-text-muted',
        row: 'mt-2 flex w-full',
        cell: 'relative h-9 w-9 text-center text-sm',
        day: 'h-9 w-9 rounded-xl p-0 font-medium text-text-primary transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25',
        day_today:
          'bg-base-surface2/70 text-text-primary ring-1 ring-inset ring-primary/25',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary focus:bg-primary',
        day_outside: 'text-text-muted/60',
        day_disabled: 'text-text-muted/40 opacity-60',
        day_range_middle: 'bg-black/5 text-text-primary',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={{
        IconLeft: ({ className: iconClassName, ...iconProps }) => (
          <ChevronLeft className={clsx('h-4 w-4', iconClassName)} {...iconProps} />
        ),
        IconRight: ({ className: iconClassName, ...iconProps }) => (
          <ChevronRight
            className={clsx('h-4 w-4', iconClassName)}
            {...iconProps}
          />
        )
      }}
      {...props}
    />
  )
}

