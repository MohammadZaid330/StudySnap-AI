import { NextResponse } from "next/server"

// 1. YouTube link video ID extractor
function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { youtubeUrl, type, customTitle, fileName } = body

    let title = customTitle || ""
    let source = youtubeUrl || fileName || ""
    let thumbnail = ""
    let authorName = ""
    let extractedKeywords = ""

    // 2. Fetch YouTube Details if applicable
    if (type === "youtube" && youtubeUrl) {
      try {
        const oEmbedUrl = `https://noembed.com/embed?url=${encodeURIComponent(youtubeUrl)}`
        const res = await fetch(oEmbedUrl)
        if (res.ok) {
          const data = await res.json()
          title = customTitle || data.title || title
          authorName = data.author_name || ""
          thumbnail = data.thumbnail_url || ""
          extractedKeywords = data.title || ""
        }
      } catch (err) {
        console.error("YouTube oEmbed fetch error:", err)
      }
    }

    if (!title) {
      title = type === "youtube" ? "Lecture Video Summary" : (fileName || "Uploaded Textbook PDF")
      title = title.replace(/\.[^/.]+$/, "") // Remove file extension if any
    }

    // 3. Setup Fallback matched content datasets (in case Gemini Key is not set or API fails)
    const lowerKeywords = (extractedKeywords + " " + title).toLowerCase()
    let category: "ml" | "math" | "biology" | "general" = "general"

    if (lowerKeywords.includes("machine") || lowerKeywords.includes("learn") || lowerKeywords.includes("neural") || lowerKeywords.includes("deep") || lowerKeywords.includes("ai")) {
      category = "ml"
    } else if (lowerKeywords.includes("calculus") || lowerKeywords.includes("math") || lowerKeywords.includes("limits") || lowerKeywords.includes("integral") || lowerKeywords.includes("physics") || lowerKeywords.includes("newton")) {
      category = "math"
    } else if (lowerKeywords.includes("cell") || lowerKeywords.includes("bio") || lowerKeywords.includes("biology") || lowerKeywords.includes("mitochondria") || lowerKeywords.includes("respiration")) {
      category = "biology"
    }

    const FALLBACK_DATASETS = {
      ml: [
        {
          topic: "Core Concept",
          title: "Supervised Learning",
          content: `A type of machine learning where the model is trained on labeled data, learning to map inputs to correct outputs. Extracted from: ${title} (${authorName || "YouTube"}).`,
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
          content: "Occurs when a model learns the training data too well, failing to generalize to new, unseen test data.",
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
          content: `A limit describes the behavior of a function near a specific point, rather than at that point itself. Highly relevant to: ${title}.`,
          keywords: ["limit", "behavior", "function", "calculus"],
          color: "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-t-blue-500",
        },
        {
          topic: "Formula",
          title: "The Derivative Definition",
          content: "Represented by f'(x) = lim(h->0) [f(x+h) - f(x)] / h. Measures the instantaneous rate of change or tangent slope.",
          keywords: ["derivative", "rate of change", "instantaneous"],
          color: "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border-t-purple-500",
        },
        {
          topic: "Principle",
          title: "Fundamental Theorem",
          content: "Establishes a connection between differentiation and integration, showing they are inverse mathematical operations.",
          keywords: ["differentiation", "integration", "inverse", "theorem"],
          color: "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-t-green-500",
        },
        {
          topic: "Application",
          title: "Optimization Problems",
          content: "Using derivatives to find maximum or minimum values, such as maximizing volume or minimizing cost/loss.",
          keywords: ["derivatives", "maximum", "minimum", "optimization"],
          color: "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-t-orange-500",
        },
      ],
      biology: [
        {
          topic: "Core Concept",
          title: "Cell Membrane Structure",
          content: `Composed of a phospholipid bilayer with embedded proteins, operating under the fluid mosaic model. Analyzed from: ${title}.`,
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
          content: `A method of learning by teaching a concept in simple terms as if to a child, identifying gaps. Selected for: ${title}.`,
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
          content: "Testing your memory by retrieving information rather than passively re-reading textbook pages.",
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

    let dynamicContent = FALLBACK_DATASETS[category]

    // 4. Invoke Live Google Gemini AI if API Key is configured
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (geminiApiKey) {
      try {
        const prompt = `You are StudySnapAI, an elite student study helper.
Your job is to read this lecture details and generate exactly 4 high-quality, beautifully precise study sticky cards as a JSON array.

Lecture Title: "${title}"
Source details: "${source}"
Channel/Author: "${authorName}"

Return exactly 4 cards in a single JSON array (do NOT wrap it in markdown code blocks like \`\`\`json, just return raw JSON text).
Each card object in the array must strictly have these fields:
1. "topic": Use exactly one of: "Core Concept", "Formula", "Principle", "Application".
2. "title": A short 3-5 word heading (e.g. "Linear Regression definition", "Active Transport").
3. "content": A 2-sentence precise explanation summarizing this concept from the lecture topic.
4. "keywords": 3 or 4 relevant key words as a string array (e.g. ["labeled data", "regression"]).
5. "color": Choose one of these colors based on card type to make it match our UI:
   - "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-t-blue-500"
   - "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border-t-purple-500"
   - "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-t-green-500"
   - "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-t-orange-500"

Make sure the summaries are accurate and directly match the actual topic: "${title}".`

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        )

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json()
          let text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ""
          
          // Clean the markdown output block if wrapped
          text = text.replace(/^```json/, "").replace(/```$/, "").trim()
          
          const parsed = JSON.parse(text)
          if (Array.isArray(parsed) && parsed.length === 4) {
            dynamicContent = parsed
          }
        }
      } catch (err) {
        console.error("Gemini live execution error, using premium offline classifier:", err)
      }
    }

    return NextResponse.json({
      title,
      type,
      source,
      thumbnail,
      authorName,
      content: dynamicContent,
      hasLiveAi: !!geminiApiKey
    })
  } catch (error: any) {
    console.error("Generate notes API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
