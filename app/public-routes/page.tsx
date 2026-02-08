"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ShaderBackground from "@/components/landing/ShaderBackground"
import LandingHeader from "@/components/landing/LandingHeader"
import { MapPin } from "lucide-react"

export default function PublicRoutesPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRoutes(data)
        } else {
          console.error("Expected array from /api/routes, got:", data)
          setRoutes([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch routes", err)
        setLoading(false)
      })
  }, [])

  return (
    <ShaderBackground>
      <div className="relative z-20">
        <LandingHeader />
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-6 pt-12 pb-24">
        <div className="w-full max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Active Routes</h1>
            <p className="text-white/60">Explore our current transit network and stops.</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routes.map((route) => (
                <div 
                  key={route.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-white">{route.name}</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {route.stops?.map((stop: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs"
                      >
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ShaderBackground>
  )
}
