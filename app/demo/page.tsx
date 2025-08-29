'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Smartphone, CheckCircle, ArrowRight, Heart, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function DemoPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)

  const generateHealthReport = async () => {
    setIsGenerating(true)
    
    // Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate fake PDF using basic HTML to PDF conversion
    const generatePDF = () => {
      const reportContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Health Report - Arogya Rakshak</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { color: #f97316; font-size: 24px; font-weight: bold; }
            .patient-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .diagnosis { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .prescription { background: #d1ecf1; padding: 15px; border-left: 4px solid #17a2b8; margin: 20px 0; }
            .blockchain { background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; }
            .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
            h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .status { color: #28a745; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🏥 Arogya Rakshak</div>
            <h1>Medical Health Report</h1>
            <p>Blockchain-Verified Healthcare Record</p>
          </div>
          
          <div class="patient-info">
            <h2>Patient Information</h2>
            <p><strong>Name:</strong> Aarav Sharma</p>
            <p><strong>Age:</strong> 32 years</p>
            <p><strong>Hospital:</strong> Apollo Hospital, Delhi</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Report ID:</strong> AR-${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
          
          <div class="diagnosis">
            <h2>Medical Diagnosis</h2>
            <p><strong>Primary Diagnosis:</strong> Hypertension (High Blood Pressure)</p>
            <p><strong>Attending Doctor:</strong> Dr. Ramesh Kumar</p>
            <p><strong>Department:</strong> Cardiology</p>
            <p><strong>Blood Pressure:</strong> 150/95 mmHg (High)</p>
            <p><strong>Risk Level:</strong> Moderate</p>
          </div>
          
          <div class="prescription">
            <h2>Prescription & Treatment</h2>
            <ul>
              <li><strong>Amlodipine 5mg</strong> - Take once daily in the morning</li>
              <li><strong>Regular BP Monitoring</strong> - Check blood pressure twice daily</li>
              <li><strong>Dietary Changes:</strong> Low-salt diet (less than 2g sodium per day)</li>
              <li><strong>Exercise:</strong> 30-minute brisk walk daily</li>
              <li><strong>Follow-up:</strong> Return in 2 weeks for BP check</li>
            </ul>
          </div>
          
          <div class="blockchain">
            <h2>Blockchain Verification</h2>
            <p><strong>Transaction Hash:</strong> QmX9a8sDk3In45Z7p${Math.random().toString(36).substr(2, 8)}</p>
            <p><strong>Block Number:</strong> #${Math.floor(Math.random() * 10000) + 50000}</p>
            <p><strong>Verification Status:</strong> <span class="status">✅ VERIFIED</span></p>
            <p><strong>Digital Signature:</strong> Valid</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>
          
          <div class="footer">
            <p><strong>⚠️ DEMO PURPOSES ONLY</strong></p>
            <p>This report is generated for demonstration purposes only and does not represent actual medical data.</p>
            <p>Arogya Rakshak - Blockchain Health for India 🇮🇳</p>
          </div>
        </body>
        </html>
      `
      
      const blob = new Blob([reportContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Health_Report_Aarav_Sharma_${new Date().toISOString().split('T')[0]}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
    
    // Generate and download the report
    generatePDF()
    
    // Open phone simulator in new tab
    window.open('/phone', '_blank')
    
    setIsGenerating(false)
    setReportGenerated(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-white to-green-500 rounded-lg flex items-center justify-center border-2 border-orange-200">
              <Shield className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                Arogya Rakshak
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 -mt-1 transition-colors duration-300">Live Demo</p>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/" className="text-slate-600 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              ← Back to Home
            </Link>
            <Link href="/dashboard" className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Demo Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-green-100 text-orange-800 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-orange-200">
            <Smartphone className="w-4 h-4" />
            Interactive Demo Experience
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-slate-800">Experience</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
              Blockchain Healthcare
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Try our live demo to see how Arogya Rakshak generates secure health reports 
            and delivers them via SMS to rural areas across India.
          </p>

          {/* Demo Card */}
          <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-orange-500" />
                Generate Health Report
              </CardTitle>
              <p className="text-slate-600 mt-2">
                Demo patient: Aarav Sharma, 32 years old
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!reportGenerated ? (
                <>
                  <div className="bg-gradient-to-r from-orange-50 to-green-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="font-semibold text-slate-800 mb-3">What happens when you click:</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-orange-500" />
                        <span>Auto-download a fake PDF health report</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-green-500" />
                        <span>Open phone simulator showing SMS delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span>Blockchain verification with transaction hash</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={generateHealthReport}
                    disabled={isGenerating}
                    size="lg"
                    className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <FileText className="w-6 h-6 mr-3" />
                        Generate Health Report
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700">Report Generated Successfully!</h3>
                  <p className="text-slate-600">
                    Check your downloads folder for the health report and the phone simulator tab for SMS delivery.
                  </p>
                  <div className="flex gap-4 justify-center mt-6">
                    <Button
                      onClick={() => setReportGenerated(false)}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      Generate Another
                    </Button>
                    <Link href="/phone" target="_blank">
                      <Button className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                        <Smartphone className="w-4 h-4 mr-2" />
                        View Phone Simulator
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Demo Features */}
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">📱 SMS Integration</h4>
                  <p className="text-sm text-blue-600">
                    See how health reports reach patients in rural areas via SMS, even on basic phones.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">🔗 Blockchain Verified</h4>
                  <p className="text-sm text-green-600">
                    Every report includes blockchain verification with immutable transaction hashes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Badge className="bg-orange-100 text-orange-800 mb-4">Demo Feature</Badge>
                <h3 className="font-semibold text-slate-800 mb-2">Fake PDF Report</h3>
                <p className="text-sm text-slate-600">
                  Complete medical report with patient info, diagnosis, prescription, and blockchain verification.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Badge className="bg-blue-100 text-blue-800 mb-4">Rural Access</Badge>
                <h3 className="font-semibold text-slate-800 mb-2">SMS Simulation</h3>
                <p className="text-sm text-slate-600">
                  Experience how patients receive health updates on basic mobile phones via SMS.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Badge className="bg-green-100 text-green-800 mb-4">Blockchain</Badge>
                <h3 className="font-semibold text-slate-800 mb-2">Verification</h3>
                <p className="text-sm text-slate-600">
                  See real blockchain transaction hashes and verification status for complete transparency.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-red-300" />
            <span className="font-semibold">Made by Team Final Commit for India 🇮🇳</span>
            <Heart className="w-5 h-5 text-red-300" />
          </div>
          <p className="text-orange-100 text-sm">
            This is a demonstration of blockchain-powered healthcare for rural India
          </p>
        </div>
      </footer>
    </div>
  )
}
