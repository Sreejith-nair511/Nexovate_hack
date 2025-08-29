import { promises as fs } from 'fs';
import path from 'path';
import * as crypto from 'crypto-js';

export interface LedgerTransaction {
  txId: string;
  blockNo: number;
  timestamp: number;
  actor: string; // role:orgId format (e.g., "doctor:D001", "patient:P001")
  action: string; // RECORD_ADD, ENDORSE, DISPUTE, FLAG, VERIFY, etc.
  recordId?: string;
  details: any;
  hash: string;
}

export interface LedgerBlock {
  blockNo: number;
  timestamp: number;
  transactions: LedgerTransaction[];
  previousHash: string;
  blockHash: string;
}

export class MockLedger {
  private blocks: LedgerBlock[] = [];
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'ledger.json');
    this.initializeLedger();
  }

  private async initializeLedger() {
    try {
      await fs.mkdir(path.dirname(this.dataPath), { recursive: true });
      
      // Try to load existing ledger
      try {
        const data = await fs.readFile(this.dataPath, 'utf-8');
        this.blocks = JSON.parse(data);
      } catch (error) {
        // Create genesis block
        this.blocks = [this.createGenesisBlock()];
        await this.saveLedger();
      }
    } catch (error) {
      console.error('Failed to initialize ledger:', error);
      this.blocks = [this.createGenesisBlock()];
    }
  }

  private createGenesisBlock(): LedgerBlock {
    const genesisTransaction: LedgerTransaction = {
      txId: this.generateTxId(),
      blockNo: 0,
      timestamp: Date.now(),
      actor: 'system:genesis',
      action: 'GENESIS',
      details: { message: 'Arogya Rakshak Blockchain Initialized' },
      hash: ''
    };

    genesisTransaction.hash = this.hashTransaction(genesisTransaction);

    return {
      blockNo: 0,
      timestamp: Date.now(),
      transactions: [genesisTransaction],
      previousHash: '0',
      blockHash: this.hashBlock({
        blockNo: 0,
        timestamp: Date.now(),
        transactions: [genesisTransaction],
        previousHash: '0',
        blockHash: ''
      })
    };
  }

  private generateTxId(): string {
    return crypto.lib.WordArray.random(16).toString();
  }

  private hashTransaction(tx: LedgerTransaction): string {
    const txCopy = { ...tx, hash: '' };
    return crypto.SHA256(JSON.stringify(txCopy)).toString();
  }

  private hashBlock(block: Omit<LedgerBlock, 'blockHash'>): string {
    return crypto.SHA256(JSON.stringify(block)).toString();
  }

  private async saveLedger() {
    try {
      await fs.writeFile(this.dataPath, JSON.stringify(this.blocks, null, 2));
    } catch (error) {
      console.error('Failed to save ledger:', error);
    }
  }

  /**
   * Append a new transaction to the ledger
   */
  async appendTx(txData: {
    actor: string;
    action: string;
    recordId?: string;
    details: any;
  }): Promise<{ txId: string; blockNo: number; timestamp: number }> {
    const timestamp = Date.now();
    const blockNo = this.blocks.length;
    const txId = this.generateTxId();

    const transaction: LedgerTransaction = {
      txId,
      blockNo,
      timestamp,
      actor: txData.actor,
      action: txData.action,
      recordId: txData.recordId,
      details: txData.details,
      hash: ''
    };

    transaction.hash = this.hashTransaction(transaction);

    // Create new block
    const previousHash = this.blocks.length > 0 
      ? this.blocks[this.blocks.length - 1].blockHash 
      : '0';

    const newBlock: LedgerBlock = {
      blockNo,
      timestamp,
      transactions: [transaction],
      previousHash,
      blockHash: ''
    };

    newBlock.blockHash = this.hashBlock(newBlock);
    
    this.blocks.push(newBlock);
    await this.saveLedger();

    return { txId, blockNo, timestamp };
  }

  /**
   * Get all transactions
   */
  getAllTransactions(): LedgerTransaction[] {
    return this.blocks.flatMap(block => block.transactions);
  }

  /**
   * Get transactions by actor
   */
  getTransactionsByActor(actor: string): LedgerTransaction[] {
    return this.getAllTransactions().filter(tx => tx.actor === actor);
  }

  /**
   * Get transactions by action
   */
  getTransactionsByAction(action: string): LedgerTransaction[] {
    return this.getAllTransactions().filter(tx => tx.action === action);
  }

  /**
   * Get transactions by record ID
   */
  getTransactionsByRecordId(recordId: string): LedgerTransaction[] {
    return this.getAllTransactions().filter(tx => tx.recordId === recordId);
  }

  /**
   * Get transaction by ID
   */
  getTransactionById(txId: string): LedgerTransaction | null {
    return this.getAllTransactions().find(tx => tx.txId === txId) || null;
  }

  /**
   * Get all blocks
   */
  getAllBlocks(): LedgerBlock[] {
    return this.blocks;
  }

  /**
   * Get recent transactions (last N)
   */
  getRecentTransactions(limit: number = 50): LedgerTransaction[] {
    return this.getAllTransactions()
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get transactions within date range
   */
  getTransactionsByDateRange(startDate: Date, endDate: Date): LedgerTransaction[] {
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    return this.getAllTransactions().filter(tx => 
      tx.timestamp >= start && tx.timestamp <= end
    );
  }

  /**
   * Verify ledger integrity
   */
  verifyIntegrity(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (let i = 1; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];

      // Verify previous hash
      if (currentBlock.previousHash !== previousBlock.blockHash) {
        errors.push(`Block ${i}: Invalid previous hash`);
      }

      // Verify block hash
      const expectedBlockHash = this.hashBlock({
        blockNo: currentBlock.blockNo,
        timestamp: currentBlock.timestamp,
        transactions: currentBlock.transactions,
        previousHash: currentBlock.previousHash
      });

      if (currentBlock.blockHash !== expectedBlockHash) {
        errors.push(`Block ${i}: Invalid block hash`);
      }

      // Verify transaction hashes
      for (const tx of currentBlock.transactions) {
        const expectedTxHash = this.hashTransaction({ ...tx, hash: '' });
        if (tx.hash !== expectedTxHash) {
          errors.push(`Block ${i}, Transaction ${tx.txId}: Invalid transaction hash`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get ledger statistics
   */
  getStats() {
    const transactions = this.getAllTransactions();
    const actionCounts: Record<string, number> = {};
    const actorCounts: Record<string, number> = {};

    transactions.forEach(tx => {
      actionCounts[tx.action] = (actionCounts[tx.action] || 0) + 1;
      actorCounts[tx.actor] = (actorCounts[tx.actor] || 0) + 1;
    });

    return {
      totalBlocks: this.blocks.length,
      totalTransactions: transactions.length,
      actionCounts,
      actorCounts,
      latestBlockTime: this.blocks.length > 0 
        ? new Date(this.blocks[this.blocks.length - 1].timestamp)
        : null
    };
  }

  /**
   * Export transactions as CSV for regulatory compliance
   */
  exportToCSV(): string {
    const transactions = this.getAllTransactions();
    const headers = ['TxID', 'BlockNo', 'Timestamp', 'Actor', 'Action', 'RecordID', 'Details'];
    
    const rows = transactions.map(tx => [
      tx.txId,
      tx.blockNo.toString(),
      new Date(tx.timestamp).toISOString(),
      tx.actor,
      tx.action,
      tx.recordId || '',
      JSON.stringify(tx.details)
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }
}

// Singleton instance
let ledgerInstance: MockLedger | null = null;

export function getLedger(): MockLedger {
  if (!ledgerInstance) {
    ledgerInstance = new MockLedger();
  }
  return ledgerInstance;
}

// Action constants
export const LEDGER_ACTIONS = {
  // Record lifecycle
  RECORD_ADD: 'RECORD_ADD',
  RECORD_ENDORSE: 'RECORD_ENDORSE',
  RECORD_DISPUTE: 'RECORD_DISPUTE',
  
  // Access control
  CONSENT_GRANTED: 'CONSENT_GRANTED',
  CONSENT_REVOKED: 'CONSENT_REVOKED',
  ACCESS_REQUEST: 'ACCESS_REQUEST',
  ACCESS_GRANTED: 'ACCESS_GRANTED',
  ACCESS_DENIED: 'ACCESS_DENIED',
  
  // Auditing
  AUDIT_FLAG: 'AUDIT_FLAG',
  AUDIT_VERIFY: 'AUDIT_VERIFY',
  AUDIT_APPROVE: 'AUDIT_APPROVE',
  AUDIT_REJECT: 'AUDIT_REJECT',
  
  // Insurance
  CLAIM_SUBMITTED: 'CLAIM_SUBMITTED',
  CLAIM_APPROVED: 'CLAIM_APPROVED',
  CLAIM_REJECTED: 'CLAIM_REJECTED',
  
  // Rural access
  USSD_VIEW: 'USSD_VIEW',
  SMS_COMMAND: 'SMS_COMMAND',
  QR_VIEW: 'QR_VIEW',
  
  // ASHA workflow
  ASHA_UPLOAD: 'ASHA_UPLOAD',
  ASHA_UPLOAD_CO_SIGNED: 'ASHA_UPLOAD_CO_SIGNED',
  OTP_GENERATED: 'OTP_GENERATED',
  OTP_VERIFIED: 'OTP_VERIFIED',
  
  // System
  GENESIS: 'GENESIS',
  SYSTEM_ALERT: 'SYSTEM_ALERT'
} as const;
