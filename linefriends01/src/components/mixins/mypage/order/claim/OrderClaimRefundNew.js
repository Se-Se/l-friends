import ClickOutside from 'vue-click-outside'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Alert } from '@/utils/event-bus'

export default {
  directives: {
    ClickOutside
  },
  data () {
    return {
      claimReasonType: '',
      claimReasonDetail: '',
      active: false,
      txt: {
        claimReasonType: this.$t('mypage.orderClaim.reasonSelectDefault'),
        responsibleObjectType: ''
      },
      estimateFlg: false,
      running: false
    }
  },
  computed: {
    ...mapState('myorder', ['claimOrderOption', 'multiClaimEstimate', 'returnInfo']),
    ...mapGetters('myorder', ['viewableClaimOptions']),
    refundInfos () {
      const infos = []
      if (this.multiClaimEstimate && this.estimateFlg) {
        infos.push(this.multiClaimEstimate)
      }
      return infos
    },
    claimTypeReturn () {
      return this.$route.name === 'OrderClaimReturn'
    }
  },
  methods: {
    returnEstimate () {
      const claimedProductOptions = this.returnInfo.filter(info => Number(info.productCnt) > 0 && info.checkYn)
      this.estimateFlg = claimedProductOptions.length > 0
      if (this.claimReasonType && this.estimateFlg) {
        const cliamRequest = {
          claimType: this.claimTypeReturn ? 'RETURN' : 'CANCEL',
          claimReasonType: this.claimReasonType,
          claimedProductOptions,
          returnWayType: 'SELLER_COLLECT'
        }
        this.$store.dispatch('myorder/getReturnEstimate', cliamRequest)
      }
    },
    hideReason () {
      this.active = false
    },
    updateClaimType (selectType) {
      if (this.claimTypeReturn) {
        if (selectType.responsibleObjectType === 'SELLER') {
          this.txt.responsibleObjectType = this.$t('mypage.orderClaim.responsibleObjectType.SELLER')
        } else if (selectType.responsibleObjectType === 'BUYER') {
          this.txt.responsibleObjectType = this.$t('mypage.orderClaim.responsibleObjectType.BUYER')
        }
      }
      this.claimReasonType = selectType.claimReasonType
      this.txt.claimReasonType = selectType.label
      this.active = !this.active
      this.returnEstimate()
    },
    enterBeforePage () {
      this.$router.back()
    },
    returnOrderOption () {
      const checkList = this.returnInfo.filter(info => info.checkYn)
      if (checkList.length === 0) {
        if (this.claimTypeReturn) {
          return Alert({
            message: this.$t('mypage.orderClaim.return.validateProduct')
          })
        } else {
          return Alert({
            message: this.$t('mypage.orderClaim.cancel.validateProduct')
          })
        }
      }

      const isEmptyCnt = this.returnInfo.filter(info => Number(info.productCnt) === 0 && info.checkYn)
      if (isEmptyCnt.length > 0) {
        if (this.claimTypeReturn) {
          return Alert({
            message: this.$t('mypage.orderClaim.return.validateCount')
          })
        } else {
          return Alert({
            message: this.$t('mypage.orderClaim.cancel.validateCount')
          })
        }
      }
      if (this.claimReasonType === '') {
        if (this.claimTypeReturn) {
          Alert({
            message: this.$t('mypage.orderClaim.return.validateReason')
          })
        } else {
          Alert({
            message: this.$t('mypage.orderClaim.cancel.validateReason')
          })
        }
        this.$refs.claimType.focus()
        return
      }

      if (!this.claimTypeReturn) {
        const isDelivery = this.returnInfo.filter(info => {
          return info.orderStatusType === 'PRODUCT_PREPARE' || info.orderStatusType === 'DELIVERY_PREPARE'
        })
        if (isDelivery.length > 0) {
          return Alert({
            message: this.$t('mypage.orderClaim.cancel.alreadyDelivering')
          })
        }
      }

      const claimedProductOptions = this.returnInfo.filter(info => Number(info.productCnt) > 0 && info.checkYn)
      const claimRequest = {
        claimType: this.claimTypeReturn ? 'RETURN' : 'CANCEL',
        claimReasonType: this.claimReasonType,
        claimReasonDetail: this.claimReasonDetail,
        saveBankAccountInfo: 'false',
        claimedProductOptions,
        returnWayType: 'SELLER_COLLECT'
      }
      if (this.running) {
        return
      } else {
        this.running = true
      }
      if (this.claimTypeReturn) {
        claimRequest.returnAddress = this.$refs.addInfo.showReturnAddress
        this.$store.dispatch('myorder/postOrderOptionClaimReturn', claimRequest).then(() => {
          // 922 issue
          Alert({
            message: this.$t('mypage.orderClaim.return.complete'),
            callback: () => {
              // const fromUrl = this.$store.state.route.query.fromUrl
              // const fromUrl = window.location.href.split(window.location.host)[0] + window.location.host + '/mypage/cancellist'
              this.$router.replace('/mypage/cancellist')
            }
          })

          this.running = false
        }).catch((e) => {
          this.running = false
        })
      } else {
        this.$store.dispatch('myorder/postOrderOptionClaimCancel', claimRequest).then(() => {
          // 922 issue
          Alert({
            message: this.$t('mypage.orderClaim.cancel.complete'),
            callback: () => {
              // const fromUrl = this.$store.state.route.query.fromUrl
              // const fromUrl = window.location.href.split(window.location.host)[0] + window.location.host + '/mypage/orderlist'
              this.$router.go(-1)
            }
          })
          this.running = false
        }).catch((e) => {
          this.running = false
        })
      }
    },
    ...mapMutations('myorder', ['CLEAR_RETURN_INFO'])
  },
  destroyed () {
    this.CLEAR_RETURN_INFO()
  }
}
