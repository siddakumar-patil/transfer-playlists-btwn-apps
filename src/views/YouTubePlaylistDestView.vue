<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900"
      v-if="playlist"
    >
      <div  class="text-center">
        <h1 class="text-h2 font-weight-bold px-4 py-4">Playlist- {{ playlist.name }}</h1>
      </div>

      <div class="py-4" />

      <v-card
          class="mx-auto"
          max-width="900"
          height="800"
          >
          <v-card-item class="bg-red-darken-4">

          <v-card-title class="font-weight-bold">
              {{ playlist.name  }}
          </v-card-title>

          <v-card-sub-title class="font-weight-light text-h8" >
           {{ playlist.tracks?.total }} Songs by {{ playlist?.owner?.display_name }} 
          </v-card-sub-title>

          <template v-slot:append>
              <v-icon size="xxx-large">mdi-spotify</v-icon>
          </template>
          </v-card-item>

          <v-card-text v-if="playlist?.description" class="pt-4">{{ playlist.description }}</v-card-text>
          <v-card-text v-else class="pt-4">No Description Available</v-card-text>

          <v-divider></v-divider>

          <v-virtual-scroll
              :items="playlist?.items"
              height="940"
              item-height="50"
          >
          <template v-slot:default="{ item }">
              <v-list-item class="py-2">
              <template v-slot:prepend>
                  <v-avatar
                      size="50"
                       rounded="0"
                       v-if="item.track?.album?.images"
                      >
                      <v-img
                          alt="Album Image"
                          :src="trackImage(item.track?.album?.images)"
                      ></v-img>
                  </v-avatar>
                  <v-avatar
                      size="50"
                      v-else
                      ><v-icon>mdi-youtube</v-icon>
                  </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold">{{ item.track?.name }}</v-list-item-title>
              <v-list-item-sub-title class="font-weight-light">{{ item.track.album?.name }}</v-list-item-sub-title>

              <template v-slot:append>
                  <v-btn
                  size="small"
                  variant="tonal"
                  >
                  View User

                  <v-icon
                      color="orange-darken-4"
                      end
                  >
                      mdi-open-in-new
                  </v-icon>
                  </v-btn>
              </template>
              </v-list-item>
          </template>
          </v-virtual-scroll>
      </v-card>

      <div class="text-center py-5">
        <v-btn @click="onClick" size="large" color="red" rounded append-icon="mdi-youtube">Add PlayList to Youtube</v-btn>
      </div>

    </v-responsive>

    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900"
      v-else
    >
      <div  class="text-center">
        <h1 class="text-h2 font-weight-bold px-4 py-4">Something went wrong :(</h1>
      </div>

      <div class="py-4" />

      <div class="text-center py-5">
        <v-btn @click="onClick" size="large" color="primary" rounded append-icon="mdi-home">Back to Home</v-btn>
      </div>

    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from "vue";
import { useRouter } from "vue-router"

import useUserStore from "@/stores/userStore"
import useYoutubeStore from "@/stores/youtubeStore"
import useSpotifyStore from "@/stores/spotifyStore";

// const router = useRouter()
const userStore = useUserStore()
const youtubeStore = useYoutubeStore()

const playlist = computed(() => useSpotifyStore().getTracks)
const youtubeAccessToken = computed(() => userStore.getYoutubeAccessToken)

let isLoading = ref(false) // TODO: added loader or progress bar on click

onMounted(() => {
   console.log("Spotify Playlist View Mounted: ", playlist.value)
})

const trackImage = (images) => {
  if (images[0]) {
    return images[0]?.url
  }
  else {
    return 'https://img.icons8.com/?size=100&id=cyBLpim2K7Ja&format=png&color=000000'
  }
}

onBeforeMount(() => {
  // Storing Access token into Pinia Store
  if (localStorage.getItem("youtubeAccessToken")) userStore.youtube_access_token = localStorage.getItem("youtubeAccessToken")

  // Delete Accesstoken from LocalStorage for security
  if (userStore.getYoutubeAccessToken !== null) localStorage.removeItem("youtubeAccessToken")
})

const onClick =async  () => {
  // TODO: remove below log
  console.log("Creating Playlist on Youtube:"+playlist.value.name )

  const playlisTitle = playlist.value.name + '-Music Playlist'
  const playlistDescription = playlist.value.description == '' ? 'Music Playlist by ' + playlist.value?.owner?.display_name : playlist.value.description

  if (playlist.value?.items) {
    
    const playlistId = await youtubeStore.createYoutubePrivatePlaylist(youtubeAccessToken.value, playlisTitle, playlistDescription)
    const queries = await youtubeStore.createYoutubeQueriesList(playlist.value?.items)
    const videoIds = await youtubeStore.fetchYoutubeMusicVideoIds(queries)
  
    await youtubeStore.addTracksToYoutubePlaylistUsingVideoIds(youtubeAccessToken, playlistId, videoIds)
  }
  // else if (playlist.value?.items) {
  //   const queries = youtubeStore.createYoutubeQueriesList(playlist.value?.items)
  // }
}

</script>
