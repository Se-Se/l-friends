<template>
    <OrderShoppingInfo ref="member" :orderProductOptions="orderProductOptions" :delivery="delivery" :dTimes="dTimes" :deliveryConditionNo="deliveryConditionNo" :paymentInfo="paymentInfo" :deliveryStartYmt="deliveryStartYmt" :mail="mail" :address="address" @changeAccumulationAmt="changeAccumulationAmt"/>
</template>
<script>
import OrderShoppingInfo from '@/components/escrow/order/OrderShoppingInfo'

export default {
  props: ['logined', 'address', 'ordererInput', 'mail', 'deliveryConditionNo', 'paymentInfo', 'delivery', 'dTimes', 'orderProductOptions', 'deliveryStartYmt'],
  components: {
    OrderShoppingInfo
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
    deliveryWishYmdInput () {
      let deliveryWishYmdInput = {}
      if (this.logined) {
        deliveryWishYmdInput = this.$refs.member.deliveryWishYmdInput.substring(0, 10)
      } else {
        deliveryWishYmdInput = this.$refs.nonMember.deliveryWishYmdInput
      }
      return deliveryWishYmdInput
    },
    deliveryTimeTypeInput () {
      let deliveryTimeTypeInput = {}
      if (this.logined) {
        deliveryTimeTypeInput = this.$refs.member.deliveryTimeTypeInput
      } else {
        deliveryTimeTypeInput = this.$refs.nonMember.deliveryTimeTypeInput
      }
      return deliveryTimeTypeInput
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
