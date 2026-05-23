"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, ChevronDown, Copy, Download, Share2, CheckCircle2, BrainCircuit } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/utils/supabase/client"
import { getNotes, NoteItem, recordStudyActivity } from "@/utils/notes-store"

const DEFAULT_PHYSICS_NOTE: NoteItem = {
  id: "default-physics",
  title: "Physics: Classical Mechanics",
  type: "youtube",
  date: "Generated just now",
  source: "https://youtube.com/watch?v=Newton",
  style: "detailed",
  format: "bullets",
  createdAt: new Date().toISOString(),
  content: [
    {
      topic: "Core Concept",
      title: "Newton's First Law (Inertia)",
      content: "An object remains at rest or in uniform motion unless acted upon by a net external force.",
      keywords: ["rest", "uniform motion", "external force"],
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-t-blue-500",
    },
    {
      topic: "Formula",
      title: "Newton's Second Law",
      content: "Force equals mass times acceleration (F = m × a). The net force on an object is equal to the rate of change of its linear momentum.",
      keywords: ["Force", "mass", "acceleration", "momentum"],
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border-t-purple-500",
    },
    {
      topic: "Principle",
      title: "Newton's Third Law",
      content: "For every action, there is an equal and opposite reaction.",
      keywords: ["action", "equal", "opposite", "reaction"],
      color: "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-t-green-500",
    },
    {
      topic: "Application",
      title: "Friction & Normal Force",
      content: "Friction always opposes the relative motion. Normal force is perpendicular to the surface of contact.",
      keywords: ["opposes motion", "perpendicular", "contact"],
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-t-orange-500",
    },
  ]
}

function PreviewContent() {
  const searchParams = useSearchParams()
  const noteId = searchParams.get("id")
  
  const [note, setNote] = React.useState<NoteItem | null>(null)
  const [copied, setCopied] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchNote = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || "demo-user"
      
      recordStudyActivity(userId)
      if (noteId) {
        const userNotes = getNotes(userId)
        const found = userNotes.find(n => n.id === noteId)
        if (found) {
          setNote(found)
          setLoading(false)
          return
        }
      }
      
      // Fallback to default physics notes if none found (acts as nice demo/fallback)
      setNote(DEFAULT_PHYSICS_NOTE)
      setLoading(false)
    }
    fetchNote()
  }, [noteId])

  const handleCopy = () => {
    if (!note) return
    const textToCopy = note.content
      .map(item => `[${item.topic}] ${item.title}: ${item.content}`)
      .join("\n\n")
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading || !note) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/dashboard/notes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{note.title}</h1>
            <div className="flex gap-2 items-center mt-1">
              <Badge variant="secondary" className="font-normal capitalize">
                {note.type === "youtube" ? "YouTube Video" : "PDF Document"}
              </Badge>
              <span className="text-xs text-muted-foreground">• {note.date}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-xl">
            {copied ? <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm" asChild className="rounded-xl border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <Link href={`/dashboard/handwritten?id=${note.id}`}>
              <BookOpen className="mr-2 h-4 w-4" /> Handwritten Export
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="rounded-xl border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
            <Link href={`/dashboard/quiz?id=${note.id}`}>
              <BrainCircuit className="mr-2 h-4 w-4" /> Practice Quiz
            </Link>
          </Button>
          <Button size="sm" className="rounded-xl bg-gradient-primary text-white border-0">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Main Content - Sticky Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {note.content.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={`sticky-note h-full ${card.color} border-t-4`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                  {card.topic}
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-50 hover:opacity-100">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">{card.title}</h3>
              <p className="text-sm leading-relaxed opacity-90 mb-6">
                {/* Highlight keywords */}
                {card.content.split(' ').map((word, i) => {
                  const cleanWord = word.replace(/[.,()]/g, '')
                  const isKeyword = card.keywords?.some(k => k.toLowerCase().includes(cleanWord.toLowerCase()))
                  return isKeyword && cleanWord.length > 2 ? (
                    <span key={i} className="font-bold bg-white/30 dark:bg-black/20 px-1 rounded mx-0.5">{word} </span>
                  ) : (
                    word + ' '
                  )
                })}
              </p>
              
              <div className="mt-auto pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-1">
                {card.keywords?.map(kw => (
                  <span key={kw} className="text-[10px] font-medium bg-black/5 dark:bg-white/10 px-2 py-1 rounded-full">
                    #{kw.replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Section (Collapsible) */}
      <div className="mt-12 space-y-4">
        <h2 className="text-xl font-bold">Detailed Summary (5 Marks Questions)</h2>
        <Card className="glass-panel">
          <CardContent className="p-6 space-y-4">
            {note.content.map((card, idx) => (
              <div key={idx} className={idx > 0 ? "pt-4 border-t" : ""}>
                <h4 className="font-semibold text-primary mb-2">Q: Explain the significance and details of &quot;{card.title}&quot;.</h4>
                <div className="text-sm text-muted-foreground pl-5 space-y-2">
                  <p>
                    <strong className="text-foreground">Core Principle:</strong> {card.content}
                  </p>
                  <p>
                    <strong className="text-foreground">Key Keywords to Remember:</strong> {card.keywords?.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function NotesPreviewPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PreviewContent />
    </React.Suspense>
  )
}
