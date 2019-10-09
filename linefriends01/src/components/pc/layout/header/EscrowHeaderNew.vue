<template>
  <div>
    <h1>{{title}}</h1>
    <div class="bx_tit_step" v-if="page !== 'paymentConfirmFail'">
      <!-- [D] 활성화 된 스텝(tit_step)에 on클래스 추가 -->
      <div class="tit_step" :class="{on : page==='cart'}">{{ $t('header.escrowHeaderNew.cart') }}</div>
      <div class="tit_step" :class="{on : page==='orderSheet'}">{{ $t('header.escrowHeaderNew.order') }}</div>
      <div class="tit_step" :class="{on : page==='paymentConfirm'}">{{ $t('header.escrowHeaderNew.orderFinish') }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['page'],
    computed: {
      title () {
        let title = ''
        switch (this.page) {
          case 'cart':
            title = this.$t('header.escrowHeaderNew.cart')
            break
          case 'orderSheet': // UNAUTHORIZED
            title = this.$t('header.escrowHeaderNew.order')
            break
          case 'paymentConfirm':
            title = this.$t('header.escrowHeaderNew.orderFinish')
            break
          case 'paymentConfirmFail':
            title = this.$t('header.escrowHeaderNew.orderFail')
            break
        }
        return title
      }
    }
  }
</script>
