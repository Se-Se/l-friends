<template>
  <div id="container" class="detail">
    <div class="detail_popup_wrap">
      <sub-product-header :showClose="true" :title="'ギフトラッピング袋(S,M,L)'" @close="handleClose" />
      <div class="detail_popup_package">
        <div class="package_product">
          <div class="product_img" v-if="product && product.baseInfo && product.baseInfo.imageUrls"><img :src="product.baseInfo.imageUrls[0]" alt=""></div>
          <p class="product_info" v-if="product && product.deliveryFee">送料 : {{product.deliveryFee.defaultDeliveryConditionLabel}}</p>
          <p class="product_notices">※ 袋のご購入となり、ラッピング・包装サービスはお受けいたしておりません。予めご了承ください。</p>
          <!-- <div class="product_select"> -->
          <template v-if="!selectViewOption && options && options.selectedOptions && options.selectedOptions.length > 0">
            <div class="option-select-item">
              <spinner v-model="options.selectedOptions[0].orderCnt" :max="options.selectedOptions[0].stockCnt-1" size="normal" :min="1" />
            </div>
          </template>

          <template v-else>
            <div class="product_select" v-for="(option, key) in displayOptions" :key="key" @click="hideTheOption(key)">
              <div class="select_normal" :class="{'disabled': !optionSelector[key-1] && key > 0}">
                <package-select ref="buySelect" v-model="optionSelector[key]" :label="option.label" :value="option.value" :options="getOption(key)" :disabled="!optionSelector[key-1] && key > 0" @input="onChange(key)" @checkStatus="checkOptionSelect" />
                <span class="ico_arrow">リストを開く</span>
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

        <div class="package_active">
          <div class="package_active_price">
            <p class="price_move"><a href="#" @click.prevent="moveToProduct">商品相場に移動</a></p>
            <p><span class="price-number"><i>￥</i>{{ totalPrice }}</span><span class="price-tax">(税込)</span></p>
          </div>
          <div class="package_active_cart" v-if="product && product.limitations.canAddToCart">
            <button class="btn btn_green" @click="addToCart">カートに入れる</button>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import SubProductHeader from '@/components/header/SubProductHeader'
import * as $ from 'jquery'
import NumberSpinner from '@/components/goods/NumberSpinner'
import Spinner from '@/components/goods/Spinner'
import PackageSelect from '@/components/goods/select/PackageSelect'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { Alert } from '@/components/common/modal'
// import { includeNow } from '@/utils/dateUtils'
export default {
  name: 'Package',
  components: {
    NumberSpinner,
    PackageSelect,
    SubProductHeader,
    Spinner
  },
  data () {
    return {
      count: 1,
      optionSelector: [],
      defaultType: ['DEFAULT', 'MAPPING'],
      selectViewOption: false,
      hideOption: true,
      packageNum: 0
    }
  },
  computed: {
    ...mapGetters('product', ['displayOptions', 'optionInputsGetters', 'options', 'product']),
    price () {
      if (this.product) {
        return this.product.price
      } else {
        return ''
      }
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
      if (this.product && this.product.status) {
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
        }
      })
    }
  },
  methods: {
    ...mapActions('product', ['fetchProductOptions']),
    ...mapMutations('product', ['SELECTOPTION', 'REFRESH', 'DELETEOPTION', 'DELETEOPTIONS']),
    checkOptionSelect (data) {
      this.beforValidate(data)
    },
    moveToProduct () {
      this.packageNum = this.$store.state.product.packageNum
      $('html,body').css('overflow', '')
      this.$router.push(`/m/product/detail/${this.packageNum}`)
    },
    handleClose () {
      $('html,body').css('overflow', '')
      this.$router.go(-1)
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
          returnStr += ' (' + (selected.addPrice > 0 ? '+' : '') + selected.addPrice.toLocaleString() + '円)'
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
    },
    ...mapActions('cart', { _addToCart: 'addToCart' }),
    async addToCart () {
      const ret = await this.beforValidate()

      if (ret) {
        await this._addToCart({
          carts: this.makeProductItems()
        }).then((res) => {
          if (res) {
            Alert({
              message: '商品をカートに追加しました!'
            })
          }
        })
        this.DELETEOPTIONS()
      }
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
                    // title: '商品',
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
        } else if (this.goods.limitations.maxBuyDays) {
          Alert({
            message: 'この商品は' + this.goods.limitations.maxBuyDays + '日間で' + this.goods.limitations.maxBuyPeriodCnt + '点まで購入可能です。数量を再確認してください。'
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
  mounted () {
    this.optionsInit(this.$route.params.goodsNo)
  }
}
</script>

<style scoped>
.option-product-size-operation-list {
  margin-top: 1.6rem;
}
</style>
