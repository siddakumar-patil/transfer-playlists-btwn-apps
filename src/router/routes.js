export default [
  {
    path: "/",
    name: 'Home',
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/NotFound",
    name: "NotFound",
    component: () => import("@/views/HomeView.vue"),
  },
]
