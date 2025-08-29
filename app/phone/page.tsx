'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Signal, Battery, Wifi } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  text: string
  timestamp: string
  type: 'received' | 'system'
}

export default function PhoneSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to Arogya Rakshak SMS Service',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system'
    }
  ])
  const [isReceiving, setIsReceiving] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Simulate receiving health report SMS after 3 seconds
    const timer = setTimeout(() => {
      setIsReceiving(true)
      
      const healthMessages = [
        {
          id: '2',
          text: '🏥 AROGYA RAKSHAK ALERT: Your health report has been generated successfully.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'received' as const
        },
        {
          id: '3',
          text: '📋 Patient: Aarav Sharma | Report ID: AR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'received' as const
        },
        {
          id: '4',
          text: '🔍 Diagnosis: Hypertension (High BP) | Doctor: Dr. Ramesh Kumar | Apollo Hospital Delhi',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'received' as const
        },
        {
          id: '5',
          text: '💊 Prescription: Amlodipine 5mg daily. Monitor BP twice daily. Low-salt diet. Exercise 30min daily.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'received' as const
        },
        {
          id: '6',
          text: '🔗 Blockchain Verified ✅ | Hash: QmX9a8s' + Math.random().toString(36).substr(2, 8) + ' | Block: #' + (Math.floor(Math.random() * 10000) + 50000),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'received' as const
        },
        {
          id: '7',
          text: '📅 Follow-up appointment in 2 weeks. Reply HELP for assistance or STOP to unsubscribe.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'received' as const
        }
      ]

      // Add messages one by one with delays
      healthMessages.forEach((message, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, message])
          if (index === healthMessages.length - 1) {
            setIsReceiving(false)
          }
        }, (index + 1) * 2000)
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const currentDate = new Date().toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short' 
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <div className="mb-6 text-center">
          <Link href="/demo">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Demo
            </Button>
          </Link>
        </div>

        {/* Nokia-style Phone */}
        <div className="bg-gradient-to-b from-slate-900 to-black rounded-3xl p-6 shadow-2xl border-4 border-slate-600">
          {/* Phone Header */}
          <div className="text-center mb-4">
            <div className="text-slate-400 text-sm font-mono">NOKIA</div>
            <div className="text-slate-500 text-xs">3310 Classic</div>
          </div>

          {/* Screen */}
          <Card className="bg-gradient-to-b from-green-400 to-green-500 p-1 rounded-lg shadow-inner">
            <div className="bg-black rounded-md p-3 min-h-[400px] relative">
              {/* Status Bar */}
              <div className="flex justify-between items-center text-green-400 text-xs font-mono mb-2 border-b border-green-600 pb-1">
                <div className="flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  <span>Airtel</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{currentTime}</span>
                  <Battery className="w-3 h-3" />
                </div>
              </div>

              {/* Screen Header */}
              <div className="text-green-400 text-center text-sm font-mono mb-3 border-b border-green-600 pb-2">
                📱 MESSAGES ({messages.length})
              </div>

              {/* Messages Area */}
              <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-green-900">
                {messages.map((message) => (
                  <div key={message.id} className="text-green-400 text-xs font-mono">
                    <div className="flex justify-between items-start mb-1">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] px-1 py-0 ${
                          message.type === 'system' 
                            ? 'border-yellow-500 text-yellow-400' 
                            : 'border-green-500 text-green-400'
                        }`}
                      >
                        {message.type === 'system' ? 'SYS' : 'SMS'}
                      </Badge>
                      <span className="text-green-500 text-[10px]">{message.timestamp}</span>
                    </div>
                    <div className="bg-green-900/30 rounded p-2 border border-green-600/50">
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {isReceiving && (
                  <div className="text-green-400 text-xs font-mono">
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="outline" className="text-[10px] px-1 py-0 border-blue-500 text-blue-400">
                        RCV
                      </Badge>
                      <span className="text-green-500 text-[10px]">{currentTime}</span>
                    </div>
                    <div className="bg-blue-900/30 rounded p-2 border border-blue-600/50 animate-pulse">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-blue-400 ml-2">Receiving...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Status */}
              <div className="absolute bottom-2 left-3 right-3 text-green-500 text-[10px] font-mono text-center border-t border-green-600 pt-1">
                {isReceiving ? '📡 RECEIVING SMS...' : '✅ MESSAGES RECEIVED'}
              </div>
            </div>
          </Card>

          {/* Nokia Keypad */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {/* Number keys */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
              <button
                key={key}
                className="bg-slate-700 hover:bg-slate-600 text-white rounded-lg p-3 text-sm font-mono border border-slate-500 transition-colors"
                disabled
              >
                {key}
              </button>
            ))}
          </div>

          {/* Navigation Keys */}
          <div className="mt-3 flex justify-center">
            <div className="bg-slate-700 rounded-full p-4 border border-slate-500">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex justify-between">
            <button className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-xs font-mono border border-green-500 transition-colors" disabled>
              CALL
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-xs font-mono border border-red-500 transition-colors" disabled>
              END
            </button>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
            <h3 className="text-white font-semibold mb-2">📱 Nokia 3310 SMS Simulator</h3>
            <p className="text-slate-300 text-sm">
              Experience how health reports reach patients in rural India via SMS on basic mobile phones. 
              Messages auto-scroll and include blockchain verification.
            </p>
            <div className="mt-3 flex justify-center gap-4 text-xs text-slate-400">
              <span>🔋 Battery: 100%</span>
              <span>📶 Signal: Strong</span>
              <span>🇮🇳 Network: Airtel</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
