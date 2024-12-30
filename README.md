# Calendar Integration Package

Seamlessly integrate calendar functionality into your Node.js applications with support for Google Calendar and an extensible architecture for additional providers.

## Key Features

- 🔐 Single sign-on authentication with providers
- 🔄 Automatic refresh token management with background jobs
- 📅 Comprehensive event management (create, retrieve, query)
- 🌍 Built-in timezone support
- 📚 Multiple calendar support
- 🏗️ Extensible architecture for additional providers

## Installation

```bash
npm install calendar-integration-package
```

## Importing the Package

### ESM (Recommended)
```javascript
import { CalendarService } from 'calendar-integration-package';
```

### CommonJS
```javascript
const { CalendarService } = require('calendar-integration-package');
```

## Example Usage

```javascript
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

// Get OAuth URL and establish connection
const authUrl = calendarService.connect();

// Handle OAuth callback
const credentials = await calendarService.access(authCode, userId);

// Create a calendar event
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

## Documentation

### Table of Contents

- [Initialization](#initialization)
- [Authentication](#authentication)
- [Event Management](#event-management)
- [Token Management](#token-management)
- [Background Jobs](#background-jobs)

### Initialization

#### CalendarService Constructor

Creates a new instance of the calendar service.

```typescript
new CalendarService(provider: string, credentials: ICredentials, connectionString: string)
```

**Parameters:**
- `provider`: Calendar provider name (currently supports 'google')
- `credentials`: OAuth credentials object containing:
    - `client_id`: OAuth client ID
    - `client_secret`: OAuth client secret
    - `redirect_uri`: OAuth redirect URI
- `connectionString`: Database connection string for token storage

### Authentication

#### connect()

Returns the OAuth URL for calendar provider authentication.

```typescript
calendarService.connect(): string
```

**Returns:** Authentication URL string

#### access()

Handles OAuth callback and saves credentials.

```typescript
calendarService.access(code: string, user_id: string): Promise<ICredentials>
```

**Parameters:**
- `code`: OAuth authorization code
- `user_id`: Unique identifier for the user

**Returns:** Promise resolving to credentials object

### Event Management

#### getEventsInRange()

Retrieves events within a specified date range.

```typescript
calendarService.getEventsInRange(
  userId: string,
  startDate: string,
  endDate: string,
  timezone?: string,
  calendarId?: string
): Promise<Slot[]>
```

**Parameters:**
- `userId`: User identifier
- `startDate`: Start date in ISO format
- `endDate`: End date in ISO format
- `timezone`: Optional timezone (default: UTC)
- `calendarId`: Optional specific calendar ID

**Returns:** Promise resolving to array of event slots

#### createEvent()

Creates a new calendar event.

```typescript
calendarService.createEvent(
  userId: string,
  summary: string,
  start: string,
  end: string,
  timezone: string,
  description?: string,
  attendees?: { email: string }[],
  calendarId?: string
): Promise<string>
```

**Parameters:**
- `userId`: User identifier
- `summary`: Event title
- `start`: Start time in ISO format
- `end`: End time in ISO format
- `timezone`: Event timezone
- `description`: Optional event description
- `attendees`: Optional array of attendee email objects
- `calendarId`: Optional specific calendar ID

**Returns:** Promise resolving to created event ID

### Token Management

#### refreshAccessToken()

Manually refresh access token for a user.

```typescript
calendarService.refreshAccessToken(userId: string): Promise<ICredentials>
```

**Parameters:**
- `userId`: User identifier

**Returns:** Promise resolving to updated credentials

### Background Jobs

#### startJob()

Starts the background job for automatic token refresh.

```typescript
calendarService.startJob(): void
```

#### stopJob()

Stops the background token refresh job.

```typescript
calendarService.stopJob(): void
```

## Error Handling

The package throws specific errors that you should handle in your application:

```javascript
try {
  await calendarService.createEvent(/* ... */);
} catch (error) {
  if (error.code === 'INVALID_CREDENTIALS') {
    // Handle invalid credentials
  } else if (error.code === 'API_ERROR') {
    // Handle API errors
  } else if (error.code === 'DATABASE_ERROR') {
    // Handle database connection issues
  } else {
    // Handle other errors
  }
}
```

## Best Practices

1. Always initialize the service with valid credentials
2. Start the refresh token job after initialization
3. Handle timezone conversions carefully
4. Implement proper error handling
5. Stop the refresh job when shutting down your application
6. Store user IDs securely
7. Use try-catch blocks around async operations

## Contributing

We welcome contributions to improve the Calendar Integration Package! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📦 [GitHub Issues](https://github.com/RipeSeed/calenders/issues)
- 📧 Email: dev@ripeseed.io.com
- 📚 [Documentation](https://github.com/RipeSeed/calenders/blob/main/README.md)