<template>
  <div id="container" class="itemview">
    <div class="wrap">
      <!-- ↓↓↓↓↓ wrap_category ↓↓↓↓↓ -->
      <template v-if="product && product.baseInfo">
        <bread-crumbs :goodsName="product.baseInfo.productName" />
      </template>
      <!-- ↑↑↑↑↑ wrap_category ↑↑↑↑↑ -->

      <!-- ↓↓↓↓↓ itemview_head ↓↓↓↓↓ -->
      <div class="itemview_head">
        <!-- ↓↓↓↓↓ area_item_thumbnail ↓↓↓↓↓ -->
        <div class="area_item_thumbnail">
          <div class="bx_thumbnail_img">
            <template v-if="product && product.baseInfo && product.baseInfo.imageUrls.length > 0">
              <slick ref="slick" :options="SlickOptions" id="product_slick" @afterChange="handleBeforeChange">
                <div class="bx_thumb" v-for="( img, key ) in product.baseInfo.imageUrls" :key="key">
                  <img :src="img" alt="">
                </div>
              </slick>
            </template>
          </div>
          <template v-if="product && product.baseInfo && product.baseInfo.imageUrls.length > 0">
            <div class="bx_thumbnail_list">
              <div :class="{lst_thumb:true, on: key === currentSlide}" v-for="( img, key ) in product.baseInfo.imageUrls" :key="key" @click="changeSlick(key)">
                <img :src="img" alt=""></div>
            </div>
          </template>

        </div>
        <!-- ↑↑↑↑↑ area_item_thumbnail ↑↑↑↑↑ -->

        <!-- ↓↓↓↓↓ area_item_info ↓↓↓↓↓ -->
        <div class="area_item_info">
          <div class="item_badge">
            <span class="badge badge_blue" v-if="isNew()">NEW</span>
            <span class="badge badge_purple" v-if="product && product.mainBestProductYn">BEST</span>
            <span class="badge badge_reserved" v-if="isPreOrderPeriodProduct">予約商品</span>
            <span class="badge badge_blue" v-if="coupons.length > 0">クーポン</span>
            <span class="badge badge_red" v-if="isLittle">あとわずか</span>
          </div>
          <p class="item_name_sub" v-if="product && product.baseInfo && product.baseInfo.promotionText">{{product.baseInfo.promotionText}}</p>
          <h2 class="item_name" v-if="product &&  product.baseInfo && product.baseInfo.productName">{{ showName }}<br><span v-if="product.baseInfo.purchaseGuide">{{product.baseInfo.purchaseGuide}}</span></h2>

          <div class="bx_item_price">
            <div class="bx_price">
              <p class="edp" v-if="isSaleExec && price && price.additionDiscountAmt > 0">社員割引価格</p>
              <p><strong class="sale" v-if="discountRate"><span class="wrapper-pc-font_family_c">{{ discountRate }}</span>% OFF</strong><strong class="number" v-if="discountRate"><span class="txt size-16">￥</span>{{salePrice}}</strong>
                <strong class="number" v-else><span class="txt size-16">￥</span>{{originalPrice}}</strong>
                <span class="tax_txt">(税込)</span>
              </p>
              <p class="standard_price" v-if="discountRate"> {{ originalPrice }}</p>
            </div>
          </div>
          <div class="bx_discount_coupon">
            <detail-coupon :price="price" />
          </div>
          <div class="bx_cost cf opt_mb_40 " v-if="product && product.deliveryFee">
            <dl>
              <dt>送料</dt>
              <template v-if="product && product.deliveryFee && product.deliveryFee.deliveryConditionType === 'FREE'">
                <dd>無料<br>
                  - 1~2営業日以内に出荷（土日祝休業）</dd>
              </template>
              <template v-else>
                <dd v-if="product && product.deliveryFee">{{product.deliveryFee.defaultDeliveryConditionLabel}}<br>
                  - 1~2営業日以内に出荷（土日祝休業）</dd>
              </template>
            </dl>
          </div>
          <template v-if="options">
            <template v-if="!selectViewOption">
              <div class="count_selection lst_option_bx">
                <div class="opt_detail">
                  <span class="item_txt">数量選択</span>
                </div>
                <template v-if="options.selectedOptions && options.selectedOptions[0].orderCnt !== undefined">
                  <spinner class="opt_mr_16" v-model="options.selectedOptions[0].orderCnt" :max="isPreOrderPeriod ? options.selectedOptions[0].reservationStockCnt - 1 : options.selectedOptions[0].stockCnt-1" :min="1" :showDelet="false" />
                </template>
              </div>
            </template>
            <template v-else>
              <div class="area_item_option">
                <ul class="area_item_select">
                  <template v-if="options && options.type && options.type === 'STANDARD'">
                    <li>
                      <div class="bx_select size_m">
                        <detail-select-item v-model="optionSelector[0]" :isStandard="true" :label="displayOptions[0].label + 0" :value="displayOptions[0].value[0].value" :options="getOption(0)" @input="onChange(0)" @checkStatus="checkOptionSelect" />
                      </div>
                    </li>
                  </template>
                  <li v-for="(option, key) in displayOptions" :key="key" v-else>
                    <div class="bx_select size_m" :class="{'disabled': !optionSelector[key-1] && key > 0}">
                      <detail-select-item v-model="optionSelector[key]" :label="option.label + key" :value="option.value[0].value" :options="getOption(key)" :disabled="!optionSelector[key-1] && key > 0" @input="onChange(key)" @checkStatus="checkOptionSelect" />
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </template>
          <template v-if=" options && options.selectedOptions && selectViewOption">
            <div class="area_item_option">
              <ul class="lst_option_bx">
                <li v-for="(item, key) in options.selectedOptions" :key="key">
                  <div class="opt_detail">
                    <template v-if="item && item.viewValue">
                      <span class="name">{{item.viewValue.join(' / ')}}</span>
                    </template>
                    <div class="bx_price">
                      <p><strong class="number"><span class="txt">￥</span>{{ (item.buyPrice) * item.orderCnt }}</strong></p>
                    </div>
                  </div>
                  <spinner class="opt_mr_28" v-model="item.orderCnt" :min="1" :max="isPreOrderPeriod ? item.reservationStockCnt - 1 : item.stockCnt-1" @input="REFRESH({ index: key, orderCnt: item.orderCnt })" @decleSpinner="DELETEOPTION({ index: key })" />
                </li>
              </ul>
            </div>
          </template>
          <div class="total_price">
            <div class="bx_price">
              <span class="tit"> 商品小計<span class="tax_txt">(税込)</span></span>
              <p><strong class="number"><span class="txt size-28">￥</span>{{ totalPrice }}</strong></p>
            </div>
          </div>
          <ul class="list_btn">
            <li class="btn_wish " :class="{ on: product.liked }" @click.prevent="likeIt" v-if="product"><button class="btn btn_primary"><i class="ico_wish">Wish</i></button></li>
            <template v-if="!isDisable">
              <template v-if="product && product.limitations && product.limitations.canAddToCart !== false">
                <li>
                  <default-button :data="cart" @click="addToCart" />
                </li>
                <li>
                  <default-button :data="buy" @click="buys" />
                </li>
              </template>
              <li class="w-300" v-else>
                <default-button :data="buySingle" @click="buys" />
              </li>
            </template>
            <template v-else>
              <li class="w-300">
                <default-button :data="disableMessage" />
              </li>
            </template>
          </ul>

          <div class="bx_item_info" v-if="product && product.reservationData && (reservationLeftDate > 0 || isPreOrderPeriod)">
            <p class="lst_item_tit">予約商品の案内</p>
            <dl class="lst_item_detail cf">
              <dt>注文可能期間</dt>
              <dd>{{ product.reservationData.reservationStartYmdt  }} - {{ product.reservationData.reservationEndYmdt  }}(まで<span>{{ reservationLeftDate }}</span>日)</dd>
              <dt>配送開始日</dt>
              <dd> {{ product.reservationData.reservationDeliveryYmdt }}日から順次発送</dd>
              <dt>送料</dt>
              <dd> {{ product.deliveryFee ? product.deliveryFee.defaultDeliveryConditionLabel : '-' }}</dd>
            </dl>
          </div>
          <div class="bx_item_package">
            <a href="#" @click.prevent="showPackagePupop">プレゼントの包装が必要ですか。</a>
          </div>
        </div>
        <!-- ↑↑↑↑↑ area_item_info ↑↑↑↑↑ -->
      </div>
      <!-- ↑↑↑↑↑ itemview_head ↑↑↑↑↑ -->
    </div>
    <template v-if="true">
      <detail-tab ref="detailTab" :ordCnt="theOrderCnt" @childs-event="tabView" @showPackage="showPackagePupop" @buy="buys" @addToCart="addToCart('cart')" @likeIt="() => likeIt()" @tabSelect="checkOptionSelect" />
    </template>
    <template v-if="tabStatus === 'info'">
      <detail-info :product="product" />
    </template>
    <template v-if="tabStatus === 'contact'">
      <detail-contact :pageDefault="pageDefault" />
    </template>
    <template v-if="tabStatus === 'review'">
      <detail-review />
    </template>
    <template v-if="recommands && recommands.length!==0">
      <detail-recommand :recommand="recommands" />
    </template>
    <template v-if="showPackage">
      <product-package ref="package" @close="closeThePackPopup" />
    </template>
  </div>
</template>
<script>
import * as $ from 'jquery'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import DetailSelectItem from '@/components/goods/DetailSelect'
import Slick from 'vue-slick'
import Spinner from '@/components/goods/Spinner'
import DefaultButton from '@/components/goods/DefaultButton'
import DetailInfo from '@/components/goods/DetailInfo'
import DetailContact from '@/components/goods/DetailContact'
import DetailReview from '@/components/goods/DetailReview'
import DetailTab from '@/components/goods/DetailTab'
import DetailCoupon from '@/components/goods/DetailCoupon'
import BreadCrumbs from '@/components/common/BreadCrumbs'
import DetailRecommand from '@/components/goods/DetailRecommand'
import { Alert, Confirm } from '@/components/common/modal'
import { isLogin, loginAndBack, setOrderInfoInStorage } from '@/utils/utils'
import ProductPackage from '@/components/common/package/ProductPackagePopup'
import { includeNow } from '@/utils/dateUtils'

export default {
  name: 'ProductDetail',
  components: {
    Slick,
    DetailSelectItem,
    Spinner,
    DefaultButton,
    DetailInfo,
    DetailContact,
    DetailReview,
    DetailTab,
    DetailCoupon,
    BreadCrumbs,
    DetailRecommand,
    ProductPackage
  },
  data () {
    return {
      SlickOptions: {
        slidesToShow: 1,
        dots: false,
        arrows: false,
        infinite: false,
        slideToScroll: 1,
        fade: false
      },
      optionSelector: [],
      selectViewOption: false,
      cart: {
        action: 'button',
        active: false,
        title: 'カート',
        to: '',
        ico: 'ico_cart_w'
      },
      buy: {
        action: 'button',
        active: false,
        title: '購入する',
        to: '',
        color: 'btn_green'
      },
      buySingle: {
        action: 'button',
        active: false,
        title: '今すぐ購入する',
        to: '',
        color: 'btn_green'
      },
      num: 1,
      theOrderCnt: 1,
      tabStatus: 'info',
      defaultType: ['DEFAULT', 'MAPPING'],
      showPackage: false,
      packageNo: 101915272,
      pageDefault: Number,
      currentSlide: 0
    }
  },
  computed: {
    ...mapGetters('profile', ['isSaleExec']),
    ...mapState('product', ['productImags', 'productOptionNoImags']),
    ...mapGetters('product', ['options', 'displayOptions', 'product']),
    ...mapState('productrecommand', { recommands: 'list' }),
    ...mapState('package', ['storePackageNo']),
    ...mapGetters('coupon', ['getCoupons', ['compare']]),
    isLittle () {
      if (this.isPreOrderPeriod && this.product.reservationData) {
        if (this.product.reservationData.reservationStockCnt < 5 && this.product.reservationData.reservationStockCnt > 0) {
          return true
        }
        return false
      } else {
        if (this.product && this.product.stock && this.product.stock.stockCnt < 5 && this.product.stock.stockCnt > 0) {
          return true
        }
        return false
      }
    },
    isPreOrderPeriod () {
      if (this.product && this.product.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(this.product.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(this.product.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    },
    isPreOrderPeriodProduct () {
      if (this.product && this.product.reservationData) {
        return includeNow(this.product.reservationData.reservationStartYmdt, this.product.reservationData.reservationEndYmdt)
      }
      return false
    },
    showName () {
      return this.product.baseInfo.productName
    },
    price () {
      if (this.product) {
        return this.product.price
      } else {
        return []
      }
    },
    couponRate () {
      if (this.price) {
        return Math.ceil(this.price.couponDiscountAmt / (this.price.salePrice - this.discountAmt) * 100)
      } else {
        return ''
      }
    },
    coupons () {
      return this.getCoupons || []
    },
    isRateCoupon () {
      return this.coupons[0].discountInfo.discountAmt === null
    },
    downloadableCoupons () {
      if (this.coupons) {
        return this.coupons.filter(item => item.downloadable)
      } else {
        return false
      }
    },
    discountRate () {
      if (this.price) {
        return Math.ceil(this.discountAmt / this.price.salePrice * 100)
      } else {
        return ''
      }
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
    totalPrice () {
      // let salePrice = this.price.salePrice - this.discountAmt
      let price = 0
      if (this.options && this.options.flatOptions) {
        if (this.options.flatOptions.length > 0 && this.options.selectedOptions) {
          for (let option of this.options.selectedOptions) {
            let calprice = 0
            if (this.options.type === 'MAPPING') {
              let optionSalePrice = (option.buyPrice)
              calprice = optionSalePrice
            } else {
              calprice = option.buyPrice
            }
            price += calprice * (option.orderCnt || 0)
          }
        } else {
          price = 0
        }
      }
      return price.toLocaleString()
    },
    reservationLeftDate () {
      return Math.ceil((new Date(this.product.reservationData.reservationEndYmdt.replace(' ', 'T')) - new Date()) / (1000 * 3600 * 24))
    },
    isPreOrderPeriods () {
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
      if (this.product && this.product.status) {
        if (this.product.status.soldout) {
          ret = '品切れ'
        } else if (this.product.status.saleStatusType === 'READY' && !this.isPreOrderPeriod) {
          ret = '即購入不可'
        } else if (this.product.status.saleStatusType === 'STOP') {
          ret = '販売中止'
        } else if (this.product.status.saleStatusType === 'PROHIBITION') {
          ret = '販売禁止'
        } else if (this.product.status.saleStatusType === 'FINISHED') {
          ret = '販売終了'
        }
      }
      if (ret === null) {
        return null
      } else {
        return {
          action: 'button',
          to: '',
          title: ret,
          active: false
        }
      }
    }
  },
  methods: {
    ...mapMutations('product', ['SELECTOPTION', 'REFRESH', 'DELETEOPTION']),
    ...mapActions('cart', { _addToCart: 'addToCart' }),
    ...mapActions('package', ['fetchPackage', 'fetchPackageOptions', 'fetchPackageOptionsImages']),
    ...mapActions('product', ['fetchProduct', 'fetchProductOptions']),
    async showPackagePupop () {
      this.packageNo = this.$store.state.package.storePackageNo
      await this.fetchPackage({ productTheNo: this.packageNo })
      await this.fetchPackageOptionsImages(this.packageNo)
      await this.fetchPackageOptions(this.packageNo).then(() => {
        this.showPackage = true
        $('html,body').css('overflow', 'hidden')
        this.$nextTick(() => {
          this.$refs.package.defaultOptionCheck()
        })
      })
    },
    closeThePackPopup () {
      $('html,body').css('overflow', '')
      this.showPackage = false
    },
    isDefault () {
      return this.defaultType.indexOf(this.options.type) >= 0 || this.options.flatOptions.length === 1
    },
    handleBeforeChange (event, slick, currentSlide) {
      this.currentSlide = currentSlide
    },
    changeSlick (currentSlide) {
      this.currentSlide = currentSlide
      this.$refs.slick.goTo(currentSlide)
    },

    tabView (event) {
      this.pageDefault = null
      if (event === 'info') {
        this.tabStatus = 'info'
      } else if (event === 'review') {
        this.tabStatus = 'review'
      } else if (event === 'contact') {
        this.pageDefault = 1
        this.tabStatus = 'contact'
      }
    },
    buys () {
      this.beforValidate().then((ret) => {
        if (ret) {
          if (loginAndBack(this.$router, this.$route)) {
            const products = this.makeProductItems()
            const searchid = this.$store.state.route.query.searchProductID
            if (searchid) {
              const targetURL = `${location.protocol}//${location.host}/product/detail/${products[0].productNo}`
              window.NCPSearch.sendClickLog(targetURL, searchid, 'buyclick', '')
            }
            setOrderInfoInStorage(products, this.$route.fullPath)
            $('html').css('overflow', 'scroll')
            this.$store.dispatch('ordersheet/getSheetNo')
          }
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
    async addToCart (event) {
      let ret = await this.beforValidate()

      if (ret) {
        await this._addToCart({
          carts: this.makeProductItems()
        }).then((res) => {
          if (res) {
            Confirm({ message: 'カートに追加いたしました。カートを確認いたしますか?' }).then((res) => {
              if (res) {
                this.$router.push('/cart')
              }
            })
          }
        })

        this.layerPopupStatus = event
      }
    },
    isNew () {
      if (this.product) {
        if (this.product.baseInfo) {
          return this.product.baseInfo.registerYmdt > this.fun_date(-7)
        }
      }
    },
    fun_date (aa) {
      var date1 = new Date()
      var date2 = new Date(date1)
      date2.setDate(date1.getDate() + aa)
    },
    likeIt () {
      if (!isLogin()) {
        this.$router.push({
          path: '/member/login',
          query: {
            redirect: this.$route.path
          }
        })
      }
      let _this = this
      this.$store.dispatch('likeProducts/postLikeProducts', [this.product.baseInfo.productNo]).then(() => {
        const productNo = this.product.baseInfo.productNo
        _this.$store.commit('product/CHANGELIKED', productNo)
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
    getOptionLabel (key) {
      let option = this.displayOptions[key]
      return (this.options.type !== 'MAPPING' && option['label']) ? option['label'] : 'オプションを選択してください'
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

      let selected = this.getSelectedOption(key, item, value)
      if (selected) {
        return this.isPreOrderPeriod ? selected.reservationStockCnt === 0 : selected.stockCnt === 0
      }
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
    getSelectedOption (key, item, value) {
      let predictionOption = ''
      for (let i = 0; i < key; i++) {
        predictionOption += this.optionSelector[i]
      }

      const selected = this.options.flatOptions.filter(option => option.value === (predictionOption ? predictionOption + '|' : '') + item).pop()
      return selected
    },
    defaultOptionCheck () {
      if (this.options) {
        if (this.options.flatOptions) {
          this.selectViewOption = this.options.flatOptions.length !== 1
          if (this.isDefault && !this.options.selectedOptions && !this.selectViewOption) {
            this.SELECTOPTION({
              ...this.options.flatOptions[0],
              orderCnt: 1
            })
          }
        }
      }
    },
    checkOptionSelect (data) {
      this.beforValidate(data)
    },
    async beforValidate (data) {
      if (data === undefined) {
        if (this.options.selectedOptions === undefined || this.options.selectedOptions.length === 0) {
          Alert({
            message: 'オプションを選択してください。'
          }).then(() => {
            return false
          })
          return false
        }
        // 상품 구매자 작성형 미 입력 시
        if (this.options.enteredProductInputs.filter(i => i.inputValue !== '').length !== this.options.productInputs.length) {
          Alert({
            message: 'オプションを選択してください。'
          }).then(() => {
            return false
          })
          return false
        }
      }
      await this.$store.dispatch('product/asyncProduct', this.product.baseInfo.productNo)
      await this.$store.dispatch('product/asyncProductOptions', this.product.baseInfo.productNo)
      if (!this.product.status.display) {
        Alert({
          message: 'この商品は現在購入不可能です。'
        }).then(() => {
          return false
        })
        return false
      }
      if (this.product.status.saleStatusType === 'READY') {
        if (!this.isPreOrderPeriod) {
          Alert({
            message: 'この商品は現在購入不可能です。'
          }).then(() => {
            return false
          })
          return false
        }
      } else if (this.product.status.saleStatusType !== 'ONSALE') {
        Alert({
          message: 'この商品は現在購入不可能です。'
        }).then(() => {
          return false
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
                  message: '商品価格が変更されました。再度確認してください。'
                }).then(() => {
                  return false
                })
                return false
              }
              if (this.isPreOrderPeriod) {
                if (subitem.reservationStockCnt === 0) {
                  checkflg = false
                  Alert({
                    // title: '상품',
                    message: '選択したオプションは在庫がありません。'
                  }).then(() => {
                    if (data !== undefined) {
                      this.DELETEOPTION({ index: this.options.selectedOptions.length - 1 })
                    }
                    return false
                  })
                  return false
                }
              } else if (subitem.stockCnt === 0) {
                checkflg = false
                Alert({
                  message: '選択したオプションは在庫がありません。'
                }).then(() => {
                  if (data !== undefined) {
                    this.DELETEOPTION({ index: this.options.selectedOptions.length - 1 })
                  }
                  return false
                })
                return false
              }
              if (Number(item.orderCnt) > (this.isPreOrderPeriod ? subitem.reservationStockCnt : subitem.stockCnt)) {
                checkflg = false

                if (this.options.type === 'COMBINATION') {
                  Alert({
                    message: '選択したオプションの在庫が不足しています。 数量を再確認してください。'
                  })
                } else if (this.options.type !== 'COMBINATION') { // DEFAULT, STANDARD
                  Alert({
                    message: '選択した在庫が不足しています。 数量を再確認してください。'
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
          message: 'この商品は最低1つ以上の購入可能な商品です。数量を再度ご確認下さい。'
        }).then(() => {
          return false
        })
        return false
      }

      /** min buy check */
      if (this.product.limitations.minBuyCnt !== 0 && buyCnt < this.product.limitations.minBuyCnt) {
        Alert({
          message: 'この商品は最低' + this.product.limitations.minBuyCnt + '以上購入可能な商品です。 数量を再確認してください。'
        }).then(() => {
          return false
        })
        return false
      }

      /** Time max Buy Cnt check */
      if ((this.product.limitations.maxBuyTimeCnt !== 0 && buyCnt > this.product.limitations.maxBuyTimeCnt) ||
        (this.product.limitations.maxBuyPeriodCnt !== 0 && buyCnt > this.product.limitations.maxBuyPeriodCnt) ||
        (this.product.limitations.maxBuyPersonCnt !== 0 && buyCnt > this.product.limitations.maxBuyPersonCnt)) {
        if (this.product.limitations.maxBuyPersonCnt) {
          Alert({
            message: 'この商品はお一人様につき ' + this.product.limitations.maxBuyPersonCnt + '点まで購入可能です。数量を再確認してください。'
          }).then(() => {
            return false
          })
        } else if (this.product.limitations.maxBuyDays) {
          Alert({
            message: 'この商品は' + this.product.limitations.maxBuyDays + '日間で' + this.product.limitations.maxBuyPeriodCnt + '点まで購入可能です。数量を再確認してください。'
          }).then(() => {
            return false
          })
        } else {
          let maxCnt = this.product.limitations.maxBuyTimeCnt | this.product.limitations.maxBuyPeriodCnt
          Alert({
            message: 'この商品は最大1回あたり ' + maxCnt + '点まで購入可能です。数量を再確認してください。'
          }).then(() => {
            return false
          })
        }
        return false
      }
      return true
    }
  },
  beforeUpdate () {
    this.defaultOptionCheck()
  },
  mounted () {
    this.fetchProductOptions(this.$route.params.goodsNo).then(() => {
      this.defaultOptionCheck()
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => { vm.from = from })
  },
  beforeRouteUpdate (to, from, next) {
    this.tabStatus = 'info'
    this.$refs.detailTab.active = 'info'
    next()
  },
  beforeRouteLeave (to, from, next) {
    this.tabStatus = 'info'
    this.$refs.detailTab.active = 'info'

    next()
  }
}
</script>
 <style scoped>
.wrapper-pc .itemview .area_item_thumbnail .bx_thumbnail_img .btn_wish {
  background-size: 40px 40px;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: url(../../assets/img/icon/ico_wish.png) center center no-repeat;
  background-size: 40px 40px;
  font-size: 0;
  z-index: 1000;
}
.wrapper-pc .itemview .area_item_thumbnail .bx_thumbnail_img .btn_wish.on {
  background: url(../../assets/img/icon/ico_wish_on.png) center center no-repeat;
  background-size: 40px 40px;
  z-index: 1000;
}
.coupon_price .number {
  margin-left: 4px;
  color: #ff414e;
  font-size: 14px;
}
.coupon_price {
  font-size: 12px;
  margin-top: 10px;
}
</style>
