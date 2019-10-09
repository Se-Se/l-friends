<template>
  <div class="bx_select" v-click-outside="closeItem">
    <div :class="['txt_select', {'on' : showItem}]" @click.prevent="showItem = !showItem">
      <span class="select_vle">{{showLabel}}</span>
      <span class="ico_arrow">選択</span>
    </div>
    <ul :class="['lst_select_content', listClass]">
      <li v-for="(item, index) in items" :key="index" @click.prevent="selected(item.value)">
        <a href="javascript:">{{item.label}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import ClickOutside from '@/utils/VueClickOutside.js'
export default {
  props: ['showValue', 'items', 'defaultLabel', 'listClass'],
  directives: {
    ClickOutside
  },
  data () {
    return {
      showItem: false
    }
  },
  computed: {
    showLabel () {
      let label = null
      this.items.forEach(item => {
        if (item.value === this.showValue) {
          label = item.label
        }
      })
      if (label === null) {
        label = this.defaultLabel || ''
      }
      return label
    }
  },
  methods: {
    closeItem () {
      this.showItem = false
    },
    selected (value) {
      this.showItem = false
      this.$emit('selected', value)
    }
  }
}
</script>
