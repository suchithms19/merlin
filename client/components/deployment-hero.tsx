"use client"

import { Button } from "./ui/button"

interface DeploymentHeroProps {
  onStartDeploy: () => void
}

export function DeploymentHero({ onStartDeploy }: DeploymentHeroProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 text-center max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
        <span className="font-mono text-sm text-zinc-400">All Systems Operational</span>
      </div>
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
        Deploy to the <br />
        <i className="font-light">World...</i>
      </h1>
      <p className="font-mono text-sm sm:text-base text-zinc-400 text-balance mt-8 max-w-[540px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
        Import your GitHub repository and deploy instantly. Merlin handles the complexity so you can focus on
        building.
      </p>

      <Button 
        className="mt-14 bg-white hover:bg-zinc-200 text-black font-medium px-8 py-6 text-lg transition-all transform hover:scale-105 animate-in fade-in slide-in-from-bottom-8 duration-1000" 
        onClick={onStartDeploy}
      >
        Start Deploying
      </Button>
    </div>
  )
}
