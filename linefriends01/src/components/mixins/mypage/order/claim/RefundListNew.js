import ClickOutside from 'vue-click-outside'

export default {
  directives: {
    ClickOutside
  },
  props: ['isReturn', 'firstOption', 'addOptions', 'claimInfo'],
  methods: {
    updateOption (optionNo, cnt, checkYn) {
      this.claimInfo.forEach(info => {
        if (info.orderProductOptionNo === optionNo) {
          info.productCnt = cnt
          info.checkYn = checkYn
        }
      })
      this.$emit('claimEstimate')
    }
  }
}
