import { MockLedger } from '../ledger/mockLedger';

export type ComplianceLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type BadgeType = 'quality_care' | 'patient_safety' | 'digital_excellence' | 'transparency' | 'innovation' | 'green_hospital';

export interface HospitalCompliance {
  hospitalId: string;
  hospitalName: string;
  overallScore: number;
  level: ComplianceLevel;
  lastUpdated: number;
  metrics: {
    recordAccuracy: number;
    responseTime: number;
    patientSatisfaction: number;
    disputeResolution: number;
    dataIntegrity: number;
    auditCompliance: number;
  };
  badges: HospitalBadge[];
  violations: ComplianceViolation[];
  improvements: ComplianceImprovement[];
}

export interface HospitalBadge {
  badgeId: string;
  type: BadgeType;
  name: string;
  description: string;
  earnedAt: number;
  validUntil?: number;
  criteria: string;
  icon: string;
}

export interface ComplianceViolation {
  violationId: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: number;
  resolvedAt?: number;
  penaltyPoints: number;
}

export interface ComplianceImprovement {
  improvementId: string;
  area: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  estimatedImpact: number;
  implementationCost: 'low' | 'medium' | 'high';
}

const COMPLIANCE_ACTIONS = {
  SCORE_UPDATE: 'SCORE_UPDATE',
  BADGE_AWARDED: 'BADGE_AWARDED',
  BADGE_REVOKED: 'BADGE_REVOKED',
  VIOLATION_DETECTED: 'VIOLATION_DETECTED',
  VIOLATION_RESOLVED: 'VIOLATION_RESOLVED',
  AUDIT_COMPLETED: 'AUDIT_COMPLETED',
} as const;

export class ComplianceManager {
  private hospitalCompliance: Map<string, HospitalCompliance> = new Map();
  private ledger = new MockLedger();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleHospitals = [
      {
        hospitalId: 'hosp-001',
        hospitalName: 'City General Hospital',
        overallScore: 87,
        level: 'good' as ComplianceLevel,
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
            type: 'quality_care' as BadgeType,
            name: 'Quality Care Excellence',
            description: 'Maintained high patient satisfaction scores for 6 months',
            earnedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
            criteria: 'Patient satisfaction > 85% for 6 consecutive months',
            icon: '🏆',
          },
          {
            badgeId: 'badge-002',
            type: 'digital_excellence' as BadgeType,
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
            severity: 'medium' as const,
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
            priority: 'high' as const,
            estimatedImpact: 15,
            implementationCost: 'medium' as const,
          },
        ],
      },
      {
        hospitalId: 'hosp-002',
        hospitalName: 'Metro Medical Center',
        overallScore: 94,
        level: 'excellent' as ComplianceLevel,
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
            type: 'patient_safety' as BadgeType,
            name: 'Patient Safety Champion',
            description: 'Zero safety incidents for 12 months',
            earnedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
            criteria: 'Zero patient safety incidents for 12 consecutive months',
            icon: '🛡️',
          },
          {
            badgeId: 'badge-004',
            type: 'transparency' as BadgeType,
            name: 'Transparency Leader',
            description: 'Exceptional transparency in patient communications',
            earnedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
            criteria: '95%+ transparency score in patient feedback',
            icon: '🔍',
          },
          {
            badgeId: 'badge-005',
            type: 'innovation' as BadgeType,
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
            priority: 'medium' as const,
            estimatedImpact: 8,
            implementationCost: 'low' as const,
          },
        ],
      },
    ];

    sampleHospitals.forEach(hospital => {
      this.hospitalCompliance.set(hospital.hospitalId, hospital);
    });
  }

  /**
   * Calculate compliance score based on metrics
   */
  private calculateComplianceScore(metrics: HospitalCompliance['metrics']): number {
    const weights = {
      recordAccuracy: 0.25,
      responseTime: 0.15,
      patientSatisfaction: 0.20,
      disputeResolution: 0.15,
      dataIntegrity: 0.15,
      auditCompliance: 0.10,
    };

    return Math.round(
      metrics.recordAccuracy * weights.recordAccuracy +
      metrics.responseTime * weights.responseTime +
      metrics.patientSatisfaction * weights.patientSatisfaction +
      metrics.disputeResolution * weights.disputeResolution +
      metrics.dataIntegrity * weights.dataIntegrity +
      metrics.auditCompliance * weights.auditCompliance
    );
  }

  /**
   * Determine compliance level based on score
   */
  private getComplianceLevel(score: number): ComplianceLevel {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    if (score >= 60) return 'poor';
    return 'critical';
  }

  /**
   * Update hospital compliance metrics
   */
  async updateCompliance(
    hospitalId: string,
    metrics: Partial<HospitalCompliance['metrics']>
  ): Promise<{ txId: string; blockNo: number; newScore: number }> {
    let compliance = this.hospitalCompliance.get(hospitalId);
    if (!compliance) {
      throw new Error('Hospital not found');
    }

    // Update metrics
    compliance.metrics = { ...compliance.metrics, ...metrics };
    compliance.overallScore = this.calculateComplianceScore(compliance.metrics);
    compliance.level = this.getComplianceLevel(compliance.overallScore);
    compliance.lastUpdated = Date.now();

    // Check for badge eligibility
    await this.checkBadgeEligibility(hospitalId);

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `system:compliance`,
      action: COMPLIANCE_ACTIONS.SCORE_UPDATE,
      recordId: hospitalId,
      details: {
        hospitalId,
        newScore: compliance.overallScore,
        level: compliance.level,
        updatedMetrics: Object.keys(metrics),
        timestamp: compliance.lastUpdated,
      }
    });

    return { txId, blockNo, newScore: compliance.overallScore };
  }

  /**
   * Check badge eligibility and award badges
   */
  private async checkBadgeEligibility(hospitalId: string): Promise<void> {
    const compliance = this.hospitalCompliance.get(hospitalId);
    if (!compliance) return;

    const badgeRules = [
      {
        type: 'quality_care' as BadgeType,
        name: 'Quality Care Excellence',
        description: 'Maintained high patient satisfaction scores for 6 months',
        criteria: 'Patient satisfaction > 85% for 6 consecutive months',
        icon: '🏆',
        condition: () => compliance.metrics.patientSatisfaction > 85,
      },
      {
        type: 'patient_safety' as BadgeType,
        name: 'Patient Safety Champion',
        description: 'Exceptional safety record',
        criteria: 'Zero critical safety violations',
        icon: '🛡️',
        condition: () => compliance.violations.filter(v => v.severity === 'critical').length === 0,
      },
      {
        type: 'digital_excellence' as BadgeType,
        name: 'Digital Health Pioneer',
        description: 'Leading adoption of blockchain technology',
        criteria: '100% digital record adoption with blockchain verification',
        icon: '💻',
        condition: () => compliance.metrics.dataIntegrity > 95,
      },
      {
        type: 'transparency' as BadgeType,
        name: 'Transparency Leader',
        description: 'Exceptional transparency in patient communications',
        criteria: '95%+ transparency score in patient feedback',
        icon: '🔍',
        condition: () => compliance.metrics.disputeResolution > 90,
      },
    ];

    for (const rule of badgeRules) {
      const hasBadge = compliance.badges.some(b => b.type === rule.type);
      const meetsCondition = rule.condition();

      if (meetsCondition && !hasBadge) {
        await this.awardBadge(hospitalId, rule);
      } else if (!meetsCondition && hasBadge) {
        await this.revokeBadge(hospitalId, rule.type);
      }
    }
  }

  /**
   * Award badge to hospital
   */
  async awardBadge(
    hospitalId: string,
    badgeInfo: Omit<HospitalBadge, 'badgeId' | 'earnedAt'>
  ): Promise<{ txId: string; blockNo: number }> {
    const compliance = this.hospitalCompliance.get(hospitalId);
    if (!compliance) {
      throw new Error('Hospital not found');
    }

    const badge: HospitalBadge = {
      badgeId: `badge-${Date.now()}`,
      earnedAt: Date.now(),
      ...badgeInfo,
    };

    compliance.badges.push(badge);

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `system:compliance`,
      action: COMPLIANCE_ACTIONS.BADGE_AWARDED,
      recordId: hospitalId,
      details: {
        hospitalId,
        badgeType: badge.type,
        badgeName: badge.name,
        earnedAt: badge.earnedAt,
      }
    });

    return { txId, blockNo };
  }

  /**
   * Revoke badge from hospital
   */
  async revokeBadge(
    hospitalId: string,
    badgeType: BadgeType
  ): Promise<{ txId: string; blockNo: number }> {
    const compliance = this.hospitalCompliance.get(hospitalId);
    if (!compliance) {
      throw new Error('Hospital not found');
    }

    const badgeIndex = compliance.badges.findIndex(b => b.type === badgeType);
    if (badgeIndex === -1) {
      throw new Error('Badge not found');
    }

    const revokedBadge = compliance.badges.splice(badgeIndex, 1)[0];

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `system:compliance`,
      action: COMPLIANCE_ACTIONS.BADGE_REVOKED,
      recordId: hospitalId,
      details: {
        hospitalId,
        badgeType: revokedBadge.type,
        badgeName: revokedBadge.name,
        revokedAt: Date.now(),
      }
    });

    return { txId, blockNo };
  }

  /**
   * Add compliance violation
   */
  async addViolation(
    hospitalId: string,
    violation: Omit<ComplianceViolation, 'violationId' | 'detectedAt'>
  ): Promise<{ txId: string; blockNo: number }> {
    const compliance = this.hospitalCompliance.get(hospitalId);
    if (!compliance) {
      throw new Error('Hospital not found');
    }

    const newViolation: ComplianceViolation = {
      violationId: `viol-${Date.now()}`,
      detectedAt: Date.now(),
      ...violation,
    };

    compliance.violations.push(newViolation);

    // Recalculate score considering penalty
    const penaltyReduction = Math.min(newViolation.penaltyPoints, 20);
    compliance.overallScore = Math.max(0, compliance.overallScore - penaltyReduction);
    compliance.level = this.getComplianceLevel(compliance.overallScore);

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `system:compliance`,
      action: COMPLIANCE_ACTIONS.VIOLATION_DETECTED,
      recordId: hospitalId,
      details: {
        hospitalId,
        violationType: violation.type,
        severity: violation.severity,
        penaltyPoints: violation.penaltyPoints,
        detectedAt: newViolation.detectedAt,
      }
    });

    return { txId, blockNo };
  }

  /**
   * Get hospital compliance data
   */
  getHospitalCompliance(hospitalId: string): HospitalCompliance | undefined {
    return this.hospitalCompliance.get(hospitalId);
  }

  /**
   * Get all hospitals compliance data
   */
  getAllHospitalsCompliance(): HospitalCompliance[] {
    return Array.from(this.hospitalCompliance.values());
  }

  /**
   * Get compliance leaderboard
   */
  getComplianceLeaderboard(): HospitalCompliance[] {
    return Array.from(this.hospitalCompliance.values())
      .sort((a, b) => b.overallScore - a.overallScore);
  }

  /**
   * Get compliance statistics
   */
  getComplianceStats(): {
    totalHospitals: number;
    averageScore: number;
    excellentHospitals: number;
    goodHospitals: number;
    fairHospitals: number;
    poorHospitals: number;
    criticalHospitals: number;
    totalBadges: number;
    totalViolations: number;
  } {
    const hospitals = Array.from(this.hospitalCompliance.values());
    const totalHospitals = hospitals.length;
    const averageScore = hospitals.reduce((sum, h) => sum + h.overallScore, 0) / totalHospitals;
    
    const levelCounts = hospitals.reduce((acc, h) => {
      acc[h.level]++;
      return acc;
    }, {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
      critical: 0,
    });

    const totalBadges = hospitals.reduce((sum, h) => sum + h.badges.length, 0);
    const totalViolations = hospitals.reduce((sum, h) => sum + h.violations.length, 0);

    return {
      totalHospitals,
      averageScore: Math.round(averageScore),
      excellentHospitals: levelCounts.excellent,
      goodHospitals: levelCounts.good,
      fairHospitals: levelCounts.fair,
      poorHospitals: levelCounts.poor,
      criticalHospitals: levelCounts.critical,
      totalBadges,
      totalViolations,
    };
  }
}

// Singleton instance
let complianceManager: ComplianceManager;

export function getComplianceManager(): ComplianceManager {
  if (!complianceManager) {
    complianceManager = new ComplianceManager();
  }
  return complianceManager;
}
