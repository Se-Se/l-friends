<template>
  <select class="normal-sel" v-model="select" @change="onChange">
    <option v-for="(option, key) in options" :key="key" :value="option.value" :disabled="option.disabled">
      {{ formatCouponName(option.label) }}
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
      // if (this.select.couponType === 'PRODUCT' && this.select.otherCouponUsable) {
      //   Alert({
      //     message: '同じクーポンは利用不可能です。'
      //   })
      //   this.select = null
      // }
      this.$emit('input', this.select)
      this.$emit('change')
    },
    formatCouponName (couponName) {
      return couponName
      // return couponName && couponName.length > 20 ? couponName.substring(0, 20) + '···' : couponName
    }
  }
}
</script>
