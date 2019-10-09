<template>
  <img
    class="lazy-image"
    :class="{ loading: loading }"
    ref="img"
    :data-src="src"
  >
</template>

<script>
import lozad from 'lozad'

export default {
  name: 'LazyImg',
  props: {
    src: {
      type: String,
      requried: true
    }
  },
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    this.loadImage()
  },
  methods: {
    loadImage () {
      const setLoadingState = () => {
        this.loading = false
      }

      this.$el.addEventListener('load', setLoadingState)

      this.$once('hook:destroyed', () => {
        this.$el.removeEventListener('load', setLoadingState)
      })

      const observer = lozad(this.$el)
      observer.observe()
    }
  }
}
</script>

<style lang="scss" scoped>
.lazy-image {
  opacity: 1;
  transition: .3s;

  &.loading {
    opacity: 0;
  }
}
</style>
