import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import type { calendar_v3 } from "googleapis"
import { EventModal } from "./event-modal"
import { Badge } from "./ui/badge"
import { Repeat, Calendar } from "lucide-react"

function formatEventDate(dateTime: { dateTime?: string; date?: string } | undefined): string {
  if (!dateTime) return "N/A"
  const date = dateTime.dateTime ? new Date(dateTime.dateTime) : new Date(dateTime.date as string)
  return format(date, "PPp")
}

interface EventTableProps {
  events: calendar_v3.Schema$Event[]
  page: number
}

const MAX_PAGE_SIZE = 10

function getEventEmoji(event: calendar_v3.Schema$Event) {
  if (event.isRecurring) return <Repeat className="w-4 h-4 text-blue-500" />
  return <Calendar className="w-4 h-4 text-green-500" />
}

export function EventTable({ events: rawevents, page }: EventTableProps) {
  const events = rawevents.slice(page * MAX_PAGE_SIZE, (page + 1) * MAX_PAGE_SIZE)

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-[30%]">Title</TableHead>
            <TableHead className="w-[20%]">Start</TableHead>
            <TableHead className="w-[20%]">End</TableHead>
            <TableHead className="w-[30%]">Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => (
            <EventModal event={event} key={event.id}>
              <TableRow
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
              >
                <TableCell className="font-medium">{event.summary || "Untitled Event"}

                </TableCell>
                <TableCell>{formatEventDate(event.start)}</TableCell>
                <TableCell>{formatEventDate(event.end)}</TableCell>
                <TableCell>


                  <div className="flex items-center justify-between">
                    <span>{event.location || "N/A"}</span>
                    {event.isRecurring && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        <span className="mr-1 inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                        Recurring
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </EventModal>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

