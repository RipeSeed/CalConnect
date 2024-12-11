export enum AvailableCalendars {
  google = "google",
}

export type Slot = { startDate: string; endDate: string };

export type Availability = Record<string, Slot[]>;

export interface ICalendarCredentials {
  accessToken: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface ICredentials {
  accessToken: string;
  refreshToken: string;
}
