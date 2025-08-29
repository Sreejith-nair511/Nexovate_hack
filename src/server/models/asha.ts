import { MockLedger } from '../ledger/mockLedger';
import { signPayload, verifySignedPayload, SignedPayload } from '../crypto/signing';

export interface ASHAWorker {
  ashaId: string;
  name: string;
  phoneNumber: string;
  village: string;
  district: string;
  state: string;
  publicKey: string;
  privateKey: string;
  isActive: boolean;
  certificationDate: number;
  lastActivity: number;
  coSignedRecords: number;
  rating: number;
  specializations: string[];
}

export interface OTPCoSignRequest {
  requestId: string;
  recordId: string;
  patientId: string;
  doctorId: string;
  ashaId: string;
  otp: string;
  otpExpires: number;
  status: 'pending' | 'verified' | 'expired' | 'failed';
  createdAt: number;
  verifiedAt?: number;
  recordSummary: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
}

export interface ASHAActivity {
  activityId: string;
  ashaId: string;
  type: 'record_cosign' | 'patient_visit' | 'health_education' | 'emergency_response' | 'data_collection';
  description: string;
  patientId?: string;
  recordId?: string;
  timestamp: number;
  location: {
    village: string;
    coordinates?: { lat: number; lng: number };
  };
  outcome: string;
  followUpRequired: boolean;
}

export interface PatientConsent {
  consentId: string;
  patientId: string;
  ashaId: string;
  recordId: string;
  consentType: 'record_access' | 'data_sharing' | 'emergency_contact';
  grantedAt: number;
  expiresAt?: number;
  isActive: boolean;
  consentMethod: 'verbal' | 'thumbprint' | 'digital_signature' | 'otp';
}

const ASHA_ACTIONS = {
  WORKER_REGISTERED: 'WORKER_REGISTERED',
  OTP_SENT: 'OTP_SENT',
  OTP_VERIFIED: 'OTP_VERIFIED',
  RECORD_COSIGNED: 'RECORD_COSIGNED',
  PATIENT_VISIT: 'PATIENT_VISIT',
  CONSENT_GRANTED: 'CONSENT_GRANTED',
  EMERGENCY_RESPONSE: 'EMERGENCY_RESPONSE',
} as const;

export class ASHAManager {
  private ashaWorkers: Map<string, ASHAWorker> = new Map();
  private otpRequests: Map<string, OTPCoSignRequest> = new Map();
  private activities: Map<string, ASHAActivity[]> = new Map();
  private patientConsents: Map<string, PatientConsent[]> = new Map();
  private ledger = new MockLedger();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleASHAWorkers: ASHAWorker[] = [
      {
        ashaId: 'asha-001',
        name: 'Sunita Devi',
        phoneNumber: '+919876543210',
        village: 'Rampur',
        district: 'Sitapur',
        state: 'Uttar Pradesh',
        publicKey: 'asha001_public_key',
        privateKey: 'asha001_private_key',
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
        publicKey: 'asha002_public_key',
        privateKey: 'asha002_private_key',
        isActive: true,
        certificationDate: Date.now() - 200 * 24 * 60 * 60 * 1000,
        lastActivity: Date.now() - 30 * 60 * 1000,
        coSignedRecords: 23,
        rating: 4.6,
        specializations: ['hypertension_monitoring', 'elderly_care', 'nutrition_counseling'],
      },
      {
        ashaId: 'asha-003',
        name: 'Lakshmi Reddy',
        phoneNumber: '+919876543212',
        village: 'Anantapur',
        district: 'Anantapur',
        state: 'Andhra Pradesh',
        publicKey: 'asha003_public_key',
        privateKey: 'asha003_private_key',
        isActive: true,
        certificationDate: Date.now() - 180 * 24 * 60 * 60 * 1000,
        lastActivity: Date.now() - 4 * 60 * 60 * 1000,
        coSignedRecords: 67,
        rating: 4.9,
        specializations: ['tuberculosis_care', 'mental_health', 'family_planning'],
      },
    ];

    sampleASHAWorkers.forEach(asha => {
      this.ashaWorkers.set(asha.ashaId, asha);
      this.activities.set(asha.ashaId, []);
      this.patientConsents.set(asha.ashaId, []);
    });

    // Sample activities
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
      {
        activityId: 'activity-002',
        ashaId: 'asha-002',
        type: 'health_education',
        description: 'Community health awareness session on hygiene',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        location: { village: 'Bharatpur' },
        outcome: '25 villagers attended, distributed hygiene kits',
        followUpRequired: false,
      },
    ];

    sampleActivities.forEach(activity => {
      const activities = this.activities.get(activity.ashaId) || [];
      activities.push(activity);
      this.activities.set(activity.ashaId, activities);
    });
  }

  /**
   * Register new ASHA worker
   */
  async registerASHAWorker(
    workerData: Omit<ASHAWorker, 'ashaId' | 'publicKey' | 'privateKey' | 'certificationDate' | 'lastActivity' | 'coSignedRecords' | 'rating'>
  ): Promise<{ ashaId: string; txId: string; blockNo: number }> {
    const ashaId = `asha-${Date.now()}`;
    
    // Generate keypair for ASHA worker
    const publicKey = `${ashaId}_public_key`;
    const privateKey = `${ashaId}_private_key`;

    const newASHA: ASHAWorker = {
      ashaId,
      publicKey,
      privateKey,
      certificationDate: Date.now(),
      lastActivity: Date.now(),
      coSignedRecords: 0,
      rating: 5.0,
      ...workerData,
    };

    this.ashaWorkers.set(ashaId, newASHA);
    this.activities.set(ashaId, []);
    this.patientConsents.set(ashaId, []);

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `asha:${ashaId}`,
      action: ASHA_ACTIONS.WORKER_REGISTERED,
      details: {
        ashaId,
        name: newASHA.name,
        village: newASHA.village,
        district: newASHA.district,
        state: newASHA.state,
        phoneNumber: newASHA.phoneNumber,
        specializations: newASHA.specializations,
      }
    });

    return { ashaId, txId, blockNo };
  }

  /**
   * Request OTP for record co-signing
   */
  async requestOTPCoSign(
    recordId: string,
    patientId: string,
    doctorId: string,
    ashaId: string,
    recordSummary: string,
    urgencyLevel: 'low' | 'medium' | 'high' | 'emergency' = 'medium'
  ): Promise<{ requestId: string; otp: string; txId: string; blockNo: number }> {
    const ashaWorker = this.ashaWorkers.get(ashaId);
    if (!ashaWorker) {
      throw new Error('ASHA worker not found');
    }

    if (!ashaWorker.isActive) {
      throw new Error('ASHA worker is not active');
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const requestId = `otp-req-${Date.now()}`;
    const otpExpires = Date.now() + (urgencyLevel === 'emergency' ? 2 * 60 * 1000 : 10 * 60 * 1000);

    const otpRequest: OTPCoSignRequest = {
      requestId,
      recordId,
      patientId,
      doctorId,
      ashaId,
      otp,
      otpExpires,
      status: 'pending',
      createdAt: Date.now(),
      recordSummary,
      urgencyLevel,
    };

    this.otpRequests.set(requestId, otpRequest);

    // Update ASHA last activity
    ashaWorker.lastActivity = Date.now();

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `doctor:${doctorId}`,
      action: ASHA_ACTIONS.OTP_SENT,
      recordId,
      details: {
        requestId,
        ashaId,
        patientId,
        urgencyLevel,
        otpExpires,
        recordSummary: recordSummary.substring(0, 100) + '...',
      }
    });

    return { requestId, otp, txId, blockNo };
  }

  /**
   * Verify OTP and co-sign record
   */
  async verifyOTPAndCoSign(
    requestId: string,
    providedOTP: string,
    ashaSignature?: string
  ): Promise<{ 
    success: boolean; 
    txId?: string; 
    blockNo?: number; 
    signedPayload?: SignedPayload;
    message: string;
  }> {
    const otpRequest = this.otpRequests.get(requestId);
    if (!otpRequest) {
      return { success: false, message: 'OTP request not found' };
    }

    if (otpRequest.status !== 'pending') {
      return { success: false, message: 'OTP request already processed' };
    }

    if (Date.now() > otpRequest.otpExpires) {
      otpRequest.status = 'expired';
      return { success: false, message: 'OTP has expired' };
    }

    if (otpRequest.otp !== providedOTP) {
      otpRequest.status = 'failed';
      return { success: false, message: 'Invalid OTP' };
    }

    // OTP verified successfully
    otpRequest.status = 'verified';
    otpRequest.verifiedAt = Date.now();

    const ashaWorker = this.ashaWorkers.get(otpRequest.ashaId);
    if (!ashaWorker) {
      return { success: false, message: 'ASHA worker not found' };
    }

    // Create co-signature payload
    const coSignPayload = {
      recordId: otpRequest.recordId,
      patientId: otpRequest.patientId,
      doctorId: otpRequest.doctorId,
      ashaId: otpRequest.ashaId,
      coSignedAt: Date.now(),
      otpVerified: true,
      requestId,
    };

    // Sign the payload with ASHA's private key
    const signedPayload = signPayload(ashaWorker.privateKey, coSignPayload);

    // Update ASHA statistics
    ashaWorker.coSignedRecords += 1;
    ashaWorker.lastActivity = Date.now();

    // Record activity
    const activity: ASHAActivity = {
      activityId: `activity-${Date.now()}`,
      ashaId: otpRequest.ashaId,
      type: 'record_cosign',
      description: `Co-signed medical record via OTP verification`,
      patientId: otpRequest.patientId,
      recordId: otpRequest.recordId,
      timestamp: Date.now(),
      location: { village: ashaWorker.village },
      outcome: 'Record successfully co-signed with OTP verification',
      followUpRequired: false,
    };

    const activities = this.activities.get(otpRequest.ashaId) || [];
    activities.push(activity);
    this.activities.set(otpRequest.ashaId, activities);

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `asha:${otpRequest.ashaId}`,
      action: ASHA_ACTIONS.RECORD_COSIGNED,
      recordId: otpRequest.recordId,
      details: {
        requestId,
        ashaId: otpRequest.ashaId,
        patientId: otpRequest.patientId,
        doctorId: otpRequest.doctorId,
        otpVerified: true,
        coSignedAt: Date.now(),
        urgencyLevel: otpRequest.urgencyLevel,
      }
    });

    return { 
      success: true, 
      txId, 
      blockNo, 
      signedPayload,
      message: 'Record successfully co-signed' 
    };
  }

  /**
   * Record patient visit activity
   */
  async recordPatientVisit(
    ashaId: string,
    patientId: string,
    description: string,
    outcome: string,
    followUpRequired: boolean,
    location?: { lat: number; lng: number }
  ): Promise<{ activityId: string; txId: string; blockNo: number }> {
    const ashaWorker = this.ashaWorkers.get(ashaId);
    if (!ashaWorker) {
      throw new Error('ASHA worker not found');
    }

    const activityId = `activity-${Date.now()}`;
    const activity: ASHAActivity = {
      activityId,
      ashaId,
      type: 'patient_visit',
      description,
      patientId,
      timestamp: Date.now(),
      location: {
        village: ashaWorker.village,
        coordinates: location,
      },
      outcome,
      followUpRequired,
    };

    const activities = this.activities.get(ashaId) || [];
    activities.push(activity);
    this.activities.set(ashaId, activities);

    // Update ASHA last activity
    ashaWorker.lastActivity = Date.now();

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `asha:${ashaId}`,
      action: ASHA_ACTIONS.PATIENT_VISIT,
      details: {
        activityId,
        ashaId,
        patientId,
        description,
        outcome,
        followUpRequired,
        village: ashaWorker.village,
      }
    });

    return { activityId, txId, blockNo };
  }

  /**
   * Grant patient consent
   */
  async grantPatientConsent(
    patientId: string,
    ashaId: string,
    recordId: string,
    consentType: 'record_access' | 'data_sharing' | 'emergency_contact',
    consentMethod: 'verbal' | 'thumbprint' | 'digital_signature' | 'otp',
    expirationDays?: number
  ): Promise<{ consentId: string; txId: string; blockNo: number }> {
    const ashaWorker = this.ashaWorkers.get(ashaId);
    if (!ashaWorker) {
      throw new Error('ASHA worker not found');
    }

    const consentId = `consent-${Date.now()}`;
    const expiresAt = expirationDays ? Date.now() + (expirationDays * 24 * 60 * 60 * 1000) : undefined;

    const consent: PatientConsent = {
      consentId,
      patientId,
      ashaId,
      recordId,
      consentType,
      grantedAt: Date.now(),
      expiresAt,
      isActive: true,
      consentMethod,
    };

    const consents = this.patientConsents.get(ashaId) || [];
    consents.push(consent);
    this.patientConsents.set(ashaId, consents);

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `asha:${ashaId}`,
      action: ASHA_ACTIONS.CONSENT_GRANTED,
      recordId,
      details: {
        consentId,
        patientId,
        ashaId,
        consentType,
        consentMethod,
        expiresAt,
      }
    });

    return { consentId, txId, blockNo };
  }

  /**
   * Get ASHA worker details
   */
  getASHAWorker(ashaId: string): ASHAWorker | undefined {
    return this.ashaWorkers.get(ashaId);
  }

  /**
   * Get all ASHA workers
   */
  getAllASHAWorkers(): ASHAWorker[] {
    return Array.from(this.ashaWorkers.values());
  }

  /**
   * Get ASHA workers by location
   */
  getASHAWorkersByLocation(district: string, state?: string): ASHAWorker[] {
    return Array.from(this.ashaWorkers.values()).filter(asha => {
      if (state) {
        return asha.district === district && asha.state === state;
      }
      return asha.district === district;
    });
  }

  /**
   * Get ASHA activities
   */
  getASHAActivities(ashaId: string): ASHAActivity[] {
    return this.activities.get(ashaId) || [];
  }

  /**
   * Get pending OTP requests for ASHA
   */
  getPendingOTPRequests(ashaId: string): OTPCoSignRequest[] {
    return Array.from(this.otpRequests.values()).filter(
      req => req.ashaId === ashaId && req.status === 'pending'
    );
  }

  /**
   * Get patient consents managed by ASHA
   */
  getPatientConsents(ashaId: string): PatientConsent[] {
    return this.patientConsents.get(ashaId) || [];
  }

  /**
   * Get ASHA performance statistics
   */
  getASHAStats(ashaId: string): {
    totalActivities: number;
    coSignedRecords: number;
    patientVisits: number;
    healthEducationSessions: number;
    emergencyResponses: number;
    averageResponseTime: number;
    rating: number;
    activeConsents: number;
  } {
    const asha = this.ashaWorkers.get(ashaId);
    const activities = this.activities.get(ashaId) || [];
    const consents = this.patientConsents.get(ashaId) || [];

    if (!asha) {
      throw new Error('ASHA worker not found');
    }

    const patientVisits = activities.filter(a => a.type === 'patient_visit').length;
    const healthEducationSessions = activities.filter(a => a.type === 'health_education').length;
    const emergencyResponses = activities.filter(a => a.type === 'emergency_response').length;
    const activeConsents = consents.filter(c => c.isActive && (!c.expiresAt || c.expiresAt > Date.now())).length;

    return {
      totalActivities: activities.length,
      coSignedRecords: asha.coSignedRecords,
      patientVisits,
      healthEducationSessions,
      emergencyResponses,
      averageResponseTime: 15, // Mock data - in real scenario, calculate from response times
      rating: asha.rating,
      activeConsents,
    };
  }

  /**
   * Get system-wide ASHA statistics
   */
  getSystemStats(): {
    totalASHAWorkers: number;
    activeASHAWorkers: number;
    totalCoSignedRecords: number;
    totalActivities: number;
    averageRating: number;
    stateDistribution: Record<string, number>;
    specializationDistribution: Record<string, number>;
  } {
    const workers = Array.from(this.ashaWorkers.values());
    const activeWorkers = workers.filter(w => w.isActive);
    const totalCoSignedRecords = workers.reduce((sum, w) => sum + w.coSignedRecords, 0);
    const totalActivities = Array.from(this.activities.values()).reduce((sum, activities) => sum + activities.length, 0);
    const averageRating = workers.reduce((sum, w) => sum + w.rating, 0) / workers.length;

    const stateDistribution = workers.reduce((acc, worker) => {
      acc[worker.state] = (acc[worker.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const specializationDistribution = workers.reduce((acc, worker) => {
      worker.specializations.forEach(spec => {
        acc[spec] = (acc[spec] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalASHAWorkers: workers.length,
      activeASHAWorkers: activeWorkers.length,
      totalCoSignedRecords,
      totalActivities,
      averageRating: Math.round(averageRating * 10) / 10,
      stateDistribution,
      specializationDistribution,
    };
  }

  /**
   * Cleanup expired OTP requests
   */
  cleanupExpiredOTPs(): void {
    const now = Date.now();
    for (const [requestId, request] of this.otpRequests.entries()) {
      if (request.status === 'pending' && now > request.otpExpires) {
        request.status = 'expired';
      }
    }
  }
}

// Singleton instance
let ashaManager: ASHAManager;

export function getASHAManager(): ASHAManager {
  if (!ashaManager) {
    ashaManager = new ASHAManager();
  }
  return ashaManager;
}
