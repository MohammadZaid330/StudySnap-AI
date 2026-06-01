"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, BrainCircuit, CheckCircle2, Clock, Trophy, XCircle, Plus, BookOpen } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/utils/supabase/client"
import { getNotes, getStats, saveStats, NoteItem, recordStudyActivity, recordQuizScore } from "@/utils/notes-store"

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  difficulty: "easy" | "medium" | "hard"
  explanation: string
}

const CATEGORY_QUIZZES: Record<string, QuizQuestion[]> = {
  ml: [
    {
      question: "Which type of machine learning involves training a model on labeled data?",
      options: ["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "Semi-supervised Learning"],
      correct: 2,
      difficulty: "easy",
      explanation: "Supervised learning utilizes labeled input-output datasets to train models to classify data or predict outcomes accurately."
    },
    {
      question: "What is the linear equation used in Linear Regression?",
      options: ["Y = wX² + b", "Y = wX + b", "Y = mx³ + c", "Y = a/X"],
      correct: 1,
      difficulty: "medium",
      explanation: "Linear regression fits a straight linear boundary represented by Y = wX + b, where w is weight/slope and b is bias/intercept."
    },
    {
      question: "What problem occurs when a model learns the training data too well but fails to generalize?",
      options: ["Underfitting", "Overfitting", "Bias-Variance Tradeoff", "Vanishing Gradient"],
      correct: 1,
      difficulty: "hard",
      explanation: "Overfitting happens when a model learns the detail and noise in the training dataset to the extent that it negatively impacts the performance of the model on new data."
    },
  ],
  math: [
    {
      question: "Which mathematical concept describes the behavior of a function near a point?",
      options: ["Integral", "Derivative", "Limit", "Matrix"],
      correct: 2,
      difficulty: "easy",
      explanation: "A limit describes the continuous behavior of a mathematical function as the independent variable approaches a specific coordinate value."
    },
    {
      question: "What is the instantaneous rate of change of a function called?",
      options: ["Limit", "Integral", "Derivative", "Continuity"],
      correct: 2,
      difficulty: "medium",
      explanation: "The derivative of a function evaluates its instantaneous rate of change and provides the slope of the tangent line at any point."
    },
    {
      question: "What theorem connects differentiation and integration as inverse operations?",
      options: ["Mean Value Theorem", "Fundamental Theorem of Calculus", "L'Hopital's Rule", "Taylor's Theorem"],
      correct: 1,
      difficulty: "hard",
      explanation: "The Fundamental Theorem of Calculus formally proves that integration and differentiation are inverse processes."
    },
  ],
  biology: [
    {
      question: "Under which model is the cell membrane structure described as a phospholipid bilayer with embedded proteins?",
      options: ["Sandwich Model", "Fluid Mosaic Model", "Unit Membrane Model", "Liposomal Model"],
      correct: 1,
      difficulty: "easy",
      explanation: "The Fluid Mosaic Model describes the cell membrane as a fluid phospholipid bilayer with mosaic-like proteins free to migrate laterally."
    },
    {
      question: "What is the chemical equation for Cellular Respiration?",
      options: ["6CO2 + 6H2O + Light ➔ C6H12O6 + 6O2", "C6H12O6 + 6O2 ➔ 6CO2 + 6H2O + ATP", "C6H12O6 ➔ 2C2H5OH + 2CO2", "None of the above"],
      correct: 1,
      difficulty: "medium",
      explanation: "Cellular respiration breaks down glucose in the presence of oxygen to yield carbon dioxide, water, and usable ATP chemical energy."
    },
    {
      question: "Which cellular transport process moves substances against their concentration gradient and requires ATP?",
      options: ["Passive Diffusion", "Facilitated Diffusion", "Osmosis", "Active Transport"],
      correct: 3,
      difficulty: "hard",
      explanation: "Active transport uses carrier proteins and direct metabolic ATP input to pump solute molecules against concentration or electrochemical gradients."
    },
  ],
  general: [
    {
      question: "What technique involves learning a concept by explaining it in simple terms as if teaching a child?",
      options: ["Cornell Method", "Feynman Technique", "Leitner System", "SQ3R Method"],
      correct: 1,
      difficulty: "easy",
      explanation: "The Feynman Technique involves writing down a topic, explaining it in simple child-friendly words, identifying knowledge gaps, and reviewing."
    },
    {
      question: "What study method involves reviewing information at increasing intervals to combat the forgetting curve?",
      options: ["Active Recall", "Spaced Repetition", "Mnemonics", "Mind Mapping"],
      correct: 1,
      difficulty: "medium",
      explanation: "Spaced Repetition spaces out learning reviews over systematic increasing intervals (1 day, 3 days, 7 days) to lock information into long-term memory."
    },
    {
      question: "Which productivity method uses 25-minute focused study sessions followed by 5-minute breaks?",
      options: ["Time Blocking", "Pomodoro Method", "Getting Things Done (GTD)", "Eisenhower Matrix"],
      correct: 1,
      difficulty: "hard",
      explanation: "The Pomodoro Technique maintains high cognitive focus by scheduling intense 25-minute intervals separated by short 5-minute cognitive breaks."
    },
  ],
}

function generateQuizForNote(note: NoteItem): QuizQuestion[] {
  const cards = note.content || []
  const questions: QuizQuestion[] = []
  
  if (cards.length === 0) {
    return [
      {
        question: `What is the primary subject discussed in the study summary "${note.title}"?`,
        options: ["Core concepts from the lecture text", "Unrelated field experiments", "Generic study patterns", "None of the above"],
        correct: 0,
        difficulty: "easy",
        explanation: `This practice quiz is generated directly to assess your understanding of the notes for "${note.title}".`
      }
    ]
  }

  // Fallback replicator to ensure we have at least 4 active cards to pull from
  const c = [...cards]
  while (c.length < 4) {
    c.push(cards[0] || {
      topic: "Core Concept",
      title: "General Study Topic",
      content: "Important summary information from the uploaded resources.",
      keywords: ["study", "notes", "education"],
      color: ""
    })
  }

  const [C0, C1, C2, C3] = c

  // Question 1 [EASY]: Short conceptual definition check
  questions.push({
    question: `Which of the following statements best defines the fundamental concept of "${C0.title}" as detailed in the study syllabus?`,
    options: [
      C0.content,
      C1.content,
      C2.content,
      C3.content
    ],
    correct: 0,
    difficulty: "easy",
    explanation: `"${C0.title}" is explicitly defined as: "${C0.content}"`
  })

  // Question 2 [EASY]: Short categorization validation
  questions.push({
    question: `Under what primary academic classification or structural category is "${C1.title}" studied in the context of this lecture's core frameworks?`,
    options: [
      `As a fundamental "${C1.topic}" defining essential theoretical models.`,
      `As a secondary "${C1.topic === "Formula" ? "Application" : "Formula"}" used mainly for offline calculations.`,
      `As an experimental field observation with limited formal proofs.`,
      `As a historical mathematical footnote with no modern applications.`
    ],
    correct: 0,
    difficulty: "easy",
    explanation: `In the study summary structure, "${C1.title}" is classified under the structural category of a "${C1.topic}".`
  })

  // Question 3 [MEDIUM]: Medium contextual keyword requirements
  const c2Keywords = C2.keywords && C2.keywords.length > 0 ? C2.keywords.join(", ") : "core terms"
  const c0Keywords = C0.keywords && C0.keywords.length > 0 ? C0.keywords.join(", ") : "input criteria"
  const c1Keywords = C1.keywords && C1.keywords.length > 0 ? C1.keywords.join(", ") : "supporting facts"
  const c3Keywords = C3.keywords && C3.keywords.length > 0 ? C3.keywords.join(", ") : "system parameters"

  questions.push({
    question: `When integrating the framework of "${C2.title}" into practical problem-solving, which specific cohort of key terms represents the core variables and requirements?`,
    options: [
      `${c0Keywords} (Preliminary parameters)`,
      `${c1Keywords} (Secondary variables)`,
      `${c2Keywords} (Mandatory core criteria)`,
      `${c3Keywords} (Alternative attributes)`
    ],
    correct: 2,
    difficulty: "medium",
    explanation: `The critical variables and terms associated with "${C2.title}" are highlighted as: ${c2Keywords}.`
  })

  // Question 4 [MEDIUM]: Medium contextual fill-in-the-blanks expert assertion
  const blankWord = C3.keywords && C3.keywords.length > 0 ? C3.keywords[0] : "concept"
  const alternateWord1 = C0.keywords && C0.keywords.length > 0 ? C0.keywords[0] : "theory"
  const alternateWord2 = C1.keywords && C1.keywords.length > 0 ? C1.keywords[0] : "formula"
  const alternateWord3 = C2.keywords && C2.keywords.length > 0 ? C2.keywords[0] : "method"

  const regex = new RegExp(`\\b${blankWord}\\b`, "i")
  let filledSentence = C3.content
  if (regex.test(C3.content)) {
    filledSentence = C3.content.replace(regex, "_______")
  } else {
    const words = C3.content.split(" ")
    if (words.length > 4) {
      const idx = Math.floor(words.length / 2)
      words[idx] = "_______"
      filledSentence = words.join(" ")
    } else {
      filledSentence = `"${C3.title}" is closely linked to the application of _______ in this lecture.`
    }
  }

  questions.push({
    question: `Review the following expert assertion from the lecture notes on "${C3.title}": \n\n"${filledSentence}" \n\nSelect the technically correct term that satisfies the structural blank:`,
    options: [
      alternateWord1,
      blankWord,
      alternateWord2,
      alternateWord3
    ],
    correct: 1,
    difficulty: "medium",
    explanation: `The full contextual statement from the lecture details is: "${C3.content}"`
  })

  // Question 5 [HARD]: Long analytical validation scenario
  questions.push({
    question: `Suppose you are tasked with auditing an academic project that incorporates the principles of "${C0.title}". The project documentation claims that "${C0.title}" is classified as a ${C0.topic.toLowerCase()} stating: "${C0.content}". \n\nDuring validation, you must ensure that all elements are properly aligned. Which of the following validation assertions represents the most technically accurate evaluation?`,
    options: [
      `[APPROVED] The project correctly designates "${C0.title}" as a "${C0.topic}" representing: "${C0.content}".`,
      `[REJECTED] The project incorrectly aligns "${C0.title}" as a "${C1.topic}" because it actually dictates: "${C1.content}".`,
      `[REJECTED] The project misclassifies "${C0.title}" as a "${C2.topic}" focusing exclusively on: "${C2.content}".`,
      `[REJECTED] The project contains structural errors because "${C0.title}" does not support: "${C3.content}".`
    ],
    correct: 0,
    difficulty: "hard",
    explanation: `Only the first option represents an accurate mapping of your study notes, correctly validating "${C0.title}" under its correct category of "${C0.topic}" and description.`
  })

  // Question 6 [HARD]: Long comparative operational synthesis
  questions.push({
    question: `In a high-level scientific paper comparing the theoretical architectures of "${C1.title}" (classified as a ${C1.topic.toLowerCase()}) and "${C2.title}" (classified as a ${C2.topic.toLowerCase()}), a researcher must synthesize their operational differences and joint applicability. \n\nWhich of the following comparative syntheses represents the most accurate relational explanation?`,
    options: [
      `Synthesis Alpha: "${C1.title}" addresses the concept that "${C1.content.slice(0, 50)}...", whereas "${C2.title}" focuses on the principle that "${C2.content.slice(0, 50)}...". Both operate as separate but complementary structures.`,
      `Synthesis Beta: "${C1.title}" and "${C2.title}" are theoretically identical in scope, with both asserting that "${C1.content.slice(0, 50)}...", rendering one redundant.`,
      `Synthesis Gamma: "${C1.title}" dictates the core functions of "${C2.content.slice(0, 50)}...", while "${C2.title}" is restricted strictly to "${C1.content.slice(0, 50)}...", suggesting a baseline operational inversion.`,
      `Synthesis Delta: "${C1.title}" operates as an active experimental technique, whereas "${C2.title}" has no formal mathematical, theoretical, or practical utility in this syllabus.`
    ],
    correct: 0,
    difficulty: "hard",
    explanation: `Synthesis Alpha represents the only accurate operational breakdown, correctly citing the individual definitions and complementary relationship of "${C1.title}" and "${C2.title}" as shown in your notes.`
  })

  return questions
}

function QuizContent() {
  const searchParams = useSearchParams()
  const noteId = searchParams.get("id")

  const [user, setUser] = React.useState<any>(null)
  const [notes, setNotes] = React.useState<NoteItem[]>([])
  const [selectedNote, setSelectedNote] = React.useState<NoteItem | null>(null)
  
  const [started, setStarted] = React.useState(false)
  const [currentQ, setCurrentQ] = React.useState(0)
  const [selected, setSelected] = React.useState<number | null>(null)
  const [isAnswered, setIsAnswered] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [finished, setFinished] = React.useState(false)
  const [timeLeft, setTimeLeft] = React.useState(180) 
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchUserAndNotes = async () => {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      const userId = currentUser?.id || "demo-user"
      if (currentUser) {
        setUser(currentUser)
      }
      const userNotes = getNotes(userId)
      setNotes(userNotes)
      if (userNotes.length > 0) {
        // Select note if deep-linked, else latest by default
        const preselected = userNotes.find(n => n.id === noteId)
        setSelectedNote(preselected || userNotes[0])
      }
      setLoading(false)
    }
    fetchUserAndNotes()
  }, [noteId])

  React.useEffect(() => {
    if (started && !finished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && started && !finished) {
      setFinished(true)
    }
  }, [started, finished, timeLeft])

  // Get active questions based on note content or fallback category
  const activeQuestions = React.useMemo(() => {
    if (!selectedNote) return CATEGORY_QUIZZES.general
    
    if (selectedNote.content && selectedNote.content.length > 0) {
      return generateQuizForNote(selectedNote)
    }
    
    const title = selectedNote.title.toLowerCase()
    if (title.includes("machine") || title.includes("learn") || title.includes("ai")) {
      return CATEGORY_QUIZZES.ml
    } else if (title.includes("calculus") || title.includes("math") || title.includes("limits") || title.includes("physics")) {
      return CATEGORY_QUIZZES.math
    } else if (title.includes("cell") || title.includes("bio") || title.includes("biology")) {
      return CATEGORY_QUIZZES.biology
    }
    return CATEGORY_QUIZZES.general
  }, [selectedNote])

  // Compute dynamic timer limit based on question difficulties
  const dynamicTimeLimit = React.useMemo(() => {
    return activeQuestions.reduce((acc, q) => {
      if (q.difficulty === "easy") return acc + 25
      if (q.difficulty === "medium") return acc + 40
      return acc + 60 // hard
    }, 0)
  }, [activeQuestions])

  // Initialize timeLeft dynamically before starting the quiz
  React.useEffect(() => {
    if (!started) {
      setTimeLeft(dynamicTimeLimit)
    }
  }, [dynamicTimeLimit, started])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleSelect = (idx: number) => {
    if (isAnswered) return
    setSelected(idx)
    setIsAnswered(true)
    
    if (idx === activeQuestions[currentQ].correct) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ(prev => prev + 1)
      setSelected(null)
      setIsAnswered(false)
    } else {
      setFinished(true)
      // Save stats dynamically back to the user's score averages
      const userId = user?.id || "demo-user"
      const percentage = Math.round((score / activeQuestions.length) * 100)
      recordQuizScore(userId, percentage)
      // Record study activity when a quiz is completed
      recordStudyActivity(userId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center py-20">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <BrainCircuit className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Practice Quizzes Locked</h1>
        <p className="text-xl text-muted-foreground mb-8">
          You don&apos;t have any smart notes yet. Quizzes are dynamically generated from the lectures and textbooks you upload!
        </p>
        <Button size="lg" className="h-14 px-12 text-lg rounded-full bg-gradient-primary text-white" asChild>
          <Link href="/dashboard/upload">
            <Plus className="mr-2 h-5 w-5" /> Generate Your First Notes
          </Link>
        </Button>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center py-12">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <BrainCircuit className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Practice Quizzes</h1>
        <p className="text-muted-foreground mb-8 max-w-lg">
          Select one of your dynamic notes below to test your retention and grasp of the core concepts!
        </p>

        {/* Note Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mb-8 text-left">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedNote?.id === note.id 
                  ? "border-primary bg-primary/5 ring-1 ring-primary" 
                  : "border-border hover:bg-muted/50 bg-background"
              }`}
            >
              <h3 className="font-semibold text-foreground line-clamp-1">{note.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{note.type} • {note.format}</p>
            </button>
          ))}
        </div>
        
        <Card className="w-full max-w-md glass-card mb-8 text-left">
          <CardContent className="p-6">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-muted-foreground flex items-center"><BookOpen className="mr-2 h-4 w-4" /> Selected Summary</span>
              <span className="font-medium max-w-[200px] truncate">{selectedNote?.title}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-muted-foreground flex items-center"><Clock className="mr-2 h-4 w-4" /> Time Limit</span>
              <span className="font-medium">{formatTime(dynamicTimeLimit)} Minutes</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-muted-foreground flex items-center"><CheckCircle2 className="mr-2 h-4 w-4" /> Questions</span>
              <span className="font-medium">{activeQuestions.length} Items</span>
            </div>
          </CardContent>
        </Card>
        
        <Button size="lg" className="h-14 px-12 text-lg rounded-full bg-gradient-primary text-white" onClick={() => { setStarted(true); setTimeLeft(dynamicTimeLimit); }}>
          Start Quiz Now
        </Button>
      </div>
    )
  }

  if (finished) {
    const percentage = Math.round((score / activeQuestions.length) * 100)
    const passed = percentage >= 70

    return (
      <div className="max-w-2xl mx-auto py-12">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="glass-card text-center border-t-8 border-t-primary overflow-hidden">
            <CardHeader className="bg-muted/30 pb-8">
              <div className="mx-auto bg-background p-4 rounded-full shadow-lg mb-4 inline-block">
                <Trophy className={`h-12 w-12 ${passed ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              </div>
              <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent className="py-8">
              <div className="text-6xl font-bold mb-2">
                {percentage}%
              </div>
              <p className="text-muted-foreground mb-8">
                You scored {score} out of {activeQuestions.length} correct.
              </p>
              
              <div className="space-y-4 text-left max-w-sm mx-auto">
                <div className="flex justify-between text-sm">
                  <span>Targeted Lecture:</span>
                  <span className="font-medium text-foreground max-w-[200px] truncate">{selectedNote?.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Passing Status:</span>
                  <span className={`font-semibold ${passed ? 'text-green-500' : 'text-orange-500'}`}>
                    {passed ? "Passed" : "Needs Review"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4 justify-center bg-muted/30 pt-6">
              <Button variant="outline" onClick={() => {
                setStarted(false); setFinished(false); setCurrentQ(0); setScore(0); setTimeLeft(dynamicTimeLimit); setIsAnswered(false); setSelected(null);
              }}>Retake Quiz</Button>
              {selectedNote && (
                <Button className="bg-gradient-primary text-white" asChild>
                  <Link href={`/dashboard/notes/preview?id=${selectedNote.id}`}>Review Notes</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Question {currentQ + 1} of {activeQuestions.length}</h2>
          <p className="text-sm text-muted-foreground truncate max-w-[300px]">{selectedNote?.title}</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full font-mono font-medium">
          <Clock className="h-4 w-4 text-primary" />
          {formatTime(timeLeft)}
        </div>
      </div>
      
      <Progress value={((currentQ + 1) / activeQuestions.length) * 100} className="mb-8" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-panel border-0 shadow-lg overflow-hidden">
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                  {selectedNote?.title}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  activeQuestions[currentQ].difficulty === "easy" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : activeQuestions[currentQ].difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}>
                  {activeQuestions[currentQ].difficulty}
                </span>
              </div>
              <CardTitle className="text-2xl leading-relaxed pt-2 whitespace-pre-wrap">{activeQuestions[currentQ].question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 mt-4">
              {activeQuestions[currentQ].options.map((opt, idx) => {
                const isSelected = selected === idx
                const isCorrect = idx === activeQuestions[currentQ].correct
                
                let stateClass = "border-border hover:bg-muted/50 hover:border-primary/50"
                if (isAnswered) {
                  if (isCorrect) stateClass = "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 font-semibold"
                  else if (isSelected && !isCorrect) stateClass = "bg-destructive/10 border-destructive text-destructive font-semibold"
                  else stateClass = "opacity-50 border-border"
                } else if (isSelected) {
                  stateClass = "border-primary bg-primary/5"
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${stateClass}`}
                  >
                    <span className="font-medium text-base sm:text-lg">{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 ml-2" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive shrink-0 ml-2" />}
                  </button>
                )
              })}
            </CardContent>
            
            {isAnswered && activeQuestions[currentQ].explanation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground flex gap-3 items-start"
              >
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block mb-1">Explanation:</strong>
                  {activeQuestions[currentQ].explanation}
                </div>
              </motion.div>
            )}

            <CardFooter className="justify-end pt-6">
              <Button 
                onClick={handleNext} 
                disabled={!isAnswered}
                className="bg-primary text-primary-foreground px-8 rounded-full h-12"
              >
                {currentQ < activeQuestions.length - 1 ? "Next Question" : "View Results"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function QuizPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <QuizContent />
    </React.Suspense>
  )
}
