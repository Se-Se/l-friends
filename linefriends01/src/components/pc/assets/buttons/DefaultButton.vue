<template>
  <button
    v-if="data.action === 'button'"
    :type="type"
    :class="{
      'default-button' : true,
      'long': data.type === 'long',
      '_half': data.type === 'half',
      'gray': data.color === 'gray',
      'white': data.color === 'white',
      'active': data.active === true
    }"
    :style="{
      width: data.size + 'px',
      height: data.height + 'px'
    }"
    @click="actions(event)"
  >
    {{ data.title }}
  </button>
  <a
    v-else-if="data.action === 'link'"
    :href="data.to"
    :class="{
      'default-button' : true,
      'long': data.type === 'long',
      '_half': data.type === 'half',
      'active': data.active === true,
      link: true
    }"
    :style="{
      width: data.size + 'px',
      height: data.height + 'px'
    }"
  >
    {{ data.title }}
  </a>
</template>
<script>
import $ from 'jquery'
export default {
  name: 'DefaultButton',
  props: {
    data: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'button'
    },
    event: {
      type: String,
      required: false
    }
  },
  methods: {
    actions (event) {
      // $('html').css('overflow', 'hidden')
      this.$emit('click', event)
    }
  }
}
</script>
