<template>
  <app-button
    type="success"
    @click="buyChecked"
  >
    주문하기
  </app-button>
</template>

<script>
import AppButton from '@/components/mobile/common/button/Button'
import CartBtnNew from '@/components/mixins/cart/CartBtnNew'

export default {
  name: 'CartBtnNew',
  mixins: [CartBtnNew],
  components: {
    AppButton
  }
}
</script>

