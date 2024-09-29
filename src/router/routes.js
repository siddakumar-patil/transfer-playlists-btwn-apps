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
    path: "/NotFound",
    name: "NotFound",
    component: () => import("@/views/PageNotFoundView.vue"),
  },
]
