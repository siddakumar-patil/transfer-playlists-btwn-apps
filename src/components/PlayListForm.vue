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

      <div class="text-center">
        <h1 class="text-h2 font-weight-bold px-4 py-4">Paste your playlist from {{ serviceProviderName }} below </h1>
        <h1 class="text-h5 font-weight-light px-4 py-4">Please make sure it's a public playlist</h1>
        <v-form ref="form" v-model="valid">
          <v-text-field
            label="Paste your spotify playlist url here:)"
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
      </v-form>

      </div>

      <div class="py-4" />

    </v-responsive>
  </v-container>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router"

import useUserStore from "@/stores/userStore"

const router = useRouter()
const userStore = useUserStore()

const props = defineProps({
  hintUrl: {
    type: String,
    required: true,
    default: "https://open.spotify.com/playlist/xyz"
  },
  serviceProviderName: {
    type: String,
    required: true
  },
  urlPattern: {
    type: RegExp,
    required: true,
    default: /^(https?:\/\/)?([a-z\d-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i,
  },
})

let url = ref('');
let valid = ref(false);
let submitted = ref(false);
let res = ref();
let status = ref(true);

const accessToken = computed(() => userStore.getUserSpotifyUnAuthAccessToken)

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
  // const spotifyPlaylistPattern = /^(https?:\/\/)?(open\.spotify\.com\/playlist\/|spotify:playlist:)([a-zA-Z0-9]{22})/;

  // TODO: use below url in future once you've multiple music services
  //const urlPattern = /^(https?:\/\/)?([a-z\d-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;
  return props.urlPattern.test(value) || 'Please Enter a vaild Playlist Url!';
}

// const  getPlaylistId = (url) => {
//     const regex = /(?:playlist\/|spotify:playlist:)([a-zA-Z0-9]{22})/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
// }

const submit = async () => {
  console.log("Form Submitted! Implementation yet to be done" + accessToken)
  submitted.value = true;
  res.value =  await userStore.fetchPlaylistTracks(url.value, accessToken.value)

  console.log("Response from fetchPlayListtrakcs: " + res.value)
  if (res.value === 'Success') {
    status.value=true
    router.push({ path: "/spotifyplaylist" })
  }
}

</script>