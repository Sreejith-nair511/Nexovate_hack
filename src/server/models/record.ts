import { SignedPayload, verifySignedPayload } from '../crypto/signing';
import { MockLedger } from '../ledger/mockLedger';
import path from 'path';
import fs from 'fs';

export type RecordStatus = 'pending' | 'endorsed' | 'disputed';

export interface MedicalRecord {
  recordId: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  description: string;
  timestamp: number;
  payloadHash: string;
  signature: string;
  signerPublicKey: string;
  signatureVerified: boolean;
  status: RecordStatus;
  abhaId?: string;
  consentArtifactId?: string;
  disputeReason?: string;
  endorsedBy?: string;
  endorsedAt?: number;
  feedback?: {
    patientId: string;
    rating: number;
    comment: string;
    timestamp: number;
  }[];
}

export interface RecordNotification {
  id: string;
  patientId: string;
  recordId: string;
  type: 'new_record' | 'dispute_resolved' | 'access_request';
  message: string;
  timestamp: number;
  read: boolean;
}

export class RecordManager {
  private records: Map<string, MedicalRecord> = new Map();
  private notifications: Map<string, RecordNotification[]> = new Map();
  private ledger = new MockLedger();

  /**
   * Add a new medical record with signature verification
   */
  async addRecord(signedPayload: SignedPayload, metadata: {
    recordId: string;
    patientId: string;
    doctorId: string;
    hospitalId: string;
    description: string;
    abhaId?: string;
    consentArtifactId?: string;
  }): Promise<{ txId: string; blockNo: number; signatureVerified: boolean }> {
    const { recordId, patientId, doctorId, hospitalId, description, abhaId, consentArtifactId } = metadata;
    
    // Verify signature
    const signatureVerified = verifySignedPayload(signedPayload);
    
    // Determine initial status
    let status: RecordStatus = signatureVerified ? 'pending' : 'disputed';
    let disputeReason: string | undefined;
    
    if (!signatureVerified) {
      disputeReason = 'Invalid digital signature detected';
    }

    // Create record
    const record: MedicalRecord = {
      recordId,
      patientId,
      doctorId,
      hospitalId,
      description,
      timestamp: signedPayload.timestamp,
      payloadHash: signedPayload.payloadHash,
      signature: signedPayload.signature,
      signerPublicKey: signedPayload.signerPublicKey,
      signatureVerified,
      status,
      abhaId,
      consentArtifactId,
      disputeReason
    };

    this.records.set(recordId, record);

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `doctor:${doctorId}`,
      action: LEDGER_ACTIONS.RECORD_ADD,
      recordId,
      details: {
        patientId,
        hospitalId,
        signatureVerified,
        status,
        disputeReason: disputeReason || null
      }
    });

    // Create notification for patient
    await this.createNotification(patientId, {
      recordId,
      type: 'new_record',
      message: `Dr. ${doctorId} added a new medical record. ${signatureVerified ? 'Signature verified.' : 'Signature verification failed!'}`
    });

    return { txId, blockNo, signatureVerified };
  }

  /**
   * Endorse a record (hospital admin action)
   */
  async endorseRecord(recordId: string, endorsedBy: string, hospitalId: string): Promise<{ txId: string; blockNo: number }> {
    const record = this.records.get(recordId);
    if (!record) {
      throw new Error('Record not found');
    }

    if (record.status !== 'pending') {
      throw new Error('Only pending records can be endorsed');
    }

    record.status = 'endorsed';
    record.endorsedBy = endorsedBy;
    record.endorsedAt = Date.now();

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `hospital:${hospitalId}`,
      action: LEDGER_ACTIONS.RECORD_ENDORSE,
      recordId,
      details: {
        endorsedBy,
        endorsedAt: record.endorsedAt
      }
    });

    return { txId, blockNo };
  }

  /**
   * Dispute a record (patient action)
   */
  async disputeRecord(recordId: string, patientId: string, reason: string): Promise<{ txId: string; blockNo: number }> {
    const record = this.records.get(recordId);
    if (!record) {
      throw new Error('Record not found');
    }

    if (record.patientId !== patientId) {
      throw new Error('Only the patient can dispute their own record');
    }

    record.status = 'disputed';
    record.disputeReason = reason;

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `patient:${patientId}`,
      action: LEDGER_ACTIONS.RECORD_DISPUTE,
      recordId,
      details: {
        reason,
        disputedAt: Date.now()
      }
    });

    return { txId, blockNo };
  }

  /**
   * Get record by ID
   */
  getRecord(recordId: string): MedicalRecord | null {
    return this.records.get(recordId) || null;
  }

  /**
   * Get records by patient ID
   */
  getRecordsByPatient(patientId: string): MedicalRecord[] {
    return Array.from(this.records.values()).filter(record => record.patientId === patientId);
  }

  /**
   * Get records by doctor ID
   */
  getRecordsByDoctor(doctorId: string): MedicalRecord[] {
    return Array.from(this.records.values()).filter(record => record.doctorId === doctorId);
  }

  /**
   * Get records by hospital ID
   */
  getRecordsByHospital(hospitalId: string): MedicalRecord[] {
    return Array.from(this.records.values()).filter(record => record.hospitalId === hospitalId);
  }

  /**
   * Get all records
   */
  getAllRecords(): MedicalRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get disputed records
   */
  getDisputedRecords(): MedicalRecord[] {
    return Array.from(this.records.values()).filter(record => record.status === 'disputed');
  }

  /**
   * Get pending records
   */
  getPendingRecords(): MedicalRecord[] {
    return Array.from(this.records.values()).filter(record => record.status === 'pending');
  }

  /**
   * Create notification for patient
   */
  async createNotification(patientId: string, data: {
    recordId: string;
    type: 'new_record' | 'dispute_resolved' | 'access_request';
    message: string;
  }): Promise<void> {
    const notification: RecordNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      patientId,
      recordId: data.recordId,
      type: data.type,
      message: data.message,
      timestamp: Date.now(),
      read: false
    };

    const patientNotifications = this.notifications.get(patientId) || [];
    patientNotifications.push(notification);
    this.notifications.set(patientId, patientNotifications);
  }

  /**
   * Get notifications for patient
   */
  getNotifications(patientId: string): RecordNotification[] {
    return this.notifications.get(patientId) || [];
  }

  /**
   * Add feedback for a medical record
   */
  async addFeedback(recordId: string, feedback: {
    patientId: string;
    rating: number;
    comment: string;
    timestamp: number;
  }): Promise<{ txId: string; blockNo: number }> {
    const record = this.records.get(recordId);
    if (!record) {
      throw new Error('Record not found');
    }

    // Verify patient owns the record
    if (record.patientId !== feedback.patientId) {
      throw new Error('Unauthorized: Patient can only provide feedback for their own records');
    }

    // Only allow feedback for endorsed records
    if (record.status !== 'endorsed') {
      throw new Error('Feedback can only be provided for endorsed records');
    }

    // Store feedback
    if (!record.feedback) {
      record.feedback = [];
    }
    
    record.feedback.push({
      patientId: feedback.patientId,
      rating: feedback.rating,
      comment: feedback.comment,
      timestamp: feedback.timestamp
    });

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `patient:${feedback.patientId}`,
      action: LEDGER_ACTIONS.RECORD_FEEDBACK,
      recordId,
      details: {
        rating: feedback.rating,
        hasComment: !!feedback.comment,
        timestamp: feedback.timestamp
      }
    });

    // Update compliance score (placeholder for now)
    // this.updateComplianceScore(record.hospitalId);

    return { txId, blockNo };
  }

  /**
   * Get feedback for records
   */
  async getFeedback(recordId?: string, patientId?: string): Promise<any[]> {
    const feedbackList: any[] = [];

    if (recordId) {
      const record = this.records.get(recordId);
      if (record && record.feedback) {
        feedbackList.push({
          recordId,
          feedback: record.feedback
        });
      }
    } else if (patientId) {
      // Get all feedback by patient
      for (const [recId, record] of this.records.entries()) {
        if (record.patientId === patientId && record.feedback) {
          feedbackList.push({
            recordId: recId,
            feedback: record.feedback
          });
        }
      }
    }

    return feedbackList;
  }

  /**
   * Mark notification as read
   */
  markNotificationRead(patientId: string, notificationId: string): boolean {
    const notifications = this.notifications.get(patientId) || [];
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(patientId: string): number {
    const notifications = this.notifications.get(patientId) || [];
    return notifications.filter(n => !n.read).length;
  }

  /**
   * Get compliance statistics for hospital
   */
  getHospitalCompliance(hospitalId: string): {
    totalRecords: number;
    endorsedRecords: number;
    disputedRecords: number;
    signatureFailures: number;
    complianceScore: number;
  } {
    const hospitalRecords = this.getRecordsByHospital(hospitalId);
    const totalRecords = hospitalRecords.length;
    const endorsedRecords = hospitalRecords.filter(r => r.status === 'endorsed').length;
    const disputedRecords = hospitalRecords.filter(r => r.status === 'disputed').length;
    const signatureFailures = hospitalRecords.filter(r => !r.signatureVerified).length;

    // Calculate compliance score (0-3 stars)
    let score = 3;
    if (totalRecords === 0) return { totalRecords, endorsedRecords, disputedRecords, signatureFailures, complianceScore: 0 };
    
    const endorsementRate = endorsedRecords / totalRecords;
    const disputeRate = disputedRecords / totalRecords;
    const signatureFailureRate = signatureFailures / totalRecords;

    if (endorsementRate < 0.8) score--;
    if (disputeRate > 0.1) score--;
    if (signatureFailureRate > 0.05) score--;

    return {
      totalRecords,
      endorsedRecords,
      disputedRecords,
      signatureFailures,
      complianceScore: Math.max(0, score)
    };
  }
}

// Singleton instance
let recordManagerInstance: RecordManager | null = null;

export function getRecordManager(): RecordManager {
  if (!recordManagerInstance) {
    recordManagerInstance = new RecordManager();
  }
  return recordManagerInstance;
}
