"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, PenTool, CheckCircle2, Clock } from "lucide-react"

interface StatsCardsProps {
  total: number
  signed: number
  validated: number
  pending: number
}

export function StatsCards({ total, signed, validated, pending }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Certificates",
      value: total,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Signed",
      value: signed,
      icon: PenTool,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Validated",
      value: validated,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
