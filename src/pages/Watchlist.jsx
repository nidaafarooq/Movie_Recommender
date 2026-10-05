import { Link } from 'react-router-dom'
import { FiTrash2 } from 'react-icons/fi'
import { useWatchlist } from '../context/WatchlistContext'
import MovieCard from '../components/MovieCard'
import './Results.css'

export default function Watchlist() {
  const { list, remove } = useWatchlist()

  if (list.length === 0)
    return (
      <section className="container empty-box">
        <h1 className="page-title">My Watchlist</h1>
        <p className="muted">Nothing saved yet. Take the quiz and save titles you love.</p>
        <Link to="/quiz" className="btn btn-primary">Find My Pick</Link>
      </section>
    )

  return (
    <section className="container">
      <div className="results-head">
        <h1 className="page-title">My Watchlist</h1>
        <p className="muted">{list.length} saved</p>
      </div>
      <div className="results-grid">
        {list.map((item) => (
          <div key={`${item.media_type}-${item.id}`}>
            <MovieCard item={item} type={item.media_type} />
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: '0.6rem', padding: '0.6rem' }}
              onClick={() => remove(item.media_type, item.id)}
            >
              <FiTrash2 /> Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}