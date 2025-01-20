"use server"
import { Session } from "next-auth";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { auth } from '@/auth'

export async function getCalendarEvents(props: { startDate?: string, endDate?: string, pageToken?: string }) {
    try {
        const session = await auth();
        if (!session?.accessToken) {
            throw new Error("Access token is missing");
        }

        const auth1 = new OAuth2Client();
        auth1.setCredentials({ access_token: session.accessToken });

        const calendar = google.calendar({ version: "v3", auth: auth1 });

        const params: any = {
            calendarId: 'primary',
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 10,
            timeMin: new Date().toISOString(),
          };
      
          if (props?.startDate) {
            params.timeMin = new Date(props.startDate).toISOString();
          }
      
          if (props?.endDate) {
            params.timeMax = new Date(props.endDate).toISOString();
          }
      
        if (props?.pageToken) {
              console.log("there's a page token")
            params.pageToken = props.pageToken; 
          }
        const response = await calendar.events.list(params);
        console.log(response.data)
        return {events: processEvents(response.data.items) || [], nextPageToken: response.data.nextPageToken, hasNext: response.data.nextPageToken ? true : false};
    } catch (error) {
        console.error("Error fetching calendar events:", error);
        return {events: [], nextPageToken: null, hasNext: false};
    }
} 

function processEvents(events) {
  const eventMap = new Map();

  events.forEach(event => {
    const endDate = new Date(event.end.dateTime || event.end.date);

    if (event.recurringEventId) {
      if (!eventMap.has(event.recurringEventId)) {
        eventMap.set(event.recurringEventId, {
          ...event,
          isRecurring: true,
          recurrencePeriod: 'daily',
          endDate: endDate,
        });
      } else {
        const existingEvent = eventMap.get(event.recurringEventId);
        if (endDate > existingEvent.endDate) {
          existingEvent.endDate = endDate;
        }
      }
    } else {
      eventMap.set(event.id, { ...event, isRecurring: false });
    }
  });

  return Array.from(eventMap.values());
}