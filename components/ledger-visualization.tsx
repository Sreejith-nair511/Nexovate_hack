'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Activity, 
  Database, 
  Shield, 
  CheckCircle, 
  Clock, 
  Hash,
  Users,
  FileText,
  Zap
} from "lucide-react"

interface Transaction {
  id: string
  hash: string
  type: string
  from: string
  to: string
  timestamp: string
  status: 'confirmed' | 'pending' | 'processing'
  amount?: string
  description: string
}

export default function LedgerVisualization() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const generateTransaction = () => {
    const types = ['Medical Record', 'Insurance Claim', 'Prescription', 'Lab Result', 'Consultation']
    const doctors = ['Dr. Priya Sharma', 'Dr. Rajesh Kumar', 'Dr. Anita Patel', 'Dr. Vikram Singh']
    const patients = ['Aarav Gupta', 'Diya Mehta', 'Arjun Reddy', 'Kavya Nair']
    
    const newTransaction: Transaction = {
      id: `TX${Date.now()}`,
      hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
      type: types[Math.floor(Math.random() * types.length)],
      from: doctors[Math.floor(Math.random() * doctors.length)],
      to: patients[Math.floor(Math.random() * patients.length)],
      timestamp: new Date().toLocaleString(),
      status: 'processing',
      amount: Math.random() > 0.5 ? `₹${(Math.random() * 5000 + 500).toFixed(0)}` : undefined,
      description: 'Blockchain verification in progress...'
    }

    setTransactions(prev => [newTransaction, ...prev.slice(0, 9)])
    setIsProcessing(true)

    // Simulate blockchain processing
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'confirmed' as const, description: 'Successfully recorded on blockchain' }
            : tx
        )
      )
      setIsProcessing(false)
    }, 3000)
  }

  useEffect(() => {
    // Initialize with some transactions
    const initialTransactions: Transaction[] = [
      {
        id: 'TX001',
        hash: '0xa1b2c3d4...ef56',
        type: 'Medical Record',
        from: 'Dr. Priya Sharma',
        to: 'Aarav Gupta',
        timestamp: new Date(Date.now() - 300000).toLocaleString(),
        status: 'confirmed',
        description: 'Patient consultation record verified'
      },
      {
        id: 'TX002',
        hash: '0x7f8e9d0c...1a2b',
        type: 'Insurance Claim',
        from: 'Apollo Hospital Mumbai',
        to: 'Star Health Insurance',
        timestamp: new Date(Date.now() - 600000).toLocaleString(),
        status: 'confirmed',
        amount: '₹2,500',
        description: 'Insurance claim processed successfully'
      },
      {
        id: 'TX003',
        hash: '0x3c4d5e6f...9g8h',
        type: 'Lab Result',
        from: 'PathLab Delhi',
        to: 'Diya Mehta',
        timestamp: new Date(Date.now() - 900000).toLocaleString(),
        status: 'confirmed',
        description: 'Blood test results uploaded'
      }
    ]
    setTransactions(initialTransactions)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Ledger Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Records</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">15,293</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Verified</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">15,287</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Users</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">2,847</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Processing</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{isProcessing ? '1' : '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Ledger */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Blockchain Ledger
            </CardTitle>
            <Button onClick={generateTransaction} disabled={isProcessing}>
              <Zap className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : 'New Transaction'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No transactions yet. Click "New Transaction" to simulate blockchain activity.
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {tx.type}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {tx.description}
                      </p>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Timestamp</p>
                      <p className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{tx.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Hash className="w-3 h-3 flex-shrink-0" />
                      <span className="font-mono truncate">{tx.hash}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
