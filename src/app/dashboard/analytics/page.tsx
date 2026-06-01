"use client"

import * as React from "react"
import { BarChart3, BookOpen, FileText, TrendingUp, Sparkles, Plus } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { getNotes, getStats, NoteItem, UserStats } from "@/utils/notes-store"

export default function AnalyticsPage() {
  const [user, setUser] = React.useState<any>(null)
  const [notes, setNotes] = React.useState<NoteItem[]>([])
  const [stats, setStats] = React.useState<UserStats>({
    streak: 0,
    hoursSaved: 0,
    quizAvg: 0,
    weeklyGoalProgress: 0
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchUserAndAnalytics = async () => {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      const userId = currentUser?.id || "demo-user"
      if (currentUser) {
        setUser(currentUser)
      }
      setNotes(getNotes(userId))
      setStats(getStats(userId))
      setLoading(false)
    }
    fetchUserAndAnalytics()
  }, [])

  // Count topics for breakdown
  const categoryCounts = React.useMemo(() => {
    const counts = { ml: 0, math: 0, biology: 0, general: 0 }
    notes.forEach(note => {
      const title = note.title.toLowerCase()
      if (title.includes("machine") || title.includes("learn") || title.includes("ai")) {
        counts.ml++
      } else if (title.includes("calculus") || title.includes("math") || title.includes("limits") || title.includes("physics")) {
        counts.math++
      } else if (title.includes("cell") || title.includes("bio") || title.includes("biology")) {
        counts.biology++
      } else {
        counts.general++
      }
    })
    return counts
  }, [notes])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalCategorized = notes.length || 1

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Study Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your consistency, quiz scores, and course coverage.</p>
      </div>

      {notes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 py-16 max-w-xl mx-auto border-muted-foreground/20">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No analytics available</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Unlock interactive metrics, weekly consistency bars, and category coverage by generating your first smart study guide.
          </p>
          <Button className="bg-gradient-primary text-white rounded-xl" asChild>
            <Link href="/dashboard/upload">
              <Plus className="mr-2 h-4 w-4" /> Start Studying
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Top High-level Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase">Total Summaries</p>
                  <p className="text-2xl font-bold">{notes.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-green-500/10 p-3 rounded-xl text-green-500">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase">Quiz Average</p>
                  <p className="text-2xl font-bold">{stats.quizAvg > 0 ? `${stats.quizAvg}%` : '--'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Study Consistency Chart (SVG) */}
            <Card className="lg:col-span-2 glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Study Consistency
                </CardTitle>
                <CardDescription>Consistency and activity by weekday</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full flex items-end justify-between pt-8 px-4 border-b">
                  {/* Monday */}
                  <div className="flex flex-col items-center gap-2 w-12 group">
                    <div className="w-8 bg-primary/20 hover:bg-primary rounded-t transition-all" style={{ height: "45px" }} />
                    <span className="text-xs text-muted-foreground font-medium">Mon</span>
                  </div>
                  {/* Tuesday */}
                  <div className="flex flex-col items-center gap-2 w-12 group">
                    <div className="w-8 bg-primary/20 hover:bg-primary rounded-t transition-all animate-pulse" style={{ height: "120px" }} />
                    <span className="text-xs text-muted-foreground font-medium">Tue</span>
                  </div>
                  {/* Wednesday (Active / Generative Day) */}
                  <div className="flex flex-col items-center gap-2 w-12 group">
                    <div className="w-8 bg-primary rounded-t transition-all shadow-lg shadow-primary/25" style={{ height: `${Math.min(notes.length * 30, 200)}px` }} />
                    <span className="text-xs text-muted-foreground font-medium">Wed</span>
                  </div>
                  {/* Thursday */}
                  <div className="flex flex-col items-center gap-2 w-12 group">
                    <div className="w-8 bg-primary/20 hover:bg-primary rounded-t transition-all" style={{ height: "70px" }} />
                    <span className="text-xs text-muted-foreground font-medium">Thu</span>
                  </div>
                  {/* Friday */}
                  <div className="flex flex-col items-center gap-2 w-12 group">
                    <div className="w-8 bg-primary/20 hover:bg-primary rounded-t transition-all" style={{ height: "30px" }} />
                    <span className="text-xs text-muted-foreground font-medium">Fri</span>
                  </div>
                  {/* Saturday */}
                  <div className="flex flex-col items-center gap-2 w-12 group">
                    <div className="w-8 bg-primary/20 hover:bg-primary rounded-t transition-all" style={{ height: "15px" }} />
                    <span className="text-xs text-muted-foreground font-medium">Sat</span>
                  </div>
                  {/* Sunday */}
                  <div className="flex flex-col items-center gap-2 w-12 group">
                    <div className="w-8 bg-primary/20 hover:bg-primary rounded-t transition-all" style={{ height: "10px" }} />
                    <span className="text-xs text-muted-foreground font-medium">Sun</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Coverage Breakdown */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Topic Coverage
                </CardTitle>
                <CardDescription>Breakdown by classified curriculum</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* ML */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Machine Learning / AI</span>
                    <span>{Math.round((categoryCounts.ml / totalCategorized) * 100)}%</span>
                  </div>
                  <Progress value={(categoryCounts.ml / totalCategorized) * 100} className="h-2" />
                </div>
                {/* Math / Calculus */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Calculus & Physics</span>
                    <span>{Math.round((categoryCounts.math / totalCategorized) * 100)}%</span>
                  </div>
                  <Progress value={(categoryCounts.math / totalCategorized) * 100} className="h-2" />
                </div>
                {/* Biology */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Cell Biology / Life Sciences</span>
                    <span>{Math.round((categoryCounts.biology / totalCategorized) * 100)}%</span>
                  </div>
                  <Progress value={(categoryCounts.biology / totalCategorized) * 100} className="h-2" />
                </div>
                {/* General */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Study Skills / General</span>
                    <span>{Math.round((categoryCounts.general / totalCategorized) * 100)}%</span>
                  </div>
                  <Progress value={(categoryCounts.general / totalCategorized) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
