"use client"

import { useSession } from "next-auth/react"
import LandingHeader from "@/components/landing/LandingHeader"
import LandingHeroContent from "@/components/landing/LandingHeroContent"
import LandingPulsingCircle from "@/components/landing/LandingPulsingCircle"
import ShaderBackground from "@/components/landing/ShaderBackground"

export default function RootPage() {
  const { status } = useSession()

  // The landing page should be accessible even if authenticated.
  // We removed the automatic redirect to /dashboard to allow viewing the landing page.

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <ShaderBackground>
      <LandingHeader />
      <LandingHeroContent />
      <LandingPulsingCircle />
    </ShaderBackground>
  )
}
