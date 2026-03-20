"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import {
  Search,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  FileText,
  Shield,
  ArrowLeft,
  AlertCircle,
} from "lucide-react"
import { mockCertificates, type Certificate } from "@/lib/mock-data"
import { CertificateStatusBadge } from "@/components/certificate-status-badge"
import { CertificateWorkflow } from "@/components/certificate-workflow"

type VerificationResult = {
  found: boolean
  certificate?: Certificate
  message: string
  error?: "not_found" | "name_mismatch"
}

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("")
  const [studentName, setStudentName] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)

  const handleVerify = async () => {
    if (!certificateId.trim()) return
    
    setIsVerifying(true)
    setResult(null)
    
    // Simulate blockchain verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Search for certificate by ID
    const certificate = mockCertificates.find(
      (c) => c.id.toLowerCase() === certificateId.trim().toLowerCase()
    )
    
    if (!certificate) {
      setResult({
        found: false,
        message: "No certificate found with this ID. Please check and try again.",
        error: "not_found",
      })
    } else if (studentName.trim() && 
               certificate.studentName.toLowerCase() !== studentName.trim().toLowerCase()) {
      // If student name was provided but doesn't match
      setResult({
        found: false,
        message: "The student name does not match the certificate records. Please verify the information and try again.",
        error: "name_mismatch",
      })
    } else {
      setResult({
        found: true,
        certificate,
        message: certificate.status === "validated" 
          ? "Certificate verified successfully on the blockchain."
          : "Certificate found but not yet fully validated.",
      })
    }
    
    setIsVerifying(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">CertChain</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-balance">Verify Certificate</h1>
            <p className="text-muted-foreground text-pretty">
              Enter a certificate ID and optionally the student name to verify authenticity on the Ethereum blockchain.
            </p>
          </div>

          {/* Search Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5" />
                Certificate Verification
              </CardTitle>
              <CardDescription>
                Enter the certificate ID and student name to check validity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="cert-id">Certificate ID *</FieldLabel>
                  <Input
                    id="cert-id"
                    placeholder="e.g., CERT-2024-001"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="student-name">Student Name (optional)</FieldLabel>
                  <Input
                    id="student-name"
                    placeholder="e.g., Alice Martin"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Adding student name provides additional verification
                  </p>
                </Field>
                <Button 
                  onClick={handleVerify} 
                  disabled={isVerifying || !certificateId.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying on Blockchain...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verify Certificate
                    </>
                  )}
                </Button>
              </FieldGroup>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                Try: CERT-2024-001 (Alice Martin), CERT-2024-002 (Bob Dupont), CERT-2024-003 (Claire Bernard)
              </p>
            </CardContent>
          </Card>

          {/* Result */}
          {result && (
            <Card className={result.found ? "border-emerald-500/50 bg-emerald-50/30" : "border-destructive/50 bg-destructive/5"}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${result.found ? "text-emerald-600" : "text-destructive"}`}>
                  {result.found ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Certificate Verified
                    </>
                  ) : (
                    <>
                      {result.error === "name_mismatch" ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      Verification Failed
                    </>
                  )}
                </CardTitle>
                <CardDescription className={result.found ? "text-emerald-600/80" : "text-destructive/80"}>
                  {result.message}
                </CardDescription>
              </CardHeader>
              {result.certificate && (
                <CardContent className="space-y-6">
                  {/* Certificate Details */}
                  <div className="rounded-lg border bg-background p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold">Certificate Details</h3>
                      <CertificateStatusBadge status={result.certificate.status} />
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Certificate ID:</span>
                        <span className="font-mono font-medium">{result.certificate.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Student Name:</span>
                        <span className="font-semibold text-foreground">{result.certificate.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Diploma Title:</span>
                        <span className="text-foreground">{result.certificate.diplomaTitle}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Mention:</span>
                        <Badge variant="secondary" className="font-medium">{result.certificate.mention}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Issue Date:</span>
                        <span className="text-foreground">
                          {new Date(result.certificate.issueDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status:</span>
                        <CertificateStatusBadge status={result.certificate.status} />
                      </div>
                    </div>
                  </div>

                  {/* Workflow */}
                  <div>
                    <h3 className="mb-3 font-semibold">Certification Workflow</h3>
                    <CertificateWorkflow status={result.certificate.status} />
                  </div>

                  {/* Blockchain Info */}
                  {result.certificate.txHash && (
                    <div className="rounded-lg border bg-background p-4">
                      <h3 className="mb-3 font-semibold">Blockchain Record</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground block mb-1">Transaction Hash:</span>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-xs break-all">
                              {result.certificate.txHash}
                            </code>
                            <Button variant="outline" size="sm" className="shrink-0 gap-1" asChild>
                              <a
                                href={`https://etherscan.io/tx/${result.certificate.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View on Etherscan
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        {result.certificate.signedBy && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Signed By:</span>
                            <span className="font-mono text-xs">{result.certificate.signedBy}</span>
                          </div>
                        )}
                        {result.certificate.signedAt && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Signed At:</span>
                            <span>{new Date(result.certificate.signedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        {result.certificate.validatedBy && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Validated By:</span>
                            <span className="font-mono text-xs">{result.certificate.validatedBy}</span>
                          </div>
                        )}
                        {result.certificate.validatedAt && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Validated At:</span>
                            <span>{new Date(result.certificate.validatedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {result.certificate.status === "validated" && (
                    <Button className="w-full gap-2" size="lg" asChild>
                      <Link href={`/diploma/${result.certificate.id}`}>
                        <FileText className="h-4 w-4" />
                        View Official Diploma
                      </Link>
                    </Button>
                  )}
                </CardContent>
              )}

              {/* Error state without certificate */}
              {!result.found && !result.certificate && (
                <CardContent>
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
                    <XCircle className="mx-auto h-10 w-10 text-destructive/60 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {result.error === "not_found" 
                        ? "The certificate ID you entered was not found in our blockchain records. Please double-check the ID and try again."
                        : "The information provided does not match our records. Please verify and try again."}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Info */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p className="text-pretty">
              All certificates are stored on the Ethereum blockchain, ensuring tamper-proof
              verification of academic credentials.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
