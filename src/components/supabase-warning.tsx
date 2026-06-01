"use client"

import * as React from "react"
import { AlertTriangle, X } from "lucide-react"

export function SupabaseWarning() {
  const [isDismissed, setIsDismissed] = React.useState(false)
  const [isConfigured, setIsConfigured] = React.useState(true)

  React.useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const configured = !!(
      url && 
      url !== 'your_supabase_url_here' && 
      url.startsWith('http') && 
      key && 
      key !== 'your_supabase_anon_key_here'
    )
    setIsConfigured(configured)
  }, [])

  if (isConfigured || isDismissed) return null

  return (
    <div className="bg-amber-550 dark:bg-amber-950/80 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between gap-4 sticky top-0 z-[100] backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-2 mx-auto text-center">
        <AlertTriangle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
        <span>
          <strong>Demo Mode Active:</strong> Supabase environment variables are missing or default in <code>.env.local</code>. Real database and authentication are simulated.
        </span>
      </div>
      <button 
        onClick={() => setIsDismissed(true)}
        className="text-amber-800/70 hover:text-amber-950 dark:text-amber-400/70 dark:hover:text-amber-200 hover:bg-amber-500/10 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
        aria-label="Dismiss warning"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
