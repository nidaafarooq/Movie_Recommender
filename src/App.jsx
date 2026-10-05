import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import MovieDetails from './pages/MovieDetails'
import TvDetails from './pages/TvDetails'
import Watchlist from './pages/Watchlist'
import NotFound from './pages/NotFound'

const page = (element) => <PageTransition>{element}</PageTransition>

export default function App() {
  const location = useLocation()

  return (
    <div className="app">
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <Navbar />
      <main className="main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={page(<Home />)} />
            <Route path="/quiz" element={page(<Quiz />)} />
            <Route path="/results" element={page(<Results />)} />
            <Route path="/movie/:id" element={page(<MovieDetails />)} />
            <Route path="/tv/:id" element={page(<TvDetails />)} />
            <Route path="/watchlist" element={page(<Watchlist />)} />
            <Route path="*" element={page(<NotFound />)} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}