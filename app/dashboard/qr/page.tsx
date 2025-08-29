"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  QrCode,
  Scan,
  CreditCard,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Plus,
  Activity,
  Clock,
} from "lucide-react"

interface HealthCard {
  cardId: string
  patientId: string
  patientName: string
  abhaId?: string
  bloodGroup: string
  emergencyContact: string
  allergies: string[]
  chronicConditions: string[]
  medications: string[]
  qrCodeImage: string
  issuedAt: number
  expiresAt: number
  isActive: boolean
  issuerHospitalId: string
}

interface QRScanResult {
  cardId: string
  patientId: string
  patientName: string
  basicInfo: {
    bloodGroup: string
    emergencyContact: string
    allergies: string[]
    chronicConditions: string[]
  }
  verificationStatus: 'valid' | 'expired' | 'invalid' | 'revoked'
  accessLevel: 'basic' | 'full' | 'emergency'
}

export default function QRHealthCardDashboard() {
  const [cards, setCards] = useState<HealthCard[]>([])
  const [selectedCard, setSelectedCard] = useState<HealthCard | null>(null)
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null)
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [scanDialogOpen, setScanDialogOpen] = useState(false)

  const [generateForm, setGenerateForm] = useState({
    patientId: '',
    patientName: '',
    bloodGroup: '',
    emergencyContact: '',
    allergies: '',
    chronicConditions: '',
    medications: '',
    issuerHospitalId: 'hosp-001',
  })

  const [scanForm, setScanForm] = useState({
    qrCodeData: '',
    scannedBy: 'doctor-001',
    accessLevel: 'basic' as 'basic' | 'full' | 'emergency',
  })

  // Sample data
  const sampleCards: HealthCard[] = [
    {
      cardId: 'card-001',
      patientId: 'patient-001',
      patientName: 'Rajesh Kumar',
      abhaId: 'ABHA-001-2023',
      bloodGroup: 'O+',
      emergencyContact: '+919876543210',
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Diabetes Type 2', 'Hypertension'],
      medications: ['Metformin 500mg', 'Amlodipine 5mg'],
      qrCodeImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      issuedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      expiresAt: Date.now() + 335 * 24 * 60 * 60 * 1000,
      isActive: true,
      issuerHospitalId: 'hosp-001',
    },
    {
      cardId: 'card-002',
      patientId: 'patient-002',
      patientName: 'Priya Sharma',
      abhaId: 'ABHA-002-2023',
      bloodGroup: 'A+',
      emergencyContact: '+919876543211',
      allergies: [],
      chronicConditions: [],
      medications: [],
      qrCodeImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      issuedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      expiresAt: Date.now() + 350 * 24 * 60 * 60 * 1000,
      isActive: true,
      issuerHospitalId: 'hosp-002',
    },
  ]

  const sampleStats = {
    totalCards: 2,
    activeCards: 2,
    expiredCards: 0,
    revokedCards: 0,
    cardsExpiringIn30Days: 0,
    totalScans: 15,
    scansToday: 3,
  }

  useEffect(() => {
    setCards(sampleCards)
    setSelectedCard(sampleCards[0])
    setStats(sampleStats)
    setLoading(false)
  }, [])

  const handleGenerateCard = async () => {
    const newCard: HealthCard = {
      cardId: `card-${Date.now()}`,
      patientId: generateForm.patientId,
      patientName: generateForm.patientName,
      abhaId: `ABHA-${Date.now()}`,
      bloodGroup: generateForm.bloodGroup,
      emergencyContact: generateForm.emergencyContact,
      allergies: generateForm.allergies.split(',').map(a => a.trim()).filter(Boolean),
      chronicConditions: generateForm.chronicConditions.split(',').map(c => c.trim()).filter(Boolean),
      medications: generateForm.medications.split(',').map(m => m.trim()).filter(Boolean),
      qrCodeImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      issuedAt: Date.now(),
      expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000),
      isActive: true,
      issuerHospitalId: generateForm.issuerHospitalId,
    }

    setCards(prev => [newCard, ...prev])
    setGenerateDialogOpen(false)
    setGenerateForm({
      patientId: '',
      patientName: '',
      bloodGroup: '',
      emergencyContact: '',
      allergies: '',
      chronicConditions: '',
      medications: '',
      issuerHospitalId: 'hosp-001',
    })
  }

  const handleScanQR = async () => {
    const mockScanResult: QRScanResult = {
      cardId: 'card-001',
      patientId: 'patient-001',
      patientName: 'Rajesh Kumar',
      basicInfo: {
        bloodGroup: 'O+',
        emergencyContact: '+919876543210',
        allergies: ['Penicillin', 'Peanuts'],
        chronicConditions: ['Diabetes Type 2', 'Hypertension'],
      },
      verificationStatus: 'valid',
      accessLevel: scanForm.accessLevel,
    }

    setScanResult(mockScanResult)
    setScanDialogOpen(false)
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-orange-100 text-orange-800'
      case 'revoked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  if (loading) return <div className="p-6 text-center">Loading QR Health Card dashboard...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">QR Health Cards</h1>
          <p className="text-slate-600 mt-1">Digital health cards with QR codes for quick patient identification</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={scanDialogOpen} onOpenChange={setScanDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Scan className="w-4 h-4 mr-2" />
                Scan QR
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scan QR Health Card</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste QR code data here..."
                  value={scanForm.qrCodeData}
                  onChange={(e) => setScanForm(prev => ({ ...prev, qrCodeData: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Scanned By"
                    value={scanForm.scannedBy}
                    onChange={(e) => setScanForm(prev => ({ ...prev, scannedBy: e.target.value }))}
                  />
                  <Select value={scanForm.accessLevel} onValueChange={(value: any) => setScanForm(prev => ({ ...prev, accessLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleScanQR} className="w-full">
                  <Scan className="w-4 h-4 mr-2" />
                  Scan QR Code
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Generate Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate QR Health Card</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Patient ID"
                    value={generateForm.patientId}
                    onChange={(e) => setGenerateForm(prev => ({ ...prev, patientId: e.target.value }))}
                  />
                  <Input
                    placeholder="Patient Name"
                    value={generateForm.patientName}
                    onChange={(e) => setGenerateForm(prev => ({ ...prev, patientName: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select value={generateForm.bloodGroup} onValueChange={(value) => setGenerateForm(prev => ({ ...prev, bloodGroup: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Emergency Contact"
                    value={generateForm.emergencyContact}
                    onChange={(e) => setGenerateForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  />
                </div>
                <Input
                  placeholder="Allergies (comma separated)"
                  value={generateForm.allergies}
                  onChange={(e) => setGenerateForm(prev => ({ ...prev, allergies: e.target.value }))}
                />
                <Input
                  placeholder="Chronic Conditions (comma separated)"
                  value={generateForm.chronicConditions}
                  onChange={(e) => setGenerateForm(prev => ({ ...prev, chronicConditions: e.target.value }))}
                />
                <Input
                  placeholder="Current Medications (comma separated)"
                  value={generateForm.medications}
                  onChange={(e) => setGenerateForm(prev => ({ ...prev, medications: e.target.value }))}
                />
                <Button onClick={handleGenerateCard} className="w-full">
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Health Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Cards</p>
                <p className="text-xl font-bold text-slate-800">{stats.totalCards}</p>
              </div>
              <CreditCard className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-xl font-bold text-slate-800">{stats.activeCards}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Expired</p>
                <p className="text-xl font-bold text-slate-800">{stats.expiredCards}</p>
              </div>
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Revoked</p>
                <p className="text-xl font-bold text-slate-800">{stats.revokedCards}</p>
              </div>
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Expiring Soon</p>
                <p className="text-xl font-bold text-slate-800">{stats.cardsExpiringIn30Days}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Scans</p>
                <p className="text-xl font-bold text-slate-800">{stats.totalScans}</p>
              </div>
              <Scan className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Scans</p>
                <p className="text-xl font-bold text-slate-800">{stats.scansToday}</p>
              </div>
              <Activity className="w-6 h-6 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              QR Scan Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{scanResult.patientName}</h3>
                <p className="text-sm text-slate-600">Patient ID: {scanResult.patientId}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Blood Group: {scanResult.basicInfo.bloodGroup}</div>
                  <div>Emergency: {scanResult.basicInfo.emergencyContact}</div>
                </div>
                {scanResult.basicInfo.allergies.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Allergies:</span> {scanResult.basicInfo.allergies.join(', ')}
                  </div>
                )}
                {scanResult.basicInfo.chronicConditions.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Conditions:</span> {scanResult.basicInfo.chronicConditions.join(', ')}
                  </div>
                )}
              </div>
              <Badge className={getStatusColor(scanResult.verificationStatus)}>
                {scanResult.verificationStatus.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Health Cards List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Health Cards ({cards.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {cards.map((card) => (
                  <div
                    key={card.cardId}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCard?.cardId === card.cardId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-800">{card.patientName}</h3>
                      <Badge className={card.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {card.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-slate-600 space-y-1">
                      <div>ID: {card.patientId}</div>
                      <div>Blood: {card.bloodGroup}</div>
                      <div>Expires: {formatTimestamp(card.expiresAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Card Details */}
        <div className="lg:col-span-3">
          {selectedCard && (
            <Tabs defaultValue="details" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Card Details</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>{selectedCard.patientName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <div>Patient ID: {selectedCard.patientId}</div>
                          <div>ABHA ID: {selectedCard.abhaId || 'Not provided'}</div>
                          <div>Blood Group: {selectedCard.bloodGroup}</div>
                          <div>Emergency: {selectedCard.emergencyContact}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Card Information</h4>
                        <div className="space-y-2 text-sm">
                          <div>Card ID: {selectedCard.cardId}</div>
                          <div>Issued: {formatTimestamp(selectedCard.issuedAt)}</div>
                          <div>Expires: {formatTimestamp(selectedCard.expiresAt)}</div>
                          <div>Issuer: {selectedCard.issuerHospitalId}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Medical Information</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-sm">Allergies:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedCard.allergies.length > 0 ? (
                              selectedCard.allergies.map((allergy, index) => (
                                <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                                  {allergy}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-slate-500">None reported</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="font-medium text-sm">Chronic Conditions:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedCard.chronicConditions.length > 0 ? (
                              selectedCard.chronicConditions.map((condition, index) => (
                                <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700">
                                  {condition}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-slate-500">None reported</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="font-medium text-sm">Current Medications:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedCard.medications.length > 0 ? (
                              selectedCard.medications.map((medication, index) => (
                                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                                  {medication}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-slate-500">None reported</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="qr">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="w-5 h-5" />
                      QR Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="inline-block p-4 bg-white rounded-lg border">
                      <img
                        src={selectedCard.qrCodeImage}
                        alt="QR Code"
                        className="w-64 h-64 mx-auto"
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-slate-600">
                        Scan this QR code to access patient information
                      </p>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
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
