<template>
  <select v-model="select" @change="onChange" :disabled="disabled">
    <option v-for="(option, key) in options" :key="key" :value="option.value" :disabled="(option.disabled || disabled || key ===0)">
      {{ option.label }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'PackageSelect',
  props: {
    options: {
      type: [Array, Object],
      required: false
    },
    optionPrice: {
      required: false
    },
    size: {
      type: String,
      default: 'normal'
    },
    value: {
      required: false
    },
    disabled: {
      required: false
    }
  },
  data () {
    return {
      select: this.value
    }
  },
  watch: {
    value (next) {
      this.select = this.value
    }
  },
  methods: {
    onChange () {
      this.$emit('input', this.select)
      this.$emit('checkStatus', 1)
    }
  }
}
</script>
