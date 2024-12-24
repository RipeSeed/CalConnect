import { ICredentials, Slot } from "../types/calender.js";
import { EventResponse } from "../types";

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
      userId: string,
      summary: string,
      start: string,
      end: string,
      timezone: string,
      description?: string,
      attendees?: { email: string }[],
      calendarId?: string,
  ): Promise<EventResponse>;
  abstract refreshAccessToken(userId: string): Promise<ICredentials>;
  abstract startJob(): void;
  abstract stopJob(): void;
}
