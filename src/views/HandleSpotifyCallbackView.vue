<template>
      <v-container class="fill-height">
      <v-responsive
        class="align-centerfill-height mx-auto"
      >
      <h1>Loading...</h1>
        <v-progress-circular
          color="error"
          indeterminate
          :size="115"
          :width="10"
        ></v-progress-circular>
      </v-responsive>
    </v-container>
  </template>
<script setup>
import { ref, onBeforeMount,computed } from "vue"

import { useRouter } from "vue-router"

import useUserStore from "@/stores/userStore";

const router = useRouter()

let hash = ref()
let params = ref()

// Function to parse the URL fragment
function parseFragment() {
  hash.value = window.location.search.substring(1); // Remove the '#'
  params = new URLSearchParams(hash.value);

  console.log("Current URL hash:", window.location.search);

  console.log(" [ parseFragment ]: params", params);
  console.log(" [ parseFragment ]:", new URLSearchParams(window.location.search.substring(1)));

  const code = params.get('code');
  const state = params.get('state'); // Optional state parameter

  if (code) {
    useUserStore().spotify_auth_access_token = code
    // Send the code back to the opener window
    window.opener.postMessage({ code }, '*'); // Use '*' or specify the origin

    router.push({ path: '/youtubeplaylistdest' })
    window.close(); // Close the popup

  } else {
    console.error("No access token found");
    // TODO: add window.close() if it fails to access
  }

  if (state) {
    console.log("State:", state.value);
  }
}

onBeforeMount(async () => {
  parseFragment();
  console.log("onBeforeMount in Spotify Callback Page Completed!")
})


</script>
