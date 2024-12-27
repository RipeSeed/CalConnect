# Calenderify

A reliable Node.js package for seamlessly integrating Google Calendar into your applications with TypeScript support.

## Features

- Multiple calendar support (only Google Calendar for now)
- Automatic refresh token management
- Event creation and retrieval with timezone support
- Date range querying


## Installation

```bash
npm install calenderify
```

## Quick Start

```typescript
import { CalendarService } from 'calenderify';

// Initialize the service
const calendarService = new CalendarService(
  'google',
  {
    clientId: 'your_client_id',
    clientSecret: 'your_client_secret',
    redirectUri: 'your_redirect_uri'
  },
  'your_database_connection_string'
);

// Get OAuth URL for authentication
const authUrl = calendarService.connect();

// Handle OAuth callback
const credentials = await calendarService.access(authCode, userId);

// Start refresh token background job
calendarService.startJob();

// Stop refresh token background job
calendarService.stopJob();
```

## API Reference

### Types

```typescript
interface GoogleCredentials {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

interface Slot {
    id: string;
    summary: string;
    start: string;
    end: string;
    timezone: string;
}

interface ICredentials {
    access_token: string;
    refresh_token: string;
    expiry_date: number;
}

interface Attendee {
    email: string;
}
```

### Constructor

```typescript
new CalendarService(
    'google',
    GoogleCredentials,
    connectionString
)
```

Parameters:
- `provider`: Currently only supports 'google'
- `credentials`: OAuth credentials object with clientId, clientSecret, and redirectUri
- `connectionString`: Database connection string for token storage

### Methods

#### `connect(): string`
Returns the OAuth URL for calendar provider authentication.

#### `access(code: string, userId: string): Promise<ICredentials>`
Handles OAuth callback and saves credentials.
- `code`: OAuth authorization code
- `userId`: Unique identifier for the user
- Returns: Promise resolving to credentials object

#### `getEventsInRange(userId: string, startDate: string, endDate: string, timezone?: string, calendarId?: string): Promise<Slot[]>`
Retrieves events within a specified date range.
- `userId`: User identifier
- `startDate`: Start date in ISO format
- `endDate`: End date in ISO format
- `timezone`: Optional timezone (default: UTC)
- `calendarId`: Optional specific calendar ID (default: primary)
- Returns: Promise resolving to array of Slot objects

#### `createEvent(userId: string, summary: string, start: string, end: string, timezone: string, description?: string, attendees?: Attendee[], calendarId?: string): Promise<string>`
Creates a new calendar event.
- `userId`: User identifier
- `summary`: Event title
- `start`: Start time in ISO format
- `end`: End time in ISO format
- `timezone`: Event timezone
- `description`: Optional event description
- `attendees`: Optional array of attendee objects
- `calendarId`: Optional specific calendar ID
- Returns: Promise resolving to created event ID

#### `refreshAccessToken(userId: string): Promise<ICredentials>`
Manually refresh access token for a user.
- `userId`: User identifier
- Returns: Promise resolving to updated credentials

#### `startJob(): void`
Starts the background job for automatic token refresh.

#### `stopJob(): void`
Stops the background token refresh job.

## Express.js Integration Example

```typescript
import express from 'express';
import { CalendarService } from 'calenderify';

const app = express();
app.use(express.json());

const calendarService = new CalendarService(
    'google',
    {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: 'http://localhost:3000/api/google/callback'
    },
    process.env.DATABASE_URL
);

// OAuth connection endpoint
app.get('/api/connect', (_req, res) => {
    const authUrl = calendarService.connect();
    res.send(authUrl);
});

// OAuth callback handler
app.get('/api/google/callback', async (req, res) => {
    try {
        const useId = 'unique_user_id'; // replace it with your user id
        const credentials = await calendarService.access(
            req.query.code as string,
            useId
        );
        res.json(credentials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get events endpoint
app.get('/api/events', async (req, res) => {
    try {
        const events = await calendarService.getEventsInRange(
            req.user.id,
            req.query.startDate as string,
            req.query.endDate as string,
            req.query.timezone as string
        );
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## Error Handling

The package throws typed errors for various scenarios:

```typescript
try {
    await calendarService.createEvent(/* ... */);
} catch (error) {
    if (error instanceof AuthenticationError) {
        // Handle authentication issues
    } else if (error instanceof ValidationError) {
        // Handle invalid input
    } else {
        // Handle other errors
    }
}
```

## Best Practices

1. Store sensitive credentials securely using environment variables
2. Always start the refresh token job after service initialization
3. Implement proper error handling for all async operations
4. Use TypeScript for better type safety and developer experience
5. Handle timezone conversions carefully
6. Stop the refresh job when shutting down your application

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

MIT

## Support

For issues and feature requests, please create an issue in the GitHub repository: [Calenderify Issues](https://github.com/your-username/calenderify/issues)