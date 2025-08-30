"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Users, FileText, Shield, Heart, Smartphone, QrCode, MessageSquare, CreditCard, BarChart3, Stethoscope, Building2, Network, Zap, Database, ArrowRight } from "lucide-react"
import Link from "next/link"
import LedgerVisualization from "@/components/ledger-visualization"

interface RoleCard {
  role: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  features: string[]
  path: string
  users: string
}

const roleCards: RoleCard[] = [
  {
    role: 'patient',
    title: 'Patient Portal',
    description: 'Access your medical records, appointments, and health data securely on the blockchain.',
    icon: <Heart className="w-8 h-8" />,
    color: 'bg-blue-500',
    features: ['Medical Records', 'Appointments', 'Prescriptions', 'Health Reports'],
    path: '/dashboard/patient',
    users: '2,847'
  },
  {
    role: 'doctor',
    title: 'Doctor Dashboard',
    description: 'Manage patient records, create prescriptions, and access medical histories.',
    icon: <Stethoscope className="w-8 h-8" />,
    color: 'bg-green-500',
    features: ['Patient Management', 'Prescriptions', 'Medical History', 'Consultations'],
    path: '/dashboard/doctor',
    users: '1,234'
  },
  {
    role: 'staff',
    title: 'Hospital Staff',
    description: 'Administrative tools for managing hospital operations and patient data.',
    icon: <Building2 className="w-8 h-8" />,
    color: 'bg-purple-500',
    features: ['Patient Registration', 'Billing', 'Scheduling', 'Reports'],
    path: '/dashboard/staff',
    users: '567'
  },
  {
    role: 'auditor',
    title: 'Compliance Auditor',
    description: 'Monitor compliance, audit trails, and ensure regulatory adherence.',
    icon: <Shield className="w-8 h-8" />,
    color: 'bg-orange-500',
    features: ['Audit Trails', 'Compliance Reports', 'Risk Assessment', 'Violations'],
    path: '/dashboard/auditor',
    users: '89'
  },
  {
    role: 'asha',
    title: 'ASHA Worker',
    description: 'Community health worker tools for rural healthcare management.',
    icon: <Users className="w-8 h-8" />,
    color: 'bg-pink-500',
    features: ['Community Health', 'Patient Visits', 'Health Education', 'Data Collection'],
    path: '/dashboard/asha',
    users: '456'
  }
]

const systemStats = [
  { label: 'Total Patients', value: '2,847', icon: <Users className="w-5 h-5" />, color: 'text-blue-600' },
  { label: 'Medical Records', value: '15,293', icon: <FileText className="w-5 h-5" />, color: 'text-green-600' },
  { label: 'Blockchain Transactions', value: '45,821', icon: <Activity className="w-5 h-5" />, color: 'text-purple-600' },
  { label: 'Active Hospitals', value: '127', icon: <Building2 className="w-5 h-5" />, color: 'text-orange-600' }
]

const quickAccessFeatures = [
  {
    title: 'Blockchain Explorer',
    description: 'Real-time blockchain monitoring with Indian hospital nodes',
    icon: <Network className="w-6 h-6" />,
    path: '/dashboard/blockchain',
    color: 'bg-blue-500'
  },
  {
    title: 'QR Health Cards',
    description: 'Generate and scan patient QR health cards',
    icon: <QrCode className="w-6 h-6" />,
    path: '/dashboard/qr',
    color: 'bg-green-500'
  },
  {
    title: 'SMS/USSD Access',
    description: 'Rural healthcare access via SMS and USSD',
    icon: <MessageSquare className="w-6 h-6" />,
    path: '/dashboard/sms',
    color: 'bg-purple-500'
  },
  {
    title: 'Insurance Claims',
    description: 'Manage insurance claims and pre-authorization',
    icon: <CreditCard className="w-6 h-6" />,
    path: '/dashboard/insurance',
    color: 'bg-orange-500'
  },
  {
    title: 'Compliance Analytics',
    description: 'Hospital compliance tracking and analytics',
    icon: <BarChart3 className="w-6 h-6" />,
    path: '/dashboard/compliance',
    color: 'bg-pink-500'
  },
  {
    title: 'ZK-Proof System',
    description: 'Privacy-preserving verification system',
    icon: <Zap className="w-6 h-6" />,
    path: '/dashboard/blockchain?tab=zkproofs',
    color: 'bg-indigo-500'
  }
]

export default function DashboardHome() {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({})

  const handleFeatureClick = async (featureName: string) => {
    setIsLoading(true)
    setActionMessage(`Initializing ${featureName}...`)
    
    // Simulate loading and blockchain verification
    await new Promise(resolve => setTimeout(resolve, 1500))
    setActionMessage(`${featureName} loaded successfully!`)
    
    setTimeout(() => {
      setActionMessage('')
      setIsLoading(false)
    }, 2000)
  }

  const handleRoleAccess = async (roleTitle: string) => {
    setLoadingStates(prev => ({ ...prev, [roleTitle]: true }))
    
    // Simulate loading and authentication
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [roleTitle]: false }))
    }, 500)
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">Welcome to Arogya Rakshak</h1>
        <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Secure, decentralized medical record management with blockchain technology for India.
        </p>
        {actionMessage && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 font-medium">{actionMessage}</p>
          </div>
        )}
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {systemStats.map((stat, index) => (
          <Card key={index} className="shadow-lg border-0">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">{stat.label}</p>
                  <p className={`text-lg sm:text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                  <span className="text-slate-600 dark:text-slate-400 scale-75 sm:scale-100">
                    {stat.icon}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access Features */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 sm:mb-6">Quick Access Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quickAccessFeatures.map((feature, index) => (
            <Link key={index} href={feature.path}>
              <Card 
                className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer active:scale-95"
                onClick={() => handleFeatureClick(feature.title)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 ${feature.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                      <span className="scale-90 sm:scale-100">
                        {feature.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Live Ledger Visualization */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 sm:mb-6">Live Blockchain Ledger</h2>
        <LedgerVisualization />
      </div>

      {/* Role Access Cards */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 sm:mb-6">Role-Based Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {roleCards.map((role, index) => (
            <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${role.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                    <span className="scale-90 sm:scale-100">
                      {role.icon}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">{role.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{role.users} active users</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                  {role.description}
                </p>
                <Button 
                  className="w-full h-10 sm:h-11 text-sm sm:text-base active:scale-95 transition-transform"
                  onClick={() => handleRoleAccess(role.title)}
                  disabled={loadingStates[role.title]}
                >
                  {loadingStates[role.title] ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Accessing...
                    </>
                  ) : (
                    `Access ${role.title} Dashboard`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
