import ClickOutside from 'vue-click-outside'

export default {
  directives: {
    ClickOutside
  },
  props: ['option', 'index', 'firstOption'],
  data () {
    return {
      productCnt: 0,
      active: false,
      initFlg: true
    }
  },
  methods: {
    checkChange () {
      this.initFlg = false
      this.$nextTick(() => {
        if (this.option.checkYn) {
          this.productCnt = this.option.orderCnt
        } else {
          this.productCnt = 0
        }
        this.$emit('updateOption', this.option.orderOptionNo, this.productCnt, this.option.checkYn)
      })
    },
    updateProductCnt (selectCnt) {
      this.initFlg = false
      this.productCnt = selectCnt
      this.active = !this.active
      if (selectCnt === 0) {
        this.option.checkYn = false
      } else {
        this.option.checkYn = true
      }
      this.$emit('updateOption', this.option.orderOptionNo, this.productCnt, this.option.checkYn)
    },
    hideProductCnt () {
      this.active = false
    }
  },
  computed: {
    selectedCount () {
      if (this.productCnt === 0) {
        if (this.firstOption && this.initFlg) {
          this.productCnt = this.option.orderCnt
          return this.productCnt
        } else {
          return '선택'
        }
      } else {
        return this.productCnt
      }
    }
  }
}
