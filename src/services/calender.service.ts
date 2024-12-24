import { CalendarAdapterBase } from "../adapters/base-calendar.adapter.js";
import { GoogleCalendarAdapter } from "../adapters/google-calendar.adapter.js";
import { AvailableCalendars, ICredentials, Slot } from "../types/calender.js";
import { EventResponse } from "../types";

export class CalendarService {
  private adapter: CalendarAdapterBase;

  constructor(provider: string, credentials: any, connectionString: string) {
    switch (provider) {
      case AvailableCalendars.google:
        this.adapter = new GoogleCalendarAdapter(credentials, connectionString);
        break;
      default:
        throw new Error("Unsupported calendar provider");
    }
  }

  connect(): string {
    return this.adapter.connect();
  }

  async access(code: string, user_id: string): Promise<any> {
    return this.adapter.access(code, user_id);
  }

  async getEventsInRange(
    userId: string,
    startDate: string,
    endDate: string,
    timezone?: string,
    calendarId?: string,
  ): Promise<Slot[]> {
    return this.adapter.getEventsInRange(userId, startDate, endDate, timezone, calendarId);
  }
  async createEvent(
      userId: string,
      summary: string,
      start: string,
      end: string,
      timezone: string,
      description?: string,
      attendees?: { email: string }[],
      calendarId?: string,
  ): Promise<EventResponse> {
    return this.adapter.createEvent(userId, summary, start, end, timezone, description, attendees, calendarId);
  }
  async refreshAccessToken(userId: string): Promise<ICredentials> {
    return this.adapter.refreshAccessToken(userId);
  }
  startJob(): void {
    return this.adapter.startJob();
  }
  stopJob(): void {
    return this.adapter.stopJob();
  }
}
