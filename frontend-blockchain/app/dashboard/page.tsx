"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/stats-cards"
import { ActivityFeed } from "@/components/activity-feed"
import { CertificateStatusBadge } from "@/components/certificate-status-badge"
import { ArrowRight, FileText, GraduationCap, Loader2 } from "lucide-react"
import { apiFetch, getStoredRole, getStoredToken, getStoredWalletAddress } from "@/lib/api"

type UserRole = "admin" | "teacher" | "student" | "visitor"

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
}

type ActivityItem = {
  id: string
  type: "generate" | "sign" | "validate" | "add_user"
  description: string
  actor: string
  timestamp: string
  txHash?: string
}

function mapCertificateStatus(cert: ApiCertificate): CertificateStatus {
  if (cert.validated) return "validated"
  if (cert.teacherSigned) return "signed"
  return "generated"
}

function buildActivities(certificates: ApiCertificate[]): ActivityItem[] {
  const activities: ActivityItem[] = []

  certificates.forEach((cert) => {
    activities.push({
      id: `generate-${cert.id}`,
      type: "generate",
      description: `Certificate ${cert.id} generated for ${cert.studentName}`,
      actor: "direction",
      timestamp: new Date(cert.issueDate * 1000).toISOString(),
    })

    if (cert.teacherSigned) {
      activities.push({
        id: `sign-${cert.id}`,
        type: "sign",
        description: `Certificate ${cert.id} signed by teacher`,
        actor: cert.signedByTeacher || "teacher",
        timestamp: new Date(cert.issueDate * 1000).toISOString(),
      })
    }

    if (cert.validated) {
      activities.push({
        id: `validate-${cert.id}`,
        type: "validate",
        description: `Certificate ${cert.id} validated by direction`,
        actor: "direction",
        timestamp: new Date(cert.issueDate * 1000).toISOString(),
      })
    }
  })

  return activities.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [certificates, setCertificates] = useState<UiCertificate[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setPageError("")

        const storedRole = getStoredRole() as UserRole | null
        const storedWallet = getStoredWalletAddress()
        const token = getStoredToken()

        setRole(storedRole)
        setWalletAddress(storedWallet)

        if (!token) {
          throw new Error("Authentication token not found")
        }

        const certificatesResponse = await apiFetch(
          "/api/certificates",
          { method: "GET" },
          token
        )

        const apiCertificates: ApiCertificate[] = certificatesResponse.data || []

        const mappedCertificates: UiCertificate[] = apiCertificates.map((cert) => ({
          id: cert.id,
          studentName: cert.studentName,
          studentAddress: cert.studentAddress,
          diplomaTitle: cert.diplomaTitle,
          mention: cert.mention,
          issueDate: cert.issueDate,
          status: mapCertificateStatus(cert),
        }))

        setCertificates(mappedCertificates)
        setActivities(buildActivities(apiCertificates))
      } catch (error) {
        setPageError(error instanceof Error ? error.message : "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const stats = useMemo(() => {
    const total = certificates.length
    const signed = certificates.filter(
      (c) => c.status === "signed" || c.status === "validated"
    ).length
    const validated = certificates.filter((c) => c.status === "validated").length
    const pending = certificates.filter((c) => c.status === "generated").length

    return { total, signed, validated, pending }
  }, [certificates])

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading dashboard...
      </div>
    )
  }

  if (!role) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        No authenticated role found. Please reconnect your wallet.
      </div>
    )
  }

  if (pageError) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {pageError}
        </div>
      </div>
    )
  }

  if (role === "admin") {
    return (
      <div className="space-y-6">
        <StatsCards {...stats} />

        <div className="grid gap-6 lg:grid-cols-2">
          <ActivityFeed activities={activities.slice(0, 5)} />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Certificates</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/certificates" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certificates.slice(0, 4).map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cert.studentName}</p>
                        <p className="text-xs text-muted-foreground">{cert.diplomaTitle}</p>
                      </div>
                    </div>
                    <CertificateStatusBadge status={cert.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <Link href="/dashboard/generate">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Generate Certificate</p>
                  <p className="text-sm text-muted-foreground">Create new certificate</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <Link href="/dashboard/validate">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <GraduationCap className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-medium">Validate Certificate</p>
                  <p className="text-sm text-muted-foreground">Finalize certificates</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <Link href="/dashboard/users">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-muted-foreground">Teachers & students</p>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  if (role === "teacher") {
    const pendingCerts = certificates.filter((c) => c.status === "generated")

    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Signatures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCerts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Signed Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.signed}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Certificates Awaiting Signature</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/sign" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingCerts.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No certificates awaiting signature
              </p>
            ) : (
              <div className="space-y-3">
                {pendingCerts.slice(0, 5).map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cert.studentName}</p>
                        <p className="text-xs text-muted-foreground">{cert.diplomaTitle}</p>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href="/dashboard/sign">Sign</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (role === "student") {
    const studentCerts = certificates.filter(
      (c) =>
        walletAddress &&
        c.studentAddress.toLowerCase() === walletAddress.toLowerCase()
    )

    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentCerts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Validated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentCerts.filter((c) => c.status === "validated").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            {studentCerts.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No certificates found for your wallet.
              </p>
            ) : (
              <div className="space-y-3">
                {studentCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{cert.diplomaTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          Issued: {new Date(cert.issueDate * 1000).toLocaleDateString()} | Mention: {cert.mention}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CertificateStatusBadge status={cert.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="rounded-md border p-6 text-center text-muted-foreground">
      Unsupported role: {role}
    </div>
  )
}