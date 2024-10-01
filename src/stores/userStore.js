import { defineStore } from "pinia"
import axios from "axios"

// TODO: implement below
function parseSpotifyPlayListData(playlist) {}

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

    // Fetch tracks from a SPOTIFY playlist
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

    // Function to fetch user playlists from Youtube
    fetchYoutubeUserPlaylists(access_token) {
      console.log("Access token :" + access_token)
      if (!access_token) {
        console.error("Access token not found. Please authenticate first.")
        return
      }
      console.log("Access token found:" + access_token)

      fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("User Youtube Playlists:", data)
        })
        .catch((error) => {
          console.error("Error fetching playlists:", error)
        })
    },

    // Create Private Playlist in Youtube
    async createYoutubePrivatePlaylist(accessToken, title, description) {
      console.log(" [ createYoutubePrivatePlaylist ] : Creating Playlist on youtube:")

      const response = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet,status", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            title: title,
            description: description,
            tags: ["private"],
            defaultLanguage: "en",
          },
          status: {
            privacyStatus: "private", // Set to 'private'
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Error creating playlist: ${response.statusText}`)
      }

      const data = await response.json()

      console.log(" [ createYoutubePrivatePlaylist ] : Created Playlist on youtube:" + JSON.stringify(data.id))
     
      return data.id // Return the created playlist details
    },

    // Adding Tracks to a Playlist using VideoIds fetched in Youtube
    async addTracksToYoutubePlaylistUsingVideoIds(accessToken, playlistId, videoIds) {
      const response = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId: videoIds, // Array of video IDs
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Error adding tracks: ${response.statusText}`)
      }

      const data = await response.json()
      return data // Return the added tracks details
    },

    // TODO: Refactor below action in such way that same method can be used to generate queries from Spotify, Apple Music and Youtube
    createYoutubeQueriesList(tracks) {
      let queries = []
      let artists = ""
      for (let i = 0; i < tracks.length; i++) {
        // for( let j =0 ; j< tracks[i]?.track?.artists.length; j++){
        //     artists = artists+ ' '+ tracks[i]?.track?.artists[j].name
        // }
        const query =
          tracks[i]?.track?.name + " " + tracks[i]?.track?.album.name + " " + tracks[i]?.track?.artists[0].name
        queries.push(query)
      }
      console.log(
        " [ createYoutubeQueriesList ]: generated Queries List with Size:" + queries.length + "\n Queries: " + queries
      )
      return queries
    },

    // Search Music Video on Youtube
    async searchYouTubeMusicVideos(accessToken, query) {
      console.log(" [ searchYouTubeMusicVideos ]: Search Videos using Query: "+query)
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(
          query
        )}&key=YOUR_API_KEY`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Error fetching music videos: ${response.statusText}`)
      }

      const data = await response.json()
      return data.items[0] // This will contain the first search result
    },

    // Fetch MusicVideo VideoId from Results fetched on Youtube
    async fetchYoutubeMusicVideoIds(queries) {
      console.log(" [ fetchYoutubeMusicVideoIds ]: fetching Videos Ids..")
      const videoIds = []

      if (!this.getYoutubeAccessToken) {
        console.error("Access token not found. Please authenticate first.")
        return
      }

      if (queries.length === 0) {
        console.error("Empty Queries")
        return
      }

      for (const query of queries) {
        try {
          const results = await this.searchYouTubeMusicVideos(this.getYoutubeAccessToken, query)
          videoIds.push(results[i]?.id?.videoId)
        } catch (error) {
          console.error(`Error searching for track "${track}":`, error);
        }
      }
      return videoIds
      // const searchPromises = queries.map((query) => this.searchYouTubeMusicVideos(this.getYoutubeAccessToken, query))

      // try {
      //   const results = await Promise.all(searchPromises)
      //   const videoIds = []
      //   for (let i = 0; i < results.length; i++) {
      //     videoIds.push(results[i]?.id?.videoId)
      //   }
      //   console.log(" [ fetchYoutubeMusicVideoIds ]: Video IDs fetched: " + videoIds)
      //   return videoIds // VideoIDs extracted
      // } catch (error) {
      //   console.error("Error in fetching one or more tracks:", error)
      // }



    },
  },
})

export default useUserStore
