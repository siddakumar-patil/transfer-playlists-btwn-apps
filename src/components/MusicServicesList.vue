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
        <v-col cols="6" v-for="app in applist" :key="app.name">
            <v-card
                :append-icon="app.appendIcon"
                class="py-4"
                color="surface-variant"
                :prepend-icon="app.prependIcon"
                rounded="lg"
                variant="outlined"
                link
                @click="onClick(app.redirectRoute,app.name)"
                >
                <template #title>
                    <h2 class="text-h5 font-weight-bold">{{ app.name }}</h2>
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
import { ref } from "vue"

import { useRouter } from "vue-router"

const router = useRouter()

const props = defineProps({
    appsList: {
        default: [],
        // required: true,
    },
    redirectRoute: {
        type: String,
        required: true,
    }
})

// TODO: remove below hardcoded list
const applist = ref([
    {
        name: "Spotify",
        prependIcon: "mdi-spotify",
        appendIcon: "mdi-open-in-new",
        redirectRoute: "/spotifysrc"
    },
    {
        name: "Apple Music",
        prependIcon: "mdi-apple",
        appendIcon: "mdi-open-in-new",
        redirectRoute: "/spotifysrc" // TODO: Change
    },
    {
        name: "Youtube",
        prependIcon: "mdi-youtube",
        appendIcon: "mdi-open-in-new",
        redirectRoute: "/spotifysrc"// TODO: Change
    },
])

const onClick = (redirectRoute, source) => {
    useAppStore().source=source
    console.log("Setting Source as:"+source)
    if (redirectRoute) router.push({
        path: redirectRoute
    })
}
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


<!-- 

<v-col cols="6">
    <v-card
        append-icon="mdi-open-in-new"
        class="py-4"
        color="surface-variant"
        prepend-icon="mdi-spotify"
        rounded="lg"
        variant="outlined"
        >
        <template #image>
            <v-img position="top right" src="https://newsroom.spotify.com/wp-content/themes/ftr/assets/images/spotify-logo.png" />
        </template> 

        <template #title>
            <h2 class="text-h5 font-weight-bold">Spotify</h2>
        </template>

        <template #subtitle>
            <div class="text-subtitle-1">
                Keep your Playlist Url ready!
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
        prepend-icon="mdi-apple"
        rounded="lg"
        variant="outlined"
        >
        <template #image>
            <v-img position="top right" src="https://newsroom.spotify.com/wp-content/themes/ftr/assets/images/spotify-logo.png" />
        </template>

        <template #title>
            <h2 class="text-h5 font-weight-bold">Apple Music</h2>
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
        prepend-icon="mdi-youtube"
        rounded="lg"
        variant="outlined"
        >
        <template #image>
            <v-img position="top right" src="https://newsroom.spotify.com/wp-content/themes/ftr/assets/images/spotify-logo.png" />
        </template>

        <template #title>
            <h2 class="text-h5 font-weight-bold">Youtube Music</h2>
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
</v-col> -->