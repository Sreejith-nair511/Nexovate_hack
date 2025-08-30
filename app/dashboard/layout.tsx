'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sun, 
  Moon, 
  User, 
  LogOut,
  ChevronDown,
  Network,
  QrCode,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
  ExternalLink,
  Menu,
  X,
  Shield,
  Activity
} from "lucide-react"
import { useTheme } from "next-themes"
import AuthWrapper from '@/components/auth-wrapper'
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [selectedRole, setSelectedRole] = useState('patient')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const roles = [
    { value: 'patient', label: 'Patient', color: 'bg-blue-500' },
    { value: 'doctor', label: 'Doctor', color: 'bg-green-500' },
    { value: 'staff', label: 'Hospital Staff', color: 'bg-purple-500' },
    { value: 'auditor', label: 'Auditor', color: 'bg-orange-500' },
    { value: 'asha', label: 'ASHA Worker', color: 'bg-pink-500' }
  ]

  const quickAccessItems = [
    {
      title: 'Blockchain Explorer',
      icon: <Network className="w-5 h-5" />,
      path: '/dashboard/blockchain',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'QR Health Cards',
      icon: <QrCode className="w-5 h-5" />,
      path: '/dashboard/qr',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'SMS/USSD Access',
      icon: <MessageSquare className="w-5 h-5" />,
      path: '/dashboard/sms',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Insurance Claims',
      icon: <CreditCard className="w-5 h-5" />,
      path: '/dashboard/insurance',
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Compliance Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/dashboard/compliance',
      color: 'text-pink-600 dark:text-pink-400'
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('arogya_user')
    window.location.href = '/auth/login'
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
        {/* Left Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-64`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 lg:p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AR</span>
                </div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base">Quick Access</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-8 h-8 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Access Menu */}
            <div className="flex-1 p-3 lg:p-4 space-y-1 overflow-y-auto">
              {quickAccessItems.map((item, index) => (
                <Link key={index} href={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-14 lg:h-12 hover:bg-slate-100 dark:hover:bg-slate-700 text-left px-3"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`${item.color} flex-shrink-0`}>{item.icon}</span>
                    <span className="text-slate-700 dark:text-slate-300 text-sm lg:text-base truncate">{item.title}</span>
                  </Button>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                <Link href="/dashboard/settings">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-14 lg:h-12 hover:bg-slate-100 dark:hover:bg-slate-700 text-left px-3"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm lg:text-base">Settings</span>
                  </Button>
                </Link>
                
                <a 
                  href="https://trust-build-arogyasethu-5vyd.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-14 lg:h-12 hover:bg-slate-100 dark:hover:bg-slate-700 text-left px-3"
                  >
                    <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm lg:text-base">Trust & Security</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-slate-400 flex-shrink-0" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Top Navigation */}
          <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button & Logo */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden w-10 h-10 p-0"
                >
                  <Menu className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AR</span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                    Arogya Rakshak
                  </h1>
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
                {/* Role Selector */}
                <div className="relative hidden md:block">
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="appearance-none bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 sm:px-3 py-1.5 sm:py-2 pr-6 sm:pr-8 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400 pointer-events-none" />
                </div>

                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-9 h-9 sm:w-10 sm:h-10 p-0"
                >
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                {/* User Menu */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hidden sm:flex text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Logout
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-9 h-9 p-0 sm:hidden text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AuthWrapper>
  )
}
