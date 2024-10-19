export const GetHourOffsetFromIsoInterval = (tzOffset?: string) => {
  return tzOffset ? Number(tzOffset.split(/[TH]/)[1]) : 0;
};
export const GetMinutesOffsetFromIsoInterval = (tzOffset?: string) => {
  return tzOffset ? Number(tzOffset.split(/H(\d+)M/)[1]) : 0;
};

export function getDateWithOffset(timezoneOffset: string, date: Date = new Date()): Date {
  const hour = date.getUTCHours() + GetHourOffsetFromIsoInterval(timezoneOffset);
  const minutes = date.getUTCMinutes() + GetMinutesOffsetFromIsoInterval(timezoneOffset);

  date.setUTCHours(hour, minutes);

  return date;
}
