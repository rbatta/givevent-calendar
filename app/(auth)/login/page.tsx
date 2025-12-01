import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { Card } from '@/components/ui/Card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to your Givevent account
        </p>
        <LoginForm />
        <div className="mt-4 space-y-2">
          <p className="text-center text-sm text-gray-600">
            <Link href="/reset-password" className="text-blue-600 hover:text-blue-700 font-medium">
              Forgot password?
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
