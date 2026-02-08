"use client"

import LandingHeader from "@/components/landing/LandingHeader"
import ShaderBackground from "@/components/landing/ShaderBackground"
import { Bus, MapPin, Users, Bell, Shield, BarChart3 } from "lucide-react"

const features = [
  {
    title: "Real-time Tracking",
    description: "Monitor your fleet's location and status in real-time with high precision.",
    icon: MapPin,
  },
  {
    title: "Seat Allocation",
    description: "Intelligent seat management system for optimized passenger capacity.",
    icon: Users,
  },
  {
    title: "Route Management",
    description: "Efficiently plan and manage transport routes with interactive maps.",
    icon: Bus,
  },
  {
    title: "Maintenance Alerts",
    description: "Automatic notifications for vehicle servicing and maintenance schedules.",
    icon: Bell,
  },
  {
    title: "Safety First",
    description: "Comprehensive driver and vehicle safety monitoring protocols.",
    icon: Shield,
  },
  {
    title: "Analytics Dashboard",
    description: "Detailed insights and reports on fleet performance and usage.",
    icon: BarChart3,
  },
]

export default function FeaturesPage() {
  return (
    <ShaderBackground>
      <div className="relative z-10 flex flex-col min-h-screen">
        <LandingHeader />
        
        <main className="flex-1 py-12 px-6 sm:px-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-6">
                Powerful <span className="font-light italic text-white/80">Features</span>
              </h1>
              <p className="text-white/60 font-light max-w-2xl mx-auto text-base sm:text-lg">
                Everything you need to manage your transport fleet efficiently in one unified platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
                  <p className="text-base font-light text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="p-8 text-center text-white/30 text-xs font-light">
          © 2026 Fleet Manager. All rights reserved.
        </footer>
      </div>
    </ShaderBackground>
  )
}
