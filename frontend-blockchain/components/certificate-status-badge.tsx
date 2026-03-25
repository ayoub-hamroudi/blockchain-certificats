"use client"

import { Badge } from "@/components/ui/badge"
import type { CertificateStatus } from "@/lib/mock-data"

interface CertificateStatusBadgeProps {
  status: CertificateStatus
}

const statusConfig: Record<CertificateStatus, { label: string; className: string }> = {
  generated: {
    label: "Generated",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  signed: {
    label: "Signed",
    className: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
  validated: {
    label: "Validated",
    className: "bg-success/10 text-success border-success/20",
  },
}

export function CertificateStatusBadge({ status }: CertificateStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
