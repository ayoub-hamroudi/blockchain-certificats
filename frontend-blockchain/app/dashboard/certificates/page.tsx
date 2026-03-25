"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CertificateStatusBadge } from "@/components/certificate-status-badge"
import { Search, Eye } from "lucide-react"
import { apiFetch, getStoredToken } from "@/lib/api"

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
  signedBy?: string
}

function mapCertificateStatus(cert: ApiCertificate): CertificateStatus {
  if (cert.validated) return "validated"
  if (cert.teacherSigned) return "signed"
  return "generated"
}

export default function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<CertificateStatus | "all">("all")
  const [certificates, setCertificates] = useState<UiCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setLoading(true)
        setPageError("")

        const token = getStoredToken()
        if (!token) {
          throw new Error("Authentication token not found")
        }

        const response = await apiFetch(
          "/api/certificates",
          { method: "GET" },
          token
        )

        const mapped: UiCertificate[] = (response.data || []).map((cert: ApiCertificate) => ({
          id: cert.id,
          studentName: cert.studentName,
          studentAddress: cert.studentAddress,
          diplomaTitle: cert.diplomaTitle,
          mention: cert.mention,
          issueDate: cert.issueDate,
          status: mapCertificateStatus(cert),
          signedBy: cert.signedByTeacher,
        }))

        setCertificates(mapped)
      } catch (error) {
        setPageError(error instanceof Error ? error.message : "Failed to load certificates")
      } finally {
        setLoading(false)
      }
    }

    loadCertificates()
  }, [])

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesSearch =
        cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.diplomaTitle.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || cert.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [certificates, searchQuery, statusFilter])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          {pageError && (
            <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {pageError}
            </div>
          )}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, name, or diploma..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as CertificateStatus | "all")}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="generated">Generated</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="hidden md:table-cell">Diploma Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Mention</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      Loading certificates...
                    </TableCell>
                  </TableRow>
                ) : filteredCertificates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No certificates found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCertificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-mono text-sm">{cert.id}</TableCell>
                      <TableCell className="font-medium">{cert.studentName}</TableCell>
                      <TableCell className="hidden md:table-cell">{cert.diplomaTitle}</TableCell>
                      <TableCell className="hidden sm:table-cell">{cert.mention}</TableCell>
                      <TableCell>
                        <CertificateStatusBadge status={cert.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/certificates/${cert.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredCertificates.length} of {certificates.length} certificates
          </div>
        </CardContent>
      </Card>
    </div>
  )
}