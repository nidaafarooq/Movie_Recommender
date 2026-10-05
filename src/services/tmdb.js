const API_KEY = import.meta.env.VITE_TMDB_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const IMG_BASE = 'https://image.tmdb.org/t/p'

export const posterUrl = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : null

export const backdropUrl = (path, size = 'w1280') =>
  path ? `${IMG_BASE}/${size}${path}` : null

async function request(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error('API key missing. .env.local me VITE_TMDB_KEY check karo.')
  }

  const query = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...params,
  })

  const res = await fetch(`${BASE_URL}${endpoint}?${query}`)

  if (!res.ok) {
    throw new Error(`TMDB error ${res.status}. Key ya internet check karo.`)
  }

  return res.json()
}

export const getTrending = () => request('/trending/all/week')

export const discover = (type, filters = {}) =>
  request(`/discover/${type}`, {
    sort_by: 'popularity.desc',
    'vote_count.gte': 100,
    ...filters,
  })

export const getGenres = (type) => request(`/genre/${type}/list`)

export const getDetails = (type, id) =>
  request(`/${type}/${id}`, { append_to_response: 'credits,videos' })

export const getSimilar = (type, id) => request(`/${type}/${id}/similar`)

export async function getKeywordIds(names) {
  const responses = await Promise.all(
    names.map((n) => request('/search/keyword', { query: n }))
  )
  const ids = []
  responses.forEach((r, i) => {
    const match = (r.results || []).find(
      (k) => k.name.toLowerCase() === names[i].toLowerCase()
    )
    if (match) ids.push(match.id)
  })
  return ids.join('|')
}

// Surprise Me: random page se random popular title
export async function getRandomPick() {
  const type = Math.random() < 0.7 ? 'movie' : 'tv'
  const page = Math.floor(Math.random() * 10) + 1
  const data = await discover(type, {
    page,
    'vote_average.gte': 6.5,
    'vote_count.gte': 300,
  })
  const results = (data.results || []).filter((r) => r.poster_path)
  if (results.length === 0) throw new Error('Koi pick nahi mili, dobara try karo.')
  const pick = results[Math.floor(Math.random() * results.length)]
  return { type, id: pick.id }
}