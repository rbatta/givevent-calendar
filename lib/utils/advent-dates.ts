import { subWeeks, getDay } from 'date-fns'

export function getChristianAdventDates(year: number): { start: Date; end: Date } {
  // Christmas is Dec 25
  const christmas = new Date(year, 11, 25)

  // Christmas Eve is the end of Advent
  const christmasEve = new Date(year, 11, 24)

  // Find what day of week Christmas is (0 = Sunday)
  const christmasDay = getDay(christmas)

  // Calculate the 4th Sunday before Christmas
  let fourthSundayBefore: Date

  if (christmasDay === 0) {
    // Christmas is Sunday, so 4th Sunday before is 4 weeks earlier
    fourthSundayBefore = subWeeks(christmas, 4)
  } else {
    // Find previous Sunday from Christmas
    const daysToSubtract = christmasDay
    const sundayBeforeChristmas = new Date(christmas)
    sundayBeforeChristmas.setDate(christmas.getDate() - daysToSubtract)
    // Go back 3 more weeks to get 4th Sunday
    fourthSundayBefore = subWeeks(sundayBeforeChristmas, 3)
  }

  return {
    start: fourthSundayBefore,
    end: christmasEve
  }
}
