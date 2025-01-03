export interface CallbackQuery {
  code?: string;
}

export interface EventsQuery {
  startDate?: string;
  endDate?: string;
  timezone?: string;
  calendarId?: string;
}

export interface CreateEventBody {
  summary: string;
  start: string;
  end: string;
  timezone: string;
  description?: string;
  attendees?: { email: string }[];
  calendarId?: string;
}

export interface GoogleCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}
export interface OutlookCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}
