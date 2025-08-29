"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Trophy,
  Target,
  BarChart3,
  Users,
  Building2,
  Zap,
  Leaf,
} from "lucide-react"

interface HospitalCompliance {
  hospitalId: string
  hospitalName: string
  overallScore: number
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  lastUpdated: number
  metrics: {
    recordAccuracy: number
    responseTime: number
    patientSatisfaction: number
    disputeResolution: number
    dataIntegrity: number
    auditCompliance: number
  }
  badges: HospitalBadge[]
  violations: ComplianceViolation[]
  improvements: ComplianceImprovement[]
}

interface HospitalBadge {
  badgeId: string
  type: string
  name: string
  description: string
  earnedAt: number
  validUntil?: number
  criteria: string
  icon: string
}

interface ComplianceViolation {
  violationId: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  detectedAt: number
  resolvedAt?: number
  penaltyPoints: number
}

interface ComplianceImprovement {
  improvementId: string
  area: string
  recommendation: string
  priority: 'low' | 'medium' | 'high'
  estimatedImpact: number
  implementationCost: 'low' | 'medium' | 'high'
}

export default function ComplianceDashboard() {
  const [hospitals, setHospitals] = useState<HospitalCompliance[]>([])
  const [stats, setStats] = useState<any>({})
  const [selectedHospital, setSelectedHospital] = useState<HospitalCompliance | null>(null)
  const [loading, setLoading] = useState(true)

  // Sample data
  const sampleHospitals: HospitalCompliance[] = [
    {
      hospitalId: 'hosp-001',
      hospitalName: 'City General Hospital',
      overallScore: 87,
      level: 'good',
      lastUpdated: Date.now(),
      metrics: {
        recordAccuracy: 92,
        responseTime: 85,
        patientSatisfaction: 88,
        disputeResolution: 90,
        dataIntegrity: 95,
        auditCompliance: 82,
      },
      badges: [
        {
          badgeId: 'badge-001',
          type: 'quality_care',
          name: 'Quality Care Excellence',
          description: 'Maintained high patient satisfaction scores for 6 months',
          earnedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
          criteria: 'Patient satisfaction > 85% for 6 consecutive months',
          icon: '🏆',
        },
        {
          badgeId: 'badge-002',
          type: 'digital_excellence',
          name: 'Digital Health Pioneer',
          description: 'Leading adoption of blockchain technology in healthcare',
          earnedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
          criteria: '100% digital record adoption with blockchain verification',
          icon: '💻',
        },
      ],
      violations: [
        {
          violationId: 'viol-001',
          type: 'delayed_response',
          severity: 'medium',
          description: 'Response time exceeded 48 hours for patient queries',
          detectedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
          penaltyPoints: 5,
        },
      ],
      improvements: [
        {
          improvementId: 'imp-001',
          area: 'Response Time',
          recommendation: 'Implement automated response system for common queries',
          priority: 'high',
          estimatedImpact: 15,
          implementationCost: 'medium',
        },
      ],
    },
    {
      hospitalId: 'hosp-002',
      hospitalName: 'Metro Medical Center',
      overallScore: 94,
      level: 'excellent',
      lastUpdated: Date.now(),
      metrics: {
        recordAccuracy: 96,
        responseTime: 92,
        patientSatisfaction: 95,
        disputeResolution: 94,
        dataIntegrity: 98,
        auditCompliance: 91,
      },
      badges: [
        {
          badgeId: 'badge-003',
          type: 'patient_safety',
          name: 'Patient Safety Champion',
          description: 'Zero safety incidents for 12 months',
          earnedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
          criteria: 'Zero patient safety incidents for 12 consecutive months',
          icon: '🛡️',
        },
        {
          badgeId: 'badge-004',
          type: 'transparency',
          name: 'Transparency Leader',
          description: 'Exceptional transparency in patient communications',
          earnedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
          criteria: '95%+ transparency score in patient feedback',
          icon: '🔍',
        },
        {
          badgeId: 'badge-005',
          type: 'innovation',
          name: 'Healthcare Innovator',
          description: 'Leading innovation in patient care technology',
          earnedAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
          criteria: 'Implemented 3+ innovative healthcare technologies',
          icon: '🚀',
        },
      ],
      violations: [],
      improvements: [
        {
          improvementId: 'imp-002',
          area: 'Audit Compliance',
          recommendation: 'Enhance documentation for regulatory compliance',
          priority: 'medium',
          estimatedImpact: 8,
          implementationCost: 'low',
        },
      ],
    },
  ]

  const sampleStats = {
    totalHospitals: 2,
    averageScore: 91,
    excellentHospitals: 1,
    goodHospitals: 1,
    fairHospitals: 0,
    poorHospitals: 0,
    criticalHospitals: 0,
    totalBadges: 5,
    totalViolations: 1,
  }

  useEffect(() => {
    setHospitals(sampleHospitals)
    setStats(sampleStats)
    setSelectedHospital(sampleHospitals[0])
    setLoading(false)
  }, [])

  const getComplianceLevelColor = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'poor':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div className="p-6 text-center">Loading compliance data...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Compliance Dashboard</h1>
          <p className="text-slate-600 mt-1">Monitor hospital compliance scores and quality metrics</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <BarChart3 className="w-4 h-4 mr-1" />
          System Health: Good
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Hospitals</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalHospitals}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Average Score</p>
                <p className="text-2xl font-bold text-slate-800">{stats.averageScore}%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Badges</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalBadges}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Violations</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalViolations}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Hospital List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Hospital Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hospitals.sort((a, b) => b.overallScore - a.overallScore).map((hospital, index) => (
                <div
                  key={hospital.hospitalId}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedHospital?.hospitalId === hospital.hospitalId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedHospital(hospital)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      <h3 className="font-medium text-slate-800">{hospital.hospitalName}</h3>
                    </div>
                    <Badge className={getComplianceLevelColor(hospital.level)}>
                      {hospital.level.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <Progress value={hospital.overallScore} className="h-2" />
                    </div>
                    <span className="text-lg font-bold text-slate-800">{hospital.overallScore}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-sm text-slate-600">
                    <span>{hospital.badges.length} badges</span>
                    <span>{hospital.violations.length} violations</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hospital Details */}
        <div className="lg:col-span-2">
          {selectedHospital && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="violations">Violations</TabsTrigger>
                <TabsTrigger value="improvements">Improvements</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedHospital.hospitalName}</span>
                      <Badge className={getComplianceLevelColor(selectedHospital.level)}>
                        {selectedHospital.level.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-slate-800 mb-2">
                          {selectedHospital.overallScore}%
                        </div>
                        <p className="text-slate-600">Overall Compliance Score</p>
                        <Progress value={selectedHospital.overallScore} className="mt-4 h-3" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedHospital.metrics).map(([key, value]) => (
                          <div key={key} className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-sm font-bold text-slate-800">{value}%</span>
                            </div>
                            <Progress value={value} className="h-2" />
                          </div>
                        ))}
                      </div>

                      <div className="text-center text-sm text-slate-500">
                        Last updated: {formatDate(selectedHospital.lastUpdated)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="badges">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Achievement Badges ({selectedHospital.badges.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedHospital.badges.map((badge) => (
                        <div key={badge.badgeId} className="p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{badge.icon}</div>
                            <div className="flex-1">
                              <h3 className="font-medium text-slate-800 mb-1">{badge.name}</h3>
                              <p className="text-sm text-slate-600 mb-2">{badge.description}</p>
                              <div className="text-xs text-slate-500">
                                <div>Earned: {formatDate(badge.earnedAt)}</div>
                                <div className="mt-1 font-medium">Criteria: {badge.criteria}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedHospital.badges.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        No badges earned yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="violations">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Compliance Violations ({selectedHospital.violations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedHospital.violations.map((violation) => (
                        <div key={violation.violationId} className="p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-slate-800 capitalize">
                              {violation.type.replace(/_/g, ' ')}
                            </h3>
                            <Badge className={getSeverityColor(violation.severity)}>
                              {violation.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{violation.description}</p>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Detected: {formatDate(violation.detectedAt)}</span>
                            <span>Penalty: {violation.penaltyPoints} points</span>
                          </div>
                          {violation.resolvedAt && (
                            <div className="mt-2 text-xs text-green-600">
                              Resolved: {formatDate(violation.resolvedAt)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {selectedHospital.violations.length === 0 && (
                      <div className="text-center py-8 text-green-600">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                        No active violations
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="improvements">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Improvement Recommendations ({selectedHospital.improvements.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedHospital.improvements.map((improvement) => (
                        <div key={improvement.improvementId} className="p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-slate-800">{improvement.area}</h3>
                            <Badge className={getPriorityColor(improvement.priority)}>
                              {improvement.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{improvement.recommendation}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                            <div>
                              <span className="font-medium">Estimated Impact:</span> +{improvement.estimatedImpact}%
                            </div>
                            <div>
                              <span className="font-medium">Implementation Cost:</span> {improvement.implementationCost}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedHospital.improvements.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        No improvement recommendations at this time
                      </div>
                    )}
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
