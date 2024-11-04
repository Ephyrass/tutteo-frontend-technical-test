<template>
  <div
    class="w-full flex flex-col md:flex-row bg-white shadow-md p-4 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
  >
    <!-- Track Info -->
    <div class="flex items-center space-x-4 mb-4 md:w-1/5">
      <img
        v-if="store.currentSong?.cover"
        :src="store.currentSong?.cover"
        alt="Cover"
        class="w-16 h-16 rounded-md object-cover flex-shrink-0"
      />
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 truncate dark:text-white">
          {{ store.currentSong?.title }}
        </h3>
        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
          {{ store.currentSong?.artist }}
        </p>
      </div>
    </div>

    <!-- Player Controls -->
    <div class="flex items-center space-x-4 md:w-3/5 flex-col md:flex-row">
      <!-- Skip Backward -->
      <div class="flex items-center space-x-4">
        <button
          @click="store.previousSong"
          class="p-2 rounded-full hover:bg-orange-100 transition-colors dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Restart"
        >
          <SkipBack class="w-6 h-6" />
        </button>
        <!-- Play/Pause Button -->
        <button
          @click="togglePlay"
          class="p-2 rounded-full hover:bg-orange-100 transition-colors dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          :aria-label="store.isPlaying ? 'Pause' : 'Play'"
        >
          <Pause v-if="store.isPlaying" class="w-8 h-8" />
          <Play v-else class="w-8 h-8" />
        </button>
        <!-- Skip Forward -->
        <button
          @click="store.nextSong"
          class="p-2 rounded-full hover:bg-orange-100 transition-colors dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Skip"
        >
          <SkipForward class="w-6 h-6" />
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="flex-1 flex items-center max-md:w-full max-md:mt-5">
        <div class="flex mr-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{{ formatTime(currentTime) }}</span>
        </div>
        <div
          class="flex-1 relative h-2 bg-orange-200 rounded-full cursor-pointer dark:bg-orange-700"
          @click="seek"
          ref="progressRef"
        >
          <span class="absolute w-4 h-4 bg-white rounded-full" :style="{ left: `${progress}%`, top: '-50%' }"></span>

          <div class="absolute h-full bg-orange-500 rounded-full" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="flex ml-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{{ formatTime(duration) }}</span>
        </div>

        <!-- Shuffle and Repeat -->

        <div class="flex items-center space-x-4 ml-4">
          <div class="flex items-center space-x-4">
            <!-- Shuffle Button -->
            <button
              @click="store.toggleShuffle"
              class="hover:text-orange-500 transition-colors group"
              :class="{ 'text-orange-500': store.isShuffled }"
            >
              <Shuffle />
              <span class="sr-only">Shuffle</span>
            </button>

            <!-- Repeat Button -->
            <button
              @click="store.toggleRepeat"
              class="hover:text-orange-500 transition-colors relative group"
              :class="{
                'text-white-500': store.repeatMode !== 'none',
                'text-orange-500': store.repeatMode === 'one' || store.repeatMode === 'all',
              }"
            >
              <Repeat1 v-if="store.repeatMode === 'one'" class="w-6 h-6" />
              <Repeat v-else class="w-6 h-6" />

              <span class="sr-only">Repeat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Volume Control -->
    <div class="flex space-x-2 items-center justify-center md:w-1/5">
      <button
        @click="toggleMute()"
        class="p-2 rounded-full hover:bg-orange-100 transition-colors dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        :aria-label="store.isMuted ? 'Unmute' : 'Mute'"
      >
        <VolumeOff v-if="store.isMuted" class="w-6 h-6" />
        <Volume2 v-else class="w-6 h-6" />
      </button>
      <input
        type="range"
        min="0"
        max="100"
        v-model="volume"
        @input="updateVolume()"
        class="w-1/2 h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        :class="{
          '[&::-webkit-slider-thumb]:w-3': true,
          '[&::-webkit-slider-thumb]:h-3': true,
          '[&::-webkit-slider-thumb]:bg-orange-500': true,
          '[&::-webkit-slider-thumb]:rounded-full': true,
          '[&::-webkit-slider-thumb]:appearance-none': true,
        }"
      />
    </div>

    <!-- Hidden Audio Element -->
    <audio
      ref="audioRef"
      :src="store.currentSong?.song"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      @error="onError"
      class="hidden"
      typeof="audio/mpeg"
      autoplay
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import { Volume2, VolumeOff, SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, Repeat1 } from "lucide-vue-next"
import { useMusicStore } from "@/stores/music"

const store = useMusicStore()

const audioRef = ref<HTMLAudioElement | null>(null)
const progressRef = ref<HTMLDivElement | null>(null)
const duration = ref(0)
const currentTime = ref(0)
const savedVolume = ref(100)
const volume = ref(100)

// Computed
const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// Methods
const toggleMute = () => {
  store.toggleMute()
  if (store.isMuted) {
    savedVolume.value = volume.value
    volume.value = 0
  } else {
    volume.value = savedVolume.value
  }
  updateVolume()
}
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

const togglePlay = async (): Promise<void> => {
  if (!audioRef.value) return

  try {
    if (store.isPlaying) {
      await audioRef.value.pause()
    } else {
      await audioRef.value.play()
    }
    store.togglePlay()
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error toggling play:", error)
    }
  }
}

const seek = (event: MouseEvent): void => {
  if (!audioRef.value || !progressRef.value) return

  const rect = progressRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = x / rect.width

  audioRef.value.currentTime = percentage * duration.value
}

const updateVolume = (): void => {
  if (!audioRef.value) return
  audioRef.value.volume = volume.value / 100
}

const onTimeUpdate = (): void => {
  if (!audioRef.value) return
  currentTime.value = audioRef.value.currentTime
}

const onLoadedMetadata = (): void => {
  if (!audioRef.value) return
  duration.value = audioRef.value.duration
}

const onEnded = (): void => {
  if (store.repeatMode === "one") {
    audioRef.value?.play()
  } else {
    store.nextSong()
    currentTime.value = 0
  }
}

const onError = (event: Event): void => {
  const error = event as ErrorEvent
  console.error("Error loading audio:", error)
}

watch(
  () => store.isPlaying,
  () => {
    if (!audioRef.value) return

    if (store.isPlaying) {
      audioRef.value.play()
    } else {
      audioRef.value.pause()
    }
  },
)

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value / 100
  }
})

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.src = ""
  }
})
</script>
