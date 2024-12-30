import {Client} from '@microsoft/microsoft-graph-client';
import {CalendarAdapterBase} from './base-calendar.adapter';
import {adjustTimeByTimezone} from '../utils/general';
import {ICalendarCredentials, ICredentials, Slot} from '../types/calender';
import {EventResponse} from '../types';
import {AsyncTask, SimpleIntervalJob, ToadScheduler} from 'toad-scheduler';
import mongoose, {Connection} from 'mongoose';
import {CalendarToken} from '../models/CalendarToken';

export class OutlookCalendarAdapter extends CalendarAdapterBase {
    private client: Client;
    private credentials: ICalendarCredentials;
    private connection: Connection | null = null;
    private scheduler = new ToadScheduler();
    private refreshInterval: string;

    constructor(credentials: ICalendarCredentials, connectionString: string, refreshInterval: string = '55 minute') {
        super();
        this.credentials = credentials;
        this.refreshInterval = refreshInterval;
        this.client = Client.init({
            authProvider: done => {
                done(null, credentials.accessToken);
            },
        });
        this.connectDB(connectionString);
    }

    async connectDB(connectionString: string): Promise<void> {
        if (!connectionString) {
            throw new Error('MongoDB connection string is not defined');
        }

        await mongoose.connect(connectionString);
        this.connection = mongoose.connection;

        this.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });

        this.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });
    }

    connect(): string {
        return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
            `client_id=${this.credentials.clientId}` +
            `&response_type=code` +
            `&response_mode=query` +
            `&redirect_uri=${encodeURIComponent(this.credentials.redirectUri)}` +
            `&state=${this.generateRandomState()}` +
            `&scope=${encodeURIComponent('Calendars.ReadWrite User.Read offline_access')}`;
    }

// Add this helper method to generate a random state
    private generateRandomState(): string {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }

    async access(code: string, userId: string): Promise<any> {
        try {
            const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
            const body = new URLSearchParams({
                client_id: this.credentials.clientId,
                scope: 'Calendars.ReadWrite User.Read offline_access',
                code: code,
                redirect_uri: this.credentials.redirectUri,
                grant_type: 'authorization_code',
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });

            if (!response.ok) {
                throw new Error(`Failed to get access token. Status: ${response.status}`);
            }

            const tokens = await response.json() as { access_token: string, refresh_token: string, expires_in: number };

            await CalendarToken.updateOne(
                { userId },
                {
                    userId,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expiryDate: new Date(Date.now() + tokens.expires_in * 1000),
                },
                { upsert: true }
            );

            return tokens;
        } catch (error) {
            console.error('Error in access:', error);
            throw error;
        }
    }

    async getEventsInRange(
        userId: string,
        startDate: string,
        endDate: string,
        timezone: string = 'UTC',
        calendarId: string = 'me'
    ): Promise<Slot[]> {
        try {
            const token = await CalendarToken.findOne({ userId });
            if (!token) {
                throw new Error('User not registered!');
            }

            this.client = Client.init({
                authProvider: done => {
                    done(null, token.accessToken);
                },
            });

            const timezoneHandledStart: string = adjustTimeByTimezone(startDate, timezone);
            const timezoneHandledEnd: string = adjustTimeByTimezone(endDate, timezone);

            const events = await this.client
                .api(`/${calendarId}/events`)
                .filter(`start/dateTime ge '${timezoneHandledStart}' and end/dateTime le '${timezoneHandledEnd}'`)
                .select('start,end,subject')
                .orderby('start/dateTime')
                .get();

            return events.value.map((event: any) => ({
                startDate: (event.start.dateTime as string).replace('.0000000', 'Z'),
                endDate: (event.end.dateTime as string).replace('.0000000', 'Z'),
                summary: event.subject
            }));
        } catch (error) {
            console.error('Error fetching events from Outlook:', error);
            throw new Error('Failed to fetch events from Outlook Calendar');
        }
    }

    async createEvent(
        userId: string,
        summary: string,
        start: string,
        end: string,
        timezone: string,
        description?: string,
        attendees?: { email: string }[],
        calendarId: string = 'me'
    ): Promise<EventResponse> {
        try {
            const token = await CalendarToken.findOne({ userId });
            if (!token) {
                throw new Error('User not registered!');
            }

            this.client = Client.init({
                authProvider: done => {
                    done(null, token.accessToken);
                },
            });

            const event = {
                subject: summary,
                start: {
                    dateTime: start,
                    timeZone: timezone,
                },
                end: {
                    dateTime: end,
                    timeZone: timezone,
                },
                body: {
                    contentType: 'HTML',
                    content: description || '',
                },
                attendees: attendees?.map(val => ({
                    emailAddress: {
                        address: val.email,
                        name: '',
                    },
                })) || [],
            };

            const response = await this.client.api(`/${calendarId}/events`).post(event);

            return {
                message: 'Event successfully booked.',
                eventId: response.id,
                eventLink: response.webLink
            };
        } catch (error) {
            console.error('Error creating event in Outlook:', error);
            throw new Error('Failed to save the event in Outlook Calendar');
        }
    }

    async refreshAccessToken(userId: string): Promise<ICredentials> {
        try {
            const token = await CalendarToken.findOne({ userId });
            if (!token) {
                throw new Error('User not registered!');
            }

            if (!token.refreshToken) {
                throw new Error('Refresh token is missing. Unable to refresh access token.');
            }

            const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
            const body = new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: this.credentials.clientId,
                refresh_token: token.refreshToken,
                scope: 'Calendars.ReadWrite User.Read offline_access',
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });

            if (!response.ok) {
                throw new Error(`Failed to refresh access token. Status: ${response.status}`);
            }

            const data = await response.json() as { access_token: string, refresh_token: string };

            // Need to update token here in database

            return {
                accessToken: data.access_token,
                refreshToken: data.refresh_token || token.refreshToken,
            };
        } catch (error) {
            console.error('Error refreshing access token:', error);
            throw error;
        }
    }

    startJob(): void {
        const task = new AsyncTask(
            'refresh-outlook-access-tokens',
            async () => {
                console.log('Starting scheduled token refresh for all Outlook users.');
                try {
                    const users = await CalendarToken.find();
                    for (const user of users) {
                        await this.refreshAccessToken(user.userId);
                    }
                } catch (error) {
                    console.error('Error refreshing tokens for all users:', error);
                }
            },
            (err: Error) => {
                console.error('Error occurred during scheduled token refresh:', err);
            }
        );

        const job = new SimpleIntervalJob(
            { milliseconds: parseInt(this.refreshInterval) * 60 * 1000 },
            task
        );

        this.scheduler.addSimpleIntervalJob(job);
        console.log('Token refresh job has been scheduled for Outlook calendar.');
    }

    stopJob(): void {
        this.scheduler.stop();
        console.log('All scheduled Outlook calendar jobs have been stopped.');
    }
}