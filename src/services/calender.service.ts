import { CalendarAdapterBase } from "../adapters/base-calendar.adapter.js";
import { GoogleCalendarAdapter } from "../adapters/google-calendar.adapter.js";
import { OutlookCalendarAdapter } from "../adapters/outlook-calendar.adapter.js";
import { AvailableCalendars, ICredentials, Slot } from "../types/calender.js";

export class CalendarService {
  private adapter: CalendarAdapterBase;

  constructor(provider: string, credentials: any) {
    switch (provider) {
      case AvailableCalendars.google:
        this.adapter = new GoogleCalendarAdapter(credentials);
        break;
      // case AvailableCalendars.outlook:
      //   this.adapter = new OutlookCalendarAdapter(credentials);
      //   break;
      default:
        throw new Error("Unsupported calendar provider");
    }
  }

  connect(): string {
    return this.adapter.connect();
  }

  async access(code: string): Promise<any> {
    return this.adapter.access();
  }

  async getEventsInRange(
    startDate: string,
    endDate: string,
    timezone?: string,
    calendarId?: string,
  ): Promise<Slot[]> {
    return this.adapter.getEventsInRange(
      startDate,
      endDate,
      timezone,
      calendarId,
    );
  }
  async createEvent(
    summary: string,
    start: string,
    end: string,
    timezone: string,
    description?: string,
    attendees?: { email: string }[],
    calendarId?: string,
  ): Promise<string> {
    return this.adapter.createEvent(
      summary,
      start,
      end,
      timezone,
      description,
      attendees,
      calendarId,
    );
  }
  async refreshAccessToken(): Promise<ICredentials> {
    return this.adapter.refreshAccessToken();
  }
}
