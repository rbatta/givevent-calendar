import { CalendarSetupProvider } from '@/lib/contexts/CalendarSetupContext'

export default function CalendarNewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CalendarSetupProvider>{children}</CalendarSetupProvider>
}
