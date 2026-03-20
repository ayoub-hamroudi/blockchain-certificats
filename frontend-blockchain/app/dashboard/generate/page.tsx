"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle2, Copy, Check, ExternalLink, FileCheck } from "lucide-react"

type FormState = "idle" | "loading" | "success" | "error"

export default function GenerateCertificatePage() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [generatedTxHash, setGeneratedTxHash] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    certificateId: "",
    studentName: "",
    studentAddress: "",
    diplomaTitle: "",
    mention: "",
    issueDate: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState("loading")

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate mock transaction hash
    const mockTxHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`

    setGeneratedTxHash(mockTxHash)
    setFormState("success")
  }

  const copyTxHash = () => {
    if (generatedTxHash) {
      navigator.clipboard.writeText(generatedTxHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const resetForm = () => {
    setFormState("idle")
    setGeneratedTxHash(null)
    setFormData({
      certificateId: "",
      studentName: "",
      studentAddress: "",
      diplomaTitle: "",
      mention: "",
      issueDate: "",
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Generate Certificate</CardTitle>
              <CardDescription>
                Create a new academic certificate on the blockchain
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {formState === "success" ? (
            <div className="space-y-6">
              <Alert className="border-success/20 bg-success/5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertTitle className="text-success">Certificate Generated Successfully</AlertTitle>
                <AlertDescription>
                  The certificate has been recorded on the blockchain and is now pending signature.
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="mb-2 text-sm text-muted-foreground">Transaction Hash</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded bg-muted px-2 py-1 text-sm">
                    {generatedTxHash}
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
                      href={`https://etherscan.io/tx/${generatedTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={resetForm} className="flex-1">
                  Generate Another Certificate
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="certificateId">Certificate ID</Label>
                  <Input
                    id="certificateId"
                    placeholder="CERT-2024-007"
                    value={formData.certificateId}
                    onChange={(e) =>
                      setFormData({ ...formData, certificateId: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, issueDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  placeholder="John Doe"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentAddress">Student Wallet Address</Label>
                <Input
                  id="studentAddress"
                  placeholder="0x..."
                  value={formData.studentAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, studentAddress: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diplomaTitle">Diploma Title</Label>
                <Input
                  id="diplomaTitle"
                  placeholder="Master en Informatique"
                  value={formData.diplomaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, diplomaTitle: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mention">Mention</Label>
                <Select
                  value={formData.mention}
                  onValueChange={(value) =>
                    setFormData({ ...formData, mention: value })
                  }
                  required
                >
                  <SelectTrigger id="mention">
                    <SelectValue placeholder="Select mention" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Passable">Passable</SelectItem>
                    <SelectItem value="Assez Bien">Assez Bien</SelectItem>
                    <SelectItem value="Bien">Bien</SelectItem>
                    <SelectItem value="Très Bien">Très Bien</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={formState === "loading"}>
                {formState === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating on Blockchain...
                  </>
                ) : (
                  "Generate on Blockchain"
                )}
              </Button>

              {formState === "loading" && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertTitle>Transaction Pending</AlertTitle>
                  <AlertDescription>
                    Please wait while the certificate is being recorded on the blockchain...
                  </AlertDescription>
                </Alert>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
