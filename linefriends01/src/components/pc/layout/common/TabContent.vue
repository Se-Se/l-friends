<template>
  <section>
    <template v-if="tabShow">
      <div v-show="show" class="tab-content">
        <slot />
      </div>
    </template>
    <template v-else>
      <div v-if="show" class="tab-content">
        <slot />
      </div>
    </template>
  </section>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'Tab',
  props: {
    tabId: {
      type: [String, Number],
      required: false
    },
    bus: {
      type: Vue,
      required: true
    },
    tabShow: {
      type: Boolean,
      required: false
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
