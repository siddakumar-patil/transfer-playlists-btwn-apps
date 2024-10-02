import { defineStore } from "pinia"
import axios from "axios"

// TODO: implement below
function parseSpotifyPlayListData(playlist) {}

const useUserStore = defineStore("user", {
  state: () => ({
    user_spotify_unauth_access_token: null,
    // tracks: [], // SPotify
    youtube_access_token: null,
    youtube_api_key: null,
    youtubeVidoes: [],
  }),

  getters: {
    getUserSpotifyUnAuthAccessToken(state) {
      return state.user_spotify_unauth_access_token
    },

    // getTracks(state) {
    //   return state.tracks
    // },

    getYoutubeVidoes(state) {
      return state.youtubeVidoes
    },

    getYoutubeAccessToken(state) {
      return state.youtube_access_token
    },

    getYoutubeAPIKey(state) {
      return state.youtube_api_key
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

    async generateSpotifyAccessToken() {
      if (this.getUserSpotifyUnAuthAccessToken !== null) {
        return
      }

      console.log(
        " [ generateSpotifyAccessToken ]:  Generating Access Token for UnAuth Spotify: " +
          this.getUserSpotifyUnAuthAccessToken
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
        console.log(" [ generateSpotifyAccessToken ]: Response generated: " + response.data.access_token)

        if (response.data.access_token !== null && response.status === 200) {
          this.user_spotify_unauth_access_token = response.data.access_token
        }

        //return response.data.access_token // TODO: verify if return is required
      } catch (error) {
        console.error("Error fetching access token:", error.response.data)
      }
    },

    setYoutubeAPIkey() {
      console.log(" [ setYoutubeAPIkey ]: Setting Youtube API KEY: ")
      if (!this.youtube_api_key) this.youtube_api_key = import.meta.env.VITE_APP_YOUTUBE_API_KEY
    },

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

      if (!this.getYoutubeAPIKey) this.setYoutubeAPIkey()

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(
          query
        )}&key=${this.getYoutubeAPIKey}`,
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
          console.error(`Error searching for track "${track}":`, error)
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

export default useUserStore


    // // Fetch tracks from a SPOTIFY playlist
    // async fetchSpotifyPlaylistTracks(spotifyPlaylistUrl, accessToken) {
    //   console.log(" [ fetchSpotifyPlaylistTracks ]:  Fetching PlaylistTracks: " + spotifyPlaylistUrl)

    //   // Regex to extract just playlistId
    //   // const regex = /(?:playlist\/|spotify:playlist:)([a-zA-Z0-9]{22})/

    //   // Regex tro extract everything after playlist/
    //   const regex = /playlist\/([a-zA-Z0-9]{22})(.*)?$/
    //   const match = spotifyPlaylistUrl.match(regex)
    //   const playlistId = match ? match[1] : null
    //   const additionalParams = match ? match[2] : null

    //   // const match = spotifyPlaylistUrl.match(regex)
    //   // const playlistId = match ? match[1] : null

    //   console.log(" [ fetchSpotifyPlaylistTracks ]:  Fetching for playlistId: " + playlistId)

    //   if (playlistId === null) return "Failed" // TODO: Return a proper return

    //   const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}${additionalParams}/tracks`

    //   console.log(" [ fetchSpotifyPlaylistTracks ]:  Fetching Playlist for PlayList Url: " + playlistUrl)

    //   try {
    //     const response = await axios.get(playlistUrl, {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     })

    //     // console.log(" [ fetchSpotifyPlaylistTracks ]:  Fetching PlaylistTracks for: " + JSON.stringify(response.data))

    //     // Setting tracks
    //     if (response.status === 200) {
    //       console.log(" [ fetchSpotifyPlaylistTracks ]:  Setting tracks : " + JSON.stringify(response))

    //       this.tracks = response.data

    //       console.log(" [ fetchSpotifyPlaylistTracks ]: tracks : " + this.getTracks)

    //       // TODO: Fetch Next Pages

    //       // TODO: Handle Response in two ways.. One in such a way that it uses Meta Data and with no meta data

    //       return "Success"
    //     }

    //     // return response.data // TODO: verify if return is required
    //   } catch (error) {
    //     console.error("Error fetching playlist tracks:", error.response.data)
    //     return "Failed"
    //   }
    // },

    // // TODO:
    // async searchSpotifyTrackByQuery(accessToken, query) {
    //   console.log(" [ searchSpotifyTrackByQuery ]: Searching Track: " + query)

    //   console.log(" [ searchSpotifyTrackByQuery ]: Searching Acess: " + accessToken)

    //   const baseUrl = "https://api.spotify.com/v1/search"

    //   try {
    //     const response = await fetch(`${baseUrl}?q=${encodeURIComponent(query)}&type=track&limit=1`, {
    //       method: "GET",
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //         "Content-Type": "application/json",
    //       },
    //     })

    //     if (!response.ok) {
    //       throw new Error(`Error fetching track: ${response.statusText}`)
    //     }

    //     const data = await response.json()

    //     console.log(
    //       " [ searchSpotifyTrackByQuery ]: Response from Search for " +
    //         query +
    //         " is :" +
    //         JSON.stringify(data.tracks.items[0])
    //     )

    //     if (data.tracks.items.length > 0) {
    //       // Return the first track from the search results
    //       const track = data.tracks.items[0]
    //       // TODO: format data propery

    //       return {
    //         name: track.name,
    //         artist: track.artists[0].name,
    //         album: track.album.name,
    //         previewUrl: track.preview_url,
    //         externalUrl: track.external_urls.spotify,
    //       }
    //     } else {
    //       console.log("No tracks found for the query.")
    //       return null
    //     }
    //   } catch (error) {
    //     console.error("Error fetching track:", error)
    //     return null // Handle errors appropriately
    //   }
    // },