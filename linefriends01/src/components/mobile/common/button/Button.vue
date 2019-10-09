<template>
  <div>
    <button
      :class="['app-button', type, size, disable ? 'disable' : '', bold ? 'bold' : '', middle ? 'middle' : '', faq ? 'faq' : '']"
      @click.stop="clickListener"
    >
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    to: {
      type: [String, Object],
      default: ''
    },
    size: {
      type: String,
      default: 'normal'
    },
    disable: {
      type: Boolean,
      default: false
    },
    bold: {
      type: Boolean,
      default: false
    },
    middle: {
      type: Boolean,
      default: false
    },
    faq: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clickListener () {
      if (!this.disable) {
        if (this.to) {
          this.$router.push(this.to)
        }
        this.$emit('click')
      }
    }
  }
}
</script>
