export type CertificateStatus = "generated" | "signed" | "validated"

export interface Certificate {
  id: string
  studentName: string
  studentAddress: string
  diplomaTitle: string
  mention: "Passable" | "Assez Bien" | "Bien" | "Très Bien"
  status: CertificateStatus
  issueDate: string
  txHash: string | null
  signedBy?: string
  signedAt?: string
  validatedBy?: string
  validatedAt?: string
}

export interface User {
  address: string
  name: string
  email?: string
  addedAt: string
}

export interface Activity {
  id: string
  type: "generate" | "sign" | "validate" | "add_user"
  description: string
  actor: string
  timestamp: string
  txHash?: string
}

// Mock certificates data
export const mockCertificates: Certificate[] = [
  {
    id: "CERT-2024-001",
    studentName: "Alice Martin",
    studentAddress: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    diplomaTitle: "Master en Informatique",
    mention: "Très Bien",
    status: "validated",
    issueDate: "2024-06-15",
    txHash: "0xabc123def456789012345678901234567890abcdef123456789012345678901234",
    signedBy: "0xteacher1...789",
    signedAt: "2024-06-16",
    validatedBy: "0xadmin...123",
    validatedAt: "2024-06-17",
  },
  {
    id: "CERT-2024-002",
    studentName: "Bob Dupont",
    studentAddress: "0x2b3c4d5e6f78901234567890abcdef1234567890ab",
    diplomaTitle: "Licence en Mathématiques",
    mention: "Bien",
    status: "signed",
    issueDate: "2024-06-18",
    txHash: "0xdef456789012345678901234567890abcdef123456789012345678901234567890",
    signedBy: "0xteacher2...456",
    signedAt: "2024-06-19",
  },
  {
    id: "CERT-2024-003",
    studentName: "Claire Bernard",
    studentAddress: "0x3c4d5e6f7890123456789012345678901234567890cd",
    diplomaTitle: "Master en Économie",
    mention: "Assez Bien",
    status: "generated",
    issueDate: "2024-06-20",
    txHash: "0x789012345678901234567890abcdef1234567890abcdef123456789012345678",
  },
  {
    id: "CERT-2024-004",
    studentName: "David Leroy",
    studentAddress: "0x4d5e6f78901234567890123456789012345678901234",
    diplomaTitle: "Doctorat en Physique",
    mention: "Très Bien",
    status: "validated",
    issueDate: "2024-05-10",
    txHash: "0x012345678901234567890abcdef1234567890abcdef12345678901234567890ab",
    signedBy: "0xteacher1...789",
    signedAt: "2024-05-11",
    validatedBy: "0xadmin...123",
    validatedAt: "2024-05-12",
  },
  {
    id: "CERT-2024-005",
    studentName: "Emma Petit",
    studentAddress: "0x5e6f789012345678901234567890123456789012345e",
    diplomaTitle: "Master en Chimie",
    mention: "Bien",
    status: "signed",
    issueDate: "2024-06-22",
    txHash: "0x345678901234567890abcdef1234567890abcdef1234567890123456789012cd",
    signedBy: "0xteacher2...456",
    signedAt: "2024-06-23",
  },
  {
    id: "CERT-2024-006",
    studentName: "François Moreau",
    studentAddress: "0x6f7890123456789012345678901234567890123456f0",
    diplomaTitle: "Licence en Histoire",
    mention: "Passable",
    status: "generated",
    issueDate: "2024-06-25",
    txHash: "0x567890123456789012345678901234567890abcdef12345678901234567890ef",
  },
]

// Mock teachers
export const mockTeachers: User[] = [
  {
    address: "0xteacher1234567890abcdef1234567890abcdef12",
    name: "Prof. Jean Dupuis",
    email: "j.dupuis@university.edu",
    addedAt: "2024-01-15",
  },
  {
    address: "0xteacher2345678901234567890abcdef123456789a",
    name: "Prof. Marie Laurent",
    email: "m.laurent@university.edu",
    addedAt: "2024-02-20",
  },
  {
    address: "0xteacher3456789012345678901234567890abcdef1b",
    name: "Prof. Pierre Martin",
    email: "p.martin@university.edu",
    addedAt: "2024-03-10",
  },
]

// Mock students
export const mockStudents: User[] = [
  {
    address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    name: "Alice Martin",
    email: "alice.martin@student.edu",
    addedAt: "2024-01-05",
  },
  {
    address: "0x2b3c4d5e6f78901234567890abcdef1234567890ab",
    name: "Bob Dupont",
    email: "bob.dupont@student.edu",
    addedAt: "2024-01-10",
  },
  {
    address: "0x3c4d5e6f7890123456789012345678901234567890cd",
    name: "Claire Bernard",
    email: "claire.bernard@student.edu",
    addedAt: "2024-01-15",
  },
  {
    address: "0x4d5e6f78901234567890123456789012345678901234",
    name: "David Leroy",
    email: "david.leroy@student.edu",
    addedAt: "2024-02-01",
  },
  {
    address: "0x5e6f789012345678901234567890123456789012345e",
    name: "Emma Petit",
    email: "emma.petit@student.edu",
    addedAt: "2024-02-15",
  },
]

// Mock activity feed
export const mockActivities: Activity[] = [
  {
    id: "act-001",
    type: "validate",
    description: "Certificate CERT-2024-001 validated for Alice Martin",
    actor: "0xadmin...123",
    timestamp: "2024-06-17T14:30:00Z",
    txHash: "0xval123...",
  },
  {
    id: "act-002",
    type: "sign",
    description: "Certificate CERT-2024-002 signed by Prof. Marie Laurent",
    actor: "0xteacher2...456",
    timestamp: "2024-06-19T10:15:00Z",
    txHash: "0xsign456...",
  },
  {
    id: "act-003",
    type: "generate",
    description: "Certificate CERT-2024-003 generated for Claire Bernard",
    actor: "0xadmin...123",
    timestamp: "2024-06-20T09:00:00Z",
    txHash: "0xgen789...",
  },
  {
    id: "act-004",
    type: "add_user",
    description: "New student Emma Petit added to the system",
    actor: "0xadmin...123",
    timestamp: "2024-06-22T11:45:00Z",
  },
  {
    id: "act-005",
    type: "sign",
    description: "Certificate CERT-2024-005 signed by Prof. Marie Laurent",
    actor: "0xteacher2...456",
    timestamp: "2024-06-23T16:20:00Z",
    txHash: "0xsign012...",
  },
]

// Statistics helpers
export function getStats() {
  const total = mockCertificates.length
  const signed = mockCertificates.filter((c) => c.status === "signed" || c.status === "validated").length
  const validated = mockCertificates.filter((c) => c.status === "validated").length
  const pending = mockCertificates.filter((c) => c.status === "generated").length

  return { total, signed, validated, pending }
}
