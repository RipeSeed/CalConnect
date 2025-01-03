import express, { Request, Response } from 'express';
import { AvailableCalendars, CalendarService } from '../../src/index';
import {
  CallbackQuery,
  EventsQuery,
  CreateEventBody,
  GoogleCredentials,
  CustomRequest,
} from './types';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Steps to get these:
// 1- Go to https://console.cloud.google.com/projectcreate and create a project
// 2- Go to https://console.cloud.google.com/apis/credentials, On the top click "Create Credentials" and select type "OAuth 2.0 Client IDs"
// 3- Add redirect URL of your backend application. For example, the API given below https://yourbackenddomain.com/api/google/callback
// 4- Copy ClientID and Client Server and paste them as below
const googleCredentials: GoogleCredentials = {
  clientId: '<your google client ID here>',
  clientSecret: '<your client secret here>',
  redirectUri:
    '<your redirect url i.e. the backend api endpoint to exchange authorization_code with AUTH TOKENS (i.e. AccessToken and RefreshToken) >',
};

// This will be the connection string of your mongoDB database
const dbConnectionString: string = 'mongodb://user:password@localhost:27017';

// Initialize Calendar Service
const calendarService = new CalendarService(
  AvailableCalendars.google,  // or simply 'google'
  googleCredentials,
  dbConnectionString,
);

// BELOW ARE THE EXAMPLES OF HOW YOU CAN USE CALENDAR SERVICES IN YOUR BACKEND CODE

// API ENDPOINT TO CONNECT TO GOOGLE CALENDAR
app.get('/api/connect', async (_req: Request, res: Response) => {
  const authUrl = calendarService.connect();
  res.send(authUrl);
});

// API ENDPOINT TO START THE CRON JOB
app.get('/api/start', async (_req: Request, res: Response) => {
  calendarService.startJob();
  res.send('Auto token update started!');
});

// API ENDPOINT TO STOP THE CRON JOB
app.get('/api/stop', async (_req: Request, res: Response) => {
  calendarService.stopJob();
  res.send('Auto token update stop!');
});

// API ENDPOINT FOR GOOGLE CALLBACK - to exchange authorization_code with AUTH TOKENS (i.e. AccessToken and RefreshToken)
app.get(
  '/api/google/callback',
  async (req: Request<{}, {}, {}, CallbackQuery>, res: Response) => {
    const { code } = req.query;
    const user_id = '123'; // replace it with your user id

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    try {
      const result = await calendarService.access(code, user_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

// API ENDPOINT TO GET EVENTS IN A CERTAIN RANGE OF TIME FROM THE GOOGLE CALENDAR
app.get(
  '/api/events',
  async (req: Request<{}, {}, {}, EventsQuery>, res: Response) => {
    try {
      const { startDate, endDate, timezone = 'UTC', calendarId } = req.query;

      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ error: 'Start date and end date are required' });
      }

      // replace this with your actual userID
      const userId = '123';

      const events = await calendarService.getEventsInRange(
        userId,
        startDate,
        endDate,
        timezone,
        calendarId,
      );

      res.json({
        success: true,
        data: events,
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({
        error: 'Failed to fetch events',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

// API ENDPOINT FOR CREATING AN EVENT IN THE GOOGLE CALENDAR
app.post(
  '/api/events',
  async (req: Request<{}, {}, CreateEventBody>, res: Response) => {
    try {
      const userId = '123';
      const {
        summary,
        start,
        end,
        timezone,
        description,
        attendees,
        calendarId,
      } = req.body;

      if (!summary || !start || !end || !timezone) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'Summary, start, end, and timezone are required',
        });
      }

      const eventId = await calendarService.createEvent(
        userId,
        summary,
        start,
        end,
        timezone,
        description,
        attendees,
        calendarId,
      );

      res.status(201).json({
        success: true,
        data: {
          eventId,
          message: 'Event created successfully',
        },
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({
        error: 'Failed to create event',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

const PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
