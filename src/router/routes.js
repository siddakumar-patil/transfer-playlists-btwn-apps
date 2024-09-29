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
    path: "/NotFound",
    name: "NotFound",
    component: () => import("@/views/PageNotFoundView.vue"),
  },
]
