import { CalendarAdapterBase } from "../adapters/base-calendar.adapter.js";
import { GoogleCalendarAdapter } from "../adapters/google-calendar.adapter.js";
import { AvailableCalendars, ICredentials, Slot } from "../types/calender.js";
import { EventResponse } from "../types";
import {OutlookCalendarAdapter} from "../adapters/outlook-calendar.adapter";

/**
 * @class CalendarService
 *
 * A service for interacting with calendar providers, offering functionalities such as
 * connecting, authenticating, fetching events, creating events, and managing token refresh jobs.
 */
export class CalendarService {
  private adapter: CalendarAdapterBase;

  /**
   * @constructor
   * @param {string} provider - The calendar provider (e.g., "google").
   * @param {any} credentials - The credentials required to authenticate with the calendar provider.
   * @param {string} connectionString - The MongoDB connection string for storing tokens and user data.
   * @throws {Error} If an unsupported calendar provider is specified.
   */
  constructor(provider: string, credentials: any, connectionString: string) {
    switch (provider) {
      case AvailableCalendars.google:
        this.adapter = new GoogleCalendarAdapter(credentials, connectionString);
        break;
      case AvailableCalendars.outlook:
        this.adapter = new OutlookCalendarAdapter(credentials, connectionString);
        break;
      default:
        throw new Error("Unsupported calendar provider");
    }
  }

  /**
   * Generates an authorization URL to connect with the calendar provider.
   *
   * @returns {string} - The authorization URL.
   */
  connect(): string {
    return this.adapter.connect();
  }

  /**
   * Exchanges an authorization code for access and refresh tokens.
   *
   * @param {string} code - The authorization code received from the calendar provider.
   * @param {string} user_id - The unique identifier of the user.
   * @returns {Promise<any>} - The token response from the calendar provider.
   */
  async access(code: string, user_id: string): Promise<any> {
    return this.adapter.access(code, user_id);
  }

  /**
   * Fetches events from the calendar provider within a specific date range.
   *
   * @param {string} userId - The unique identifier of the user.
   * @param {string} startDate - The start date of the range (ISO 8601 format i.e. 2025-01-01T00:00:00Z) in UTC.
   * @param {string} endDate - The end date of the range (ISO 8601 format i.e. 2025-01-01T00:00:00Z) in UTC.
   * @param {string} [timezone] - The timezone for the events (default is UTC).
   * @param {string} [calendarId] - The ID of the calendar to fetch events from (optional).
   * @returns {Promise<Slot[]>} - A list of events within the specified range.
   */
  async getEventsInRange(
    userId: string,
    startDate: string,
    endDate: string,
    timezone?: string,
    calendarId?: string,
  ): Promise<Slot[]> {
    return this.adapter.getEventsInRange(userId, startDate, endDate, timezone, calendarId);
  }

  /**
   * Creates an event in the calendar provider.
   *
   * @param {string} userId - The unique identifier of the user.
   * @param {string} summary - A short description of the event.
   * @param {string} start - The start date and time of the event (ISO 8601 format i.e. 2025-01-01T00:00:00Z) in UTC.
   * @param {string} end - The end date and time of the event (ISO 8601 format i.e. 2025-01-01T00:00:00Z) in UTC.
   * @param {string} timezone - The timezone for the event.
   * @param {string} [description] - A detailed description of the event (optional).
   * @param {{ email: string }[]} [attendees] - A list of attendees' email addresses (optional).
   * @param {string} [calendarId] - The ID of the calendar to create the event in (optional).
   * @returns {Promise<EventResponse>} - The response after creating the event.
   */
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

  /**
   * Refreshes the access token for a user.
   *
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<ICredentials>} - The updated credentials with a refreshed access token.
   */
  async refreshAccessToken(userId: string): Promise<ICredentials> {
    return this.adapter.refreshAccessToken(userId);
  }

  /**
   * Starts a cron job to automatically refresh tokens at regular intervals.
   */
  startJob(): void {
    return this.adapter.startJob();
  }

  /**
   * Stops the cron job responsible for automatically refreshing tokens.
   */
  stopJob(): void {
    return this.adapter.stopJob();
  }
}
