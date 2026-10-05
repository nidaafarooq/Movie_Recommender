import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiCompass, FiBookmark, FiFilm } from 'react-icons/fi'

const links = [
  { to: '/', label: 'Home', icon: FiHome, end: true },
  { to: '/quiz', label: 'Discover', icon: FiCompass },
  { to: '/watchlist', label: 'Watchlist', icon: FiBookmark },
]

function NavItems({ group }) {
  return links.map(({ to, label, icon: Icon, end }) => (
    <NavLink key={to} to={to} end={end} className="nav-link">
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId={`pill-${group}`}
              className="nav-pill"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Icon className="nav-icon" />
          <span className="nav-label">{label}</span>
        </>
      )}
    </NavLink>
  ))
}

export default function Navbar() {
  return (
    <>
      <header className="navbar glass">
        <Link to="/" className="brand">
          <FiFilm /> Nida's <span>Picks</span>
        </Link>
        <nav className="nav-desktop">
          <NavItems group="top" />
        </nav>
      </header>

      <nav className="nav-mobile glass">
        <NavItems group="bottom" />
      </nav>
    </>
  )
}