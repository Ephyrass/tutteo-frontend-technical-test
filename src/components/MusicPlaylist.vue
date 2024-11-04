<template>
  <div class="bg-slate-900 text-white rounded-lg p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Ma Playlist</h2>
      <div class="flex items-center space-x-4">
        <div class="text-sm text-slate-400">{{ store.songs.length }} morceaux • {{ store.totalDuration }}</div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative mb-6">
      <input
        :value="store.searchQuery"
        @input="(e) => store.setSearchQuery((e.target as HTMLInputElement).value)"
        type="text"
        placeholder="Rechercher une chanson..."
        class="w-full bg-slate-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>

    <!-- Song List  -->
    <div class="space-y-2 overflow-y-auto custom-scrollbar" style="height: 50vh">
      <TransitionGroup name="list">
        <div
          v-for="song in store.filteredSongs"
          :key="song.id"
          class="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          data-unit="song-item"
          :class="{ 'bg-slate-800': store.currentSongId === song.id }"
          @click="store.setCurrentSong(song)"
        >
          <!-- Play indicator and cover -->
          <div class="relative w-12 h-12 flex-shrink-0 max-sm:w-6 max-sm:h-6">
            <img :src="song.cover" :alt="song.album" class="w-full h-full object-cover rounded" />
            <div
              v-if="store.currentSongId === song.id"
              class="absolute inset-0 bg-black/40 flex items-center justify-center rounded"
            >
              <div v-if="store.isPlaying" class="flex space-x-1">
                <div v-for="n in 3" :key="n" class="w-1 h-3 bg-white animate-pulse" />
              </div>
              <Pause v-else class="w-6 h-6 text-white" data-unit="pause-icon" />
            </div>
          </div>

          <!-- Song info -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <div class="truncate">
                <p class="font-medium max-sm:text-sm" :class="{ 'text-orange-500': store.currentSongId === song.id }">
                  {{ song.title }}
                </p>
                <p class="text-sm text-slate-400 max-sm:text-xs">{{ song.artist }}</p>
              </div>

              <div class="flex items-center space-x-3 flex-shrink-0">
                <span class="text-sm text-slate-400 max-sm:text-xs">{{ song.duration }}</span>
                <button @click.stop="store.toggleLike(song.id)" class="hover:text-orange-500 transition-colors">
                  <Heart :class="song.liked ? 'text-red-500 fill-current' : 'text-slate-400'" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMusicStore } from "@/stores/music"
import { Pause, Heart } from "lucide-vue-next"

const store = useMusicStore()
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;
}
</style>
