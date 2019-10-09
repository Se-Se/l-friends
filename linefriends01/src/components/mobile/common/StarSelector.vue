<template>
  <ul class="star-selector">
    <li
      v-for="i in length"
      :key="i"
      :class="{ 'star-selector__item': true, active: active >= i }"
      @click="setValue(i)"
    >
      ★
    </li>
  </ul>
</template>

<script>
export default {
  name: 'StartSelector',
  props: {
    length: {
      type: Number,
      default: 5
    },
    value: {
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: this.value
    }
  },
  watch: {
    value (next) {
      this.active = next
    }
  },
  methods: {
    setValue (val) {
      if (this.readonly) {
        return false
      }
      this.active = val
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.star-selector {
  display: flex;

  &__item {
    margin-right: 0.6rem;
    font-size: 0;
    width: 1.6rem;
    height: 1.533rem;
    background-size: 100% 100%;
    background-image: url(~@/assets/images/common/icons/ic-star-off.svg);

    &.active {
      background-image: url(~@/assets/images/common/icons/ic-star-on.svg);
    }
  }
}
</style>
