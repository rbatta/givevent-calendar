// Fisher-Yates shuffle
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Distribute charities across days as evenly as possible
export function distributeCharities(
  charityIds: string[],
  numDays: number,
  grandPrizeCharityId?: string
): string[] {
  // Remove grand prize charity from regular distribution
  const regularCharities = grandPrizeCharityId
    ? charityIds.filter(id => id !== grandPrizeCharityId)
    : charityIds

  const daysToFill = grandPrizeCharityId ? numDays - 1 : numDays

  // Calculate how many times each charity should appear
  const baseCount = Math.floor(daysToFill / regularCharities.length)
  const remainder = daysToFill % regularCharities.length

  // Build array with each charity appearing the right number of times
  let assignments: string[] = []
  regularCharities.forEach((charityId, index) => {
    const count = baseCount + (index < remainder ? 1 : 0)
    for (let i = 0; i < count; i++) {
      assignments.push(charityId)
    }
  })

  // Shuffle the assignments
  return shuffle(assignments)
}

// Create the final day assignments
export function createDayAssignments(params: {
  dates: Date[]
  charityIds: string[]
  amounts: number[]
  grandPrizeCharityId?: string
  grandPrizeAmount?: number
}): Array<{ date: Date; charityId: string; amount: number; isGrandPrize: boolean }> {
  const { dates, charityIds, amounts, grandPrizeCharityId, grandPrizeAmount } = params

  // Shuffle amounts
  const shuffledAmounts = shuffle(amounts)

  // Distribute charities
  const charityAssignments = distributeCharities(charityIds, dates.length, grandPrizeCharityId)

  // Pick random day for grand prize
  const grandPrizeDayIndex = grandPrizeCharityId
    ? Math.floor(Math.random() * dates.length)
    : -1

  // Build assignments
  const assignments: Array<{ date: Date; charityId: string; amount: number; isGrandPrize: boolean }> = []

  let charityIndex = 0
  let amountIndex = 0

  dates.forEach((date, dayIndex) => {
    if (dayIndex === grandPrizeDayIndex && grandPrizeCharityId && grandPrizeAmount) {
      assignments.push({
        date,
        charityId: grandPrizeCharityId,
        amount: grandPrizeAmount,
        isGrandPrize: true
      })
    } else {
      assignments.push({
        date,
        charityId: charityAssignments[charityIndex++],
        amount: shuffledAmounts[amountIndex++],
        isGrandPrize: false
      })
    }
  })

  return assignments
}
