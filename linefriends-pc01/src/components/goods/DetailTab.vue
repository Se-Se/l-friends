<template>
  <div :class="{'itemivew_buy_wrapper':true,'show':scrolled}" @scroll="handleScroll">
    <template v-if="scrolled">
      <div class="itemivew_buy_box">
        <div class="item_buy_ss">
          <template v-if="product && product.baseInfo.imageUrls">
            <img :src="product.baseInfo.imageUrls[0]" class="">
          </template>
        </div>
        <div class="buy_box_item_info">
          <div class="sort_info"><span class="badge badge_reserved" v-if="product && product.reserve">予約商品</span>{{product? product.baseInfo.promotionText:'' }}</div>
          <div class="item_name">
            <span class="name_text" v-if="product">{{ product.baseInfo.productName }}</span>
          </div>
          <div class="item_price">
            <span class="price_text" v-if="isSaleExec && price && price.additionDiscountAmt > 0">社員割引価格</span>
            <div class="bx_price">
              <strong class="sale" v-if="discountRate">{{ discountRate }}% OFF</strong>
              <strong class="number" v-if="discountRate"><span class="txt">￥</span>{{ salePrice }}</strong>
              <strong class="number" v-else><span class="txt">￥</span> {{ originalPrice }}</strong>
              <span class="tax_txt">(税込)</span>
              <em class="standard_price" v-if="discountRate">{{ originalPrice }}</em>
            </div>
          </div>
        </div>

        <div class="buy_btn">
          <template v-if="!isDisable">
            <button class="btn btn_green" v-if="!buyOptionStatus" @click="buyOption()">
              {{product && product.limitations && product.limitations.canAddToCart !== false?'購入する':'今すぐ購入する'}}
            </button>
            <button class="btn_close" v-if="buyOptionStatus" @click="buyOptionClose()">X</button>
          </template>
          <template v-else>
            <button class="btn" disabled="disabled">
              {{ disableMessage }}
            </button>
          </template>
        </div>
      </div>

      <div class="itemivew_buy_option" v-if="buyOptionStatus">
        <div class="itemivew_buy_inner">
          <div class="option_left">
            <template v-if="selectViewOption">
              <ul class="area_item_select">
                <template v-if="options && options.type && options.type === 'STANDARD'">
                  <li>
                    <div class="bx_select size_m">
                      <detail-select-item v-model="optionSelector[0]" :isStandard="true" :label="displayOptions[0].label + 0" :value="displayOptions[0].value[0].value" :options="getOption(0)" @input="onChange(0)" @checkStatus="checkOptionSelect" />
                    </div>
                  </li>
                </template>
                <li v-for="(option, key) in displayOptions" :key="key" v-else>
                  <div :class="{'bx_select size_m':true,'disabled':!optionSelector[key-1] && key > 0}">
                    <detail-select-item v-model="optionSelector[key]" :label="option.label" :value="option.value" :options="getOption(key)" :disabled="!optionSelector[key-1] && key > 0" @input="onChange(key)" @checkStatus="checkOptionSelect" />
                  </div>
                </li>
              </ul>
            </template>
            <div class="bx_cost cf" v-if="product && product.deliveryFee">
              <dl>
                <dt>送料</dt>
                <template v-if="product && product.deliveryFee.deliveryConditionType === 'FREE'">
                  <dd>無料<br>
                    - 1~2営業日以内に出荷（土日祝休業）</dd>
                </template>
                <template v-else>
                  <dd v-if="product && product.deliveryFee">{{product.deliveryFee.defaultDeliveryConditionLabel}}<br>
                    - 1~2営業日以内に出荷（土日祝休業）</dd>
                </template>
              </dl>
            </div>
            <div class="bx_item_info" v-if="product && product.reservationData && (reservationLeftDate > 0 || isPreOrderPeriod)">
              <p class="lst_item_tit">予約商品の案内</p>
              <dl class="lst_item_detail cf">
                <dt>注文可能期間</dt>
                <dd>{{ product.reservationData.reservationStartYmdt  }} - {{ product.reservationData.reservationEndYmdt  }} (<span>{{ reservationLeftDate }}</span>日)</dd>
                <dt>配送開始日</dt>
                <dd> {{ product.reservationData.reservationDeliveryYmdt }}日から順次発送</dd>
                <dt>送料</dt>
                <dd>{{ product.deliveryFee ? product.deliveryFee.defaultDeliveryConditionLabel : '-' }}</dd>
              </dl>
            </div>
          </div>
          <div class="option_right">
            <ul class="lst_option_bx" v-if="options && options.type === 'DEFAULT'">
              <li>
                <div class="opt_detail">
                  <span class="name">数</span>
                </div>
                <template v-if="options && options.selectedOptions">
                  <spinner class="opt_mr_8" v-model="options.selectedOptions[0].orderCnt" :showDelet="false" :min="1" />
                </template>
              </li>
            </ul>
            <ul class="lst_option_bx" v-else>
              <template v-if="options && options.selectedOptions">
                <li v-for="(item, key) in options.selectedOptions" :key="key">
                  <div class="opt_detail">
                    <span class="name">{{ (item.viewValue || []).join(' / ') }}</span>
                    <div class="bx_price">
                      <p><strong class="number"><span class="txt">￥</span>{{ item.buyPrice * item.orderCnt }} </strong></p>
                    </div>
                  </div>
                  <template v-if="options.selectedOptions">
                    <spinner v-model="item.orderCnt" :min="1" :max="item.stockCnt" @input="REFRESH({ index: key, orderCnt: item.orderCnt })" @decleSpinner="DELETEOPTION({ index: key })" :showDelet="options.selectedOptions.length > 0" />
                  </template>
                </li>
              </template>
            </ul>
            <div class="total_price">
              <div class="bx_price">
                <span class="tit">商品小計<span class="tax_txt">(税込)</span></span>
                <p><strong class="number"> <span class="txt">￥</span>{{ totalPrice }}</strong></p>
              </div>
            </div>
            <ul class="list_btn">
              <li class="btn_wish" :class="{ on: product?product.liked:false }" @click.prevent="$emit('likeIt')"><button class="btn btn_primary"><i class="ico_wish">Wish</i></button></li>
              <template v-if="product && product.limitations && product.limitations.canAddToCart !== false">
                <li>
                  <default-button :showIco="true" :data="form.cart" @click="$emit('addToCart')" />
                </li>
                <li>
                  <default-button :data="form.order" @click="$emit('buy')" />
                </li>
              </template>
              <li class="w-300" v-else>
                <default-button :data="form.singleBuy" @click="$emit('buy')" />
              </li>
            </ul>
            <div class="bx_item_package">
              <a href="#" @click="$emit('showPackage')">プレゼントの包装が必要ですか。</a>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="wrap_tabmenu">
      <div class="bx_itemview_tab">
        <ul class="itemview_tab">
          <li :class="{'on': active === 'info'}"><a href="#" @click.prevent="tabMove('info')">商品説明</a></li>
          <li :class="{'on': active === 'review'}">
            <a href="#" @click.prevent="tabMove('review')">レビュー
              <template v-if="productReviews">
                <span class="num">{{ productReviews.totalCount > 99 ? '99+':productReviews.totalCount}}</span>
              </template>
            </a></li>
          <li v-if="inquiryList" :class="{'on': active === 'contact'}">
            <a href="#" @click.prevent="tabMove('contact')">商品お問い合わせ
              <template v-if="inquiryList">
                <span class="num">{{ inquiryList.totalCount>99 ? '99+':inquiryList.totalCount}}</span>
              </template>
            </a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import * as $ from 'jquery'
import { Alert } from '@/components/common/modal'
import { isLogin } from '@/utils/utils'
import DetailSelectItem from './DetailSelect'
import DefaultButton from './DefaultButton'
import Spinner from './Spinner'
import { mapState, mapGetters, mapMutations } from 'vuex'
// import { includeNow } from '@/utils/dateUtils'

export default {
  name: 'DetailTab',
  components: {
    DetailSelectItem,
    DefaultButton,
    Spinner
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
      limitPosition: $('#header .header').outerHeight() + $('.wrap').outerHeight() + $('.itemivew_buy_wrapper').outerHeight() + 300,
      count: 1,
      scrollLock: false,
      selectViewOption: false,
      form: {
        cart: {
          action: 'button',
          to: '',
          title: 'カート',
          type: 'half',
          active: false,
          ico: 'ico_cart_w'
        },
        order: {
          action: 'button',
          to: '',
          title: '購入する',
          type: 'half',
          active: true,
          color: 'btn_green'
        },
        singleBuy: {
          action: 'button',
          to: '',
          title: '今すぐ購入する',
          type: 'half',
          active: true,
          color: 'btn_green'
        }
      }
    }
  },
  computed: {
    ...mapGetters('profile', ['isSaleExec']),
    ...mapState('productinquiry', ['inquiryList']),
    ...mapState('product', ['showLikedLayer']),
    ...mapGetters('product', ['displayOptions', 'optionInputsGetters', 'options', 'product']),
    ...mapState('review', ['productReviews']),
    reservationLeftDate () {
      return Math.ceil((new Date(this.product.reservationData.reservationEndYmdt.replace(' ', 'T')) - new Date()) / (1000 * 3600 * 24))
    },
    baseInfo () {
      if (this.product) {
        const baseInfoJSON = this.product.baseInfo.baseInfoByJSON
        const contents = (baseInfoJSON && baseInfoJSON.contents) || {}
        return this.product ? contents : {}
      } else {
        return {}
      }
    },
    price () {
      if (this.product) {
        return this.product.price
      } else {
        return []
      }
    },
    couponRate () {
      return Math.ceil(this.price.couponDiscountAmt / (this.price.salePrice - this.discountAmt) * 100)
    },
    discountRate () {
      return Math.ceil(this.discountAmt / this.price.salePrice * 100)
    },
    discountAmt () {
      if (this.price) {
        return this.price.immediateDiscountAmt + this.price.additionDiscountAmt
      } else {
        return ''
      }
    },
    salePrice () {
      if (this.price) {
        return (this.price.salePrice - this.discountAmt).toLocaleString()
      } else {
        return ''
      }
    },
    originalPrice () {
      if (this.price && this.price.salePrice) {
        return this.price.salePrice.toLocaleString()
      } else {
        return ''
      }
    },
    isExecutives () {
      return false
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
    // isPreOrderPeriod () {
    //   if (this.product && this.product.reservationData) {
    //     return includeNow(this.product.reservationData.reservationStartYmdt, this.product.reservationData.reservationEndYmdt)
    //   }
    //   return false
    // },
    isDisable () {
      return this.disableMessage !== null
    },
    disableMessage () {
      if (this.product) {
        if (this.product.status.soldout) {
          return '品切れ'
        } else if (this.product.status.saleStatusType === 'READY' && !this.isPreOrderPeriod) {
          return '即購入不可'
        } else if (this.product.status.saleStatusType === 'STOP') {
          return '販売中止'
        } else if (this.product.status.saleStatusType === 'PROHIBITION') {
          return '販売禁止'
        } else if (this.product.status.saleStatusType === 'FINISHED') {
          return '販売終了'
        }
      }

      return null
    }
  },
  updated () {
    if (this.options) {
      let multiLengths = this.options.multiLevelOptions.length
      this.selectViewOption = (multiLengths > 1)
      setTimeout(() => {
        this.limitPosition = $('#header .header').outerHeight() + $('.wrap').outerHeight() + $('.itemivew_buy_wrapper').outerHeight() - 220
      }, 500)
    }
  },
  methods: {
    ...mapMutations('product', ['SELECTOPTION', 'REFRESH', 'DELETEOPTION']),
    checkOptionSelect (data) {
      this.$emit('tabSelect', data)
    },
    getOptionLabel (key) {
      let option = this.displayOptions[key]
      return (this.options && this.options.type !== 'MAPPING' && option['label']) ? option['label'] : 'オプションを選択してください'
    },
    getOption (key) {
      let option = this.displayOptions[key]
      return [
        {
          label: this.getOptionLabel(key),
          value: undefined
        },
        ...option.value.map(item => {
          if (typeof item === 'object') {
            return {
              label: item.value + this.optionAddPrice(key, item.value, option.label) + (this.isSoldOut(key, item.value, option.label) ? ' [品切れ]' : ''),
              value: item.value,
              standardLabel: item.label,
              disabled: this.isSoldOut(key, item.value, option)
            }
          } else {
            return {
              label: item + this.optionAddPrice(key, item, option.label) + (this.isSoldOut(key, item, option.label) ? ' [品切れ]' : ''),
              value: item,
              disabled: this.isSoldOut(key, item, option)
            }
          }
        }
        )
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
          returnStr = ' (' + (selected.addPrice > 0 ? '+' : '') + selected.addPrice.toLocaleString() + '円)'
        }
      }
      return returnStr
    },
    likeIt () {
      if (!isLogin()) {
        this.$router.push({
          path: '/member/login',
          query: {
            redirect: this.$route.path
          }
        })
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
      if (this.options && this.options.type === 'STANDARD') {
        if (key === 0) {
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
                message: 'このオプションは既に選択されています。'
              })
            }
          }
          this.$nextTick(() => {
            this.optionSelector = []
          })
        } else {
          this.optionSelector[key + 1] = undefined
        }
      } else {
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
                message: 'このオプションは既に選択されています。'
              })
            }
          }
          this.$nextTick(() => {
            this.optionSelector = []
          })
        } else {
          this.optionSelector[key + 1] = undefined
        }
      }
    },
    tabMove (event) {
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
      this.$nextTick(() => {
        $('html, body').scrollTop(this.limitPosition)
      })
    },
    handleScroll () {
      if (this.lastPosition < $(window).scrollTop() && this.limitPosition < $(window).scrollTop()) {
        $('.itemivew_buy_wrapper').show()
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
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    this.limitPosition = $('#header .header').outerHeight() + $('.wrap').outerHeight() + $('.itemivew_buy_wrapper').outerHeight() + 300
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style scoped>
.wrapper-pc .itemview .itemivew_buy_wrapper {
  display: block;
  position: static;
  top: -100px;
}
.wrapper-pc .itemview .itemivew_buy_wrapper.show {
  transition: 0.5s all;
  display: block;
  position: fixed;
  top: 0;
}
.item_buy_ss {
  overflow: hidden;
}
</style>
