"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileCheck, PenTool, Shield, UserPlus, ExternalLink } from "lucide-react"
import type { Activity } from "@/lib/mock-data"

interface ActivityFeedProps {
  activities: Activity[]
}

const activityIcons = {
  generate: FileCheck,
  sign: PenTool,
  validate: Shield,
  add_user: UserPlus,
}

const activityColors = {
  generate: "bg-primary/10 text-primary",
  sign: "bg-chart-3/10 text-chart-3",
  validate: "bg-success/10 text-success",
  add_user: "bg-accent/10 text-accent",
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  if (diffMins > 0) return `${diffMins}m ago`
  return "Just now"
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type]
            const colorClass = activityColors[activity.type]
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{activity.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                    {activity.txHash && (
                      <>
                        <Badge variant="outline" className="font-mono text-xs">
                          tx: {activity.txHash.slice(0, 10)}...
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 gap-1 px-1.5 text-xs text-primary hover:text-primary"
                          asChild
                        >
                          <a
                            href={`https://etherscan.io/tx/${activity.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on Etherscan
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
