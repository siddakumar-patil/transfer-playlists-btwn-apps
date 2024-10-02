import { defineStore } from "pinia"
import axios from "axios"

import useUserStore from "./userStore"

const userStore= useUserStore()

const useSpotifyStore = defineStore("spotify", {
  state: () => ({
    tracks: [],
  }),

  getters: {
    getTracks(state) {
      return state.tracks
    },
  },

  actions: {
    // async generateSpotifyAccessToken() {
    //   if (useUserStore().getUserSpotifyUnAuthAccessToken !== null) {
    //     return
    //   }

    //   console.log(
    //     " [ generateSpotifyAccessToken ]:  Generating Access Token for UnAuth Spotify: " +
    //       useUserStore().getUserSpotifyUnAuthAccessToken
    //   )

    //   const clientId = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID
    //   const clientSecret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET

    //   // Encode client ID and secret
    //   const authString = btoa(`${clientId}:${clientSecret}`)
    //   // const encodedAuth = Buffer.from(authString).toString('base64');

    //   const tokenUrl = "https://accounts.spotify.com/api/token"

    //   try {
    //     const response = await axios.post(tokenUrl, "grant_type=client_credentials", {
    //       headers: {
    //         Authorization: `Basic ${authString}`,
    //         "Content-Type": "application/x-www-form-urlencoded",
    //       },
    //     })

    //     // TODO: remove below console.log
    //     console.log(" [ generateSpotifyAccessToken ]: Response generated: " + response.data.access_token)

    //     if (response.data.access_token !== null && response.status === 200) {
    //         useUserStore().user_spotify_unauth_access_token = response.data.access_token
    //     }

    //     //return response.data.access_token // TODO: verify if return is required
    //   } catch (error) {
    //     console.error("Error fetching access token:", error.response.data)
    //   }
    // },

    // Fetch tracks from a SPOTIFY playlist
    async fetchSpotifyPlaylistTracks(spotifyPlaylistUrl, accessToken) {
      console.log(" [ fetchSpotifyPlaylistTracks ]:  Fetching PlaylistTracks: " + spotifyPlaylistUrl)

      // Regex to extract just playlistId
      // const regex = /(?:playlist\/|spotify:playlist:)([a-zA-Z0-9]{22})/

      // Regex tro extract everything after playlist/
      const regex = /playlist\/([a-zA-Z0-9]{22})(.*)?$/
      const match = spotifyPlaylistUrl.match(regex)
      const playlistId = match ? match[1] : null
      const additionalParams = match ? match[2] : null

      // const match = spotifyPlaylistUrl.match(regex)
      // const playlistId = match ? match[1] : null

      console.log(" [ fetchSpotifyPlaylistTracks ]:  Fetching for playlistId: " + playlistId)

      if (playlistId === null) return "Failed" // TODO: Return a proper return

      const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}${additionalParams}/tracks`

      console.log(" [ fetchSpotifyPlaylistTracks ]:  Fetching Playlist for PlayList Url: " + playlistUrl)

      try {
        const response = await axios.get(playlistUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        // console.log(" [ fetchSpotifyPlaylistTracks ]:  Fetching PlaylistTracks for: " + JSON.stringify(response.data))

        // Setting tracks
        if (response.status === 200) {
          console.log(" [ fetchSpotifyPlaylistTracks ]:  Setting tracks : " + JSON.stringify(response))

          this.tracks = response.data

          console.log(" [ fetchSpotifyPlaylistTracks ]: tracks : " + this.getTracks)

          // TODO: Fetch Next Pages

          // TODO: Handle Response in two ways.. One in such a way that it uses Meta Data and with no meta data

          return "Success"
        }

        // return response.data // TODO: verify if return is required
      } catch (error) {
        console.error("Error fetching playlist tracks:", error.response.data)
        return "Failed"
      }
    },

    // TODO:
    async searchSpotifyTrackByQuery(accessToken, query) {
      console.log(" [ searchSpotifyTrackByQuery ]: Searching Track: " + query)

      console.log(" [ searchSpotifyTrackByQuery ]: Searching Acess: " + accessToken)

      const baseUrl = "https://api.spotify.com/v1/search"

      try {
        const response = await fetch(`${baseUrl}?q=${encodeURIComponent(query)}&type=track&limit=1`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Error fetching track: ${response.statusText}`)
        }

        const data = await response.json()

        console.log(
          " [ searchSpotifyTrackByQuery ]: Response from Search for " +
            query +
            " is :" +
            JSON.stringify(data.tracks.items[0])
        )

        if (data.tracks.items.length > 0) {
          // Return the first track from the search results
          const track = data.tracks.items[0]
          // TODO: format data propery

          return {
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            previewUrl: track.preview_url,
            externalUrl: track.external_urls.spotify,
          }
        } else {
          console.log("No tracks found for the query.")
          return null
        }
      } catch (error) {
        console.error("Error fetching track:", error)
        return null // Handle errors appropriately
      }
    },

    // Fetch Spotify MusicId from Results fetched on Spotify
    async fetchSpotifyMusicIds(queries) {
      console.log(" [ fetchSpotifyMusicIds ]: fetching Music Ids..")
      const videoIds = []

      if (!userStore.getUserSpotifyAuthAccessToken) {
        console.error("Access token not found. Please authenticate first.")
        return
      }

      if (queries.length === 0) {
        console.error("Empty Queries")
        return
      }

      for (const query of queries) {
        try {
          const results = await this.searchSpotifyTrackByQuery(userStore.getUserSpotifyAuthAccessToken, query)
          videoIds.push(results[i]?.id?.videoId)
        } catch (error) {
          console.error(`Error searching for track "${track}":`, error)
        }
      }
      return videoIds
    },

    // async createPlaylist(accessToken, userId, playlistName, description) {
    //   const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
    
    //   const response = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${accessToken}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       name: playlistName,
    //       description: description,
    //       public: false, // Set to true if you want it public
    //     }),
    //   });
    
    //   if (!response.ok) {
    //     throw new Error(`Error creating playlist: ${response.statusText}`);
    //   }
    
    //   const data = await response.json();
    //   return data; // Return the created playlist details
    // },

  },
})

export default useSpotifyStore
