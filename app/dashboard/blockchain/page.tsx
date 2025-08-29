'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Search, Activity, Network, BarChart3, Shield, Zap, TrendingUp, Users, Lock, CheckCircle, AlertTriangle, Globe, Database, Cpu } from "lucide-react"

interface Transaction {
  hash: string
  type: string
  from: string
  to: string
  amount?: number
  timestamp: string
  status: 'confirmed' | 'pending' | 'failed'
  blockNumber: number
  zkProof?: string
  hyperledgerChannel?: string
}

// Mock real-time data
const generateRealTimeData = () => ({
  tps: Math.floor(Math.random() * 50) + 200,
  blockTime: (Math.random() * 0.5 + 2).toFixed(1),
  mempool: Math.floor(Math.random() * 100) + 50,
  activeNodes: Math.floor(Math.random() * 5) + 22,
  networkHealth: Math.floor(Math.random() * 10) + 90,
  zkProofsGenerated: Math.floor(Math.random() * 20) + 180,
  hyperledgerChannels: Math.floor(Math.random() * 3) + 8
})

// Mock chart data with Indian context
const transactionData = [
  { time: '00:00', transactions: 120, zkProofs: 45, location: 'Mumbai' },
  { time: '04:00', transactions: 89, zkProofs: 32, location: 'Delhi' },
  { time: '08:00', transactions: 234, zkProofs: 87, location: 'Bangalore' },
  { time: '12:00', transactions: 345, zkProofs: 123, location: 'Chennai' },
  { time: '16:00', transactions: 267, zkProofs: 98, location: 'Kolkata' },
  { time: '20:00', transactions: 198, zkProofs: 76, location: 'Pune' },
]

const networkData = [
  { name: 'Mumbai', value: 35, color: '#f97316' },
  { name: 'Delhi', value: 28, color: '#22c55e' },
  { name: 'Bangalore', value: 20, color: '#3b82f6' },
  { name: 'Chennai', value: 17, color: '#8b5cf6' },
]

const hyperledgerChannels = [
  { name: 'patient-records', transactions: 1247, peers: 8, status: 'active' },
  { name: 'insurance-claims', transactions: 892, peers: 6, status: 'active' },
  { name: 'hospital-admin', transactions: 634, peers: 5, status: 'active' },
  { name: 'audit-trail', transactions: 445, peers: 4, status: 'active' },
]

interface BlockchainStats {
  totalBlocks: number
  totalTransactions: number
  averageBlockTime: number
  networkHashRate: string
  activeNodes: number
  consensusAlgorithm: string
  lastBlockTime: number
  chainIntegrity: number
}

interface NetworkNode {
  nodeId: string
  nodeType: 'hospital' | 'government' | 'insurance' | 'validator'
  location: string
  status: 'active' | 'inactive' | 'syncing'
  lastSeen: number
  blockHeight: number
  version: string
  uptime: number
}

interface ChainAnalytics {
  transactionsByType: Record<string, number>
  transactionsByHour: Array<{ hour: number; count: number }>
  topActors: Array<{ actor: string; transactionCount: number; type: string }>
  networkActivity: Array<{ timestamp: number; activeNodes: number; tps: number }>
  consensusMetrics: {
    validationTime: number
    successRate: number
    failedTransactions: number
  }
}

interface NetworkHealth {
  status: 'healthy' | 'warning' | 'critical'
  activeNodes: number
  totalNodes: number
  syncedNodes: number
  averageUptime: number
  issues: string[]
}

interface RealTimeMetrics {
  currentTPS: number
  memPoolSize: number
  networkLatency: number
  consensusTime: number
  lastBlockTime: number
}

export default function BlockchainExplorer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Transaction[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [realTimeData, setRealTimeData] = useState(generateRealTimeData())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(generateRealTimeData())
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockResults: Transaction[] = [
      {
        hash: `0x${searchQuery}...abc123`,
        type: 'Medical Record',
        from: 'Dr. Priya Sharma',
        to: 'Aarav Kumar',
        timestamp: new Date().toISOString(),
        status: 'confirmed',
        blockNumber: 52341,
        zkProof: 'ZK_PROOF_' + Math.random().toString(36).substr(2, 8),
        hyperledgerChannel: 'patient-records'
      },
      {
        hash: `0x${searchQuery}...def456`,
        type: 'Insurance Claim',
        from: 'Apollo Hospital Mumbai',
        to: 'Bharti AXA Insurance',
        amount: 25000,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'confirmed',
        blockNumber: 52340,
        zkProof: 'ZK_PROOF_' + Math.random().toString(36).substr(2, 8),
        hyperledgerChannel: 'insurance-claims'
      }
    ]
    
    setSearchResults(mockResults)
    setIsSearching(false)
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">🔗 Blockchain Explorer</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Real-time monitoring of Arogya Rakshak healthcare blockchain with ZK-proofs & Hyperledger
          </p>
        </div>
        
        <div className="flex gap-2 max-w-md">
          <Input
            placeholder="Search by hash, patient name, or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Network TPS</p>
                <p className="text-2xl font-bold text-green-600">{realTimeData.tps}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={Math.min((realTimeData.tps / 300) * 100, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Block Time</p>
                <p className="text-2xl font-bold text-blue-600">{realTimeData.blockTime}s</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
              Hyperledger Fabric
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">ZK-Proofs</p>
                <p className="text-2xl font-bold text-purple-600">{realTimeData.zkProofsGenerated}</p>
              </div>
              <Lock className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Privacy-preserving verification</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Nodes</p>
                <p className="text-2xl font-bold text-orange-600">{realTimeData.activeNodes}</p>
              </div>
              <Network className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">All nodes healthy</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="hyperledger">
            <Network className="w-4 h-4 mr-2" />
            Hyperledger
          </TabsTrigger>
          <TabsTrigger value="zkproofs">
            <Lock className="w-4 h-4 mr-2" />
            ZK-Proofs
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="nodes">
            <Users className="w-4 h-4 mr-2" />
            Network Nodes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Transaction Volume (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">{data.time}</span>
                        <Badge variant="secondary" className="text-xs">{data.location}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{data.transactions} txns</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{data.zkProofs} ZK-proofs</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  Network Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {networkData.map((node, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{node.name}</span>
                        <span className="text-sm font-semibold">{node.value}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${node.value}%`, backgroundColor: node.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.map((tx, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                          {tx.status}
                        </Badge>
                        <span className="text-sm text-slate-500">Block #{tx.blockNumber}</span>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div><strong>Hash:</strong> {tx.hash}</div>
                        <div><strong>Type:</strong> {tx.type}</div>
                        <div><strong>From:</strong> {tx.from}</div>
                        <div><strong>To:</strong> {tx.to}</div>
                        {tx.zkProof && <div><strong>ZK-Proof:</strong> {tx.zkProof}</div>}
                        {tx.hyperledgerChannel && <div><strong>Channel:</strong> {tx.hyperledgerChannel}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="hyperledger" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-600" />
                Hyperledger Fabric Channels
              </CardTitle>
              <p className="text-sm text-slate-600">Enterprise blockchain channels for healthcare data</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hyperledgerChannels.map((channel, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{channel.name}</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {channel.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Transactions:</span>
                        <div className="font-semibold">{channel.transactions.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Peers:</span>
                        <div className="font-semibold">{channel.peers}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Endorsement Policy:</span>
                        <div className="font-semibold">2-of-{channel.peers}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zkproofs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                Zero-Knowledge Proofs Dashboard
              </CardTitle>
              <p className="text-sm text-slate-600">Privacy-preserving verification for medical data</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    ZK-Proof Generation
                  </h3>
                  <div className="space-y-3">
                    {transactionData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{data.time}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div 
                              className="h-2 bg-purple-500 rounded-full transition-all duration-500" 
                              style={{ width: `${(data.zkProofs / 150) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{data.zkProofs}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-purple-600">Patient Privacy Protection</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Medical records verified without exposing sensitive patient data
                    </p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        zk-SNARKs Enabled
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-green-600">Insurance Claim Verification</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Claims processed with zero-knowledge proof of eligibility
                    </p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        zk-STARKs Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Medical Records', value: 45, color: '#22c55e', icon: '🏥' },
                    { name: 'Insurance Claims', value: 30, color: '#3b82f6', icon: '💰' },
                    { name: 'Prescriptions', value: 15, color: '#f59e0b', icon: '💊' },
                    { name: 'Lab Reports', value: 10, color: '#8b5cf6', icon: '🧪' },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.value}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${item.value}%`, backgroundColor: item.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Network Health</span>
                  <span className="font-semibold">{realTimeData.networkHealth}%</span>
                </div>
                <Progress value={realTimeData.networkHealth} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span>Consensus Efficiency</span>
                  <span className="font-semibold">97%</span>
                </div>
                <Progress value={97} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span>Data Integrity</span>
                  <span className="font-semibold">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nodes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Nodes Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'AIIMS Delhi', location: 'Delhi', status: 'active', uptime: '99.9%' },
                  { name: 'Apollo Mumbai', location: 'Mumbai', status: 'active', uptime: '99.8%' },
                  { name: 'Fortis Bangalore', location: 'Bangalore', status: 'active', uptime: '99.7%' },
                  { name: 'Max Chennai', location: 'Chennai', status: 'active', uptime: '99.9%' },
                  { name: 'Manipal Pune', location: 'Pune', status: 'active', uptime: '99.6%' },
                  { name: 'Medanta Gurgaon', location: 'Gurgaon', status: 'active', uptime: '99.8%' },
                ].map((node, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{node.name}</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {node.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600">
                      <div>Location: {node.location}</div>
                      <div>Uptime: {node.uptime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
