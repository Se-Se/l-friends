<template>
  <transition
    name="expand"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>

<script>
export default {
  name: 'TransitionExpand',
  methods: {
    enter (element) {
      element.style.height = 'auto'
      const height = getComputedStyle(element).height
      element.style.height = 0

      setTimeout(() => {
        element.style.height = height
      })
    },
    afterEnter (element) {
      element.style.height = 'auto'
    },
    leave (element) {
      const height = getComputedStyle(element).height
      element.style.height = height

      setTimeout(() => {
        element.style.height = 0
      })
    }
  }
}
</script>

<style scoped>
* {
  will-change: height;
  backface-visibility: hidden;
}

.expand-enter-active,
.expand-leave-active {
  transition: height .5s;
  overflow: hidden;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>
