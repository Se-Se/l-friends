import { formatCurrency } from '@/utils/StringUtils'
import Vue from 'vue'

export function makeOrderProductOptionPrice (orderProductOption, deliveryGroup) {
  if (deliveryGroup) {
    let price = orderProductOption.price

    // 옵션 상품 주문금액
    orderProductOption.showPrice = formatCurrency(price.buyAmt)
    // 상품금액
    orderProductOption.showStandardAmt = formatCurrency(price.standardAmt)
    // 할인금액
    orderProductOption.showDiscountAmt = formatCurrency((price.immediateDiscountAmt + price.additionalDiscountAmt) * orderProductOption.orderCnt)
  } else {
    orderProductOption.showPrice = '구매불가'
  }
}

export function orderProductOptionShowPriceLoad (option) {
  let price = option.price
  // 상품금액
  let showStandardAmt = (price.salePrice + price.addPrice) * option.orderCnt
  // 할인금액
  let showDiscountAmt = (price.immediateDiscountAmt + price.additionalDiscountAmt) * option.orderCnt

  option.showStandardAmt = formatCurrency(showStandardAmt)
  option.showDiscountAmt = formatCurrency(showDiscountAmt)
  // 옵션 상품 주문금액
  option.showPrice = formatCurrency(showStandardAmt - showDiscountAmt)
  return option
}

export function makeOrderProductOptionDeliveryPrice (orderProduct, orderProductOption, productIdx, optionIdx, deliveryGroup) {
  orderProductOption.free = false
  orderProductOption.deliverable = orderProduct.deliverable
  if (deliveryGroup) {
    // 배송비
    if (orderProduct.deliverable) {
      if (deliveryGroup.deliveryAmt === 0) {
        orderProductOption.showShippingFee = '무료배송'
        orderProductOption.free = true
      } else {
        orderProductOption.showShippingFee = formatCurrency(deliveryGroup.deliveryAmt)
        if (deliveryGroup.deliveryPayType === DELIVERY_PAY_TYPE.PAY_ON_DELIVERY) {
          orderProductOption.deliveryPayType = DELIVERY_PAY_TYPE.PAY_ON_DELIVERY
        } else {
          orderProductOption.deliveryPayType = DELIVERY_PAY_TYPE.PREPAID_DELIVERY
        }
      }
      if (deliveryGroup.orderProducts.length > 1 || orderProduct.orderProductOptions.length > 1) {
        orderProductOption.bundledFlg = true
        let bundledSize = 0
        if (deliveryGroup.orderProducts.length > 1) {
          deliveryGroup.orderProducts.forEach((orderProduct) => {
            orderProduct.orderProductOptions.forEach((orderProductOption) => {
              bundledSize++
            })
          })
        } else {
          bundledSize = orderProduct.orderProductOptions.length
        }
        orderProductOption.bundledSize = bundledSize
      } else {
        orderProductOption.bundledFlg = false
      }
      if (productIdx === 0 && optionIdx === 0) {
        orderProductOption.bundledFirst = true
      } else {
        orderProductOption.bundledFirst = false
      }
    } else {
      orderProductOption.showShippingFee = '-'
    }
  } else {
    orderProductOption.showShippingFee = '-'
  }
}

export function makeOrderProductOptionName (orderProductOption, optionUsed, brandName, productName) {
  // orderProductOption
  Vue.set(orderProductOption, 'showBrandName', brandName ? `[${brandName}]` : '')
  Vue.set(orderProductOption, 'showProductName', productName)

  Vue.set(orderProductOption, 'returnSelected', false)

  // 옵션선택정보
  orderProductOption.showOptions = []
  orderProductOption.showAddPrice = ''
  orderProductOption.showOrderCnt = ''

  if (optionUsed) {
    if (orderProductOption.optionType !== 'PRODUCT_ONLY') {
      const optionNames = orderProductOption.optionName.split('|')
      const optionValues = orderProductOption.optionValue.split('|')
      optionNames.forEach((tempName, index) => {
        orderProductOption.showOptions.push(tempName + ':' + optionValues[index])
      })
    }
    // 구매자 작성형 옵션
    if (orderProductOption.optionInputs && orderProductOption.optionInputs.length > 0) {
      orderProductOption.optionInputs.forEach(optionInput => {
        orderProductOption.showOptions.push(optionInput.inputLabel + ':' + optionInput.inputValue)
      })
    } else if (orderProductOption.inputs && orderProductOption.inputs.length > 0) {
      orderProductOption.inputs.forEach(optionInput => {
        orderProductOption.showOptions.push(optionInput.inputLabel + ':' + optionInput.inputValue)
      })
    }
    // 옵션추가금액
    if (orderProductOption.price.addPrice !== 0) {
      let showAddPrice = orderProductOption.price.addPrice > 0 ? `(+${formatCurrency(orderProductOption.price.addPrice)}원)` : `(${formatCurrency(orderProductOption.price.addPrice)}원)`
      orderProductOption.showAddPrice = showAddPrice
    }

    if (orderProductOption.orderCnt !== 0) {
      orderProductOption.showOrderCnt = `/ ${orderProductOption.orderCnt}개`
    }
  } else {
    if (orderProductOption.orderCnt !== 0) {
      orderProductOption.showOrderCnt = `${orderProductOption.orderCnt}개`
    }
  }
}

export function makeOrderProductOptionInfo (orderProduct, orderProductOption, productIdx, optionIdx, deliveryGroup) {
  makeOrderProductOptionName(orderProductOption, orderProduct.optionUsed, orderProduct.brandName, orderProduct.productName)
  makeOrderProductOptionPrice(orderProductOption, deliveryGroup)
  makeOrderProductOptionDeliveryPrice(orderProduct, orderProductOption, productIdx, optionIdx, deliveryGroup)
}

export const DELIVERY_PAY_TYPE = {
  PAY_ON_DELIVERY: 'PAY_ON_DELIVERY',
  PREPAID_DELIVERY: 'PREPAID_DELIVERY'
}

export function deleteOrderInfoInStorage () {
  delete window.localStorage.orderInfo
}

export function setOrderInfoInStorage (products, fromUrl) {
  deleteOrderInfoInStorage()
  const orderInfo = {
    option: JSON.stringify(products),
    fromUrl: fromUrl
  }
  window.localStorage.orderInfo = JSON.stringify(orderInfo)
}

export function setPrevOrderInfoInStoreage (ordersheetno) {
  const temp = window.localStorage.preOrderInfos ? JSON.parse(window.localStorage.preOrderInfos) : []
  temp.push({ ordersheetno: ordersheetno, orderInfo: window.localStorage.orderInfo })
  window.localStorage.preOrderInfos = JSON.stringify(temp)
}

export function getPrevOrderInfoInStoreage (ordersheetno) {
  const temp = window.localStorage.preOrderInfos ? JSON.parse(window.localStorage.preOrderInfos) : []
  const orders = temp.filter((item) => item.ordersheetno === ordersheetno)
  if (orders.length > 0) {
    return orders[0].orderInfo
  }
}

export function deletePrevOrderInfoInStoreage (ordersheetno) {
  const temp = window.localStorage.preOrderInfos ? JSON.parse(window.localStorage.preOrderInfos) : []
  window.localStorage.preOrderInfos = JSON.stringify(temp.filter((item) => item.ordersheetno !== ordersheetno))
}

export function getCalculationRequest (allData) {
  const productCoupons = []
  allData.couponRequest.productCoupons.forEach(item => {
    if (item.couponIssueNo || item.plusCouponIssueNo) {
      const temp = {
        couponIssueNo: item.couponIssueNo,
        plusCouponIssueNo: item.plusCouponIssueNo,
        plusPromotionCode: item.plusPromotionCode,
        productNo: item.productNo,
        promotionCode: item.promotionCode
      }
      productCoupons.push(temp)
    }
  })
  const couponRequest = {
    cartCouponIssueNo: allData.couponRequest.cartCouponIssueNo,
    deliveryCouponIssueNo: allData.couponRequest.deliveryCouponIssueNo,
    promotionCode: allData.couponRequest.promotionCode
  }
  if (productCoupons.length) {
    couponRequest.productCoupons = productCoupons
  }
  const calculationRequest = {
    accumulationUseAmt: allData.accumulationUseAmt,
    addressRequest: allData.addressRequest,
    couponRequest
  }

  return calculationRequest
}
