import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { LandingNav } from '@/components/LandingNav'
import { CreateCalendarButton } from '@/components/CreateCalendarButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
      <nav className="p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-green-700 cursor-pointer">Givevent</h1>
          </Link>
          <LandingNav />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Turn Your Holiday Season Into
            <br />
            <span className="text-green-600">A Journey of Giving</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Create a personalized advent calendar where each day reveals a charity
            and donation amount. Make giving fun, meaningful, and impactful.
          </p>
          <CreateCalendarButton />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Your Dates</h3>
            <p className="text-gray-600">
              Traditional advent, full December, or create your own custom range
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❤️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pick Your Charities</h3>
            <p className="text-gray-600">
              Select international, national, and local organizations you care about
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎁</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Set Your Budget</h3>
            <p className="text-gray-600">
              Define your total budget and donation range - we'll handle the rest
            </p>
          </div>
        </div>

        <div className="mt-20 bg-white rounded-2xl shadow-lg p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to make a difference?</h3>
          <p className="text-gray-600 mb-6 text-lg">
            Join others in transforming the holiday season into a celebration of giving
          </p>
          <Link href="/signup">
            <Button size="lg">Start Your Journey</Button>
          </Link>
        </div>
      </main>

      <footer className="mt-20 py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>Givevent - Make every day count</p>
        </div>
      </footer>
    </div>
  )
}
