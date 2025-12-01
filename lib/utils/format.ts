import { format as dateFnsFormat } from 'date-fns'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string, formatStr: string = 'MMM d, yyyy'): string {
  let dateObj: Date
  if (typeof date === 'string') {
    // Parse date string as local date to avoid timezone issues
    // e.g., "2025-12-01" should be Dec 1, not Nov 30 or Dec 2
    const [year, month, day] = date.split('-').map(Number)
    dateObj = new Date(year, month - 1, day)
  } else {
    dateObj = date
  }
  return dateFnsFormat(dateObj, formatStr)
}

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ')
}
