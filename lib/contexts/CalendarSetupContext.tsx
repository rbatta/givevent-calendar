'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Charity } from '@/components/setup/CharityForm'
import type { AmountTier } from '@/components/setup/TierAdjuster'

interface CalendarSetupData {
  name: string
  year: number
  startDate: string
  endDate: string
  displayMode: 'card_grid' | 'calendar_view'
  charities: Charity[]
  totalBudget: number
  minAmount: number
  maxAmount: number
  tiers: AmountTier[]
}

interface CalendarSetupContextType {
  data: CalendarSetupData
  updateData: (updates: Partial<CalendarSetupData>) => void
  resetData: () => void
}

const defaultData: CalendarSetupData = {
  name: '',
  year: new Date().getFullYear(),
  startDate: `${new Date().getFullYear()}-12-01`,
  endDate: `${new Date().getFullYear()}-12-25`,
  displayMode: 'calendar_view',
  charities: [],
  totalBudget: 0,
  minAmount: 0,
  maxAmount: 0,
  tiers: [],
}

const CalendarSetupContext = createContext<CalendarSetupContextType>({
  data: defaultData,
  updateData: () => {},
  resetData: () => {},
})

export function CalendarSetupProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CalendarSetupData>(defaultData)

  const updateData = (updates: Partial<CalendarSetupData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const resetData = () => {
    setData(defaultData)
  }

  return (
    <CalendarSetupContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </CalendarSetupContext.Provider>
  )
}

export function useCalendarSetup() {
  return useContext(CalendarSetupContext)
}
