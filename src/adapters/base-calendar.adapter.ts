import { ICredentials, Slot } from "../types/calender.js";

export abstract class CalendarAdapterBase {
  abstract connectDB(connectionString: string): Promise<void>;
  abstract connect(): string;
  abstract access(code: string, user_id: string): Promise<any>;
  abstract getEventsInRange(
    userId: string,
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
  abstract refreshAccessToken(userId: string): Promise<ICredentials>;
  abstract startJob(): void;
  abstract stopJob(): void;
}
