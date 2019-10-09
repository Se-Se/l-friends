<template>
  <div class="opt_count">
    <span class="bx_count">
      <button type="button" :class="{ 'btn_plus':true}" :disabled="cnt <= 1" @click="minus()">
        減少
      </button>
      <input type="text" class="count_input" :max="max" :min="min" v-model="cnt">
      <button type="button" class="btn_minus" @click="plus()">
      </button>
    </span>
    <button type="button" class="btn_del" @click="Delet" v-if="showDelet">X</button>
  </div>
</template>
<script>
export default {
  name: 'Spinner',
  props: {
    value: {
      type: [Number, String],
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
    showDelet: {
      type: Boolean,
      default: true
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
    },
    Delet () {
      this.$emit('decleSpinner')
    }
  }
}
</script>
