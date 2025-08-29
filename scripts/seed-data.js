/**
 * Seed Data Script for Arogya Rakshak - Hospital Blockchain DApp
 * This script generates mock data for development and demo purposes
 */

// Mock Users Database
const mockUsers = [
  {
    id: '1',
    name: 'Aarav Sharma',
    email: 'patient@demo.com',
    password: 'demo123',
    role: 'patient',
    phone: '+91-9876543210',
    address: 'Mumbai, Maharashtra',
    createdAt: new Date('2024-01-15'),
    healthId: 'HLTH-PAT-001'
  },
  {
    id: '2',
    name: 'Dr. Priya Patel',
    email: 'doctor@demo.com',
    password: 'demo123',
    role: 'doctor',
    phone: '+91-9876543211',
    specialization: 'Cardiology',
    hospital: 'Apollo Hospital, Delhi',
    license: 'MED-LIC-12345',
    createdAt: new Date('2024-01-10'),
    healthId: 'HLTH-DOC-001'
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    email: 'staff@demo.com',
    password: 'demo123',
    role: 'staff',
    phone: '+91-9876543212',
    department: 'Administration',
    hospital: 'AIIMS, Delhi',
    employeeId: 'EMP-STAFF-001',
    createdAt: new Date('2024-01-12'),
    healthId: 'HLTH-STF-001'
  },
  {
    id: '4',
    name: 'Meera Singh',
    email: 'auditor@demo.com',
    password: 'demo123',
    role: 'auditor',
    phone: '+91-9876543213',
    organization: 'Healthcare Compliance Board',
    certificationId: 'AUD-CERT-001',
    createdAt: new Date('2024-01-08'),
    healthId: 'HLTH-AUD-001'
  }
]

// Mock Medical Records
const mockMedicalRecords = [
  {
    id: 'REC-001',
    patientId: '1',
    doctorId: '2',
    hospitalId: 'HOSP-001',
    diagnosis: 'Hypertension (High Blood Pressure)',
    prescription: 'Amlodipine 5mg daily, Low-salt diet, Regular exercise',
    symptoms: 'Headache, dizziness, chest pain',
    vitalSigns: {
      bloodPressure: '150/95 mmHg',
      heartRate: '78 bpm',
      temperature: '98.6°F',
      weight: '75 kg'
    },
    labResults: ['Blood pressure monitoring', 'ECG normal'],
    createdAt: new Date('2024-08-29'),
    blockchainHash: 'QmX9a8sDk3In45Z7p' + Math.random().toString(36).substr(2, 8),
    blockNumber: Math.floor(Math.random() * 10000) + 50000,
    verified: true
  },
  {
    id: 'REC-002',
    patientId: '1',
    doctorId: '2',
    hospitalId: 'HOSP-001',
    diagnosis: 'Annual Health Checkup',
    prescription: 'Continue current medications, Follow-up in 6 months',
    symptoms: 'Routine checkup',
    vitalSigns: {
      bloodPressure: '140/90 mmHg',
      heartRate: '72 bpm',
      temperature: '98.4°F',
      weight: '74 kg'
    },
    labResults: ['Complete blood count - Normal', 'Lipid profile - Borderline'],
    createdAt: new Date('2024-06-15'),
    blockchainHash: 'QmY8b7tEk4Jn56A8q' + Math.random().toString(36).substr(2, 8),
    blockNumber: Math.floor(Math.random() * 10000) + 45000,
    verified: true
  }
]

// Mock Hospitals
const mockHospitals = [
  {
    id: 'HOSP-001',
    name: 'Apollo Hospital',
    location: 'Delhi',
    type: 'Multi-specialty',
    beds: 500,
    rating: 4.8,
    accreditation: 'NABH Accredited',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
    contactInfo: {
      phone: '+91-11-26925858',
      email: 'info@apollodelhi.com',
      address: 'Sarita Vihar, Delhi'
    },
    complianceScore: 95,
    badges: ['Quality Care', 'Patient Safety', 'Digital Excellence']
  },
  {
    id: 'HOSP-002',
    name: 'AIIMS',
    location: 'Delhi',
    type: 'Government Medical College',
    beds: 2500,
    rating: 4.9,
    accreditation: 'Government Accredited',
    specialties: ['All Medical Specialties'],
    contactInfo: {
      phone: '+91-11-26588500',
      email: 'info@aiims.edu',
      address: 'Ansari Nagar, Delhi'
    },
    complianceScore: 98,
    badges: ['Excellence in Medical Education', 'Research Leader', 'Public Service']
  }
]

// Mock Blockchain Transactions
const mockBlockchainData = {
  networkStats: {
    totalTransactions: 125847,
    totalBlocks: 52341,
    activeNodes: 24,
    networkHashRate: '2.5 TH/s',
    averageBlockTime: '2.3 seconds',
    consensusAlgorithm: 'Proof of Authority'
  },
  recentTransactions: [
    {
      hash: 'QmX9a8sDk3In45Z7p' + Math.random().toString(36).substr(2, 8),
      type: 'Medical Record',
      from: 'Dr. Priya Patel',
      to: 'Aarav Sharma',
      timestamp: new Date(),
      blockNumber: 52341,
      gasUsed: '21000',
      status: 'Confirmed'
    },
    {
      hash: 'QmY8b7tEk4Jn56A8q' + Math.random().toString(36).substr(2, 8),
      type: 'Insurance Claim',
      from: 'Apollo Hospital',
      to: 'Health Insurance Corp',
      timestamp: new Date(Date.now() - 300000),
      blockNumber: 52340,
      gasUsed: '35000',
      status: 'Confirmed'
    }
  ]
}

// Mock Insurance Claims
const mockInsuranceClaims = [
  {
    id: 'CLM-001',
    patientId: '1',
    hospitalId: 'HOSP-001',
    policyNumber: 'POL-12345',
    claimAmount: 25000,
    approvedAmount: 22000,
    status: 'Approved',
    diagnosis: 'Hypertension Treatment',
    submittedDate: new Date('2024-08-25'),
    processedDate: new Date('2024-08-28'),
    documents: ['Medical Report', 'Prescription', 'Bill Receipt']
  }
]

// Mock ASHA Worker Data
const mockAshaWorkers = [
  {
    id: 'ASHA-001',
    name: 'Sunita Devi',
    phone: '+91-9876543220',
    village: 'Rampur',
    district: 'Uttar Pradesh',
    patientsServed: 150,
    specializations: ['Maternal Health', 'Child Vaccination', 'Health Education'],
    performanceScore: 92,
    lastActive: new Date()
  }
]

// Export all mock data
const seedData = {
  users: mockUsers,
  medicalRecords: mockMedicalRecords,
  hospitals: mockHospitals,
  blockchainData: mockBlockchainData,
  insuranceClaims: mockInsuranceClaims,
  ashaWorkers: mockAshaWorkers
}

// Function to initialize seed data (for use in development)
function initializeSeedData() {
  console.log('🌱 Initializing seed data for Arogya Rakshak...')
  
  // In a real application, this would populate your database
  // For demo purposes, we'll store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('arogya_seed_data', JSON.stringify(seedData))
    console.log('✅ Seed data stored in localStorage')
  }
  
  return seedData
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { seedData, initializeSeedData }
}

export { seedData, initializeSeedData }
