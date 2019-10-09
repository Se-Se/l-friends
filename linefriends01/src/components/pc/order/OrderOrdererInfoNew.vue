ㅇ<template>
  <!-- [D] 1. 주문자 정보 영역 -->
  <div class="info_com">
    <h2 class="ttl_h2">고객 정보</h2>
    <OrderOrdererInfoMemberNew :orderer="orderer" ref="member"/>
  </div>
</template>

<script>
  import OrderOrdererInfoMemberNew from '@/components/pc/order/OrderOrdererInfoMemberNew'

  export default {
    props: ['logined', 'orderer'],
    components: {
      OrderOrdererInfoMemberNew
    },
    computed: {
      ordererInput () {
        let ordererInput = {}
        if (this.logined) {
          ordererInput = { ...this.$refs.member.ordererInput }
        } else {
          ordererInput = { ...this.$refs.nonMember.ordererInput }
        }
        return ordererInput
      },
      tempPasswordInput () {
        return this.logined ? null : this.$refs.nonMember.tempPassword
      },
      validateRule () {
        return this.logined ? this.$refs.member.validateRule : this.$refs.nonMember.validateRule
      }
    }
  }
</script>
