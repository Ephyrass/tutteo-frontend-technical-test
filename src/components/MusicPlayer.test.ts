import { describe, it, expect, beforeEach, vi } from "vitest"
import { mount, VueWrapper } from "@vue/test-utils"
import { createPinia, setActivePinia } from "pinia"
import PlayList from "@/components/MusicPlaylist.vue"
import { useMusicStore } from "@/stores/music"
import { Music, MusicStore } from "@/types/music"

// Mock Lucide components
vi.mock("lucide-vue-next", () => ({
  Pause: {
    render: () => null,
  },
  Heart: {
    render: () => null,
  },
}))

describe("PlayList", () => {
  let wrapper: VueWrapper
  let store: MusicStore

  const mockSongs: Music[] = [
    {
      id: 1,
      title: "Test Song 1",
      artist: "Test Artist 1",
      album: "Test Album 1",
      cover: "/test-cover-1.jpg",
      duration: "3:45",
      song: "/test-song-1.mp3",
      liked: false,
    },
    {
      id: 2,
      title: "Test Song 2",
      artist: "Test Artist 2",
      album: "Test Album 2",
      cover: "/test-cover-2.jpg",
      duration: "4:20",
      song: "/test-song-2.mp3",
      liked: true,
    },
  ]

  beforeEach(() => {
    // Setup Pinia store for testing
    setActivePinia(createPinia())
    store = useMusicStore() as unknown as MusicStore

    // Mock store getters and methods
    vi.spyOn(store, "songs", "get").mockReturnValue(mockSongs)
    vi.spyOn(store, "totalDuration", "get").mockReturnValue("8:05")
    vi.spyOn(store, "filteredSongs", "get").mockReturnValue(mockSongs)
    vi.spyOn(store, "setSearchQuery").mockImplementation(vi.fn())
    vi.spyOn(store, "setCurrentSong").mockImplementation(vi.fn())

    wrapper = mount(PlayList)
  })

  it("should render playlist header with correct information", () => {
    expect(wrapper.find("h2").text()).toBe("Ma Playlist")
    expect(wrapper.text()).toContain("2 morceaux")
    expect(wrapper.text()).toContain("8:05")
  })

  it("should handle song search input", async () => {
    const searchQuery = "Test Song 1"
    const searchInput = wrapper.find('input[type="text"]')

    await searchInput.setValue(searchQuery)

    expect(store.setSearchQuery).toHaveBeenCalledWith(searchQuery)
    expect(store.setSearchQuery).toHaveBeenCalledTimes(1)
  })

  it("should display filtered songs list correctly", () => {
    const filteredSongs: Music[] = [mockSongs[0]]
    vi.spyOn(store, "filteredSongs", "get").mockReturnValue(filteredSongs)

    wrapper = mount(PlayList)
    const songElements = wrapper.findAll('[data-unit="song-item"]')

    expect(songElements).toHaveLength(1)
    expect(songElements[0].text()).toContain("Test Song 1")
    expect(songElements[0].text()).toContain("Test Artist 1")
  })

  it("should handle song selection", async () => {
    const firstSong = wrapper.find('[data-unit="song-item"]')
    await firstSong.trigger("click")

    expect(store.setCurrentSong).toHaveBeenCalledWith(
      expect.objectContaining<Partial<Music>>({
        id: 1,
        title: "Test Song 1",
      }),
    )
    expect(store.setCurrentSong).toHaveBeenCalledTimes(1)
  })

  it("should display correct playing indicator", () => {
    vi.spyOn(store, "currentSongId", "get").mockReturnValue(1)
    vi.spyOn(store, "isPlaying", "get").mockReturnValue(true)

    wrapper = mount(PlayList)
    const playingIndicator = wrapper.find(".animate-pulse")
    const pauseIcon = wrapper.find('[data-unit="pause-icon"]')

    expect(playingIndicator.exists()).toBe(true)
    expect(pauseIcon.exists()).toBe(false)
  })
})
