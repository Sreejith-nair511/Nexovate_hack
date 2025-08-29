"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Users, FileText, Shield, Heart, Smartphone, QrCode, MessageSquare, CreditCard, BarChart3, Stethoscope, Building2, Network, Zap, Database, ArrowRight } from "lucide-react"
import Link from "next/link"

interface RoleCard {
  role: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  features: string[]
  path: string
}

const roleCards: RoleCard[] = [
  {
    role: 'patient',
    title: 'Patient Portal',
    description: 'Access your medical records, appointments, and health data securely on the blockchain.',
    icon: <Heart className="w-8 h-8" />,
    color: 'bg-blue-500',
    features: ['Medical Records', 'Appointments', 'Prescriptions', 'Health Reports'],
    path: '/dashboard/patient'
  },
  {
    role: 'doctor',
    title: 'Doctor Dashboard',
    description: 'Manage patient records, create prescriptions, and access medical histories.',
    icon: <Stethoscope className="w-8 h-8" />,
    color: 'bg-green-500',
    features: ['Patient Management', 'Prescriptions', 'Medical History', 'Consultations'],
    path: '/dashboard/doctor'
  },
  {
    role: 'staff',
    title: 'Hospital Staff',
    description: 'Administrative tools for managing hospital operations and patient data.',
    icon: <Building2 className="w-8 h-8" />,
    color: 'bg-purple-500',
    features: ['Patient Registration', 'Billing', 'Scheduling', 'Reports'],
    path: '/dashboard/staff'
  },
  {
    role: 'auditor',
    title: 'Compliance Auditor',
    description: 'Monitor compliance, audit trails, and ensure regulatory adherence.',
    icon: <Shield className="w-8 h-8" />,
    color: 'bg-orange-500',
    features: ['Audit Trails', 'Compliance Reports', 'Risk Assessment', 'Violations'],
    path: '/dashboard/auditor'
  },
  {
    role: 'asha',
    title: 'ASHA Worker',
    description: 'Community health worker tools for rural healthcare management.',
    icon: <Users className="w-8 h-8" />,
    color: 'bg-pink-500',
    features: ['Community Health', 'Patient Visits', 'Health Education', 'Data Collection'],
    path: '/dashboard/asha'
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
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">Welcome to Arogya Rakshak</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Secure, decentralized medical record management with blockchain technology for India.
        </p>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat, index) => (
          <Card key={index} className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access Features */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Quick Access Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAccessFeatures.map((feature, index) => (
            <Link key={index} href={feature.path}>
              <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
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

      {/* Role Selection */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Role-Based Access</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {roleCards.map((role, index) => (
            <Link key={index} href={role.path}>
              <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardHeader className={`${role.color} rounded-t-lg`}>
                  <CardTitle className="flex items-center gap-3 text-white">
                    {role.icon}
                    {role.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{role.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {role.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    Access {role.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
