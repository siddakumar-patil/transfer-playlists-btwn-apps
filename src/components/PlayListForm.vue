<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900"
    >
      <!-- <v-img
        class="mb-4"
        height="150"
        src="@/assets/logo.png"
      /> -->
    
      <p>{{ props }}</p>
      <div class="text-center">
        <v-icon 
          class="mb-4"
          size="150">
          mdi-{{serviceProviderName}}
        </v-icon>

        <h1 class="text-h2 font-weight-bold px-4 py-4">Paste your playlist from {{ capitalize(serviceProviderName) }} below </h1>
        <h1 class="text-h5 font-weight-light px-4 py-4">Please make sure it's a public playlist</h1>
        <v-form ref="form" v-model="valid">
          <v-text-field
            :label="label"
            variant="solo"
            v-model="url"
            :rules="[urlValidator]"
            :hint="hintUrl"
            append-inner-icon="mdi-content-paste"
            @click:append-inner="copyFromClipBoard"
          >
          </v-text-field>
          <v-btn @click="submit" :disabled="!valid" color="primary" rounded>Fetch PlayList</v-btn>
          <v-alert v-if="res == 'Failed'" type="error">
            Something went wrong:( 
            Please try again later!
          </v-alert>
          <v-alert v-if="res == 'Success'" type="sucess">
           Fetched 
          </v-alert>
          <v-alert class="my-4 mx-7" type="error" >
            Something went wrong:(
          </v-alert>
      </v-form>

      </div>

      <div class="py-4" />

    </v-responsive>
  </v-container>
</template>
<script setup>
import { ref, computed, onMounted, capitalize } from "vue";
import { useRouter } from "vue-router"

import useUserStore from "@/stores/userStore"
import useAppStore from "@/stores/appStore";
import useYoutubeStore from "@/stores/youtubeStore";
import useSpotifyStore from "@/stores/spotifyStore";

const router = useRouter()
const userStore = useUserStore()

const props = defineProps({
  serviceProviderName: {
    type: String,
    required: true
  },
})

let url = ref('');
let valid = ref(false);
let submitted = ref(false);
let res = ref();
let status = ref(true);

let regex=ref('')
let hintUrl=ref('')
let label=ref('')

const spotifyAccessToken = computed(() => userStore.getUserSpotifyUnAuthAccessToken)
const youtubeAPI = computed(() => userStore.getYoutubeAPIKey)

onMounted(async () => {
  if (props.serviceProviderName == 'spotify') {
    label.value = "Paste your Spotify playlist url here:)"
    regex.value = /^(https?:\/\/)?(open\.spotify\.com\/playlist\/|spotify:playlist:)([a-zA-Z0-9]{22})/;
    hintUrl.value = "https://open.spotify.com/playlist/xyz"

    // Generating AccessToken for Spotify API
    await useUserStore().generateSpotifyUnAuthAccessToken()
  }
  else if (props.serviceProviderName == 'youtube') {
    label.value = "Paste your Youtube playlist url here:)"
    regex.value = /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=([A-Za-z0-9_-]+)/;
    hintUrl.value = "https://www.youtube.com/playlist/xyz"
    await useUserStore().generateSpotifyUnAuthAccessToken()
    useUserStore().setYoutubeAPIkey()
  }
})


const copyFromClipBoard = async () => {
  try {
    const txtclip = await navigator.clipboard.readText();
    console.log(" [ copyFromClipBoard ]: " + txtclip);

    if (txtclip != null || undefined) {
      url.value = txtclip;
    }
  }
  catch (err) {
    console.error(" [ copyFromClipBoard ]: Failed to read clipboard contents: ", err)
  }
}

const urlValidator = (value) => {
  if (regex.value) return regex.value.test(value) || 'Please Enter a vaild ' + capitalize(props.serviceProviderName) + ' Playlist Url!';
}

const submit = async () => {
  if (props.serviceProviderName == 'spotify') {
    console.log("Form Submitted! Implementation yet to be done" + spotifyAccessToken)
    submitted.value = true;
    res.value = await useSpotifyStore().fetchSpotifyPlaylistTracks(url.value, spotifyAccessToken.value)

    console.log("Response from fetchPlayListtrakcs: " + res.value)
    if (res.value === 'Success') {
      status.value = true
      router.push({ path: "/spotifyplaylist" })
    }
  }
  else if(props.serviceProviderName == 'youtube') {

    console.log("Fetching Tracks from youtube public playlist..")
    submitted.value = true;
    res.value = await useYoutubeStore().fetchYoutubePlaylistTracks(url.value, youtubeAPI.value)

    console.log("Response from fetchPlayListtrakcs: " + JSON.stringify(res.value))
    if (res.value === 'Success') {
      status.value = true
      router.push({ path: "/youtubeplaylist" })
    }

  }
}

</script>