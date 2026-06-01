"use client"

import * as React from "react"
import { ArrowUpRight, FileText, PlayCircle, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { getNotes, deleteNote, NoteItem } from "@/utils/notes-store"

export default function MyNotesPage() {
  const [user, setUser] = React.useState<any>(null)
  const [notes, setNotes] = React.useState<NoteItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterType, setFilterType] = React.useState<"all" | "youtube" | "pdf">("all")

  React.useEffect(() => {
    const fetchUserAndData = async () => {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      const userId = currentUser?.id || "demo-user"
      if (currentUser) {
        setUser(currentUser)
      }
      setNotes(getNotes(userId))
      setLoading(false)
    }
    fetchUserAndData()
  }, [])

  const handleDelete = (noteId: string) => {
    const userId = user?.id || "demo-user"
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(userId, noteId)
      setNotes(getNotes(userId))
    }
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || note.type === filterType
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Smart Notes</h1>
          <p className="text-muted-foreground mt-1">Access all your AI-generated study aids and summaries.</p>
        </div>
        <Button className="bg-gradient-primary text-white rounded-xl" asChild>
          <Link href="/dashboard/upload">
            <Plus className="mr-2 h-4 w-4" /> New Notes
          </Link>
        </Button>
      </div>

      {notes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 py-16 max-w-xl mx-auto border-muted-foreground/20">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No notes generated yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Convert a YouTube lecture or a PDF textbook into smart summaries, dynamic flashcards, and quizzes.
          </p>
          <Button className="bg-gradient-primary text-white rounded-xl" asChild>
            <Link href="/dashboard/upload">Generate Notes Now</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notes by title..."
                className="pl-9 bg-background border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className="flex-1 sm:flex-none rounded-xl"
              >
                All
              </Button>
              <Button
                variant={filterType === "youtube" ? "default" : "outline"}
                onClick={() => setFilterType("youtube")}
                className="flex-1 sm:flex-none rounded-xl"
              >
                Videos
              </Button>
              <Button
                variant={filterType === "pdf" ? "default" : "outline"}
                onClick={() => setFilterType("pdf")}
                className="flex-1 sm:flex-none rounded-xl"
              >
                PDFs
              </Button>
            </div>
          </div>

          {/* Grid */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No notes match your current search or filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="glass-panel hover:shadow-md transition-shadow group flex flex-col justify-between">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className={`p-2 rounded-lg bg-background border shadow-sm ${note.type === 'youtube' ? 'text-red-500' : 'text-blue-500'}`}>
                        {note.type === 'youtube' ? <PlayCircle className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(note.id)}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="mt-4 text-xl line-clamp-2">{note.title}</CardTitle>
                    <CardDescription>{note.date} • {note.format}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button className="w-full rounded-xl bg-muted hover:bg-primary hover:text-white transition-colors group/btn" variant="ghost" asChild>
                      <Link href={`/dashboard/notes/preview?id=${note.id}`}>
                        View Details <ArrowUpRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
