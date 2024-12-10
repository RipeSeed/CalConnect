import { ICredentials, Slot } from "../types/calender.js";

export abstract class CalendarAdapterBase {
  abstract connect(): string;
  abstract access(code: string): Promise<any>;
  abstract getEventsInRange(
    startDate: string,
    endDate: string,
    timezone?: string,
    calendarId?: string,
  ): Promise<Slot[]>;
  abstract createEvent(
    summary: string,
    start: string,
    end: string,
    timezone: string,
    description?: string,
    attendees?: { email: string }[],
    calendarId?: string,
  ): Promise<string>;
  abstract refreshAccessToken(): Promise<ICredentials>;
}
