'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Heart, Users, Globe, Lock, Smartphone, ArrowRight, CheckCircle, Star, Award, Flag, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-white to-green-500 rounded-lg flex items-center justify-center border-2 border-orange-200">
              <Shield className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                Arogya Rakshak
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 -mt-1 transition-colors duration-300">Blockchain Health for India</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/demo" className="text-slate-600 hover:text-orange-600 transition-colors dark:text-slate-300 dark:hover:text-orange-400">
              Try Demo
            </Link>
            <Link href="/auth/login" className="text-slate-600 hover:text-orange-600 transition-colors dark:text-slate-300 dark:hover:text-orange-400">
              Login
            </Link>
            <Link href="/dashboard" className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Indian Flag Icon */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-green-100 text-orange-800 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-orange-200">
            <Flag className="w-4 h-4" />
            Made in India for India 🇮🇳
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-slate-800">Arogya Rakshak</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 text-5xl md:text-6xl mt-2">
              Blockchain Health for India
            </span>
          </h1>

          <p className="text-2xl font-semibold text-slate-700 mb-4">
            Trust. Transparency. Health Records on Blockchain.
          </p>

          <p className="text-lg text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Revolutionary healthcare system bringing secure medical records to every Indian citizen - 
            from metros to villages, powered by blockchain technology and accessible via SMS.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link href="/demo">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
              >
                Try Live Demo →
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-orange-300 hover:border-orange-500 text-orange-700 hover:bg-orange-50 px-10 py-4 rounded-xl transition-all duration-300 text-lg font-semibold"
              >
                Access Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-12">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">🔒 Security</h3>
                <p className="text-slate-600 leading-relaxed">
                  Military-grade encryption and blockchain immutability ensure your health data remains completely secure and tamper-proof.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">📱 Rural Accessibility</h3>
                <p className="text-slate-600 leading-relaxed">
                  SMS and USSD support brings healthcare records to every corner of India, even without smartphones or internet.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">⚡ Transparency</h3>
                <p className="text-slate-600 leading-relaxed">
                  Complete audit trails and blockchain verification ensure transparency in every healthcare interaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 rounded-2xl p-8 text-white mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">1.4B+</div>
              <div className="text-orange-100">Indians Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">15,847</div>
              <div className="text-blue-100">Health Records</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-green-100">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-white">Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-300" />
              <span className="text-xl font-semibold">Made by Team Final Commit for India 🇮🇳</span>
              <Heart className="w-6 h-6 text-red-300" />
            </div>
            <p className="text-orange-100 mb-4">
              Empowering every Indian with secure, accessible healthcare records
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <span>🏥 Healthcare</span>
              <span>🔗 Blockchain</span>
              <span>🇮🇳 Digital India</span>
              <span>🌾 Rural Access</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
