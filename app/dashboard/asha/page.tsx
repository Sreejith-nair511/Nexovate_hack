"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  MapPin,
  Phone,
  Star,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Heart,
  UserCheck,
  Smartphone,
} from "lucide-react"

interface ASHAWorker {
  ashaId: string
  name: string
  phoneNumber: string
  village: string
  district: string
  state: string
  isActive: boolean
  certificationDate: number
  lastActivity: number
  coSignedRecords: number
  rating: number
  specializations: string[]
}

interface OTPCoSignRequest {
  requestId: string
  recordId: string
  patientId: string
  doctorId: string
  ashaId: string
  otp: string
  otpExpires: number
  status: 'pending' | 'verified' | 'expired' | 'failed'
  createdAt: number
  recordSummary: string
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency'
}

interface ASHAActivity {
  activityId: string
  ashaId: string
  type: 'record_cosign' | 'patient_visit' | 'health_education' | 'emergency_response'
  description: string
  patientId?: string
  recordId?: string
  timestamp: number
  location: { village: string }
  outcome: string
  followUpRequired: boolean
}

export default function ASHADashboard() {
  const [workers, setWorkers] = useState<ASHAWorker[]>([])
  const [selectedWorker, setSelectedWorker] = useState<ASHAWorker | null>(null)
  const [activities, setActivities] = useState<ASHAActivity[]>([])
  const [pendingOTPs, setPendingOTPs] = useState<OTPCoSignRequest[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [otpForm, setOtpForm] = useState({ requestId: '', otp: '' })
  const [visitForm, setVisitForm] = useState({
    patientId: '',
    description: '',
    outcome: '',
    followUpRequired: false
  })

  // Sample data
  const sampleWorkers: ASHAWorker[] = [
    {
      ashaId: 'asha-001',
      name: 'Sunita Devi',
      phoneNumber: '+919876543210',
      village: 'Rampur',
      district: 'Sitapur',
      state: 'Uttar Pradesh',
      isActive: true,
      certificationDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
      lastActivity: Date.now() - 2 * 60 * 60 * 1000,
      coSignedRecords: 45,
      rating: 4.8,
      specializations: ['maternal_health', 'child_immunization', 'diabetes_care'],
    },
    {
      ashaId: 'asha-002',
      name: 'Kamala Kumari',
      phoneNumber: '+919876543211',
      village: 'Bharatpur',
      district: 'Bharatpur',
      state: 'Rajasthan',
      isActive: true,
      certificationDate: Date.now() - 200 * 24 * 60 * 60 * 1000,
      lastActivity: Date.now() - 30 * 60 * 1000,
      coSignedRecords: 23,
      rating: 4.6,
      specializations: ['hypertension_monitoring', 'elderly_care'],
    },
  ]

  const sampleOTPs: OTPCoSignRequest[] = [
    {
      requestId: 'otp-req-001',
      recordId: 'record-002',
      patientId: 'patient-003',
      doctorId: 'doctor-001',
      ashaId: 'asha-001',
      otp: '123456',
      otpExpires: Date.now() + 5 * 60 * 1000,
      status: 'pending',
      createdAt: Date.now() - 2 * 60 * 1000,
      recordSummary: 'Routine checkup for hypertension patient, BP: 140/90',
      urgencyLevel: 'medium',
    },
  ]

  const sampleActivities: ASHAActivity[] = [
    {
      activityId: 'activity-001',
      ashaId: 'asha-001',
      type: 'patient_visit',
      description: 'Home visit for diabetes monitoring',
      patientId: 'patient-001',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      location: { village: 'Rampur' },
      outcome: 'Blood sugar levels stable, medication compliance good',
      followUpRequired: true,
    },
  ]

  useEffect(() => {
    setWorkers(sampleWorkers)
    setSelectedWorker(sampleWorkers[0])
    setActivities(sampleActivities)
    setPendingOTPs(sampleOTPs)
    setStats({
      totalASHAWorkers: 2,
      activeASHAWorkers: 2,
      totalCoSignedRecords: 68,
      totalActivities: 45,
      averageRating: 4.7,
    })
    setLoading(false)
  }, [])

  const handleOTPVerify = async () => {
    const otpRequest = pendingOTPs.find(o => o.requestId === otpForm.requestId)
    if (otpRequest && otpRequest.otp === otpForm.otp) {
      otpRequest.status = 'verified'
      setPendingOTPs(prev => prev.filter(o => o.requestId !== otpForm.requestId))
      setOtpForm({ requestId: '', otp: '' })
    }
  }

  const handleVisitRecord = async () => {
    const newActivity: ASHAActivity = {
      activityId: `activity-${Date.now()}`,
      ashaId: selectedWorker!.ashaId,
      type: 'patient_visit',
      description: visitForm.description,
      patientId: visitForm.patientId,
      timestamp: Date.now(),
      location: { village: selectedWorker!.village },
      outcome: visitForm.outcome,
      followUpRequired: visitForm.followUpRequired,
    }
    
    setActivities(prev => [newActivity, ...prev])
    setVisitForm({ patientId: '', description: '', outcome: '', followUpRequired: false })
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  if (loading) return <div className="p-6 text-center">Loading ASHA dashboard...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">ASHA Worker Dashboard</h1>
          <p className="text-slate-600 mt-1">Accredited Social Health Activists - Rural Healthcare Support</p>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <UserCheck className="w-4 h-4 mr-1" />
          {stats.activeASHAWorkers} Active Workers
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Workers</p>
                <p className="text-xl font-bold text-slate-800">{stats.totalASHAWorkers}</p>
              </div>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Co-signed Records</p>
                <p className="text-xl font-bold text-slate-800">{stats.totalCoSignedRecords}</p>
              </div>
              <Shield className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Activities</p>
                <p className="text-xl font-bold text-slate-800">{stats.totalActivities}</p>
              </div>
              <Activity className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Average Rating</p>
                <p className="text-xl font-bold text-slate-800">{stats.averageRating}</p>
              </div>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Sessions</p>
                <p className="text-xl font-bold text-slate-800">{stats.activeASHAWorkers}</p>
              </div>
              <MapPin className="w-6 h-6 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* ASHA Workers List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              ASHA Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workers.map((worker) => (
                <div
                  key={worker.ashaId}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedWorker?.ashaId === worker.ashaId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedWorker(worker)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-800">{worker.name}</h3>
                    <Badge className={worker.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {worker.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-slate-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {worker.village}, {worker.district}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {worker.rating} • {worker.coSignedRecords} records
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Worker Details */}
        <div className="lg:col-span-3">
          {selectedWorker && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="otp">OTP Requests</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>{selectedWorker.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Contact</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {selectedWorker.phoneNumber}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {selectedWorker.village}, {selectedWorker.district}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Performance</h4>
                        <div className="text-sm space-y-1">
                          <div>Records: {selectedWorker.coSignedRecords}</div>
                          <div>Rating: {selectedWorker.rating}</div>
                          <div>Last Active: {formatTimestamp(selectedWorker.lastActivity)}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorker.specializations.map((spec) => (
                          <Badge key={spec} variant="outline">
                            {spec.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="otp">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Pending OTP Requests ({pendingOTPs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingOTPs.map((otp) => (
                        <div key={otp.requestId} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">Record Co-signing Request</h4>
                              <p className="text-sm text-slate-600">Patient: {otp.patientId}</p>
                            </div>
                            <Badge className={getUrgencyColor(otp.urgencyLevel)}>
                              {otp.urgencyLevel}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3">{otp.recordSummary}</p>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter OTP"
                              value={otpForm.requestId === otp.requestId ? otpForm.otp : ''}
                              onChange={(e) => setOtpForm({ requestId: otp.requestId, otp: e.target.value })}
                              className="max-w-32"
                            />
                            <Button size="sm" onClick={handleOTPVerify}>
                              Verify
                            </Button>
                          </div>
                          <div className="text-xs text-slate-500 mt-2">
                            OTP: {otp.otp} • Expires: {formatTimestamp(otp.otpExpires)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <div key={activity.activityId} className="p-4 border rounded-lg">
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium capitalize">{activity.type.replace(/_/g, ' ')}</h4>
                              <span className="text-xs text-slate-500">{formatTimestamp(activity.timestamp)}</span>
                            </div>
                            <p className="text-sm mb-2">{activity.description}</p>
                            <p className="text-sm text-slate-600">Outcome: {activity.outcome}</p>
                            {activity.followUpRequired && (
                              <Badge className="mt-2 bg-orange-100 text-orange-800">Follow-up Required</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Record Patient Visit
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Patient ID"
                      value={visitForm.patientId}
                      onChange={(e) => setVisitForm(prev => ({ ...prev, patientId: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Visit description..."
                      value={visitForm.description}
                      onChange={(e) => setVisitForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Visit outcome..."
                      value={visitForm.outcome}
                      onChange={(e) => setVisitForm(prev => ({ ...prev, outcome: e.target.value }))}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={visitForm.followUpRequired}
                        onChange={(e) => setVisitForm(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                      />
                      <label className="text-sm">Follow-up required</label>
                    </div>
                    <Button onClick={handleVisitRecord}>Record Visit</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
