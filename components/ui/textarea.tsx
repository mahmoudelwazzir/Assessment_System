import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121217] px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
