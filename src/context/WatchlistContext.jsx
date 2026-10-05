import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
  const [list, setList] = useLocalStorage('nidas-picks-watchlist', [])

  const isSaved = (type, id) =>
    list.some((i) => i.id === Number(id) && i.media_type === type)

  const add = (item) => setList((prev) => [item, ...prev])

  const remove = (type, id) =>
    setList((prev) => prev.filter((i) => !(i.id === Number(id) && i.media_type === type)))

  const toggle = (item) =>
    isSaved(item.media_type, item.id) ? remove(item.media_type, item.id) : add(item)

  return (
    <WatchlistContext.Provider value={{ list, isSaved, add, remove, toggle }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  return useContext(WatchlistContext)
}