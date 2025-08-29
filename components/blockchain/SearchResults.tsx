'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hash, Search } from 'lucide-react'

interface SearchResultsProps {
  searchQuery: string
  searchResults: any[]
}

export default function SearchResults({ searchQuery, searchResults }: SearchResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Results</CardTitle>
        <CardDescription>
          {searchResults.length} results for "{searchQuery}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {searchResults.map((tx, index) => (
              <motion.div
                key={tx.txId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{tx.txId}</span>
                  </div>
                  <Badge variant="outline">Block #{tx.blockNo}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Actor:</span>
                    <span className="ml-2">{tx.actor}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Action:</span>
                    <span className="ml-2">{tx.action}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timestamp:</span>
                    <span className="ml-2">{new Date(tx.timestamp).toLocaleString()}</span>
                  </div>
                  {tx.recordId && (
                    <div>
                      <span className="text-muted-foreground">Record ID:</span>
                      <span className="ml-2 font-mono">{tx.recordId}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {searchResults.length === 0 && searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2" />
              <p>No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
