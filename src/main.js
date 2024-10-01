import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

import router from '@/router'

const app = createApp(App)

registerPlugins(app)

// Event Listner for Login Popups
window.addEventListener("message", (event) => {
  if (event.origin !== "http://localhost:5000") {
    // Check the origin for security
    return
  }

  if (event.data.accessToken) {
    // Store the access token securely
    localStorage.setItem("youtubeAccessToken", event.data.accessToken)
    console.log("Access token received:", event.data.accessToken)

    // Optionally, redirect or update the UI
    router.push({ path: "/youtubeplaylistdest" })
  }
})
  

app.mount('#app')
