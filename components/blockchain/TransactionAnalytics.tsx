'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Shield
} from 'lucide-react'

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

interface Props {
  analytics: ChainAnalytics | null
}

export default function TransactionAnalytics({ analytics }: Props) {
  if (!analytics) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Transaction Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analytics.transactionsByType).map(([type, count]) => {
              const total = Object.values(analytics.transactionsByType).reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? (count / total) * 100 : 0
              
              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{type.replace('_', ' ')}</span>
                    <span className="text-sm font-medium">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={percentage} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LineChart className="h-5 w-5" />
            <span>Hourly Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.transactionsByHour.map(({ hour, count }) => (
              <div key={hour} className="flex items-center space-x-3">
                <span className="text-sm w-8">{hour}:00</span>
                <div className="flex-1">
                  <Progress value={(count / Math.max(...analytics.transactionsByHour.map(h => h.count))) * 100} />
                </div>
                <span className="text-sm w-8">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Top Actors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topActors.slice(0, 10).map((actor, index) => (
              <div key={actor.actor} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{actor.actor}</p>
                    <Badge variant="outline" className="text-xs">
                      {actor.type}
                    </Badge>
                  </div>
                </div>
                <span className="text-sm font-medium">{actor.transactionCount} txns</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Consensus Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Validation Time</span>
                <span>{analytics.consensusMetrics.validationTime}s</span>
              </div>
              <Progress value={(analytics.consensusMetrics.validationTime / 10) * 100} />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span>Success Rate</span>
                <span>{analytics.consensusMetrics.successRate}%</span>
              </div>
              <Progress value={analytics.consensusMetrics.successRate} />
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span>Failed Transactions</span>
                <Badge variant="destructive">
                  {analytics.consensusMetrics.failedTransactions}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
