import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { clerkPublishableKey, isClerkConfigured } from './lib/clerk'
import App from './App'
import { ProtectedRoute } from './components/ProtectedRoute'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { SetupClerkPage } from './pages/SetupClerkPage'

const clerkAppearance = {
  variables: {
    colorBackground: '#16212b',
    colorInputBackground: '#11202c',
    colorInputText: '#ffffff',
    colorText: '#ffffff',
    colorPrimary: '#ffd27a',
    colorTextSecondary: 'rgba(255,255,255,0.65)',
    borderRadius: '12px',
  },
  elements: {
    card: { background: '#16212b', border: '1px solid #233241', boxShadow: 'none' },
    headerTitle: { color: '#ffffff' },
    headerSubtitle: { color: 'rgba(255,255,255,0.65)' },
    socialButtonsBlockButton: {
      background: '#11202c',
      border: '1px solid #33485c',
      color: '#ffffff',
    },
    formButtonPrimary: { background: '#ffd27a', color: '#0f161d' },
  },
}

function AppRoutes() {
  if (!isClerkConfigured) {
    return (
      <Routes>
        <Route path="*" element={<SetupClerkPage />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function AppRouter() {
  if (!isClerkConfigured) {
    return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    )
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      appearance={clerkAppearance}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ClerkProvider>
  )
}
