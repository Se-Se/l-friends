<template>
  <a :href="link">
    <app-button
      class="goods-button"
      bold
    >
      {{ $t('button.goods') }} <img src="~@/assets/images/mobile/ic-arrow-right.svg" class="arrow-right">
    </app-button>
  </a>
</template>

<script>
import AppButton from '../common/button/Button'

export default {
  components: {
    AppButton
  },

  props: {
    link: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.arrow-right {
  display: inline-block;
  width: 0.7rem;
  height: 1.4rem;
  margin-top: 0.2rem;
  margin-left: 0.3rem;
  vertical-align: top;
}
</style>
