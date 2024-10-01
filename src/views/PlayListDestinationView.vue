<template>
    <v-container class="fill-height">
      <v-responsive
        class="align-centerfill-height mx-auto"
        max-width="900"
      >
        <div class="text-center">
          <h1 class="text-h2 font-weight-bold px-4 py-4">Choose a Destination</h1>
          <h2 class="text-h4 font-weight-ligjht px-4 py-4">Choose a Destination Music Application you want your playlist to be Added to</h2>
        </div>
  
        <div class="py-4" />
  
        <v-row>
          <v-col cols="6" v-for="app in applist" :key="app.name">
              <v-card
                  :append-icon="app.appendIcon"
                  class="py-4"
                  :color="app.isSource ? 'red' : 'surface-variant'"
                  :prepend-icon="app.prependIcon"
                  rounded="lg"
                  variant="outlined"
                  link
                  @click="onClick(url)"
                  :disabled="app.isSource"
                  >
                  <template #title>
                      <h2 class="text-h5 font-weight-bold">{{ app.name }} {{ app.isSource ? '(Selected Source)' : '' }}</h2>
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
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter();

const props = defineProps({
    appsList: {
        default: [],
        required: true,
    },
    redirectRoute: {
        type: String,
        required: true,
    },
    appUrl: {
        type: String,
        required: true,
    }
})

// Fetch Client ID and Secrets from .env file
const clientId = import.meta.env.VITE_APP_YOUTUBE_CLIENT_ID
const clientSecret = import.meta.env.VITE_APP_YOUTUBE_CLIENT_SECRET
const apiKey = import.meta.env.VITE_APP_YOUTUBE_API_KEY

// TODO: remove below hardcoded list
const applist = ref([
    {
        name: "Spotify",
        prependIcon: "mdi-spotify",
        appendIcon: "mdi-open-in-new",
        isSource: true, // Remove hardcoded value
        redirectRoute: "/spotifysrc"
    },
    {
        name: "Apple Music",
        prependIcon: "mdi-apple",
        appendIcon: "mdi-open-in-new",
        isSource: false,
        redirectRoute: "/spotifysrc" // TODO: Change
    },
    {
        name: "Youtube Music",
        prependIcon: "mdi-youtube",
        appendIcon: "mdi-open-in-new",
        isSource: false,
        redirectRoute: "/spotifysrc"// TODO: Change
    },
])

const onClick = (appUrl) => {
    //   if (appUrl) {
    oauthSignIn()
    // }
}

/*
* Create form to request access token from Google's OAuth 2.0 server.
*/
function oauthSignIn() {
    console.log(" [ oauthSignIn ]:Authenticating User ")

    const width = 600;
    const height = 700;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': clientId,
        'redirect_uri': 'http://localhost:5000/youtubecallback',
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
        'include_granted_scopes': 'true',
        'state': 'pass-through value'
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    // form.submit();

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=http://localhost:5000/youtubecallback&response_type=token&scope=https://www.googleapis.com/auth/youtube.force-ssl`;

    const popup = window.open(authUrl, 'Google Login', `width=${width},height=${height},top=${top},left=${left}`);

    // Handle the popup close event if necessary
    const timer = setInterval(() => {
        if (popup.closed) {
            clearInterval(timer);
            // Optionally handle cleanup or state updates here
        }
    }, 1000);
}

</script>
  
