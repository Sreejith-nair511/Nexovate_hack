'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Stethoscope, Building2, Search, Eye, EyeOff, ArrowRight, Heart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from 'next/navigation'

interface MockUser {
  id: string
  email: string
  password: string
  role: 'patient' | 'doctor' | 'staff' | 'auditor'
  name: string
  hospital?: string
}

// Mock database
const mockUsers: MockUser[] = [
  { id: '1', email: 'patient@demo.com', password: 'demo123', role: 'patient', name: 'Aarav Sharma' },
  { id: '2', email: 'doctor@demo.com', password: 'demo123', role: 'doctor', name: 'Dr. Priya Patel', hospital: 'Apollo Hospital Mumbai' },
  { id: '3', email: 'staff@demo.com', password: 'demo123', role: 'staff', name: 'Rajesh Kumar', hospital: 'AIIMS Delhi' },
  { id: '4', email: 'auditor@demo.com', password: 'demo123', role: 'auditor', name: 'Meera Singh', hospital: 'Health Ministry' },
]

const roleConfig = {
  patient: { icon: User, color: 'bg-blue-500', label: 'Patient' },
  doctor: { icon: Stethoscope, color: 'bg-green-500', label: 'Doctor' },
  staff: { icon: Building2, color: 'bg-purple-500', label: 'Hospital Staff' },
  auditor: { icon: Search, color: 'bg-orange-500', label: 'Auditor' },
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<keyof typeof roleConfig>('patient')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check credentials against mock database
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      // Store user session in localStorage
      const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hospital: user.hospital
      }
      localStorage.setItem('arogya_user', JSON.stringify(userSession))
      
      // Successful login - redirect to dashboard
      router.push('/dashboard')
    } else {
      setError('Invalid email or password')
    }

    setIsLoading(false)
  }

  const handleDemoLogin = (role: keyof typeof roleConfig) => {
    const demoUser = mockUsers.find(u => u.role === role)
    if (demoUser) {
      // Store user session in localStorage
      const userSession = {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        hospital: demoUser.hospital
      }
      localStorage.setItem('arogya_user', JSON.stringify(userSession))
      
      // Redirect to dashboard
      router.push('/dashboard')
    }
    setSelectedRole(role)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-white to-green-500 rounded-lg flex items-center justify-center border-2 border-orange-200">
              <Shield className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                Arogya Rakshak
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 -mt-1 transition-colors duration-300">Login Portal</p>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/" className="text-slate-600 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              ← Back to Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Login Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors duration-300">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
              Sign in to access your healthcare dashboard
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm transition-colors duration-300">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Login to Arogya Rakshak
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 transition-colors duration-300">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(roleConfig).map(([role, config]) => {
                      const Icon = config.icon
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSelectedRole(role as keyof typeof roleConfig)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                            selectedRole === role
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-slate-200 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-600'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 ${config.color} rounded-full flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
                              {config.label}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="transition-colors duration-300"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="pr-10 transition-colors duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm transition-colors duration-300">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="border-t border-slate-200 dark:border-slate-600 pt-6 transition-colors duration-300">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center transition-colors duration-300">
                  Quick Demo Access
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(roleConfig).map(([role, config]) => {
                    const Icon = config.icon
                    return (
                      <Button
                        key={role}
                        type="button"
                        variant="outline"
                        onClick={() => handleDemoLogin(role as keyof typeof roleConfig)}
                        className="p-2 h-auto flex flex-col gap-1 transition-colors duration-300"
                      >
                        <div className={`w-6 h-6 ${config.color} rounded-full flex items-center justify-center`}>
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs">{config.label}</span>
                      </Button>
                    )
                  })}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2 transition-colors duration-300">
                  All demo accounts use password: <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">demo123</code>
                </p>
              </div>

              {/* Signup Link */}
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Heart className="w-4 h-4 text-red-300" />
            <span className="font-semibold text-sm">Made by Team Final Commit for India 🇮🇳</span>
            <Heart className="w-4 h-4 text-red-300" />
          </div>
          <p className="text-orange-100 text-xs">
            Secure blockchain-powered healthcare authentication
          </p>
        </div>
      </footer>
    </div>
  )
}
