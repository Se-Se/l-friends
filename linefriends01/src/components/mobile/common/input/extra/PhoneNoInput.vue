<template>
  <div class="input-group inline">
    <app-input
      id="phone"
      v-model="phoneNo[0]"
      type="number"
      size="large"
      placeholder="010"
      :readonly="readonly"
      :max="3"
      :noHint="true"
    />
    <app-input
      v-model="phoneNo[1]"
      type="number"
      size="large"
      placeholder="0000"
      :readonly="readonly"
      :max="4"
      :noHint="true"
    />
    <app-input
      v-model="phoneNo[2]"
      type="number"
      size="large"
      placeholder="0000"
      :readonly="readonly"
      :max="4"
      :noHint="true"
    />
  </div>
</template>

<script>
import AppInput from '@/components/mobile/common/input/Input'

export default {
  name: 'PhoneNoInput',
  components: {
    AppInput
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      phoneNo: this.value
    }
  },
  watch: {
    value (next) {
      this.phoneNo = next
    },
    phoneNo (next) {
      this.$emit('input', next)
    }
  }
}
</script>

<style lang="scss" scoped>
.input-group.inline {
  display: flex;

  > *:not(:last-child) {
    margin-right: 0.7rem;
  }
}
</style>
