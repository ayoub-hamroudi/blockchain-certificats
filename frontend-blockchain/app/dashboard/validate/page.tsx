"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CertificateStatusBadge } from "@/components/certificate-status-badge"
import { CertificateWorkflow } from "@/components/certificate-workflow"
import { mockCertificates } from "@/lib/mock-data"
import {
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Search,
} from "lucide-react"

type ValidationState = "idle" | "loading" | "success"

export default function ValidateCertificatePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null)
  const [validationState, setValidationState] = useState<ValidationState>("idle")
  const [validatedTxHash, setValidatedTxHash] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Filter certificates that are signed (ready for validation)
  const signedCertificates = useMemo(() => {
    return mockCertificates.filter((cert) => {
      const matchesSearch =
        cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.id.toLowerCase().includes(searchQuery.toLowerCase())
      return cert.status === "signed" && matchesSearch
    })
  }, [searchQuery])

  const selectedCertificate = mockCertificates.find((c) => c.id === selectedCertId)

  const handleValidate = async () => {
    if (!selectedCertId) return

    setValidationState("loading")
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockTxHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`

    setValidatedTxHash(mockTxHash)
    setValidationState("success")
  }

  const copyTxHash = () => {
    if (validatedTxHash) {
      navigator.clipboard.writeText(validatedTxHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const resetValidation = () => {
    setSelectedCertId(null)
    setValidationState("idle")
    setValidatedTxHash(null)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <div>
              <CardTitle>Validate Certificate</CardTitle>
              <CardDescription>
                Finalize signed certificates to complete the validation process
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {validationState === "success" ? (
            <div className="space-y-6">
              <Alert className="border-success/20 bg-success/5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertTitle className="text-success">Certificate Validated Successfully</AlertTitle>
                <AlertDescription>
                  The certificate has been validated and is now fully verified on the blockchain.
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="mb-2 text-sm text-muted-foreground">Validation Transaction Hash</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded bg-muted px-2 py-1 text-sm">
                    {validatedTxHash}
                  </code>
                  <Button variant="ghost" size="icon" onClick={copyTxHash}>
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={`https://etherscan.io/tx/${validatedTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Show updated workflow */}
              <div className="rounded-lg border p-4">
                <p className="mb-4 text-sm font-medium">Certificate Status Updated</p>
                <CertificateWorkflow status="validated" />
              </div>

              <Button onClick={resetValidation} className="w-full">
                Validate Another Certificate
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search certificates by ID or student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Pending Validation List */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Certificates Pending Validation ({signedCertificates.length})
                </p>
                {signedCertificates.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">No certificates pending validation</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {signedCertificates.map((cert) => (
                      <div
                        key={cert.id}
                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                          selectedCertId === cert.id
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedCertId(cert.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{cert.studentName}</p>
                            <p className="text-sm text-muted-foreground">
                              {cert.id} - {cert.diplomaTitle}
                            </p>
                          </div>
                          <CertificateStatusBadge status={cert.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Certificate Details */}
              {selectedCertificate && (
                <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                  <p className="font-medium">Selected Certificate</p>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono">{selectedCertificate.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Student:</span>
                      <span>{selectedCertificate.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Diploma:</span>
                      <span>{selectedCertificate.diplomaTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Signed By:</span>
                      <span className="font-mono text-xs">{selectedCertificate.signedBy}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="mb-3 text-sm text-muted-foreground">Current Progress</p>
                    <CertificateWorkflow status={selectedCertificate.status} />
                  </div>
                </div>
              )}

              {/* Validate Button */}
              <Button
                onClick={handleValidate}
                disabled={!selectedCertId || validationState === "loading"}
                className="w-full"
              >
                {validationState === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating on Blockchain...
                  </>
                ) : (
                  "Validate Certificate"
                )}
              </Button>

              {validationState === "loading" && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertTitle>Transaction Pending</AlertTitle>
                  <AlertDescription>
                    Please wait while the certificate is being validated on the blockchain...
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
