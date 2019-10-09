<template>
  <div
    :class="['not-found', character]"
    :style="{
      height: height + 'rem',
      'padding-bottom': bottom + 'rem'
    }"
  >
    <div class="not-found-content">
      <figure v-if="friend == true">
        <img
          v-if="character === 'selly'"
          class="not-found__image"
          src="~@/assets/images/mobile/not-found.png"
        >
        <img
          v-if="character === 'brown'"
          class="not-found__image"
          src="~@/assets/images/mobile/nodata-brown.png"
        >
      </figure>
      <p class="not-found__description">
        {{ description }}
        <slot />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  props: {
    description: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 56
    },
    bottom: {
      type: Number,
      default: 0
    },
    friend: {
      type: Boolean,
      default: true
    },
    character: {
      type: String,
      default: 'selly'
    }
  }
}
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;

  &-content {
    text-align: center;
  }

  &.selly &__image {
    width: 7.833rem;
    height: 10rem;
    margin-top: 0.2rem;
    margin-bottom: 3.2rem;
    margin-left: 1.1rem;
  }

  &.brown &__image {
    width: 8.3rem;
    height: 14rem;
    margin-bottom: 2rem;
  }

  &__description {
    padding-top: 10px;
    font-size: 1.4rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    line-height: 1.25;
    letter-spacing: -0.04rem;
    color: #666666;
  }
}
</style>
