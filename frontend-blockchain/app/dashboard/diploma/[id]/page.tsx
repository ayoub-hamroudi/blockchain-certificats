"use client"

import { use, useEffect, useRef, useState } from "react"
import Link from "next/link"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  GraduationCap,
  ArrowLeft,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  Printer,
  Clock,
  Loader2,
} from "lucide-react"
import { apiFetch, getStoredToken, getStoredWalletAddress } from "@/lib/api"
import { notFound } from "next/navigation"

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

interface DashboardDiplomaPageProps {
  params: Promise<{ id: string }>
}

export default function DashboardDiplomaPage({
  params,
}: DashboardDiplomaPageProps) {
  const { id } = use(params)

  const diplomaRef = useRef<HTMLDivElement | null>(null)

  const [certificate, setCertificate] = useState<ApiCertificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [pageError, setPageError] = useState("")

  useEffect(() => {
    const loadDiploma = async () => {
      try {
        setLoading(true)
        setPageError("")

        const token = getStoredToken()
        const walletAddress = getStoredWalletAddress()

        if (!token) {
          throw new Error("Authentication token not found")
        }

        if (!walletAddress) {
          throw new Error("Wallet address not found")
        }

        const response = await apiFetch("/api/certificates", { method: "GET" }, token)

        const found = (response.data || []).find(
          (c: ApiCertificate) =>
            c.id === id &&
            c.studentAddress?.toLowerCase() === walletAddress.toLowerCase()
        )

        if (!found) {
          setCertificate(null)
          return
        }

        setCertificate(found)
      } catch (error) {
        setPageError(
          error instanceof Error ? error.message : "Failed to load diploma"
        )
      } finally {
        setLoading(false)
      }
    }

    loadDiploma()
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = async () => {
    if (!diplomaRef.current || !certificate) return

    try {
      setDownloading(true)

      const element = diplomaRef.current

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = 210
      const pdfHeight = 297

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${certificate.id}-diploma.pdf`)
    } catch (error) {
      console.error("PDF generation error:", error)
      alert("Failed to generate PDF")
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading diploma...
      </div>
    )
  }

  if (pageError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {pageError}
      </div>
    )
  }

  if (!certificate) {
    notFound()
  }

  if (!certificate.validated) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link href="/dashboard/my-certificates">
            <ArrowLeft className="h-4 w-4" />
            Back to My Certificates
          </Link>
        </Button>

        <Card className="mx-auto max-w-md p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-chart-3/10">
            <Clock className="h-6 w-6 text-chart-3" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">
            Certificate Not Yet Validated
          </h2>
          <p className="mb-6 text-muted-foreground">
            This certificate is still being processed. The official diploma will
            be available once it has been fully validated on the blockchain.
          </p>
          <Button asChild>
            <Link href="/dashboard/my-certificates">View My Certificates</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link href="/dashboard/my-certificates">
            <ArrowLeft className="h-4 w-4" />
            Back to My Certificates
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleDownloadPdf}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>

          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-[210mm] print:max-w-none">
        <div ref={diplomaRef}>
          <Card className="aspect-[210/297] overflow-hidden bg-background shadow-2xl print:shadow-none">
            <div className="relative h-full bg-white p-4">
              <div className="absolute inset-3 rounded-sm border-[3px] border-amber-600/40" />
              <div className="absolute inset-4 rounded-sm border border-amber-600/20" />
              <div className="absolute inset-5 rounded-sm border border-amber-600/10" />
              <div className="absolute inset-8 rounded-sm border border-muted-foreground/10" />

              <div className="relative flex h-full flex-col px-8 py-6">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-600/30 bg-gradient-to-br from-amber-50 to-amber-100">
                    <GraduationCap className="h-10 w-10 text-amber-700" />
                  </div>

                  <h1 className="font-serif text-2xl font-bold uppercase tracking-[0.2em] text-foreground">
                    University of Excellence
                  </h1>

                  <p className="mt-1 text-sm tracking-widest text-muted-foreground">
                    ESTABLISHED 1850
                  </p>

                  <div className="mx-auto mt-3 h-px w-48 bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
                </div>

                <div className="mt-4 text-center">
                  <h2 className="font-serif text-xl font-semibold uppercase tracking-[0.15em] text-amber-700">
                    Academic Certificate
                  </h2>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    This is to certify that
                  </p>
                </div>

                <div className="mt-3 text-center">
                  <h2 className="font-serif text-4xl font-bold text-foreground">
                    {certificate.studentName}
                  </h2>
                  <div className="mx-auto mt-2 h-px w-64 bg-muted-foreground/20" />
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    has successfully completed all requirements and is hereby
                    awarded the degree of
                  </p>
                </div>

                <div className="mt-3 text-center">
                  <h3 className="font-serif text-2xl font-semibold text-foreground">
                    {certificate.diplomaTitle}
                  </h3>
                </div>

                <div className="mt-4 flex justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-2">
                    <span className="text-sm font-medium text-amber-800">
                      With Distinction: {certificate.mention}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Awarded on{" "}
                    <span className="font-medium text-foreground">
                      {new Date(certificate.issueDate * 1000).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </p>
                </div>

                <div className="flex-1" />

                <div className="mt-auto grid grid-cols-2 gap-12 px-8">
                  <div className="text-center">
                    <div className="mx-auto mb-2 h-12 w-32">
                      <svg viewBox="0 0 128 48" className="h-full w-full text-foreground/70">
                        <path
                          d="M10 35 Q30 10, 50 25 T90 20 Q100 18, 118 30"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="border-t border-foreground/20 pt-2">
                      <p className="text-xs font-medium text-foreground">
                        {certificate.signedByTeacher || "Authorized Teacher"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Academic Supervisor
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-2 h-12 w-32">
                      <svg viewBox="0 0 128 48" className="h-full w-full text-foreground/70">
                        <path
                          d="M15 30 Q35 15, 55 28 Q75 40, 95 25 L115 28"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="border-t border-foreground/20 pt-2">
                      <p className="text-xs font-medium text-foreground">
                        University Administrator
                      </p>
                      <p className="text-xs text-muted-foreground">Registrar</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between border-t border-muted-foreground/10 pt-4">
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-muted-foreground">
                      Certificate ID: <span className="text-foreground">{certificate.id}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-16 w-16 items-center justify-center rounded border border-muted-foreground/20 bg-muted/50">
                      <svg viewBox="0 0 64 64" className="h-12 w-12">
                        <rect
                          x="4"
                          y="4"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="text-foreground"
                        />
                        <rect
                          x="44"
                          y="4"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="text-foreground"
                        />
                        <rect
                          x="4"
                          y="44"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="text-foreground"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-muted-foreground">Scan to Verify</p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 px-3 py-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">
                      Blockchain Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mx-auto max-w-[210mm] print:hidden">
        <Card className="bg-muted/30">
          <div className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Certificate ID</p>
                <p className="font-mono font-medium">{certificate.id}</p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href="/verify">
                View Verification
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      <div className="mx-auto max-w-[210mm] text-center print:hidden">
        <p className="text-sm text-muted-foreground">
          Verify this certificate at{" "}
          <Link href="/verify" className="font-mono text-primary hover:underline">
            certchain.app/verify/{certificate.id}
          </Link>
        </p>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}