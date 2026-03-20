"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Download,
  Eye,
  Share2,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { mockCertificates, type Certificate } from "@/lib/mock-data"
import { CertificateStatusBadge } from "@/components/certificate-status-badge"
import { CertificateWorkflow } from "@/components/certificate-workflow"

export default function MyCertificatesPage() {
  // For demo, show certificates for a specific student
  const studentCertificates = mockCertificates.filter(
    (c) => c.studentName === "Alice Martin" || c.studentName === "Bob Dupont"
  )

  const validatedCount = studentCertificates.filter((c) => c.status === "validated").length
  const pendingCount = studentCertificates.filter((c) => c.status !== "validated").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Certificates</h1>
        <p className="text-muted-foreground">
          View and manage your academic certificates stored on the blockchain
        </p>
      </div>

      {/* Summary Cards */}
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

      {/* Certificates List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Certificates</h2>
        {studentCertificates.length === 0 ? (
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

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const isValidated = certificate.status === "validated"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{certificate.diplomaTitle}</CardTitle>
            <CardDescription className="font-mono text-xs">
              {certificate.id}
            </CardDescription>
          </div>
          <CertificateStatusBadge status={certificate.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Mention</span>
          <Badge variant="secondary">{certificate.mention}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Issue Date</span>
          <span>{new Date(certificate.issueDate).toLocaleDateString()}</span>
        </div>

        <CertificateWorkflow status={certificate.status} compact />

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
            <Link href={`/dashboard/certificates/${certificate.id}`}>
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
                <Link href={`/diploma/${certificate.id}`} target="_blank">
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
      </CardContent>
    </Card>
  )
}
