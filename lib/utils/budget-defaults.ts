export function getBudgetDefaults(totalBudget: number): { minAmount: number; maxAmount: number } {
  if (totalBudget < 500) {
    return { minAmount: 10, maxAmount: 100 }
  } else if (totalBudget < 1000) {
    return { minAmount: 25, maxAmount: 200 }
  } else if (totalBudget < 5000) {
    return { minAmount: 50, maxAmount: 500 }
  } else if (totalBudget < 10000) {
    return { minAmount: 100, maxAmount: 1000 }
  } else {
    return { minAmount: 100, maxAmount: 2000 }
  }
}
