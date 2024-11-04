<script setup lang="ts">
import MusicPlayer from "@/components/MusicPlayer.vue"
import MusicPlaylist from "@/components/MusicPlaylist.vue"
</script>

<template>
  <div class="dark:bg-gray-800 h-screen">
    <h1 class="p-6 text-3xl font-semibold text-gray-900 dark:text-gray-100">Flat</h1>
    <div class="container mx-auto p-6 max-sm:p-0">
      <MusicPlaylist />
    </div>
    <div class="bottom-0 fixed w-full bg-gray-900 text-white">
      <MusicPlayer
        audioSource="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        title="SoundHelix Song 1"
        artist="SoundHelix"
        coverImage="https://via.placeholder.com/150"
        autoplay
      />
    </div>
  </div>
</template>

<style scoped></style>
