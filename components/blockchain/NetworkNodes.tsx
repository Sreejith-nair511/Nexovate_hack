'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  Network, 
  Shield, 
  Users, 
  Server, 
  Globe,
  BarChart3
} from 'lucide-react'

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

interface Props {
  nodes: NetworkNode[]
}

export default function NetworkNodes({ nodes }: Props) {
  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'syncing': return 'bg-yellow-500'
      case 'inactive': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Activity className="h-4 w-4" />
      case 'government': return <Shield className="h-4 w-4" />
      case 'insurance': return <Users className="h-4 w-4" />
      case 'validator': return <Server className="h-4 w-4" />
      default: return <Globe className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Network Nodes</span>
          </CardTitle>
          <CardDescription>
            Active blockchain network participants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {nodes.map((node, index) => (
                <motion.div
                  key={node.nodeId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getNodeStatusColor(node.status)}`} />
                    {getNodeTypeIcon(node.nodeType)}
                    <div>
                      <p className="font-medium">{node.nodeId}</p>
                      <p className="text-sm text-muted-foreground">{node.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={node.status === 'active' ? 'default' : 'secondary'}>
                      {node.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {node.uptime}% uptime
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Node Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['hospital', 'government', 'insurance', 'validator'].map(type => {
              const count = nodes.filter(n => n.nodeType === type).length
              const percentage = nodes.length > 0 ? (count / nodes.length) * 100 : 0
              
              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize">{type}</span>
                    <span>{count} nodes</span>
                  </div>
                  <Progress value={percentage} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
