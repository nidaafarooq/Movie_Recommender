import { Link } from 'react-router-dom'
import { posterUrl } from '../services/tmdb'
import './MovieCard.css'

export default function MovieCard({ item, type }) {
  const mediaType = item.media_type || type
  const title = item.title || item.name || 'Untitled'
  const date = item.release_date || item.first_air_date || ''
  const year = date ? date.slice(0, 4) : ''
  const poster = posterUrl(item.poster_path)
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null

  return (
    <Link to={`/${mediaType}/${item.id}`} className="movie-card">
      {poster ? (
        <img className="poster" src={poster} alt={title} loading="lazy" />
      ) : (
        <div className="poster-fallback">{title}</div>
      )}
      {rating && <span className="rating-badge">★ {rating}</span>}
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        {year && <p className="movie-year">{year}</p>}
      </div>
    </Link>
  )
}