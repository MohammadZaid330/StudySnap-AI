"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  BarChart3,
  BrainCircuit,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  StickyNote,
  Upload
} from "lucide-react"

import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload & Generate", href: "/dashboard/upload", icon: Upload },
  { name: "My Notes", href: "/dashboard/notes", icon: FileText },
  { name: "Quizzes", href: "/dashboard/quiz", icon: BrainCircuit },
  { name: "Handwritten", href: "/dashboard/handwritten", icon: StickyNote },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error("SignOut error:", err)
    }

    // Clear all possible cookies (including mock cookies)
    if (typeof document !== 'undefined') {
      document.cookie = 'mock-user-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'mock-user-data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'sb-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }

    // Hard refresh/navigation to login page to reset client states and bypass Next Router cache
    window.location.href = "/login"
  }

  return (
    <aside className="w-64 border-r bg-background/50 backdrop-blur flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-primary p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">
            StudySnap<span className="text-primary">AI</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative overflow-hidden",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>

      <div className="p-4 mt-auto border-t">
        <div className="space-y-1">
          <Link href="/dashboard">
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Settings className="h-5 w-5" />
              Settings
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  )
}
