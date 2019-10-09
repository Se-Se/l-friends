export default {
  namespaced: true,
  state: {
    popups: []
  },
  actions: {
    closeAllPopups ({ state, commit }) {
      for (let popup of state.popups) {
        popup.$emit('update:show', false)
      }
    }
  },
  getters: {
    isExistsOpenPopup (state) {
      let show = false
      for (let popup of state.popups) {
        show = show || popup.show
      }
      return show
    }
  },
  mutations: {
    addPopup (state, popup) {
      state.popups = [...state.popups, popup]
    },
    resetPopups (state) {
      state.popups = []
    }
  }
}
