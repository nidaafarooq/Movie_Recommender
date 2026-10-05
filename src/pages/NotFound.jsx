import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container center-text">
      <h1 className="hero-title">404</h1>
      <p className="muted">Ye page maujood nahi hai.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
        Home par jao
      </Link>
    </section>
  )
}