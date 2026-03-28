import * as PopoverPrimitive from '@radix-ui/react-popover'
import { clsx } from 'clsx'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger

export function PopoverContent({
  className,
  align = 'center',
  sideOffset = 8,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  sideOffset?: number
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={clsx(
          'z-50 rounded-2xl border border-base-border bg-base-surface/95 p-3 shadow-surface outline-none backdrop-blur',
          'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

