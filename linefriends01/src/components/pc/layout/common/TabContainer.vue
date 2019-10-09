<template>
  <div>
    <div class="tab">
      <button
        type="button"
        v-for="(id, label) in tabs"
        :key="id"
        :class="{ 'tab-btn': true, 'tab-btn--active': id === active }"
        @click="tabUpdate(id)"
      >{{ label }}</button>
    </div>
    <div class="tab-contents">
      <slot />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'tab-container',
  props: {
    tabs: {
      type: Object,
      required: true
    },
    bus: {
      type: Vue,
      required: true
    }
  },
  data () {
    return {
      active: 0
    }
  },
  mounted () {
    let id = Object.values(this.tabs)[0]
    this.tabUpdate(id)
  },
  methods: {
    tabUpdate (id) {
      this.bus.$emit('tab-change', id)
      this.active = id
    }
  }
}
</script>
