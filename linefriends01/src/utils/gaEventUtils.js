window.dataLayer = window.dataLayer || []
function gtag () { window.dataLayer.push(arguments) }

export function gaEventViewItem (product) {
  gtag('event', 'view_item', {
    'items': [
      {
        'id': product.baseInfo.productNo,
        'name': product.baseInfo.productName,
        'brand': product.brand ? product.brand.nameEn : '',
        'category': product.categories && product.categories.length > 0 ? product.categories[0].fullCategoryLabel : '',
        'quantity': 1,
        'price': product.price.salePrice
      }
    ]
  })
}

export function gaEventAddtoCart (product, quantity) {
  gtag('event', 'add_to_cart', {
    'items': [
      {
        'id': product.baseInfo.productNo,
        'name': product.baseInfo.productName,
        'brand': product.brand ? product.brand.nameEn : '',
        'category': product.categories && product.categories.length > 0 ? product.categories[0].fullCategoryLabel : '',
        'quantity': quantity,
        'price': product.price.salePrice
      }
    ]
  })
}
export function gaEventViewPromotion (event) {
  gtag('event', 'view_promotion', {
    'promotions': [
      {
        'id': event.eventNo,
        'name': event.label
      }]
  })
}
export function gaEventPurchase (myOrder) {
  let items = []
  if (myOrder.orderOptionsGroupByPartner && myOrder.orderOptionsGroupByPartner.length > 0) {
    myOrder.orderOptionsGroupByPartner.forEach(p => {
      if (p.orderOptionsGroupByDelivery && p.orderOptionsGroupByDelivery.length > 0) {
        p.orderOptionsGroupByDelivery.forEach(d => {
          if (d.orderOptions && d.orderOptions.length > 0) {
            d.orderOptions.forEach(product => {
              items.push({
                'id': product.productNo,
                'name': product.productName,
                'brand': product.brandName ? product.brandName : '',
                'quantity': product.orderCnt,
                'price': product.price.salePrice
              })
            })
          }
        })
      }
    })
  }

  gtag('event', 'purchase', {
    'transaction_id': myOrder.orderNo,
    'affiliation': 'store.linefriends.co.kr',
    'value': myOrder.firstOrderAmount.standardAmt,
    'currency': 'KRW',
    'shipping': myOrder.firstOrderAmount.deliveryAmt,
    'items': items
  })
}

export function gaEventSearch (searchWord) {
  gtag('event', 'search', {
    'search_term': searchWord
  })
}
