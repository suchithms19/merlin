"use client"

import { DeploymentHero } from "@/components/deployment-hero"
import { DeploymentForm } from "@/components/deployment-form"
import { Leva } from "leva"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === "/") {
      setShowForm(false)
    }
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {!showForm ? (
        <DeploymentHero onStartDeploy={() => setShowForm(true)} />
      ) : (
        <DeploymentForm />
      )}
      <Leva hidden />
    </div>
  )
}
