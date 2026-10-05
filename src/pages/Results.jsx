import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { discover, getKeywordIds } from '../services/tmdb'
import { ERAS, INDUSTRIES } from '../utils/constants'
import MovieCard from '../components/MovieCard'
import Loader from '../components/Loader'
import './Results.css'

const ROMANCE_KEYWORDS = ['romance', 'teen romance', 'love triangle', 'first love']

const RELAX_NOTES = [
  '',
  'Rating ke saath kam titles mile, isliye rating filter dheela kar diya.',
  'Rating aur zamane ke saath kam titles mile, isliye dono dheele kar diye.',
  'Genres ke saath bhi kam titles mile, isliye sirf tumhari industry ke popular titles dikha rahe hain.',
]

export default function Results() {
  const [params] = useSearchParams()
  const [items, setItems] = useState([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const buildRef = useRef(null)
  const levelRef = useRef(0)

  const type = params.get('type') || 'movie'
  const lang = params.get('lang') || ''
  const genres = params.get('genres') || ''
  const era = params.get('era') || 'any'
  const rating = params.get('rating') || '0'

  const industryLabel = INDUSTRIES.find((i) => i.value === lang)?.label || ''

  useEffect(() => {
    let cancelled = false
    const eraData = ERAS.find((e) => e.value === era)
    const dateKey = type === 'tv' ? 'first_air_date' : 'primary_release_date'

    const rawGenres = genres ? genres.split(',') : []
    const wantsRomanceTv = type === 'tv' && rawGenres.includes('romance')
    const genreIds = rawGenres.filter((g) => g !== 'romance')

    const buildFilters = (level, keywordIds) => {
      const f = {}

      if (lang === 'ur') f.with_origin_country = 'PK'
      else if (lang) f.with_original_language = lang

      f['vote_count.gte'] = lang === 'ur' ? 0 : lang ? 20 : 100

      if (level < 3) {
        if (genreIds.length) f.with_genres = genreIds.join('|')
        if (keywordIds) f.with_keywords = keywordIds
      }
      if (level < 2) {
        if (eraData?.from) f[`${dateKey}.gte`] = eraData.from
        if (eraData?.to) f[`${dateKey}.lte`] = eraData.to
      }
      if (level < 1 && Number(rating) > 0) f['vote_average.gte'] = rating
      return f
    }

    async function load() {
      setLoading(true)
      setError('')
      setPage(1)
      try {
        const keywordIds = wantsRomanceTv ? await getKeywordIds(ROMANCE_KEYWORDS) : ''
        for (let level = 0; level <= 3; level++) {
          const data = await discover(type, buildFilters(level, keywordIds))
          if (cancelled) return
          if (data.results && data.results.length > 0) {
            buildRef.current = () => buildFilters(level, keywordIds)
            levelRef.current = level
            setItems(data.results)
            setTotalPages(Math.min(data.total_pages || 1, 500))
            setNote(RELAX_NOTES[level])
            return
          }
        }
        setItems([])
        setNote('')
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [type, lang, genres, era, rating])

  const loadMore = async () => {
    if (!buildRef.current) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const data = await discover(type, { ...buildRef.current(), page: nextPage })
      setItems((prev) => {
        const seen = new Set(prev.map((i) => i.id))
        return [...prev, ...(data.results || []).filter((i) => !seen.has(i.id))]
      })
      setPage(nextPage)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) return <Loader text="Tumhare liye picks dhoondh rahe hain..." />

  if (error)
    return (
      <section className="container empty-box">
        <h1 className="page-title">Oops!</h1>
        <p className="muted">{error}</p>
        <Link to="/quiz" className="btn btn-primary">Dobara try karo</Link>
      </section>
    )

  if (items.length === 0)
    return (
      <section className="container empty-box">
        <h1 className="page-title">Kuch nahi mila</h1>
        <p className="muted">
          {industryLabel
            ? `${industryLabel} ka is type me TMDB pe abhi data nahi hai. Koi aur industry ya type try karo.`
            : 'Internet ya API check karke dobara try karo.'}
        </p>
        <Link to="/quiz" className="btn btn-primary">Quiz dobara do</Link>
      </section>
    )

  return (
    <section className="container">
      <div className="results-head">
        <h1 className="page-title">Your Picks</h1>
        <p className="muted">
          {items.length} {industryLabel ? `${industryLabel} ` : ''}
          {type === 'tv' ? 'series' : 'movies'} tumhare mood ke hisaab se
        </p>
        {note && (
          <p style={{ marginTop: '0.6rem', color: 'var(--accent)' }}>ℹ️ {note}</p>
        )}
      </div>
      <div className="results-grid">
        {items.map((item) => (
          <MovieCard key={item.id} item={item} type={type} />
        ))}
      </div>

      {page < totalPages && (
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </section>
  )
}