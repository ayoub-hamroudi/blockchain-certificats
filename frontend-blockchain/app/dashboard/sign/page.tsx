"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PenTool, FileText, Loader2, CheckCircle2, ExternalLink } from "lucide-react"
import { mockCertificates, type Certificate } from "@/lib/mock-data"
import { CertificateStatusBadge } from "@/components/certificate-status-badge"

export default function SignCertificatesPage() {
  const [certificates, setCertificates] = useState(
    mockCertificates.filter((c) => c.status === "generated")
  )
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const [isSigning, setIsSigning] = useState(false)
  const [signSuccess, setSignSuccess] = useState(false)

  const handleSign = async () => {
    if (!selectedCert) return
    
    setIsSigning(true)
    
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Update local state
    setCertificates((prev) =>
      prev.filter((c) => c.id !== selectedCert.id)
    )
    
    setIsSigning(false)
    setSignSuccess(true)
  }

  const handleCloseDialog = () => {
    setSelectedCert(null)
    setSignSuccess(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pending Signatures</h1>
        <p className="text-muted-foreground">
          Review and sign certificates awaiting your digital signature
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Certificates Awaiting Signature
          </CardTitle>
          <CardDescription>
            {certificates.length} certificate{certificates.length !== 1 ? "s" : ""} pending your signature
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-lg font-medium">All Caught Up!</h3>
              <p className="text-sm text-muted-foreground">
                There are no certificates waiting for your signature.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Diploma</TableHead>
                  <TableHead>Mention</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-mono text-sm">{cert.id}</TableCell>
                    <TableCell className="font-medium">{cert.studentName}</TableCell>
                    <TableCell>{cert.diplomaTitle}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{cert.mention}</Badge>
                    </TableCell>
                    <TableCell>{new Date(cert.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => setSelectedCert(cert)}
                        className="gap-1"
                      >
                        <PenTool className="h-3 w-3" />
                        Sign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedCert} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-lg">
          {signSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  Certificate Signed Successfully
                </DialogTitle>
                <DialogDescription>
                  The certificate has been digitally signed and recorded on the blockchain.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate ID:</span>
                    <span className="font-mono">{selectedCert?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student:</span>
                    <span>{selectedCert?.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction:</span>
                    <span className="font-mono text-primary">0xsign...abc</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCloseDialog}>Done</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sign Certificate
                </DialogTitle>
                <DialogDescription>
                  Review the certificate details before signing. This action will be recorded on the blockchain.
                </DialogDescription>
              </DialogHeader>
              {selectedCert && (
                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Certificate ID:</span>
                        <span className="font-mono">{selectedCert.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Student Name:</span>
                        <span className="font-medium">{selectedCert.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Diploma:</span>
                        <span>{selectedCert.diplomaTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mention:</span>
                        <Badge variant="secondary">{selectedCert.mention}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Issue Date:</span>
                        <span>{new Date(selectedCert.issueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <CertificateStatusBadge status={selectedCert.status} />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-warning/50 bg-warning/10 p-3">
                    <p className="text-sm text-warning-foreground">
                      By signing this certificate, you confirm that the student has successfully completed the requirements for this diploma.
                    </p>
                  </div>
                </div>
              )}
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={handleCloseDialog} disabled={isSigning}>
                  Cancel
                </Button>
                <Button onClick={handleSign} disabled={isSigning} className="gap-2">
                  {isSigning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing...
                    </>
                  ) : (
                    <>
                      <PenTool className="h-4 w-4" />
                      Sign Certificate
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
