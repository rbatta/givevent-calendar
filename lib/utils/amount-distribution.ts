interface TierDistribution {
  amount: number
  count: number
}

interface DistributionResult {
  tiers: TierDistribution[]
  subtotal: number
  grandPrize: { amount: number; count: 1 } | null
  total: number
  totalDays: number
}

// Nice donation amounts to use as tiers
const NICE_AMOUNTS = [1, 5, 10, 15, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000, 2500, 3000, 5000]

export function generateAmountTiers(params: {
  minAmount: number
  maxAmount: number
  totalDays: number
  totalBudget: number
  grandPrizeAmount?: number
}): DistributionResult {
  const { minAmount, maxAmount, totalDays, totalBudget, grandPrizeAmount } = params

  // Adjust for grand prize
  let availableBudget = totalBudget
  let availableDays = totalDays

  if (grandPrizeAmount) {
    availableBudget -= grandPrizeAmount
    availableDays -= 1
  }

  // Filter tier amounts to those within range
  const tiers = NICE_AMOUNTS.filter(a => a >= minAmount && a <= maxAmount)

  if (tiers.length === 0) {
    throw new Error('No valid tiers between min and max')
  }

  // Calculate weights using exponential decay
  // This creates a logarithmic distribution with more smaller amounts
  // Formula: weight = e^(-k * normalized_index)
  // where k controls the steepness (higher k = steeper curve)
  const k = 2.5 // Steepness factor
  const weights = tiers.map((_, i) => {
    const normalizedIndex = i / (tiers.length - 1) // 0 to 1
    return Math.exp(-k * normalizedIndex)
  })
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  // Initial distribution based on weights
  let distribution: TierDistribution[] = tiers.map((amount, i) => ({
    amount,
    count: Math.max(1, Math.round((weights[i] / totalWeight) * availableDays))
  }))

  // Adjust to match exact day count
  let currentDays = distribution.reduce((sum, t) => sum + t.count, 0)

  // First pass: match day count
  while (currentDays !== availableDays) {
    if (currentDays < availableDays) {
      // Add to lowest tier
      distribution[0].count += 1
    } else {
      // Remove from highest tier with count > 1
      for (let i = distribution.length - 1; i >= 0; i--) {
        if (distribution[i].count > 1) {
          distribution[i].count -= 1
          break
        }
      }
    }
    currentDays = distribution.reduce((sum, t) => sum + t.count, 0)
  }

  // Remove tiers with 0 count
  distribution = distribution.filter(t => t.count > 0)

  // Second pass: adjust to match exact budget
  let currentTotal = distribution.reduce((sum, t) => sum + (t.amount * t.count), 0)
  const MAX_ITERATIONS = 1000
  let iterations = 0

  while (currentTotal !== availableBudget && iterations < MAX_ITERATIONS) {
    iterations++
    const diff = availableBudget - currentTotal

    if (Math.abs(diff) < distribution[0].amount) {
      // Difference is smaller than smallest tier - adjust most common tier count
      const mostCommonIndex = distribution.reduce((maxIdx, tier, idx, arr) =>
        tier.count > arr[maxIdx].count ? idx : maxIdx, 0
      )

      if (diff > 0 && currentDays < availableDays) {
        distribution[mostCommonIndex].count += 1
      } else if (diff < 0 && distribution[mostCommonIndex].count > 1) {
        distribution[mostCommonIndex].count -= 1
      } else {
        // Can't adjust further without breaking constraints
        break
      }
    } else if (diff > 0) {
      // Need to add money - increase count of appropriate tier
      // Find largest tier we can afford to add
      const affordableTier = distribution.findLast(t => t.amount <= diff)
      if (affordableTier) {
        affordableTier.count += 1
      } else {
        // Add to smallest tier
        distribution[0].count += 1
      }
    } else {
      // Need to reduce money - decrease count of appropriate tier
      // Find largest tier we can remove
      const removableTier = distribution.findLast(t => t.count > 1 && t.amount <= Math.abs(diff))
      if (removableTier) {
        removableTier.count -= 1
      } else {
        // Remove from largest tier with count > 1
        for (let i = distribution.length - 1; i >= 0; i--) {
          if (distribution[i].count > 1) {
            distribution[i].count -= 1
            break
          }
        }
      }
    }

    currentTotal = distribution.reduce((sum, t) => sum + (t.amount * t.count), 0)
  }

  // Remove tiers with 0 count after budget adjustment
  distribution = distribution.filter(t => t.count > 0)

  // Final totals
  const subtotal = distribution.reduce((sum, t) => sum + (t.amount * t.count), 0)

  return {
    tiers: distribution,
    subtotal,
    grandPrize: grandPrizeAmount ? { amount: grandPrizeAmount, count: 1 } : null,
    total: subtotal + (grandPrizeAmount || 0),
    totalDays
  }
}
