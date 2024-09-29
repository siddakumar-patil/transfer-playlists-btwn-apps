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
          <!-- <v-alert type="error">
            Something went wrong:( 
            Please try again later!
          </v-alert> -->
    </v-form>

      </div>

      <div class="py-4" />

    </v-responsive>
  </v-container>
</template>
<script setup>
import { ref } from "vue";

const props = defineProps({
  hintUrl:{
    type: String,
    required: true,
    default:"https://open.spotify.com/playlist/xyz"
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

const submit = () => {
      console.log("Form Submitted! Implementation yet to be done")
      submitted.value = true;
      // if (this.$refs.form.validate()) {
      //   // Handle valid URL submission here
      //   alert('Valid URL: ' + this.url);
      // }

    }

</script>

<!-- <script setup>
import { onMounted } from "vue"
import axios from "axios"


onMounted(async ()=>{
  console.log("onMounted!")
  const accessToken = await getAccessToken();
    // if (accessToken) {
    //     const playlistId = 'your_playlist_id'; // Replace with your playlist ID
    //     const tracks = await fetchPlaylistTracks(playlistId, accessToken);

    //     if (tracks) {
    //         tracks.forEach(track => {
    //             const trackName = track.track.name;
    //             const artistName = track.track.artists[0].name;
    //             console.log(`Track: ${trackName}, Artist: ${artistName}`);
    //         });
    //     }
    // }
})

// TODO: move below to Stores
function generateAccessToken() {
  // Replace with your own Client ID and Client Secret
// const clientId = 'your_client_id';
// const clientSecret = 'your_client_secret';

const clientId = import.meta.env.VITE_APP_CLIENT_ID
const clientSecret = import.meta.env.VITE_APP_CLIENT_SECRET

// // Encode client ID and secret
// const authString = `${clientId}:${clientSecret}`;
// const encodedAuth = Buffer.from(authString).toString('base64');

// const tokenUrl = 'https://accounts.spotify.com/api/token';

}

const getAccessToken = async () => {

  const clientId = import.meta.env.VITE_APP_CLIENT_ID
const clientSecret = import.meta.env.VITE_APP_CLIENT_SECRET

console.log("get Access:"+clientId)
    // try {
    //     const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
    //         headers: {
    //             'Authorization': `Basic ${encodedAuth}`,
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //     });
    //     return response.data.access_token;
    // } catch (error) {
    //     console.error('Error fetching access token:', error.response.data);
    // }
};

// Fetch tracks from a playlist
const fetchPlaylistTracks = async (playlistId, accessToken) => {
    const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    try {
        const response = await axios.get(playlistUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching playlist tracks:', error.response.data);
    }
};


</script> -->

<!-- 
<v-row>
  <v-col cols="12">
    <v-card
      class="py-4"
      color="surface-variant"
      image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
      prepend-icon="mdi-rocket-launch-outline"
      rounded="lg"
      variant="outlined"
    >
      <template #image>
        <v-img position="top right" />
      </template>

      <template #title>
        <h2 class="text-h5 font-weight-bold">Get started</h2>
      </template>

      <template #subtitle>
        <div class="text-subtitle-1">
          Replace this page by removing <v-kbd>{{ `<HelloWorld />` }}</v-kbd> in <v-kbd>pages/index.vue</v-kbd>.
        </div>
      </template>

      <v-overlay
        opacity=".12"
        scrim="primary"
        contained
        model-value
        persistent
      />
    </v-card>
  </v-col>

  <v-col cols="6">
    <v-card
      append-icon="mdi-open-in-new"
      class="py-4"
      color="surface-variant"
      href="https://vuetifyjs.com/"
      prepend-icon="mdi-text-box-outline"
      rel="noopener noreferrer"
      rounded="lg"
      subtitle="Learn about all things Vuetify in our documentation."
      target="_blank"
      title="Documentation"
      variant="text"
    >
      <v-overlay
        opacity=".06"
        scrim="primary"
        contained
        model-value
        persistent
      />
    </v-card>
  </v-col>

  <v-col cols="6">
    <v-card
      append-icon="mdi-open-in-new"
      class="py-4"
      color="surface-variant"
      href="https://vuetifyjs.com/introduction/why-vuetify/#feature-guides"
      prepend-icon="mdi-star-circle-outline"
      rel="noopener noreferrer"
      rounded="lg"
      subtitle="Explore available framework Features."
      target="_blank"
      title="Features"
      variant="text"
    >
      <v-overlay
        opacity=".06"
        scrim="primary"
        contained
        model-value
        persistent
      />
    </v-card>
  </v-col>

  <v-col cols="6">
    <v-card
      append-icon="mdi-open-in-new"
      class="py-4"
      color="surface-variant"
      href="https://vuetifyjs.com/components/all"
      prepend-icon="mdi-widgets-outline"
      rel="noopener noreferrer"
      rounded="lg"
      subtitle="Discover components in the API Explorer."
      target="_blank"
      title="Components"
      variant="text"
    >
      <v-overlay
        opacity=".06"
        scrim="primary"
        contained
        model-value
        persistent
      />
    </v-card>
  </v-col>

  <v-col cols="6">
    <v-card
      append-icon="mdi-open-in-new"
      class="py-4"
      color="surface-variant"
      href="https://discord.vuetifyjs.com"
      prepend-icon="mdi-account-group-outline"
      rel="noopener noreferrer"
      rounded="lg"
      subtitle="Connect with Vuetify developers."
      target="_blank"
      title="Community"
      variant="text"
    >
      <v-overlay
        opacity=".06"
        scrim="primary"
        contained
        model-value
        persistent
      />
    </v-card>
  </v-col>
</v-row> -->