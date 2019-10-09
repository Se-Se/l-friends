<template>
  <div
    class="not-found"
    :style="{
      height: height + 'rem'
    }"
  >
    <div class="not-found-content">
      <img
        class="not-found__image"
        src="@/assets/images/mobile/nodata-brown.png"
      >
      <p class="not-found__description">
        {{ description }}
      </p>
      <slot />
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
      default: 42.066
    },
    bottom: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  justify-content: center;
  padding-top: 12rem;

  &-content {
    text-align: center;
  }

  &__image {
    width: 8.333rem;
    height: 14rem;
    margin-bottom: 2rem;
  }

  &__description {
    font-size: 1.4rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #666;
  }
}
</style>
