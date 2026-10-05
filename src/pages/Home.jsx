import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCompass, FiShuffle, FiBookmark } from 'react-icons/fi'
import { getTrending, getRandomPick } from '../services/tmdb'
import MovieCard from '../components/MovieCard'
import './Home.css'

const features = [
  { icon: FiCompass, title: 'Smart Quiz', text: 'Tell us your mood, genre and industry, and we find the best picks for you.' },
  { icon: FiShuffle, title: 'Surprise Me', text: "Can't decide what to watch? One click gives you a random pick." },
  { icon: FiBookmark, title: 'Watchlist', text: 'Save your favorite movies and series and watch them later at ease.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [trending, setTrending] = useState([])
  const [surprising, setSurprising] = useState(false)
  const [surpriseError, setSurpriseError] = useState('')

  useEffect(() => {
    getTrending()
      .then((d) => setTrending((d.results || []).filter((r) => r.poster_path)))
      .catch(() => setTrending([]))
  }, [])

  const surprise = async () => {
    setSurprising(true)
    setSurpriseError('')
    try {
      const { type, id } = await getRandomPick()
      navigate(`/${type}/${id}`)
    } catch (err) {
      setSurpriseError(err.message)
      setSurprising(false)
    }
  }

  return (
    <section className="container">
      <div className="hero">
        <motion.span
          className="badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          ✨ Movies · Series · Bollywood · Hollywood · K-Drama
        </motion.span>
        <h1 className="hero-title">
          Tonight's pick, <span className="gradient-text">made for your mood.</span>
        </h1>
        <p className="hero-sub">
          Answer five quick questions and get movies and series picked just for you.
        </p>
        <div className="hero-actions">
          <Link to="/quiz" className="btn btn-primary">Find My Pick</Link>
          <button className="btn btn-ghost" type="button" onClick={surprise} disabled={surprising}>
            <FiShuffle /> {surprising ? 'Finding one...' : 'Surprise Me'}
          </button>
        </div>
        {surpriseError && <p className="muted" style={{ marginTop: '1rem' }}>{surpriseError}</p>}
      </div>

      {trending.length > 0 && (
        <>
          <div className="section-head">
            <h2>Trending this week</h2>
          </div>
          <div className="trending-row">
            {trending.map((item) => (
              <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
        </>
      )}

      <div className="grid-3" style={{ marginTop: '2rem' }}>
        {features.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            className="glass card feature"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.1 }}
            whileHover={{ y: -6 }}
          >
            <Icon className="feature-icon" />
            <h3>{title}</h3>
            <p className="muted">{text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}