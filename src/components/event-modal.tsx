import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { calendar_v3 } from "googleapis"
import { formatDate } from "@/lib/utils"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Repeat, Calendar } from "lucide-react"

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
                    <DialogTitle className="flex items-center">
                        {event.isRecurring ? <Repeat className="w-5 h-5 mr-2" /> : <Calendar className="w-5 h-5 mr-2" />}
                        {event.summary}
                    </DialogTitle>
                    <DialogDescription>
                        <span className="flex items-center mt-2">
                            <Clock className="w-4 h-4 mr-2" />
                            {formatDate(event.start?.dateTime || event.start?.date)} -{" "}
                            {formatDate(event.end?.dateTime || event.end?.date)}
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-4 max-h-[60vh]">
                    {event.isRecurring && (
                        <div className="mb-4">
                            <Badge variant="secondary">Recurring Event</Badge>
                            <p className="text-sm text-muted-foreground mt-1">{getRecurrenceInfo(event)}</p>
                        </div>
                    )}
                    {event.description && (
                        <div className="mb-4">
                            <h4 className="font-semibold mb-1">Description</h4>
                            <p className="text-sm">{event.description}</p>
                        </div>
                    )}
                    {event.location && (
                        <div className="mb-4">
                            <h4 className="font-semibold mb-1 flex items-center">
                                <MapPin className="w-4 h-4 mr-1" /> Location
                            </h4>
                            <p className="text-sm">{event.location}</p>
                        </div>
                    )}
                    {event.attendees && event.attendees.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-semibold mb-1 flex items-center">
                                <Users className="w-4 h-4 mr-1" /> Attendees
                            </h4>
                            <ul className="text-sm">
                                {event.attendees.map((attendee, index) => (
                                    <li key={index}>{attendee.email}</li>
                                ))}
                            </ul>
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

