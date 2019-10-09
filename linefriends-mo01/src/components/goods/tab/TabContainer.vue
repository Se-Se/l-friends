<template>
  <article class="tab">
    <div class="tab_list_area">
      <div class="tab-list">
        <ul>
          <li v-for="(id, label) in tabs" :key="id" :class="{ 'on': id === active }" @click.prevent="tabUpdate(id)">
            <a href="#">
              {{ label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="tab-contents">
      <slot />
    </div>
  </article>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'TabContainer',
  props: {
    tabs: {
      type: Object,
      required: true
    },
    count: {
      type: Object,
      default: () => ({})
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

    this.bus.$on('set', id => {
      this.tabUpdate(id)
    })
  },
  methods: {
    tabUpdate (id) {
      this.bus.$emit('tab-change', id)
      this.active = id
    }
  }
}
</script>

<style scoped>

</style>
