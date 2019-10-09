<template>
  <div class="tab_list">
    <ul>
      <li :class="{on:id === active}" v-for="(id, label) in tabs" :key="id" @click.prevent="tabUpdate(id)">
        <a href="#"> {{ label }}</a>
        <p v-if="count[id] !== undefined">{{ count[id].toLocaleString() > 99 ? '99+': count[id].toLocaleString()}}</p>
      </li>
    </ul>
    <slot />
  </div>
</template>

<script>
import TabContainer from './TabContainer'
export default {
  name: 'BorderTabContainer',
  mixins: [TabContainer],
  props: {
    goods: {
      type: Boolean,
      default: false
    },
    tabName: {
      type: String
    }
  },
  mounted () {
    if (this.$route.query.from === 'GoodsInquiryDetail') {
      let id = Object.values(this.tabs)[2]
      this.tabUpdate(id)
    } else {
      if (this.tabName) {
        let ids = this.tabName
        this.tabUpdate(ids)
      } else {
        let ids = Object.values(this.tabs)[0]
        this.tabUpdate(ids)
      }
    }

    this.bus.$on('set', id => {
      this.tabUpdate(id)
    })
  },
  computed: {
  },
  methods: {
    tabUpdate (id) {
      this.$emit('click')
      this.$emit('changeTab', id)
      this.bus.$emit('tab-change', id)
      this.active = id
    }
  }
}
</script>

<style scoped>
</style>
