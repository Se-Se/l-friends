<template>
  <div class="goods-buy">
    <div class="goods-price__wrapper">
      <span v-if="isSaleExec && price && price.additionDiscountAmt > 0" class="executives__label">임직원 할인가</span>
      <p class="goods-price">
        <span v-if="discountRate" class="sale-value number semibold">{{ discountRate }}%</span>
        <span class="product-price"><span class="number semibold">{{ salePrice }}</span>{{ $t('currency') }}</span>
        <br v-if="discountRate">
        <span v-if="discountRate" class="sale-price number">{{ originalPrice }}</span>
      </p>
    </div>
    <app-button class="goods-buy__button" type="success" :disable="isDisable" @click="openOption = true" bold>
      <template v-if="isDisable">
        {{ disableMessage }}
      </template>
      <template v-else>
        {{ $t('goods.detail.header.doBuy') }}
      </template>
    </app-button>

    <transition name="goods-option">
      <div v-if="openOption" class="goods-option" @click.self="openOption = false">
        <div class="goods-option__box">
          <div v-if="!selectViewOption && options.selectedOptions && options.selectedOptions.length > 0" class="goods-option__quantity">
            <number-spinner v-model="options.selectedOptions[0].orderCnt" size="normal" :min="1" full />
          </div>
          <div class="goods-option__wrapper" v-else>
            <div class="goods-option__selector">
              <app-select v-for="(option, key) in displayOptions" :key="key" v-model="optionSelector[key]" :label="option.label" :options="getOption(key)" :disabled="!optionSelector[key-1] && key > 0" :style="{ height: '4rem' }" size="small" @input="onChange(key)" />
            </div>
            <div v-show="options.selectedOptions" ref="goodsOptions" class="goods-option__selected">
              <div v-for="(item, key) in options.selectedOptions" :key="key" class="goods-option__item">
                <dl class="goods-option-info">
                  <dt class="goods-option-name" v-if="item.viewValue">{{ item.viewValue.join(' / ') }}</dt>
                  <dt class="goods-option-name" v-else>{{ item.value.replace('|', ' / ') }}</dt>
                  <dd class="goods-option-price">{{ item.buyPrice * item.orderCnt | formatCurrency }}<span class="currency"> {{ $t('currency') }}</span></dd>
                </dl>
                <number-spinner v-model="item.orderCnt" class="goods-option-count" :min="1" :max="item.stockCnt" @input="REFRESH({ index: key, orderCnt: item.orderCnt })" />
                <a href="#" class="goods-option-close" @click.prevent="DELETEOPTION({ index: key })">
                  삭제
                </a>
              </div>
            </div>
          </div>
          <div class="goods-option__price">
            총 상품금액 <span class="price">{{ totalPrice }}</span><span class="currency">{{ $t('currency') }}</span>
          </div>
          <div class="goods-option__btns">
            <app-button v-if="goods.limitations.canAddToCart" type="secondary" @click="addToCart">
              {{ $t('goods.detail.header.cart') }}
            </app-button>
            <app-button type="success" @click="buy" bold>
              {{ $t('goods.detail.header.buy') }}
            </app-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import * as $ from 'jquery'
import AppButton from '@/components/mobile/common/button/Button'
import NumberSpinner from '@/components/mobile/common/NumberSpinner'
import AppSelect from '@/components/mobile/common/input/Select'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { setOrderInfoInStorage } from '@/utils/orderUtils'
import { Alert } from '@/utils/event-bus.js'
import { gaEventAddtoCart } from '@/utils/gaEventUtils'
export default {
  name: 'GoodsBuy',
  components: {
    AppButton,
    NumberSpinner,
    AppSelect
  },
  props: {
    goods: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      count: 1,
      openOption: false,
      optionSelector: [],
      defaultType: ['DEFAULT', 'MAPPING'],
      selectViewOption: false
    }
  },
  computed: {
    ...mapGetters('profile', ['isSaleExec']),
    ...mapGetters('product', ['displayOptions', 'optionInputsGetters', 'options']),
    price () {
      return this.goods.price
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
      let salePrice = this.price.salePrice - this.discountAmt
      let price = 0
      if (this.options.flatOptions.length > 0 && this.options.selectedOptions) {
        for (let option of this.options.selectedOptions) {
          let calprice = 0
          if (this.options.type === 'MAPPING') {
            // let optionSalePrice = (option.buyPrice) - ((option.buyPrice * this.discountRate) / 100)
            let optionSalePrice = option.buyPrice
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
    isDisable () {
      return this.disableMessage !== null
    },
    disableMessage () {
      if (this.goods.status.soldout) {
        return this.$t('goods.detail.header.soldOut')
      }
      if (this.goods.status.saleStatusType === 'READY' && !this.isPreOrderPeriod) {
        return this.$t('goods.detail.header.buyDisable')
      }
      if (this.goods.status.saleStatusType === 'STOP') {
        return this.$t('goods.detail.header.saleStop')
      }
      if (this.goods.status.saleStatusType === 'PROHIBITION') {
        return this.$t('goods.detail.header.saleProhibition')
      }
      if (this.goods.status.saleStatusType === 'FINISHED') {
        return this.$t('goods.detail.header.saleEnd')
      }
      return null
    }
  },
  watch: {
    openOption (next) {
      this.$nextTick(() => {
        const goodsOptionsElem = this.$refs.goodsOptions
        const $elem = $('html, body')
        if (next) {
          if (!this.selectViewOption && (!this.options.selectedOptions || this.options.selectedOptions.length < 1)) {
            this.SELECTOPTION({
              ...this.options.flatOptions[0],
              orderCnt: 1
            })
          }

          disablePageScroll(goodsOptionsElem)
          $elem.css({ overflow: '' }) // hidden
        } else {
          enablePageScroll(goodsOptionsElem)
          $elem.css({ overflow: '' })
        }
      })
    }
  },
  methods: {
    ...mapMutations('product', ['SELECTOPTION', 'REFRESH', 'DELETEOPTION', 'DELETEOPTIONS']),
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
          returnStr += ' (' + (selected.addPrice > 0 ? '+' : '') + selected.addPrice.toLocaleString() + '원)'
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
    async addToCart () {
      const ret = await this.beforValidate()

      if (ret) {
        let product = this.makeProductItems()
        await this._addToCart({
          carts: product
        })
        /** gtag.js */
        gaEventAddtoCart(this.goods, product[0].orderCnt)
        this.DELETEOPTIONS()
        this.openOption = false
        Alert({
          title: '상품',
          message: '상품이 장바구니에 담겼습니다!'
        })
      }
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

          this.openOption = false
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
          title: '상품',
          message: '옵션을 선택해주세요.'
        })
        return false
      }
      // 상품 구매자 작성형 미 입력 시
      if (this.options.enteredProductInputs.filter(i => i.inputValue !== '').length !== this.options.productInputs.length) {
        Alert({
          title: '상품',
          message: '옵션값을 입력해주세요.'
        })
        return false
      }
      await this.$store.dispatch('product/asyncProduct', this.goods.baseInfo.productNo)
      await this.$store.dispatch('product/asyncProductOptions', this.goods.baseInfo.productNo)
      if (!this.goods.status.display) {
        Alert({
          title: '상품',
          message: '이 상품은 현재 구매가 불가능합니다.'
        })
        return false
      }
      if (this.goods.status.saleStatusType === 'READY') {
        if (!this.isPreOrderPeriod) {
          console.log('end preorder date')
        }
      } else if (this.goods.status.saleStatusType !== 'ONSALE') {
        Alert({
          title: '상품',
          message: '이 상품은 현재 구매가 불가능합니다.'
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
                  title: '상품',
                  message: '상품가격이 변경 되었습니다. 다시 확인하시고 구매 해 주세요.'
                })
                return false
              }
              if (this.isPreOrderPeriod) {
                if (subitem.reservationStockCnt === 0) {
                  checkflg = false
                  Alert({
                    title: '상품',
                    message: '선택한 옵션은 현재 재고가 없습니다.'
                  })
                  return false
                }
              } else if (subitem.stockCnt === 0) {
                checkflg = false
                Alert({
                  title: '상품',
                  message: '선택한 옵션은 현재 재고가 없습니다.'
                })
                return false
              }
              if (Number(item.orderCnt) > (this.isPreOrderPeriod ? subitem.reservationStockCnt : subitem.stockCnt)) {
                checkflg = false

                if (this.options.type === 'COMBINATION') {
                  Alert({
                    title: '상품',
                    message: '선택하신 옵션의 재고가 부족합니다. 수량을 다시 확인해 주세요.'
                  })
                } else if (this.options.type !== 'COMBINATION') { // DEFAULT, STANDARD
                  Alert({
                    title: '상품',
                    message: '상품의 재고가 부족합니다. 수량을 다시 확인해 주세요.'
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
          title: '상품',
          message: '이 상품은 최소 1개이상 구매 가능한 상품입니다. 수량을 다시 확인해 주세요.'
        })
        return false
      }

      /** min buy check */
      if (this.goods.limitations.minBuyCnt !== 0 && buyCnt < this.goods.limitations.minBuyCnt) {
        Alert({
          title: '상품',
          message: '이 상품은 최소 ' + this.goods.limitations.minBuyCnt + '개이상 구매 가능한 상품입니다. 수량을 다시 확인해 주세요.'
        })
        return false
      }

      /** Time max Buy Cnt check */
      if ((this.goods.limitations.maxBuyTimeCnt !== 0 && buyCnt > this.goods.limitations.maxBuyTimeCnt) ||
        (this.goods.limitations.maxBuyPeriodCnt !== 0 && buyCnt > this.goods.limitations.maxBuyPeriodCnt) ||
        (this.goods.limitations.maxBuyPersonCnt !== 0 && buyCnt > this.goods.limitations.maxBuyPersonCnt)) {
        if (this.goods.limitations.maxBuyPersonCnt) {
          Alert({
            title: '상품',
            message: '이 상품은 1인당 최대 ' + this.goods.limitations.maxBuyPersonCnt + '개 구매 가능한 상품입니다. 수량을 다시 확인해 주세요.'
          })
        } else {
          let maxCnt = this.goods.limitations.maxBuyTimeCnt | this.goods.limitations.maxBuyPeriodCnt
          Alert({
            title: '상품',
            message: '이 상품은 최대 ' + maxCnt + '개 구매 가능한 상품입니다. 수량을 다시 확인해 주세요.'
          })
        }
        return false
      }

      // const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
      // let memberOnly = false
      // if (this.goods.limitations.memberOnly ||
      //   this.goods.limitations.maxBuyPersonCnt !== 0 ||
      //   this.goods.limitations.maxBuyDays !== 0 ||
      //   this.goods.limitations.maxBuyPeriodCnt !== 0) {
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
    }
  },
  mounted () {
    let multiLengths = this.options.multiLevelOptions.length
    this.selectViewOption = (multiLengths > 1)
    if (!this.selectViewOption) { // 다중옵션이나 선택지가 1개일뿐인경우 TODO 재고 연동때문에 임시적용이라함
      this.SELECTOPTION({
        ...this.options.flatOptions[0],
        orderCnt: 1
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-buy {
  position: sticky;
  z-index: 9;
  bottom: -0.2rem;
  left: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0.8rem;
  padding-left: 2rem;
  width: 100%;
  height: 6.9rem;
  border-top: 1px solid #ddd;
  background: #fff;

  &__button {
    width: 14rem;
  }
}

.executives__label {
  font-family: "Noto Sans KR";
  font-size: 1.2rem;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.01rem;
  color: #333;
  margin-bottom: 0.2rem;
}

.goods-price {
  font-size: 0;

  &__wrapper {
    flex: 1 1 auto;
  }

  .product-price {
    margin-right: 0.6rem;
    font-size: 1.4rem;
    font-family: "Noto Sans KR";
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;

    .number {
      font-family: "Volte", sans-serif;
      font-size: 2.2rem;
      margin-right: 0.1rem;
    }
  }

  .sale-value {
    font-family: "Volte", sans-serif;
    font-size: 2.2rem;
    color: #ff414e;
    margin-right: 0.7rem;
  }

  .sale-price {
    font-family: "Volte", sans-serif;
    opacity: 0.3;
    font-size: 1.4rem;
    color: #333;
    letter-spacing: -0.01rem;
    text-decoration: line-through;
  }
}

.goods-option {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);

  &-enter-active,
  &-leave-active {
    transition: all 0.3s;

    .goods-option__box {
      transition: all 0.3s;
    }
  }

  &-leave-to,
  &-enter {
    background: rgba(0, 0, 0, 0);

    .goods-option__box {
      transform: translateY(100%);
    }
  }

  &__price {
    border-top: 1px solid #ddd;
    padding: 2rem 2rem 1.833rem;

    text-align: right;
    font-family: "Noto Sans KR";
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #333;

    .price {
      font-size: 3.2rem;
      font-weight: 600;
      font-family: "Volte", sans-serif;
      line-height: normal;
      margin: 0 0.266rem 0 1.633rem;
    }

    .currency {
      font-size: 2rem;
    }
  }

  &__btns {
    display: flex;
    padding: 0 0.8rem 0.8rem;

    > :not(:last-child) {
      margin-right: 0.7rem;
    }

    > * {
      flex: 1;
    }
  }

  &__box {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
  }

  &__quantity,
  &__selector {
    padding: 1.2rem 0.8rem;
  }

  &__selected {
    overflow: scroll;
    max-height: 14.4rem;
  }

  &__selector {
    > *:not(:last-child) {
      margin-bottom: 0.8rem;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    margin: 0 2rem;
    height: 7.2rem;
    padding: 1.6rem 0;

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  }

  &-info {
    width: 18.3rem;
  }

  &-name {
    margin-bottom: 0.1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-family: "Noto Sans KR";
    font-size: 1.4rem;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &-price {
    font-family: Volte, sans-serif;
    font-size: 1.4rem;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;

    .currency {
      font-family: "Noto Sans KR";
      font-size: 1.2rem;
      font-weight: 500;
    }
  }

  &-count {
    margin-left: 2rem;
  }

  &-close {
    margin-left: 1.6rem;
    width: 2.4rem;
    height: 2.4rem;
    background: url(~@/assets/images/mobile/ic-close-circle.svg);
    background-size: 100% 100%;
    font-size: 0;
  }

  &__wrapper {
    max-height: 28rem;
    overflow: auto;
  }
}
</style>
