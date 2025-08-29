'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Blocks, 
  Hash, 
  Server, 
  Shield
} from 'lucide-react'

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

interface Props {
  stats: BlockchainStats | null
}

export default function BlockchainStats({ stats }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2">
            <Blocks className="h-5 w-5 text-blue-500" />
            <span>Total Blocks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p 
            key={stats?.totalBlocks}
            initial={{ scale: 1.2, color: '#3b82f6' }}
            animate={{ scale: 1, color: 'inherit' }}
            className="text-3xl font-bold"
          >
            {stats?.totalBlocks?.toLocaleString() || 0}
          </motion.p>
          <p className="text-sm text-muted-foreground">
            Avg block time: {stats?.averageBlockTime || 0}s
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2">
            <Hash className="h-5 w-5 text-green-500" />
            <span>Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p 
            key={stats?.totalTransactions}
            initial={{ scale: 1.2, color: '#10b981' }}
            animate={{ scale: 1, color: 'inherit' }}
            className="text-3xl font-bold"
          >
            {stats?.totalTransactions?.toLocaleString() || 0}
          </motion.p>
          <p className="text-sm text-muted-foreground">
            Hash rate: {stats?.networkHashRate || 'N/A'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-purple-500" />
            <span>Active Nodes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p 
            key={stats?.activeNodes}
            initial={{ scale: 1.2, color: '#8b5cf6' }}
            animate={{ scale: 1, color: 'inherit' }}
            className="text-3xl font-bold"
          >
            {stats?.activeNodes || 0}
          </motion.p>
          <p className="text-sm text-muted-foreground">
            {stats?.consensusAlgorithm || 'Unknown'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-orange-500" />
            <span>Chain Integrity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p 
            key={stats?.chainIntegrity}
            initial={{ scale: 1.2, color: '#f97316' }}
            animate={{ scale: 1, color: 'inherit' }}
            className="text-3xl font-bold"
          >
            {stats?.chainIntegrity || 0}%
          </motion.p>
          <Progress value={stats?.chainIntegrity || 0} className="mt-2" />
        </CardContent>
      </Card>
    </motion.div>
  )
}
