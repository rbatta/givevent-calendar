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
const NICE_AMOUNTS = [25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000, 2500, 3000, 5000]

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

  // Calculate inverse-log weights (smaller amounts get higher weights)
  const weights = tiers.map(amount => 1 / Math.log10(amount))
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

  // Calculate totals
  const subtotal = distribution.reduce((sum, t) => sum + (t.amount * t.count), 0)

  return {
    tiers: distribution,
    subtotal,
    grandPrize: grandPrizeAmount ? { amount: grandPrizeAmount, count: 1 } : null,
    total: subtotal + (grandPrizeAmount || 0),
    totalDays
  }
}
