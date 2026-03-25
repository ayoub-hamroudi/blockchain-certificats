"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  Shield,
  ArrowLeft,
  AlertCircle,
  Wallet,
} from "lucide-react"
import { apiFetch, getStoredToken, getStoredRole, getStoredWalletAddress } from "@/lib/api"

type Certificate = {
  id: string
  studentName: string
  studentAddress?: string
  diplomaTitle: string
  mention: string
  issueDate: string | number
  teacherSigned: boolean
  validated: boolean
  signedByTeacher?: string
}

type VerificationResult = {
  found: boolean
  valid?: boolean
  certificate?: Certificate
  message: string
  error?: "not_found" | "name_mismatch" | "unauthorized"
}

export default function VerifyPage() {
  const router = useRouter()
  const [certificateId, setCertificateId] = useState("")
  const [studentName, setStudentName] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setToken(getStoredToken())
    setWalletAddress(getStoredWalletAddress())
    setRole(getStoredRole())
  }, [])

  const handleVerify = async () => {
    if (!certificateId.trim() || !studentName.trim()) return

    if (!token) {
      setResult({
        found: false,
        message: "You must connect your wallet before verifying a certificate.",
        error: "unauthorized",
      })
      return
    }

    setIsVerifying(true)
    setResult(null)

    try {
      const query = new URLSearchParams({
        id: certificateId.trim(),
        name: studentName.trim(),
      })

      const response = await apiFetch(
        `/api/certificates/verify?${query.toString()}`,
        { method: "GET" },
        token
      )

      const valid = response?.valid
      const certificate = response?.data

      if (!certificate) {
        setResult({
          found: false,
          message: response?.message || "Certificate not found.",
          error: "not_found",
        })
        return
      }

      setResult({
        found: true,
        valid: Boolean(valid),
        certificate,
        message: valid
          ? "Certificate verified successfully."
          : "Certificate exists but is not fully valid yet.",
      })
    } catch (error: any) {
      const message = error?.message || "Verification failed."

      setResult({
        found: false,
        message,
        error: message.toLowerCase().includes("token") ? "unauthorized" : "not_found",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const renderIssueDate = (value: string | number) => {
    if (!value) return "-"
    const date = typeof value === "number" ? new Date(value * 1000) : new Date(value)

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">CertChain</span>
          </Link>

          <div className="flex items-center gap-3">
            {walletAddress ? (
              <div className="hidden rounded-md border px-3 py-1 text-xs text-muted-foreground md:block">
                {role || "connected"} • {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            ) : null}

            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-balance">Verify Certificate</h1>
            <p className="text-muted-foreground text-pretty">
              Connect your wallet, then enter the certificate ID and student name to verify authenticity.
            </p>
          </div>

          {!token && (
            <Card className="mb-6 border-amber-300 bg-amber-50">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <Wallet className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-800">Wallet connection required</p>
                  <p className="text-sm text-amber-700">
                    Visitors must also authenticate with a wallet before verifying a certificate.
                  </p>
                </div>
                <Button onClick={() => router.push("/")}>
                  Go to Home and Connect Wallet
                </Button>
              </CardContent>
            </Card>
          )}

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
                    placeholder="e.g., CERT004"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="student-name">Student Name *</FieldLabel>
                  <Input
                    id="student-name"
                    placeholder="e.g., Nafii Student"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  />
                </Field>

                <Button
                  onClick={handleVerify}
                  disabled={isVerifying || !certificateId.trim() || !studentName.trim() || !token}
                  className="w-full"
                  size="lg"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verify Certificate
                    </>
                  )}
                </Button>
              </FieldGroup>
            </CardContent>
          </Card>

          {result && (
            <Card
              className={
                result.found && result.valid
                  ? "border-emerald-500/50 bg-emerald-50/30"
                  : "border-destructive/50 bg-destructive/5"
              }
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    result.found && result.valid ? "text-emerald-600" : "text-destructive"
                  }`}
                >
                  {result.found && result.valid ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Valid Certificate
                    </>
                  ) : (
                    <>
                      {result.error === "unauthorized" ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      Certificate Not Valid
                    </>
                  )}
                </CardTitle>

                <CardDescription
                  className={
                    result.found && result.valid ? "text-emerald-600/80" : "text-destructive/80"
                  }
                >
                  {result.message}
                </CardDescription>
              </CardHeader>

              {result.certificate && (
                <CardContent className="space-y-6">
                  <div className="rounded-lg border bg-background p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold">Certificate Details</h3>
                      <Badge
                        className={
                          result.valid
                            ? "bg-emerald-600 hover:bg-emerald-600"
                            : "bg-red-600 hover:bg-red-600"
                        }
                      >
                        {result.valid ? "Valid Certificate" : "Not Fully Valid"}
                      </Badge>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono font-medium">{result.certificate.id}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Student Name:</span>
                        <span className="font-semibold">{result.certificate.studentName}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Diploma:</span>
                        <span>{result.certificate.diplomaTitle}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Mention:</span>
                        <Badge variant="secondary">{result.certificate.mention}</Badge>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Issue Date:</span>
                        <span>{renderIssueDate(result.certificate.issueDate)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teacher Signed:</span>
                        <span>{result.certificate.teacherSigned ? "Yes" : "No"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Validated by Direction:</span>
                        <span>{result.certificate.validated ? "Yes" : "No"}</span>
                      </div>

                      {result.certificate.signedByTeacher && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Teacher Signer:</span>
                          <span className="font-mono text-xs">
                            {result.certificate.signedByTeacher}
                          </span>
                        </div>
                      )}

                      {result.certificate.studentAddress && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Student Address:</span>
                          <span className="font-mono text-xs">
                            {result.certificate.studentAddress}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}