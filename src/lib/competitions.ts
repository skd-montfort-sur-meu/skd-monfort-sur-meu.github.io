const formatFr = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
const formatMonth = new Intl.DateTimeFormat('fr-FR', { month: 'long' });
const formatWeekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });

export interface CompetitionEvent {
  title: string;
  categories: string;
  date: string;
  time?: string;
  location?: string;
  address?: string;
  icon?: string;
}

export interface FormattedEvent extends CompetitionEvent {
  day: number;
  weekday: string;
  month: string;
  dateLabel: string;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatEvents(events: CompetitionEvent[]): FormattedEvent[] {
  return events
    .map((event) => {
      const d = new Date(`${event.date}T00:00:00`);
      return {
        ...event,
        day: d.getDate(),
        weekday: capitalize(formatWeekday.format(d)),
        month: capitalize(formatMonth.format(d)),
        dateLabel: formatFr.format(d),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function splitUpcomingPast(events: CompetitionEvent[], today: Date = new Date()): {
  upcoming: FormattedEvent[];
  past: FormattedEvent[];
} {
  const current = new Date(today);
  current.setHours(0, 0, 0, 0);
  const formatted = formatEvents(events);
  const upcoming = formatted.filter((e) => new Date(`${e.date}T00:00:00`) >= current);
  const past = formatted.filter((e) => new Date(`${e.date}T00:00:00`) < current);
  return { upcoming, past };
}