<template>
    <h1>Test</h1>
  </template>
<script setup>
import { ref, defineAsyncComponent, onBeforeMount,computed } from "vue"
import axios from "axios"

import { useRouter } from "vue-router"

import useUserStore from "@/stores/userStore";

onBeforeMount(async () => {
  console.log("onBeforeMount in Callback Page"+JSON.stringify(useUserStore() ))
  parseFragment();
  console.log("onBeforeMount in Callback Page COmpleme")
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

  if (accessToken) {
    console.log("Access Token Generated Successfully"+accessToken.value);
    useUserStore().youtube_access_token = accessToken.value
    fetchUserPlaylists(accessToken.value)
    window.opener.postMessage({ accessToken }, '*'); // Use '*' or specify the origin
   
    router.push({ path: '/youtubeplaylistdest' })
    window.close(); // Close the popup

  } else {
    console.error("No access token found");
  }

  if (state) {
    console.log("State:", state.value);
  }
}

// Example function to fetch user playlists
function fetchUserPlaylists(access_token) {
  console.log("Access token :" + access_token);
  if (!access_token) {
    console.error("Access token not found. Please authenticate first.");
    return;
  }
  console.log("Access token found:" + access_token);

  fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log("User Playlists:", data);
    })
    .catch(error => {
      console.error("Error fetching playlists:", error);
    });
}


// // In your callback component or script
// if (window.opener) {
//   // const hash = window.location.hash.substring(1);
//   // const params = new URLSearchParams(hash);
//   // const accessToken = params.get('access_token');
//   parseFragment()

//   if (accessToken) {
//     // Send the access token back to the main window
//     window.opener.postMessage({ accessToken }, '*'); // Use '*' or specify the origin
//     window.close(); // Close the popup
//   } else {
//     console.error("No access token found in the URL.");
//   }
// }


</script>
