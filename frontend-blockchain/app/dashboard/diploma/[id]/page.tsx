"use client"

import { use } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { mockCertificates } from "@/lib/mock-data"
import { notFound } from "next/navigation"

interface DashboardDiplomaPageProps {
  params: Promise<{ id: string }>
}

export default function DashboardDiplomaPage({ params }: DashboardDiplomaPageProps) {
  const { id } = use(params)
  const certificate = mockCertificates.find((c) => c.id === id)

  if (!certificate) {
    notFound()
  }

  if (certificate.status !== "validated") {
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
          <h2 className="mb-2 text-xl font-semibold">Certificate Not Yet Validated</h2>
          <p className="mb-6 text-muted-foreground">
            This certificate is still being processed. The official diploma will be available once it has been fully validated on the blockchain.
          </p>
          <Button asChild>
            <Link href="/dashboard/my-certificates">View My Certificates</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
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
          <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* A4 Diploma Card */}
      <div className="mx-auto max-w-[210mm] print:max-w-none">
        <Card className="aspect-[210/297] overflow-hidden bg-background shadow-2xl print:shadow-none">
          {/* Elegant Gold Border */}
          <div className="relative h-full p-4">
            {/* Outer decorative border */}
            <div className="absolute inset-3 rounded-sm border-[3px] border-amber-600/40" />
            <div className="absolute inset-4 rounded-sm border border-amber-600/20" />
            <div className="absolute inset-5 rounded-sm border border-amber-600/10" />
            
            {/* Inner content border */}
            <div className="absolute inset-8 rounded-sm border border-muted-foreground/10" />

            {/* Certificate Content */}
            <div className="relative flex h-full flex-col px-8 py-6">
              {/* University Header */}
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

              {/* Title Section */}
              <div className="mt-4 text-center">
                <h2 className="font-serif text-xl font-semibold uppercase tracking-[0.15em] text-amber-700">
                  Academic Certificate
                </h2>
              </div>

              {/* Certification Statement */}
              <div className="mt-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  This is to certify that
                </p>
              </div>

              {/* Student Name */}
              <div className="mt-3 text-center">
                <h2 className="font-serif text-4xl font-bold text-foreground">
                  {certificate.studentName}
                </h2>
                <div className="mx-auto mt-2 h-px w-64 bg-muted-foreground/20" />
              </div>

              {/* Certificate Statement */}
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  has successfully completed all requirements and is hereby awarded the degree of
                </p>
              </div>

              {/* Diploma Title */}
              <div className="mt-3 text-center">
                <h3 className="font-serif text-2xl font-semibold text-foreground">
                  {certificate.diplomaTitle}
                </h3>
              </div>

              {/* Mention Badge */}
              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-2">
                  <span className="text-sm font-medium text-amber-800">
                    With Distinction: {certificate.mention}
                  </span>
                </div>
              </div>

              {/* Issue Date */}
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Awarded on{" "}
                  <span className="font-medium text-foreground">
                    {new Date(certificate.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Signatures Section */}
              <div className="mt-auto grid grid-cols-2 gap-12 px-8">
                {/* Teacher Signature */}
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
                      {certificate.signedBy || "Authorized Teacher"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Academic Supervisor
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {certificate.signedAt && new Date(certificate.signedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Admin Signature */}
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
                      {certificate.validatedBy || "University Administrator"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Registrar
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {certificate.validatedAt && new Date(certificate.validatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificate ID & QR Code Section */}
              <div className="mt-6 flex items-end justify-between border-t border-muted-foreground/10 pt-4">
                {/* Certificate Details */}
                <div className="space-y-1">
                  <p className="font-mono text-xs text-muted-foreground">
                    Certificate ID: <span className="text-foreground">{certificate.id}</span>
                  </p>
                  {certificate.txHash && (
                    <p className="font-mono text-xs text-muted-foreground">
                      TX: {certificate.txHash.slice(0, 20)}...
                    </p>
                  )}
                </div>

                {/* QR Code Placeholder */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-16 w-16 items-center justify-center rounded border border-muted-foreground/20 bg-muted/50">
                    <svg viewBox="0 0 64 64" className="h-12 w-12">
                      <rect x="4" y="4" width="16" height="16" fill="currentColor" className="text-foreground" />
                      <rect x="6" y="6" width="12" height="12" fill="currentColor" className="text-background" />
                      <rect x="8" y="8" width="8" height="8" fill="currentColor" className="text-foreground" />
                      
                      <rect x="44" y="4" width="16" height="16" fill="currentColor" className="text-foreground" />
                      <rect x="46" y="6" width="12" height="12" fill="currentColor" className="text-background" />
                      <rect x="48" y="8" width="8" height="8" fill="currentColor" className="text-foreground" />
                      
                      <rect x="4" y="44" width="16" height="16" fill="currentColor" className="text-foreground" />
                      <rect x="6" y="46" width="12" height="12" fill="currentColor" className="text-background" />
                      <rect x="8" y="48" width="8" height="8" fill="currentColor" className="text-foreground" />
                      
                      <rect x="24" y="4" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="32" y="8" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="24" y="16" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="24" y="24" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="32" y="24" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="4" y="28" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="16" y="28" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="44" y="28" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="56" y="28" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="28" y="36" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="44" y="44" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="52" y="48" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="44" y="56" width="4" height="4" fill="currentColor" className="text-foreground" />
                      <rect x="56" y="56" width="4" height="4" fill="currentColor" className="text-foreground" />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground">Scan to Verify</p>
                </div>

                {/* Blockchain Verified Badge */}
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

      {/* Blockchain Info Footer - Hidden on Print */}
      <div className="mx-auto max-w-[210mm] print:hidden">
        <Card className="bg-muted/30">
          <div className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Certificate ID</p>
                <p className="font-mono font-medium">{certificate.id}</p>
              </div>
              <div className="hidden h-8 w-px bg-border sm:block" />
              <div>
                <p className="text-xs text-muted-foreground">Transaction Hash</p>
                <p className="font-mono text-xs">
                  {certificate.txHash?.slice(0, 16)}...{certificate.txHash?.slice(-8)}
                </p>
              </div>
            </div>
            {certificate.txHash && (
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a
                  href={`https://etherscan.io/tx/${certificate.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Etherscan
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Verification URL */}
      <div className="mx-auto max-w-[210mm] text-center print:hidden">
        <p className="text-sm text-muted-foreground">
          Verify this certificate at{" "}
          <Link href={`/verify`} className="font-mono text-primary hover:underline">
            certchain.app/verify/{certificate.id}
          </Link>
        </p>
      </div>

      {/* Print Styles */}
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
