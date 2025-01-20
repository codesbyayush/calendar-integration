import { Button } from '@/components/ui/button'

interface CalendarViewsProps {
  selectedView: 'day' | 'week' | 'month'
  onViewChange: (view: 'day' | 'week' | 'month') => void
}

export function CalendarViews({ selectedView, onViewChange }: CalendarViewsProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant={selectedView === 'day' ? 'default' : 'outline'}
        onClick={() => onViewChange('day')}
      >
        Day
      </Button>
      <Button
        variant={selectedView === 'week' ? 'default' : 'outline'}
        onClick={() => onViewChange('week')}
      >
        Week
      </Button>
      <Button
        variant={selectedView === 'month' ? 'default' : 'outline'}
        onClick={() => onViewChange('month')}
      >
        Month
      </Button>
    </div>
  )
}

