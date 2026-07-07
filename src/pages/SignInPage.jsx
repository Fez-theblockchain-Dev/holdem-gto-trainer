import { SignIn } from '@clerk/clerk-react'
import { AuthLayout } from '../components/AuthLayout'

export function SignInPage() {
  return (
    <AuthLayout title="Sign in to continue training" subtitle="Email, Google, or other providers you enable in Clerk">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </AuthLayout>
  )
}
