<template>
  <div class="popup-layer" style="display: block;">
    <div class="popup_common popup_size_package">
      <button class="btn_close" @click="handlePackClose">close</button>
      <div class="popup_package_content">
        <div class="popup_package_content_detail">
          <div class="popup_package_image">
            <div class="thumbnail" v-if="productPackage && productPackage.baseInfo && productPackage.baseInfo.imageUrls">
              <img :src="productPackage.baseInfo.imageUrls[0]" alt="">
            </div>
          </div>

          <div class="popup_package_info">
            <h1 class="popup_package_info_title">ギフトラッピング袋(S,M,L)</h1>
            <div class="bx_select size_m popup_package_select_box">
              <template v-if="optionsPack">
                <template v-if="!packageViewOption">
                  <div class="count_selection lst_option_bx">
                    <div class="opt_detail">
                      <span class="item_txt">数量選択</span>
                    </div>
                    <template v-if="optionsPack.selectedOptions && optionsPack.selectedOptions[0].orderCnt !== undefined">
                      <spinner class="opt_mr_16" v-model="optionsPack.selectedOptions[0].orderCnt" :max="isPreOrderPeriod ? optionsPack.selectedOptions[0].reservationStockCnt - 1 : optionsPack.selectedOptions[0].stockCnt-1" :min="1" :showDelet="false" />
                    </template>
                  </div>
                </template>
                <template v-else>
                  <detail-select-item v-for="(option, key) in displayOptions" :key="key" v-model="optionSelector[key]" :label="option.label" :value="option.value" :options="getOption(key)" :disabled="!optionSelector[key-1] && key > 0" @input="onChange(key)" @checkStatus="checkOptionSelect"/>
                </template>
              </template>
            </div>
            <div class="popup_package_scroll_area" v-if=" optionsPack && optionsPack.selectedOptions && optionsPack.selectedOptions.length > 0 && packageViewOption">
                <ul class="popup_package_select_block" v-for="(item, key) in optionsPack.selectedOptions" :key="key">
                  <li class="popup_package_select_info popup_package_txt_name">
                    {{ (item.viewValue || []).join(' / ') }}
                  </li>
                  <template v-if="optionsPack.selectedOptions">
                    <li class="popup_package_select_info">
                      <spinner v-model="item.orderCnt" :min="1" :max="item.stockCnt" @input="REFRESH({ index: key, orderCnt: item.orderCnt })" />
                    </li>
                  </template>
                  <li class="popup_package_select_info" v-if="optionsPack.selectedOptions.length > 0">
                    <button class="popup_package_btn_del" @click="DELETEOPTION({ index: key })">del</button>
                  </li>
                </ul>
            </div>

            <div class="popup_package_result_info">
              <p class="popup_package_price">
                <span class="popup_package_mark">￥</span><span class="popup_package_price_nums">{{ totalPrice }}</span><span class="package_tax_included">(税込)</span>
              </p>
              <p class="popup_package_txt">
                <span class="popup_package_txt_style wrapper-pc-font_family_c" v-if="productPackage && productPackage.deliveryFee">{{productPackage.deliveryFee.defaultDeliveryConditionLabel}}</span>
              </p>
            </div>

          </div>
        </div>
        <template v-if="!isDisable">
          <template v-if="productPackage && productPackage.limitations && productPackage.limitations.canAddToCart !== false">
            <default-button :data="cart" class="btn btn_green" @click="addToCart('cart')" />
          </template>
        </template>
        <template v-if="isDisable">
          <default-button class="btn" :data="disableMessage" />
        </template>
        <!-- <button class="btn btn_green" @click="addToCart('cart')">カートに入れる</button> -->
        <p class="popup_package_notice">※ 袋のご購入となり、ラッピング・包装サービスはお受けいたしておりません。予めご了承ください。</p>
        <a href="#" class="popup_to_check" @click.prevent="moveToProduct">商品相場に移動 </a>
      </div>

    </div>

  </div>
</template>

<script>
import * as $ from 'jquery'
// import { isLogin } from '@/utils/utils'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import DetailSelectItem from '@/components/goods/DetailSelect'
import { Alert, Confirm } from '@/components/common/modal'
import DefaultButton from '@/components/goods/DefaultButton'
import Spinner from './Spinner'
// import { includeNow } from '@/utils/dateUtils'
export default {
  name: 'ProductPackage',
  components: {
    DetailSelectItem,
    Spinner,
    DefaultButton
  },
  data () {
    return {
      active: 'info',
      scrolled: false,
      lastPosition: 0,
      buyOptionStatus: false,
      optionSelector: [],
      count: 1,
      scrollLock: false,
      packageViewOption: false,
      cart: {
        action: 'button',
        to: '',
        title: 'カートに入れる',
        type: 'half',
        active: false,
        ico: 'ico_cart_w'
      },
      disable: {
        action: 'button',
        to: '',
        title: 'カートに入れる',
        type: 'half',
        active: false,
        ico: 'ico_cart_w'
      },
      packageNum: 101915272,
      defaultType: ['DEFAULT', 'MAPPING']
    }
  },
  computed: {
    ...mapGetters('package', ['displayOptions', 'optionsPack', 'productPackage']),
    ...mapState('package', ['storePackageNo']),
    baseInfo () {
      if (this.productPackage) {
        const baseInfoJSON = this.productPackage.baseInfo.baseInfoByJSON
        const contents = (baseInfoJSON && baseInfoJSON.contents) || {}
        return this.productPackage ? contents : {}
      } else {
        return {}
      }
    },
    price () {
      if (this.productPackage) {
        return this.productPackage.price
      } else {
        return []
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
      let price = 0
      if (this.displayOptions.length > 0 && this.optionsPack.selectedOptions) {
        for (let option of this.optionsPack.selectedOptions) {
          price += (this.price.salePrice - this.discountAmt) * (option.orderCnt || 0)
        }
      } else {
        price = 0
      }

      return price.toLocaleString()
    },
    // 예약 주문 기간 여부
    isPreOrderPeriod () {
      if (this.productPackage && this.productPackage.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(this.productPackage.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(this.productPackage.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    },
    // isPreOrderPeriod () {
    //   if (this.productPackage && this.productPackage.reservationData) {
    //     return includeNow(this.productPackage.reservationData.reservationStartYmdt, this.productPackage.reservationData.reservationEndYmdt)
    //   }
    //   return false
    // },
    isDisable () {
      return this.disableMessage !== null
    },
    disableMessage () {
      let ret = null
      if (this.productPackage && this.productPackage.status) {
        if (this.productPackage.status.soldout) {
          ret = '品切れ'
        } else if (this.productPackage.status.saleStatusType === 'READY' && !this.isPreOrderPeriod) {
          ret = '即購入不可'
        } else if (this.productPackage.status.saleStatusType === 'STOP') {
          ret = '販売中止'
        } else if (this.productPackage.status.saleStatusType === 'PROHIBITION') {
          ret = '販売禁止'
        } else if (this.productPackage.status.saleStatusType === 'FINISHED') {
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
  updated () {
    if (this.optionsPack) {
      let multiLengths = this.optionsPack.multiLevelOptions.length
      this.packageViewOption = (multiLengths > 1)
    }
  },
  methods: {
    ...mapMutations('package', ['SELECTOPTION', 'REFRESH', 'DELETEOPTION']),
    ...mapActions('package', ['fetchPackageOptions']),
    ...mapActions('cart', { _addToCart: 'addToCart' }),
    checkOptionSelect (data) {
      this.beforValidate(data)
    },
    moveToProduct () {
      this.packageNum = this.$store.state.package.storePackageNo
      this.$router.push(`/product/detail/${this.packageNum}`)
      this.$emit('close')
    },
    handlePackClose () {
      this.$emit('close')
    },
    getOptionLabel (key) {
      let option = this.displayOptions[key]
      return (this.optionsPack && this.optionsPack.type !== 'MAPPING' && option['label']) ? option['label'] : 'オプションを選択してください'
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
            return { label: item.value + this.optionAddPrice(key, item.value, option.label) + (this.isSoldOut(key, item.value, option.label) ? ' [品切れ]' : ''),
              value: item.value,
              disabled: this.isSoldOut(key, item.value, option)
            }
          } else {
            return { label: item + this.optionAddPrice(key, item, option.label) + (this.isSoldOut(key, item, option.label) ? ' [品切れ]' : ''),
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

      const selected = this.optionsPack.flatOptions.filter(option => option.value === (predictionOption ? predictionOption + '|' : '') + item).pop()
      if (selected) {
        return this.isPreOrderPeriod ? selected.reservationStockCnt === 0 : selected.stockCnt === 0
      }
    },
    getSelectedOption (key, item, value) {
      let predictionOption = ''
      for (let i = 0; i < key; i++) {
        predictionOption += this.optionSelector[i]
      }

      const selected = this.optionsPack.flatOptions.filter(option => option.value === (predictionOption ? predictionOption + '|' : '') + item).pop()
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
    onChange (key) {
      if (key === this.displayOptions.length - 1) {
        const selected = this.optionsPack.flatOptions.filter(option => option.value === this.optionSelector.join('|')).pop()
        if (selected) {
          let optionlabelCount = selected.label.split('|')
          selected.viewValue = []
          optionlabelCount.map((label, key) => {
            if (this.optionsPack.type === 'MAPPING') {
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
    defaultOptionCheck () {
      if (this.optionsPack) {
        if (this.optionsPack.multiLevelOptions) {
          let multiLengths = this.optionsPack.multiLevelOptions.length
          this.packageViewOption = multiLengths !== 1
          if (this.isDefault && !this.optionsPack.selectedOptions && !this.packageViewOption) {
            this.SELECTOPTION({
              ...this.optionsPack.flatOptions[0],
              orderCnt: 1
            })
          }
        }
      }
    },
    isDefault () {
      return this.defaultType.indexOf(this.optionsPack.type) >= 0 || this.optionsPack.flatOptions.length === 1
    },
    async beforValidate (data) {
      if (data === undefined) {
        if (this.optionsPack.selectedOptions === undefined || this.optionsPack.selectedOptions.length === 0) {
          Alert({
            message: 'オプションを選択してください。'
          }).then(() => {
            return false
          })
          return false
        }
        // 상품 구매자 작성형 미 입력 시
        if (this.optionsPack.enteredProductInputs.filter(i => i.inputValue !== '').length !== this.optionsPack.productInputs.length) {
          Alert({
            message: 'オプションを選択してください。'
          }).then(() => {
            return false
          })
          return false
        }
      }
      await this.$store.dispatch('package/asyncPackage', this.productPackage.baseInfo.productNo)
      await this.$store.dispatch('package/asyncPackageOptions', this.productPackage.baseInfo.productNo)
      if (!this.productPackage.status.display) {
        Alert({
          message: 'この商品は現在購入不可能です。'
        }).then(() => {
          return false
        })
        return false
      }
      if (this.productPackage.status.saleStatusType === 'READY') {
        if (!this.isPreOrderPeriod) {
          Alert({
            message: 'この商品は現在購入不可能です。'
          }).then(() => {
            return false
          })
          return false
        }
      } else if (this.productPackage.status.saleStatusType !== 'ONSALE') {
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
      this.optionsPack.selectedOptions.forEach((item) => {
        buyCnt += parseInt(item.orderCnt)
        if (item.orderCnt <= 0) {
          hasCntZero = true
        }
        this.optionsPack.flatOptions.forEach((subitem) => {
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
                      this.DELETEOPTION({ index: this.optionsPack.selectedOptions.length - 1 })
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
                    this.DELETEOPTION({ index: this.optionsPack.selectedOptions.length - 1 })
                  }
                  return false
                })
                return false
              }
              if (Number(item.orderCnt) > (this.isPreOrderPeriod ? subitem.reservationStockCnt : subitem.stockCnt)) {
                checkflg = false

                if (this.optionsPack.type === 'COMBINATION') {
                  Alert({
                    message: '選択したオプションの在庫が不足しています。 数量を再確認してください。'
                  })
                } else if (this.optionsPack.type !== 'COMBINATION') { // DEFAULT, STANDARD
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
      if (this.productPackage.limitations.minBuyCnt !== 0 && buyCnt < this.productPackage.limitations.minBuyCnt) {
        Alert({
          message: 'この商品は最低' + this.productPackage.limitations.minBuyCnt + '以上購入可能な商品です。 数量を再確認してください。'
        }).then(() => {
          return false
        })
        return false
      }

      /** Time max Buy Cnt check */
      if ((this.productPackage.limitations.maxBuyTimeCnt !== 0 && buyCnt > this.productPackage.limitations.maxBuyTimeCnt) ||
        (this.productPackage.limitations.maxBuyPeriodCnt !== 0 && buyCnt > this.productPackage.limitations.maxBuyPeriodCnt) ||
        (this.productPackage.limitations.maxBuyPersonCnt !== 0 && buyCnt > this.productPackage.limitations.maxBuyPersonCnt)) {
        if (this.productPackage.limitations.maxBuyPersonCnt) {
          Alert({
            message: 'この商品はお一人様につき ' + this.productPackage.limitations.maxBuyPersonCnt + '点まで購入可能です。数量を再確認してください。'
          }).then(() => {
            return false
          })
        } else if (this.productPackage.limitations.maxBuyDays) {
          Alert({
            message: 'この商品は' + this.productPackage.limitations.maxBuyDays + '日間で' + this.productPackage.limitations.maxBuyPeriodCnt + '点まで購入可能です。数量を再確認してください。'
          }).then(() => {
            return false
          })
        } else {
          let maxCnt = this.productPackage.limitations.maxBuyTimeCnt | this.productPackage.limitations.maxBuyPeriodCnt
          Alert({
            message: 'この商品は最大1回あたり ' + maxCnt + '点まで購入可能です。数量を再確認してください。'
          }).then(() => {
            return false
          })
        }
        return false
      }
      return true
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
    makeProductItems () {
      this.packageNum = this.$store.state.package.storePackageNo
      let products = []
      if (this.optionsPack.selectedOptions) {
        products = this.optionsPack.selectedOptions.map(item => {
          this.optionsPack.enteredProductInputs.forEach((input, index) => {
            item.optionInuts.push({ inputLabel: this.optionsPack.productInputs[index].inputLabel, inputValue: input.inputValue })
          })
          return {
            productNo: this.packageNum,
            optionNo: item.optionNo,
            orderCnt: item.orderCnt,
            additionalProductNo: 0,
            optionInputs: item.optionInuts
          }
        })
      }

      return products
    }
  },
  beforeUpdate () {
    this.defaultOptionCheck()
  },
  mounted () {
    this.packageNum = this.storePackageNo
    this.fetchPackageOptions(this.packageNum).then(() => {
      this.defaultOptionCheck()
    })
  },
  destroyed () {
    $('html,body').css('overflow', '')
  }

}
</script>

<style>
</style>
