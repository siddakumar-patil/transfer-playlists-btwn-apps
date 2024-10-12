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
    // {
    //     name: "Apple Music",
    //     prependIcon: "mdi-apple",
    //     appendIcon: "mdi-open-in-new",
    //     redirectRoute: "/spotifysrc" // TODO: Change
    // },
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
