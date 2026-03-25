"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Download,
  Eye,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react"
import { CertificateStatusBadge } from "@/components/certificate-status-badge"
import { CertificateWorkflow } from "@/components/certificate-workflow"
import { apiFetch, getStoredToken, getStoredWalletAddress } from "@/lib/api"

type CertificateStatus = "generated" | "signed" | "validated"

type ApiCertificate = {
  id: string
  studentName: string
  studentAddress: string
  diplomaTitle: string
  mention: string
  issueDate: number
  teacherSigned: boolean
  validated: boolean
  signedByTeacher?: string
}

type UiCertificate = {
  id: string
  studentName: string
  studentAddress: string
  diplomaTitle: string
  mention: string
  issueDate: number
  status: CertificateStatus
  txHash?: string | null
}

function mapCertificateStatus(cert: ApiCertificate): CertificateStatus {
  if (cert.validated) return "validated"
  if (cert.teacherSigned) return "signed"
  return "generated"
}

export default function MyCertificatesPage() {
  const [studentCertificates, setStudentCertificates] = useState<UiCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")

  useEffect(() => {
    const loadMyCertificates = async () => {
      try {
        setLoading(true)
        setPageError("")

        const token = getStoredToken()
        const walletAddress = getStoredWalletAddress()

        if (!token) throw new Error("Authentication token not found")
        if (!walletAddress) throw new Error("Student wallet address not found")

        const response = await apiFetch("/api/certificates", { method: "GET" }, token)

        const certificates: UiCertificate[] = (response.data || [])
          .filter(
            (cert: ApiCertificate) =>
              cert.studentAddress?.toLowerCase() === walletAddress.toLowerCase()
          )
          .map((cert: ApiCertificate) => ({
            id: cert.id,
            studentName: cert.studentName,
            studentAddress: cert.studentAddress,
            diplomaTitle: cert.diplomaTitle,
            mention: cert.mention,
            issueDate: cert.issueDate,
            status: mapCertificateStatus(cert),
            txHash: null,
          }))

        setStudentCertificates(certificates)
      } catch (error) {
        setPageError(error instanceof Error ? error.message : "Failed to load student certificates")
      } finally {
        setLoading(false)
      }
    }

    loadMyCertificates()
  }, [])

  const validatedCount = useMemo(
    () => studentCertificates.filter((c) => c.status === "validated").length,
    [studentCertificates]
  )

  const pendingCount = useMemo(
    () => studentCertificates.filter((c) => c.status !== "validated").length,
    [studentCertificates]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Certificates</h1>
        <p className="text-muted-foreground">
          View and manage your academic certificates stored on the blockchain
        </p>
      </div>

      {pageError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {pageError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentCertificates.length}</p>
              <p className="text-sm text-muted-foreground">Total Certificates</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{validatedCount}</p>
              <p className="text-sm text-muted-foreground">Validated</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Certificates</h2>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading certificates...
            </CardContent>
          </Card>
        ) : studentCertificates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No Certificates Yet</h3>
              <p className="text-sm text-muted-foreground">
                Your certificates will appear here once they are issued.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {studentCertificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CertificateCard({ certificate }: { certificate: UiCertificate }) {
  const isValidated = certificate.status === "validated"

  return (
    <Card className="overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{certificate.diplomaTitle}</h3>
            <p className="font-mono text-xs text-muted-foreground">{certificate.id}</p>
          </div>
          <CertificateStatusBadge status={certificate.status} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Mention</span>
          <Badge variant="secondary">{certificate.mention}</Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Issue Date</span>
          <span>{new Date(certificate.issueDate * 1000).toLocaleDateString()}</span>
        </div>

        <CertificateWorkflow status={certificate.status} compact />

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
            <Link href={`/dashboard/my-certificates/${certificate.id}`}>
              <Eye className="h-3 w-3" />
              View
            </Link>
          </Button>

          {isValidated && (
            <>
              <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
                <Link href={`/dashboard/diploma/${certificate.id}`}>
                  <FileText className="h-3 w-3" />
                  Diploma
                </Link>
              </Button>

              <Button variant="outline" size="sm" className="gap-1" asChild>
                <Link href={`/dashboard/diploma/${certificate.id}`} target="_blank">
                  <Download className="h-3 w-3" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {certificate.txHash && (
          <div className="flex items-center justify-between border-t pt-3 text-xs">
            <span className="text-muted-foreground">Blockchain TX</span>
            <a
              href={`https://etherscan.io/tx/${certificate.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-primary hover:underline"
            >
              {certificate.txHash.slice(0, 10)}...{certificate.txHash.slice(-8)}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>
    </Card>
  )
}