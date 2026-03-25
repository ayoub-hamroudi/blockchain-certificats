"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CertificateStatusBadge } from "@/components/certificate-status-badge"
import { CertificateWorkflow } from "@/components/certificate-workflow"
import { mockCertificates } from "@/lib/mock-data"
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  User,
  Calendar,
  Award,
  FileText,
  Wallet,
} from "lucide-react"

export default function CertificateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const certificate = mockCertificates.find((c) => c.id === id)

  if (!certificate) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Certificate not found</p>
        <Button variant="link" asChild>
          <Link href="/dashboard/certificates">Back to certificates</Link>
        </Button>
      </div>
    )
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      onClick={() => copyToClipboard(text, field)}
    >
      {copiedField === field ? (
        <Check className="h-3 w-3 text-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/dashboard/certificates">
          <ArrowLeft className="h-4 w-4" />
          Back to Certificates
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{certificate.id}</h1>
            <CertificateStatusBadge status={certificate.status} />
          </div>
          <p className="mt-1 text-muted-foreground">{certificate.diplomaTitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {certificate.txHash && (
            <Button variant="outline" className="gap-2" asChild>
              <a
                href={`https://etherscan.io/tx/${certificate.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                View on Etherscan
              </a>
            </Button>
          )}
          {certificate.status === "generated" && (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/sign?id=${certificate.id}`}>Sign Certificate</Link>
            </Button>
          )}
          {certificate.status === "signed" && (
            <Button asChild>
              <Link href={`/dashboard/validate?id=${certificate.id}`}>Validate Certificate</Link>
            </Button>
          )}
          {certificate.status === "validated" && (
            <Button asChild>
              <Link href={`/diploma/${certificate.id}`}>View Diploma</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Certificate Lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <CertificateWorkflow status={certificate.status} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Certificate Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Certificate Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Certificate ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-medium">{certificate.id}</p>
                  <CopyButton text={certificate.id} field="id" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p className="font-medium">{certificate.studentName}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Diploma Title</p>
                <p className="font-medium">{certificate.diplomaTitle}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Mention</p>
                <Badge variant="secondary">{certificate.mention}</Badge>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Issue Date</p>
                <p className="font-medium">{certificate.issueDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Blockchain Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Student Wallet Address</p>
                <div className="flex items-center gap-2">
                  <p className="truncate font-mono text-sm font-medium">
                    {certificate.studentAddress}
                  </p>
                  <CopyButton text={certificate.studentAddress} field="studentAddress" />
                </div>
              </div>
            </div>

            <Separator />

            {certificate.txHash && (
              <>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <p className="truncate font-mono text-sm font-medium">
                        {certificate.txHash}
                      </p>
                      <CopyButton text={certificate.txHash} field="txHash" />
                      <a
                        href={`https://etherscan.io/tx/${certificate.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {certificate.signedBy && (
              <>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Signed By</p>
                    <p className="font-mono text-sm font-medium">{certificate.signedBy}</p>
                    <p className="text-xs text-muted-foreground">{certificate.signedAt}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {certificate.validatedBy && (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                  <Check className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Validated By</p>
                  <p className="font-mono text-sm font-medium">{certificate.validatedBy}</p>
                  <p className="text-xs text-muted-foreground">{certificate.validatedAt}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
