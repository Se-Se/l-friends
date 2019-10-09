<template>
  <select
    :class="['app-select', size]"
    v-model="select"
    @change="onChange"
  >
    <option
      v-for="(option, key) in options"
      :key="key"
      :value="option.value"
      :disabled="option.disabled"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'Select',
  props: {
    options: {
      type: Array,
      required: true
    },
    size: {
      type: String,
      default: 'normal'
    },
    value: {
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
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-select {
  background: #fff;
  width: 100%;
  padding: 1.3rem 4rem 1.3rem 1.8rem;
  height: 5.2rem;
  border: 1px solid #ddd;
  border-radius: 0.4rem;
  font-family: 'Noto Sans KR';
  font-size: 1.4rem;
  color: #333;
  letter-spacing: -0.01rem;
  line-height: normal;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background-image: url(~@/assets/images/mobile/ic-small-down.svg);
  background-size: 2rem 2rem;
  background-position: right 1.4rem top 1.5rem;
  background-repeat: no-repeat;

  &.small {
    padding: 0.9rem 1.2rem;
    height: 4rem;
    background-position: right 1.2rem top 1rem;
  }
}
</style>
