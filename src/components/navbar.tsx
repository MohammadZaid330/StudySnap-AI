"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrainCircuit, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  // Only show full navbar on non-dashboard routes (or maybe show a different one on dashboard)
  const isDashboard = pathname?.startsWith("/dashboard")

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isDashboard) return null // Hide on dashboard, handled by sidebar

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className={`flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-300 ${
          isScrolled ? "glass-panel" : "bg-transparent"
        }`}>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-primary p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">
              StudySnap<span className="text-primary">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="bg-gradient-primary text-white border-0 hover:opacity-90 transition-opacity" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-2 px-4 md:hidden"
          >
            <div className="glass-panel rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
              <nav className="flex flex-col gap-3">
                <Link 
                  href="#features" 
                  className="px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How it Works
                </Link>
                <Link 
                  href="#faq" 
                  className="px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
              </nav>
              <div className="h-px bg-border my-2" />
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-center" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button className="w-full justify-center bg-gradient-primary text-white border-0" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
