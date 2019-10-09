import Vue from 'vue'

import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      showMonth: false,
      showPopFlg: false,
      inquiryProductNo: 0,
      orderOption: {},
      pageNo: 1,
      pageSize: 20,
      isShowContact: false,
      isShowReview: false,
      eventBus: new Vue(),
      visible: false,
      textArea: true,
      reviewPop: false,
      reviewDescription: '상품평 작성을 완료하시면 구매확정으로 처리됩니다.',
      layerPopupStatus: null,
      files: {
        choiceText: '파일선택',
        data: 'file'
      },
      goods: {
        title: '상품',
        name: 'goods',
        value: 'goods'
      },
      delivery: {
        title: '배송',
        name: 'delivery',
        value: 'delivery'
      },
      cancel: {
        title: '취소',
        name: 'cancel',
        value: 'cancel'
      },
      returned: {
        title: '반품',
        name: 'returned',
        value: 'returned'
      },
      change: {
        title: '교환',
        name: 'change',
        value: 'change'
      },
      payback: {
        title: '환불',
        name: 'payback',
        value: 'payback'
      },
      others: {
        title: '기타',
        name: 'others',
        value: 'others'
      },
      open: {
        title: '비공개',
        name: 'open',
        value: 'open'
      },
      form: {
        orderCancel: {
          action: 'button',
          to: '',
          title: '주문취소',
          type: 'short',
          list: 'horizontal'
        },
        contactUs: {
          action: 'button',
          to: '',
          title: '문의하기',
          type: 'short',
          list: 'horizontal'
        },
        delivery: {
          action: 'button',
          to: '',
          title: '배송조회',
          type: 'short',
          list: 'horizontal'
        },
        review: {
          action: 'button',
          to: '',
          title: '상품평작성',
          type: 'short',
          list: 'horizontal'
        },
        return: {
          action: 'button',
          to: '',
          title: '반품신청',
          type: 'short',
          list: 'horizontal'
        },
        contact: {
          action: 'button',
          to: '',
          title: '문의하기',
          type: 'short',
          list: 'horizontal'
        }
      }
    }
  },
  name: 'OrderList',
  computed: {
    ...mapState('myorder', ['loading', 'totalCount', 'orders', 'selectTypeFlg']),
    ...mapGetters('common', ['productInquiryTypes'])
  },
  methods: {
    noDone () { },
    pageChange (index) {
      this.pageNo = index
      this.$store.dispatch('myorder/fetchMoreNew', this.pageNo)
    },
    getOrders (period) {
      this.showMonth = false
      this.pageNo = 1
      this.$router.push({
        path: '/mypage/orderlist',
        query: {
          type: 'ORDER',
          period
        }
      })
    },
    layerPopupHandle () {
      this.visible = !this.visible
    },
    textAreaChk () {
      this.textArea = false
    },
    reviewPopAction () {
      this.eventBus.$emit('openPopup')
    },
    layerViews (event) {
      this.layerPopupStatus = event
    },
    clickMonth () {
      this.showMonth = !this.showMonth
    }
  }
}
