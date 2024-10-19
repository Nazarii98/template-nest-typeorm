export function parseTimeToInterval(timeStr: string): string {
  const [hoursStr, minutesStr] = timeStr.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error('Invalid time format');
  }

  return `0 years 0 mons 0 days ${hours} hours ${minutes} mins 0.0 secs`;
}
