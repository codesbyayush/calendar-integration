export interface GoogleCalendarEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description?: string;
  location?: string;
  creator: {
    email: string;
    displayName?: string;
  };
  organizer: {
    email: string;
    displayName?: string;
  };
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  iCalUID: string;
  sequence: number;
  reminders: {
    useDefault: boolean;
  };
}

export const mockEvents: GoogleCalendarEvent[] = [
  {
    kind: "calendar#event",
    etag: '"3181161784712000"',
    id: "1",
    status: "confirmed",
    htmlLink: "https://www.google.com/calendar/event?eid=...",
    created: "2023-06-15T10:00:00.000Z",
    updated: "2023-06-15T10:00:00.000Z",
    summary: "Team Meeting",
    description: "Weekly team sync",
    location: "Conference Room A",
    creator: {
      email: "user@example.com",
      displayName: "User Name"
    },
    organizer: {
      email: "user@example.com",
      displayName: "User Name"
    },
    start: {
      dateTime: "2023-06-15T10:00:00+02:00",
      timeZone: "Europe/Paris"
    },
    end: {
      dateTime: "2023-06-15T11:00:00+02:00",
      timeZone: "Europe/Paris"
    },
    iCalUID: "1@google.com",
    sequence: 0,
    reminders: {
      useDefault: true
    }
  },
  {
    kind: "calendar#event",
    etag: '"3181161784712001"',
    id: "2",
    status: "confirmed",
    htmlLink: "https://www.google.com/calendar/event?eid=...",
    created: "2023-06-16T12:30:00.000Z",
    updated: "2023-06-16T12:30:00.000Z",
    summary: "Lunch with Client",
    description: "Discuss project requirements",
    location: "Cafe Nero",
    creator: {
      email: "user@example.com",
      displayName: "User Name"
    },
    organizer: {
      email: "user@example.com",
      displayName: "User Name"
    },
    start: {
      dateTime: "2023-06-16T12:30:00+02:00",
      timeZone: "Europe/Paris"
    },
    end: {
      dateTime: "2023-06-16T13:30:00+02:00",
      timeZone: "Europe/Paris"
    },
    iCalUID: "2@google.com",
    sequence: 0,
    reminders: {
      useDefault: true
    }
  },
  // Add more mock events as needed
];

export interface EventsResponse {
  kind: string;
  etag: string;
  summary: string;
  description: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  defaultReminders: any[];
  nextPageToken?: string;
  items: GoogleCalendarEvent[];
}

export const mockEventsResponse: EventsResponse = {
  kind: "calendar#events",
  etag: '"p32087bfmvurgg0g"',
  summary: "user@example.com",
  description: "",
  updated: "2023-06-16T12:30:00.000Z",
  timeZone: "Europe/Paris",
  accessRole: "owner",
  defaultReminders: [],
  items: mockEvents
};

