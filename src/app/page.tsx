"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Brain, FileText, Lightbulb, PlayCircle, Sparkles, Target, MonitorPlay, Upload, Cpu, CheckSquare, ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"

const features = [
  {
    title: "YouTube Lecture Summarizer",
    description: "Paste a YouTube link and get a smart, structured summary of the entire lecture in seconds.",
    icon: <MonitorPlay className="h-6 w-6 text-red-500" />,
  },
  {
    title: "PDF Smart Notes Generator",
    description: "Upload your PDFs and extract only the most important exam-relevant concepts.",
    icon: <FileText className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Marks-wise Answer Generator",
    description: "Get answers specifically formatted for 2, 5, or 10 marks to ace your university exams.",
    icon: <Target className="h-6 w-6 text-green-500" />,
  },
  {
    title: "AI Quiz Generator",
    description: "Instantly generate MCQs and flashcards from your notes to test your recall.",
    icon: <Brain className="h-6 w-6 text-purple-500" />,
  },
  {
    title: "Sticky Notes Revision",
    description: "Color-coded sticky notes for quick glance revision right before the exam.",
    icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
  },
  {
    title: "Handwritten Notes Export",
    description: "Convert AI summaries into beautiful, realistic handwritten PDF notes.",
    icon: <BookOpen className="h-6 w-6 text-indigo-500" />,
  },
]

const faqs = [
  {
    question: "How does the YouTube Lecture Summarizer work?",
    answer: "Simply copy and paste any public YouTube lecture, university presentation, or educational video link. Our AI transcripts, extracts critical concepts, maps formulas, and structures them into colorful, quick-revision study guides instantly.",
  },
  {
    question: "Can I print or save my handwritten notes as PDFs?",
    answer: "Absolutely! The handwritten notebook page supports full standard A4 paper formatting with `@media print` layout overrides. When you click print, all headers, menus, and sidebars are automatically stripped away, leaving only a gorgeous, realistic ruled notebook page.",
  },
  {
    question: "How are the practice quiz questions generated?",
    answer: "Our dynamic quiz generator parses the context cards of your specific note. It produces exactly 6 high-yield mock test questions split across difficulties (2 Easy, 2 Medium, 2 Hard) complete with a matching countdown timer and automatic explanations.",
  },
  {
    question: "Is there a limit on how many summaries I can generate?",
    answer: "Our primary mission is absolute accessibility. You can generate unlimited summaries, revision sticky notes, practice quizzes, and realistic cursive notebook sheets completely free of charge.",
  },
  {
    question: "How does the statistics system calculate averages?",
    answer: "We store your quiz histories in local storage keyed uniquely by your profile to prevent data leakage. If your browser profile contains legacy 100% averages from developer test cycles, the client automatically detects and recalculates true mathematical averages as you practice."
  }
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null)
  return (
    <main className="flex min-h-screen flex-col overflow-hidden pt-24">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex items-center rounded-full border bg-background/50 backdrop-blur px-3 py-1 text-sm font-medium">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span>The AI Study Assistant for Students</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-7xl font-bold tracking-tight mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Transform Long Lectures & PDFs into <span className="text-gradient">Smart Exam Notes</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          AI-powered study assistant for quick revision, smart summaries, quizzes, and realistic handwritten notes. Ace your exams with zero stress.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button size="lg" className="w-full sm:w-auto rounded-full bg-gradient-primary hover:opacity-90 text-white text-lg h-14 px-8" asChild>
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full text-lg h-14 px-8" asChild>
            <Link href="/demo">
              <PlayCircle className="mr-2 h-5 w-5" /> Try Demo
            </Link>
          </Button>
        </motion.div>

        {/* Floating Elements / Decorative sticky notes */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 hidden lg:block opacity-70 hover:opacity-100 transition-opacity">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [-5, 0, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="sticky-note bg-yellow-200 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 w-48 font-handwriting text-xl transform -rotate-6"
          >
            "Remember to revise Chapter 4!"
          </motion.div>
        </div>

        <div className="absolute top-1/3 right-0 translate-x-1/3 hidden lg:block opacity-70 hover:opacity-100 transition-opacity">
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [5, 10, 5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="sticky-note bg-cyan-200 dark:bg-cyan-900/40 text-cyan-900 dark:text-cyan-100 w-52 font-handwriting text-xl transform rotate-12"
          >
            Newton's Laws:<br />1. Inertia<br />2. F=ma<br />3. Action/Reaction
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Study Smarter, Not Harder</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to convert hours of studying into minutes of high-yield revision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 group hover:shadow-2xl transition-all duration-300"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm border group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How it Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your raw course resources into pristine, active recall revision aids.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="glass-panel p-8 rounded-3xl relative flex flex-col items-center text-center">
              <div className="absolute -top-6 bg-gradient-primary h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20">
                1
              </div>
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mt-4 mb-6">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Upload & Share</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Paste any educational YouTube lecture URL or upload your textbooks, syllabus, and course PDFs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-8 rounded-3xl relative flex flex-col items-center text-center">
              <div className="absolute -top-6 bg-gradient-primary h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20">
                2
              </div>
              <div className="h-16 w-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 mt-4 mb-6">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Synthesis</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our localized AI engine parses the transcripts, extracts formulas, separates key terms, and structures your guide.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-8 rounded-3xl relative flex flex-col items-center text-center">
              <div className="absolute -top-6 bg-gradient-primary h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20">
                3
              </div>
              <div className="h-16 w-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mt-4 mb-6">
                <CheckSquare className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Practice & Master</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Study with realistic gel-pen notebook papers, take custom difficulty practice quizzes, and track true averages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We have answers. Explore our comprehensive FAQ to understand our capabilities.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="glass-panel rounded-2xl overflow-hidden transition-all duration-300 border border-muted/50"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-lg md:text-xl text-foreground hover:text-primary transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <span className="ml-4 flex-shrink-0 text-muted-foreground">
                      {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-muted-foreground text-md leading-relaxed border-t border-muted/10 pt-4 bg-muted/5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="glass-panel rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto bg-gradient-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
            <div className="relative z-10 text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Ace Your Next Exam?</h2>
              <p className="text-lg mb-10 opacity-90 max-w-2xl mx-auto">
                Join thousands of students who are already using StudySnap AI to save time and boost their grades.
              </p>
              <Button size="lg" className="rounded-full bg-white text-primary hover:bg-gray-100 text-lg h-14 px-8" asChild>
                <Link href="/signup">
                  Create Free Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
