<template>
    <v-container class="fill-height">
      <v-responsive
        class="align-centerfill-height mx-auto"
        max-width="900"
      >
        <div class="text-center">
          <h1 class="text-h2 font-weight-bold px-4 py-4">Choose a Destination</h1>
          <h2 class="text-h4 font-weight-ligjht px-4 py-4">Choose a Destination Music Application you want your playlist to be Added to</h2>
        </div>
  
        <div class="py-4" />
  
        <v-row>
          <v-col cols="6" v-for="app in applist" :key="app.name">
              <v-card
                  :append-icon="app.appendIcon"
                  class="py-4"
                  :color="app.name == source ? 'red' : 'surface-variant'"
                  :prepend-icon="app.prependIcon"
                  rounded="lg"
                  variant="outlined"
                  link
                  @click="onClick(app.name)"
                  :disabled="app.isSource"
                  >
                  <template #title>
                      <h2 class="text-h5 font-weight-bold">{{ app.name }} {{ app.isSource ? '(Selected Source)' : '' }}</h2>
                  </template>
              </v-card>
          </v-col>
  
          <v-col cols="6">
              <v-card
                  class="py-4"
                  color="surface-variant"
                  prepend-icon="mdi-music"
                  rounded="lg"
                  variant="outlined"
                  >
                <template #title>
                      <h2 class="text-h5 font-weight-bold">Other Apps Coming Soon</h2>
                  </template>
              </v-card>
          </v-col>
      </v-row>
  
      </v-responsive>
    </v-container>
</template>

<script setup>
import useAppStore from "@/stores/appStore";
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter();

const props = defineProps({
    appsList: {
        default: [],
        required: true,
    },
    redirectRoute: {
        type: String,
        required: true,
    },
    appUrl: {
        type: String,
        required: true,
    }
})

// Fetch Client ID and Secrets from .env file
const clientId = import.meta.env.VITE_APP_YOUTUBE_CLIENT_ID
const clientSecret = import.meta.env.VITE_APP_YOUTUBE_CLIENT_SECRET
const apiKey = import.meta.env.VITE_APP_YOUTUBE_API_KEY

const source = computed(()=> useAppStore().getSrc)

// TODO: remove below hardcoded list
const applist = ref([
    {
        name: "Spotify",
        prependIcon: "mdi-spotify",
        appendIcon: "mdi-open-in-new",
        isSource: true, // Remove hardcoded value
        redirectRoute: "/spotifysrc"
    },
    {
        name: "Apple Music",
        prependIcon: "mdi-apple",
        appendIcon: "mdi-open-in-new",
        isSource: false,
        redirectRoute: "/spotifysrc" // TODO: Change
    },
    {
        name: "Youtube Music",
        prependIcon: "mdi-youtube",
        appendIcon: "mdi-open-in-new",
        isSource: false,
        redirectRoute: "/spotifysrc"// TODO: Change
    },
])

const onClick = (name) => {
      if (name  == 'Youtube') {
    oauthSignIn()
    }
    else if (name  == 'Spotify') {
        console.log("APp type SPotify")
    }
}

</script>
  
