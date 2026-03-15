import { useState, useMemo } from 'react'

const INITIAL_TOPICS = ['DSA', 'Java', 'Database', 'System Design']

const INITIAL_QUESTIONS = [
  { id: 1, question: 'Binary Search', topic: 'DSA', difficulty: 'Medium', solved: false },
  { id: 2, question: 'Two Sum', topic: 'DSA', difficulty: 'Easy', solved: true },
  { id: 3, question: 'OOP Principles', topic: 'Java', difficulty: 'Easy', solved: false },
  { id: 4, question: 'What is Indexing?', topic: 'Database', difficulty: 'Medium', solved: false },
  { id: 5, question: 'Design URL Shortener', topic: 'System Design', difficulty: 'Hard', solved: false },
]

export function useQuestions() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS)
  const [topics, setTopics] = useState(INITIAL_TOPICS)
  const [nextId, setNextId] = useState(6)

  function addQuestion(data) {
    setQuestions(prev => [...prev, { ...data, id: nextId, solved: false }])
    setNextId(n => n + 1)
  }

  function toggleSolved(id) {
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, solved: !q.solved } : q)
    )
  }

  function deleteQuestion(id) {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  function addTopic(name) {
    const trimmed = name.trim()
    if (!trimmed || topics.includes(trimmed)) return
    setTopics(prev => [...prev, trimmed])
  }

  function deleteTopic(name) {
    setTopics(prev => {
      const remaining = prev.filter(t => t !== name)
      const fallback = remaining[0] ?? 'General'
      setQuestions(qs =>
        qs.map(q => q.topic === name ? { ...q, topic: fallback } : q)
      )
      return remaining
    })
  }

  const stats = useMemo(() => {
    const total = questions.length
    const solved = questions.filter(q => q.solved).length
    const pct = total ? Math.round((solved / total) * 100) : 0
    return { total, solved, pending: total - solved, pct }
  }, [questions])

  return {
    questions,
    topics,
    stats,
    addQuestion,
    toggleSolved,
    deleteQuestion,
    addTopic,
    deleteTopic,
  }
}
