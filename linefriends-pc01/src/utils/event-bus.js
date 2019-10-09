import Vue from 'vue'
export const EventBus = new Vue()

export const Alert = (params) => {
  EventBus.$emit('alert', params)
}

export const Confirm = (params) => {
  EventBus.$emit('confirm', params)
}

let onScrollListeners = []
export const onScrollNextPage = (callback) => {
  let listener = (() => {
    let loading = false
    return async () => {
      if (!loading) {
        loading = true
        await callback()
        loading = false
      }
    }
  })()

  EventBus.$on('scroll.nextPage', listener)
  onScrollListeners.push(listener)
}

export const offScrollNextPage = () => {
  for (let listener of onScrollListeners) {
    EventBus.$off('scroll.nextPage', listener)
  }

  onScrollListeners = []
}
