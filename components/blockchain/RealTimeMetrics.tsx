'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Activity, 
  Clock, 
  Network, 
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface RealTimeMetrics {
  currentTPS: number
  memPoolSize: number
  networkLatency: number
  consensusTime: number
  lastBlockTime: number
}

interface NetworkHealth {
  status: 'healthy' | 'warning' | 'critical'
  activeNodes: number
  totalNodes: number
  syncedNodes: number
  averageUptime: number
  issues: string[]
}

interface Props {
  metrics: RealTimeMetrics | null
  health: NetworkHealth | null
}

export default function RealTimeMetrics({ metrics, health }: Props) {
  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-5 gap-4"
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">TPS</p>
              <motion.p 
                key={metrics?.currentTPS}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold"
              >
                {metrics?.currentTPS || 0}
              </motion.p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">MemPool</p>
              <motion.p 
                key={metrics?.memPoolSize}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold"
              >
                {metrics?.memPoolSize || 0}
              </motion.p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Latency</p>
              <motion.p 
                key={metrics?.networkLatency}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold"
              >
                {metrics?.networkLatency || 0}ms
              </motion.p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Consensus</p>
              <motion.p 
                key={metrics?.consensusTime}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold"
              >
                {metrics ? (metrics.consensusTime / 1000).toFixed(1) : 0}s
              </motion.p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            {health && getHealthStatusIcon(health.status)}
            <div>
              <p className="text-sm text-muted-foreground">Health</p>
              <p className="text-2xl font-bold capitalize">
                {health?.status || 'Unknown'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
