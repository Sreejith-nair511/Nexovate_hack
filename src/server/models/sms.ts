import { MockLedger } from '../ledger/mockLedger';

export interface SMSSession {
  sessionId: string;
  phoneNumber: string;
  patientId?: string;
  currentStep: string;
  context: Record<string, any>;
  language: 'en' | 'hi' | 'te' | 'ta' | 'bn';
  createdAt: number;
  lastActivity: number;
  isActive: boolean;
}

export interface USSDMenu {
  code: string;
  title: string;
  description: string;
  options: USSDOption[];
  parent?: string;
}

export interface USSDOption {
  key: string;
  text: string;
  action: 'menu' | 'function' | 'input';
  target?: string;
  function?: string;
}

export interface SMSCommand {
  keyword: string;
  description: string;
  usage: string;
  function: string;
  requiresAuth: boolean;
}

const SMS_ACTIONS = {
  SESSION_START: 'SESSION_START',
  RECORD_ACCESS: 'RECORD_ACCESS',
  APPOINTMENT_BOOK: 'APPOINTMENT_BOOK',
  HEALTH_TIP: 'HEALTH_TIP',
  EMERGENCY_ALERT: 'EMERGENCY_ALERT',
  OTP_VERIFY: 'OTP_VERIFY',
} as const;

export class SMSUSSDService {
  private sessions: Map<string, SMSSession> = new Map();
  private ledger = new MockLedger();
  private otpStore: Map<string, { otp: string; expires: number; purpose: string }> = new Map();

  // USSD Menu Structure
  private ussdMenus: Map<string, USSDMenu> = new Map([
    ['*123#', {
      code: '*123#',
      title: 'Arogya Rakshak - Health Services',
      description: 'Main menu for health services',
      options: [
        { key: '1', text: 'View Medical Records', action: 'menu', target: 'records' },
        { key: '2', text: 'Book Appointment', action: 'menu', target: 'appointment' },
        { key: '3', text: 'Health Tips', action: 'function', function: 'getHealthTip' },
        { key: '4', text: 'Emergency Services', action: 'menu', target: 'emergency' },
        { key: '5', text: 'Language / भाषा', action: 'menu', target: 'language' },
        { key: '0', text: 'Help / सहायता', action: 'function', function: 'getHelp' },
      ]
    }],
    ['records', {
      code: 'records',
      title: 'Medical Records',
      description: 'Access your medical records',
      parent: '*123#',
      options: [
        { key: '1', text: 'Latest Record', action: 'function', function: 'getLatestRecord' },
        { key: '2', text: 'All Records', action: 'function', function: 'getAllRecords' },
        { key: '3', text: 'Share Record', action: 'input', target: 'shareRecord' },
        { key: '9', text: 'Back', action: 'menu', target: '*123#' },
      ]
    }],
    ['appointment', {
      code: 'appointment',
      title: 'Book Appointment',
      description: 'Schedule medical appointments',
      parent: '*123#',
      options: [
        { key: '1', text: 'General Physician', action: 'function', function: 'bookAppointment' },
        { key: '2', text: 'Specialist', action: 'menu', target: 'specialist' },
        { key: '3', text: 'Emergency', action: 'function', function: 'emergencyAppointment' },
        { key: '9', text: 'Back', action: 'menu', target: '*123#' },
      ]
    }],
    ['emergency', {
      code: 'emergency',
      title: 'Emergency Services',
      description: 'Emergency health services',
      parent: '*123#',
      options: [
        { key: '1', text: 'Call Ambulance', action: 'function', function: 'callAmbulance' },
        { key: '2', text: 'Nearest Hospital', action: 'function', function: 'findNearestHospital' },
        { key: '3', text: 'Emergency Contacts', action: 'function', function: 'getEmergencyContacts' },
        { key: '9', text: 'Back', action: 'menu', target: '*123#' },
      ]
    }],
    ['language', {
      code: 'language',
      title: 'Select Language',
      description: 'Choose your preferred language',
      parent: '*123#',
      options: [
        { key: '1', text: 'English', action: 'function', function: 'setLanguage:en' },
        { key: '2', text: 'हिंदी (Hindi)', action: 'function', function: 'setLanguage:hi' },
        { key: '3', text: 'తెలుగు (Telugu)', action: 'function', function: 'setLanguage:te' },
        { key: '4', text: 'தமிழ் (Tamil)', action: 'function', function: 'setLanguage:ta' },
        { key: '5', text: 'বাংলা (Bengali)', action: 'function', function: 'setLanguage:bn' },
        { key: '9', text: 'Back', action: 'menu', target: '*123#' },
      ]
    }],
  ]);

  // SMS Commands
  private smsCommands: Map<string, SMSCommand> = new Map([
    ['HEALTH', {
      keyword: 'HEALTH',
      description: 'Get health tips and information',
      usage: 'SMS HEALTH to 1234',
      function: 'getHealthTip',
      requiresAuth: false,
    }],
    ['RECORD', {
      keyword: 'RECORD',
      description: 'Access medical records',
      usage: 'SMS RECORD <PATIENT_ID> to 1234',
      function: 'getRecord',
      requiresAuth: true,
    }],
    ['BOOK', {
      keyword: 'BOOK',
      description: 'Book appointment',
      usage: 'SMS BOOK <DOCTOR_TYPE> <DATE> to 1234',
      function: 'bookAppointment',
      requiresAuth: true,
    }],
    ['EMERGENCY', {
      keyword: 'EMERGENCY',
      description: 'Emergency services',
      usage: 'SMS EMERGENCY to 1234',
      function: 'handleEmergency',
      requiresAuth: false,
    }],
    ['OTP', {
      keyword: 'OTP',
      description: 'Verify OTP for authentication',
      usage: 'SMS OTP <CODE> to 1234',
      function: 'verifyOTP',
      requiresAuth: false,
    }],
  ]);

  // Multilingual responses
  private responses = {
    en: {
      welcome: 'Welcome to Arogya Rakshak Health Services',
      invalidOption: 'Invalid option. Please try again.',
      sessionExpired: 'Session expired. Please dial *123# to start again.',
      authRequired: 'Authentication required. Please verify your identity.',
      otpSent: 'OTP sent to your registered mobile number.',
      otpVerified: 'OTP verified successfully.',
      otpInvalid: 'Invalid OTP. Please try again.',
      recordNotFound: 'No medical records found.',
      appointmentBooked: 'Appointment booked successfully.',
      emergencyAlert: 'Emergency alert sent. Help is on the way.',
      healthTip: 'Daily Health Tip: Drink at least 8 glasses of water daily for better health.',
    },
    hi: {
      welcome: 'आरोग्य रक्षक स्वास्थ्य सेवाओं में आपका स्वागत है',
      invalidOption: 'गलत विकल्प। कृपया पुनः प्रयास करें।',
      sessionExpired: 'सत्र समाप्त। कृपया *123# डायल करके फिर से शुरू करें।',
      authRequired: 'प्रमाणीकरण आवश्यक। कृपया अपनी पहचान सत्यापित करें।',
      otpSent: 'आपके पंजीकृत मोबाइल नंबर पर OTP भेजा गया।',
      otpVerified: 'OTP सफलतापूर्वक सत्यापित।',
      otpInvalid: 'गलत OTP। कृपया पुनः प्रयास करें।',
      recordNotFound: 'कोई चिकित्सा रिकॉर्ड नहीं मिला।',
      appointmentBooked: 'अपॉइंटमेंट सफलतापूर्वक बुक किया गया।',
      emergencyAlert: 'आपातकालीन अलर्ट भेजा गया। सहायता आ रही है।',
      healthTip: 'दैनिक स्वास्थ्य सुझाव: बेहतर स्वास्थ्य के लिए दिन में कम से कम 8 गिलास पानी पिएं।',
    }
  };

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize with some sample sessions for testing
    const sampleSession: SMSSession = {
      sessionId: 'session-001',
      phoneNumber: '+919876543210',
      patientId: 'patient-001',
      currentStep: '*123#',
      context: {},
      language: 'en',
      createdAt: Date.now(),
      lastActivity: Date.now(),
      isActive: true,
    };
    this.sessions.set('+919876543210', sampleSession);
  }

  /**
   * Handle USSD session
   */
  async handleUSSD(phoneNumber: string, input: string): Promise<string> {
    let session = this.sessions.get(phoneNumber);
    
    // Create new session if doesn't exist
    if (!session) {
      session = {
        sessionId: `session-${Date.now()}`,
        phoneNumber,
        currentStep: '*123#',
        context: {},
        language: 'en',
        createdAt: Date.now(),
        lastActivity: Date.now(),
        isActive: true,
      };
      this.sessions.set(phoneNumber, session);

      // Log session start
      await this.ledger.appendTx({
        actor: `sms:${phoneNumber}`,
        action: SMS_ACTIONS.SESSION_START,
        details: { phoneNumber, sessionId: session.sessionId, input }
      });
    }

    // Update session activity
    session.lastActivity = Date.now();

    // Handle input
    if (input === '*123#') {
      return this.renderMenu('*123#', session);
    }

    // Handle menu navigation
    const currentMenu = this.ussdMenus.get(session.currentStep);
    if (currentMenu) {
      const option = currentMenu.options.find(opt => opt.key === input);
      if (option) {
        return await this.handleMenuOption(option, session);
      } else {
        return this.getResponse('invalidOption', session.language);
      }
    }

    return this.getResponse('invalidOption', session.language);
  }

  /**
   * Handle SMS message
   */
  async handleSMS(phoneNumber: string, message: string): Promise<string> {
    const parts = message.trim().toUpperCase().split(' ');
    const command = parts[0];

    const smsCommand = this.smsCommands.get(command);
    if (!smsCommand) {
      return this.getAvailableCommands();
    }

    // Check authentication if required
    if (smsCommand.requiresAuth && !await this.isAuthenticated(phoneNumber)) {
      return await this.sendOTP(phoneNumber);
    }

    // Execute command function
    return await this.executeFunction(smsCommand.function, parts.slice(1), phoneNumber);
  }

  /**
   * Render USSD menu
   */
  private renderMenu(menuCode: string, session: SMSSession): string {
    const menu = this.ussdMenus.get(menuCode);
    if (!menu) {
      return this.getResponse('invalidOption', session.language);
    }

    session.currentStep = menuCode;

    let response = `${menu.title}\n\n`;
    menu.options.forEach(option => {
      response += `${option.key}. ${option.text}\n`;
    });

    return response;
  }

  /**
   * Handle menu option selection
   */
  private async handleMenuOption(option: USSDOption, session: SMSSession): Promise<string> {
    switch (option.action) {
      case 'menu':
        if (option.target) {
          return this.renderMenu(option.target, session);
        }
        break;
      
      case 'function':
        if (option.function) {
          return await this.executeFunction(option.function, [], session.phoneNumber);
        }
        break;
      
      case 'input':
        session.context.waitingFor = option.target;
        return `Please enter ${option.target}:`;
    }

    return this.getResponse('invalidOption', session.language);
  }

  /**
   * Execute function based on command
   */
  private async executeFunction(functionName: string, args: string[], phoneNumber: string): Promise<string> {
    const [func, param] = functionName.split(':');

    switch (func) {
      case 'getHealthTip':
        return await this.getHealthTip(phoneNumber);
      
      case 'getLatestRecord':
        return await this.getLatestRecord(phoneNumber);
      
      case 'getAllRecords':
        return await this.getAllRecords(phoneNumber);
      
      case 'bookAppointment':
        return await this.bookAppointment(args, phoneNumber);
      
      case 'callAmbulance':
        return await this.callAmbulance(phoneNumber);
      
      case 'findNearestHospital':
        return await this.findNearestHospital(phoneNumber);
      
      case 'handleEmergency':
        return await this.handleEmergency(phoneNumber);
      
      case 'setLanguage':
        return await this.setLanguage(param as any, phoneNumber);
      
      case 'verifyOTP':
        return await this.verifyOTP(args[0], phoneNumber);
      
      case 'getHelp':
        return this.getHelp();
      
      default:
        return 'Function not implemented yet.';
    }
  }

  /**
   * Get health tip
   */
  private async getHealthTip(phoneNumber: string): Promise<string> {
    const session = this.sessions.get(phoneNumber);
    const language = session?.language || 'en';
    
    const healthTips = {
      en: [
        'Drink at least 8 glasses of water daily for better health.',
        'Exercise for 30 minutes daily to stay fit.',
        'Eat 5 servings of fruits and vegetables daily.',
        'Get 7-8 hours of sleep every night.',
        'Wash your hands frequently to prevent infections.',
      ],
      hi: [
        'बेहतर स्वास्थ्य के लिए दिन में कम से कम 8 गिलास पानी पिएं।',
        'फिट रहने के लिए रोज 30 मिनट व्यायाम करें।',
        'रोज 5 बार फल और सब्जियां खाएं।',
        'हर रात 7-8 घंटे की नींद लें।',
        'संक्रमण से बचने के लिए बार-बार हाथ धोएं।',
      ]
    };

    const tips = healthTips[language] || healthTips.en;
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    await this.ledger.appendTx({
      actor: `sms:${phoneNumber}`,
      action: SMS_ACTIONS.HEALTH_TIP,
      details: { phoneNumber, tip: randomTip }
    });

    return `Health Tip: ${randomTip}`;
  }

  /**
   * Get latest medical record
   */
  private async getLatestRecord(phoneNumber: string): Promise<string> {
    // Mock implementation - in real scenario, fetch from record manager
    const session = this.sessions.get(phoneNumber);
    if (!session?.patientId) {
      return 'Please authenticate first. Send OTP request.';
    }

    await this.ledger.appendTx({
      actor: `sms:${phoneNumber}`,
      action: SMS_ACTIONS.RECORD_ACCESS,
      details: { phoneNumber, patientId: session.patientId, type: 'latest' }
    });

    return `Latest Record:
Date: ${new Date().toLocaleDateString()}
Doctor: Dr. Smith
Diagnosis: Regular checkup
Prescription: Multivitamin tablets
Next visit: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`;
  }

  /**
   * Get all medical records
   */
  private async getAllRecords(phoneNumber: string): Promise<string> {
    const session = this.sessions.get(phoneNumber);
    if (!session?.patientId) {
      return 'Please authenticate first. Send OTP request.';
    }

    await this.ledger.appendTx({
      actor: `sms:${phoneNumber}`,
      action: SMS_ACTIONS.RECORD_ACCESS,
      details: { phoneNumber, patientId: session.patientId, type: 'all' }
    });

    return `Medical Records Summary:
Total Records: 5
Last Visit: ${new Date().toLocaleDateString()}
Chronic Conditions: None
Allergies: None
Blood Group: O+

For detailed records, visit hospital or use web portal.`;
  }

  /**
   * Book appointment
   */
  private async bookAppointment(args: string[], phoneNumber: string): Promise<string> {
    const session = this.sessions.get(phoneNumber);
    if (!session?.patientId) {
      return 'Please authenticate first. Send OTP request.';
    }

    const doctorType = args[0] || 'General Physician';
    const appointmentDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString();

    await this.ledger.appendTx({
      actor: `sms:${phoneNumber}`,
      action: SMS_ACTIONS.APPOINTMENT_BOOK,
      details: { phoneNumber, patientId: session.patientId, doctorType, date: appointmentDate }
    });

    return `Appointment Booked:
Doctor: ${doctorType}
Date: ${appointmentDate}
Time: 10:00 AM
Hospital: City General Hospital
Reference: APT${Date.now().toString().slice(-6)}

Please arrive 15 minutes early.`;
  }

  /**
   * Handle emergency
   */
  private async handleEmergency(phoneNumber: string): Promise<string> {
    await this.ledger.appendTx({
      actor: `sms:${phoneNumber}`,
      action: SMS_ACTIONS.EMERGENCY_ALERT,
      details: { phoneNumber, type: 'general_emergency' }
    });

    return `EMERGENCY ALERT ACTIVATED
Ambulance dispatched to your location.
Emergency Contact: 108
Nearest Hospital: City General Hospital
ETA: 15 minutes

Stay calm. Help is on the way.`;
  }

  /**
   * Call ambulance
   */
  private async callAmbulance(phoneNumber: string): Promise<string> {
    await this.ledger.appendTx({
      actor: `sms:${phoneNumber}`,
      action: SMS_ACTIONS.EMERGENCY_ALERT,
      details: { phoneNumber, type: 'ambulance_request' }
    });

    return `AMBULANCE REQUESTED
Location: Auto-detected via GPS
ETA: 12 minutes
Ambulance ID: AMB-001
Driver: Ravi Kumar (+91-9876543210)

Emergency Hotline: 108
Stay on the line for updates.`;
  }

  /**
   * Find nearest hospital
   */
  private async findNearestHospital(phoneNumber: string): Promise<string> {
    return `Nearest Hospitals:

1. City General Hospital
   Distance: 2.5 km
   Phone: +91-11-12345678
   Emergency: Available

2. Metro Medical Center
   Distance: 3.8 km
   Phone: +91-11-87654321
   Emergency: Available

3. Rural Health Center
   Distance: 5.2 km
   Phone: +91-11-11223344
   Emergency: Limited`;
  }

  /**
   * Send OTP for authentication
   */
  private async sendOTP(phoneNumber: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    this.otpStore.set(phoneNumber, {
      otp,
      expires,
      purpose: 'authentication'
    });

    await this.ledger.appendTx({
      actor: `sms:${phoneNumber}`,
      action: SMS_ACTIONS.OTP_VERIFY,
      details: { phoneNumber, otpSent: true }
    });

    return `OTP sent to ${phoneNumber}: ${otp}
Valid for 5 minutes.
Reply with: OTP ${otp}`;
  }

  /**
   * Verify OTP
   */
  private async verifyOTP(otp: string, phoneNumber: string): Promise<string> {
    const storedOTP = this.otpStore.get(phoneNumber);
    
    if (!storedOTP) {
      return 'No OTP request found. Please request OTP first.';
    }

    if (Date.now() > storedOTP.expires) {
      this.otpStore.delete(phoneNumber);
      return 'OTP expired. Please request a new OTP.';
    }

    if (storedOTP.otp !== otp) {
      return 'Invalid OTP. Please try again.';
    }

    // OTP verified - authenticate user
    this.otpStore.delete(phoneNumber);
    const session = this.sessions.get(phoneNumber);
    if (session) {
      session.patientId = 'patient-001'; // In real scenario, fetch from database
    }

    await this.ledger.appendTx({
      actor: `sms:${phoneNumber}`,
      action: SMS_ACTIONS.OTP_VERIFY,
      details: { phoneNumber, otpVerified: true }
    });

    return 'OTP verified successfully. You are now authenticated.';
  }

  /**
   * Set language preference
   */
  private async setLanguage(language: 'en' | 'hi' | 'te' | 'ta' | 'bn', phoneNumber: string): Promise<string> {
    const session = this.sessions.get(phoneNumber);
    if (session) {
      session.language = language;
    }

    const languageNames = {
      en: 'English',
      hi: 'हिंदी',
      te: 'తెలుగు',
      ta: 'தமிழ்',
      bn: 'বাংলা'
    };

    return `Language set to ${languageNames[language]}. All future messages will be in this language.`;
  }

  /**
   * Get help information
   */
  private getHelp(): string {
    return `Arogya Rakshak Help:

USSD: Dial *123# for menu
SMS Commands:
- HEALTH: Get health tips
- RECORD: View medical records
- BOOK: Book appointment
- EMERGENCY: Emergency services
- OTP: Verify authentication

Emergency: 108
Support: 1234`;
  }

  /**
   * Check if user is authenticated
   */
  private async isAuthenticated(phoneNumber: string): Promise<boolean> {
    const session = this.sessions.get(phoneNumber);
    return session?.patientId !== undefined;
  }

  /**
   * Get available SMS commands
   */
  private getAvailableCommands(): string {
    let response = 'Available Commands:\n\n';
    this.smsCommands.forEach(cmd => {
      response += `${cmd.keyword}: ${cmd.description}\n`;
      response += `Usage: ${cmd.usage}\n\n`;
    });
    return response;
  }

  /**
   * Get localized response
   */
  private getResponse(key: string, language: 'en' | 'hi' | 'te' | 'ta' | 'bn'): string {
    const responses = this.responses[language] || this.responses.en;
    return responses[key] || key;
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    totalSessions: number;
    activeSessions: number;
    totalUSSDRequests: number;
    totalSMSRequests: number;
    languageDistribution: Record<string, number>;
  } {
    const sessions = Array.from(this.sessions.values());
    const activeSessions = sessions.filter(s => s.isActive).length;
    
    const languageDistribution = sessions.reduce((acc, session) => {
      acc[session.language] = (acc[session.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSessions: sessions.length,
      activeSessions,
      totalUSSDRequests: 0, // Would be tracked in real implementation
      totalSMSRequests: 0, // Would be tracked in real implementation
      languageDistribution,
    };
  }

  /**
   * Cleanup expired sessions
   */
  cleanupExpiredSessions(): void {
    const now = Date.now();
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes

    for (const [phoneNumber, session] of this.sessions.entries()) {
      if (now - session.lastActivity > sessionTimeout) {
        session.isActive = false;
        this.sessions.delete(phoneNumber);
      }
    }
  }
}

// Singleton instance
let smsUssdService: SMSUSSDService;

export function getSMSUSSDService(): SMSUSSDService {
  if (!smsUssdService) {
    smsUssdService = new SMSUSSDService();
  }
  return smsUssdService;
}
