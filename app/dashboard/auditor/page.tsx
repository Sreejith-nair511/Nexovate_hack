"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, Eye, AlertTriangle, User, FileText, Activity, Shield, Clock } from "lucide-react"

export default function AuditorDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUser, setFilterUser] = useState("")
  const [filterType, setFilterType] = useState("")
  const [dateRange, setDateRange] = useState("")

  const accessLogs = [
    {
      viewerAddress: "0x1234...5678",
      viewerName: "Dr. Sarah Smith",
      viewerType: "Doctor",
      ledgerId: "LED001",
      patientName: "John Doe",
      timestamp: "2024-01-16 10:30 AM",
      actionType: "View Record",
      recordType: "Lab Report",
      emergency: false,
      ipAddress: "192.168.1.100",
    },
    {
      viewerAddress: "0x9876...4321",
      viewerName: "Dr. Emergency Room",
      viewerType: "Hospital Staff",
      ledgerId: "LED002",
      patientName: "Michael Johnson",
      timestamp: "2024-01-16 03:45 AM",
      actionType: "Emergency Access",
      recordType: "Medical History",
      emergency: true,
      ipAddress: "192.168.1.200",
    },
    {
      viewerAddress: "0x5555...7777",
      viewerName: "Nurse Jennifer Adams",
      viewerType: "Hospital Staff",
      ledgerId: "LED003",
      patientName: "Sarah Wilson",
      timestamp: "2024-01-15 11:20 PM",
      actionType: "Emergency Override",
      recordType: "Allergy Information",
      emergency: true,
      ipAddress: "192.168.1.150",
    },
    {
      viewerAddress: "0x2468...1357",
      viewerName: "Dr. Michael Johnson",
      viewerType: "Doctor",
      ledgerId: "LED004",
      patientName: "Jane Smith",
      timestamp: "2024-01-15 02:15 PM",
      actionType: "View Record",
      recordType: "X-Ray",
      emergency: false,
      ipAddress: "192.168.1.120",
    },
    {
      viewerAddress: "0x1357...2468",
      viewerName: "Dr. Emily Williams",
      viewerType: "Doctor",
      ledgerId: "LED005",
      patientName: "Bob Johnson",
      timestamp: "2024-01-15 09:45 AM",
      actionType: "Download Record",
      recordType: "Prescription",
      emergency: false,
      ipAddress: "192.168.1.180",
    },
  ]

  const auditStats = {
    totalAccesses: 1247,
    emergencyAccesses: 23,
    uniqueUsers: 45,
    recordsViewed: 892,
  }

  const filteredLogs = accessLogs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.viewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ledgerId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesUser = filterUser === "" || log.viewerType === filterUser
    const matchesType = filterType === "" || log.actionType === filterType

    return matchesSearch && matchesUser && matchesType
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Auditor Dashboard</h1>
          <p className="text-slate-600 mt-1">Comprehensive access monitoring and compliance</p>
        </div>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
          <Shield className="w-4 h-4 mr-1" />
          Read-Only Access
        </Badge>
      </div>

      {/* Audit Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Accesses</p>
                <p className="text-2xl font-bold text-slate-800">{auditStats.totalAccesses.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Emergency Access</p>
                <p className="text-2xl font-bold text-red-600">{auditStats.emergencyAccesses}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Unique Users</p>
                <p className="text-2xl font-bold text-slate-800">{auditStats.uniqueUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Records Viewed</p>
                <p className="text-2xl font-bold text-slate-800">{auditStats.recordsViewed.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Audit Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="text-sm font-medium text-slate-700">
                Search
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="userType" className="text-sm font-medium text-slate-700">
                User Type
              </Label>
              <select
                id="userType"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Users</option>
                <option value="Doctor">Doctor</option>
                <option value="Hospital Staff">Hospital Staff</option>
                <option value="Patient">Patient</option>
              </select>
            </div>

            <div>
              <Label htmlFor="actionType" className="text-sm font-medium text-slate-700">
                Action Type
              </Label>
              <select
                id="actionType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Actions</option>
                <option value="View Record">View Record</option>
                <option value="Download Record">Download Record</option>
                <option value="Emergency Access">Emergency Access</option>
                <option value="Emergency Override">Emergency Override</option>
              </select>
            </div>

            <div>
              <Label htmlFor="dateRange" className="text-sm font-medium text-slate-700">
                Date Range
              </Label>
              <select
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-slate-600">
              Showing {filteredLogs.length} of {accessLogs.length} access logs
            </p>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Access Logs Table */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Access Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Viewer</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Ledger ID</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Action Type</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Record Type</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-800">{log.viewerName}</p>
                        <p className="text-xs text-slate-500 font-mono">{log.viewerAddress}</p>
                        <p className="text-xs text-slate-600">{log.viewerType}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{log.patientName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono text-sm text-slate-600">{log.ledgerId}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Clock className="w-3 h-3" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={log.emergency ? "destructive" : "secondary"}
                        className={log.emergency ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}
                      >
                        {log.emergency && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {log.actionType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        {log.recordType}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {log.emergency ? (
                          <Badge variant="destructive" className="bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Emergency
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Eye className="w-3 h-3 mr-1" />
                            Authorized
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No access logs found</p>
              <p className="text-slate-400 text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Summary */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Shield className="w-5 h-5" />
            Compliance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">HIPAA Compliant</h3>
              <p className="text-sm text-slate-600">All access logs meet HIPAA audit requirements</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Real-time Monitoring</h3>
              <p className="text-sm text-slate-600">Continuous audit trail with immutable records</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Audit Ready</h3>
              <p className="text-sm text-slate-600">Comprehensive reporting for regulatory compliance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
