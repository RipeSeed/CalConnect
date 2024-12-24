# Calendar Integration Package

A robust Node.js package for seamless calendar integration, currently supporting Google Calendar with an extensible architecture for additional providers.

## Features

- Single sign-on authentication with providers
- Automatic refresh token management
- Event creation and retrieval
- Date range querying
- Timezone support
- Multiple calendar support
- Background job management for token refresh

## Installation

```bash
npm install calendar-integration-package
```

## Quick Start

```typescript
import { CalendarService } from 'calendar-integration-package';

// Initialize the service
const calendarService = new CalendarService(
  'google',
  {
    client_id: 'your_client_id',
    client_secret: 'your_client_secret',
    redirect_uri: 'your_redirect_uri'
  },
  'your_database_connection_string'
);

// Establish Connection and get OAuth URL
const authUrl = calendarService.connect();

// Handle OAuth callback
const credentials = await calendarService.access(authCode, userId);

// Start refresh token background job
calendarService.startJob();
```

## API Reference

### Constructor

```typescript
new CalendarService(provider, credentials, connectionString)
```

- `provider`: Calendar provider (currently supports 'google')
- `credentials`: OAuth credentials object
- `connectionString`: Database connection string for token storage

### Methods

#### `connect(): string`
Returns the OAuth URL for calendar provider authentication.

#### `access(code: string, user_id: string): Promise<any>`
Handles OAuth callback and saves credentials.
- `code`: OAuth authorization code
- `user_id`: Unique identifier for the user

#### `getEventsInRange(userId: string, startDate: string, endDate: string, timezone?: string, calendarId?: string): Promise<Slot[]>`
Retrieves events within a specified date range.
- `userId`: User identifier
- `startDate`: Start date in ISO format
- `endDate`: End date in ISO format
- `timezone`: Optional timezone (default: UTC)
- `calendarId`: Optional specific calendar ID

#### `createEvent(summary: string, start: string, end: string, timezone: string, description?: string, attendees?: { email: string }[], calendarId?: string): Promise<string>`
Creates a new calendar event.
- `userId`: User identifier
- `summary`: Event title
- `start`: Start time in ISO format
- `end`: End time in ISO format
- `timezone`: Event timezone
- `description`: Optional event description
- `attendees`: Optional array of attendee email objects
- `calendarId`: Optional specific calendar ID

#### `refreshAccessToken(userId: string): Promise<ICredentials>`
Manually refresh access token for a user.
- `userId`: User identifier

#### `startJob(): void`
Starts the background job for automatic token refresh.

#### `stopJob(): void`
Stops the background token refresh job.

## Types

### Slot
```typescript
interface Slot {
  id: string;
  summary: string;
  start: string;
  end: string;
  timezone: string;
}
```

### ICredentials
```typescript
interface ICredentials {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
}
```

## Usage Examples

### Getting Events
```typescript
const events = await calendarService.getEventsInRange(
  'user123',
  '2024-01-01T00:00:00Z',
  '2024-01-31T23:59:59Z',
  'America/New_York'
);
```

### Creating an Event
```typescript
const eventId = await calendarService.createEvent(
  'user123',
  'Team Meeting',
  '2024-01-15T10:00:00Z',
  '2024-01-15T11:00:00Z',
  'America/New_York',
  'Monthly team sync',
  [{ email: 'team@example.com' }]
);
```

## Error Handling

The package throws errors for:
- Unsupported calendar providers
- Invalid credentials
- Failed API requests
- Database connection issues

Handle errors appropriately in your application:

```typescript
try {
  await calendarService.createEvent(/*...*/);
} catch (error) {
  console.error('Failed to create event:', error.message);
}
```

## Best Practices

1. Always start the refresh token job after initialization
2. Handle timezone conversions carefully
3. Store user IDs securely
4. Implement proper error handling
5. Stop the refresh job when shutting down your application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and feature requests, please create an issue in the GitHub repository.