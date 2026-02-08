"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function LandingHeader() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-30 flex items-center justify-between p-6">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-black font-bold text-lg hover:scale-105 transition-transform">
          TKI
        </div>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-2">
        <Link
          href="/features"
          className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Features
        </Link>
        <Link
          href="/public-routes"
          className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Routes
        </Link>
        <Link
          href="/dashboard/buses"
          className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Fleet
        </Link>
      </nav>

      {/* Login/Dashboard Button Group with Arrow */}
      <div className="flex items-center gap-4">
        <div id="gooey-btn" className="relative hidden sm:flex items-center group" style={{ filter: "url(#gooey-filter)" }}>
          <Link 
            href={isAuthenticated ? "/dashboard" : "/signin"}
            className={`absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 ${isAuthenticated ? "group-hover:-translate-x-25" : "group-hover:-translate-x-19"} z-0`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </Link>
          <Link 
            href={isAuthenticated ? "/dashboard" : "/signin"}
            className="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10"
          >
            {isAuthenticated ? "Dashboard" : "Login"}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
          <Link
            href="/features"
            className="text-white text-2xl font-light hover:text-white/70 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/public-routes"
            className="text-white text-2xl font-light hover:text-white/70 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Routes
          </Link>
          <Link
            href="/dashboard/buses"
            className="text-white text-2xl font-light hover:text-white/70 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Fleet
          </Link>
          <Link 
            href={isAuthenticated ? "/dashboard" : "/signin"}
            className="px-10 py-4 rounded-full bg-white text-black font-medium text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            {isAuthenticated ? "Dashboard" : "Login"}
          </Link>
          <button 
            className="absolute top-6 right-6 p-2 text-white/80"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
        </div>
      )}
    </header>
  )
}
