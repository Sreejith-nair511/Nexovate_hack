'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  Shield, 
  Bell, 
  Smartphone, 
  Globe, 
  Lock, 
  Key, 
  Download,
  Upload,
  Trash2,
  Save,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    emergency: true
  })
  
  const [privacy, setPrivacy] = useState({
    shareData: false,
    analytics: true,
    biometric: true
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleExportData = async () => {
    setLoading(true)
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    
    // Create and download a sample file
    const data = {
      user: "Dr. Priya Sharma",
      hospital: "Apollo Hospital Mumbai",
      exportDate: new Date().toISOString(),
      records: 1247,
      transactions: 892
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'arogya-rakshak-data-export.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your account preferences and security settings
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <Shield className="w-3 h-3 mr-1" />
          Secure
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Priya" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Sharma" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="priya.sharma@apollohospital.com" />
            </div>
            
            <div>
              <Label htmlFor="hospital">Hospital Affiliation</Label>
              <Input id="hospital" defaultValue="Apollo Hospital Mumbai" />
            </div>
            
            <div>
              <Label htmlFor="license">Medical License</Label>
              <Input id="license" defaultValue="MH-DOC-2019-45821" />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Add extra security to your account</p>
              </div>
              <Switch checked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Biometric Login</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Use fingerprint or face recognition</p>
              </div>
              <Switch 
                checked={privacy.biometric} 
                onCheckedChange={(checked) => setPrivacy({...privacy, biometric: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Share Anonymous Analytics</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Help improve healthcare outcomes</p>
              </div>
              <Switch 
                checked={privacy.analytics} 
                onCheckedChange={(checked) => setPrivacy({...privacy, analytics: checked})}
              />
            </div>
            
            <Button variant="outline" className="w-full">
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Receive updates via email</p>
              </div>
              <Switch 
                checked={notifications.email} 
                onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Alerts</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Critical updates via SMS</p>
              </div>
              <Switch 
                checked={notifications.sms} 
                onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Browser notifications</p>
              </div>
              <Switch 
                checked={notifications.push} 
                onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Emergency Alerts</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Critical system alerts</p>
              </div>
              <Switch 
                checked={notifications.emergency} 
                onCheckedChange={(checked) => setNotifications({...notifications, emergency: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-sm font-medium mb-2">
                <Shield className="w-4 h-4" />
                Blockchain Protected Data
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                Your medical records are secured on the blockchain with cryptographic verification
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleExportData}
              disabled={loading}
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Exporting...' : 'Export My Data'}
            </Button>
            
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Import Health Records
            </Button>
            
            <div className="border-t pt-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200 text-sm font-medium mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  Danger Zone
                </div>
                <p className="text-red-700 dark:text-red-300 text-xs mb-3">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className={saved ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
