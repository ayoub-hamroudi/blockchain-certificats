"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  FileCheck,
  PenTool,
  Shield,
  Search,
  ArrowRight,
  GraduationCap,
  Blocks,
  CheckCircle2,
} from "lucide-react"
import { WalletConnectModal } from "@/components/wallet-connect-modal"

export default function LandingPage() {
  const [showWalletModal, setShowWalletModal] = useState(false)

  const steps = [
    {
      icon: FileCheck,
      title: "Generate",
      description: "Admin creates certificate on blockchain with student details",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: PenTool,
      title: "Sign",
      description: "Authorized teacher digitally signs the certificate",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Shield,
      title: "Validate",
      description: "Admin validates and finalizes the certificate",
      color: "bg-success/10 text-success",
    },
    {
      icon: Search,
      title: "Verify",
      description: "Anyone can verify certificate authenticity",
      color: "bg-chart-3/10 text-chart-3",
    },
  ]

  const features = [
    {
      title: "Immutable Records",
      description: "All certificates are permanently stored on the Ethereum blockchain, ensuring tamper-proof academic records.",
    },
    {
      title: "Transparent Verification",
      description: "Anyone can independently verify the authenticity of any certificate using blockchain technology.",
    },
    {
      title: "Multi-Party Workflow",
      description: "Secure generation, signing, and validation process involving multiple authorized parties.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">CertChain</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#workflow" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              How it Works
            </Link>
            <Link href="/verify" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Verify Certificate
            </Link>
          </nav>
          <Button onClick={() => setShowWalletModal(true)}>
            Connect Wallet
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-secondary/50 px-4 py-1.5 text-sm">
              <Blocks className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Powered by Ethereum Smart Contracts</span>
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Blockchain Academic Certificate System
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground">
              Secure, transparent, and immutable academic credential management. Generate, sign, validate, and verify diplomas with blockchain technology.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={() => setShowWalletModal(true)} className="gap-2">
                Connect Wallet
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/verify">Verify Certificate</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Certificate Lifecycle</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              A transparent, multi-step process ensuring the authenticity and integrity of every academic credential.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={step.title} className="relative overflow-hidden border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${step.color}`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-bold text-muted-foreground/30">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 lg:block">
                    <ArrowRight className="h-5 w-5 text-border" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Why Blockchain Certificates?</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Traditional paper certificates are vulnerable to fraud and difficult to verify. Our blockchain solution solves these problems.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
            Connect your wallet to access the platform based on your role. Administrators, teachers, and students each have dedicated dashboards.
          </p>
          <Button size="lg" onClick={() => setShowWalletModal(true)} className="gap-2">
            Connect Wallet
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">CertChain</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Academic Certificate Management System - Master Project 2024
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/verify" className="hover:text-foreground">Verify</Link>
              <Link href="#features" className="hover:text-foreground">Features</Link>
            </div>
          </div>
        </div>
      </footer>

      <WalletConnectModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </div>
  )
}
