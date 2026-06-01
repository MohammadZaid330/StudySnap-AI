import * as React from "react"
import { Bell, Search } from "lucide-react"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || "User"
  const plan = user.user_metadata?.plan || "Free Plan"
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "US"

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-background/50 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notes, quizzes..."
                className="w-full pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
            </button>
            <div className="h-6 w-px bg-border mx-1" />
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-medium leading-none">{fullName}</span>
                <span className="text-xs text-muted-foreground mt-1">{plan}</span>
              </div>
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={`@${fullName}`} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
