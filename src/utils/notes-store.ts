// Dynamic Notes Store using localStorage keyed by user ID to avoid data bleeding between sessions

export interface NoteItem {
  id: string
  title: string
  type: 'youtube' | 'pdf'
  date: string
  source: string
  style: string
  format: string
  createdAt: string
  content: Array<{
    topic: string
    title: string
    content: string
    keywords: string[]
    color: string
  }>
}

export function getUserNotesKey(userId: string): string {
  return `studysnap-notes-${userId}`
}

export function getUserStatsKey(userId: string): string {
  return `studysnap-stats-${userId}`
}

export interface UserStats {
  streak: number
  hoursSaved: number
  quizAvg: number
  weeklyGoalProgress: number
  lastActiveDate?: string
  quizHistory?: number[]
}

const DEFAULT_STATS: UserStats = {
  streak: 0,
  hoursSaved: 0,
  quizAvg: 0,
  weeklyGoalProgress: 0,
  quizHistory: []
}

export function getLocalDateStr(): string {
  const today = new Date()
  const offset = today.getTimezoneOffset()
  const localToday = new Date(today.getTime() - (offset * 60 * 1000))
  return localToday.toISOString().split('T')[0]
}

export function getNotes(userId: string): NoteItem[] {
  if (typeof window === 'undefined') return []
  const key = getUserNotesKey(userId)
  const data = localStorage.getItem(key)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveNotes(userId: string, notes: NoteItem[]) {
  if (typeof window === 'undefined') return
  const key = getUserNotesKey(userId)
  localStorage.setItem(key, JSON.stringify(notes))
  
  // Recalculate stats automatically when notes change
  updateStatsFromNotes(userId, notes)
}

export function addNote(userId: string, note: Omit<NoteItem, 'id' | 'date' | 'createdAt'>): NoteItem {
  const notes = getNotes(userId)
  const newNote: NoteItem = {
    ...note,
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: 'Just now',
    createdAt: new Date().toISOString()
  }
  notes.unshift(newNote) // Add to beginning
  saveNotes(userId, notes)
  
  // Record study activity when a note is generated
  recordStudyActivity(userId)
  
  return newNote
}

export function deleteNote(userId: string, noteId: string) {
  let notes = getNotes(userId)
  notes = notes.filter(n => n.id !== noteId)
  saveNotes(userId, notes)
}

export function getStats(userId: string): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS
  const key = getUserStatsKey(userId)
  const data = localStorage.getItem(key)
  if (!data) return DEFAULT_STATS
  try {
    const stats: UserStats = JSON.parse(data)
    
    // Initialize or migrate quizHistory, auto-healing any stale mock average
    if (!stats.quizHistory) {
      if (stats.quizAvg === 100) {
        stats.quizHistory = []
        stats.quizAvg = 0
      } else {
        stats.quizHistory = stats.quizAvg > 0 ? [stats.quizAvg] : []
      }
    }
    
    // Check if the streak is broken (more than 1 day missed)
    if (stats.lastActiveDate) {
      const todayStr = getLocalDateStr()
      const parseLocalDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number)
        return new Date(Date.UTC(year, month - 1, day))
      }
      
      const todayDate = parseLocalDate(todayStr)
      const lastActiveDate = parseLocalDate(stats.lastActiveDate)
      const diffTime = todayDate.getTime() - lastActiveDate.getTime()
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays > 1) {
        stats.streak = 0 // Streak is broken
        localStorage.setItem(key, JSON.stringify(stats))
      }
    }
    
    return stats
  } catch {
    return DEFAULT_STATS
  }
}

export function saveStats(userId: string, stats: UserStats) {
  if (typeof window === 'undefined') return
  const key = getUserStatsKey(userId)
  localStorage.setItem(key, JSON.stringify(stats))
}

export function recordStudyActivity(userId: string) {
  if (typeof window === 'undefined') return
  const stats = getStats(userId)
  const todayStr = getLocalDateStr()
  
  if (!stats.lastActiveDate) {
    stats.streak = 1
    stats.lastActiveDate = todayStr
  } else {
    const parseLocalDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(Date.UTC(year, month - 1, day))
    }
    
    const todayDate = parseLocalDate(todayStr)
    const lastActiveDate = parseLocalDate(stats.lastActiveDate)
    const diffTime = todayDate.getTime() - lastActiveDate.getTime()
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      stats.streak = (stats.streak || 0) + 1
      stats.lastActiveDate = todayStr
    } else if (diffDays > 1) {
      stats.streak = 1
      stats.lastActiveDate = todayStr
    } else if (diffDays === 0) {
      if (!stats.streak || stats.streak === 0) {
        stats.streak = 1
      }
    }
  }
  
  saveStats(userId, stats)
}

function updateStatsFromNotes(userId: string, notes: NoteItem[]) {
  const stats = getStats(userId)
  stats.hoursSaved = Number((notes.length * 1.5).toFixed(1)) // Every note saves 1.5 hours of study
  stats.weeklyGoalProgress = Math.min(notes.length, 5) // Goal is 5 summaries
  
  if (notes.length === 0) {
    stats.streak = 0
    stats.weeklyGoalProgress = 0
    stats.quizAvg = 0
    stats.lastActiveDate = undefined
    stats.quizHistory = []
  }
  
  saveStats(userId, stats)
}

export function recordQuizScore(userId: string, percentage: number) {
  if (typeof window === 'undefined') return
  const stats = getStats(userId)
  
  if (!stats.quizHistory) {
    stats.quizHistory = []
  }
  
  stats.quizHistory.push(percentage)
  
  // Calculate true average
  const sum = stats.quizHistory.reduce((acc, score) => acc + score, 0)
  stats.quizAvg = Math.round(sum / stats.quizHistory.length)
  
  saveStats(userId, stats)
}
