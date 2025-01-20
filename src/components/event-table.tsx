import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import type { calendar_v3 } from "googleapis"
import { EventModal } from "./event-modal"
import { Badge } from "@/components/ui/badge"
import { Repeat, Calendar } from "lucide-react"

interface EventTableProps {
  events: calendar_v3.Schema$Event[]
  page: number
}

const MAX_PAGE_SIZE = 10

function getEventEmoji(event: calendar_v3.Schema$Event) {
  if (event.isRecurring) return <Repeat className="w-4 h-4 mr-1" />
  return <Calendar className="w-4 h-4 mr-1" />
}

function getEventColor(event: calendar_v3.Schema$Event) {
  if (event.isRecurring) return "border-l-4 border-blue-500"
  return "border-l-4 border-green-500"
}

export function EventTable({ events: rawevents, page }: EventTableProps) {
  const events = rawevents.slice(page * MAX_PAGE_SIZE, (page + 1) * MAX_PAGE_SIZE)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Location</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <EventModal event={event} key={event.id} isOpen={false} onClose={() => { }}>
            <TableRow className={`cursor-pointer relative ${getEventColor(event)}`}>
              <TableCell>
                <div className="flex items-center">
                  {getEventEmoji(event)}
                  {event.summary}
                </div>
              </TableCell>
              <TableCell>{event.start?.date ? format(new Date(event.start.date), "PPp") : "N/A"}</TableCell>
              <TableCell>{event.end?.date ? format(new Date(event.end.date), "PPp") : "N/A"}</TableCell>
              <TableCell>{event.description || "N/A"}</TableCell>
              <TableCell>
                {event.location || "N/A"}
                {event.isRecurring && (
                  <Badge variant="secondary" className="ml-2">
                    Recurring
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          </EventModal>
        ))}
      </TableBody>
    </Table>
  )
}

