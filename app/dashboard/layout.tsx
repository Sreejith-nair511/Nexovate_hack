"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import AuthWrapper from "@/components/auth-wrapper"
import { Shield, AlertTriangle, Menu, X, Wallet, User, Stethoscope, Building2, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const userRoles = {
  patient: { name: "Patient", icon: User, color: "bg-blue-500" },
  doctor: { name: "Doctor", icon: Stethoscope, color: "bg-green-500" },
  staff: { name: "Hospital Staff", icon: Building2, color: "bg-purple-500" },
  auditor: { name: "Auditor", icon: Search, color: "bg-orange-500" },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<keyof typeof userRoles>("patient")
  const pathname = usePathname()

  const navigation = [
    { name: "Patient View", href: "/dashboard/patient", icon: User, roles: ["patient"] },
    { name: "Doctor View", href: "/dashboard/doctor", icon: Stethoscope, roles: ["doctor"] },
    { name: "Hospital Staff", href: "/dashboard/staff", icon: Building2, roles: ["staff"] },
    { name: "Auditor View", href: "/dashboard/auditor", icon: Search, roles: ["auditor"] },
  ]

  const CurrentRoleIcon = userRoles[currentRole].icon

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 transition-colors duration-300">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>

                <Link href="/" className="flex items-center gap-2 ml-4 lg:ml-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">Arogya Rakshak</span>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Role Selector */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 ${userRoles[currentRole].color} rounded-full flex items-center justify-center`}
                  >
                    <CurrentRoleIcon className="w-4 h-4 text-white" />
                  </div>
                  <select
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value as keyof typeof userRoles)}
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-transparent border-none focus:outline-none transition-colors duration-300"
                  >
                    {Object.entries(userRoles).map(([key, role]) => (
                      <option key={key} value={key} className="bg-white dark:bg-slate-800">
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Wallet Connection */}
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 bg-transparent">
                  <Wallet className="w-4 h-4" />
                  <span className="font-mono text-xs">0x1234...5678</span>
                </Button>

                {/* Logout Button */}
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
