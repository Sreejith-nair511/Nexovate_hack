'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface AuthWrapperProps {
  children: React.ReactNode
  requiredRole?: 'patient' | 'doctor' | 'staff' | 'auditor' | 'asha'
}

interface User {
  id: string
  name: string
  email: string
  role: 'patient' | 'doctor' | 'staff' | 'auditor' | 'asha'
  hospital?: string
}

export default function AuthWrapper({ children, requiredRole }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('arogya_user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('arogya_user')
      }
    }
    setLoading(false)
  }, [])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-center">
              You must be logged in to access the Arogya Rakshak dashboard. Please sign in to continue.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-sm font-medium mb-2">
                <Shield className="w-4 h-4" />
                Secure Healthcare Platform
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                All medical records are protected by blockchain encryption and require proper authentication.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/auth/login" className="block">
                <Button className="w-full" size="lg">
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/auth/signup" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Create Account
                </Button>
              </Link>
              
              <Link href="/" className="block">
                <Button variant="ghost" className="w-full text-slate-600 dark:text-slate-400">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check role-based access if required
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-center">
              You don't have permission to access this section. This area is restricted to {requiredRole} users only.
            </p>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <p className="text-orange-700 dark:text-orange-300 text-sm">
                <strong>Current Role:</strong> {user.role}<br />
                <strong>Required Role:</strong> {requiredRole}
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard" className="block">
                <Button className="w-full" size="lg">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={() => {
                  localStorage.removeItem('arogya_user')
                  router.push('/auth/login')
                }}
              >
                Switch Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authenticated and has proper role access
  return <>{children}</>
}
