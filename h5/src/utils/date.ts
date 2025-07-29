import dayjs from 'dayjs'

export function getCurrentSeason(): string {
  return dayjs().format('YYYY-MM')
}

export function formatDate(date: Date | string): string {
  return dayjs(date).format('MM-DD HH:mm')
}

export function formatDateTime(date: Date | string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export function isSameSeason(date1: Date, date2: Date): boolean {
  return dayjs(date1).format('YYYY-MM') === dayjs(date2).format('YYYY-MM')
}

export function getSeasonStartDate(season: string): Date {
  return dayjs(season).startOf('month').toDate()
}

export function getSeasonEndDate(season: string): Date {
  return dayjs(season).endOf('month').toDate()
}