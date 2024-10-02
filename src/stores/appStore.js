import { defineStore } from "pinia"

const useAppStore = defineStore("app", {
  state: () => ({
    source: "",
    destination: "",
  }),

  getters: {
    getSrc(state) {
      return state.source
    },
    getDest(state) {
      return state.destination
    },
  },

  actions: {},
})

export default useAppStore
