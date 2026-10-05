export const TYPES = [
  { value: 'movie', label: 'Movies', emoji: '🎬' },
  { value: 'tv', label: 'TV Series', emoji: '📺' },
]

export const INDUSTRIES = [
  { value: 'en', label: 'Hollywood', emoji: '🇺🇸' },
  { value: 'hi', label: 'Bollywood', emoji: '🇮🇳' },
  { value: 'ko', label: 'Korean', emoji: '🇰🇷' },
  { value: 'tr', label: 'Turkish', emoji: '🇹🇷' },
  { value: 'ur', label: 'Pakistani', emoji: '🇵🇰' },
  { value: 'ta', label: 'Tamil', emoji: '🎭' },
  { value: 'te', label: 'Telugu', emoji: '🎭' },
  { value: 'ja', label: 'Japanese / Anime', emoji: '🇯🇵' },
  { value: '', label: 'Any language', emoji: '🌍' },
]

export const MOVIE_GENRES = [
  { id: 28, label: 'Action' },
  { id: 35, label: 'Comedy' },
  { id: 18, label: 'Drama' },
  { id: 10749, label: 'Romance' },
  { id: 27, label: 'Horror' },
  { id: 53, label: 'Thriller' },
  { id: 878, label: 'Sci-Fi' },
  { id: 14, label: 'Fantasy' },
  { id: 16, label: 'Animation' },
  { id: 80, label: 'Crime' },
  { id: 12, label: 'Adventure' },
  { id: 99, label: 'Documentary' },
]

export const TV_GENRES = [
  { id: 10759, label: 'Action & Adventure' },
  { id: 35, label: 'Comedy' },
  { id: 18, label: 'Drama' },
  { id: 'romance', label: 'Romance' },
  { id: 80, label: 'Crime' },
  { id: 9648, label: 'Mystery' },
  { id: 10765, label: 'Sci-Fi & Fantasy' },
  { id: 16, label: 'Animation' },
  { id: 99, label: 'Documentary' },
  { id: 10751, label: 'Family' },
  { id: 10764, label: 'Reality' },
]

export const ERAS = [
  { value: 'latest', label: 'Latest', sub: '2020 and newer', from: '2020-01-01', to: '' },
  { value: '2010s', label: '2010s', sub: '2010 to 2019', from: '2010-01-01', to: '2019-12-31' },
  { value: '2000s', label: '2000s', sub: '2000 to 2009', from: '2000-01-01', to: '2009-12-31' },
  { value: 'classic', label: 'Classics', sub: 'Before 2000', from: '', to: '1999-12-31' },
  { value: 'any', label: 'Any time', sub: 'No preference', from: '', to: '' },
]

export const RATINGS = [
  { value: 0, label: 'Any', sub: 'No minimum' },
  { value: 6, label: '6+', sub: 'Decent' },
  { value: 7, label: '7+', sub: 'Good' },
  { value: 8, label: '8+', sub: 'Top rated' },
]