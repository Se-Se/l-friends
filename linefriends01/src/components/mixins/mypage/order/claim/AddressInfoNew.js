export default {
  props: ['claimOrderOption'],
  data () {
    return {
      updatedAddressFlag: false,
      isShowAddress: false
    }
  },
  methods: {
    openOrderClaimReturnAddressPopup () {
      this.isShowAddress = true
      this.$refs.addressPop.openOrderClaimReturnAddressPopup()
    },
    setReturnAddress () {
      this.updatedAddressFlag = true
    }
  },
  computed: {
    showReturnAddress () {
      let returnAddressInput = this.claimOrderOption.returnAddress
      if (this.updatedAddressFlag && this.$refs.addressPop.addressUpdateFlg) {
        returnAddressInput = this.$refs.addressPop.returnAddressInput
        console.log(returnAddressInput)
        this.claimOrderOption.returnAddress = this.$refs.addressPop.returnAddressInput
      }
      return returnAddressInput
    }
  }
}
