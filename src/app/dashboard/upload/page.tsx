"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { FileText, Loader2, Sparkles, UploadCloud, MonitorPlay, BrainCircuit } from "lucide-react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/utils/supabase/client"
import { addNote } from "@/utils/notes-store"

const SAMPLE_DATASETS = {
  ml: [
    {
      topic: "Core Concept",
      title: "Supervised Learning",
      content: "A type of machine learning where the model is trained on labeled data, learning to map inputs to correct outputs.",
      keywords: ["labeled data", "inputs", "outputs", "supervised"],
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-t-blue-500",
    },
    {
      topic: "Formula",
      title: "Linear Regression",
      content: "Predicts values using the linear equation: Y = wX + b, where w is the weight and b is the bias.",
      keywords: ["linear equation", "weight", "bias", "predicts"],
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border-t-purple-500",
    },
    {
      topic: "Principle",
      title: "Overfitting",
      content: "Occurs when a model learns the training data too well, failing to generalize to new, unseen data.",
      keywords: ["generalize", "training data", "unseen", "overfitting"],
      color: "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-t-green-500",
    },
    {
      topic: "Application",
      title: "Gradient Descent",
      content: "An optimization algorithm used to minimize the loss function by iteratively moving towards the local minimum.",
      keywords: ["optimization", "minimize loss", "local minimum"],
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-t-orange-500",
    },
  ],
  math: [
    {
      topic: "Core Concept",
      title: "Limits & Continuity",
      content: "A limit describes the behavior of a function near a point, rather than at that point itself. Vital for calculus.",
      keywords: ["limit", "behavior", "function", "calculus"],
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-t-blue-500",
    },
    {
      topic: "Formula",
      title: "The Derivative Definition",
      content: "Represented by f'(x) = lim(h->0) [f(x+h) - f(x)] / h. Measures the instantaneous rate of change.",
      keywords: ["derivative", "rate of change", "instantaneous"],
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border-t-purple-500",
    },
    {
      topic: "Principle",
      title: "Fundamental Theorem",
      content: "Establishes a connection between differentiation and integration, showing they are inverse operations.",
      keywords: ["differentiation", "integration", "inverse", "theorem"],
      color: "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-t-green-500",
    },
    {
      topic: "Application",
      title: "Optimization Problems",
      content: "Using derivatives to find maximum or minimum values, such as maximizing volume or minimizing cost.",
      keywords: ["derivatives", "maximum", "minimum", "optimization"],
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-t-orange-500",
    },
  ],
  biology: [
    {
      topic: "Core Concept",
      title: "Cell Membrane Structure",
      content: "Composed of a phospholipid bilayer with embedded proteins, operating under the fluid mosaic model.",
      keywords: ["phospholipid bilayer", "proteins", "fluid mosaic"],
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-t-blue-500",
    },
    {
      topic: "Formula",
      title: "Cellular Respiration",
      content: "C6H12O6 + 6O2 ➔ 6CO2 + 6H2O + ATP. The chemical process of breaking down glucose for energy.",
      keywords: ["glucose", "ATP", "respiration", "energy"],
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border-t-purple-500",
    },
    {
      topic: "Principle",
      title: "Active Transport",
      content: "Movement of substances against their concentration gradient, requiring energy input in the form of ATP.",
      keywords: ["gradient", "energy input", "ATP", "transport"],
      color: "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-t-green-500",
    },
    {
      topic: "Application",
      title: "Mitochondrial ATP",
      content: "The powerhouse of the cell, where the electron transport chain produces the majority of ATP energy.",
      keywords: ["mitochondria", "electron transport", "ATP production"],
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-t-orange-500",
    },
  ],
  general: [
    {
      topic: "Core Concept",
      title: "Feynman Technique",
      content: "A method of learning by teaching a concept to a child in simple terms, identifying gaps in your knowledge.",
      keywords: ["learning", "teaching", "simple terms", "feynman"],
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-t-blue-500",
    },
    {
      topic: "Formula",
      title: "Spaced Repetition",
      content: "Reviewing information at increasing intervals to improve long-term retention and combat the forgetting curve.",
      keywords: ["reviewing", "intervals", "forgetting curve", "retention"],
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border-t-purple-500",
    },
    {
      topic: "Principle",
      title: "Active Recall",
      content: "Testing your memory by retrieving information rather than passively re-reading textbooks.",
      keywords: ["testing", "retrieving", "passively", "recall"],
      color: "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-t-green-500",
    },
    {
      topic: "Application",
      title: "Pomodoro Method",
      content: "Studying in highly focused 25-minute sessions followed by short 5-minute breaks to boost productivity.",
      keywords: ["focused", "sessions", "breaks", "pomodoro"],
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-t-orange-500",
    },
  ],
}

export default function UploadPage() {
  const [activeTab, setActiveTab] = React.useState("youtube")
  const [youtubeUrl, setYoutubeUrl] = React.useState("")
  const [customTitle, setCustomTitle] = React.useState("")
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [progressVal, setProgressVal] = React.useState(10)
  const router = useRouter()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
    }
  }

  const triggerBrowse = () => {
    fileInputRef.current?.click()
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setProgressVal(15)

    // Simulate progress updates
    const interval = setInterval(() => {
      setProgressVal(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 15
      })
    }, 400)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || "demo-user"

      const style = (document.querySelector('input[name="style"]:checked') as HTMLInputElement)?.value || "detailed"
      const format = (document.querySelector('input[name="format"]:checked') as HTMLInputElement)?.value || "bullets"

      const response = await fetch("/api/generate-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          youtubeUrl: activeTab === "youtube" ? youtubeUrl : "",
          type: activeTab,
          customTitle,
          fileName: activeTab === "pdf" ? (fileName || "uploaded_file.pdf") : ""
        })
      })

      if (!response.ok) {
        throw new Error("Failed to generate AI notes summary.")
      }

      const resData = await response.json()
      
      clearInterval(interval)
      setProgressVal(100)

      const newNote = addNote(userId, {
        title: resData.title,
        type: activeTab as 'youtube' | 'pdf',
        source: resData.source,
        style,
        format,
        content: resData.content
      })

      router.push(`/dashboard/notes/preview?id=${newNote.id}`)
    } catch (err: any) {
      clearInterval(interval)
      setIsGenerating(false)
      alert(err.message || "An error occurred during summarization.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Smart Notes</h1>
        <p className="text-muted-foreground mt-1">Upload a PDF or paste a YouTube lecture link to get started.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleGenerate} className="lg:col-span-2 space-y-6">
          {/* Custom Document Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-md font-medium text-foreground">Document Title (Optional)</Label>
            <Input 
              id="title"
              placeholder="e.g. Introduction to Neural Networks" 
              className="bg-background h-12 text-md border-border focus-visible:ring-1 focus-visible:ring-primary"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">If left empty, we will auto-generate a title based on the file or URL.</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="youtube" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <MonitorPlay className="mr-2 h-4 w-4" /> YouTube Video
              </TabsTrigger>
              <TabsTrigger value="pdf" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <FileText className="mr-2 h-4 w-4" /> PDF Document
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="youtube" className="m-0 focus-visible:ring-0">
                <Card className="glass-panel border-dashed border-2">
                  <CardContent className="pt-6 flex flex-col items-center justify-center p-12 text-center">
                    <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                      <MonitorPlay className="h-10 w-10 text-red-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Paste YouTube Link</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      Copy the URL of the lecture you want to summarize and paste it below.
                    </p>
                    <div className="w-full max-w-md">
                      <Input 
                        placeholder="https://youtube.com/watch?v=..." 
                        className="bg-background h-12 text-center mb-4" 
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        required={activeTab === "youtube"}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pdf" className="m-0 focus-visible:ring-0">
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
                <Card 
                  onClick={triggerBrowse}
                  className="glass-panel border-dashed border-2 hover:bg-muted/20 transition-colors cursor-pointer border-transparent"
                >
                  <CardContent className="pt-6 flex flex-col items-center justify-center p-12 text-center">
                    <div className="h-20 w-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                      <UploadCloud className="h-10 w-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      {fileName ? "Selected PDF File" : "Upload PDF Notes"}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      {fileName ? `File: ${fileName}` : "Drag and drop your PDF file here, or click to browse from your computer."}
                    </p>
                    <Button type="button" variant="outline" className="h-12 px-8">
                      {fileName ? "Change File" : "Browse Files"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </form>

        <div className="lg:col-span-1">
          <Card className="glass-card sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Output Settings
              </CardTitle>
              <CardDescription>Customize how AI generates your notes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Summary Style</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="border rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                      <input type="radio" name="style" value="detailed" className="sr-only" defaultChecked />
                      <span className="text-sm font-medium">Detailed</span>
                    </label>
                    <label className="border rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                      <input type="radio" name="style" value="concise" className="sr-only" />
                      <span className="text-sm font-medium">Concise</span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Format</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="border rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                      <input type="radio" name="format" value="bullets" className="accent-primary w-4 h-4" defaultChecked />
                      <span className="text-sm font-medium">Bullet Points</span>
                    </label>
                    <label className="border rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                      <input type="radio" name="format" value="marks" className="accent-primary w-4 h-4" />
                      <span className="text-sm font-medium">Marks-wise (2/5/10)</span>
                    </label>
                    <label className="border rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                      <input type="radio" name="format" value="flashcards" className="accent-primary w-4 h-4" />
                      <span className="text-sm font-medium">Flashcards / Q&A</span>
                    </label>
                    <label className="border rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                      <input type="radio" name="format" value="viva" className="accent-primary w-4 h-4" />
                      <span className="text-sm font-medium">Viva Style</span>
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  className="w-full bg-gradient-primary text-white border-0 hover:opacity-90 h-12 text-md shadow-lg shadow-primary/25 rounded-xl cursor-pointer"
                  disabled={isGenerating || (activeTab === "pdf" && !fileName)}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                      Generating Magic...
                    </>
                  ) : (
                    "Generate Notes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 rounded-3xl flex flex-col items-center max-w-sm w-full mx-4 shadow-2xl"
          >
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-muted flex items-center justify-center">
                <BrainCircuit className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <svg className="absolute top-0 left-0 h-20 w-20 -rotate-90 animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="30 200" className="text-primary linecap-round" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mt-6 mb-2">Analyzing Content</h3>
            <div className="flex gap-1 items-center h-5">
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="text-sm text-muted-foreground">Extracting concepts</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} className="text-muted-foreground">.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} className="text-muted-foreground">.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }} className="text-muted-foreground">.</motion.span>
            </div>
            <Progress value={progressVal} className="h-2 w-full mt-6" />
          </motion.div>
        </div>
      )}
    </div>
  )
}
