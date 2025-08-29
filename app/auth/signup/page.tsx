'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Stethoscope, Building2, Search, Eye, EyeOff, ArrowRight, Heart, CheckCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from 'next/navigation'

const roleConfig = {
  patient: { icon: User, color: 'bg-blue-500', label: 'Patient', description: 'Access your medical records and health reports' },
  doctor: { icon: Stethoscope, color: 'bg-green-500', label: 'Doctor', description: 'Manage patient records and create prescriptions' },
  staff: { icon: Building2, color: 'bg-purple-500', label: 'Hospital Staff', description: 'Administrative access to hospital systems' },
  auditor: { icon: Search, color: 'bg-orange-500', label: 'Auditor', description: 'Review and audit medical records for compliance' },
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as keyof typeof roleConfig
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate successful signup
    setSuccess(true)
    
    // Auto redirect after 3 seconds
    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)

    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 shadow-2xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm transition-colors duration-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors duration-300">
              Account Created Successfully!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 transition-colors duration-300">
              Welcome to Arogya Rakshak, {formData.name}! Your {roleConfig[formData.role].label.toLowerCase()} account has been created.
            </p>
            <div className="bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-900/20 dark:to-green-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 mb-4 transition-colors duration-300">
              <p className="text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300">
                Redirecting to login page in 3 seconds...
              </p>
            </div>
            <Link href="/auth/login">
              <Button className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
              <p className="text-xs text-slate-600 dark:text-slate-400 -mt-1 transition-colors duration-300">Create Account</p>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth/login" className="text-slate-600 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Signup Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors duration-300">
              Join Arogya Rakshak
            </h1>
            <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
              Create your account to access blockchain-powered healthcare
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm transition-colors duration-300">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Create Your Account
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 transition-colors duration-300">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(roleConfig).map(([role, config]) => {
                      const Icon = config.icon
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleInputChange('role', role)}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                            formData.role === role
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-slate-200 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${config.color} rounded-full flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
                                {config.label}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                                {config.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="transition-colors duration-300"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
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
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a strong password"
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

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="pr-10 transition-colors duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm transition-colors duration-300">
                    {error}
                  </div>
                )}

                {/* Signup Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center border-t border-slate-200 dark:border-slate-600 pt-6 transition-colors duration-300">
                <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors">
                    Sign in here
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
            Join the blockchain healthcare revolution
          </p>
        </div>
      </footer>
    </div>
  )
}
