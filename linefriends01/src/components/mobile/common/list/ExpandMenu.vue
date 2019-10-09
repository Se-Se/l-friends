<template>
  <div class="expand-menu">
    <label
      :class="['expand-menu__label', size, type, active ? 'active' : '']"
      @click="toggleActive"
    >
      <p class="expand-menu__title">{{ label }}</p>
      <span
        v-if="count"
        class="expand-menu__count"
      >
        ({{ count }})
      </span>
    </label>
    <div>
      <div v-show="active">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import TransitionExpand from '@/components/common/transition/TransitionExpand'

export default {
  name: 'ExpandMenu',
  components: {
    TransitionExpand
  },
  props: {
    label: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: null
    },
    size: {
      type: String,
      default: 'normal'
    },
    type: {
      type: String,
      default: 'normal'
    },
    opened: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: this.opened
    }
  },
  methods: {
    toggleActive () {
      this.active = !this.active
    }
  }
}
</script>

<style lang="scss" scoped>
.expand-menu {
  &__label {
    position: relative;
    display: block;
    padding: 0.33rem 2rem 0.33rem 2rem;
    font-family: 'Noto Sans KR';
    font-size: 1.6rem;
    font-weight: 500;
    letter-spacing: -0.01rem;
    color: #333;
    &.size {
      font-size: 1.6rem;
    }
    &.stroke {
      text-shadow: 0 0 1px #979797;
    }

    &::after {
      position: absolute;
      display: block;
      content: '';
      width: 2rem;
      height: 2rem;
      background: url(~@/assets/images/mobile/ic-small-down.svg);
      background-size: 100% 100%;
      right: 1.6rem;
      top: calc(50% - 1rem);
      transition: transform .2s;
    }

    &.active{
      font-weight: 600;

      &::after {
        transform: rotate(-180deg);
      }
    }
  }

  &__title {
    display: inline-block;
  }

  &__count {
    display: inline-block;
    font-family: Volte, sans-serif;
    font-weight: 600;
    color: #00d664;
    transform: translateY(-0.1rem)
  }
}
</style>
