"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Stethoscope, Building2, Search, ArrowRight, Shield, Activity, FileText, Users } from "lucide-react"
import Link from "next/link"

export default function DashboardHome() {
  const roles = [
    {
      title: "Patient Dashboard",
      description: "Upload encrypted files, manage access permissions, and view your medical record history",
      icon: User,
      href: "/dashboard/patient",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
    {
      title: "Doctor Dashboard",
      description: "Access authorized patient records, decrypt files, and request additional permissions",
      icon: Stethoscope,
      href: "/dashboard/doctor",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    {
      title: "Hospital Staff Panel",
      description: "Emergency override access for critical medical situations with full audit logging",
      icon: Building2,
      href: "/dashboard/staff",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
    },
    {
      title: "Auditor View",
      description: "Comprehensive access monitoring, compliance reporting, and audit trail analysis",
      icon: Search,
      href: "/dashboard/auditor",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
    },
  ]

  const systemStats = {
    totalRecords: 15847,
    activeUsers: 342,
    emergencyAccesses: 23,
    auditLogs: 8934,
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Welcome to Arogya Rakshak</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Secure, decentralized medical record management with blockchain technology. Choose your role to access the
          appropriate dashboard.
        </p>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Records</p>
                <p className="text-2xl font-bold text-slate-800">{systemStats.totalRecords.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-slate-800">{systemStats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Emergency Access</p>
                <p className="text-2xl font-bold text-red-600">{systemStats.emergencyAccesses}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Audit Logs</p>
                <p className="text-2xl font-bold text-slate-800">{systemStats.auditLogs.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        {roles.map((role, index) => {
          const Icon = role.icon
          return (
            <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
              <CardHeader className={`${role.bgColor} rounded-t-lg`}>
                <CardTitle className={`flex items-center gap-3 ${role.textColor}`}>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {role.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-600 mb-6 leading-relaxed">{role.description}</p>
                <Link href={role.href}>
                  <Button className="w-full group-hover:scale-105 transition-transform duration-200">
                    Access Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">Security & Privacy</h3>
              <p className="text-blue-700 mb-4">
                All medical records are encrypted with AES-256 encryption and stored on a decentralized blockchain
                network. Access is controlled through smart contracts and all interactions are immutably logged for
                audit purposes.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-blue-600">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  HIPAA Compliant
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Activity className="w-3 h-3 mr-1" />
                  Blockchain Secured
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <FileText className="w-3 h-3 mr-1" />
                  Audit Ready
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
