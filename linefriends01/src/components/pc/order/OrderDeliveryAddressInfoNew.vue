<template>
  <OrderDeliveryAddressInfoMemberNew ref="member" :address="address" :requireCustomsIdNumber="requireCustomsIdNumber" @changeAccumulationAmt="changeAccumulationAmt"/>
</template>
<script>
import OrderDeliveryAddressInfoMemberNew from '@/components/pc/order/OrderDeliveryAddressInfoMemberNew'

export default {
  props: ['logined', 'address', 'requireCustomsIdNumber', 'ordererInput'],
  components: {
    OrderDeliveryAddressInfoMemberNew
  },
  computed: {
    shippingAddressInput () {
      let shippingAddressInput = {}
      if (this.logined) {
        // addressNo, addressName setting
        shippingAddressInput = { ...this.$refs.member.shippingAddressInput }
      } else {
        shippingAddressInput = { ...this.$refs.nonMember.shippingAddressInput }
      }
      return shippingAddressInput
    },
    isNewAddress () {
      let isNewAddress = true
      if (this.logined) {
        isNewAddress = this.$refs.member.checkedNewAddressValue
      }
      return isNewAddress
    },
    deliveryMemoInput () {
      let deliveryMemoInput = {}
      if (this.logined) {
        deliveryMemoInput = this.$refs.member.deliveryMemoInput
      } else {
        deliveryMemoInput = this.$refs.nonMember.deliveryMemoInput
      }
      return deliveryMemoInput
    },
    validateRule () {
      return this.$refs.member.validateRule
    }
  },
  methods: {
    copyOrderer () {
      this.$emit('copyOrderer')
    },
    setOrdererInput (ordererInput) {
      this.$refs.nonMember.setOrderer(ordererInput)
    },
    changeAccumulationAmt (accumulationAmt) {
      this.$emit('changeAccumulationAmt', accumulationAmt)
    }
  }
}
</script>
