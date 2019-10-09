<template>
  <div
    v-show="show"
    class="tab-content"
  >
    <slot />
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'Tab',
  props: {
    tabId: {
      type: [String, Number],
      required: true
    },
    bus: {
      type: Vue,
      required: true
    }
  },
  data () {
    return {
      show: false
    }
  },
  created () {
    this.bus.$on('tab-change', id => {
      this.show = String(id) === String(this.tabId)
    })
  }
}
</script>

<style scoped>

</style>
