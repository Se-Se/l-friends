/* global NCPPay */

import { mapState, mapGetters } from 'vuex'
import cookies from 'js-cookie'
import config from '@/config/index'
import Validator from '@/utils/validateUtils'
import { getPrevOrderInfoInStoreage, deletePrevOrderInfoInStoreage } from '@/utils/orderUtils'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  data () {
    return {
      orderSheetNo: this.$store.state.route.params.orderSheetNo,
      logined: this.$store.getters.isLogined,
      checkState: false,
      orderData: {
        orderSheetNo: this.$store.state.route.params.orderSheetNo,
        shippingAddress: {},
        saveAddressBook: false,
        orderMemo: '',
        deliveryMemo: '',
        member: true,
        orderer: {
          ordererName: '',
          ordererContact1: '',
          ordererContact2: '',
          ordererEmail: ''
        },
        updateMember: true,
        tempPassword: null,
        coupons: null,
        subPayAmt: 0,
        orderTitle: '',
        payType: 'CREDIT_CARD',
        pgType: 'INICIS'
        // insurance에 대해서 여쭤보기
        /*
        applyInsurance: false,
        agreementEmail: false,
        agreementSMS: false,
        sex: 'MALE',
        insuranceType: 'USAFE',
        birthYmd: ''
        */
      },
      active: {
        coupon: true
      }
    }
  },
  methods: {
    copyOrderer () {
      const ordererInput = this.$refs.orderOrdererInfo.ordererInput
      this.$refs.orderDeliveryAddressInfo.setOrdererInput(ordererInput)
    },
    checkAll (value) {
      this.changeCheckState(value)
      this.agreeAll()
    },
    changeCheckState (value) {
      this.checkState = value
    },
    agreeAll () {
      this.$refs.orderAgreement.agreeAll(this.checkState)
    },
    payments (pgType, payType) {
      let deliveryAddressValidateRule = this.$refs.orderDeliveryAddressInfo.validateRule
      let validateRule = [
        ...deliveryAddressValidateRule
      ]
      const validator = new Validator(validateRule)
      if (validator.validate()) {
        return false
      }
      let agreeCheckAll = this.$refs.orderPaymentConfirm.agreeCheckAll
      if (!agreeCheckAll) {
        Alert({
          message: '동의 항목에 체크하여야 결제를 진행할 수 있습니다'
        })
        // alert('동의 항목에 체크하여야 결제를 진행할 수 있습니다.')
        return
      }

      if (!this.$refs.orderDeliveryAddressInfo.shippingAddressInput.receiverDetailAddress && this.$refs.orderDeliveryAddressInfo.isNewAddress) {
        Confirm({
          message: '상세주소를 입력하지 않고 주문하시겠습니까?',
          onCancel: () => {
            if (!this.$store.getters.memberIsLogin) {
              this.$refs.orderDeliveryAddressInfo.$refs.nonMember.$refs.receiverDetailAddress.focus()
            } else {
              this.$refs.orderDeliveryAddressInfo.$refs.member.$refs.receiverDetailAddress.focus()
            }
            return false
          }
        })
        // if (!confirm('상세주소를 입력하지 않고 주문하시겠습니까?')) {
        //   if (!this.$store.getters.memberIsLogin) {
        //     this.$refs.orderDeliveryAddressInfo.$refs.nonMember.$refs.receiverDetailAddress.focus()
        //   } else {
        //     this.$refs.orderDeliveryAddressInfo.$refs.member.$refs.receiverDetailAddress.focus()
        //   }
        //   return false
        // }
      }

      let shippingAddressInput = this.$refs.orderDeliveryAddressInfo.shippingAddressInput
      let deliveryMemoInput = this.$refs.orderDeliveryAddressInfo.deliveryMemoInput
      this.orderData.orderer = {
        ordererName: shippingAddressInput.receiverName,
        ordererContact1: shippingAddressInput.receiverContact1,
        ordererEmail: this.ordersheet.ordererContact.ordererEmail
      }
      this.orderData.orderTitle = this.orderProductOptions[0].showProductName + (this.orderProductOptions.length > 1 ? ' 외 ' + (this.orderProductOptions.length - 1) + '건' : '')
      this.orderData.shippingAddress = { ...shippingAddressInput }
      this.orderData.deliveryMemo = deliveryMemoInput
      this.orderData.pgType = pgType
      this.orderData.payType = payType

      let confirmUrl = `${location.protocol}//${location.host}/order/paymentconfirm`

      // 비회원
      if (!this.$store.getters.memberIsLogin) {
        confirmUrl = `${location.protocol}//${location.host}/order/paymentconfirm/guest`
        let tempPasswordInput = this.$refs.orderOrdererInfo.tempPasswordInput
        this.orderData.member = false
        this.orderData.updateMember = false
        this.orderData.tempPassword = tempPasswordInput
      }

      const searchProductID = this.$store.state.route.query.searchProductID
      const productNo = this.$store.state.route.query.productNo
      const cartNos = this.$store.state.route.query.cartNos
      let params = []
      if (searchProductID) {
        params.push('searchProductID=' + searchProductID)
      }
      if (productNo) {
        params.push('productNo=' + productNo)
      }
      if (cartNos) {
        params.push('cartNos=' + cartNos)
      }
      confirmUrl += params.length > 0 ? ('?' + params.join('&')) : ''

      // 쿠폰 setting
      const coupons = JSON.parse(JSON.stringify(this.couponRequest))
      if (coupons.productCoupons && coupons.productCoupons.length > 0) {
        coupons.productCoupons = coupons.productCoupons.filter(item => item.couponIssueNo !== 0 || item.plusCouponIssueNo !== 0)
      }
      this.orderData.coupons = coupons
      this.orderData.paymentAmtForVerification = this.ordersheet.paymentInfo.paymentAmt
      NCPPay.setConfiguration({
        clientId: config.ncpClientId,
        accessToken: cookies.get('ncpAccessToken'),
        confirmUrl: confirmUrl,
        platform: config.platform
      })

      NCPPay.reservation(this.orderData, response => {
        deletePrevOrderInfoInStoreage(this.orderData.orderSheetNo)
      }, e => {
        if (e.code === 'C2014') {
          this.resetCoupon(null)
          return
        }
        if (e.code === 'PPE0002') {
          window.location.reload()
        }
        const codeparrten = /C2[0-9][0-9][0-9]/
        if (codeparrten.test(e.code) || e.code === 'C1020') {
          let requestUrl = '/order/getsheetno'
          requestUrl += params.length > 0 ? ('?' + params.join('&')) : ''
          const orderinfo = getPrevOrderInfoInStoreage(this.orderData.orderSheetNo)
          if (!orderinfo) {
            return
          }
          window.localStorage.orderInfo = orderinfo
          window.location.replace(requestUrl)
        }
      })
    },
    resetCoupon (coupon) {
      const productNo = this.$store.state.route.query.productNo
      const couponIssueNo = coupon ? coupon.couponIssueNo : 0
      const couponReq = JSON.parse(JSON.stringify(this.couponRequestCopy))
      let coupoType = ''
      if (couponReq.productCoupons) { coupoType = 'PRODUCT' }
      if (couponReq.productPlusCoupons) { coupoType = 'PRODUCT_PLUS' }
      switch (coupoType) {
        case 'PRODUCT':
          this.$store.commit('ordersheet/SET_COUPONREQUEST_COUPONISS', { productNo: productNo, couponIssueNo: couponIssueNo, isCopy: true })
          break
        case 'PRODUCT_PLUS':
          this.$store.commit('ordersheet/SET_COUPONREQUEST_PLUSCOUPONISS', { productNo: productNo, plusCouponIssueNo: couponIssueNo, isCopy: true })
          break
        case 'CART':
          let otherCouponUsable = coupon ? coupon.otherCouponUsable : true
          couponReq.cartCouponIssueNo = couponIssueNo
          this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
          this.$store.commit('ordersheet/CHANGE_OTHER_COUPON_USABLE', otherCouponUsable)
          break
        case 'CART_DELIVERY':
          couponReq.deliveryCouponIssueNo = couponIssueNo
          this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
          break
      }
      this.$store.dispatch('ordersheet/calculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequestCopy })
      this.$store.dispatch('ordersheet/applyCouponOrderReset', { orderSheetNo: this.orderSheetNo }).then(() => {
        this.$store.commit('ordersheet/CHANGE_COUPONREQUEST')
        this.$store.commit('ordersheet/COPY_COUPONREQUEST')
        this.$store.commit('ordersheet/SET_USE_PAYCOCOUPON')
      })
    },
    changeAccumulationAmt (accumulationAmt) {
      this.$refs.orderCouponApplyNew.useAccumulationAmt = accumulationAmt
      this.$refs.orderPaymentConfirm.accumulationAmt = accumulationAmt
      this.orderData.subPayAmt = accumulationAmt
      const orderSheetNo = this.orderSheetNo
      this.$store.dispatch('ordersheet/calculateOrderAccumulation', { orderSheetNo, accumulationAmt })
    }
  },
  computed: {
    ...mapGetters('ordersheet', ['orderProductOptions']),
    ...mapState('ordersheet', ['ordersheet', 'couponRequest', 'deliveryMemo', 'payType', 'couponRequestCopy']),
    ...mapState('shippingaddresses', ['recentAddresses']),
    ...mapGetters('profile', ['isExec'])
  }
}
