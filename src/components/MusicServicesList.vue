<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900"
    >
      <div class="text-center">
        <h1 class="text-h2 font-weight-bold px-4 py-4">Choose a Source</h1>
        <h2 class="text-h4 font-weight-ligjht px-4 py-4">Choose a Source Music Application you want your playlist to be fetched from</h2>
      </div>

      <div class="py-4" />

      <v-row>
        <v-col cols="6" v-for="appName in applist" :key="appName.name">
            <v-card
                append-icon="mdi-open-in-new"
                class="py-4"
                color="surface-variant"
                prepend-icon="mdi-spotify"
                rounded="lg"
                variant="outlined"
                >
                <template #title>
                    <h2 class="text-h5 font-weight-bold">{{ appName.name }}</h2>
                </template>
            </v-card>
        </v-col>

        <v-col cols="6">
            <v-card
                append-icon="mdi-open-in-new"
                class="py-4"
                color="surface-variant"
                prepend-icon="mdi-spotify"
                rounded="lg"
                variant="outlined"
                >
                <!-- <template #image>
                    <v-img position="top right" src="https://newsroom.spotify.com/wp-content/themes/ftr/assets/images/spotify-logo.png" />
                </template> -->

                <template #title>
                    <h2 class="text-h5 font-weight-bold">Spotify</h2>
                </template>

                <!-- <template #subtitle>
                    <div class="text-subtitle-1">
                    Replace this page by removing <v-kbd>{{ `<HelloWorld />` }}</v-kbd> in <v-kbd>pages/index.vue</v-kbd>.
                    </div>
                </template> -->

                <!-- <v-overlay
                    opacity=".12"
                    scrim="primary"
                    contained
                    model-value
                    persistent
                /> -->
            </v-card>
        </v-col>

        <v-col cols="6">
            <v-card
                append-icon="mdi-open-in-new"
                class="py-4"
                color="surface-variant"
                prepend-icon="mdi-apple"
                rounded="lg"
                variant="outlined"
                >
                <!-- <template #image>
                    <v-img position="top right" src="https://newsroom.spotify.com/wp-content/themes/ftr/assets/images/spotify-logo.png" />
                </template> -->

                <template #title>
                    <h2 class="text-h5 font-weight-bold">Apple Music</h2>
                </template>

                <!-- <template #subtitle>
                    <div class="text-subtitle-1">
                    Replace this page by removing <v-kbd>{{ `<HelloWorld />` }}</v-kbd> in <v-kbd>pages/index.vue</v-kbd>.
                    </div>
                </template> -->

                <!-- <v-overlay
                    opacity=".12"
                    scrim="primary"
                    contained
                    model-value
                    persistent
                /> -->
            </v-card>
        </v-col>

        <v-col cols="6">
            <v-card
                append-icon="mdi-open-in-new"
                class="py-4"
                color="surface-variant"
                prepend-icon="mdi-youtube"
                rounded="lg"
                variant="outlined"
                >
                <!-- <template #image>
                    <v-img position="top right" src="https://newsroom.spotify.com/wp-content/themes/ftr/assets/images/spotify-logo.png" />
                </template> -->

                <template #title>
                    <h2 class="text-h5 font-weight-bold">Youtube Music</h2>
                </template>

                <!-- <template #subtitle>
                    <div class="text-subtitle-1">
                    Replace this page by removing <v-kbd>{{ `<HelloWorld />` }}</v-kbd> in <v-kbd>pages/index.vue</v-kbd>.
                    </div>
                </template> -->

                <!-- <v-overlay
                    opacity=".12"
                    scrim="primary"
                    contained
                    model-value
                    persistent
                /> -->
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
import { ref,defineAsyncComponent, onMounted } from "vue"
import axios from "axios"

const PlayListForm = defineAsyncComponent(() => import("@/components/PlayListForm.vue"))
const GetStarted = defineAsyncComponent(() => import("@/components/GetStarted.vue"))

const props = defineProps({
    appsList: {
        default: [],
        // required: true,
    }
})

// TODO: remove below hardcoded list
const applist=ref([
    {
        name:"Spotify",
        prependIcon: "mdi-spotify",
        appendIcon:"mdi-open-in-new"
    },
    {
        name:"Apple Music",
        prependIcon: "mdi-apple",
        appendIcon:"mdi-open-in-new"
    },
    {
        name:"Youtube Music",
        prependIcon: "mdi-youtube",
        appendIcon:"mdi-open-in-new"
    },
])

onMounted(async () => {
    console.log("onMounted!")
    // const accessToken = await getAccessToken();
    // console.log("onMounted: " + accessToken)
    // if (accessToken) {
    //     const playlistId = '37i9dQZF1DWVDvBpGQbzXj?si=Ow6RMWvlTkacquCG9MzgFQ&pi=a-sPOBRPiAS2yz'; // TODO: Replace with your playlist ID
    //     const tracks = await fetchPlaylistTracks(playlistId, accessToken);

    //     console.log("onMounted!" + tracks)

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
    // Fetch Client ID and Secrets from .env file
    const clientId = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID
    const clientSecret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET

    // Encode client ID and secret
    const authString = `${clientId}:${clientSecret}`;
    const encodedAuth = Buffer.from(authString).toString('base64');

    const tokenUrl = 'https://accounts.spotify.com/api/token';

}

const getAccessToken = async () => {

    const clientId = import.meta.env.VITE_APP_CLIENT_ID
    const clientSecret = import.meta.env.VITE_APP_CLIENT_SECRET

    // Encode client ID and secret
    const authString = btoa(`${clientId}:${clientSecret}`);
    // const encodedAuth = Buffer.from(authString).toString('base64');

    const tokenUrl = 'https://accounts.spotify.com/api/token';

    try {
        const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response.data);
    }
};

// Fetch tracks from a playlist
const fetchPlaylistTracks = async (playlistId, accessToken) => {

    console.log(" [ fetchPlaylistTracks ]:  Fetching PlaylistTracks for: " + playlistId)

    const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    try {
        const response = await axios.get(playlistUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        console.log(" [ fetchPlaylistTracks ]:  Fetching PlaylistTracks for: " + JSON.stringify(response.data))
        return response.data;
    } catch (error) {
        console.error('Error fetching playlist tracks:', error.response.data);
    }
};


</script>


<!-- 
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
</v-col> -->

