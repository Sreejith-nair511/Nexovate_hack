import { MockLedger } from '../ledger/mockLedger';

export interface BlockchainStats {
  totalBlocks: number;
  totalTransactions: number;
  averageBlockTime: number;
  networkHashRate: string;
  activeNodes: number;
  consensusAlgorithm: string;
  lastBlockTime: number;
  chainIntegrity: number;
}

export interface NetworkNode {
  nodeId: string;
  nodeType: 'hospital' | 'government' | 'insurance' | 'validator';
  location: string;
  status: 'active' | 'inactive' | 'syncing';
  lastSeen: number;
  blockHeight: number;
  version: string;
  uptime: number;
}

export interface TransactionFlow {
  fromNode: string;
  toNode: string;
  transactionType: string;
  volume: number;
  timestamp: number;
}

export interface ChainAnalytics {
  transactionsByType: Record<string, number>;
  transactionsByHour: Array<{ hour: number; count: number }>;
  topActors: Array<{ actor: string; transactionCount: number; type: string }>;
  networkActivity: Array<{ timestamp: number; activeNodes: number; tps: number }>;
  consensusMetrics: {
    validationTime: number;
    successRate: number;
    failedTransactions: number;
  };
}

export class BlockchainExplorer {
  private ledger = new MockLedger();
  private nodes: Map<string, NetworkNode> = new Map();
  private transactionFlows: TransactionFlow[] = [];

  constructor() {
    this.initializeSampleNodes();
    this.generateSampleFlows();
  }

  private initializeSampleNodes() {
    const sampleNodes: NetworkNode[] = [
      {
        nodeId: 'node-hospital-001',
        nodeType: 'hospital',
        location: 'Mumbai, Maharashtra',
        status: 'active',
        lastSeen: Date.now() - 30000,
        blockHeight: 1250,
        version: '1.2.3',
        uptime: 99.8,
      },
      {
        nodeId: 'node-hospital-002',
        nodeType: 'hospital',
        location: 'Delhi, Delhi',
        status: 'active',
        lastSeen: Date.now() - 15000,
        blockHeight: 1251,
        version: '1.2.3',
        uptime: 99.5,
      },
      {
        nodeId: 'node-gov-001',
        nodeType: 'government',
        location: 'New Delhi, Delhi',
        status: 'active',
        lastSeen: Date.now() - 5000,
        blockHeight: 1251,
        version: '1.2.4',
        uptime: 99.9,
      },
      {
        nodeId: 'node-insurance-001',
        nodeType: 'insurance',
        location: 'Bangalore, Karnataka',
        status: 'active',
        lastSeen: Date.now() - 45000,
        blockHeight: 1249,
        version: '1.2.2',
        uptime: 98.7,
      },
      {
        nodeId: 'node-validator-001',
        nodeType: 'validator',
        location: 'Hyderabad, Telangana',
        status: 'active',
        lastSeen: Date.now() - 10000,
        blockHeight: 1251,
        version: '1.2.4',
        uptime: 99.95,
      },
      {
        nodeId: 'node-validator-002',
        nodeType: 'validator',
        location: 'Chennai, Tamil Nadu',
        status: 'syncing',
        lastSeen: Date.now() - 120000,
        blockHeight: 1248,
        version: '1.2.3',
        uptime: 97.2,
      },
    ];

    sampleNodes.forEach(node => {
      this.nodes.set(node.nodeId, node);
    });
  }

  private generateSampleFlows() {
    const flowTypes = [
      'RECORD_ADD',
      'RECORD_ENDORSE',
      'INSURANCE_CLAIM',
      'COMPLIANCE_UPDATE',
      'ASHA_COSIGN',
      'PATIENT_FEEDBACK'
    ];

    const nodeIds = Array.from(this.nodes.keys());
    
    // Generate flows for the last 24 hours
    for (let i = 0; i < 100; i++) {
      const fromNode = nodeIds[Math.floor(Math.random() * nodeIds.length)];
      let toNode = nodeIds[Math.floor(Math.random() * nodeIds.length)];
      while (toNode === fromNode) {
        toNode = nodeIds[Math.floor(Math.random() * nodeIds.length)];
      }

      this.transactionFlows.push({
        fromNode,
        toNode,
        transactionType: flowTypes[Math.floor(Math.random() * flowTypes.length)],
        volume: Math.floor(Math.random() * 10) + 1,
        timestamp: Date.now() - Math.random() * 24 * 60 * 60 * 1000,
      });
    }
  }

  /**
   * Get blockchain statistics
   */
  async getBlockchainStats(): Promise<BlockchainStats> {
    const blocks = await this.ledger.getAllBlocks();
    const transactions = blocks.flatMap(block => block.transactions);
    
    const totalBlocks = blocks.length;
    const totalTransactions = transactions.length;
    
    // Calculate average block time
    let totalBlockTime = 0;
    for (let i = 1; i < blocks.length; i++) {
      totalBlockTime += blocks[i].timestamp - blocks[i - 1].timestamp;
    }
    const averageBlockTime = totalBlocks > 1 ? Math.round(totalBlockTime / (totalBlocks - 1) / 1000) : 0;

    const activeNodes = Array.from(this.nodes.values()).filter(n => n.status === 'active').length;
    const lastBlockTime = blocks.length > 0 ? blocks[blocks.length - 1].timestamp : 0;

    return {
      totalBlocks,
      totalTransactions,
      averageBlockTime,
      networkHashRate: '2.5 TH/s',
      activeNodes,
      consensusAlgorithm: 'Proof of Authority',
      lastBlockTime,
      chainIntegrity: 100,
    };
  }

  /**
   * Get network nodes
   */
  getNetworkNodes(): NetworkNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get transaction flows
   */
  getTransactionFlows(timeRange: number = 24 * 60 * 60 * 1000): TransactionFlow[] {
    const cutoff = Date.now() - timeRange;
    return this.transactionFlows.filter(flow => flow.timestamp >= cutoff);
  }

  /**
   * Get chain analytics
   */
  async getChainAnalytics(): Promise<ChainAnalytics> {
    const blocks = await this.ledger.getAllBlocks();
    const transactions = blocks.flatMap(block => block.transactions);

    // Transaction types distribution
    const transactionsByType = transactions.reduce((acc, tx) => {
      acc[tx.action] = (acc[tx.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Transactions by hour (last 24 hours)
    const now = Date.now();
    const transactionsByHour = Array.from({ length: 24 }, (_, i) => {
      const hour = 23 - i;
      const hourStart = now - (hour + 1) * 60 * 60 * 1000;
      const hourEnd = now - hour * 60 * 60 * 1000;
      
      const count = transactions.filter(tx => 
        tx.timestamp >= hourStart && tx.timestamp < hourEnd
      ).length;

      return { hour: new Date(hourEnd).getHours(), count };
    }).reverse();

    // Top actors
    const actorCounts = transactions.reduce((acc, tx) => {
      acc[tx.actor] = (acc[tx.actor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActors = Object.entries(actorCounts)
      .map(([actor, transactionCount]) => ({
        actor,
        transactionCount,
        type: actor.split(':')[0] || 'unknown',
      }))
      .sort((a, b) => b.transactionCount - a.transactionCount)
      .slice(0, 10);

    // Network activity (simulated)
    const networkActivity = Array.from({ length: 24 }, (_, i) => ({
      timestamp: now - (23 - i) * 60 * 60 * 1000,
      activeNodes: Math.floor(Math.random() * 2) + this.getNetworkNodes().filter(n => n.status === 'active').length,
      tps: Math.floor(Math.random() * 50) + 10,
    }));

    // Consensus metrics
    const consensusMetrics = {
      validationTime: 2.3, // seconds
      successRate: 99.7, // percentage
      failedTransactions: Math.floor(transactions.length * 0.003),
    };

    return {
      transactionsByType,
      transactionsByHour,
      topActors,
      networkActivity,
      consensusMetrics,
    };
  }

  /**
   * Get block details
   */
  async getBlockDetails(blockNumber: number) {
    const blocks = await this.ledger.getAllBlocks();
    return blocks.find(block => block.blockNo === blockNumber);
  }

  /**
   * Get transaction details
   */
  async getTransactionDetails(txId: string) {
    const blocks = await this.ledger.getAllBlocks();
    for (const block of blocks) {
      const transaction = block.transactions.find(tx => tx.txId === txId);
      if (transaction) {
        return {
          ...transaction,
          blockNo: block.blockNo,
          blockHash: block.hash,
          confirmations: blocks.length - block.blockNo,
        };
      }
    }
    return null;
  }

  /**
   * Search transactions
   */
  async searchTransactions(query: {
    actor?: string;
    action?: string;
    recordId?: string;
    fromDate?: number;
    toDate?: number;
    limit?: number;
  }) {
    const blocks = await this.ledger.getAllBlocks();
    let transactions = blocks.flatMap(block => 
      block.transactions.map(tx => ({
        ...tx,
        blockNo: block.blockNo,
        blockHash: block.hash,
      }))
    );

    // Apply filters
    if (query.actor) {
      transactions = transactions.filter(tx => 
        tx.actor.toLowerCase().includes(query.actor!.toLowerCase())
      );
    }

    if (query.action) {
      transactions = transactions.filter(tx => 
        tx.action.toLowerCase().includes(query.action!.toLowerCase())
      );
    }

    if (query.recordId) {
      transactions = transactions.filter(tx => tx.recordId === query.recordId);
    }

    if (query.fromDate) {
      transactions = transactions.filter(tx => tx.timestamp >= query.fromDate!);
    }

    if (query.toDate) {
      transactions = transactions.filter(tx => tx.timestamp <= query.toDate!);
    }

    // Sort by timestamp (newest first)
    transactions.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    if (query.limit) {
      transactions = transactions.slice(0, query.limit);
    }

    return transactions;
  }

  /**
   * Get network health
   */
  getNetworkHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    activeNodes: number;
    totalNodes: number;
    syncedNodes: number;
    averageUptime: number;
    issues: string[];
  } {
    const nodes = Array.from(this.nodes.values());
    const activeNodes = nodes.filter(n => n.status === 'active').length;
    const syncedNodes = nodes.filter(n => n.blockHeight >= Math.max(...nodes.map(n => n.blockHeight)) - 1).length;
    const averageUptime = nodes.reduce((sum, n) => sum + n.uptime, 0) / nodes.length;

    const issues: string[] = [];
    
    if (activeNodes < nodes.length * 0.8) {
      issues.push('Low node availability');
    }
    
    if (syncedNodes < nodes.length * 0.9) {
      issues.push('Nodes out of sync');
    }
    
    if (averageUptime < 95) {
      issues.push('Low network uptime');
    }

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (issues.length > 0) {
      status = issues.length > 2 ? 'critical' : 'warning';
    }

    return {
      status,
      activeNodes,
      totalNodes: nodes.length,
      syncedNodes,
      averageUptime: Math.round(averageUptime * 100) / 100,
      issues,
    };
  }

  /**
   * Get real-time metrics
   */
  getRealTimeMetrics() {
    return {
      currentTPS: Math.floor(Math.random() * 30) + 15,
      memPoolSize: Math.floor(Math.random() * 100) + 50,
      networkLatency: Math.floor(Math.random() * 50) + 20,
      consensusTime: Math.floor(Math.random() * 1000) + 2000,
      lastBlockTime: Date.now() - Math.floor(Math.random() * 30000) - 30000,
    };
  }
}

// Singleton instance
let blockchainExplorer: BlockchainExplorer;

export function getBlockchainExplorer(): BlockchainExplorer {
  if (!blockchainExplorer) {
    blockchainExplorer = new BlockchainExplorer();
  }
  return blockchainExplorer;
}
