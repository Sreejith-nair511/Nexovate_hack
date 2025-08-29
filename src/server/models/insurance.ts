import { MockLedger } from '../ledger/mockLedger';

export type ClaimStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';

export interface InsuranceClaim {
  claimId: string;
  patientId: string;
  recordId: string;
  insuranceProvider: string;
  policyNumber: string;
  claimAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  submittedAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  rejectionReason?: string;
  documents: string[];
  preAuthRequired: boolean;
  preAuthNumber?: string;
}

export interface InsuranceProvider {
  providerId: string;
  name: string;
  code: string;
  apiEndpoint?: string;
  supportedPolicies: string[];
  processingTime: number; // in hours
  cashlessLimit: number;
}

const INSURANCE_ACTIONS = {
  CLAIM_SUBMIT: 'CLAIM_SUBMIT',
  CLAIM_REVIEW: 'CLAIM_REVIEW',
  CLAIM_APPROVE: 'CLAIM_APPROVE',
  CLAIM_REJECT: 'CLAIM_REJECT',
  CLAIM_PAYMENT: 'CLAIM_PAYMENT',
  PREAUTH_REQUEST: 'PREAUTH_REQUEST',
  PREAUTH_APPROVE: 'PREAUTH_APPROVE',
} as const;

export class InsuranceManager {
  private claims: Map<string, InsuranceClaim> = new Map();
  private providers: Map<string, InsuranceProvider> = new Map();
  private ledger = new MockLedger();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    const providers: InsuranceProvider[] = [
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
    ];

    providers.forEach(provider => {
      this.providers.set(provider.providerId, provider);
    });
  }

  /**
   * Submit insurance claim
   */
  async submitClaim(claimData: {
    claimId: string;
    patientId: string;
    recordId: string;
    insuranceProvider: string;
    policyNumber: string;
    claimAmount: number;
    documents: string[];
    preAuthRequired: boolean;
    preAuthNumber?: string;
  }): Promise<{ txId: string; blockNo: number }> {
    const provider = this.providers.get(claimData.insuranceProvider);
    if (!provider) {
      throw new Error('Insurance provider not found');
    }

    const claim: InsuranceClaim = {
      claimId: claimData.claimId,
      patientId: claimData.patientId,
      recordId: claimData.recordId,
      insuranceProvider: claimData.insuranceProvider,
      policyNumber: claimData.policyNumber,
      claimAmount: claimData.claimAmount,
      status: 'submitted',
      submittedAt: Date.now(),
      documents: claimData.documents,
      preAuthRequired: claimData.preAuthRequired,
      preAuthNumber: claimData.preAuthNumber,
    };

    this.claims.set(claimData.claimId, claim);

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `patient:${claimData.patientId}`,
      action: INSURANCE_ACTIONS.CLAIM_SUBMIT,
      recordId: claimData.recordId,
      details: {
        claimId: claimData.claimId,
        insuranceProvider: claimData.insuranceProvider,
        claimAmount: claimData.claimAmount,
        submittedAt: claim.submittedAt,
      }
    });

    return { txId, blockNo };
  }

  /**
   * Review insurance claim
   */
  async reviewClaim(
    claimId: string,
    reviewerId: string,
    decision: 'approve' | 'reject',
    approvedAmount?: number,
    rejectionReason?: string
  ): Promise<{ txId: string; blockNo: number }> {
    const claim = this.claims.get(claimId);
    if (!claim) {
      throw new Error('Claim not found');
    }

    if (claim.status !== 'submitted' && claim.status !== 'under_review') {
      throw new Error('Claim cannot be reviewed in current status');
    }

    claim.status = decision === 'approve' ? 'approved' : 'rejected';
    claim.reviewedAt = Date.now();
    claim.reviewedBy = reviewerId;

    if (decision === 'approve' && approvedAmount) {
      claim.approvedAmount = approvedAmount;
    } else if (decision === 'reject' && rejectionReason) {
      claim.rejectionReason = rejectionReason;
    }

    // Log to ledger
    const action = decision === 'approve' ? INSURANCE_ACTIONS.CLAIM_APPROVE : INSURANCE_ACTIONS.CLAIM_REJECT;
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `insurance:${reviewerId}`,
      action,
      recordId: claim.recordId,
      details: {
        claimId,
        decision,
        approvedAmount: claim.approvedAmount,
        rejectionReason: claim.rejectionReason,
        reviewedAt: claim.reviewedAt,
      }
    });

    return { txId, blockNo };
  }

  /**
   * Process claim payment
   */
  async processPayment(claimId: string, paymentReference: string): Promise<{ txId: string; blockNo: number }> {
    const claim = this.claims.get(claimId);
    if (!claim) {
      throw new Error('Claim not found');
    }

    if (claim.status !== 'approved') {
      throw new Error('Only approved claims can be paid');
    }

    claim.status = 'paid';

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `insurance:${claim.insuranceProvider}`,
      action: INSURANCE_ACTIONS.CLAIM_PAYMENT,
      recordId: claim.recordId,
      details: {
        claimId,
        paymentReference,
        amount: claim.approvedAmount || claim.claimAmount,
        paidAt: Date.now(),
      }
    });

    return { txId, blockNo };
  }

  /**
   * Request pre-authorization
   */
  async requestPreAuth(preAuthData: {
    patientId: string;
    recordId: string;
    insuranceProvider: string;
    policyNumber: string;
    estimatedAmount: number;
    treatmentDetails: string;
  }): Promise<{ preAuthNumber: string; txId: string; blockNo: number }> {
    const preAuthNumber = `PA${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `hospital:${preAuthData.recordId}`,
      action: INSURANCE_ACTIONS.PREAUTH_REQUEST,
      recordId: preAuthData.recordId,
      details: {
        preAuthNumber,
        patientId: preAuthData.patientId,
        insuranceProvider: preAuthData.insuranceProvider,
        estimatedAmount: preAuthData.estimatedAmount,
        treatmentDetails: preAuthData.treatmentDetails,
        requestedAt: Date.now(),
      }
    });

    return { preAuthNumber, txId, blockNo };
  }

  /**
   * Get claims by patient
   */
  getClaimsByPatient(patientId: string): InsuranceClaim[] {
    return Array.from(this.claims.values()).filter(claim => claim.patientId === patientId);
  }

  /**
   * Get claims by status
   */
  getClaimsByStatus(status: ClaimStatus): InsuranceClaim[] {
    return Array.from(this.claims.values()).filter(claim => claim.status === status);
  }

  /**
   * Get insurance providers
   */
  getProviders(): InsuranceProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get claim by ID
   */
  getClaim(claimId: string): InsuranceClaim | undefined {
    return this.claims.get(claimId);
  }

  /**
   * Calculate claim processing statistics
   */
  getClaimStats(): {
    totalClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
    pendingClaims: number;
    totalClaimAmount: number;
    totalApprovedAmount: number;
    averageProcessingTime: number;
  } {
    const claims = Array.from(this.claims.values());
    const approvedClaims = claims.filter(c => c.status === 'approved' || c.status === 'paid');
    const rejectedClaims = claims.filter(c => c.status === 'rejected');
    const pendingClaims = claims.filter(c => c.status === 'submitted' || c.status === 'under_review');

    const totalClaimAmount = claims.reduce((sum, c) => sum + c.claimAmount, 0);
    const totalApprovedAmount = approvedClaims.reduce((sum, c) => sum + (c.approvedAmount || c.claimAmount), 0);

    const processedClaims = claims.filter(c => c.reviewedAt);
    const averageProcessingTime = processedClaims.length > 0
      ? processedClaims.reduce((sum, c) => sum + (c.reviewedAt! - c.submittedAt), 0) / processedClaims.length / (1000 * 60 * 60) // in hours
      : 0;

    return {
      totalClaims: claims.length,
      approvedClaims: approvedClaims.length,
      rejectedClaims: rejectedClaims.length,
      pendingClaims: pendingClaims.length,
      totalClaimAmount,
      totalApprovedAmount,
      averageProcessingTime,
    };
  }
}

// Singleton instance
let insuranceManager: InsuranceManager;

export function getInsuranceManager(): InsuranceManager {
  if (!insuranceManager) {
    insuranceManager = new InsuranceManager();
  }
  return insuranceManager;
}
