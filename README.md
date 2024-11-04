# Vue 3 Music Player

A modern music player built with Vue 3, TypeScript, Pinia, and Tailwind CSS. This project offers an elegant and responsive interface to manage and play your music library.

## 🌟 Features

- 🎵 Music playback with basic controls (play, pause, next, previous)
- 🔄 Playback modes (single repeat, total repeat, shuffle)
- ❤️ Favorites system
- 🔍 Real-time search
- 📱 Responsive interface
- 🎨 Modern design with dark theme
- 💾 State management with Pinia

## 🛠️ Technologies Used

- Vue 3 with Composition API
- TypeScript
- Pinia for state management
- Tailwind CSS for styling
- Lucide for icons
- Vite as bundler
- Vitest for unit test

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## 🚀 Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/vue-music-player.git
cd vue-music-player
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

## 📦 Project Structure

```
src/
├── assets/
├── components/
│   ├── MusicPlayer.vue     # Main player component
│   └── MusicPlaylist.vue   # Music list
│   └── MusicPlaylist.test.ts   # Unit test
├── stores/
│   └── useMusicStore.ts    # Pinia store
├── types/
│   └── music.ts            # TypeScript types
├── App.vue
└── main.ts
```

## 💻 Usage

### Pinia Store

```typescript
const store = useMusicStore()
// Playback controls
store.togglePlay()
store.playNext()
store.playPrevious()
// Playback modes
store.toggleShuffle()
store.toggleRepeat()
// Favorites management
store.toggleLike(songId)
```

### Components

```vue
<template>
  <div>
    <MusicPlayer />
    <MusicPlaylist />
  </div>
</template>
```

## ⚙️ Configuration

### Tailwind CSS

The project uses Tailwind CSS with a custom theme. You can modify the configuration in `tailwind.config.js`.

```javascript
module.exports = {
  content: ["./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      colors: {
        // Your custom colors
      },
    },
  },
}
```

### TypeScript Types

The main Types are defined in `src/types/index.ts`:

```typescript
type Mucis = {
  id: number
  title: string
  artist: string
  album: string
  duration: string
  coverUrl: string
  liked: boolean
}
```

## 🔄 Playback State

The player manages three playback modes:

- Normal: sequential playback
- Repeat:
  - Single song: repeats the current song
  - All: repeats the playlist
- Shuffle: plays in random order

## 📱 Responsive Design

The interface automatically adapts to different screen sizes:

- Desktop: full display
- Tablet: adaptive layout
- Mobile: touch-optimized controls

## 🔜 Roadmap

- [ ] CI/CD -> https://docs.github.com/fr/actions
- [ ] Improve UI & UX design
- [ ] Support for custom playlists
- [ ] Vue Router
- [ ] Integration with streaming APIs
- [ ] Keyboard shortcuts support
- [ ] Persistence with server
- [ ] E2E Test
