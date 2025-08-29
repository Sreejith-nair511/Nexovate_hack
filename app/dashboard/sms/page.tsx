"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Smartphone,
  MessageSquare,
  Phone,
  Send,
  Users,
  Globe,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  BarChart3,
} from "lucide-react"

interface SMSMessage {
  id: string
  phoneNumber: string
  message: string
  response: string
  timestamp: number
  type: 'sms' | 'ussd'
  status: 'sent' | 'delivered' | 'failed'
}

interface SessionStats {
  totalSessions: number
  activeSessions: number
  totalUSSDRequests: number
  totalSMSRequests: number
  languageDistribution: Record<string, number>
}

export default function SMSSimulator() {
  const [phoneNumber, setPhoneNumber] = useState('+919876543210')
  const [smsMessage, setSmsMessage] = useState('')
  const [ussdInput, setUssdInput] = useState('*123#')
  const [messages, setMessages] = useState<SMSMessage[]>([])
  const [currentUSSDSession, setCurrentUSSDSession] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    activeSessions: 0,
    totalUSSDRequests: 0,
    totalSMSRequests: 0,
    languageDistribution: {}
  })

  // Sample data for demonstration
  const sampleMessages: SMSMessage[] = [
    {
      id: 'msg-001',
      phoneNumber: '+919876543210',
      message: 'HEALTH',
      response: 'Health Tip: Drink at least 8 glasses of water daily for better health.',
      timestamp: Date.now() - 60000,
      type: 'sms',
      status: 'delivered'
    },
    {
      id: 'msg-002',
      phoneNumber: '+919876543210',
      message: '*123#',
      response: 'Arogya Rakshak - Health Services\n\n1. View Medical Records\n2. Book Appointment\n3. Health Tips\n4. Emergency Services\n5. Language / भाषा\n0. Help / सहायता',
      timestamp: Date.now() - 120000,
      type: 'ussd',
      status: 'delivered'
    },
    {
      id: 'msg-003',
      phoneNumber: '+919876543211',
      message: 'EMERGENCY',
      response: 'EMERGENCY ALERT ACTIVATED\nAmbulance dispatched to your location.\nEmergency Contact: 108\nNearest Hospital: City General Hospital\nETA: 15 minutes\n\nStay calm. Help is on the way.',
      timestamp: Date.now() - 300000,
      type: 'sms',
      status: 'delivered'
    }
  ]

  const sampleStats: SessionStats = {
    totalSessions: 45,
    activeSessions: 8,
    totalUSSDRequests: 123,
    totalSMSRequests: 89,
    languageDistribution: {
      'en': 25,
      'hi': 15,
      'te': 3,
      'ta': 2,
      'bn': 0
    }
  }

  useEffect(() => {
    setMessages(sampleMessages)
    setStats(sampleStats)
  }, [])

  const sendSMS = async () => {
    if (!smsMessage.trim() || !phoneNumber.trim()) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newMessage: SMSMessage = {
        id: `msg-${Date.now()}`,
        phoneNumber,
        message: smsMessage,
        response: getSMSResponse(smsMessage),
        timestamp: Date.now(),
        type: 'sms',
        status: 'delivered'
      }

      setMessages(prev => [newMessage, ...prev])
      setSmsMessage('')
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalSMSRequests: prev.totalSMSRequests + 1
      }))

    } catch (error) {
      console.error('Error sending SMS:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendUSSD = async () => {
    if (!ussdInput.trim() || !phoneNumber.trim()) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      const response = getUSSDResponse(ussdInput)
      setCurrentUSSDSession(response)

      const newMessage: SMSMessage = {
        id: `msg-${Date.now()}`,
        phoneNumber,
        message: ussdInput,
        response,
        timestamp: Date.now(),
        type: 'ussd',
        status: 'delivered'
      }

      setMessages(prev => [newMessage, ...prev])
      setUssdInput('')
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalUSSDRequests: prev.totalUSSDRequests + 1
      }))

    } catch (error) {
      console.error('Error sending USSD:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSMSResponse = (message: string): string => {
    const command = message.trim().toUpperCase()
    
    switch (command) {
      case 'HEALTH':
        return 'Health Tip: Exercise for 30 minutes daily to stay fit.'
      case 'RECORD':
        return 'Latest Record:\nDate: ' + new Date().toLocaleDateString() + '\nDoctor: Dr. Priya Patel\nDiagnosis: Regular checkup\nPrescription: Multivitamin tablets'
      case 'EMERGENCY':
        return 'EMERGENCY ALERT ACTIVATED\nAmbulance dispatched to your location.\nEmergency Contact: 108\nNearest Hospital: City General Hospital\nETA: 15 minutes\n\nStay calm. Help is on the way.'
      case 'BOOK':
        return 'Appointment Booked:\nDoctor: Dr. Rajesh Kumar\nDate: ' + new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString() + '\nTime: 10:00 AM\nHospital: Apollo Hospital Mumbai\nReference: APT' + Date.now().toString().slice(-6)
      default:
        return 'Available Commands:\n\nHEALTH: Get health tips\nRECORD: View medical records\nBOOK: Book appointment\nEMERGENCY: Emergency services\n\nFor more help, dial *123#'
    }
  }

  const getUSSDResponse = (input: string): string => {
    switch (input) {
      case '*123#':
        return 'Arogya Rakshak - Health Services\n\n1. View Medical Records\n2. Book Appointment\n3. Health Tips\n4. Emergency Services\n5. Language / भाषा\n0. Help / सहायता'
      case '1':
        return 'Medical Records\n\n1. Latest Record\n2. All Records\n3. Share Record\n9. Back'
      case '2':
        return 'Book Appointment\n\n1. General Physician\n2. Specialist\n3. Emergency\n9. Back'
      case '3':
        return 'Health Tip: Eat 5 servings of fruits and vegetables daily for better nutrition.'
      case '4':
        return 'Emergency Services\n\n1. Call Ambulance\n2. Nearest Hospital\n3. Emergency Contacts\n9. Back'
      case '5':
        return 'Select Language\n\n1. English\n2. हिंदी (Hindi)\n3. తెలుగు (Telugu)\n4. தமிழ் (Tamil)\n5. বাংলা (Bengali)\n9. Back'
      default:
        return 'Invalid option. Please try again.\n\nDial *123# to start over.'
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const quickCommands = [
    { label: 'Health Tips', command: 'HEALTH' },
    { label: 'Medical Records', command: 'RECORD' },
    { label: 'Book Appointment', command: 'BOOK' },
    { label: 'Emergency', command: 'EMERGENCY' },
  ]

  const quickUSSD = [
    { label: 'Main Menu', command: '*123#' },
    { label: 'Records', command: '1' },
    { label: 'Appointment', command: '2' },
    { label: 'Health Tips', command: '3' },
    { label: 'Emergency', command: '4' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">SMS/USSD Simulator</h1>
          <p className="text-slate-600 mt-1">Test rural access features for healthcare services</p>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <Activity className="w-4 h-4 mr-1" />
          Service Active
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Sessions</p>
                <p className="text-xl font-bold text-slate-800">{stats.totalSessions}</p>
              </div>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Sessions</p>
                <p className="text-xl font-bold text-slate-800">{stats.activeSessions}</p>
              </div>
              <Activity className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">USSD Requests</p>
                <p className="text-xl font-bold text-slate-800">{stats.totalUSSDRequests}</p>
              </div>
              <Phone className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">SMS Messages</p>
                <p className="text-xl font-bold text-slate-800">{stats.totalSMSRequests}</p>
              </div>
              <MessageSquare className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Languages</p>
                <p className="text-xl font-bold text-slate-800">{Object.keys(stats.languageDistribution).length}</p>
              </div>
              <Globe className="w-6 h-6 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Simulator */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="sms" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sms">SMS Simulator</TabsTrigger>
              <TabsTrigger value="ussd">USSD Simulator</TabsTrigger>
            </TabsList>

            <TabsContent value="sms">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    SMS Message Simulator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Phone Number
                    </label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      SMS Message
                    </label>
                    <Textarea
                      value={smsMessage}
                      onChange={(e) => setSmsMessage(e.target.value)}
                      placeholder="Type your SMS message..."
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-slate-700">Quick Commands:</span>
                    {quickCommands.map((cmd) => (
                      <Button
                        key={cmd.command}
                        variant="outline"
                        size="sm"
                        onClick={() => setSmsMessage(cmd.command)}
                      >
                        {cmd.label}
                      </Button>
                    ))}
                  </div>

                  <Button 
                    onClick={sendSMS} 
                    disabled={loading || !smsMessage.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send SMS
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ussd">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    USSD Session Simulator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Phone Number
                    </label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      USSD Input
                    </label>
                    <Input
                      value={ussdInput}
                      onChange={(e) => setUssdInput(e.target.value)}
                      placeholder="*123# or menu option"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-slate-700">Quick Options:</span>
                    {quickUSSD.map((cmd) => (
                      <Button
                        key={cmd.command}
                        variant="outline"
                        size="sm"
                        onClick={() => setUssdInput(cmd.command)}
                      >
                        {cmd.label}
                      </Button>
                    ))}
                  </div>

                  <Button 
                    onClick={sendUSSD} 
                    disabled={loading || !ussdInput.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send USSD
                  </Button>

                  {currentUSSDSession && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-800 mb-2">Current USSD Session:</h4>
                      <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                        {currentUSSDSession}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Message History & Stats */}
        <div className="space-y-6">
          {/* Language Distribution */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Language Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.languageDistribution).map(([lang, count]) => {
                  const languages = {
                    'en': 'English',
                    'hi': 'हिंदी',
                    'te': 'తెలుగు',
                    'ta': 'தமிழ்',
                    'bn': 'বাংলা'
                  };
                  const percentage = (count / stats.totalSessions) * 100;
                  
                  return (
                    <div key={lang} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {languages[lang] || lang}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600 w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={message.type === 'sms' ? 'default' : 'secondary'}>
                            {message.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-slate-600">{message.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(message.status)}
                          <span className="text-xs text-slate-500">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="mb-2">
                          <span className="font-medium text-slate-700">Sent: </span>
                          <span className="text-slate-600">{message.message}</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded text-slate-700">
                          <span className="font-medium">Response: </span>
                          <pre className="whitespace-pre-wrap text-xs mt-1">
                            {message.response}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
