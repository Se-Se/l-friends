<template>
  <label :class="['checkbox--wrap', isCheck ? 'checked' : '', size]" :for="id">
    <input
      :id="id"
      ref="checkbox"
      type="checkbox"
      class="checkbox"
      v-model="toggleValue"
      :disabled="disabled"
    >
    <slot />
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    value: { required: true },
    checked: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'normal'
    },
    id: {
      type: String,
      default: 'Checkbox___' + Math.floor(Math.random() * 100000)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  model: {
    event: 'change',
    prop: 'value'
  },
  watch: {
    value (next) {
      this.checkValue = next
    }
  },
  data () {
    return {
      checkValue: this.value
    }
  },
  computed: {
    toggleValue: {
      get: vm => vm.checkValue,
      set (value) {
        this.checkValue = value
        this.$emit('change', value)
      }
    },
    isCheck () {
      return this.toggleValue === true
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: none;

  &--wrap {
    font-size: 0;
    &::before {
      content: '';
      display: inline-block;
      margin-top: .3rem;
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
