"use client"

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
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AR</span>
                </div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">Quick Access</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Access Menu */}
            <div className="flex-1 p-4 space-y-2">
              {quickAccessItems.map((item, index) => (
                <Link key={index} href={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={item.color}>{item.icon}</span>
                    <span className="text-slate-700 dark:text-slate-300">{item.title}</span>
                  </Button>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                <Link href="/dashboard/settings">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">Settings</span>
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
                    className="w-full justify-start gap-3 h-12 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-slate-700 dark:text-slate-300">Trust & Security</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Top Navigation */}
          <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button & Logo */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AR</span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    Arogya Rakshak
                  </h1>
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-2 lg:gap-4">
                {/* Role Selector */}
                <div className="relative hidden sm:block">
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="appearance-none bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 pr-8 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-slate-400 pointer-events-none" />
                </div>

                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem('arogya_user')
                    window.location.href = '/auth/login'
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </Button>

                {/* NFT Health Identity Badge */}
                <Badge
                  variant="secondary"
                  className="hidden md:flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700 transition-colors duration-300"
                >
                  <Shield className="w-3 h-3" />
                  Health ID NFT
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out lg:transition-none`}
          >
            <div className="flex flex-col h-full pt-16 lg:pt-0">
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Emergency Alert */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-300 text-sm font-medium mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    Emergency Access
                  </div>
                  <p className="text-red-600 dark:text-red-400 text-xs">Hospital staff can override access in emergency situations</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </AuthWrapper>
  )
}
