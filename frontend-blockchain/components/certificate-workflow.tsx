"use client"

import { Check, FileCheck, PenTool, Shield } from "lucide-react"
import type { CertificateStatus } from "@/lib/mock-data"

interface CertificateWorkflowProps {
  status: CertificateStatus
}

const steps = [
  { key: "generated", label: "Generated", icon: FileCheck },
  { key: "signed", label: "Signed", icon: PenTool },
  { key: "validated", label: "Validated", icon: Shield },
]

export function CertificateWorkflow({ status }: CertificateWorkflowProps) {
  const currentStepIndex = steps.findIndex((step) => step.key === status)

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index <= currentStepIndex
        const isCurrent = index === currentStepIndex
        const Icon = step.icon

        return (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? "border-success bg-success text-success-foreground"
                    : "border-muted bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted && index < currentStepIndex ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${
                  index < currentStepIndex ? "bg-success" : "bg-muted"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
