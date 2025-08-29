import QRCode from 'qrcode';
import { MockLedger } from '../ledger/mockLedger';

export interface HealthCard {
  cardId: string;
  patientId: string;
  patientName: string;
  abhaId?: string;
  bloodGroup: string;
  emergencyContact: string;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  qrCodeData: string;
  qrCodeImage: string;
  issuedAt: number;
  expiresAt: number;
  isActive: boolean;
  issuerHospitalId: string;
  digitalSignature: string;
}

export interface QRScanResult {
  cardId: string;
  patientId: string;
  patientName: string;
  basicInfo: {
    bloodGroup: string;
    emergencyContact: string;
    allergies: string[];
    chronicConditions: string[];
  };
  verificationStatus: 'valid' | 'expired' | 'invalid' | 'revoked';
  lastUpdated: number;
  accessLevel: 'basic' | 'full' | 'emergency';
}

export interface QRAccessLog {
  logId: string;
  cardId: string;
  accessedBy: string;
  accessType: 'scan' | 'verify' | 'update';
  location?: string;
  timestamp: number;
  accessLevel: 'basic' | 'full' | 'emergency';
  purpose: string;
}

const QR_ACTIONS = {
  CARD_GENERATED: 'CARD_GENERATED',
  CARD_SCANNED: 'CARD_SCANNED',
  CARD_VERIFIED: 'CARD_VERIFIED',
  CARD_UPDATED: 'CARD_UPDATED',
  CARD_REVOKED: 'CARD_REVOKED',
} as const;

export class QRHealthCardManager {
  private healthCards: Map<string, HealthCard> = new Map();
  private accessLogs: Map<string, QRAccessLog[]> = new Map();
  private ledger = new MockLedger();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
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
        qrCodeData: JSON.stringify({
          cardId: 'card-001',
          patientId: 'patient-001',
          name: 'Rajesh Kumar',
          bloodGroup: 'O+',
          emergency: '+919876543210',
          issued: Date.now(),
          expires: Date.now() + 365 * 24 * 60 * 60 * 1000
        }),
        qrCodeImage: '', // Will be generated
        issuedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() + 335 * 24 * 60 * 60 * 1000,
        isActive: true,
        issuerHospitalId: 'hosp-001',
        digitalSignature: 'sample_signature_001',
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
        qrCodeData: JSON.stringify({
          cardId: 'card-002',
          patientId: 'patient-002',
          name: 'Priya Sharma',
          bloodGroup: 'A+',
          emergency: '+919876543211',
          issued: Date.now(),
          expires: Date.now() + 365 * 24 * 60 * 60 * 1000
        }),
        qrCodeImage: '',
        issuedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() + 350 * 24 * 60 * 60 * 1000,
        isActive: true,
        issuerHospitalId: 'hosp-002',
        digitalSignature: 'sample_signature_002',
      },
    ];

    sampleCards.forEach(card => {
      this.healthCards.set(card.cardId, card);
      this.accessLogs.set(card.cardId, []);
    });
  }

  /**
   * Generate QR health card for patient
   */
  async generateHealthCard(
    patientId: string,
    patientName: string,
    patientData: {
      abhaId?: string;
      bloodGroup: string;
      emergencyContact: string;
      allergies: string[];
      chronicConditions: string[];
      medications: string[];
    },
    issuerHospitalId: string,
    validityDays: number = 365
  ): Promise<{ cardId: string; qrCodeImage: string; txId: string; blockNo: number }> {
    const cardId = `card-${Date.now()}`;
    const issuedAt = Date.now();
    const expiresAt = issuedAt + (validityDays * 24 * 60 * 60 * 1000);

    // Create QR code data
    const qrData = {
      cardId,
      patientId,
      name: patientName,
      bloodGroup: patientData.bloodGroup,
      emergency: patientData.emergencyContact,
      allergies: patientData.allergies,
      conditions: patientData.chronicConditions,
      issued: issuedAt,
      expires: expiresAt,
      issuer: issuerHospitalId,
      version: '1.0'
    };

    const qrCodeData = JSON.stringify(qrData);

    // Generate QR code image
    const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });

    // Create health card
    const healthCard: HealthCard = {
      cardId,
      patientId,
      patientName,
      abhaId: patientData.abhaId,
      bloodGroup: patientData.bloodGroup,
      emergencyContact: patientData.emergencyContact,
      allergies: patientData.allergies,
      chronicConditions: patientData.chronicConditions,
      medications: patientData.medications,
      qrCodeData,
      qrCodeImage,
      issuedAt,
      expiresAt,
      isActive: true,
      issuerHospitalId,
      digitalSignature: `signature_${cardId}`, // In real implementation, use proper signing
    };

    this.healthCards.set(cardId, healthCard);
    this.accessLogs.set(cardId, []);

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: `hospital:${issuerHospitalId}`,
      action: QR_ACTIONS.CARD_GENERATED,
      details: {
        cardId,
        patientId,
        patientName,
        issuerHospitalId,
        issuedAt,
        expiresAt,
        bloodGroup: patientData.bloodGroup,
      }
    });

    return { cardId, qrCodeImage, txId, blockNo };
  }

  /**
   * Scan and verify QR health card
   */
  async scanHealthCard(
    qrCodeData: string,
    scannedBy: string,
    accessLevel: 'basic' | 'full' | 'emergency' = 'basic',
    purpose: string = 'routine_check',
    location?: string
  ): Promise<QRScanResult> {
    try {
      const qrData = JSON.parse(qrCodeData);
      const cardId = qrData.cardId;
      
      const healthCard = this.healthCards.get(cardId);
      if (!healthCard) {
        return {
          cardId: cardId || 'unknown',
          patientId: 'unknown',
          patientName: 'Unknown',
          basicInfo: {
            bloodGroup: 'Unknown',
            emergencyContact: 'Unknown',
            allergies: [],
            chronicConditions: [],
          },
          verificationStatus: 'invalid',
          lastUpdated: Date.now(),
          accessLevel: 'basic',
        };
      }

      // Check expiry
      if (Date.now() > healthCard.expiresAt) {
        await this.logAccess(cardId, scannedBy, 'scan', location, accessLevel, purpose);
        return {
          cardId,
          patientId: healthCard.patientId,
          patientName: healthCard.patientName,
          basicInfo: {
            bloodGroup: healthCard.bloodGroup,
            emergencyContact: healthCard.emergencyContact,
            allergies: healthCard.allergies,
            chronicConditions: healthCard.chronicConditions,
          },
          verificationStatus: 'expired',
          lastUpdated: healthCard.issuedAt,
          accessLevel,
        };
      }

      // Check if card is active
      if (!healthCard.isActive) {
        await this.logAccess(cardId, scannedBy, 'scan', location, accessLevel, purpose);
        return {
          cardId,
          patientId: healthCard.patientId,
          patientName: healthCard.patientName,
          basicInfo: {
            bloodGroup: healthCard.bloodGroup,
            emergencyContact: healthCard.emergencyContact,
            allergies: healthCard.allergies,
            chronicConditions: healthCard.chronicConditions,
          },
          verificationStatus: 'revoked',
          lastUpdated: healthCard.issuedAt,
          accessLevel,
        };
      }

      // Log successful access
      await this.logAccess(cardId, scannedBy, 'scan', location, accessLevel, purpose);

      // Log to blockchain ledger
      await this.ledger.appendTx({
        actor: scannedBy,
        action: QR_ACTIONS.CARD_SCANNED,
        details: {
          cardId,
          patientId: healthCard.patientId,
          scannedBy,
          accessLevel,
          purpose,
          location,
          timestamp: Date.now(),
        }
      });

      return {
        cardId,
        patientId: healthCard.patientId,
        patientName: healthCard.patientName,
        basicInfo: {
          bloodGroup: healthCard.bloodGroup,
          emergencyContact: healthCard.emergencyContact,
          allergies: healthCard.allergies,
          chronicConditions: healthCard.chronicConditions,
        },
        verificationStatus: 'valid',
        lastUpdated: healthCard.issuedAt,
        accessLevel,
      };

    } catch (error) {
      return {
        cardId: 'unknown',
        patientId: 'unknown',
        patientName: 'Unknown',
        basicInfo: {
          bloodGroup: 'Unknown',
          emergencyContact: 'Unknown',
          allergies: [],
          chronicConditions: [],
        },
        verificationStatus: 'invalid',
        lastUpdated: Date.now(),
        accessLevel: 'basic',
      };
    }
  }

  /**
   * Update health card information
   */
  async updateHealthCard(
    cardId: string,
    updates: Partial<Pick<HealthCard, 'allergies' | 'chronicConditions' | 'medications' | 'emergencyContact'>>,
    updatedBy: string
  ): Promise<{ success: boolean; txId?: string; blockNo?: number; newQRCode?: string }> {
    const healthCard = this.healthCards.get(cardId);
    if (!healthCard) {
      return { success: false };
    }

    // Update card data
    Object.assign(healthCard, updates);

    // Regenerate QR code with updated data
    const qrData = {
      cardId,
      patientId: healthCard.patientId,
      name: healthCard.patientName,
      bloodGroup: healthCard.bloodGroup,
      emergency: healthCard.emergencyContact,
      allergies: healthCard.allergies,
      conditions: healthCard.chronicConditions,
      issued: healthCard.issuedAt,
      expires: healthCard.expiresAt,
      issuer: healthCard.issuerHospitalId,
      version: '1.1',
      lastUpdated: Date.now()
    };

    healthCard.qrCodeData = JSON.stringify(qrData);
    healthCard.qrCodeImage = await QRCode.toDataURL(healthCard.qrCodeData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 256
    });

    // Log access
    await this.logAccess(cardId, updatedBy, 'update', undefined, 'full', 'card_update');

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: updatedBy,
      action: QR_ACTIONS.CARD_UPDATED,
      details: {
        cardId,
        patientId: healthCard.patientId,
        updatedBy,
        updates: Object.keys(updates),
        timestamp: Date.now(),
      }
    });

    return { success: true, txId, blockNo, newQRCode: healthCard.qrCodeImage };
  }

  /**
   * Revoke health card
   */
  async revokeHealthCard(
    cardId: string,
    revokedBy: string,
    reason: string
  ): Promise<{ success: boolean; txId?: string; blockNo?: number }> {
    const healthCard = this.healthCards.get(cardId);
    if (!healthCard) {
      return { success: false };
    }

    healthCard.isActive = false;

    // Log to ledger
    const { txId, blockNo } = await this.ledger.appendTx({
      actor: revokedBy,
      action: QR_ACTIONS.CARD_REVOKED,
      details: {
        cardId,
        patientId: healthCard.patientId,
        revokedBy,
        reason,
        timestamp: Date.now(),
      }
    });

    return { success: true, txId, blockNo };
  }

  /**
   * Log access to health card
   */
  private async logAccess(
    cardId: string,
    accessedBy: string,
    accessType: 'scan' | 'verify' | 'update',
    location?: string,
    accessLevel: 'basic' | 'full' | 'emergency' = 'basic',
    purpose: string = 'routine_check'
  ): Promise<void> {
    const logId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const accessLog: QRAccessLog = {
      logId,
      cardId,
      accessedBy,
      accessType,
      location,
      timestamp: Date.now(),
      accessLevel,
      purpose,
    };

    const logs = this.accessLogs.get(cardId) || [];
    logs.push(accessLog);
    this.accessLogs.set(cardId, logs);
  }

  /**
   * Get health card by ID
   */
  getHealthCard(cardId: string): HealthCard | undefined {
    return this.healthCards.get(cardId);
  }

  /**
   * Get health cards by patient ID
   */
  getHealthCardsByPatient(patientId: string): HealthCard[] {
    return Array.from(this.healthCards.values()).filter(card => card.patientId === patientId);
  }

  /**
   * Get access logs for a card
   */
  getAccessLogs(cardId: string): QRAccessLog[] {
    return this.accessLogs.get(cardId) || [];
  }

  /**
   * Get all active health cards
   */
  getAllActiveCards(): HealthCard[] {
    return Array.from(this.healthCards.values()).filter(card => card.isActive);
  }

  /**
   * Get cards expiring soon
   */
  getExpiringCards(daysThreshold: number = 30): HealthCard[] {
    const threshold = Date.now() + (daysThreshold * 24 * 60 * 60 * 1000);
    return Array.from(this.healthCards.values()).filter(
      card => card.isActive && card.expiresAt <= threshold
    );
  }

  /**
   * Get QR card statistics
   */
  getQRStats(): {
    totalCards: number;
    activeCards: number;
    expiredCards: number;
    revokedCards: number;
    cardsExpiringIn30Days: number;
    totalScans: number;
    scansToday: number;
    topScanners: Array<{ scannedBy: string; count: number }>;
  } {
    const cards = Array.from(this.healthCards.values());
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    
    const activeCards = cards.filter(c => c.isActive && c.expiresAt > now).length;
    const expiredCards = cards.filter(c => c.expiresAt <= now).length;
    const revokedCards = cards.filter(c => !c.isActive).length;
    const expiringIn30Days = this.getExpiringCards(30).length;

    // Calculate scan statistics
    const allLogs = Array.from(this.accessLogs.values()).flat();
    const totalScans = allLogs.filter(log => log.accessType === 'scan').length;
    const scansToday = allLogs.filter(
      log => log.accessType === 'scan' && log.timestamp >= todayStart
    ).length;

    // Top scanners
    const scannerCounts = allLogs
      .filter(log => log.accessType === 'scan')
      .reduce((acc, log) => {
        acc[log.accessedBy] = (acc[log.accessedBy] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topScanners = Object.entries(scannerCounts)
      .map(([scannedBy, count]) => ({ scannedBy, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalCards: cards.length,
      activeCards,
      expiredCards,
      revokedCards,
      cardsExpiringIn30Days: expiringIn30Days,
      totalScans,
      scansToday,
      topScanners,
    };
  }
}

// Singleton instance
let qrHealthCardManager: QRHealthCardManager;

export function getQRHealthCardManager(): QRHealthCardManager {
  if (!qrHealthCardManager) {
    qrHealthCardManager = new QRHealthCardManager();
  }
  return qrHealthCardManager;
}
