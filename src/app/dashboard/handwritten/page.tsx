"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Printer, Share2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { getNotes, NoteItem, recordStudyActivity } from "@/utils/notes-store"
import { toast } from "sonner"

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
      topic: "1. First Law (Inertia)",
      title: "Newton's First Law (Inertia)",
      content: "An object remains at rest or in uniform motion unless acted upon by a net external force.",
      keywords: ["net force", "inertia", "external force"],
      color: "",
    },
    {
      topic: "2. Second Law (F = ma)",
      title: "Newton's Second Law",
      content: "The acceleration of an object depends on the mass of the object and the amount of force applied.",
      keywords: ["acceleration", "mass", "applied force"],
      color: "",
    },
    {
      topic: "3. Third Law (Action & Reaction)",
      title: "Newton's Third Law",
      content: "For every action, there is an equal and opposite reaction.",
      keywords: ["forces pairs", "action", "reaction"],
      color: "",
    },
  ]
}

interface HandwrittenDiagramProps {
  noteTitle: string;
  noteContent: Array<{ title: string; content: string }>;
}

function HandwrittenDiagram({ noteTitle, noteContent }: HandwrittenDiagramProps) {
  const titleLower = noteTitle.toLowerCase()
  const contentTextLower = noteContent.map(c => c.title + " " + c.content).join(" ").toLowerCase()
  const combinedLower = (titleLower + " " + contentTextLower)

  let category: "ml" | "physics" | "math_graph" | "biology" | "chemistry" | "cs_systems" | null = null
  let categoryLabel = ""

  if (
    combinedLower.includes("machine learning") || 
    combinedLower.includes("machine-learning") ||
    combinedLower.includes("neural network") || 
    combinedLower.includes("neural-network") ||
    combinedLower.includes("deep learning") ||
    combinedLower.includes("deep-learning") ||
    combinedLower.includes("artificial intelligence") ||
    combinedLower.includes("gradient descent") ||
    combinedLower.includes("backpropagation") ||
    combinedLower.includes("transformer model")
  ) {
    category = "ml"
    categoryLabel = "Neural Network & Feed-Forward Architecture"
  } else if (
    combinedLower.includes("physics") || 
    combinedLower.includes("mechanics") ||
    combinedLower.includes("newton's") || 
    combinedLower.includes("newton") || 
    combinedLower.includes("gravity") ||
    combinedLower.includes("friction") ||
    combinedLower.includes("incline") ||
    combinedLower.includes("force vector") ||
    combinedLower.includes("tension") ||
    combinedLower.includes("acceleration") ||
    combinedLower.includes("kinematics")
  ) {
    category = "physics"
    categoryLabel = "Classical Mechanics: Incline Force Vectors"
  } else if (
    combinedLower.includes("calculus") || 
    combinedLower.includes("derivative") ||
    combinedLower.includes("integral") ||
    combinedLower.includes("limits") ||
    combinedLower.includes("limit") ||
    combinedLower.includes("tangent line") ||
    combinedLower.includes("coordinate graph") ||
    combinedLower.includes("slope") ||
    combinedLower.includes("differentiation") ||
    combinedLower.includes("integration")
  ) {
    category = "math_graph"
    categoryLabel = "Differential Calculus: Curve Tangent Graph"
  } else if (
    combinedLower.includes("cell ") || 
    combinedLower.includes("biology") ||
    combinedLower.includes("membrane") ||
    combinedLower.includes("lipid bilayer") ||
    combinedLower.includes("mitochondria") ||
    combinedLower.includes("active transport") ||
    combinedLower.includes("diffusion") ||
    combinedLower.includes("osmosis") ||
    combinedLower.includes("cellular")
  ) {
    category = "biology"
    categoryLabel = "Cell Bilayer & Active Transport Channel"
  } else if (
    combinedLower.includes("chemistry") ||
    combinedLower.includes("chemical") ||
    combinedLower.includes("covalent") ||
    combinedLower.includes("ionic bond") ||
    combinedLower.includes("molecule") ||
    combinedLower.includes("h2o") ||
    combinedLower.includes("water molecule") ||
    combinedLower.includes("atomic structure") ||
    combinedLower.includes("valence electron")
  ) {
    category = "chemistry"
    categoryLabel = "Molecular Structure & Polar Covalent Bond"
  } else if (
    combinedLower.includes("http") ||
    combinedLower.includes("client-server") ||
    combinedLower.includes("client server") ||
    combinedLower.includes("database") ||
    combinedLower.includes("sql query") ||
    combinedLower.includes("network") ||
    combinedLower.includes("router") ||
    combinedLower.includes("rest api") ||
    combinedLower.includes("dns lookup")
  ) {
    category = "cs_systems"
    categoryLabel = "System Architecture: Client-Server HTTP"
  }

  // If no highly relevant academic subject is matched, do not render a diagram container
  if (!category) return null

  return (
    <div className="h-[13.5rem] my-[2.25rem] flex flex-col items-center justify-center border-y border-dashed border-slate-300/40 bg-slate-50/10 rounded-2xl transform rotate-[0.5deg] select-none">
      <div className="text-xl text-slate-400/90 mb-[0.25rem] italic font-semibold">
        Sketch A.1: {categoryLabel}
      </div>
      <div className="transform scale-[0.85] md:scale-100 flex items-center justify-center">
        {category === "ml" && (
          <svg width="280" height="150" viewBox="0 0 280 150" className="text-blue-700/80 dark:text-blue-400">
            {/* Inputs */}
            <circle cx="45" cy="30" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="45" cy="70" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="45" cy="110" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="20" y="35" fontFamily="var(--font-caveat), cursive" fontSize="16" className="fill-current">x₁</text>
            <text x="20" y="75" fontFamily="var(--font-caveat), cursive" fontSize="16" className="fill-current">x₂</text>
            <text x="20" y="115" fontFamily="var(--font-caveat), cursive" fontSize="16" className="fill-current">x₃</text>
            
            {/* Hidden Layer */}
            <circle cx="135" cy="45" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="135" cy="95" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="130" y="50" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current">h₁</text>
            <text x="130" y="100" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current">h₂</text>

            {/* Output Layer */}
            <circle cx="225" cy="70" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="220" y="75" fontFamily="var(--font-caveat), cursive" fontSize="16" className="fill-current">ŷ</text>

            {/* Connections input -> hidden */}
            <path d="M 55 30 L 123 45" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            <path d="M 55 30 L 123 95" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            <path d="M 55 70 L 123 45" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M 55 70 L 123 95" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M 55 110 L 123 45" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            <path d="M 55 110 L 123 95" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" fill="none" />

            {/* Connections hidden -> output */}
            <path d="M 147 45 L 215 70" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M 147 95 L 215 70" stroke="currentColor" strokeWidth="1.5" fill="none" />
            
            {/* Weights Labels */}
            <text x="75" y="28" fontFamily="var(--font-caveat), cursive" fontSize="12" className="fill-current">w₁₁</text>
            <text x="75" y="85" fontFamily="var(--font-caveat), cursive" fontSize="12" className="fill-current">w₂₁</text>
            <text x="175" y="48" fontFamily="var(--font-caveat), cursive" fontSize="12" className="fill-current">v₁</text>
            
            {/* Activation formula */}
            <text x="70" y="138" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current text-slate-500 font-semibold">ŷ = σ(Σ wᵢ hᵢ + b)</text>
          </svg>
        )}

        {category === "physics" && (
          <svg width="280" height="150" viewBox="0 0 280 150" className="text-purple-700/80 dark:text-purple-400">
            {/* Incline Plane Triangle */}
            <path d="M 40 120 L 230 120 L 40 40 Z" stroke="currentColor" strokeWidth="2" fill="none" />
            {/* Angle theta */}
            <path d="M 195 120 A 35 35 0 0 0 170 95" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="180" y="112" fontFamily="var(--font-caveat), cursive" fontSize="16" className="fill-current">θ</text>

            {/* Block sitting on incline */}
            <path d="M 100 65 L 130 52 L 140 75 L 110 88 Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="115" y="74" fontFamily="var(--font-caveat), cursive" fontSize="16" className="fill-current">m</text>

            {/* Gravity force vector pointing straight down */}
            <path d="M 120 70 L 120 110" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M 117 103 L 120 110 L 123 103" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="125" y="108" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current text-red-600 font-bold">Fg = mg</text>

            {/* Normal force vector perpendicular to incline */}
            <path d="M 120 70 L 140 46" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M 134 50 L 140 46 L 137 53" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="142" y="42" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current text-blue-600 font-bold">FN</text>

            {/* Friction force vector parallel to incline pointing up/left */}
            <path d="M 120 70 L 95 59" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M 101 59 L 95 59 L 98 64" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="75" y="55" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current text-green-600 font-bold">Ff</text>

            {/* Force Equation */}
            <text x="45" y="140" fontFamily="var(--font-caveat), cursive" fontSize="16" className="fill-current font-bold">Fnet = mg•sin(θ) - Ff</text>
          </svg>
        )}

        {category === "math_graph" && (
          <svg width="280" height="150" viewBox="0 0 280 150" className="text-rose-700/80 dark:text-rose-400">
            {/* Y Axis */}
            <path d="M 40 10 L 40 130" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M 37 17 L 40 10 L 43 17" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="30" y="18" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current">y</text>

            {/* X Axis */}
            <path d="M 30 120 L 240 120" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M 233 117 L 240 120 L 233 123" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="235" y="135" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current">x</text>

            {/* Curve f(x) */}
            <path d="M 50 105 C 100 100 130 30 200 25" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <text x="205" y="32" fontFamily="var(--font-caveat), cursive" fontSize="16" className="fill-current font-semibold text-rose-800">y = f(x)</text>

            {/* Tangent line at point */}
            <path d="M 90 102 L 180 30" stroke="currentColor" strokeWidth="1.5" className="text-blue-600" fill="none" />
            <circle cx="135" cy="66" r="4.5" fill="currentColor" className="text-blue-600" />
            
            {/* Labeled point P(x, y) */}
            <text x="142" y="70" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current text-blue-700">P(x, f(x))</text>

            {/* Tangent formula */}
            <text x="55" y="142" fontFamily="var(--font-caveat), cursive" fontSize="15" className="fill-current text-slate-500 font-semibold">Slope = f'(x) = lim [f(x+h)-f(x)] / h</text>
          </svg>
        )}

        {category === "biology" && (
          <svg width="280" height="150" viewBox="0 0 280 150" className="text-emerald-700/80 dark:text-emerald-400">
            {/* Top heads */}
            <circle cx="35" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="55" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="75" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            
            <circle cx="205" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="225" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="245" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />

            {/* Bottom heads */}
            <circle cx="35" cy="90" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="55" cy="90" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="75" cy="90" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            
            <circle cx="205" cy="90" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="225" cy="90" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="245" cy="90" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />

            {/* Tails top */}
            <path d="M 35 36 Q 33 50 37 62 M 37 36 Q 39 50 35 62" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 55 36 Q 53 50 57 62 M 57 36 Q 59 50 55 62" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 75 36 Q 73 50 77 62 M 77 36 Q 79 50 75 62" stroke="currentColor" strokeWidth="1" fill="none" />

            <path d="M 205 36 Q 203 50 207 62 M 207 36 Q 209 50 205 62" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 225 36 Q 223 50 227 62 M 227 36 Q 229 50 225 62" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 245 36 Q 243 50 247 62 M 247 36 Q 249 50 245 62" stroke="currentColor" strokeWidth="1" fill="none" />

            {/* Tails bottom */}
            <path d="M 35 84 Q 33 70 37 58 M 37 84 Q 39 70 35 58" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 55 84 Q 53 70 57 58 M 57 84 Q 59 70 55 58" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 75 84 Q 73 70 77 58 M 77 84 Q 79 70 75 58" stroke="currentColor" strokeWidth="1" fill="none" />

            <path d="M 205 84 Q 203 70 207 58 M 207 84 Q 209 70 205 58" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 225 84 Q 223 70 227 58 M 227 84 Q 229 70 225 58" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 245 84 Q 243 70 247 58 M 247 84 Q 249 70 245 58" stroke="currentColor" strokeWidth="1" fill="none" />

            {/* Channel Protein */}
            <path d="M 105 20 C 115 20 110 100 105 100 C 95 100 97 20 105 20 Z" stroke="currentColor" strokeWidth="2" fill="none" className="fill-orange-100/30" />
            <path d="M 175 20 C 165 20 170 100 175 100 C 185 100 183 20 175 20 Z" stroke="currentColor" strokeWidth="2" fill="none" className="fill-orange-100/30" />

            {/* Transport Arrow */}
            <circle cx="140" cy="12" r="4.5" fill="currentColor" className="text-red-500" />
            <path d="M 140 18 L 140 98" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            <path d="M 136 91 L 140 98 L 144 91" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="148" y="96" fontFamily="var(--font-caveat), cursive" fontSize="13" className="fill-current text-red-500 font-bold">K⁺ / Na⁺</text>

            {/* ATP release label */}
            <text x="80" y="118" fontFamily="var(--font-caveat), cursive" fontSize="12" className="fill-current text-amber-600 font-bold">ATP → ADP + Pi</text>
            <text x="50" y="138" fontFamily="var(--font-caveat), cursive" fontSize="15" className="fill-current font-bold text-emerald-800">Active Membrane Transport</text>
          </svg>
        )}

        {category === "chemistry" && (
          <svg width="280" height="150" viewBox="0 0 280 150" className="text-cyan-700/80 dark:text-cyan-400">
            {/* Oxygen Atom */}
            <circle cx="140" cy="55" r="22" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <text x="133" y="62" fontFamily="var(--font-caveat), cursive" fontSize="26" className="fill-current font-bold">O</text>
            <text x="132" y="25" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current text-red-600 font-bold">δ⁻ (partial negative)</text>

            {/* Hydrogen 1 */}
            <circle cx="70" cy="95" r="14" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="65" y="101" fontFamily="var(--font-caveat), cursive" fontSize="18" className="fill-current font-bold">H</text>
            <text x="40" y="112" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current text-blue-600 font-bold">δ⁺</text>

            {/* Hydrogen 2 */}
            <circle cx="210" cy="95" r="14" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="205" y="101" fontFamily="var(--font-caveat), cursive" fontSize="18" className="fill-current font-bold">H</text>
            <text x="225" y="112" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current text-blue-600 font-bold">δ⁺</text>

            {/* Covalent bonds */}
            <path d="M 120 70 L 82 87" stroke="currentColor" strokeWidth="2" strokeDasharray="1 1" fill="none" />
            <path d="M 160 70 L 198 87" stroke="currentColor" strokeWidth="2" strokeDasharray="1 1" fill="none" />

            {/* Shared electron dots */}
            <circle cx="101" cy="78" r="3" fill="currentColor" />
            <circle cx="179" cy="78" r="3" fill="currentColor" />

            {/* Bond Angle */}
            <path d="M 115 78 A 30 30 0 0 0 165 78" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
            <text x="122" y="98" fontFamily="var(--font-caveat), cursive" fontSize="14" className="fill-current text-yellow-600 font-semibold">Angle: 104.5°</text>

            {/* Water Molecule label */}
            <text x="65" y="140" fontFamily="var(--font-caveat), cursive" fontSize="16" className="fill-current font-bold">Polar Covalent Bond Sketch</text>
          </svg>
        )}

        {category === "cs_systems" && (
          <svg width="280" height="150" viewBox="0 0 280 150" className="text-teal-700/80 dark:text-teal-400">
            {/* Client Laptop Icon */}
            <path d="M 30 85 L 70 85 L 75 100 L 25 100 Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="33" y="55" width="34" height="28" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="32" y="47" fontFamily="var(--font-caveat), cursive" fontSize="13" className="fill-current font-semibold">Client (Browser)</text>

            {/* Server Icon */}
            <rect x="205" y="45" width="45" height="55" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
            <line x1="205" y1="63" x2="250" y2="63" stroke="currentColor" strokeWidth="1.5" />
            <line x1="205" y1="81" x2="250" y2="81" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="215" cy="54" r="2.5" fill="currentColor" className="text-green-500" />
            <circle cx="215" cy="72" r="2.5" fill="currentColor" className="text-green-500" />
            <circle cx="215" cy="90" r="2.5" fill="currentColor" className="text-green-500" />
            <text x="202" y="37" fontFamily="var(--font-caveat), cursive" fontSize="13" className="fill-current font-semibold">Server</text>

            {/* HTTP Request Arrow */}
            <path d="M 80 62 Q 137 50 195 62" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M 188 56 L 195 62 L 187 66" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="92" y="45" fontFamily="var(--font-caveat), cursive" fontSize="12" className="fill-current text-indigo-600 font-bold">GET /api/v1/notes</text>

            {/* HTTP Response Arrow */}
            <path d="M 195 85 Q 137 97 80 85" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M 87 91 L 80 85 L 88 81" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="96" y="110" fontFamily="var(--font-caveat), cursive" fontSize="12" className="fill-current text-emerald-600 font-bold">200 OK + JSON</text>

            {/* Label */}
            <text x="75" y="136" fontFamily="var(--font-caveat), cursive" fontSize="16" className="fill-current font-bold">HTTP Request-Response Cycle</text>
          </svg>
        )}
      </div>
    </div>
  )
}

function HandwrittenContent() {
  const searchParams = useSearchParams()
  const noteId = searchParams.get("id")
  
  const [note, setNote] = React.useState<NoteItem | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchNote = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || "demo-user"

      recordStudyActivity(userId)
      const userNotes = getNotes(userId)
      
      if (noteId) {
        const found = userNotes.find(n => n.id === noteId)
        if (found) {
          setNote(found)
          setLoading(false)
          return
        }
      } else if (userNotes.length > 0) {
        // If no specific noteId is requested, default to the user's most recent custom note
        setNote(userNotes[0])
        setLoading(false)
        return
      }

      setNote(DEFAULT_PHYSICS_NOTE)
      setLoading(false)
    }
    fetchNote()
  }, [noteId])

  const downloadPDF = async () => {
    if (!note) {
      toast.error("No note is loaded yet.", { id: "pdf-download" })
      return
    }

    toast.loading("Generating your realistic handwritten PDF...", { id: "pdf-download" })

    try {
      const element = document.querySelector(".print-paper-sheet")
      if (!element) {
        toast.error("Handwritten sheet element not found.", { id: "pdf-download" })
        return
      }

      if (!(window as any).html2pdf) {
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        script.integrity = "sha512-GsLlZN/3F2ErC5IfS51RRXXC6KV21XBpE5fYYttM1VUsAMrtxCkq5gq2tO240xxxgI18HcV3e+GCJ+27hwdecQ=="
        script.crossOrigin = "anonymous"
        script.referrerPolicy = "no-referrer"
        
        const loadPromise = new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
        document.head.appendChild(script)
        await loadPromise
      }

      const html2pdf = (window as any).html2pdf

      const opt = {
        margin: [0, 0, 0, 0],
        filename: `${note.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-handwritten.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          backgroundColor: "#FDFBF7",
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      await html2pdf().set(opt).from(element).save()
      toast.success("Downloaded handwritten PDF successfully!", { id: "pdf-download" })
    } catch (error) {
      console.error("PDF generation failed:", error)
      toast.error("Failed to generate PDF. Opening system print dialog instead...", { id: "pdf-download" })
      window.print()
    }
  }

  if (loading || !note) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const backLink = note.id === "default-physics" 
    ? "/dashboard/upload" 
    : `/dashboard/notes/preview?id=${note.id}`

  const titleLower = note.title.toLowerCase()
  const categoryName = (titleLower.includes("machine") || titleLower.includes("learn") || titleLower.includes("ai") || titleLower.includes("neural") || titleLower.includes("http") || titleLower.includes("server") || titleLower.includes("database"))
    ? "Computer Science"
    : (titleLower.includes("physics") || titleLower.includes("mechanics") || titleLower.includes("gravity") || titleLower.includes("force"))
    ? "Physics"
    : (titleLower.includes("calculus") || titleLower.includes("derivative") || titleLower.includes("integral") || titleLower.includes("math"))
    ? "Mathematics"
    : (titleLower.includes("cell") || titleLower.includes("bio") || titleLower.includes("biology") || titleLower.includes("membrane"))
    ? "Biology"
    : (titleLower.includes("chemistry") || titleLower.includes("chemical") || titleLower.includes("molecule") || titleLower.includes("atom"))
    ? "Chemistry"
    : "Revision Notes"

  const formattedDate = new Date(note.createdAt || Date.now()).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  })

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Custom print styles to export only the beautiful ruled paper sheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide all surrounding layout, header, sidebars and controls */
          aside,
          header,
          .no-print,
          button,
          .ThemeToggle,
          [class*="ThemeToggle"],
          [class*="sidebar"],
          [class*="header"] {
            display: none !important;
          }
          
          /* Reset parent spacing, margins, shadows and backgrounds */
          body,
          html,
          main,
          div[class*="min-h-screen"],
          div[class*="flex-1"],
          div[class*="bg-muted"],
          .max-w-6xl,
          .max-w-4xl {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            box-shadow: none !important;
            border: none !important;
            display: block !important;
            overflow: visible !important;
          }

          /* Force print-paper-sheet to take full printable size with organic lines */
          .print-paper-sheet {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 100vh !important;
            padding-top: 4.5rem !important;
            padding-left: 4.5rem !important;
            padding-right: 2.5rem !important;
            background-color: #FDFBF7 !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          /* Lock background graphics to render in color on standard paper */
          * {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      ` }} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 no-print">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href={backLink}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Handwritten Export</h1>
            <p className="text-sm text-muted-foreground mt-1">Generated from: {note.title}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button size="sm" className="rounded-xl bg-gradient-primary text-white border-0" onClick={downloadPDF}>
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto bg-[#FDFBF7] shadow-2xl overflow-hidden rounded-2xl border border-[#e8dfce] print-paper-sheet"
        style={{ 
          width: "100%", 
          maxWidth: "800px", 
          minHeight: "1000px",
          backgroundSize: "100% 2.25rem",
          backgroundImage: "linear-gradient(transparent 2.2rem, rgba(225,213,192,0.6) 2.2rem, rgba(225,213,192,0.6) 2.25rem)",
          backgroundPosition: "0 4.5rem",
          paddingTop: "4.5rem",
          paddingLeft: "4.5rem",
          paddingRight: "2.5rem"
        }}
      >
        {/* Notebook top margin header lines */}
        <div className="absolute top-0 left-0 right-0 h-[4.5rem] border-b border-red-300/40 px-12 flex justify-between items-end pb-2 text-[1.1rem] text-slate-400 font-handwriting select-none">
          <div className="font-semibold text-slate-500/80">Subject: {categoryName}</div>
          <div className="flex gap-6 font-semibold text-slate-500/80">
            <div>Date: {formattedDate}</div>
            <div>Page: 01</div>
          </div>
        </div>

        {/* Notebook pink left margin line */}
        <div className="absolute top-0 bottom-0 left-[3.5rem] w-[2px] bg-red-400/30" />
        
        {/* Handwritten Content */}
        <div className="font-handwriting text-3xl leading-[2.25rem] text-[#1B365D] pb-12 pt-1 select-text">
          <h2 className="relative text-center m-0 h-[4.5rem] flex items-end justify-center pb-[0.35rem] text-4xl font-bold leading-none select-text">
            <span className="relative z-10">{note.title}</span>
            {/* Sketched handwritten double underline */}
            <span className="absolute bottom-[0.12rem] left-[15%] right-[15%] h-[3px] border-b-2 border-t border-[#1B365D]/30 pointer-events-none" />
          </h2>
          
          <div className="mt-[2.25rem]">
            {note.content.map((card, idx) => (
              <div key={idx} className="mb-[2.25rem]">
                <div className="m-0 text-red-700/90 font-bold text-2xl leading-[2.25rem] h-[2.25rem] flex items-end pb-[0.25rem] select-none">
                  ✱ {idx + 1}. {card.title}
                  <span className="font-handwriting text-xl text-slate-500/80 italic ml-3 font-medium select-none">
                    ({card.topic})
                  </span>
                </div>
                <p className="m-0 text-slate-800 text-2xl leading-[2.25rem] font-medium pt-[0.35rem]">
                  {card.content}
                </p>
                {card.keywords && card.keywords.length > 0 && (
                  <div className="m-0 text-[1.25rem] leading-[2.25rem] h-[2.25rem] flex items-end pb-[0.25rem] gap-2 select-none">
                    <span className="text-blue-700/80 font-bold">Key Terms:</span>
                    <div className="flex gap-3 items-end pb-[0.05rem]">
                      {card.keywords.slice(0, 3).map((kw, kwIdx) => (
                        <span key={kwIdx} className="relative inline-block px-2 text-xl leading-none h-[1.5rem] flex items-center justify-center font-bold">
                          <span className="absolute inset-0 bg-yellow-200/60 rounded-sm -rotate-1.5 transform scale-x-105" />
                          <span className="relative text-blue-950/90">{kw}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Dynamic Relevant Hand-Drawn SVG Diagram */}
          <HandwrittenDiagram noteTitle={note.title} noteContent={note.content} />
        </div>
      </motion.div>
    </div>
  )
}

export default function HandwrittenNotesPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <HandwrittenContent />
    </React.Suspense>
  )
}
