<template>
  <button
    v-if="data.action === 'button'"
    :style="{
      'width': data.width + 'px',
      'height': data.height + 'px',
      'font-size': data.font + 'px'
    }"
    :class="{
      'white-button' : true,
      'short': data.type === 'short',
      'middle': data.type === 'middle',
      'long': data.type === 'long',
      'btn_horizontal': data.list === 'horizontal'
    }"
    @click="actions(event)"
    @click.stop="!disable && $emit('click')"
  >
    {{ data.title }}
  </button>
  <router-link
    v-else-if="data.action === 'link'"
    :to="data.to"
    :style="{ 'width': data.width + 'px', 'height': data.height + 'px' }"
    :class="{
      'white-button' : true,
      'short': data.type === 'short',
      'middle': data.type === 'middle',
      'long': data.type === 'long',
      'btn_horizontal': data.list === 'horizontal',
      link: true
    }"
  >
    {{ data.title }}
  </router-link>
</template>
<script>
export default {
  name: 'WhiteButton',
  props: {
    data: {
      type: Object,
      required: true
    },
    event: {
      type: String,
      required: false
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    actions (event) {
      this.$emit('childs-event', event)
    }
  }
}
</script>
