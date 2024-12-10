const adjustTimeByTimezone = (dateString: string, timezone: string): string => {
  // Parse the input date as UTC
  const utcDate = moment.utc(dateString);
  // Convert the UTC date to the target timezone
  const adjustedDate = utcDate.tz(timezone, true);
  // Convert back to UTC with the adjusted time
  return adjustedDate.utc().format();
};
