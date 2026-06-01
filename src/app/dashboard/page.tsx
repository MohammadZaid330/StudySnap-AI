"use client"

import * as React from "react"
import { ArrowUpRight, BookOpen, FileText, PlayCircle, Plus, Sparkles } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/utils/supabase/client"
import { getNotes, getStats, NoteItem, UserStats } from "@/utils/notes-store"

export default function DashboardPage() {
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
    const fetchUserAndData = async () => {
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
    fetchUserAndData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Student"

  return (
    <div className="space-y-8">
      {/* Welcome & Streak */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {fullName}! 👋</h1>
          {notes.length > 0 ? (
            <p className="text-muted-foreground mt-1">Ready to continue acing your exams? Let&apos;s study some smart notes! 🚀</p>
          ) : (
            <p className="text-muted-foreground mt-1">Ready to start acing your exams? Let&apos;s create some smart notes!</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-primary text-white rounded-xl" asChild>
            <Link href="/dashboard/upload">
              <Plus className="mr-2 h-4 w-4" /> New Notes
            </Link>
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex justify-between items-center">
              Total Notes
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {notes.length > 0 ? `+${notes.length} this week` : 'Start uploading content'}
            </p>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex justify-between items-center">
              Quiz Avg. Score
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {stats.quizAvg > 0 ? `${stats.quizAvg}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.quizAvg > 0 ? 'Keep practicing to improve!' : 'Take quizzes to build your score'}
            </p>
          </CardContent>
        </Card>
      </div>

      {notes.length === 0 ? (
        /* Premium Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 rounded-2xl bg-muted/5 py-16 max-w-4xl mx-auto border-muted-foreground/20">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight mb-2">No Smart Notes Generated</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Your study dashboard is completely clean! You can get started by pasting a YouTube lecture link or uploading your textbooks/PDFs to convert them into instant summaries, flashcards, and study aids.
          </p>
          <Button className="bg-gradient-primary text-white rounded-xl px-8 h-12 text-md shadow-lg shadow-primary/20" asChild>
            <Link href="/dashboard/upload">
              <Plus className="mr-2 h-5 w-5" /> Generate Your First Notes
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Uploads */}
          <Card className="md:col-span-2 glass-panel flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Notes</CardTitle>
                  <CardDescription>Your latest AI-generated study materials.</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/notes">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                {notes.slice(0, 5).map((note) => (
                  <Link href={`/dashboard/notes/preview?id=${note.id}`} key={note.id} className="block">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer border border-transparent hover:border-border">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-background shadow-sm border ${note.type === 'youtube' ? 'text-red-500' : 'text-blue-500'}`}>
                          {note.type === 'youtube' ? <PlayCircle className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">{note.title}</p>
                          <p className="text-xs text-muted-foreground">{note.date} • {note.format}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goal Progress */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Weekly Goal</CardTitle>
              <CardDescription>Generate 5 summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative h-32 w-32 mb-4">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    <circle
                      className="text-primary stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={(251.2 - (251.2 * (Math.min(stats.weeklyGoalProgress, 5) / 5)))}
                      transform="rotate(-90 50 50)"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">{Math.min(stats.weeklyGoalProgress, 5)}/5</span>
                  </div>
                </div>
                <p className="text-sm font-medium">
                  {stats.weeklyGoalProgress >= 5 ? "Goal Achieved! 🏆" : "You're getting there!"}
                </p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {stats.weeklyGoalProgress >= 5 
                    ? "Fantastic job achieving your goals this week!" 
                    : `Just ${Math.max(5 - stats.weeklyGoalProgress, 0)} more summaries to reach your goal.`}
                </p>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-xs font-medium">
                  <span>Goal Completion</span>
                  <span>{Math.round((Math.min(stats.weeklyGoalProgress, 5) / 5) * 100)}%</span>
                </div>
                <Progress value={(Math.min(stats.weeklyGoalProgress, 5) / 5) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
