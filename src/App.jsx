import { useState, useMemo } from 'react'
import { useQuestions } from './hooks/useQuestions'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const DIFF_COLOR = {
  Easy: '#16a34a',
  Medium: '#d97706',
  Hard: '#dc2626',
}

export default function App() {
  const {
    questions,
    topics,
    stats,
    addQuestion,
    toggleSolved,
    deleteQuestion,
    addTopic,
    deleteTopic,
  } = useQuestions()

  // Filter state
  const [search, setSearch] = useState('')
  const [filterTopic, setFilterTopic] = useState('')
  const [filterDiff, setFilterDiff] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Add question form state
  const [newQuestion, setNewQuestion] = useState('')
  const [newTopic, setNewTopic] = useState(topics[0])
  const [newDiff, setNewDiff] = useState('Medium')

  // Add topic form state
  const [newTopicName, setNewTopicName] = useState('')

  function handleAddQuestion(e) {
    e.preventDefault()
    if (!newQuestion.trim()) return
    addQuestion({ question: newQuestion.trim(), topic: newTopic, difficulty: newDiff })
    setNewQuestion('')
  }

  function handleAddTopic(e) {
    e.preventDefault()
    if (!newTopicName.trim()) return
    addTopic(newTopicName.trim())
    setNewTopicName('')
  }

  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (search && !q.question.toLowerCase().includes(search.toLowerCase())) return false
      if (filterTopic && q.topic !== filterTopic) return false
      if (filterDiff && q.difficulty !== filterDiff) return false
      if (filterStatus === 'solved' && !q.solved) return false
      if (filterStatus === 'unsolved' && q.solved) return false
      return true
    })
  }, [questions, search, filterTopic, filterDiff, filterStatus])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Interview Prep Tracker</h1>
        <p style={{ color: '#555', marginTop: 4 }}>
          {stats.solved} / {stats.total} solved ({stats.pct}%)
        </p>
        <div style={{ marginTop: 8, height: 6, background: '#ddd', borderRadius: 4 }}>
          <div
            style={{
              height: '100%',
              width: `${stats.pct}%`,
              background: '#16a34a',
              borderRadius: 4,
              transition: 'width 0.3s',
            }}
          />
        </div>
      </div>

      {/* Add Question Form */}
      <section style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: 8 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: '0.75rem' }}>Add Question</h2>
        <form onSubmit={handleAddQuestion} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            style={{ flex: 1, minWidth: 200, padding: '6px 10px', border: '1px solid #ccc', borderRadius: 5 }}
            type="text"
            placeholder="Question title..."
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
          />
          <select
            style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: 5 }}
            value={newTopic}
            onChange={e => setNewTopic(e.target.value)}
          >
            {topics.map(t => <option key={t}>{t}</option>)}
          </select>
          <select
            style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: 5 }}
            value={newDiff}
            onChange={e => setNewDiff(e.target.value)}
          >
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
          </select>
          <button
            type="submit"
            style={{ padding: '6px 16px', background: '#222', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}
          >
            Add
          </button>
        </form>
      </section>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input
          style={{ flex: 1, minWidth: 150, padding: '5px 10px', border: '1px solid #ccc', borderRadius: 5 }}
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          style={{ padding: '5px 10px', border: '1px solid #ccc', borderRadius: 5 }}
          value={filterTopic}
          onChange={e => setFilterTopic(e.target.value)}
        >
          <option value="">All Topics</option>
          {topics.map(t => <option key={t}>{t}</option>)}
        </select>
        <select
          style={{ padding: '5px 10px', border: '1px solid #ccc', borderRadius: 5 }}
          value={filterDiff}
          onChange={e => setFilterDiff(e.target.value)}
        >
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
        </select>
        <select
          style={{ padding: '5px 10px', border: '1px solid #ccc', borderRadius: 5 }}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>
      </div>

      {/* Question Table */}
      <section style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: 13, color: '#777', marginBottom: 6 }}>
          {filtered.length} question{filtered.length !== 1 ? 's' : ''}
        </p>
        {filtered.length === 0 ? (
          <p style={{ color: '#888', padding: '1.5rem', textAlign: 'center', background: '#fff', border: '1px solid #ddd', borderRadius: 8 }}>
            No questions found.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#555' }}>Done</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#555' }}>Question</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#555' }}>Topic</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#555' }}>Difficulty</th>
                <th style={{ padding: '8px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => (
                <tr key={q.id} style={{ borderTop: i > 0 ? '1px solid #eee' : 'none' }}>
                  <td style={{ padding: '8px 12px' }}>
                    <input
                      type="checkbox"
                      checked={q.solved}
                      onChange={() => toggleSolved(q.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: 14, textDecoration: q.solved ? 'line-through' : 'none', color: q.solved ? '#aaa' : '#222' }}>
                    {q.question}
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: 13, color: '#555' }}>{q.topic}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: DIFF_COLOR[q.difficulty] }}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: 16 }}
                      title="Delete"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Manage Topics */}
      <section style={{ padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: 8 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: '0.75rem' }}>Topics</h2>
        <form onSubmit={handleAddTopic} style={{ display: 'flex', gap: 8, marginBottom: '0.75rem' }}>
          <input
            style={{ flex: 1, padding: '5px 10px', border: '1px solid #ccc', borderRadius: 5 }}
            type="text"
            placeholder="New topic name..."
            value={newTopicName}
            onChange={e => setNewTopicName(e.target.value)}
          />
          <button
            type="submit"
            style={{ padding: '5px 14px', background: '#222', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}
          >
            Add
          </button>
        </form>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {topics.map(t => (
            <div
              key={t}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: '#f3f3f3', borderRadius: 5, fontSize: 13 }}
            >
              <span>{t}</span>
              {topics.length > 1 && (
                <button
                  onClick={() => deleteTopic(t)}
                  style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
                  title="Remove topic"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
