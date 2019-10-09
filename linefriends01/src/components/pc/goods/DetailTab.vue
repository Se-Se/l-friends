<template>
  <div
    :class="{
      'detail-tab': true,
      '__active': scrolled
    }"
    @scroll="handleScroll"
  >
    <div
      v-if="scrolled"
      class="detail-tab__buy"
    >
      <div class="detail-tab__buy-content">
        <div class="detail-tab__layout _detail">
          <figure
            class="detail-tab__buy-content__fig"
          >
            <img class="detail-tab__buy-content__img" :src="product.baseInfo.imageUrls[0]">
          </figure>
          <div class="detail-tab__buy-content__info">
            <p class="detail-tab__buy-content__info-tags">
              <span
                v-if="product.reserve"
                class="reserve"
              >{{ $t('goods.detail.header.reserve') }}</span>
            </p>
            <p class="detail-tab__buy-content__info-subtitle">
              {{ product.baseInfo.promotionText }}
            </p>
            <div>
              <h2 class="detail-tab__buy-content__info-title">
                {{ product.baseInfo.productName }}
              </h2>
              <div class="goods-detail__thumnail-chk tab-chk">
                <a
                  class="goods-detail__header-like tab-chk__like"
                  :class="{ active: product.liked }"
                  @click.prevent="$emit('likeIt')"
                >
                  {{ $t('goods.detail.header.like') }}
                </a>
              </div>
            </div>
            <div class="detail-tab__buy-content__info-price">
              <p
                v-if="isSaleExec && price && price.additionDiscountAmt > 0"
                class="executives"
              >
                {{ $t('goods.detail.header.exSale') }}
              </p>
              <p
                v-if="discountRate"
                class="sale"
              >
                {{ discountRate }}%
              </p>
              <p
                v-if="discountRate"
                class="price"
              >
                {{ salePrice }}<span>{{ $t('currency') }}</span>
              </p>
              <p
                v-else
                class="price"
              >
                {{ originalPrice }}<span>{{ $t('currency') }}</span>
              </p>
              <p
                v-if="discountRate"
                class="origin"
              >
                {{ originalPrice }}
              </p>
            </div>
          </div>
          <div class="detail-tab__buy-content__action">
            <template v-if="!isDisable">
              <button
                v-if="!buyOptionStatus"
                type="button"
                class="_action"
                @click="buyOption()"
              >
                {{ $t('goods.detail.tab.buy') }}
              </button>
              <button
                v-if="buyOptionStatus"
                type="button"
                class="_close"
                @click="buyOptionClose()"
              >
                {{ $t('goods.detail.tab.cancel') }}
              </button>
            </template>
            <template v-else>
              <button
                type="button"
                class="_soldout"
              >
                {{ disableMessage }}
              </button>
            </template>
          </div>
        </div>
      </div>
      <div
        v-if="buyOptionStatus"
        class="detail-tab__buy-option _option"
      >
        <div class="detail-tab__layout">
          <div class="detail-tab__buy-option__left">
            <div class="detail-tab__buy-option__select">
              <ul class="select">
                <template v-if="selectViewOption">
                  <li
                    v-for="(option, key) in displayOptions"
                    :key="key"
                    :class="{
                      'select-item': true,
                      '__disable': !optionSelector[key-1] && key > 0
                    }"
                  >
                    <detail-select-item
                      v-model="optionSelector[key]"
                      :label="option.label"
                      :value="option.value"
                      :options="getOption(key)"
                      :disabled="!optionSelector[key-1] && key > 0"
                      @input="onChange(key)"
                    />
                  </li>
                </template>
              </ul>
            </div>
            <div
              v-if="reserve"
              class="detail-tab__buy-option__reserve"
            >
              <detail-reserve mode="fixed" />
            </div>
          </div>
          <div class="detail-tab__buy-option__right">
            <div
              :class="{
                'goods-detail__selected': true,
                'detail-tab__buy-option__scroll': displayOptions.length > 1}
              ">
              <ul
                v-if="options.type === 'DEFAULT'"
                class="goods-detail__selected-list"
              >
                <li
                  class="goods-detail__selected-item"
                >
                  <div class="goods-detail__selected-result _tab-cnt">
                    <h2>{{ $t('goods.detail.tab.cnt') }}</h2>
                  </div>
                  <div style="display:inline-block;">
                    <spinner
                      v-model="options.selectedOptions[0].orderCnt"
                      :min="1"
                    />
                  </div>
                </li>
              </ul>
              <ul
                v-else
                class="goods-detail__selected-list"
              >
                <li
                  v-for="(item, key) in options.selectedOptions"
                  :key="key"
                  class="goods-detail__selected-item"
                >
                  <div class="goods-detail__selected-result detail-tab__buy-option__right-overflow">
                    <h2>{{ (item.viewValue || []).join(' / ') }}</h2>
                    <p>{{ (item.buyPrice) * item.orderCnt | formatCurrency }} <span>{{ $t('currency') }}</span></p>
                  </div>
                  <div class="goods-detail__selected-spinner">
                    <spinner
                      v-model="item.orderCnt"
                      :min="1"
                      :max="item.stockCnt"
                      @input="REFRESH({ index: key, orderCnt: item.orderCnt })"
                    />
                    <div class="goods-detail__selected-close" v-if="selectViewOption">
                      <button
                        type="button"
                        class="goods-detail__selected-close__btn"
                        @click.prevent="DELETEOPTION({ index: key })"
                      >
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
                <default-button
                  :data="form.cart"
                  @click="$emit('addToCart')"
                />
                <default-button
                  :data="form.order"
                  @click="$emit('buy')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <layout-width>
      <ul class="detail-tab__list">
        <li
          :class="{
            'detail-tab__item': true,
            '_active': active === 'info'
          }"
        >
          <button
            type="button"
            class="detail-tab__item-btn"
            @click="tabMove('info')"
          >
            {{ $t('goods.detail.tab.goodsInfo') }}
          </button>
        </li>
        <li
          :class="{
            'detail-tab__item': true,
            '_active': active === 'review'
          }"
        >
          <button
            type="button"
            class="detail-tab__item-btn"
            @click="tabMove('review')"
          >
            <template v-if="productReviews">
            {{ $t('goods.detail.tab.goodsReview') }} <span>{{ productReviews.totalCount }}</span>
            </template>
          </button>
        </li>
        <li
          v-if="inquiryList"
          :class="{
            'detail-tab__item': true,
            '_active': active === 'contact'
          }"
        >
          <button
            type="button"
            class="detail-tab__item-btn"
            @click="tabMove('contact')"
          >
            <template v-if="inquiryList">
            {{ $t('goods.detail.tab.goodsContact') }} <span>{{ inquiryList.totalCount }}</span>
            </template>
          </button>
        </li>
        <li
          :class="{
            'detail-tab__item': true,
            '_active': active === 'buyinfo'
          }"
        >
          <button
            type="button"
            class="detail-tab__item-btn"
            @click="tabMove('buyinfo')"
          >
            {{ $t('goods.detail.tab.buyInfo') }}
          </button>
        </li>
      </ul>
    </layout-width>
  </div>
</template>
<script>
import * as $ from 'jquery'

import HeartCheckBox from '../assets/HeartCheckBox'
import LayoutWidth from '../layout/common/LayoutWidth'
import DetailSelectItem from '../assets/DetailSelect'
import DefaultButton from '../assets/buttons/DefaultButton'
import Spinner from '../assets/Spinner'
import DetailReserve from '../goods/DetailReserve'
import { Alert } from '@/utils/event-bus'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { setOrderInfoInStorage } from '@/utils/orderUtils'

export default {
  name: 'DetailTab',
  components: {
    LayoutWidth,
    HeartCheckBox,
    DetailSelectItem,
    DefaultButton,
    Spinner,
    DetailReserve
  },
  props: {
    soldout: {
      type: Boolean,
      required: false
    },
    reserve: {
      type: Boolean,
      required: false
    },
    ordCnt: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      active: 'info',
      scrolled: false,
      lastPosition: 0,
      buyOptionStatus: false,
      optionSelector: [],
      limitPosition: $('.header__wrapper').outerHeight() + $('.bread-crumbs').outerHeight() + $('.goods-detail__header').outerHeight() + $('.goods-detail__tab').outerHeight(),
      count: 1,
      scrollLock: false,
      selectViewOption: false,
      form: {
        cart: {
          action: 'button',
          to: '',
          title: '장바구니',
          type: 'half',
          active: false,
          size: 220,
          height: 52
        },
        order: {
          action: 'button',
          to: '',
          title: '바로구매',
          type: 'half',
          active: true,
          size: 220,
          height: 52
        }
      }
    }
  },
  computed: {
    ...mapGetters('profile', ['isSaleExec']),
    ...mapState('productreview', ['totalCount']),
    ...mapState('productinquiry', ['inquiryList']),
    ...mapState('product', ['showLikedLayer']),
    ...mapGetters('product', ['displayOptions', 'optionInputsGetters', 'options', 'product']),
    ...mapGetters(['isLogined']),
    ...mapState('review', ['productReviews']),
    baseInfo () {
      const baseInfoJSON = this.product.baseInfo.baseInfoByJSON
      const contents = (baseInfoJSON && baseInfoJSON.contents) || {}
      return this.product ? contents : {}
    },
    price () {
      return this.product.price
    },
    couponRate () {
      return Math.ceil(this.price.couponDiscountAmt / (this.price.salePrice - this.discountAmt) * 100)
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
      let price = 0
      if (this.displayOptions.length > 0 && this.options.selectedOptions) {
        for (let option of this.options.selectedOptions) {
          price += (this.price.salePrice - this.discountAmt) * (option.orderCnt || 0)
        }
      } else {
        price = 0
      }

      return price.toLocaleString()
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
      if (this.product.status.soldout) {
        return this.$t('goods.detail.header.soldOut')
      } else if (this.product.status.saleStatusType === 'READY' && !this.isPreOrderPeriod) {
        return this.$t('goods.detail.header.buyDisable')
      } else if (this.product.status.saleStatusType === 'STOP') {
        return this.$t('goods.detail.header.saleStop')
      } else if (this.product.status.saleStatusType === 'PROHIBITION') {
        return this.$t('goods.detail.header.saleProhibition')
      } else if (this.product.status.saleStatusType === 'FINISHED') {
        return this.$t('goods.detail.header.saleEnd')
      }
      return null
    }
  },
  mounted () {
    let multiLengths = this.options && this.options.multiLevelOptions ? this.options.multiLevelOptions.length : 0
    this.selectViewOption = (multiLengths > 1)
    setTimeout(() => {
      this.limitPosition = $('.header__wrapper').outerHeight() + $('.bread-crumbs').outerHeight() + $('.goods-detail__header').outerHeight() + $('.goods-detail__tab').outerHeight() - 220
    }, 500)
  },
  methods: {
    ...mapMutations('product', ['SELECTOPTION', 'REFRESH', 'DELETEOPTION']),
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

      let predictionOption = ''
      for (let i = 0; i < key; i++) {
        predictionOption += this.optionSelector[i]
      }

      const selected = this.options.flatOptions.filter(option => option.value === (predictionOption ? predictionOption + '|' : '') + item).pop()
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
    likeIt () {
      if (!this.$store.getters.isLogined) {
        // this.$store.state.route.query.redirect = `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
        // this.$store.dispatch('login')
        this.$router.push('/member/login')
        return
      }
      let _this = this
      this.$store.dispatch('likeProducts/postLikeProducts', [this.product.baseInfo.productNo]).then(() => {
        const productNo = this.product.baseInfo.productNo
        _this.$store.commit('product/CHANGELIKED', productNo)
        this.showLikedLayer.navLayer = true
        this.showLikedLayer.imgLayer = false
      })
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
          this.SELECTOPTION({
            ...selected,
            orderCnt: 1
          })
        }

        this.$nextTick(() => {
          this.optionSelector = []
        })
      } else {
        this.optionSelector[key + 1] = undefined
      }
    },
    tabMove (event) {
      $('html, body').scrollTop(this.limitPosition)

      this.$emit('childs-event', event)
      if (event === 'info') {
        this.scrolled = true
        this.active = 'info'
      } else if (event === 'review') {
        this.scrolled = true
        this.active = 'review'
      } else if (event === 'contact') {
        this.scrolled = true
        this.active = 'contact'
      } else if (event === 'buyinfo') {
        this.scrolled = true
        this.active = 'buyinfo'
      }
    },
    handleScroll () {
      if (this.lastPosition < $(window).scrollTop() && this.limitPosition < $(window).scrollTop()) {
        this.scrolled = true
      }

      if (this.limitPosition > $(window).scrollTop()) {
        this.scrolled = false
        this.buyOptionStatus = false
      }

      this.lastPosition = $(window).scrollTop()
    },
    buyOption () {
      this.buyOptionStatus = true
    },
    buyOptionClose () {
      this.buyOptionStatus = false
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
    this.limitPosition = $('.header__wrapper').outerHeight() + $('.bread-crumbs').outerHeight() + $('.goods-detail__header').outerHeight() + $('.goods-detail__tab').outerHeight()
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
