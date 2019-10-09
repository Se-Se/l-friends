<template>
  <button v-if="data.action === 'button'" :type="type" :class="{
      'btn' : true,
      'btn_green': data.color === 'btn_green',
      'active': data.active === true
    }" :style="{
      width: data.size + 'px',
      height: data.height + 'px'
    }" @click="actions(event)">
    <!-- <span :class="{ico_cart_w:showIco}"></span> -->
    {{ data.title }}
  </button>
</template>
<script>
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
    },
    showIco: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    actions (event) {
      this.$emit('click', event)
    }
  }
}
</script>
