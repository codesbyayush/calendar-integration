import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { calendar_v3 } from "googleapis"
import { formatDate } from "@/lib/utils"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { format } from "date-fns"
import { Badge } from "./ui/badge"
import { MapPin, Clock, Users, Repeat, Calendar, LinkIcon } from "lucide-react"

interface EventModalProps {
  event: calendar_v3.Schema$Event
  children: React.ReactNode
}

export function EventModal({ event, children }: EventModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!event) return null

  const getRecurrenceInfo = (event: calendar_v3.Schema$Event) => {
    if (!event.isRecurring) return null
    return `${event.recurrencePeriod} until ${format(new Date(event.endDate), "PPP")}`
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            {event.isRecurring ? (
              <Repeat className="w-6 h-6 mr-2 text-blue-500" />
            ) : (
              <Calendar className="w-6 h-6 mr-2 text-green-500" />
            )}
            {event.summary || "Untitled Event"}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col mt-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>Start: {formatDate(event.start?.dateTime || event.start?.date)}</span>
              </div>
              <div className="flex items-center mt-1">
                <Clock className="w-4 h-4 mr-2" />
                <span>End: {formatDate(event.end?.dateTime || event.end?.date)}</span>
              </div>
              {event.start?.date && (
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>All-day event</span>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh]">
          {event.isRecurring && (
            <div className="mb-4 p-3 bg-muted rounded-md">
              <Badge variant="outline" className="text-xs text-green-600">
                <span className="mr-1 inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                Recurring
              </Badge>
              <p className="text-sm text-muted-foreground mt-1"> &nbsp;- &nbsp;{getRecurrenceInfo(event)}</p>
            </div>
          )}
          {event.description && (
            <div className="mb-4">
              <h4 className="font-semibold mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
          )}
          {event.location && (
            <div className="mb-4">
              <h4 className="font-semibold mb-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> Location
              </h4>
              <p className="text-sm text-muted-foreground">{event.location}</p>
            </div>
          )}
          {event.attendees && event.attendees.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-1 flex items-center">
                <Users className="w-4 h-4 mr-1" /> Attendees
              </h4>
              <ul className="text-sm text-muted-foreground">
                {event.attendees.map((attendee, index) => (
                  <li key={index}>{attendee.email}</li>
                ))}
              </ul>
            </div>
          )}
          {event.htmlLink && (
            <div className="mt-4">
              <a
                href={event.htmlLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-500 hover:underline"
              >
                <LinkIcon className="w-4 h-4 mr-1" /> View in Google Calendar
              </a>
            </div>
          )}
          {!event.description && !event.location && (!event.attendees || event.attendees.length === 0) && (
            <p className="text-sm text-muted-foreground">No additional details available for this event.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

