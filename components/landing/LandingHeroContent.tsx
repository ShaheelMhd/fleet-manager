"use client"

import Link from "next/link"

export default function LandingHeroContent() {
  return (
    <main className="relative md:absolute md:bottom-12 md:left-12 z-20 w-full md:max-w-lg px-8 pt-24 md:pt-0 md:px-0 flex flex-col justify-center min-h-[80vh] md:min-h-0">
      <div className="text-left">
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 relative"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          <span className="text-white/90 text-xs font-light relative z-10">Fleet Management Simplified</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl md:leading-16 tracking-tight font-light text-white mb-4">
          <span className="font-medium italic">Efficient</span> Transport
          <br />
          <span className="font-light tracking-tight text-white">Solutions</span>
        </h1>

        {/* Description */}
        <p className="text-[10px] sm:text-xs font-light text-white/70 mb-4 leading-relaxed max-w-sm">
          Streamline your fleet operations with our advanced tracking and management system. 
          Real-time monitoring, seat allocation, and maintenance alerts at your fingertips.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link 
            href="/public-routes"
            className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer text-center"
          >
            Explore Routes
          </Link>
          <Link 
            href="/register"
            className="px-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer text-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  )
}
