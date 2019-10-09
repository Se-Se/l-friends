<template>
  <header class="goods-detail__header">
    <bread-crumbs :active="categoryLabel" />
    <div class="goods-detail__thumnail">
      <div class="goods-detail__thumnail__list">
        <div class="goods-detail__thumnail-chk">
          <a class="goods-detail__header-like" :class="{ active: product.liked }" @click.prevent="likeIt">
            {{ $t('goods.detail.header.like') }}
          </a>
        </div>
        <slick :options="SlickOptions">
          <div v-for="( img, key ) in product.baseInfo.imageUrls" :key="key" class="goods-detail__thumnail__img">
            <figure class="goods-detail__thumnail__fig">
              <img :src="img">
            </figure>
          </div>
        </slick>
      </div>
    </div>
    <div class="goods-detail__info">
      <div class="goods-detail__info-upper">
        <ul class="goods-detail__info__status">
          <li v-if="product.status.soldout" class="goods-detail__info__status-item">
            <p class="soldout">
              {{ $t('goods.tags.soldout') }}
            </p>
          </li>
          <li v-if="isNew()" class="goods-detail__info__status-item">
            <p class="new">
              NEW
            </p>
          </li>
          <li v-if="product.mainBestProductYn" class="goods-detail__info__status-item">
            <p class="best">
              BEST
            </p>
          </li>
          <li class="goods-detail__info__status-item">
            <p v-if="coupons.length > 0" class="coupon">
              {{ $t('goods.coupon') }}
            </p>
          </li>
          <li class="goods-detail__info__status-item">
            <p v-if="isPreOrderPeriod" class="reserve">
              {{ $t('goods.detail.header.reserve') }}
            </p>
          </li>
        </ul>
        <p v-if="product.baseInfo.promotionText" class="goods-detail__info-subtitle">
          {{ product.baseInfo.promotionText }}
        </p>
        <h2 class="goods-detail__info-title">
          {{ product.baseInfo.productName }}
        </h2>
        <div class="goods-detail__info-price">
          <p v-if="isSaleExec && price && price.additionDiscountAmt > 0" class="goods-detail__info-price__staff">
            {{ $t('goods.detail.header.executives') }}
          </p>
          <p v-if="discountRate" class="goods-detail__info-price__sale">
            {{ discountRate }}%
          </p>
          <p v-if="discountRate" class="goods-detail__info-price__coutprice">
            {{ salePrice }}<span>{{ $t('currency') }}</span>
          </p>
          <p v-else class="goods-detail__info-price__coutprice">
            {{ originalPrice }}<span>{{ $t('currency') }}</span>
          </p>
          <p v-if="discountRate" class="goods-detail__info-price__origin">
            {{ originalPrice }}
          </p>
        </div>
        <detail-coupon />
      </div>
      <div v-if="options" class="goods-detail__info-option">
        <div class="goods-detail__info-option__select">
          <ul class="select">
            <li v-if="!selectViewOption" class="goods-detail__selected-item">
              <div class="goods-detail__selected-result _cnt">
                <h2>{{ $t('goods.detail.header.cnt') }}</h2>
              </div>
              <div style="display:inline-block;">
                <template v-if="options.selectedOptions && options.selectedOptions[0].orderCnt !== undefined">
                  <spinner v-model="options.selectedOptions[0].orderCnt" :max="isPreOrderPeriod ? options.selectedOptions[0].reservationStockCnt - 1 : options.selectedOptions[0].stockCnt-1" :min="1" />
                </template>
              </div>
            </li>
            <template v-else>
              <span class="select-item__bar"></span>
              <li v-for="(option, key) in displayOptions" :key="key" :class="{
                  'select-item': true,
                  '__disable': !optionSelector[key-1] && key > 0
                }">
                <detail-select-item v-model="optionSelector[key]" :label="option.label + key" :value="option.value" :options="getOption(key)" :disabled="!optionSelector[key-1] && key > 0" @input="onChange(key)" />
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div v-if="options.selectedOptions && selectViewOption" class="goods-detail__selected">
        <ul class="goods-detail__selected-list">
          <li v-for="(item, key) in options.selectedOptions" :key="key" class="goods-detail__selected-item">
            <div class="goods-detail__selected-result">
              <h2>{{ item.viewValue.join(' / ') }}</h2>
              <p>{{ (item.buyPrice) * item.orderCnt | formatCurrency }} <span>{{ $t('currency') }}</span></p>
            </div>
            <div class="goods-detail__selected-spinner">
              <spinner v-model="item.orderCnt" :min="1" :max="isPreOrderPeriod ? item.reservationStockCnt - 1 : item.stockCnt-1" @input="REFRESH({ index: key, orderCnt: item.orderCnt })" />
              <div class="goods-detail__selected-close">
                <button type="button" class="goods-detail__selected-close__btn" @click.prevent="DELETEOPTION({ index: key })">
                  {{ $t('goods.detail.header.del') }}
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="goods-detail__info--footer">
        <div class="goods-detail__info--footer__total">
          <p class="goods-detail__info--footer__total-title">
            {{ $t('goods.detail.header.totalPrice') }}
          </p>
          <p class="goods-detail__info--footer__total-price">
            {{ totalPrice }}<span>{{ $t('currency') }}</span>
          </p>
        </div>
        <div class="goods-detail__info--footer__action">
          <template v-if="!isDisable">
            <template v-if="product.limitations.canAddToCart !== false">
              <default-button :data="form.cart" event="cart" @click="addToCart" />
              <default-button :data="form.buy" @click="buy" />
            </template>
            <default-button v-else :data="form.buySingle" @click="buy" />
          </template>
          <template v-else>
            <default-button :data="disableMessage" />
          </template>
        </div>
        <layer-popup v-if="layerPopupStatus" :visible="layerPopupStatus === 'cart'" :title="$t('goods.detail.header.cart')" :text="$t('goods.detail.header.text')" :info="$t('goods.detail.header.info')" button="double" :buttons="{cancel: '취소', confirm: '확인'}" type="confirm" path="/cart" @close="layerPopupStatus = null" />
        <div v-if="product.reservationData && (reservationLeftDate > 0 || isPreOrderPeriod)" class="goods-detail__info--footer__reserve">
          <detail-reserve :reserve="product" />
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import * as $ from 'jquery'
import Slick from 'vue-slick'
import DetailSelectItem from '../assets/DetailSelect'
import Spinner from '../assets/Spinner'
import DefaultButton from '../assets/buttons/DefaultButton'
import HeartCheckBox from '../assets/HeartCheckBox'
import DetailReserve from '../goods/DetailReserve'
import BreadCrumbs from '../layout/common/BreadCrumbs'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
import { setOrderInfoInStorage } from '@/utils/orderUtils'
import { Alert } from '@/utils/event-bus'
import DetailCoupon from '@/components/pc/goods/DetailCoupon'
import LayerPopup from '../layout/common/LayerPopup'
import cookies from 'js-cookie'
import { gaEventAddtoCart } from '@/utils/gaEventUtils'
export default {
  name: 'GoodsDetailHeader',
  components: {
    Slick,
    DetailSelectItem,
    Spinner,
    DefaultButton,
    HeartCheckBox,
    DetailReserve,
    BreadCrumbs,
    DetailCoupon,
    LayerPopup
  },
  props: {
    items: {
      required: true
    }
  },
  data () {
    return {
      activeCrumbs: this.BreadCrumbsTtitle,
      layerPopupStatus: null,
      count: 1,
      openOption: false,
      optionSelector: [],
      thumbnail: [],
      SlickOptions: {
        slidesToShow: 1,
        dots: true,
        arrows: false,
        infinite: false,
        slideToScroll: 1,
        fade: false,
        customPaging: (Slick, index) => {
          return '<button class="goods-detail__pagination">' + '<img src="' + this.product.baseInfo.imageUrls[index] + '">' + '</button>'
        }
      },
      form: {
        cart: {
          action: 'button',
          to: '',
          title: this.$t('goods.detail.header.cart'),
          type: 'half',
          active: false
        },
        buy: {
          action: 'button',
          to: '',
          title: this.$t('goods.detail.header.buy'),
          type: 'half',
          active: true
        },
        buySingle: {
          action: 'button',
          to: '',
          title: this.$t('goods.detail.header.buy'),
          type: '',
          active: true
        }
      },
      defaultType: ['DEFAULT', 'MAPPING'],
      selectViewOption: false
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    ...mapGetters('profile', ['isSaleExec']),
    ...mapGetters('product', ['displayOptions', 'optionInputsGetters', 'options', 'product']),
    ...mapGetters('coupon', ['getCoupons', ['compare']]),
    ...mapState('product', ['preview', 'showLikedLayer']),
    categoryLabel () {
      let category = []
      let query = this.$route.query
      if (query.depth1Path && query.depth1Desc) {
        category.push({
          'value': query.depth1Desc,
          'link': query.depth1Path
        })
      }
      if (query.depth2Path && query.depth2Desc) {
        category.push({
          'value': query.depth2Desc,
          'link': query.depth2Path
        })
      }
      category.push({
        'value': this.product.baseInfo.productName
      })
      return category
    },
    price () {
      return this.items.price
    },
    couponRate () {
      return Math.ceil(this.price.couponDiscountAmt / (this.price.salePrice - this.discountAmt) * 100)
    },
    coupons () {
      return this.getCoupons || []
    },
    isRateCoupon () {
      return this.coupons[0].discountInfo.discountAmt === null
    },
    downloadableCoupons () {
      return this.coupons.filter(item => item.downloadable)
    },
    discountRate () {
      return Math.ceil(this.discountAmt / this.price.salePrice * 100)
    },
    discountAmt () {
      return this.price.immediateDiscountAmt + this.price.additionDiscountAmt
    },
    salePrice () {
      return (this.price.salePrice - this.discountAmt).toLocaleString()
    },
    originalPrice () {
      return this.price.salePrice.toLocaleString()
    },
    totalPrice () {
      let salePrice = this.price.salePrice - this.discountAmt
      let price = 0
      if (this.options.flatOptions.length > 0 && this.options.selectedOptions) {
        for (let option of this.options.selectedOptions) {
          let calprice = 0
          if (this.options.type === 'MAPPING') {
            // let optionSalePrice = (option.buyPrice) - ((option.buyPrice * this.discountRate) / 100)
            let optionSalePrice = (option.buyPrice)
            calprice = optionSalePrice
          } else {
            // calprice = (salePrice >= option.buyPrice) ? option.buyPrice : salePrice
            calprice = option.buyPrice
          }
          price += calprice * (option.orderCnt || 0)
        }
      } else {
        price = 0
      }

      return price.toLocaleString()
    },
    BreadCrumbsTtitle () {
      return this.product.baseInfo.productName
    },
    isDefault () {
      return this.defaultType.indexOf(this.options.type) >= 0 || this.options.flatOptions.length === 1
    },
    reservationLeftDate () {
      return Math.ceil((new Date(this.product.reservationData.reservationEndYmdt.replace(' ', 'T')) - new Date()) / (1000 * 3600 * 24))
    },
    // 예약 주문 기간 여부
    isPreOrderPeriod () {
      if (this.product && this.product.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(this.product.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(this.product.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    },
    isDisable () {
      return this.disableMessage !== null
    },
    disableMessage () {
      let ret = null
      if (this.product.status.soldout) {
        ret = this.$t('goods.detail.header.soldOut')
      } else if (this.product.status.saleStatusType === 'READY' && !this.isPreOrderPeriod) {
        ret = this.$t('goods.detail.header.buyDisable')
      } else if (this.product.status.saleStatusType === 'STOP') {
        ret = this.$t('goods.detail.header.saleStop')
      } else if (this.product.status.saleStatusType === 'PROHIBITION') {
        ret = this.$t('goods.detail.header.saleProhibition')
      } else if (this.product.status.saleStatusType === 'FINISHED') {
        ret = this.$t('goods.detail.header.saleEnd')
      }

      if (ret === null) {
        return null
      } else {
        return {
          action: 'button',
          to: '',
          title: ret,
          type: 'long',
          color: 'gray',
          active: false
        }
      }
    }
  },
  methods: {
    ...mapMutations('product', ['SELECTOPTION', 'REFRESH', 'DELETEOPTION']),
    isNew () {
      if (this.isPreOrderPeriod) {
        return this.product.reservationData.reservationStartYmdt > this.fun_date(-7)
      } else {
        return this.product.baseInfo.saleStartYmdt > this.fun_date(-7)
      }
    },
    fun_date (aa) {
      var date1 = new Date()
      let time1 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()
      var date2 = new Date(date1)
      date2.setDate(date1.getDate() + aa)
      var time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()
    },
    getOptionLabel (key) {
      let option = this.displayOptions[key]
      return (this.options.type !== 'MAPPING' && option['label']) ? option['label'] : '옵션을 선택해주세요'
    },
    getOption (key) {
      let option = this.displayOptions[key]
      return [
        {
          label: this.getOptionLabel(key),
          value: undefined
        },
        ...option.value.map(item => ({
          label: item + this.optionAddPrice(key, item, option.label) + (this.isSoldOut(key, item, option.label) ? ' [품절]' : ''),
          value: item,
          disabled: this.isSoldOut(key, item, option)
        }))
      ]
    },
    isSoldOut (key, item, value) {
      if (key < this.displayOptions.length - 1) {
        return false
      }

      let selected = this.getSelectedOption(key, item, value)
      if (selected) {
        return this.isPreOrderPeriod ? selected.reservationStockCnt === 0 : selected.stockCnt === 0
      }
    },
    getSelectedOption (key, item, value) {
      let predictionOption = ''
      for (let i = 0; i < key; i++) {
        predictionOption += this.optionSelector[i]
      }

      const selected = this.options.flatOptions.filter(option => option.value === (predictionOption ? predictionOption + '|' : '') + item).pop()
      return selected
    },
    optionAddPrice (key, item, value) {
      if (key < this.displayOptions.length - 1) {
        return ''
      }

      let selected = this.getSelectedOption(key, item, value)
      let returnStr = ''
      if (selected) {
        if (selected.addPrice !== 0) {
          returnStr = ' (' + (selected.addPrice > 0 ? '+' : '') + selected.addPrice.toLocaleString() + '원)'
        }
      }
      return returnStr
    },
    onChange (key) {
      if (key === this.displayOptions.length - 1) {
        const selected = this.options.flatOptions.filter(option => option.value === this.optionSelector.join('|')).pop()
        if (selected) {
          let optionlabelCount = selected.label.split('|')
          selected.viewValue = []
          optionlabelCount.map((label, key) => {
            if (this.options.type === 'MAPPING') {
              selected.viewValue.push(selected.value.split('|')[key])
            } else {
              selected.viewValue.push(label + ' : ' + selected.value.split('|')[key])
            }
          })

          const beforeSelectedCount = this.options.selectedOptions ? this.options.selectedOptions.length : 0
          this.SELECTOPTION({
            ...selected,
            orderCnt: 1
          })
          const afterSelectedCount = this.options.selectedOptions.length

          if (beforeSelectedCount === afterSelectedCount) {
            Alert({
              message: this.$t('goods.detailBuy.alreadySelectedOption')
            })
          }
        }

        this.$nextTick(() => {
          this.optionSelector = []
        })
      } else {
        this.optionSelector[key + 1] = undefined
      }
    },
    ...mapActions('cart', { _addToCart: 'addToCart' }),
    async addToCart (event) {
      let ret = await this.beforValidate()

      if (ret) {
        let product = this.makeProductItems()
        await this._addToCart({
          carts: product
        })
        this.layerPopupStatus = event
        /** gtag.js */
        gaEventAddtoCart(this.product, product[0].orderCnt)
      }
    },
    likeIt () {
      if (!this.$store.getters.isLogined) {
        this.$store.state.route.query.redirect = `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
        this.$store.dispatch('login')
      }
      let _this = this
      this.$store.dispatch('likeProducts/postLikeProducts', [this.product.baseInfo.productNo]).then(() => {
        const productNo = this.product.baseInfo.productNo
        _this.$store.commit('product/CHANGELIKED', productNo)
        this.showLikedLayer.navLayer = true
        this.showLikedLayer.imgLayer = false
      })
    },
    buy () {
      this.beforValidate().then((ret) => {
        if (ret) {
          const products = this.makeProductItems()
          // click log
          const searchid = this.$store.state.route.query.searchProductID
          if (searchid) {
            const targetURL = `${location.protocol}//${location.host}/goods/detail/${products[0].productNo}`
            window.NCPSearch.sendClickLog(targetURL, searchid, 'buyclick', '')
          }

          setOrderInfoInStorage(products, this.$route.fullPath)
          $('html').css('overflow', 'scroll')
          this.$store.dispatch('ordersheet/getSheetNo', { searchProductID: searchid, productNo: products[0].productNo })
        }
      })
    },
    makeProductItems () {
      let products = []
      if (this.options.selectedOptions) {
        products = this.options.selectedOptions.map(item => {
          this.options.enteredProductInputs.forEach((input, index) => {
            item.optionInuts.push({ inputLabel: this.options.productInputs[index].inputLabel, inputValue: input.inputValue })
          })
          return {
            productNo: this.$store.state.route.params.goodsNo,
            optionNo: item.optionNo,
            orderCnt: item.orderCnt,
            additionalProductNo: 0,
            optionInputs: item.optionInuts
          }
        })
      }

      return products
    },

    async beforValidate () {
      if (this.options.selectedOptions === undefined || this.options.selectedOptions.length === 0) {
        Alert({
          // title: this.$t('goods.detail.header.product'),
          message: this.$t('goods.detail.header.productOptionSelector')
        })
        return false
      }
      // 상품 구매자 작성형 미 입력 시
      if (this.options.enteredProductInputs.filter(i => i.inputValue !== '').length !== this.options.productInputs.length) {
        Alert({
          // title: this.$t('goods.detail.header.product'),
          message: this.$t('goods.detail.header.optionSelector')
        })
        return false
      }
      await this.$store.dispatch('product/asyncProduct', this.product.baseInfo.productNo)
      await this.$store.dispatch('product/asyncProductOptions', this.product.baseInfo.productNo)
      if (!this.product.status.display) {
        Alert({
          // title: this.$t('goods.detail.header.product'),
          message: this.$t('goods.detail.header.canNotBuy')
        })
        return false
      }
      if (this.product.status.saleStatusType === 'READY') {
        if (!this.isPreOrderPeriod) {
          Alert({
            title: this.$t('goods.detail.header.product'),
            message: this.$t('goods.detail.header.canNotBuy')
          })
          return false
        }
      } else if (this.product.status.saleStatusType !== 'ONSALE') {
        Alert({
          // title: this.$t('goods.detail.header.product'),
          message: this.$t('goods.detail.header.canNotBuy')
        })
        return false
      }

      let buyCnt = 0
      let checkflg = true
      let hasCntZero = false
      /** stock check */
      this.options.selectedOptions.forEach((item) => {
        buyCnt += parseInt(item.orderCnt)
        if (item.orderCnt <= 0) {
          hasCntZero = true
        }
        this.options.flatOptions.forEach((subitem) => {
          if (checkflg) {
            if (subitem.optionNo === item.optionNo) {
              if (subitem.addPrice !== item.addPrice) {
                checkflg = false
                Alert({
                  // title: this.$t('goods.detail.header.product'),
                  message: this.$t('goods.detail.header.priceChange')
                })
                return false
              }
              if (this.isPreOrderPeriod) {
                if (subitem.reservationStockCnt === 0) {
                  checkflg = false
                  Alert({
                    // title: '상품',
                    message: '선택한 옵션은 현재 재고가 없습니다.'
                  })
                  return false
                }
              } else if (subitem.stockCnt === 0) {
                checkflg = false
                Alert({
                  // title: this.$t('goods.detail.header.product'),
                  message: this.$t('goods.detail.header.noStock')
                })
                return false
              }
              if (Number(item.orderCnt) > (this.isPreOrderPeriod ? subitem.reservationStockCnt : subitem.stockCnt)) {
                checkflg = false

                if (this.options.type === 'COMBINATION') {
                  Alert({
                    // title: this.$t('goods.detail.header.product'),
                    message: this.$t('goods.detail.header.noStockRechkCnt')
                  })
                } else if (this.options.type !== 'COMBINATION') { // DEFAULT, STANDARD
                  Alert({
                    // title: this.$t('goods.detail.header.product'),
                    message: this.$t('goods.detail.header.procutNoStock')
                  })
                }

                return false
              }
            }
          }
        })
      })
      if (!checkflg) {
        return checkflg
      }
      if (hasCntZero) {
        Alert({
          // title: this.$t('goods.detail.header.product'),
          message: this.$t('goods.detail.header.minStock')
        })
        return false
      }

      /** min buy check */
      if (this.product.limitations.minBuyCnt !== 0 && buyCnt < this.product.limitations.minBuyCnt) {
        Alert({
          // title: this.$t('goods.detail.header.product'),
          message: this.$t('goods.detail.header.thisProductMin') + this.product.limitations.minBuyCnt + this.$t('goods.detail.header.moreProcutStock')
        })
        return false
      }

      /** Time max Buy Cnt check */
      if ((this.product.limitations.maxBuyTimeCnt !== 0 && buyCnt > this.product.limitations.maxBuyTimeCnt) ||
        (this.product.limitations.maxBuyPeriodCnt !== 0 && buyCnt > this.product.limitations.maxBuyPeriodCnt) ||
        (this.product.limitations.maxBuyPersonCnt !== 0 && buyCnt > this.product.limitations.maxBuyPersonCnt)) {
        if (this.product.limitations.maxBuyPersonCnt) {
          Alert({
            // title: this.$t('goods.detail.header.product'),
            message: this.$t('goods.detail.header.thisProductOneStock') + this.product.limitations.maxBuyPersonCnt + this.$t('goods.detail.header.moreProductOneStock')
          })
        } else {
          let maxCnt = this.product.limitations.maxBuyTimeCnt | this.product.limitations.maxBuyPeriodCnt
          Alert({
            // title: this.$t('goods.detail.header.product'),
            message: this.$t('goods.detail.header.thisProductMax') + maxCnt + this.$t('goods.detail.header.moreProductOneStock')
          })
        }
        return false
      }

      // const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
      // let memberOnly = false
      // if (this.product.limitations.memberOnly ||
      //   this.product.limitations.maxBuyPersonCnt !== 0 ||
      //   this.product.limitations.maxBuyDays !== 0 ||
      //   this.product.limitations.maxBuyPeriodCnt !== 0) {
      //   memberOnly = true
      // }

      /** TODO */
      /** author */
      // if (this.isLogined && memberOnly) {
      //   if (!this.$store.getters.ncpCertificated) {
      //     alert('본인인증을 한 PAYCO ID를 통해서만 구매가 가능합니다. 본인인증을 진행해주세요.')
      //     window.location.href = config.paycoCertifyUrl(thisUrl)
      //     return false
      //   }
      //   if (!this.profile.adultCertificated) {
      //     alert('이 상품은 성인만 구매 가능합니다.')
      //     return false
      //   }
      // }

      return true
    },
    defaultOptionCheck () {
      let multiLengths = this.options.multiLevelOptions.length
      this.selectViewOption = multiLengths !== 1

      if (this.isDefault && !this.options.selectedOptions && !this.selectViewOption) {
        this.SELECTOPTION({
          ...this.options.flatOptions[0],
          orderCnt: 1
        })
      }
    }
  },
  beforeUpdate () {
    this.defaultOptionCheck()
  },
  created () {
    this.defaultOptionCheck()
  },
  mounted () {
    this.$header = $('.header')
    this.$header.css('position', 'absolute')
  }
}
</script>
