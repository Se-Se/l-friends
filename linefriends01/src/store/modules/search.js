export default {
  namespaced: true,
  state: {
    showSearchLayer: false
  },
  mutations: {
    show_search_layer (state) {
      state.showSearchLayer = true
    },
    hide_search_layer (state) {
      state.showSearchLayer = false
    }
  }
}
