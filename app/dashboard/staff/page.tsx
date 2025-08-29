"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Clock, FileText, Activity, CheckCircle, Search } from "lucide-react"

export default function StaffDashboard() {
  const [patientWallet, setPatientWallet] = useState("")
  const [emergencyReason, setEmergencyReason] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const emergencyLogs = [
    {
      patientName: "Michael Johnson",
      patientWallet: "0x1234...5678",
      reason: "Cardiac emergency - immediate access to medical history required",
      timestamp: "2024-01-16 03:45 AM",
      staffMember: "Dr. Emergency Room",
      status: "active",
      recordsAccessed: 3,
    },
    {
      patientName: "Sarah Wilson",
      patientWallet: "0x9876...4321",
      reason: "Unconscious patient - allergy information needed urgently",
      timestamp: "2024-01-15 11:20 PM",
      staffMember: "Nurse Jennifer Adams",
      status: "resolved",
      recordsAccessed: 2,
    },
    {
      patientName: "Robert Davis",
      patientWallet: "0x5555...7777",
      reason: "Severe allergic reaction - medication history required",
      timestamp: "2024-01-15 06:30 PM",
      staffMember: "Dr. Emergency Room",
      status: "resolved",
      recordsAccessed: 1,
    },
  ]

  const recentActivity = [
    {
      action: "Emergency Override",
      patient: "Michael Johnson",
      timestamp: "2024-01-16 03:45 AM",
      staff: "Dr. Emergency Room",
    },
    {
      action: "Access Granted",
      patient: "Sarah Wilson",
      timestamp: "2024-01-15 11:20 PM",
      staff: "Nurse Jennifer Adams",
    },
    {
      action: "Records Viewed",
      patient: "Robert Davis",
      timestamp: "2024-01-15 06:30 PM",
      staff: "Dr. Emergency Room",
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Emergency Override Panel</h1>
          <p className="text-slate-600 mt-1">Hospital staff emergency access controls</p>
        </div>
        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
          <AlertTriangle className="w-4 h-4 mr-1" />
          Emergency Access Only
        </Badge>
      </div>

      {/* Emergency Warning */}
      <Card className="border-red-200 bg-red-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-2">Emergency Access Protocol</h3>
              <p className="text-red-700 mb-4">
                This panel is for emergency situations only. All access attempts are logged and audited. Unauthorized
                use may result in disciplinary action and legal consequences.
              </p>
              <div className="flex items-center gap-4 text-sm text-red-600">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  All actions are immutably recorded
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  Real-time audit monitoring
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Manual Emergency Access */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Manual Emergency Access
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="patientWallet" className="text-sm font-medium text-slate-700">
                Patient Wallet Address
              </Label>
              <Input
                id="patientWallet"
                value={patientWallet}
                onChange={(e) => setPatientWallet(e.target.value)}
                placeholder="0x..."
                className="mt-1 font-mono"
              />
            </div>

            <div>
              <Label htmlFor="reason" className="text-sm font-medium text-slate-700">
                Emergency Reason (Required)
              </Label>
              <Textarea
                id="reason"
                value={emergencyReason}
                onChange={(e) => setEmergencyReason(e.target.value)}
                placeholder="Detailed explanation of the medical emergency requiring immediate access..."
                className="mt-1 resize-none"
                rows={4}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Legal Notice</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    By proceeding, you acknowledge that this access is for legitimate medical emergency purposes only
                    and will be subject to audit review.
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700" disabled={!patientWallet || !emergencyReason}>
              <Shield className="w-4 h-4 mr-2" />
              Confirm Emergency Access
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{activity.action}</p>
                    <p className="text-sm text-slate-600">{activity.patient}</p>
                    <p className="text-xs text-slate-500">{activity.staff}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Logs */}
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Emergency Access Logs
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Staff Member</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Records</th>
                </tr>
              </thead>
              <tbody>
                {emergencyLogs.map((log, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-800">{log.patientName}</p>
                        <p className="text-xs text-slate-500 font-mono">{log.patientWallet}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-sm text-slate-600 truncate" title={log.reason}>
                        {log.reason}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{log.staffMember}</td>
                    <td className="py-3 px-4 text-slate-600 text-sm">{log.timestamp}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={log.status === "active" ? "destructive" : "secondary"}
                        className={log.status === "active" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                      >
                        {log.status === "active" ? (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        ) : (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {log.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {log.recordsAccessed} files
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
