"use client"

import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

const BACKEND_UPLOAD_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"

const DEPLOYMENT_STEPS = [
  "Cloning repository...",
  "Installing dependencies...",
  "Building application...",
  "Deploying to production...",
  "Finalizing deployment...",
]

export function DeploymentForm() {
  const [repoUrl, setRepoUrl] = useState("")
  const [uploadId, setUploadId] = useState("")
  const [uploading, setUploading] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [deployed, setDeployed] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(0)

  const checkDeploymentStatus = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_UPLOAD_URL}/status?id=${id}`)
      const data = await response.json()
      if (data.status === "deployed") {
        setDeployed(true)
        setDeploying(false)
        return true
      }
      return false
    } catch (err) {
      console.error("Status check failed:", err)
      return false
    }
  }

  useEffect(() => {
    if (uploading || deploying) {
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= DEPLOYMENT_STEPS.length - 1) {
            return prev
          }
          return prev + 1
        })
      }, 5000)

      return () => clearInterval(stepInterval)
    } else {
      setCurrentStep(0)
    }
  }, [uploading, deploying])

  const handleDeploy = async () => {
    try {
      setUploading(true)
      setDeploying(true)
      setError("")
      setCurrentStep(0)

      const res = await fetch(`${BACKEND_UPLOAD_URL}/deploy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl: repoUrl }),
      })

      const data = await res.json()
      setUploadId(data.id)
      setUploading(false)

      const interval = setInterval(async () => {
        const isDeployed = await checkDeploymentStatus(data.id)
        if (isDeployed) {
          clearInterval(interval)
        }
      }, 3000)
    } catch (err) {
      setError("Deployment failed. Please check the repository URL and try again.")
      setUploading(false)
      setDeploying(false)
      setCurrentStep(0)
      console.error("Deploy error:", err)
    }
  }

  if (deployed) {
    return (
      <section id="deploy-form" className="w-full max-w-lg mx-auto px-4">
        <Card className="bg-zinc-900 border border-zinc-800 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <CardTitle className="text-xl font-semibold text-white">Deployment Successful</CardTitle>
            </div>
            <CardDescription className="text-zinc-400">
              Your project has been deployed and is ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="deployed-url" className="text-sm font-medium text-zinc-300">
                Production URL
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="deployed-url"
                  readOnly
                  type="url"
                  value={`https://${uploadId}.segwise.site/index.html`}
                  className="bg-black border-zinc-800 text-zinc-400 flex-1"
                />
                <Button
                  className="border border-zinc-800 hover:bg-zinc-800 text-white bg-transparent"
                  onClick={() => navigator.clipboard.writeText(`https://${uploadId}.segwise.site/index.html`)}
                >
                  Copy
                </Button>
              </div>
            </div>

            <Button
              className="w-full h-11 font-medium bg-white hover:bg-zinc-200 text-black transition-all"
              onClick={() => window.open(`https://${uploadId}.segwise.site/index.html`, "_blank")}
            >
              Visit Deployment →
            </Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (uploading || deploying) {
    return (
      <section id="deploy-form" className="w-full max-w-lg mx-auto px-4">
        <Card className="bg-zinc-900 border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-white">Deploying Your Application</CardTitle>
            <CardDescription className="text-zinc-400">Please wait while we deploy your repository</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 py-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="animate-spin h-16 w-16 border-4 border-zinc-800 border-t-white rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 bg-zinc-900 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {DEPLOYMENT_STEPS.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      index === currentStep
                        ? "text-white"
                        : index < currentStep
                          ? "text-zinc-500"
                          : "text-zinc-700"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-2 h-2 rounded-full transition-all duration-500 ${
                        index === currentStep
                          ? "bg-white animate-pulse"
                          : index < currentStep
                            ? "bg-zinc-500"
                            : "bg-zinc-700"
                      }`}
                    ></div>
                    <span className="font-mono text-sm">{step}</span>
                    {index < currentStep && (
                      <span className="ml-auto text-green-500 text-sm">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section id="deploy-form" className="w-full max-w-lg mx-auto px-4">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="bg-zinc-900 border border-zinc-800 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-white">Deploy Your Application</CardTitle>
            <CardDescription className="text-zinc-400">Paste your GitHub repository URL to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="github-url" className="text-sm font-medium text-zinc-300">
                  GitHub Repository URL
                </Label>
                <Input
                  id="github-url"
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="bg-black border-zinc-800 focus:border-white focus:ring-1 focus:ring-white text-white placeholder:text-zinc-600 h-11"
                />
              </div>

              <Button
                onClick={handleDeploy}
                disabled={!repoUrl || uploading || deploying}
                className="w-full h-11 font-medium bg-white hover:bg-zinc-200 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
              >
                Deploy Now
              </Button>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
