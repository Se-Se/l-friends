<template>
  <div :class="['number-spinner', full ? 'full ' : '', size]">
    <button
      type="button"
      class="number-spinner-btn minus"
      :class="{ active: minusActive }"
      @click="minusSpinner"
    >
      -
    </button>
    <div class="number-spinner-input">
      {{ cnt }}
    </div>
    <button
      type="button"
      class="number-spinner-btn plus"
      :class="{ active: plusActive }"
      @click="plusSpinner"
    >
      +
    </button>
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
    }
  },
  data () {
    return {
      cnt: Number(this.value)
    }
  },
  computed: {
    plusActive () {
      return !this.max || this.cnt < this.max
    },
    minusActive () {
      return this.cnt > this.min
    }
  },
  watch: {
    'value': function (val, oldVal) {
      if (val !== oldVal) {
        this.cnt = val
      }
    }
  },
  methods: {
    plusSpinner () {
      if (this.plusActive) {
        this.cnt++
        this.$emit('input', this.cnt)
      }
    },
    minusSpinner () {
      if (this.minusActive) {
        this.cnt--
        this.$emit('input', this.cnt)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.number-spinner {
  display: flex;
  font-size: 0;

  &-btn {
    padding: 0;
    width: 3rem;
    height: 3.2rem;
    border-color: #ddd;
    border-style: solid;
    border-width: 1px 0 1px;
    outline: none;

    &::before {
      content: '';
      display: block;
      width: 1rem;
      height: 1rem;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      background-color: #999;
      mask-size: 1rem 1rem;
      mask-position: center center;
      mask-repeat: no-repeat;
    }

    &.minus {
      border-left-width: 1px;
      border-radius: .5rem 0 0 .5rem;

      &::before {
        mask-image: url(~@/assets/images/common/ic-minus.svg);
      }
    }

    &.plus {
      border-right-width: 1px;
      border-radius: 0 .5rem .5rem 0;

      &::before {
        mask-image: url(~@/assets/images/common/ic-plus.svg);
      }
    }

    &.active::before {
      background-color: #333;
    }
  }

  &-input {
    line-height: 3.2rem;
    width: 3.2rem;
    height: 3.2rem;
    font-family: Volte, sans-serif;
    font-weight: 600;
    text-align: center;
    color: #333333;
    border: 0.1rem solid #dddddd;
  }

  &.small &-input {
    font-size: 1.4rem;
  }

  &.normal &-input {
    font-size: 1.6rem;
  }

  &.full {
    .number-spinner-btn,
    .number-spinner-input{
      height: 4rem;
    }
    .number-spinner-btn{
      width: 4rem;
    }
    .number-spinner-input {
      width: calc(100% - 8rem);
      line-height: 4rem;
    }
  }
}
</style>
