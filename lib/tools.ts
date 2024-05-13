import { format } from 'date-fns';

export function minutesToTimeString(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}小时${remainingMinutes}分钟`;
}

export function formatDate(date: Date | string) {
  return format(date, 'yyyy-MM-dd HH:mm');
}
