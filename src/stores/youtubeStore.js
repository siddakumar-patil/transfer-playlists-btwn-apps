import { defineStore } from "pinia"
import axios from "axios"

import useUserStore from "./userStore"

const userStore= useUserStore()

const useYoutubeStore = defineStore("youtube", {
  state: () => ({
    youtubeVidoes: [],
  }),

  getters: {
    getYoutubeVidoes(state) {
      return state.youtubeVidoes
    },
  },

  actions: {
    // Fetch tracks from a Youtube public playlist
    async fetchYoutubePlaylistTracks(youtubePlaylistUrl, apiKey) {
      console.log(" [ fetchYoutubePlaylistTracks ]:  Fetching PlaylistTracks: " + youtubePlaylistUrl)

      const baseUrl = "https://www.googleapis.com/youtube/v3/playlistItems"
      let nextPageToken = ""
      const tracks = []

      // Extracting PlaylistId from the url
      const regex = /(?:youtube\.com\/playlist\?list=|youtu\.be\/)([a-zA-Z0-9_-]+)/
      const match = youtubePlaylistUrl.match(regex)

      const playlistId = match ? match[1] : null

      let totals = 0

      this.youtubeVidoes = {
        name: "Your Youtube Playlist",
        description: "Your Youtube Playlist",
        tracks: {
          items: [],
          totals: 0,
        },
      }

      try {
        do {
          const response = await fetch(
            `${baseUrl}?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}&pageToken=${nextPageToken}`
          )
          const data = await response.json()

          console.log(" [ fetchYoutubePlaylistTracks ]: track : " + JSON.stringify(data))

          if (data.items) {
            // Extract track details from the response
            data.items.forEach(async (item) => {
              console.log(" [ fetchYoutubePlaylistTracks ]: track : " + item.snippet.title)
              //  const name = await this.searchSpotifyTrackByQuery(this.getUserSpotifyUnAuthAccessToken,item.snippet.title)
              this.youtubeVidoes.playlistId = item.snippet.playlistId
              this.youtubeVidoes.tracks.items.push({
                name: item.snippet.title,
                description: item.snippet.description,
                videoId: item.snippet.resourceId.videoId,
                channelName: item.snippet.videoOwnerChannelTitle,
              })

              // Incrementing total count
              this.youtubeVidoes.tracks.totals++
            })
          }

          nextPageToken = data.nextPageToken // Get the token for the next page
        } while (nextPageToken) // Keep fetching until there are no more pages

        console.log(" [ fetchYoutubePlaylistTracks ]: track : " + this.getYoutubeVidoes)
        return "Success" // Return the array of tracks
      } catch (error) {
        console.error("Error fetching tracks:", error)
        return "Failed"
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
      console.log(" [ searchYouTubeMusicVideos ]: Search Videos using Query: " + query)

      if (!userStore.getYoutubeAPIKey) userStore.setYoutubeAPIkey()

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(
          query
        )}&key=${userStore.getYoutubeAPIKey}`,
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
      return data.items[0] // this will contain the first search result
    },

    // Fetch MusicVideo VideoId from Results fetched on Youtube
    async fetchYoutubeMusicVideoIds(queries) {
      console.log(" [ fetchYoutubeMusicVideoIds ]: fetching Videos Ids..")
      const videoIds = []

      if (!userStore.getYoutubeAccessToken) {
        console.error("Access token not found. Please authenticate first.")
        return
      }

      if (queries.length === 0) {
        console.error("Empty Queries")
        return
      }

      for (const query of queries) {
        try {
          const results = await this.searchYouTubeMusicVideos(userStore.getYoutubeAccessToken, query)
          videoIds.push(results[i]?.id?.videoId)
        } catch (error) {
          console.error(`Error searching for track "${track}":`, error)
        }
      }
      return videoIds
    },

    //Create form to request access token from Google's OAuth 2.0 server.
    oauthSignIn() {
      console.log(" [ oauthSignIn ]:Authenticating User ")

      const width = 600
      const height = 700
      const left = window.innerWidth / 2 - width / 2
      const top = window.innerHeight / 2 - height / 2

      // Google's OAuth 2.0 endpoint for requesting an access token
      var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth"

      // Create <form> element to submit parameters to OAuth 2.0 endpoint.
      var form = document.createElement("form")
      form.setAttribute("method", "GET") // Send as a GET request.
      form.setAttribute("action", oauth2Endpoint)

      // Parameters to pass to OAuth 2.0 endpoint.
      var params = {
        client_id: clientId,
        redirect_uri: "http://localhost:5000/youtubecallback",
        response_type: "token",
        scope: "https://www.googleapis.com/auth/youtube.force-ssl",
        include_granted_scopes: "true",
        state: "pass-through value",
      }

      // Add form parameters as hidden input values.
      for (var p in params) {
        var input = document.createElement("input")
        input.setAttribute("type", "hidden")
        input.setAttribute("name", p)
        input.setAttribute("value", params[p])
        form.appendChild(input)
      }

      // Add form to page and submit it to open the OAuth 2.0 endpoint.
      document.body.appendChild(form)
      // form.submit();

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=http://localhost:5000/youtubecallback&response_type=token&scope=https://www.googleapis.com/auth/youtube.force-ssl`

      const popup = window.open(authUrl, "Google Login", `width=${width},height=${height},top=${top},left=${left}`)

      // Handle the popup close event if necessary
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer)
          // Optionally handle cleanup or state updates here
        }
      }, 1000)
    },
  },
})

export default useYoutubeStore
