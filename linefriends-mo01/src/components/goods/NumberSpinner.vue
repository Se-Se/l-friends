<template>
  <div class="option-num">
    <span :class="{bx_count:true,big:full}">
      <button type="button" class="btn_plus" :disabled="!minusActive" @click="minus()">-</button>
      <input type="text" title="購入数" v-model="cnt" :max="max" :min="min" class="count_input">
      <button type="button" :disabled="!plusActive" class="btn_minus" v-not-double-click @click="plus()">+</button>
    </span>
    <button class="option-size-close" @click="$emit('Delet')" v-if="showDelet"></button>
  </div>
</template>

<script>
export default {
  name: 'NumberSpinner',
  props: {
    value: {
      type: Number,
      default: 0
    },
    full: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: null
    },
    size: {
      type: String,
      default: 'small'
    },
    showDelet: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      cnt: Number(this.value)
    }
  },
  computed: {
    plusActive () {
      return (!this.max && this.max !== 0) || this.cnt <= this.max
    },
    minusActive () {
      return this.cnt > this.min
    }
  },
  watch: {
    cnt (next) {
      this.$emit('input', next)
    },
    value (next) {
      if (next >= 9999) {
        this.cnt = 9999
      } else {
        if (next <= 0) {
          this.cnt = 1
        } else {
          this.cnt = Number(next) | 0
        }
      }
    }
  },
  methods: {
    plus () {
      if (this.plusActive) {
        this.cnt++
      }
    },
    minus () {
      if (this.minusActive) {
        this.cnt--
      }
    }
  }
}
</script>
<style>
</style>
