<template>
    <h1>Loading...</h1>
    <v-progress-circular
      color="error"
      indeterminate
      :size="115"
      :width="10"
    ></v-progress-circular>
  </template>
<script setup>
import { ref, defineAsyncComponent, onBeforeMount,computed } from "vue"
import axios from "axios"

import { useRouter } from "vue-router"

import useUserStore from "@/stores/userStore";

onBeforeMount(async () => {
  console.log("onBeforeMount in Callback Page"+JSON.stringify(useUserStore().getYoutubeAccessToken ))
  parseFragment();
  console.log("onBeforeMount in Callback Page Completed!")
})

let hash = ref()
let params = ref()
let accessToken = ref()
let state = ref()
let expiresIn = ref()
let scope = ref()

const getYoutubeAccessToken = computed(() => useUserStore().getYoutubeAccessToken)

const router = useRouter()

// Function to parse the URL fragment
function parseFragment() {
  hash.value = window.location.hash.substring(1); // Remove the '#'
  params = new URLSearchParams(hash.value);

  console.log(" [ parseFragment ]:", new URLSearchParams(window.location.hash.substring(1)));

  accessToken.value = params.get('access_token');
  state.value = params.get('state');
  expiresIn.value = params.get('expires_in');
  scope.value = params.get('scope');

  if (accessToken) {;
    useUserStore().youtube_access_token = accessToken.value
    window.opener.postMessage({ accessToken, app:'Youtube' }, '*'); // Use '*' or specify the origin
   
    router.push({ path: '/youtubeplaylistdest' })
    window.close(); // Close the popup

  } else {
    console.error("No access token found");
  }

  if (state) {
    console.log("State:", state.value);
  }
}
</script>
