/** Build Google Calendar deep links from event IDs or session details. */
export function calendarEventUrl(eventId: string): string {
  return `https://www.google.com/calendar/event?eid=${encodeURIComponent(eventId)}`;
}

export function createCalendarTemplateUrl(params: {
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  details?: string;
}): string {
  const { title, date, startTime = '09:00', endTime = '10:00', location, details } = params;
  const start = `${date.replace(/-/g, '')}T${startTime.replace(':', '')}00`;
  const end = `${date.replace(/-/g, '')}T${endTime.replace(':', '')}00`;
  const search = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
  });
  if (location) search.set('location', location);
  if (details) search.set('details', details);
  return `https://calendar.google.com/calendar/render?${search.toString()}`;
}

export function resolveCalendarUrl(session: { calendarEventUrl?: string; calendarEventId?: string }): string | null {
  if (session.calendarEventUrl) return session.calendarEventUrl;
  if (session.calendarEventId) return calendarEventUrl(session.calendarEventId);
  return null;
}
