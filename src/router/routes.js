import { mergeProps } from "vue";

export default [
  {
    path: "/",
    name: '/',
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/home",
    name: 'Home',
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/playlistsrc",
    name: 'PlaylistSource',
    component: () => import("@/views/PlayListSourceView.vue"),
  },
  {
    path: "/playlistdest",
    name: 'PlaylistDest',
    component: () => import("@/views/PlayListDestinationView.vue"),
  },
  {
    path: "/youtubecallback",
    name: 'YoutubeCallback',
    component: () => import("@/views/HandleYoutubeCallbackView.vue"),
  },
  {
    path: "/spotifycallback",
    name: 'SpotifyCallback',
    component: () => import("@/views/HandleSpotifyCallbackView.vue"),
  },
  {
    path: "/youtubeplaylistdest",
    name: 'YoutubePlaylistDest',
    component: () => import("@/views/YouTubePlaylistDestView.vue"),
  },
  {
    path: "/spotifyplaylistdest",
    name: 'SpotifylaylistDest',
    component: () => import("@/views/SpotifyPlaylistDestView.vue"),
  },
  {
    path: "/spotifysrc",
    name: 'SpotifyPlaylistForm',
    component: () => import("@/views/SpotifyPlaylistFormView.vue"),
  },
  {
    path: "/spotifyplaylist",
    name: 'SpotifyPlaylist',
    component: () => import("@/views/SpotifyPlaylistView.vue"),
  },
  {
    path: "/youtubeplaylist",
    name: 'YoutubePlaylist',
    component: () => import("@/views/YoutubePlaylistView.vue"),
  },
  {
    path: "/NotFound",
    name: "NotFound",
    component: () => import("@/views/PageNotFoundView.vue"),
  },
  {
    path:'/:pathMatch(.*)*',
    name: "NotFound",
    component: () => import("@/views/PageNotFoundView.vue"),
  },
]
