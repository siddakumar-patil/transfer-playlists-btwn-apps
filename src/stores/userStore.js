import { defineStore } from "pinia"
import axios from "axios"

const useUserStore = defineStore("user", {
  state: () => ({
    user_spotify_unauth_access_token: null,
    tracks: [],
    youtube_access_token: null,
  }),

  getters: {
    getUserSpotifyUnAuthAccessToken(state) {
      return state.user_spotify_unauth_access_token
    },

    getTracks(state) {
      return state.tracks
    },

    getYoutubeAccessToken(state) {
      return state.youtube_access_token
    },
  },

  actions: {
    // generateAccessTokenForUnAuth() {
    //   console.log(" [ generateAccessTokenForUnAuth ]:  Generating Access Token for UnAuth Spotify: " + this.getUserSpotifyUnAuthAccessToken)

    //   // Fetch Client ID and Secrets from .env file
    //   const clientId = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID
    //   const clientSecret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET

    //   // Encode client ID and secret
    //   const authString = `${clientId}:${clientSecret}`
    //   const encodedAuth = Buffer.from(authString).toString("base64")

    //   const tokenUrl = "https://accounts.spotify.com/api/token"
    // },

    async generateAccessToken() {
      if (this.getUserSpotifyUnAuthAccessToken !== null) {
        return
      }

      console.log(
        " [ generateAccessToken ]:  Generating Access Token for UnAuth Spotify: " + this.getUserSpotifyUnAuthAccessToken
      )

      const clientId = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID
      const clientSecret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET

      // Encode client ID and secret
      const authString = btoa(`${clientId}:${clientSecret}`)
      // const encodedAuth = Buffer.from(authString).toString('base64');

      const tokenUrl = "https://accounts.spotify.com/api/token"

      try {
        const response = await axios.post(tokenUrl, "grant_type=client_credentials", {
          headers: {
            Authorization: `Basic ${authString}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })

        // TODO: remove below console.log
        console.log(" [ generateAccessToken ]: Response generated: " + response.data.access_token)

        if (response.data.access_token !== null && response.status === 200) {
          this.user_spotify_unauth_access_token = response.data.access_token
        }

        //return response.data.access_token // TODO: verify if return is required
      } catch (error) {
        console.error("Error fetching access token:", error.response.data)
      }
    },

    // Fetch tracks from a playlist
    async fetchPlaylistTracks(spotifyPlaylistUrl, accessToken) {
      console.log(" [ fetchPlaylistTracks ]:  Fetching PlaylistTracks: " + spotifyPlaylistUrl)

      // Regex to extract just playlistId
      // const regex = /(?:playlist\/|spotify:playlist:)([a-zA-Z0-9]{22})/

      // Regex tro extract everything after playlist/
      const regex = /playlist\/([a-zA-Z0-9]{22})(.*)?$/
      const match = spotifyPlaylistUrl.match(regex)
      const playlistId = match ? match[1] : null
      const additionalParams = match ? match[2] : null

      // const match = spotifyPlaylistUrl.match(regex)
      // const playlistId = match ? match[1] : null

      console.log(" [ fetchPlaylistTracks ]:  Fetching for playlistId: " + playlistId)

      if (playlistId === null) return "Failed" // TODO: Return a proper return

      const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}${additionalParams}/tracks`

      console.log(" [ fetchPlaylistTracks ]:  Fetching Playlist for PlayList Url: " + playlistUrl)

      try {
        const response = await axios.get(playlistUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        // console.log(" [ fetchPlaylistTracks ]:  Fetching PlaylistTracks for: " + JSON.stringify(response.data))

        // Setting tracks
        if (response.status === 200) {
          console.log(" [ fetchPlaylistTracks ]:  Setting tracks : " + JSON.stringify(response))
          
          this.tracks = response.data

          console.log(" [ fetchPlaylistTracks ]: tracks : " + this.getTracks)

          // TODO: Fetch Next Pages

          // TODO: Handle Response in two ways.. One in such a way that it uses Meta Data and with no meta data

          return "Success"
        }

        // return response.data // TODO: verify if return is required
      } catch (error) {
        console.error("Error fetching playlist tracks:", error.response.data)
      }
    },
  },
})

export default useUserStore
