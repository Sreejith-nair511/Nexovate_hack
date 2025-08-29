"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  ImageIcon,
  Activity,
  Calendar,
  Eye,
  Download,
  Lock,
  Unlock,
  User,
  Clock,
  Search,
  Filter,
} from "lucide-react"

export default function DoctorDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState("")

  const authorizedRecords = [
    {
      patientName: "John Doe",
      fileType: "Lab Report",
      createdAt: "2024-01-15",
      cid: "QmX7Y8Z9...",
      icon: Activity,
      status: "accessible",
    },
    {
      patientName: "Jane Smith",
      fileType: "X-Ray",
      createdAt: "2024-01-14",
      cid: "QmA1B2C3...",
      icon: ImageIcon,
      status: "accessible",
    },
    {
      patientName: "Bob Johnson",
      fileType: "Medical History",
      createdAt: "2024-01-12",
      cid: "QmD4E5F6...",
      icon: Calendar,
      status: "accessible",
    },
    {
      patientName: "Alice Brown",
      fileType: "Prescription",
      createdAt: "2024-01-10",
      cid: "QmG7H8I9...",
      icon: FileText,
      status: "pending",
    },
  ]

  const accessRequests = [
    {
      patientName: "Michael Wilson",
      requestedAt: "2024-01-16 09:30 AM",
      reason: "Follow-up consultation",
      status: "pending",
    },
    {
      patientName: "Sarah Davis",
      requestedAt: "2024-01-15 02:15 PM",
      reason: "Emergency consultation",
      status: "approved",
    },
  ]

  const patients = [
    { id: "patient-1", name: "John Doe", condition: "Hypertension" },
    { id: "patient-2", name: "Jane Smith", condition: "Diabetes" },
    { id: "patient-3", name: "Bob Johnson", condition: "Arthritis" },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Doctor Dashboard</h1>
          <p className="text-slate-600 mt-1">Access and manage patient records</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <User className="w-4 h-4 mr-1" />
          Dr. Sarah Smith - Cardiologist
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search patient records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Authorized Records */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <FileText className="w-5 h-5" />
            Authorized Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authorizedRecords.map((record, index) => {
              const Icon = record.icon
              return (
                <Card key={index} className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{record.fileType}</p>
                          <p className="text-sm text-slate-600">{record.patientName}</p>
                        </div>
                      </div>
                      <Badge
                        variant={record.status === "accessible" ? "secondary" : "outline"}
                        className={record.status === "accessible" ? "bg-green-100 text-green-800" : ""}
                      >
                        {record.status === "accessible" ? (
                          <Unlock className="w-3 h-3 mr-1" />
                        ) : (
                          <Lock className="w-3 h-3 mr-1" />
                        )}
                        {record.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        Created: {record.createdAt}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        CID: {record.cid}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        disabled={record.status !== "accessible"}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        disabled={record.status !== "accessible"}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Access Requests */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <User className="w-5 h-5" />
              Access Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="patient" className="text-sm font-medium text-slate-700">
                Request Access for Patient
              </Label>
              <select
                id="patient"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select patient...</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.condition}
                  </option>
                ))}
              </select>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <User className="w-4 h-4 mr-2" />
              Request Access
            </Button>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Pending Requests</h4>
              <div className="space-y-3">
                {accessRequests.map((request, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-800">{request.patientName}</p>
                      <Badge
                        variant={request.status === "approved" ? "secondary" : "outline"}
                        className={
                          request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{request.reason}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {request.requestedAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decrypt & View File Modal Preview */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Lock className="w-5 h-5" />
              File Decryption Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-medium text-slate-800 mb-2">Lab Report - John Doe</h3>
              <p className="text-slate-600 text-sm mb-4">
                Click to decrypt and view the selected medical record. Your private key will be used for decryption.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Unlock className="w-4 h-4 mr-2" />
                Decrypt & View
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <Lock className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Secure Decryption</p>
                  <p className="text-xs text-blue-600 mt-1">
                    All decryption happens locally using your private key. No sensitive data is transmitted over the
                    network.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
