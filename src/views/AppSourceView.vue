<template>
    <GetStarted />
  </template>
<script setup>
import { defineAsyncComponent } from "vue"
const GetStarted = defineAsyncComponent(() => import("@/components/GetStarted.vue"))
</script>

<!-- 
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


</script> -->
