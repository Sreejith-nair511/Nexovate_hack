# Arogya Rakshak - Blockchain Health for India 🇮🇳

A comprehensive blockchain-powered healthcare platform designed for India's diverse healthcare ecosystem, featuring secure medical records, rural accessibility, and transparent audit trails.

## 🌟 Features

### Core Platform
- **Blockchain Medical Records**: Immutable, tamper-proof health records with cryptographic verification
- **Multi-Role Dashboard**: Separate interfaces for Patients, Doctors, Hospital Staff, and Auditors
- **Dark Mode Support**: Smooth theme transitions with system preference detection
- **Responsive Design**: Mobile-first approach with Indian tri-color theming

### Healthcare Modules
- **Patient Management**: Secure access to medical history, prescriptions, and health reports
- **Doctor Portal**: Record creation, patient management, and prescription tracking
- **Hospital Administration**: Staff management, compliance tracking, and system oversight
- **Audit System**: Compliance monitoring, violation tracking, and quality assurance

### Rural Access Features
- **SMS/USSD Integration**: Healthcare access via basic mobile phones
- **Multi-language Support**: English, Hindi, Telugu, Tamil, Bengali
- **ASHA Worker System**: Community health worker integration with OTP co-signing
- **Nokia Phone Simulator**: Demonstrates SMS-based health report delivery

### Advanced Features
- **Insurance Claims**: Complete lifecycle management with blockchain verification
- **QR Health Cards**: Instant access to patient information via QR codes
- **Real-time Analytics**: Live blockchain metrics and network monitoring
- **Compliance Scoring**: Hospital quality metrics and achievement badges

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Modern web browser with JavaScript enabled

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd hospital-blockchain-dapp

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Demo Access
Visit the live demo at `http://localhost:3000/demo` or use these test accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Patient | `patient@demo.com` | `demo123` | Access medical records and reports |
| Doctor | `doctor@demo.com` | `demo123` | Create prescriptions and manage patients |
| Staff | `staff@demo.com` | `demo123` | Hospital administration and oversight |
| Auditor | `auditor@demo.com` | `demo123` | Compliance monitoring and auditing |

## 📱 Key Pages

### Landing Page (`/`)
- Hero section with Indian tri-color gradient
- Mission statement and feature highlights
- Navigation to demo, login, and dashboard

### Demo Page (`/demo`)
- Interactive health report generation
- Automatic PDF download with blockchain verification
- Opens phone simulator showing SMS delivery

### Phone Simulator (`/phone`)
- Nokia 3310-style interface
- Auto-scrolling SMS messages
- Demonstrates rural healthcare accessibility

### Authentication (`/auth/login`, `/auth/signup`)
- Role-based login system
- Mock user database with instant access
- Secure password handling simulation

### Dashboard (`/dashboard`)
- Role-specific interfaces
- Real-time blockchain metrics
- Comprehensive healthcare management

## 🏗️ Architecture

### Frontend Stack
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with dark mode
- **Shadcn/ui**: Consistent component library
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Modern icon library

### Backend Simulation
- **Mock Blockchain**: Simulated Hyperledger-style ledger
- **API Routes**: Next.js API endpoints for data management
- **Local Storage**: Client-side data persistence for demo
- **Cryptographic Signatures**: TweetNaCl for security simulation

### Key Components
```
components/
├── ui/                 # Reusable UI components
├── blockchain/         # Blockchain-specific components
├── theme-provider.tsx  # Dark mode theme management
└── theme-toggle.tsx    # Theme switching component

app/
├── api/               # Backend API routes
├── auth/              # Authentication pages
├── dashboard/         # Role-based dashboards
├── demo/              # Interactive demo
└── phone/             # SMS simulator
```

## 🔧 Configuration

### Environment Setup
The application works out-of-the-box with no additional configuration required. All demo data is generated dynamically.

### Theme Configuration
Dark mode is automatically configured with:
- System preference detection
- Smooth color transitions
- Persistent user preference storage

### Mock Data
Seed data is automatically generated including:
- User accounts for all roles
- Sample medical records
- Hospital information
- Blockchain transactions
- Insurance claims

## 🌐 Deployment

### Development
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint checks
```

### Production Build
```bash
pnpm build
pnpm start
```

The application is optimized for deployment on:
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

## 🔐 Security Features

### Blockchain Integration
- **Immutable Records**: All medical data stored with cryptographic hashes
- **Digital Signatures**: TweetNaCl-based signature verification
- **Audit Trails**: Complete transaction history with timestamps
- **Consensus Mechanism**: Proof of Authority for healthcare networks

### Data Protection
- **AES-256 Encryption**: Military-grade data encryption simulation
- **Role-Based Access**: Granular permissions for different user types
- **Session Management**: Secure authentication with proper logout
- **Input Validation**: Comprehensive form validation and sanitization

## 📊 Blockchain Explorer

### Real-time Metrics
- Transaction throughput (TPS)
- Network latency monitoring
- Mempool size tracking
- Consensus time measurement

### Network Monitoring
- Active node status
- Geographic distribution
- Uptime tracking
- Performance analytics

### Transaction Analytics
- Transaction type distribution
- Hourly activity patterns
- Top network participants
- Gas usage optimization

## 🏥 Healthcare Workflows

### Patient Journey
1. **Registration**: Create account with role selection
2. **Health Records**: Access complete medical history
3. **Appointments**: Schedule and manage doctor visits
4. **Prescriptions**: Receive and track medications
5. **Reports**: Download blockchain-verified health reports

### Doctor Workflow
1. **Patient Management**: Access patient records securely
2. **Diagnosis Entry**: Create new medical records
3. **Prescription Writing**: Generate digital prescriptions
4. **Follow-up Tracking**: Monitor patient progress
5. **Compliance Reporting**: Submit required documentation

### Rural Access
1. **SMS Registration**: Basic phone number registration
2. **Health Tips**: Receive wellness information via SMS
3. **Appointment Booking**: Schedule visits through USSD
4. **Record Access**: Get health summaries via text
5. **Emergency Alerts**: Critical health notifications

## 🎯 Use Cases

### Urban Healthcare
- **Digital Records**: Complete EMR system with blockchain backing
- **Insurance Integration**: Seamless claim processing and verification
- **Multi-hospital Access**: Unified records across healthcare providers
- **Specialist Referrals**: Secure data sharing between doctors

### Rural Healthcare
- **Basic Phone Access**: Healthcare via SMS and USSD
- **ASHA Worker Support**: Community health worker integration
- **Offline Capability**: Works with intermittent connectivity
- **Local Language Support**: Native language interfaces

### Government Integration
- **Public Health Monitoring**: Population health analytics
- **Compliance Tracking**: Hospital quality assurance
- **Policy Implementation**: Healthcare program management
- **Audit Capabilities**: Transparent healthcare delivery

## 🤝 Contributing

This project was developed by **Team Final Commit** for India's healthcare transformation. The codebase is designed to be:

- **Modular**: Easy to extend with new features
- **Scalable**: Ready for production deployment
- **Maintainable**: Clean code with comprehensive documentation
- **Accessible**: Inclusive design for all users

## 📄 License

This project is developed for educational and demonstration purposes. It showcases the potential of blockchain technology in healthcare while maintaining focus on India's unique healthcare challenges.

## 🙏 Acknowledgments

- **Healthcare Workers**: Inspired by India's frontline medical professionals
- **ASHA Workers**: Dedicated to rural healthcare accessibility
- **Blockchain Community**: Building transparent and secure systems
- **Open Source**: Standing on the shoulders of giants

---

**Made with ❤️ by Team Final Commit for India 🇮🇳**

*Transforming healthcare through blockchain technology, one patient at a time.*
