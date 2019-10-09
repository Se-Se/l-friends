<template>
  <div class="information">
    <i :class="['information-icon', size]">i</i>
    <p class="information-message"><slot /></p>
  </div>
</template>

<script>
export default {
  name: 'Information',
  props: {
    size: {
      type: String,
      default: 'normal'
    }
  }
}
</script>

<style lang="scss" scoped>
.information {
  display: flex;

  &-icon {
    display: inline-block;
    margin-right: 1.2rem;
    font-size: 0;
    background-size: 100% 100%;
    background-image: url(~@/assets/images/mobile/ic-information.svg);
    margin-top: 0.1rem;

    &.normal {
      width: 1.9rem;
      height: 1.9rem;
    }

    &.small {
      width: 1.6rem;
      height: 1.6rem;
    }
  }

  &-message {
    max-width: calc(100% - 3.1rem);
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 1.43;
    letter-spacing: -0.01rem;
    color: #666;
  }
}
</style>
