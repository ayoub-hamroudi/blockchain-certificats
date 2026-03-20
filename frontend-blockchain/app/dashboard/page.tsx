"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/stats-cards"
import { ActivityFeed } from "@/components/activity-feed"
import { CertificateStatusBadge } from "@/components/certificate-status-badge"
import { getStats, mockActivities, mockCertificates } from "@/lib/mock-data"
import { ArrowRight, FileText, GraduationCap } from "lucide-react"
import type { UserRole } from "@/lib/wallet-context"

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole | null>(null)
  const stats = getStats()

  useEffect(() => {
    const storedRole = localStorage.getItem("demo_role") as UserRole | null
    setRole(storedRole)
  }, [])

  if (!role) return null

  // Admin Dashboard
  if (role === "admin") {
    return (
      <div className="space-y-6">
        <StatsCards {...stats} />
        
        <div className="grid gap-6 lg:grid-cols-2">
          <ActivityFeed activities={mockActivities.slice(0, 5)} />
          
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
                {mockCertificates.slice(0, 4).map((cert) => (
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

  // Teacher Dashboard
  if (role === "teacher") {
    const pendingCerts = mockCertificates.filter((c) => c.status === "generated")
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
                Signed This Month
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
                      <Link href={`/dashboard/sign?id=${cert.id}`}>Sign</Link>
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

  // Student Dashboard
  if (role === "student") {
    const studentCerts = mockCertificates.filter(
      (c) => c.studentAddress === "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12"
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
              <div className="text-2xl font-bold">{studentCerts.length || 1}</div>
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
                {studentCerts.filter((c) => c.status === "validated").length || 1}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Show first certificate for demo */}
              {[mockCertificates[0]].map((cert) => (
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
                        Issued: {cert.issueDate} | Mention: {cert.mention}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CertificateStatusBadge status={cert.status} />
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/my-certificates/${cert.id}`}>View</Link>
                    </Button>
                    {cert.status === "validated" && (
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/diploma/${cert.id}`}>Download</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
