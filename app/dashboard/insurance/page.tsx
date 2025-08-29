"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Shield,
  AlertTriangle,
  Upload,
  Eye,
  Plus,
  TrendingUp,
  Users,
  Calculator,
} from "lucide-react"

interface InsuranceClaim {
  claimId: string
  patientId: string
  recordId: string
  insuranceProvider: string
  policyNumber: string
  claimAmount: number
  approvedAmount?: number
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid'
  submittedAt: number
  reviewedAt?: number
  reviewedBy?: string
  rejectionReason?: string
  documents: string[]
  preAuthRequired: boolean
  preAuthNumber?: string
}

interface InsuranceProvider {
  providerId: string
  name: string
  code: string
  supportedPolicies: string[]
  processingTime: number
  cashlessLimit: number
}

export default function InsuranceDashboard() {
  const [claims, setClaims] = useState<InsuranceClaim[]>([])
  const [providers, setProviders] = useState<InsuranceProvider[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [submitDialog, setSubmitDialog] = useState(false)
  const [preAuthDialog, setPreAuthDialog] = useState(false)
  const [reviewDialog, setReviewDialog] = useState({ open: false, claimId: null })

  const [newClaim, setNewClaim] = useState({
    patientId: 'patient-001', // This would come from auth context
    recordId: '',
    insuranceProvider: '',
    policyNumber: '',
    claimAmount: '',
    documents: [] as string[],
    preAuthRequired: false,
    preAuthNumber: ''
  })

  const [preAuth, setPreAuth] = useState({
    patientId: 'patient-001',
    recordId: '',
    insuranceProvider: '',
    policyNumber: '',
    estimatedAmount: '',
    treatmentDetails: ''
  })

  const [review, setReview] = useState({
    decision: '',
    approvedAmount: '',
    rejectionReason: ''
  })

  // Sample data
  const sampleClaims: InsuranceClaim[] = [
    {
      claimId: 'CLM001',
      patientId: 'patient-001',
      recordId: 'REC001',
      insuranceProvider: 'ins-001',
      policyNumber: 'NHI123456789',
      claimAmount: 25000,
      approvedAmount: 22000,
      status: 'approved',
      submittedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      reviewedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      reviewedBy: 'reviewer-001',
      documents: ['lab-report.pdf', 'prescription.pdf'],
      preAuthRequired: false,
    },
    {
      claimId: 'CLM002',
      patientId: 'patient-001',
      recordId: 'REC002',
      insuranceProvider: 'ins-002',
      policyNumber: 'STAR987654321',
      claimAmount: 45000,
      status: 'under_review',
      submittedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      documents: ['xray-report.pdf'],
      preAuthRequired: true,
      preAuthNumber: 'PA20241201ABC123',
    },
    {
      claimId: 'CLM003',
      patientId: 'patient-002',
      recordId: 'REC003',
      insuranceProvider: 'ins-001',
      policyNumber: 'NHI555666777',
      claimAmount: 15000,
      status: 'rejected',
      submittedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      reviewedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      reviewedBy: 'reviewer-002',
      rejectionReason: 'Pre-existing condition not covered',
      documents: ['medical-history.pdf'],
      preAuthRequired: false,
    },
  ]

  const sampleProviders: InsuranceProvider[] = [
    {
      providerId: 'ins-001',
      name: 'National Health Insurance',
      code: 'NHI',
      supportedPolicies: ['BASIC', 'PREMIUM', 'FAMILY'],
      processingTime: 24,
      cashlessLimit: 500000,
    },
    {
      providerId: 'ins-002',
      name: 'Star Health Insurance',
      code: 'STAR',
      supportedPolicies: ['INDIVIDUAL', 'FAMILY', 'SENIOR'],
      processingTime: 48,
      cashlessLimit: 1000000,
    },
    {
      providerId: 'ins-003',
      name: 'HDFC ERGO Health',
      code: 'HDFC',
      supportedPolicies: ['BASIC', 'COMPREHENSIVE'],
      processingTime: 36,
      cashlessLimit: 750000,
    },
  ]

  useEffect(() => {
    setClaims(sampleClaims)
    setProviders(sampleProviders)
    setStats({
      totalClaims: 3,
      approvedClaims: 1,
      rejectedClaims: 1,
      pendingClaims: 1,
      totalClaimAmount: 85000,
      totalApprovedAmount: 22000,
      averageProcessingTime: 36,
    })
  }, [])

  const handleSubmitClaim = async () => {
    setLoading(true)
    try {
      const claimId = `CLM${Date.now()}`
      const response = await fetch('/api/insurance/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimId,
          ...newClaim,
          claimAmount: parseFloat(newClaim.claimAmount)
        })
      })

      if (response.ok) {
        const newClaimData = {
          claimId,
          ...newClaim,
          claimAmount: parseFloat(newClaim.claimAmount),
          status: 'submitted' as const,
          submittedAt: Date.now(),
          documents: newClaim.documents,
        }
        setClaims(prev => [newClaimData, ...prev])
        setSubmitDialog(false)
        setNewClaim({
          patientId: 'patient-001',
          recordId: '',
          insuranceProvider: '',
          policyNumber: '',
          claimAmount: '',
          documents: [],
          preAuthRequired: false,
          preAuthNumber: ''
        })
      }
    } catch (error) {
      console.error('Error submitting claim:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreAuth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/insurance/preauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...preAuth,
          estimatedAmount: parseFloat(preAuth.estimatedAmount)
        })
      })

      if (response.ok) {
        const result = await response.json()
        setPreAuthDialog(false)
        setPreAuth({
          patientId: 'patient-001',
          recordId: '',
          insuranceProvider: '',
          policyNumber: '',
          estimatedAmount: '',
          treatmentDetails: ''
        })
        // Show success message with pre-auth number
        alert(`Pre-authorization approved! Number: ${result.preAuthNumber}`)
      }
    } catch (error) {
      console.error('Error requesting pre-auth:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><CreditCard className="w-3 h-3 mr-1" />Paid</Badge>
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200"><FileText className="w-3 h-3 mr-1" />Submitted</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Insurance Claims</h1>
          <p className="text-slate-600 mt-1">Manage insurance claims and pre-authorizations</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={preAuthDialog} onOpenChange={setPreAuthDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                <Shield className="w-4 h-4 mr-2" />
                Pre-Authorization
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Request Pre-Authorization</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="preauth-record">Medical Record ID</Label>
                  <Input
                    id="preauth-record"
                    value={preAuth.recordId}
                    onChange={(e) => setPreAuth(prev => ({ ...prev, recordId: e.target.value }))}
                    placeholder="REC001"
                  />
                </div>
                <div>
                  <Label htmlFor="preauth-provider">Insurance Provider</Label>
                  <Select value={preAuth.insuranceProvider} onValueChange={(value) => setPreAuth(prev => ({ ...prev, insuranceProvider: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.providerId} value={provider.providerId}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preauth-policy">Policy Number</Label>
                  <Input
                    id="preauth-policy"
                    value={preAuth.policyNumber}
                    onChange={(e) => setPreAuth(prev => ({ ...prev, policyNumber: e.target.value }))}
                    placeholder="Policy number"
                  />
                </div>
                <div>
                  <Label htmlFor="preauth-amount">Estimated Amount (₹)</Label>
                  <Input
                    id="preauth-amount"
                    type="number"
                    value={preAuth.estimatedAmount}
                    onChange={(e) => setPreAuth(prev => ({ ...prev, estimatedAmount: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="preauth-treatment">Treatment Details</Label>
                  <Textarea
                    id="preauth-treatment"
                    value={preAuth.treatmentDetails}
                    onChange={(e) => setPreAuth(prev => ({ ...prev, treatmentDetails: e.target.value }))}
                    placeholder="Describe the treatment requiring pre-authorization"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePreAuth} disabled={loading} className="flex-1">
                    {loading ? 'Requesting...' : 'Request Pre-Auth'}
                  </Button>
                  <Button variant="outline" onClick={() => setPreAuthDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={submitDialog} onOpenChange={setSubmitDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Submit Claim
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Insurance Claim</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="claim-record">Medical Record ID</Label>
                  <Input
                    id="claim-record"
                    value={newClaim.recordId}
                    onChange={(e) => setNewClaim(prev => ({ ...prev, recordId: e.target.value }))}
                    placeholder="REC001"
                  />
                </div>
                <div>
                  <Label htmlFor="claim-provider">Insurance Provider</Label>
                  <Select value={newClaim.insuranceProvider} onValueChange={(value) => setNewClaim(prev => ({ ...prev, insuranceProvider: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.providerId} value={provider.providerId}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="claim-policy">Policy Number</Label>
                  <Input
                    id="claim-policy"
                    value={newClaim.policyNumber}
                    onChange={(e) => setNewClaim(prev => ({ ...prev, policyNumber: e.target.value }))}
                    placeholder="Policy number"
                  />
                </div>
                <div>
                  <Label htmlFor="claim-amount">Claim Amount (₹)</Label>
                  <Input
                    id="claim-amount"
                    type="number"
                    value={newClaim.claimAmount}
                    onChange={(e) => setNewClaim(prev => ({ ...prev, claimAmount: e.target.value }))}
                    placeholder="25000"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="preauth-required"
                    checked={newClaim.preAuthRequired}
                    onChange={(e) => setNewClaim(prev => ({ ...prev, preAuthRequired: e.target.checked }))}
                  />
                  <Label htmlFor="preauth-required">Pre-authorization required</Label>
                </div>
                {newClaim.preAuthRequired && (
                  <div>
                    <Label htmlFor="preauth-number">Pre-Authorization Number</Label>
                    <Input
                      id="preauth-number"
                      value={newClaim.preAuthNumber}
                      onChange={(e) => setNewClaim(prev => ({ ...prev, preAuthNumber: e.target.value }))}
                      placeholder="PA20241201ABC123"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleSubmitClaim} disabled={loading} className="flex-1">
                    {loading ? 'Submitting...' : 'Submit Claim'}
                  </Button>
                  <Button variant="outline" onClick={() => setSubmitDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Claims</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalClaims}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Approved Claims</p>
                <p className="text-2xl font-bold text-green-600">{stats.approvedClaims}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Amount</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(stats.totalClaimAmount)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg. Processing</p>
                <p className="text-2xl font-bold text-slate-800">{stats.averageProcessingTime}h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims List */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            My Insurance Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claims.map((claim) => {
              const provider = providers.find(p => p.providerId === claim.insuranceProvider)
              return (
                <div key={claim.claimId} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-slate-800">Claim #{claim.claimId}</h3>
                        {getStatusBadge(claim.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">Provider:</span> {provider?.name}
                        </div>
                        <div>
                          <span className="font-medium">Policy:</span> {claim.policyNumber}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> {formatCurrency(claim.claimAmount)}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {formatDate(claim.submittedAt)}
                        </div>
                      </div>

                      {claim.approvedAmount && (
                        <div className="mt-2 text-sm text-green-600">
                          <span className="font-medium">Approved Amount:</span> {formatCurrency(claim.approvedAmount)}
                        </div>
                      )}

                      {claim.rejectionReason && (
                        <div className="mt-2 text-sm text-red-600">
                          <span className="font-medium">Rejection Reason:</span> {claim.rejectionReason}
                        </div>
                      )}

                      {claim.preAuthNumber && (
                        <div className="mt-2 text-sm text-blue-600">
                          <span className="font-medium">Pre-Auth Number:</span> {claim.preAuthNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    {claim.documents.length > 0 && (
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        <FileText className="w-4 h-4 mr-2" />
                        Documents ({claim.documents.length})
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
