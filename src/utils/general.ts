import moment from "moment-timezone";

export const adjustTimeByTimezone = (dateString: string, timezone: string): string => {
  // Parse the input date as UTC
  const utcDate = moment.utc(dateString);
  // Convert the UTC date to the target timezone
  const adjustedDate = utcDate.tz(timezone, true);
  // Convert back to UTC with the adjusted time
  return adjustedDate.utc().format();
};

export function convertToMs(interval: string): number {
  const match = interval.match(/^(\d+)\s*(second|minute|hour|day)s?$/i);
  if (!match) throw new Error("Invalid interval format");

  const quantity = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  switch (unit) {
    case "second":
      return quantity * 1000;
    case "minute":
      return quantity * 1000 * 60;
    case "hour":
      return quantity * 1000 * 60 * 60;
    case "day":
      return quantity * 1000 * 60 * 60 * 24;
    default:
      throw new Error("Invalid time unit in interval");
  }
}
