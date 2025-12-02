import { format as dateFnsFormat } from 'date-fns'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Parse a date string (YYYY-MM-DD) as a local date, avoiding UTC timezone issues.
 * For example, "2025-12-01" will always be December 1st in local time,
 * not November 30th or December 2nd depending on timezone.
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Format a Date object as a local date string (YYYY-MM-DD), avoiding UTC timezone issues.
 * For example, a Date representing Dec 1 will always format as "2025-12-01",
 * not "2025-11-30" or "2025-12-02" depending on timezone.
 */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDate(date: Date | string, formatStr: string = 'MMM d, yyyy'): string {
  let dateObj: Date
  if (typeof date === 'string') {
    // Parse date string as local date to avoid timezone issues
    // e.g., "2025-12-01" should be Dec 1, not Nov 30 or Dec 2
    dateObj = parseLocalDate(date)
  } else {
    dateObj = date
  }
  return dateFnsFormat(dateObj, formatStr)
}

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ')
}
