"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  FileText,
  ImageIcon,
  Activity,
  Calendar,
  User,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Flag,
  Star,
  ThumbsUp,
  ThumbsDown,
  Clock,
  X,
} from "lucide-react"

export default function PatientDashboard() {
  const [selectedFileType, setSelectedFileType] = useState("")
  const [description, setDescription] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [medicalRecords, setMedicalRecords] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, recordId: null })
  const [disputeDialog, setDisputeDialog] = useState({ open: false, recordId: null })
  const [feedback, setFeedback] = useState({ rating: 0, comment: "" })
  const [dispute, setDispute] = useState({ reason: "", description: "" })
  const [loading, setLoading] = useState(false)

  const fileTypes = [
    { value: "lab-report", label: "Lab Report", icon: Activity },
    { value: "x-ray", label: "X-Ray", icon: ImageIcon },
    { value: "prescription", label: "Prescription", icon: FileText },
    { value: "medical-history", label: "Medical History", icon: Calendar },
  ]

  const doctors = [
    { id: "dr-smith", name: "Dr. Sarah Smith", specialty: "Cardiologist" },
    { id: "dr-johnson", name: "Dr. Michael Johnson", specialty: "Neurologist" },
    { id: "dr-williams", name: "Dr. Emily Williams", specialty: "Radiologist" },
  ]

  const sampleRecords = [
    {
      recordId: "REC001",
      ledgerId: "LED001",
      fileType: "Lab Report",
      timestamp: "2024-01-15 10:30 AM",
      status: "endorsed",
      doctorId: "dr-smith",
      doctorName: "Dr. Sarah Smith",
      hospitalId: "hosp-001",
      hospitalName: "City General Hospital",
      description: "Blood test results - Complete Blood Count",
      icon: Activity,
      canDispute: true,
      hasFeedback: false,
    },
    {
      recordId: "REC002",
      ledgerId: "LED002",
      fileType: "X-Ray",
      timestamp: "2024-01-14 02:15 PM",
      status: "pending",
      doctorId: "dr-williams",
      doctorName: "Dr. Emily Williams",
      hospitalId: "hosp-002",
      hospitalName: "Metro Medical Center",
      description: "Chest X-Ray - Routine checkup",
      icon: ImageIcon,
      canDispute: true,
      hasFeedback: false,
    },
    {
      recordId: "REC003",
      ledgerId: "LED003",
      fileType: "Prescription",
      timestamp: "2024-01-12 09:45 AM",
      status: "disputed",
      doctorId: "dr-johnson",
      doctorName: "Dr. Michael Johnson",
      hospitalId: "hosp-001",
      hospitalName: "City General Hospital",
      description: "Medication prescription - Hypertension treatment",
      icon: FileText,
      canDispute: false,
      hasFeedback: true,
      disputeReason: "Incorrect medication dosage",
    },
  ]

  const sampleNotifications = [
    {
      id: "not-001",
      type: "new_record",
      title: "New Medical Record Added",
      message: "Dr. Sarah Smith added a new lab report to your records",
      timestamp: "2024-01-15 10:35 AM",
      recordId: "REC001",
      read: false,
    },
    {
      id: "not-002",
      type: "dispute_update",
      title: "Dispute Status Updated",
      message: "Your dispute for prescription REC003 is under review",
      timestamp: "2024-01-13 03:20 PM",
      recordId: "REC003",
      read: false,
    },
    {
      id: "not-003",
      type: "endorsement",
      title: "Record Endorsed",
      message: "Your lab report has been endorsed by City General Hospital",
      timestamp: "2024-01-15 11:00 AM",
      recordId: "REC001",
      read: true,
    },
  ]

  useEffect(() => {
    setMedicalRecords(sampleRecords)
    setNotifications(sampleNotifications)
  }, [])

  const handleFeedback = async () => {
    setLoading(true)
    try {
      // API call to submit feedback
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      // Update record with feedback
      setMedicalRecords(prev => prev.map(record => 
        record.recordId === feedbackDialog.recordId 
          ? { ...record, hasFeedback: true }
          : record
      ))
      
      setFeedbackDialog({ open: false, recordId: null })
      setFeedback({ rating: 0, comment: "" })
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDispute = async () => {
    setLoading(true)
    try {
      // API call to submit dispute
      const response = await fetch('/api/record/dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordId: disputeDialog.recordId,
          reason: dispute.reason,
          description: dispute.description,
          patientId: 'patient-001' // This would come from auth context
        })
      })
      
      if (response.ok) {
        // Update record status
        setMedicalRecords(prev => prev.map(record => 
          record.recordId === disputeDialog.recordId 
            ? { ...record, status: 'disputed', canDispute: false, disputeReason: dispute.reason }
            : record
        ))
        
        setDisputeDialog({ open: false, recordId: null })
        setDispute({ reason: "", description: "" })
      }
    } catch (error) {
      console.error('Error submitting dispute:', error)
    } finally {
      setLoading(false)
    }
  }

  const markNotificationRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'endorsed':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Endorsed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'disputed':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Disputed</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Shield className="w-3 h-3 mr-1" />Encrypted</Badge>
    }
  }

  const auditLogs = [
    {
      viewer: "Dr. Sarah Smith",
      ledgerId: "LED001",
      timestamp: "2024-01-15 11:00 AM",
      action: "View",
      emergency: false,
    },
    {
      viewer: "Dr. Michael Johnson",
      ledgerId: "LED002",
      timestamp: "2024-01-14 03:30 PM",
      action: "View",
      emergency: true,
    },
    {
      viewer: "Hospital Staff",
      ledgerId: "LED003",
      timestamp: "2024-01-13 08:20 AM",
      action: "Emergency Access",
      emergency: true,
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Patient Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your medical records securely</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-4 h-4 mr-1" />
          Wallet Connected
        </Badge>
      </div>

      {/* Notifications */}
      {notifications.filter(n => !n.read).length > 0 && (
        <Card className="shadow-lg border-0 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MessageSquare className="w-5 h-5" />
              Recent Notifications ({notifications.filter(n => !n.read).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.filter(n => !n.read).slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-start justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{notification.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{notification.timestamp}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markNotificationRead(notification.id)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Encrypted File */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Upload className="w-5 h-5" />
              Upload Encrypted File
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="fileType" className="text-sm font-medium text-slate-700">
                File Type
              </Label>
              <select
                id="fileType"
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select file type...</option>
                {fileTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the medical record..."
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
              <p className="text-slate-400 text-sm mt-1">AES-256 encryption will be applied automatically</p>
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Shield className="w-4 h-4 mr-2" />
              Upload & Encrypt
            </Button>
          </CardContent>
        </Card>

        {/* Grant/Revoke Access */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <User className="w-5 h-5" />
              Grant/Revoke Access
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="doctor" className="text-sm font-medium text-slate-700">
                Select Doctor
              </Label>
              <select
                id="doctor"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Choose a doctor...</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <Eye className="w-4 h-4 mr-2" />
                Grant Access
              </Button>
              <Button variant="destructive" className="flex-1">
                <EyeOff className="w-4 h-4 mr-2" />
                Revoke Access
              </Button>
            </div>

            {/* Current Access List */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Current Access Permissions</h4>
              <div className="space-y-2">
                {doctors.slice(0, 2).map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">{doctor.name}</p>
                      <p className="text-sm text-slate-600">{doctor.specialty}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Records */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            My Medical Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medicalRecords.map((record) => {
              const Icon = record.icon
              return (
                <div key={record.recordId} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-slate-500" />
                        <div>
                          <h3 className="font-medium text-slate-800">{record.fileType}</h3>
                          <p className="text-sm text-slate-600">{record.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                        <div>
                          <span className="font-medium">Doctor:</span> {record.doctorName}
                        </div>
                        <div>
                          <span className="font-medium">Hospital:</span> {record.hospitalName}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {record.timestamp}
                        </div>
                        <div>
                          <span className="font-medium">Record ID:</span> {record.recordId}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {getStatusBadge(record.status)}
                        {record.disputeReason && (
                          <Badge variant="outline" className="text-red-600 border-red-200">
                            Reason: {record.disputeReason}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    {!record.hasFeedback && record.status === 'endorsed' && (
                      <Dialog open={feedbackDialog.open && feedbackDialog.recordId === record.recordId} onOpenChange={(open) => setFeedbackDialog({ open, recordId: open ? record.recordId : null })}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                            <Star className="w-4 h-4 mr-2" />
                            Feedback
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Provide Feedback</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Rating</Label>
                              <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                                    className={`p-1 ${feedback.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                  >
                                    <Star className="w-6 h-6 fill-current" />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="feedback-comment">Comment (Optional)</Label>
                              <Textarea
                                id="feedback-comment"
                                value={feedback.comment}
                                onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                                placeholder="Share your experience with this medical record..."
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleFeedback} disabled={loading || feedback.rating === 0} className="flex-1">
                                {loading ? 'Submitting...' : 'Submit Feedback'}
                              </Button>
                              <Button variant="outline" onClick={() => setFeedbackDialog({ open: false, recordId: null })}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {record.canDispute && (
                      <Dialog open={disputeDialog.open && disputeDialog.recordId === record.recordId} onOpenChange={(open) => setDisputeDialog({ open, recordId: open ? record.recordId : null })}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                            <Flag className="w-4 h-4 mr-2" />
                            Dispute
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Dispute Medical Record</DialogTitle>
                          </DialogHeader>
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              Disputing a record will flag it for review by medical auditors. Please provide accurate information.
                            </AlertDescription>
                          </Alert>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="dispute-reason">Reason for Dispute</Label>
                              <Select value={dispute.reason} onValueChange={(value) => setDispute(prev => ({ ...prev, reason: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="incorrect_information">Incorrect Information</SelectItem>
                                  <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
                                  <SelectItem value="wrong_patient">Wrong Patient Record</SelectItem>
                                  <SelectItem value="incomplete_record">Incomplete Record</SelectItem>
                                  <SelectItem value="privacy_violation">Privacy Violation</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="dispute-description">Description</Label>
                              <Textarea
                                id="dispute-description"
                                value={dispute.description}
                                onChange={(e) => setDispute(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Please provide details about the issue..."
                                rows={4}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleDispute} disabled={loading || !dispute.reason || !dispute.description} className="flex-1 bg-red-600 hover:bg-red-700">
                                {loading ? 'Submitting...' : 'Submit Dispute'}
                              </Button>
                              <Button variant="outline" onClick={() => setDisputeDialog({ open: false, recordId: null })}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Viewer</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Record</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {log.emergency && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        {log.viewer}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">{log.ledgerId}</td>
                    <td className="py-3 px-4 text-slate-600">{log.timestamp}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={log.emergency ? "destructive" : "secondary"}
                        className={log.emergency ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                      >
                        {log.emergency && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {log.action}
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
