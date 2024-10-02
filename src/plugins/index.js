/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '@/router'
import { createPinia } from "pinia"
import { markRaw } from 'vue'

const pinia = createPinia()

// to use router in store
pinia.use(({ store }) => {
  store.$router = markRaw(router)
})

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
