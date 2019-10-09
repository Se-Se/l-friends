<template>
  <div class="spinner">
    <button
      type="button"
      :class="{ 'spinner-minus':true, '_disable': cnt <= 1}"
      @click="minus()"
    >
      {{ $t('assets.spinner.minus') }}
    </button>
    <input
      type="text"
      class="spinner-input"
      :max="max"
      :min="min"
      v-model="cnt"
    >
    <button
      type="button"
      class="spinner-plus"
      @click="plus()"
    >
      {{ $t('assets.spinner.add') }}
    </button>
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
    }
  },
  data () {
    return {
      cnt: Number(this.value)
    }
  },
  computed: {
    plusActive () {
      return !this.max || this.cnt <= this.max
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
