export type Music = {
  id: number
  title: string
  artist: string
  album: string
  cover: string
  liked: boolean
  song: string
  duration: string
}

export type MusicStore = {
  songs: Music[]
  totalDuration: string
  currentSongId: number | null
  isPlaying: boolean
  searchQuery: string
  filteredSongs: Music[]
  setSearchQuery: (query: string) => void
  setCurrentSong: (song: Music) => void
  toggleLike: (songId: number) => void
}
