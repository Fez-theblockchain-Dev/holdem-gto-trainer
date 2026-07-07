import { SignUp } from '@clerk/clerk-react'
import { AuthLayout } from '../components/AuthLayout'

export function SignUpPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Start tracking leaks and training preflop GTO">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </AuthLayout>
  )
}
