<template>
  <label :class="['radio--wrap', isCheck ? 'checked' : '', size]">
    <input
      type="radio"
      class="radio"
      :value="content"
      :name="name"
      :checked="isCheck"
      @change="$emit('input', content)"
    >
    <slot />
  </label>
</template>

<script>
export default {
  name: 'Radio',
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'normal'
    },
    name: {
      type: String,
      required: true
    },
    value: {
      required: true
    },
    content: {
      required: true
    }
  },
  computed: {
    isCheck () {
      return this.value === this.content
    }
  }
}
</script>

<style lang="scss" scoped>
.radio {
  display: none;

  &--wrap {
    font-size: 0;
    &::before {
      content: '';
      display: inline-block;
      border-radius: 1.2rem;
      vertical-align: top;

      background-image: url(~@/assets/images/mobile/ic-radio.svg);
      background-size: 100% 100%;
    }

    &.normal::before {
      width: 2rem;
      height: 2rem;
    }

    &.large::before {
      width: 2.4rem;
      height: 2.4rem;
    }

    &.checked::before {
      background-image: url(~@/assets/images/mobile/ic-radio--active.svg)
    }
  }
}
</style>
