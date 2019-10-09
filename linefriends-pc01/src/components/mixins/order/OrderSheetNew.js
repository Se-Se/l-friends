/* eslint-disable */
import { mapState, mapGetters } from 'vuex'
import cookies from 'js-cookie'
import Validator from '@/utils/validateUtils'
import {
  getPrevOrderInfoInStoreage,
  deletePrevOrderInfoInStoreage,
  deleteOrderInfoInStorage
} from '@/utils/orderUtils'
import { Alert, Confirm } from '@/components/common/modal'
import { removeCookie, setCookie } from '@/utils/utils'
import { isLogin } from '../../../utils/utils'

export default {
  data () {
    return {
      orderSheetNo: this.$store.state.route.params.orderSheetNo,
      logined: isLogin(),
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
        pgType: 'INICIS',
        deliveryConditionNo: 0,
        deliveryWishYmd: ''
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
      },
      popup: null
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
    payments: function (pgType, payType) {
      /* eslint-disable */
      let confirmUrl
      // let deliveryAddressValidateRule = this.$refs.orderDeliveryAddressInfo
      //   .validateRule
      // let validateRule = [...deliveryAddressValidateRule]
      // const validator = new Validator(validateRule)
      // if (validator.validate()) {
      //   return false
      // }
      let agreeCheckAll = this.$refs.orderPaymentConfirm.agreeCheckAll
      if (!agreeCheckAll) {
        Alert({
          message: '同意項目にチェックして、決済へ進んでください。'
        })
        // alert('동의 항목에 체크하여야 결제를 진행할 수 있습니다.')
        return
      }

      // if (
      //   !this.$refs.orderDeliveryAddressInfo.shippingAddressInput
      //     .receiverDetailAddress &&
      //   this.$refs.orderDeliveryAddressInfo.isNewAddress
      // ) {
      //   if (!confirm('상세주소를 입력하지 않고 주문하시겠습니까?')) {
      //     if (!isLogin()) {
      //       this.$refs.orderDeliveryAddressInfo.$refs.nonMember.$refs.receiverDetailAddress.focus()
      //     } else {
      //       this.$refs.orderDeliveryAddressInfo.$refs.member.$refs.receiverDetailAddress.focus()
      //     }
      //     return false
      //   }
      // }

      let shippingAddressInput = this.$refs.orderDeliveryAddressInfo
        .shippingAddressInput
      let deliveryMemoInput = this.$refs.orderDeliveryAddressInfo
        .deliveryMemoInput
      let deliveryWishYmdInput = this.$refs.orderDeliveryAddressInfo
        .deliveryWishYmdInput
      let deliveryTimeTypeInput = this.$refs.orderDeliveryAddressInfo
        .deliveryTimeTypeInput
      if (shippingAddressInput.receiverName === '') {
        Alert({
          message: '受取人を入力してください。'
        })
        return
      }
      if (shippingAddressInput.receiverZipCd === '') {
        Alert({
          message: '郵便番号を入力してください。'
        })
        return
      }
      if (shippingAddressInput.receiverAddress === '') {
        Alert({
          message: 'ご住所１を入力してください。'
        })
        return
      }
      if (shippingAddressInput.receiverDetailAddress === '') {
        Alert({
          message: 'ご住所２を入力してください。'
        })
        return
      }
      let Contacts = shippingAddressInput.receiverContact1.split('-')
      let lengthCheckd = Contacts[0] + Contacts[1] + Contacts[2]
      if (Contacts[0] === '' || Contacts[1] === '' || Contacts[2] === '' || Contacts[0].substring(0, 1) !== '0') {
        Alert({
          message: '正しい電話番号を入力してください。'
        })
        return
      }
      this.orderData.orderer = {
        ordererName: this.profile.nickname,
        ordererEmail: this.ordersheet.ordererContact.ordererEmail
      }
      if (this.ordersheet.ordererContact.ordererContact1 && this.ordersheet.ordererContact.ordererContact1.length < 11) {
        this.orderData.orderer.ordererContact2 = this.ordersheet.ordererContact.ordererContact1
      } else {
        this.orderData.orderer.ordererContact1 = this.ordersheet.ordererContact.ordererContact1
      }
      this.orderData.orderTitle =
        this.orderProductOptions[0].showProductName +
        (this.orderProductOptions.length > 1
          ? ' 外 ' + (this.orderProductOptions.length - 1) + '件'
          : '')
      this.orderData.shippingAddress = { ...shippingAddressInput }
      this.orderData.deliveryMemo = deliveryMemoInput
      this.orderData.pgType = pgType
      this.orderData.payType = payType

      confirmUrl = `${location.protocol}//${location.host}/order/paymentconfirm`
      this.orderData.clientReturnUrl = confirmUrl
      this.orderData.confirmUrl = confirmUrl
      if (this.$store.state.ordersheet.ordersheet.deliveryGroups) {
        this.orderData.deliveryConditionNo = this.$store.state.ordersheet.ordersheet.deliveryGroups[0].deliveryCondition.deliveryConditionNo
      } else {
        this.orderData.deliveryConditionNo = ''
      }

      this.orderData.shippingAddress.addressName = shippingAddressInput.receiverName
      this.orderData.deliveryWishYmd = deliveryWishYmdInput

      if (deliveryTimeTypeInput !== '') {
        this.orderData.deliveryTimeType = deliveryTimeTypeInput
      }

      if (this.orderData.deliveryWishYmd === `指定なし`) {
        this.orderData.deliveryWishYmd = ``
      }
      if (this.orderData.deliveryMemo === 'なし') {
        this.orderData.deliveryMemo = ``
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
      confirmUrl += params.length > 0 ? '?' + params.join('&') : ''

      // 쿠폰 setting
      const coupons = JSON.parse(JSON.stringify(this.couponRequest))
      if (coupons.productCoupons && coupons.productCoupons.length > 0) {
        coupons.productCoupons = coupons.productCoupons.filter(
          item => item.couponIssueNo !== 0 || item.plusCouponIssueNo !== 0
        )
      }
      setCookie('orderSheetNo', this.$store.state.route.params.orderSheetNo)
      if (this.ordersheet.paymentInfo.paymentAmt === 0) {
        this.orderData.pgType = 'NONE'
        this.orderData.payType = 'ZERO_PAY'
      }
      this.orderData.coupons = coupons
      this.orderData.paymentAmtForVerification = this.ordersheet.paymentInfo.paymentAmt
      this.$store
        .dispatch('payments/postPaymentsReserve', this.orderData)
        .then(res => {
          delete window.localStorage.orderInfo
          if (this.popup !== null) {
            this.popup.close()
          }
          if (res.data.returnContents) {

            // var OpenWindow = window.open(
            //   '',
            //   '_parent',
            //   'height=500,width=800,toolbar=no,scrollbars=yes,menubar=no',
            //   true
            // )
            // OpenWindow.document.write(res.data.forwardContents)
            this.popup = window.open('', "GMO", 'height=900,width=850')
            this.popup.document.write(res.data.returnContents)

          } else if (res.data.clientReturnUrl) {
            setTimeout(function () {
              location.href = res.data.clientReturnUrl
            }, 1000)
          } else {
            // this.popup = window.open('',"GMO",'height=900,width=850')
            // this.popup.location.href = res.data.returnUrl

            // location.href = res.data.returnUrl
            setTimeout(function () {
              // this.popup = window.open('',"GMO",'height=900,width=850')
              // this.popup.location.href = res.data.returnUrl
              location.href = res.data.returnUrl
            }, 1000)
          }
        })
    },
    resetCoupon (coupon) {
      const productNo = this.$store.state.route.query.productNo
      const couponIssueNo = coupon ? coupon.couponIssueNo : 0
      const couponReq = JSON.parse(JSON.stringify(this.couponRequestCopy))
      let coupoType = ''
      if (couponReq.productCoupons) {
        coupoType = 'PRODUCT'
      }
      if (couponReq.productPlusCoupons) {
        coupoType = 'PRODUCT_PLUS'
      }
      switch (coupoType) {
        case 'PRODUCT':
          this.$store.commit('ordersheet/SET_COUPONREQUEST_COUPONISS', {
            productNo: productNo,
            couponIssueNo: couponIssueNo,
            isCopy: true
          })
          break
        case 'PRODUCT_PLUS':
          this.$store.commit('ordersheet/SET_COUPONREQUEST_PLUSCOUPONISS', {
            productNo: productNo,
            plusCouponIssueNo: couponIssueNo,
            isCopy: true
          })
          break
        case 'CART':
          let otherCouponUsable = coupon ? coupon.otherCouponUsable : true
          couponReq.cartCouponIssueNo = couponIssueNo
          this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
          this.$store.commit(
            'ordersheet/CHANGE_OTHER_COUPON_USABLE',
            otherCouponUsable
          )
          break
        case 'CART_DELIVERY':
          couponReq.deliveryCouponIssueNo = couponIssueNo
          this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
          break
      }
      this.$store.dispatch('ordersheet/calculateConpons', {
        orderSheetNo: this.orderSheetNo,
        couponRequest: this.couponRequestCopy
      })
      this.$store
        .dispatch('ordersheet/applyCouponOrderReset', {
          orderSheetNo: this.orderSheetNo
        })
        .then(() => {
          this.$store.commit('ordersheet/CHANGE_COUPONREQUEST')
          this.$store.commit('ordersheet/COPY_COUPONREQUEST')
          this.$store.commit('ordersheet/SET_USE_PAYCOCOUPON')
        })
    },
    changeAccumulationAmt (accumulationAmt) {
      // this.$refs.orderCouponApplyNew.useAccumulationAmt = accumulationAmt
      this.$refs.orderPaymentConfirm.accumulationAmt = accumulationAmt
      this.orderData.subPayAmt = accumulationAmt
      const orderSheetNo = this.orderSheetNo
      this.$store.dispatch('ordersheet/calculateOrderAccumulation', {
        orderSheetNo,
        accumulationAmt
      })
    }
  },
  computed: {
    ...mapGetters('ordersheet', ['orderProductOptions']),
    ...mapState('ordersheet', [
      'ordersheet',
      'couponRequest',
      'deliveryMemo',
      'payType',
      'couponRequestCopy'
    ]),
    ...mapState('shippingaddresses', ['recentAddresses']),
    ...mapGetters('profile', ['isExec'])
  }
}
