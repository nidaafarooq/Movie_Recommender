import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TYPES, INDUSTRIES, MOVIE_GENRES, TV_GENRES, ERAS, RATINGS } from '../utils/constants'
import './Quiz.css'

const TITLES = [
  { title: 'Kya dekhna hai?', hint: 'Movie ya TV series, ek chuno.' },
  { title: 'Kaunsi industry?', hint: 'Language ke hisaab se chuno.' },
  { title: 'Kaunse genres pasand hain?', hint: 'Ek ya zyada chun sakti ho, phir Next dabao.' },
  { title: 'Kaunsa zamana?', hint: 'Naye ya purane, jo mood ho.' },
  { title: 'Minimum rating?', hint: 'Kitni achhi quality chahiye.' },
]

const TOTAL = TITLES.length
const GENRE_STEP = 2

export default function Quiz() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    type: '',
    lang: null,
    genres: [],
    era: '',
    rating: null,
  })

  const genreList = answers.type === 'tv' ? TV_GENRES : MOVIE_GENRES

  const finish = (final) => {
    const params = new URLSearchParams({
      type: final.type,
      lang: final.lang,
      genres: final.genres.join(','),
      era: final.era,
      rating: final.rating,
    })
    navigate(`/results?${params.toString()}`)
  }

  // Option click: answer save karo aur foran agle step par jao
  const choose = (patch) => {
    const updated = { ...answers, ...patch }
    setAnswers(updated)
    setTimeout(() => {
      if (step === TOTAL - 1) finish(updated)
      else setStep((s) => s + 1)
    }, 180)
  }

  const toggleGenre = (id) =>
    setAnswers((a) => ({
      ...a,
      genres: a.genres.includes(id)
        ? a.genres.filter((g) => g !== id)
        : [...a.genres, id],
    }))

  const back = () => setStep((s) => s - 1)

  const renderOptions = () => {
    if (step === 0)
      return TYPES.map((t) => (
        <button key={t.value} type="button"
          className={`option ${answers.type === t.value ? 'selected' : ''}`}
          onClick={() => choose({ type: t.value, genres: [] })}>
          <span className="option-emoji">{t.emoji}</span>{t.label}
        </button>
      ))

    if (step === 1)
      return INDUSTRIES.map((i) => (
        <button key={i.label} type="button"
          className={`option ${answers.lang === i.value ? 'selected' : ''}`}
          onClick={() => choose({ lang: i.value })}>
          <span className="option-emoji">{i.emoji}</span>{i.label}
        </button>
      ))

    if (step === GENRE_STEP)
      return genreList.map((g) => (
        <button key={g.id} type="button"
          className={`option ${answers.genres.includes(g.id) ? 'selected' : ''}`}
          onClick={() => toggleGenre(g.id)}>
          {g.label}
        </button>
      ))

    if (step === 3)
      return ERAS.map((e) => (
        <button key={e.value} type="button"
          className={`option ${answers.era === e.value ? 'selected' : ''}`}
          onClick={() => choose({ era: e.value })}>
          {e.label}<span className="option-sub">{e.sub}</span>
        </button>
      ))

    return RATINGS.map((r) => (
      <button key={r.value} type="button"
        className={`option ${answers.rating === r.value ? 'selected' : ''}`}
        onClick={() => choose({ rating: r.value })}>
        {r.label}<span className="option-sub">{r.sub}</span>
      </button>
    ))
  }

  return (
    <section className="container quiz-wrap">
      <div className="glass quiz-card">
        <div className="progress">
          <div className="progress-bar" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
        </div>
        <p className="step-count">Step {step + 1} of {TOTAL}</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="quiz-title">{TITLES[step].title}</h1>
            <p className="quiz-hint">{TITLES[step].hint}</p>
            <div className="option-grid">{renderOptions()}</div>
          </motion.div>
        </AnimatePresence>

        <div className="quiz-actions">
          <button type="button" className="btn btn-ghost" onClick={back} disabled={step === 0}>
            Back
          </button>
          {step === GENRE_STEP && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep((s) => s + 1)}
              disabled={answers.genres.length === 0}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </section>
  )
}