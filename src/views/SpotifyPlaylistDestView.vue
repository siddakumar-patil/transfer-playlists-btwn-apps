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

      <div class="text-center" v-if="isLoading">
        <h1 class="text-h3 font-weight-bold px-4 py-4">Transfering Playlist<v-icon 
          class="mb-4"
          size="50">
          mdi-progress-check
        </v-icon></h1>
        <v-progress-linear
          color="green"
          indeterminate
        ></v-progress-linear>
      </div>

      <div class="text-center" v-if="!isLoading && isTransferCompleted">
        <h1 class="text-h3 font-weight-bold px-4 py-4">Transfer Completed!<v-icon 
          class="mb-4"
          color="green"
          size="50">
          mdi-check-circle-outline
        </v-icon>
        </h1>
      </div>

      <div class="py-4" />

      <v-card
          class="mx-auto"
          max-width="900"
          height="800"
          >
          <v-card-item class="bg-green-darken-4">

          <v-card-title class="font-weight-bold">
              {{ playlist?.name  }}
          </v-card-title>

          <v-card-sub-title class="font-weight-light text-h8" >
           {{ playlist.tracks?.total }} Songs by {{ playlist?.owner?.display_name }} 
          </v-card-sub-title>

          <template v-slot:append>
              <v-icon size="xxx-large">mdi-youtube</v-icon>
          </template>
          </v-card-item>

          <v-card-text v-if="playlist?.description" class="pt-4">{{ playlist.description }}</v-card-text>
          <v-card-text v-else class="pt-4">No Description Available</v-card-text>

          <v-divider></v-divider>

          <v-virtual-scroll
              :items="playlist?.tracks?.items"
              height="940"
              item-height="50"
          >
          <template v-slot:default="{ item }">
              <v-list-item class="py-2">
              <template v-slot:prepend>
                  <v-avatar
                      size="50"
                      ><v-icon>mdi-youtube</v-icon>
                  </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold">{{ item?.name }}</v-list-item-title>
              <v-list-item-sub-title class="font-weight-light">{{ item?.channelName}}</v-list-item-sub-title>

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

      <div class="text-center py-5" v-if="!isTransferCompleted">
        <v-btn @click="onClick" size="large" color="green" rounded append-icon="mdi-spotify">Add PlayList to Spotify</v-btn>
      </div>

      <div class="text-center py-5" v-else>
        <v-btn @click="router.push('/')" size="large" color="blue" rounded append-icon="mdi-home">Return to Home</v-btn>
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
        <v-btn @click="onClickHome" size="large" color="primary" rounded append-icon="mdi-home">Back to Home</v-btn>
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

const router = useRouter();

const userStore = useUserStore()
const youtubeStore = useYoutubeStore()

const playlist = computed(() => youtubeStore.getYoutubeVidoes)

let isLoading = ref(false)
let isTransferCompleted = ref(false)

onBeforeMount(() => {
  // Storing Access token into Pinia Store
  if (localStorage.getItem("spotifyAuthAccessToken")) userStore.spotify_auth_access_token = localStorage.getItem("spotifyAuthAccessToken")

  // Delete Accesstoken from LocalStorage for security
  if (userStore.getUserSpotifyAuthAccessToken !== null) localStorage.removeItem("spotifyAuthAccessToken")
})

const onClick =async  () => {
  console.log("Creating Playlist on Spotify:" + playlist.value.name)

  isLoading.value = true;
  const playlisTitle = playlist.value.name + '-Music Playlist'
  const playlistDescription = playlist.value.description == '' ? 'Music Playlist by ' + playlist.value?.owner?.display_name : playlist.value.description

  if (playlist.value?.tracks) {

    const userId = await useUserStore().getSpotifyUserId()

    const playlistId = await useSpotifyStore().createPlaylist(userId, playlisTitle, playlistDescription)
    const queries = await useSpotifyStore().createSpotifyQueriesList(playlist.value?.tracks?.items)
    const trackIds = await useSpotifyStore().fetchSpotifyTrackId(queries)
    await useSpotifyStore().addTracksToSpotifyPlaylistUsingTrackIds(playlistId?.id, trackIds)

    isLoading.value = false;
    isTransferCompleted.value = true;
  }
  else {
    console.error('Tracks Missing!')
  }

}

</script>
