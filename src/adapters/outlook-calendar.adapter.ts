import { Client } from '@microsoft/microsoft-graph-client';
import { ICalendarCredentials } from '../types/calendar';
import { adjustTimeByTimezone } from '../utils/general';
import { CalendarAdapterBase } from './base-calendar.adapter';

export class OutlookCalendarAdapter extends CalendarAdapterBase {
  private client: Client;
  private credentials: ICalendarCredentials;

  constructor(credentials: ICalendarCredentials) {
    super();
    this.credentials = credentials;
    this.client = Client.init({
      authProvider: done => {
        done(null, credentials.accessToken);
      },
    });
  }

  // async getEventsInRange(startDate: string, endDate: string, timezone: string, calendarId = 'me') {
  //   try {
  //     const timezoneHandledStart = adjustTimeByTimezone(startDate, timezone);
  //     const timezoneHandledEnd = adjustTimeByTimezone(endDate, timezone);

  //     const events = await this.client
  //       .api(`/${calendarId}/events`)
  //       .filter(`start/dateTime ge '${timezoneHandledStart}' and end/dateTime le '${timezoneHandledEnd}'`)
  //       .select('start,end,subject')
  //       .orderby('start/dateTime')
  //       .get();

  //     console.log(events.value);

  //     events.value.forEach((event: any) => {
  //       console.log('-----------------------------------');
  //       console.log({
  //         start: (event.start.dateTime as string).replace('.0000000', 'Z'),
  //         end: (event.end.dateTime as string).replace('.0000000', 'Z'),
  //       });
  //       console.log('-----------------------------------');
  //     });

  //     return (
  //       events.value.map((event: any) => ({
  //         startDate: (event.start.dateTime as string).replace('.0000000', 'Z'),
  //         endDate: (event.end.dateTime as string).replace('.0000000', 'Z'),
  //       })) || []
  //     );
  //   } catch (error) {
  //     console.error('Error fetching events from Outlook:', error);
  //     throw new Error('Failed to fetch events from Outlook Calendar');
  //   }
  // }

  // async createEvent(
  //   summary: string,
  //   start: string,
  //   end: string,
  //   timezone: string,
  //   description?: string,
  //   attendees?: { email: string }[],
  //   calendarId_?: string,
  // ) {
  //   try {
  //     const calendarId = calendarId_ || 'me';
  //     const event = {
  //       subject: summary,
  //       start: {
  //         dateTime: start,
  //         timeZone: timezone,
  //       },
  //       end: {
  //         dateTime: end,
  //         timeZone: timezone,
  //       },
  //       body: {
  //         contentType: 'HTML',
  //         content: description || '',
  //       },
  //       attendees: attendees?.length
  //         ? attendees.map(val => {
  //             return {
  //               emailAddress: {
  //                 address: val.email,
  //                 name: '',
  //               },
  //             };
  //           })
  //         : [],
  //     };

  //     const createdEvent = await this.client.api(`/${calendarId}/events`).post(event);

  //     console.log(createdEvent);
  //     return 'Successfully booked.';
  //   } catch (error) {
  //     console.error('Error creating event in Outlook:', error);
  //     throw new Error('Failed to save the event in Outlook Calendar');
  //   }
  // }

  // async refreshAccessToken() {
  //   // NOT UTILIZING THE LIBRARY HERE BECAUSE IT DOESNT RETURN NEW REFRESH TOKEN
  //   try {
  //     if (!this.credentials.refreshToken) {
  //       throw new Error('Refresh token is missing. Unable to refresh access token.');
  //     }

  //     const url = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token';
  //     const body = new URLSearchParams({
  //       grant_type: 'refresh_token',
  //       client_id: this.credentials.clientId,
  //       refresh_token: this.credentials.refreshToken,
  //       scope: 'Calendars.ReadWrite User.Read offline_access',
  //     });

  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: body.toString(),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to refresh access token. Status: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     return {
  //       accessToken: data.access_token,
  //       refreshToken: data.refresh_token || this.credentials.refreshToken, // Use the new refresh token if available
  //     };
  //   } catch (error: any) {
  //     console.error('Error refreshing Microsoft Outlook access token:', error);
  //     if (error.name === 'InvalidGrantError') {
  //       console.error('The refresh token is invalid or has been revoked.');
  //     }

  //     throw error;
  //   }
  // }
}
