import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiBookmark, FiCheck, FiArrowLeft } from 'react-icons/fi'
import { getDetails, getSimilar, posterUrl, backdropUrl } from '../services/tmdb'
import { useWatchlist } from '../context/WatchlistContext'
import MovieCard from './MovieCard'
import Loader from './Loader'
import './DetailsView.css'
import '../pages/Results.css'

export default function DetailsView({ type, id }) {
  const navigate = useNavigate()
  const { isSaved, toggle } = useWatchlist()
  const [data, setData] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    window.scrollTo({ top: 0 })

    Promise.all([getDetails(type, id), getSimilar(type, id)])
      .then(([details, sim]) => {
        if (cancelled) return
        setData(details)
        setSimilar((sim.results || []).slice(0, 12))
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [type, id])

  if (loading) return <Loader text="Details la rahe hain..." />

  if (error || !data)
    return (
      <section className="container empty-box">
        <h1 className="page-title">Oops!</h1>
        <p className="muted">{error || 'Details nahi mili.'}</p>
        <Link to="/" className="btn btn-primary">Home par jao</Link>
      </section>
    )

  const title = data.title || data.name
  const date = data.release_date || data.first_air_date || ''
  const year = date.slice(0, 4)
  const runtime =
    type === 'movie'
      ? data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : ''
      : data.number_of_seasons
        ? `${data.number_of_seasons} season${data.number_of_seasons > 1 ? 's' : ''}`
        : ''
  const rating = data.vote_average ? data.vote_average.toFixed(1) : null
  const cast = (data.credits?.cast || []).slice(0, 12)
  const trailer =
    (data.videos?.results || []).find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    (data.videos?.results || []).find((v) => v.site === 'YouTube')
  const poster = posterUrl(data.poster_path)
  const backdrop = backdropUrl(data.backdrop_path)
  const saved = isSaved(type, data.id)

  const handleToggle = () =>
    toggle({
      id: data.id,
      media_type: type,
      title,
      poster_path: data.poster_path,
      vote_average: data.vote_average,
      release_date: date,
    })

  return (
    <section className="container">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="muted"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', background: 'none', border: 'none', fontSize: '0.95rem' }}
      >
        <FiArrowLeft /> Back
      </button>

      <div className="details-hero glass">
        {backdrop && <div className="details-backdrop" style={{ backgroundImage: `url(${backdrop})` }} />}
        <div className="details-overlay" />
        <div className="details-body">
          {poster ? (
            <img className="details-poster" src={poster} alt={title} />
          ) : (
            <div className="details-poster-fallback">{title}</div>
          )}
          <div>
            <h1 className="details-title">{title}</h1>
            {data.tagline && <p className="details-tagline">{data.tagline}</p>}

            <div className="meta-row">
              {rating && <span className="meta-chip rating">★ {rating}</span>}
              {year && <span className="meta-chip">{year}</span>}
              {runtime && <span className="meta-chip">{runtime}</span>}
              {(data.genres || []).map((g) => (
                <span key={g.id} className="meta-chip">{g.name}</span>
              ))}
            </div>

            <p className="details-overview">
              {data.overview || 'Is title ki overview TMDB pe abhi maujood nahi hai.'}
            </p>

            <div className="details-actions">
              <button
                type="button"
                className={`btn ${saved ? 'btn-ghost' : 'btn-primary'}`}
                onClick={handleToggle}
              >
                {saved ? <FiCheck /> : <FiBookmark />}
                {saved ? 'Saved in Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {cast.length > 0 && (
        <>
          <h2 className="section-title">Cast</h2>
          <div className="cast-row">
            {cast.map((c) => (
              <div key={c.id} className="cast-card">
                {c.profile_path ? (
                  <img className="cast-photo" src={posterUrl(c.profile_path, 'w185')} alt={c.name} loading="lazy" />
                ) : (
                  <div className="cast-photo" />
                )}
                <p className="cast-name">{c.name}</p>
                <p className="cast-role">{c.character}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {trailer && (
        <>
          <h2 className="section-title">Trailer</h2>
          <div className="trailer-box">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </>
      )}

      {similar.length > 0 && (
        <>
          <h2 className="section-title">Similar {type === 'tv' ? 'Series' : 'Movies'}</h2>
          <div className="results-grid">
            {similar.map((item) => (
              <MovieCard key={item.id} item={item} type={type} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}