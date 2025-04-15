# 🎶 Transfer Playlists Between Apps

A Vue 3 + Vuetify application that allows users to **seamlessly transfer playlists** between popular music platforms. Currently supports **Spotify** and **YouTube**.

## 🚀 Problem It Solves

Music lovers often switch between streaming platforms, whether due to new subscriptions, regional availability, or better features. However, **transferring playlists manually is a painful and time-consuming process** — you have to search for each song, rebuild the playlist, and sometimes the exact matches are hard to find.

**This app automates the entire process.** In just a few clicks, users can transfer their playlists between Spotify and YouTube, saving time and ensuring accuracy.

---

## ✨ Features

- 🔁 Transfer entire playlists between Spotify and YouTube
- 🔍 Automatically match songs across platforms
- 🎧 Clean and responsive UI using Vuetify
- 🔐 Secure OAuth authentication with Spotify and YouTube

---

## 🧱 Tech Stack

- [Vue 3](https://vuejs.org/)
- [Vuetify 3](https://next.vuetifyjs.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [Vite](https://vitejs.dev/)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/transfer-playlists-btwn-apps.git
cd transfer-playlists-btwn-apps
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create an `.env` File

Create a `.env` file in the root of the project and add your API credentials:

```env
VITE_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_APP_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

VITE_APP_YOUTUBE_CLIENT_ID=your_youtube_client_id
VITE_APP_YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
VITE_APP_YOUTUBE_API_KEY=your_youtube_api_key
```

> ⚠️ Make sure these credentials are **not** committed to version control!

### 4. Run the App

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Build for Production

```bash
npm run build
```

Serve the production build using any static file server or with:

```bash
npm run preview
```

---

## 🧹 Lint & Format

```bash
npm run lint
```

---

## 👤 Author

**Siddakumar Patil**  
📧 patilsiddakumar123@gmail.com

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
