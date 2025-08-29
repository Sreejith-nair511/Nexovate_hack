'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface NetworkHealth {
  status: 'healthy' | 'warning' | 'critical'
  activeNodes: number
  totalNodes: number
  syncedNodes: number
  averageUptime: number
  issues: string[]
}

interface Props {
  health: NetworkHealth | null
}

export default function NetworkHealth({ health }: Props) {
  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  if (!health) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getHealthStatusIcon(health.status)}
            <span>Network Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Active Nodes</p>
              <p className="text-2xl font-bold">{health.activeNodes}/{health.totalNodes}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Synced Nodes</p>
              <p className="text-2xl font-bold">{health.syncedNodes}/{health.totalNodes}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Uptime</p>
              <p className="text-2xl font-bold">{health.averageUptime}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Issues</p>
              <p className="text-2xl font-bold">{health.issues.length}</p>
            </div>
          </div>
          
          {health.issues.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Current Issues:</p>
              <div className="space-y-1">
                {health.issues.map((issue, index) => (
                  <Badge key={index} variant="destructive">
                    {issue}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
