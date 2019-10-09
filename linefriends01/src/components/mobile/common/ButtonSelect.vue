<template>
  <ul class="radio-select">
    <li
      v-for="(option, key) in options"
      :key="key"
      class="radio-select__item"
      :class="{ active: active === key }"
      @click="setActive(key)"
    >
      {{ option.label }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ButtonSelect',
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      required: false
    }
  },
  data () {
    return {
      active: 0
    }
  },
  watch: {
    value (next) {
      this.active = this.options.map(item => item.value).indexOf(next)
    }
  },
  created () {
    if (this.value) {
      for (const key in this.options) {
        const option = this.options[key]
        if (option.value === this.value) {
          this.active = Number(key)
          break
        }
      }
    }
  },
  methods: {
    setActive (key) {
      this.active = key
      this.$emit('input', this.options[key].value)
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-select {
  display: flex;

  &__item {
    width: 5.8rem;
    height: 2.8rem;
    padding-top: 0.8rem;
    font-family: 'Noto Sans KR';
    font-weight: 500;
    font-size: 1.2rem;
    letter-spacing: -0.01rem;
    color: #999;
    text-align: center;
    background: #fafafa;
    border-radius: 1.4rem;

    &:not(:last-child) {
      margin-right: 0.7rem;
    }

    &.active {
      background: #00d664;
      color: #fff;
    }
  }
}
</style>
