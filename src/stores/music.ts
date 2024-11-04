import { defineStore } from "pinia"
import { ref, computed } from "vue"
import data from "@/data/data.json"
import { Music } from "@/types/music"

export const useMusicStore = defineStore("music", () => {
  // State
  const songs = ref<Music[]>(data.artists)
  const currentSongId = ref<number | null>(null)
  const isPlaying = ref(false)
  const searchQuery = ref("")
  const isMuted = ref(false)
  const isShuffled = ref(false)
  const shuffledQueue = ref<number[]>([])
  const repeatMode = ref<"none" | "one" | "all">("none")

  // Getters
  const currentSong = computed(() => songs.value.find((song) => song.id === currentSongId.value))

  const totalDuration = computed(() => {
    const totalSeconds = songs.value.reduce((acc, song) => {
      const [minutes, seconds] = song.duration.split(":").map(Number)
      return acc + minutes * 60 + seconds
    }, 0)
    const hours = Math.floor(totalSeconds / 3600)
    const remainingSeconds = totalSeconds % 3600
    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60
    return `${hours ? `${hours}h ` : ""}${minutes}mn ${seconds}s`
  })

  const filteredSongs = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return songs.value.filter(
      (song) => song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query),
    )
  })

  const currentSongIndex = computed(() => {
    if (!currentSongId.value) return -1
    return isShuffled.value
      ? shuffledQueue.value.indexOf(currentSongId.value)
      : songs.value.findIndex((song) => song.id === currentSongId.value)
  })

  // Actions
  function setCurrentSong(song: Music) {
    if (currentSongId.value === song.id) {
      isPlaying.value = !isPlaying.value
      return
    }
    currentSongId.value = song.id
    isPlaying.value = true
  }

  function nextSong() {
    if (!currentSongId.value) return

    if (repeatMode.value === "one") {
      return
    }

    const songsList = isShuffled.value ? shuffledQueue.value : songs.value.map((s) => s.id)
    const currentIndex = songsList.indexOf(currentSongId.value)
    const nextIndex = currentIndex + 1

    if (nextIndex >= songsList.length) {
      if (repeatMode.value === "all") {
        currentSongId.value = songsList[0]
      } else {
        isPlaying.value = false
      }
    } else {
      currentSongId.value = songsList[nextIndex]
    }
  }

  function previousSong() {
    if (!currentSongId.value) return

    if (repeatMode.value === "one") {
      return
    }

    const songsList = isShuffled.value ? shuffledQueue.value : songs.value.map((s) => s.id)
    const currentIndex = songsList.indexOf(currentSongId.value)

    if (currentIndex > 0) {
      currentSongId.value = songsList[currentIndex - 1]
    } else if (repeatMode.value === "all") {
      currentSongId.value = songsList[songsList.length - 1]
    }
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }

  function toggleLike(songId: number) {
    const song = songs.value.find((s) => s.id === songId)
    if (song) {
      song.liked = !song.liked
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function toggleShuffle() {
    isShuffled.value = !isShuffled.value
    if (isShuffled.value) {
      shuffledQueue.value = songs.value.map((song) => song.id).sort(() => Math.random() - 0.5)
    } else {
      shuffledQueue.value = []
    }
  }

  function toggleRepeat() {
    const modes: ("none" | "one" | "all")[] = ["none", "one", "all"]
    const currentIndex = modes.indexOf(repeatMode.value)
    repeatMode.value = modes[(currentIndex + 1) % modes.length]
  }

  return {
    // State
    songs,
    currentSongId,
    isPlaying,
    searchQuery,
    isMuted,
    isShuffled,
    shuffledQueue,
    repeatMode,

    // Getters
    currentSong,
    filteredSongs,
    totalDuration,
    currentSongIndex,

    // Actions
    setCurrentSong,
    togglePlay,
    toggleLike,
    setSearchQuery,
    nextSong,
    previousSong,
    toggleShuffle,
    toggleRepeat,
    toggleMute,
  }
})
