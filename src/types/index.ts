export enum AvailableCalendars {
  google = "google",
}

export interface ICredentials {
  accessToken: string;
  refreshToken: string;
}

export interface EventResponse {
  message: string;
  eventId: string | null | undefined;
  eventLink: string | null | undefined;
}

export interface GoogleEvent {
  startDate: string;
  endDate: string;
  summary: string | null | undefined;
  description: string;
  location: string;
}

export interface Slot extends GoogleEvent {
  id: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    responseStatus?: string;
  }>;
}
