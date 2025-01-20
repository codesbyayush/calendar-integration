'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon, XCircle } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { format, startOfToday } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateRangePickerProps {
  onChange: (start: Date, end: Date | null) => void
}

export function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfToday(),
    to: undefined
  })

  useEffect(() => {
    if (date?.from) {
      onChange(date.from, date.to || null)
    }
  }, [date, onChange])

  const handleReset = () => {
    const newDate = { from: startOfToday(), to: undefined }
    setDate(newDate)
    onChange(newDate.from, null)
  }

  return (
    <div className={cn('grid gap-2')}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                `${format(date.from, 'LLL dd, y')} - Open`
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="p-3 border-t border-border">
            <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
              <XCircle className="mr-2 h-4 w-4" />
              Reset to Today
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

