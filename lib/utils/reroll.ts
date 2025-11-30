const MAX_CHARITY_REROLLS = 2
const MAX_AMOUNT_REROLLS = 2

export function canRerollCharity(rerollsUsed: number, isGrandPrize: boolean): boolean {
  return !isGrandPrize && rerollsUsed < MAX_CHARITY_REROLLS
}

export function canRerollAmount(rerollsUsed: number, isGrandPrize: boolean): boolean {
  return !isGrandPrize && rerollsUsed < MAX_AMOUNT_REROLLS
}

// Get a different random charity from the list
export function getNewCharity(
  currentCharityId: string,
  allCharityIds: string[],
  grandPrizeCharityId?: string
): string {
  const available = allCharityIds.filter(
    id => id !== currentCharityId && id !== grandPrizeCharityId
  )

  if (available.length === 0) {
    throw new Error('No other charities available')
  }

  return available[Math.floor(Math.random() * available.length)]
}

// Swap amounts between two days (current revealed day and a random unrevealed day)
export function swapAmounts(
  currentDayId: string,
  currentAmount: number,
  unrevealedDays: Array<{ id: string; amount: number }>
): { targetDayId: string; newAmount: number } {
  if (unrevealedDays.length === 0) {
    throw new Error('No unrevealed days to swap with')
  }

  const targetDay = unrevealedDays[Math.floor(Math.random() * unrevealedDays.length)]

  return {
    targetDayId: targetDay.id,
    newAmount: targetDay.amount
  }
}
