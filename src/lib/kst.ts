export function isValidIsoDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

export function kstRangeToUtcIso(fromDate: string, toDate: string): {
  sinceIso: string
  untilIso: string
  fromKstLabel: string
  toKstLabel: string
} {
  if (!isValidIsoDate(fromDate) || !isValidIsoDate(toDate)) {
    throw new Error('Invalid date')
  }

  const [fy, fm, fd] = fromDate.split('-').map(Number)
  const [ty, tm, td] = toDate.split('-').map(Number)

  const fromUtcMs = Date.UTC(fy, fm - 1, fd, 0, 0, 0) - 9 * 60 * 60 * 1000
  const toUtcMs = Date.UTC(ty, tm - 1, td, 23, 59, 0) - 9 * 60 * 60 * 1000

  if (Number.isNaN(fromUtcMs) || Number.isNaN(toUtcMs)) {
    throw new Error('Invalid date')
  }
  if (toUtcMs < fromUtcMs) {
    throw new Error('End date must be after start date')
  }

  const sinceIso = new Date(fromUtcMs).toISOString()
  const untilIso = new Date(toUtcMs).toISOString()
  return {
    sinceIso,
    untilIso,
    fromKstLabel: `${fromDate} 00:00`,
    toKstLabel: `${toDate} 23:59`
  }
}

