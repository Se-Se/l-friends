<template>
  <div class="option-product-buy-item" :class="{buygroup:true}" style="bottom:0">
    <div class="option-product-price">
      <p class="option-product-discount" v-if="isSaleExec && price && price.additionDiscountAmt > 0">社員割引価格</p>
      <div class="bx_price">
        <p>
          <span class="sale" v-if="discountRate">{{ discountRate }}% OFF</span>
          <span class="number" v-if="salePrice !== 'NaN'"><i class="uom-18">￥</i>{{ salePrice }}</span>
          <span class="includes_tax" v-if="!discountRate">(税込)</span>
        </p>
        <p class="standard_price none_opacity" v-if="discountRate">
          <span class="none_opacity" v-if="originalPrice !== 'NaN'">{{ originalPrice }}</span>
          <span class="includes_tax" v-if="discountRate">(税込)</span>
        </p>
      </div>
    </div>
    <ul class="option-product-operation no-padding">
      <li><button class="btn like-btn" :class="{'like-btn-on':goods.liked}" @click="toggleLike" v-if="goods"></button></li>
      <li class="li-btn-width"> <button class="btn btn_green" :disabled="isDisable" @click="showBuyCover">
          <template v-if="isDisable">
            {{ disableMessage }}
          </template>
          <template v-else>
            購入する
          </template>
        </button>
      </li>
    </ul>
    <transition name="option-product-block">
      <div class="option-product-block" v-if="openOption" @click.self="hideCover">
        <div class="option-product-select-block" ref="optionLayer">
          <div class="package-area">
            <div class="package-ico">
              <a class="gray-word" @click.prevent="addPackage">プレゼントの包装が必要ですか。</a>
            </div>
          </div>
          <template v-if="!selectViewOption && options && options.selectedOptions && options.selectedOptions.length > 0">
            <div class="option-select-item">
              <spinner v-model="options.selectedOptions[0].orderCnt" :max="options.selectedOptions[0].stockCnt-1" size="normal" :min="1" />
            </div>
          </template>

          <template v-else>
            <template v-if="options && options.type && options.type === 'STANDARD'">
            <div class="option-select-item" >
              <div class="bx_select size_m" >
                <buy-select ref="buySelect" v-model="optionSelector[0]" :isStandard="true" :label="displayOptions[0].label" :options="getOption(0)"  :style="{ height: '4rem' }" @input="onChange(0)" @addHeight="addTheHeight" @checkStatus="checkOptionSelect" />
              </div>
            </div>
            </template>
            <div class="option-select-item" v-for="(option, key) in displayOptions" :key="key" @click="hideTheOption(key)" v-else>
              <div class="bx_select size_m" :class="{'disabled': !optionSelector[key-1] && key > 0}">
                <buy-select ref="buySelect" v-model="optionSelector[key]" :label="option.label" :options="getOption(key)" :disabled="!optionSelector[key-1] && key > 0" :style="{ height: '4rem' }" @input="onChange(key)" @addHeight="addTheHeight" @checkStatus="checkOptionSelect" />
              </div>
            </div>
            <ul class="option-product-size-operation-list" v-if="options && options.selectedOptions">
              <li class="option-product-size-operation-item" v-for="(item, key) in options.selectedOptions" :key="key">
                <div class="option-size-price">
                  <p class="option-size-price-txt" v-if="item.viewValue">{{ item.viewValue.join(' / ') }}</p>
                  <p class="option-size-price-txt" v-else>{{ item.value.replace('|', ' / ') }}</p>
                  <span class="size-number"><i class="uom-12">￥</i>{{ (item.buyPrice * item.orderCnt).toLocaleString() }}</span>
                </div>
                <number-spinner v-model="item.orderCnt" :showDelet="true" :min="1" :max="item.stockCnt-1" @input="REFRESH({ index: key, orderCnt: item.orderCnt })" @Delet="DELETEOPTION({ index: key })" />
              </li>
            </ul>
          </template>
        </div>
        <div class="option-product-bottom-operation">
          <div class="option-product-all-price">
            <span class="option-price-txt">商品小計</span><span class="option-price-txt_cor">(税込)</span><span class="price-number"><i class="uom-28">￥</i>{{ totalPrice }}</span>
          </div>
          <ul class="option-product-operation">
            <li><button class="btn like-btn" :class="{'like-btn-on':goods.liked}" @click="toggleLike" v-if="goods"></button></li>
            <li class="cart-width" v-if="goods && goods.limitations.canAddToCart"><button class="btn" @click="addToCart"><i class="ico_add_cart">カート</i></button></li>
            <li class="cart-width"><button class="btn btn_green" @click="buy">購入する</button></li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import * as $ from 'jquery'
import NumberSpinner from '@/components/goods/NumberSpinner'
import Spinner from '@/components/goods/Spinner'
import BuySelect from '@/components/goods/select/BuySelect'
import { lock, unlock } from 'tua-body-scroll-lock'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
import { isLogin, loginAndBack, setOrderInfoInStorage } from '@/utils/utils'
import { Alert, Confirm } from '@/components/common/modal'

export default {
  name: 'GoodsBuy',
  components: {
    NumberSpinner,
    BuySelect,
    Spinner
  },
  props: ['goods'],
  data () {
    return {
      count: 1,
      openOption: false,
      optionSelector: [],
      defaultType: ['DEFAULT', 'MAPPING'],
      selectViewOption: false,
      hideOption: true,
      thePackageNo: this.$store.state.product.packageNum
    }
  },
  computed: {
    ...mapState('product', ['packageNum']),
    ...mapGetters('profile', ['isSaleExec']),
    ...mapGetters('product', ['displayOptions', 'optionInputsGetters', 'options']),
    packageNum () {
      return this.packageNum
    },
    price () {
      if (this.goods) {
        return this.goods.price
      } else {
        return ''
      }
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
      if (this.options && this.options.flatOptions.length > 0 && this.options.selectedOptions) {
        for (let option of this.options.selectedOptions) {
          price += option.buyPrice * (option.orderCnt || 0)
        }
      }

      return price.toLocaleString()
    },
    isDefault () {
      return this.defaultType.includes(this.options.type) || this.options.flatOptions.length === 1
    },
    reservationLeftDate () {
      return Math.ceil((new Date(this.goods.reservationData.reservationStartYmdt.replace(' ', 'T')) - new Date()) / (1000 * 3600 * 24))
    },
    // 예약 주문 기간 여부
    isPreOrderPeriod () {
      if (this.goods && this.goods.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(this.goods.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(this.goods.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    },
    // isPreOrderPeriod () {
    //   if (this.goods && this.goods.reservationData) {
    //     return includeNow(this.goods.reservationData.reservationStartYmdt, this.goods.reservationData.reservationEndYmdt)
    //   }
    //   return false
    // },
    isDisable () {
      return this.disableMessage !== null
    },
    disableMessage () {
      if (this.goods && this.goods.status) {
        if (this.goods.status.soldout) {
          return '品切れ'
        } else if (this.goods.status.saleStatusType === 'READY' && !this.isPreOrderPeriod) {
          return '即購入不可'
        } else if (this.goods.status.saleStatusType === 'STOP') {
          return '販売中止'
        } else if (this.goods.status.saleStatusType === 'PROHIBITION') {
          return '販売禁止'
        } else if (this.goods.status.saleStatusType === 'FINISHED') {
          return '販売終了'
        }
        return null
      } else {
        return ''
      }
    }
  },
  watch: {
    openOption (next) {
      this.$nextTick(() => {
        if (next) {
          if (!this.selectViewOption && (!this.options.selectedOptions || this.options.selectedOptions.length < 1)) {
            this.SELECTOPTION({
              ...this.options.flatOptions[0],
              orderCnt: 1
            })
          }
          lock(this.$refs.optionLayer)
        } else {
          unlock(this.$refs.optionLayer)
        }
      })
    }
  },
  methods: {
    ...mapActions('likeProducts', ['postLikeProducts']),
    ...mapActions('product', ['fetchProductOptions']),
    ...mapMutations('product', ['SELECTOPTION', 'REFRESH', 'DELETEOPTION', 'DELETEOPTIONS', 'CHANGELIKED']),
    checkOptionSelect (data) {
      this.beforValidate(data)
    },
    addTheHeight (data) {
      $('.option-product-select-block').css('height', $('.option-product-select-block').height() + data)
    },
    showBuyCover () {
      this.openOption = true
      $('body,html').css('overflow', 'hidden')
    },
    hideCover () {
      this.openOption = false
      $('body,html').css('overflow', '')
    },
    async addPackage () {
      this.openOption = false
      $('body,html').css('overflow', '')
      this.$nextTick(() => {
        this.$router.push(`/m/product/detail/${this.thePackageNo}/package`)
      })
    },
    hideTheOption (index) {
      if (this.displayOptions && this.displayOptions.length > 1) {
        if (index === 0 && this.$refs.buySelect[0].openSelect) {
          this.$refs.buySelect[1].hide = false
        } else {
          this.$refs.buySelect[1].hide = true
        }
      }
    },
    getOptionLabel (key) {
      let option = this.displayOptions[key]
      return (this.options.type !== 'MAPPING' && option['label']) ? option['label'] : 'オプションを選択してください。'
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
          returnStr += ' (' + (selected.addPrice > 0 ? '+' : '') + selected.addPrice.toLocaleString() + '￥)'
        }
      }
      return returnStr
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
    ...mapActions('cart', { _addToCart: 'addToCart' }),
    async addToCart () {
      const ret = await this.beforValidate()

      if (ret) {
        await this._addToCart({
          carts: this.makeProductItems()
        }).then((res) => {
          if (res) {
            Confirm({ message: 'カートに追加いたしました。カートを確認いたしますか?' }).then((res) => {
              if (res) {
                this.$router.push('/m/cart')
              } else {
                $('body,html').css('overflow', '')
              }
            })
          }
        })
        this.DELETEOPTIONS()
        this.openOption = false
        $('body,html').css('overflow', '')
      }
    },
    buy () {
      this.beforValidate().then((ret) => {
        if (ret) {
          if (loginAndBack(this.$router, this.$route)) {
            const products = this.makeProductItems()
            setOrderInfoInStorage(products, this.$route.fullPath)
            $('html').css('overflow', 'scroll')
            this.$store.dispatch('ordersheet/getSheetNo')
          }

          this.openOption = false
          $('body,html').css('overflow', '')
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

    async beforValidate (data) {
      if (data === undefined) {
        if (this.options.selectedOptions === undefined || this.options.selectedOptions.length === 0) {
          Alert({
            message: 'オプションを選択してください。'
          })
          return false
        }
        // 상품 구매자 작성형 미 입력 시
        if (this.options.enteredProductInputs.filter(i => i.inputValue !== '').length !== this.options.productInputs.length) {
          Alert({
            message: 'オプションを選択してください。'
          })
          return false
        }
      }
      await this.$store.dispatch('product/asyncProduct', this.goods.baseInfo.productNo)
      await this.$store.dispatch('product/asyncProductOptions', this.goods.baseInfo.productNo)

      if (!this.goods.status.display) {
        Alert({
          message: 'この商品は現在購入不可能です。'
        })
        return false
      }
      if (this.goods.status.saleStatusType === 'READY') {
        if (!this.isPreOrderPeriod) {
          console.log('end preorder date')
        }
      } else if (this.goods.status.saleStatusType !== 'ONSALE') {
        Alert({
          message: 'この商品は現在購入不可能です。'
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
                })
                return false
              }
              if (this.isPreOrderPeriod) {
                if (subitem.reservationStockCnt === 0) {
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
                    message: '選択したオプションの在庫が不足しています。数量を再確認してください。'
                  })
                } else if (this.options.type !== 'COMBINATION') { // DEFAULT, STANDARD
                  Alert({
                    message: '選択した在庫が不足しています。数量を再確認してください。'
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
        })
        return false
      }

      /** min buy check */
      if (this.goods && this.goods.limitations.minBuyCnt !== 0 && buyCnt < this.goods.limitations.minBuyCnt) {
        Alert({
          message: 'この商品は最低  ' + this.goods.limitations.minBuyCnt + '以上購入可能な商品です。 数量を再確認してください。'
        })
        return false
      }

      /** Time max Buy Cnt check */
      if (this.goods) {
        if ((this.goods.limitations.maxBuyTimeCnt !== 0 && buyCnt > this.goods.limitations.maxBuyTimeCnt) ||
          (this.goods.limitations.maxBuyPeriodCnt !== 0 && buyCnt > this.goods.limitations.maxBuyPeriodCnt) ||
          (this.goods.limitations.maxBuyPersonCnt !== 0 && buyCnt > this.goods.limitations.maxBuyPersonCnt)) {
          if (this.goods.limitations.maxBuyPersonCnt) {
            Alert({
              message: 'この商品はお一人様につき ' + this.goods.limitations.maxBuyPersonCnt + '点まで購入可能です。数量を再確認してください。'
            })
          } else if (this.goods.limitations.maxBuyDays) {
            Alert({
              message: 'この商品は' + this.goods.limitations.maxBuyDays + '日間で' + this.goods.limitations.maxBuyPeriodCnt + '点まで購入可能です。数量を再確認してください。'
            }).then(() => {
              return false
            })
          } else {
            let maxCnt = this.goods.limitations.maxBuyTimeCnt | this.goods.limitations.maxBuyPeriodCnt
            Alert({
              message: 'この商品は最大1回あたり' + maxCnt + '点まで購入可能です。数量を再確認してください。'
            })
          }
          return false
        }
      }
      return true
    },
    async toggleLike () {
      if (!isLogin()) {
        this.$router.push({
          path: '/m/member/login',
          query: {
            redirect: this.$route.path
          }
        })
      } else {
        try {
          await this.postLikeProducts([this.goods.baseInfo.productNo])
          this.CHANGELIKED()
        } catch (e) {
          console.log(e)
        }
      }
    },
    optionsInit (goodsNo) {
      this.fetchProductOptions(goodsNo).then(() => {
        this.selectViewOption = (this.options.flatOptions.length > 1)
        if (!this.selectViewOption) { // 다중옵션이나 선택지가 1개일뿐인경우 TODO 재고 연동때문에 임시적용이라함
          this.SELECTOPTION({
            ...this.options.flatOptions[0],
            orderCnt: 1
          })
        }
      })
    }
  },
  destroyed () {
    this.openOption = false
    $('body,html').css('overflow', '')
  },
  mounted () {
    this.optionsInit(this.$route.params.goodsNo)
  }
}
</script>

<style scoped>
.option-product-select-block {
  max-height: 50rem;
}
.buygroup {
  position: sticky !important;
  bottom: 0 !important;
  left: 0 !important;
}

.option-product-block-enter-active,
.option-product-block-leave-active {
  transition: all 0.3s;
}
.option-product-block-leave-to,
.option-product-block-enter {
  background: rgba(0, 0, 0, 0);
  opacity: 0;
}
.option-product-select-block {
  transition: all 0.3s;
}
.option-product-block-enter-active.option-product-select-block,
.option-product-block-leave-active .option-product-select-block {
  transition: all 0.3s;
}
.option-product-block-enter-active.option-product-select-block,
.option-product-block-enter .option-product-select-block {
  transform: translateY(100%);
}
</style>
