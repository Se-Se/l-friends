import { createNcpApiStore } from '@/api'
// import { clearRepeatNum } from '@/utils/StringUtils'
const apiStore = createNcpApiStore([
  {
    action: '_myCoupons',
    property: 'myCoupons',
    path: 'coupons',
    method: 'get'
  },
  {
    action: '_registerCoupon',
    property: 'registerCoupon',
    path: 'coupons/register-code/{promotionCode}',
    pathParams: ['promotionCode'],
    method: 'post'
  }
])
export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    myCoupons ({ state, commit, dispatch, rootGetters }) {
      // if (!rootGetters.isLogined) {
      //   return
      // }
      return dispatch('_myCoupons', { params: { usable: true, hasTotalCount: true, pageNumber: 1, pageSize: 300 } })
    },
    registerCoupon ({ state, dispatch, commit, rootState }, promotionCode) {
      return dispatch('_registerCoupon', { data: { aa: '' }, params: { promotionCode } })
    }
  },
  getters: {
    getMyCoupons (state, getters) {
      if (state.myCoupons) {
        const myitem = {}
        const unUseCoupon = []
        state.myCoupons.items.forEach(item => {
          myitem[item.couponNo] = item
        })
        for (let item in myitem) {
          unUseCoupon.push(myitem[item])
        }
        unUseCoupon.sort(
          (obj1, obj2) => {
            let val1 = new Date(obj1.useEndYmdt).valueOf()
            let val2 = new Date(obj2.useEndYmdt).valueOf()
            return val1 - val2
          }
        )

        let usedCoupon = Array.of()
        let testCouponLen = unUseCoupon.length

        for (let k = 0; k < testCouponLen; k++) {
          if (unUseCoupon[k].used === true) {
            usedCoupon.push(unUseCoupon[k])
            unUseCoupon.splice(k, 1)
            k--
            testCouponLen--
          }
        }
        usedCoupon.sort(
          (obj1, obj2) => {
            let val1, val2
            if (obj1.useYmdt === null) {
              val1 = new Date(obj1.useEndYmdt).valueOf()
            } else {
              val1 = new Date(obj1.useYmdt).valueOf()
            }

            if (obj2.useYmdt === null) {
              val2 = new Date(obj2.useEndYmdt).valueOf()
            } else {
              val2 = new Date(obj2.useYmdt).valueOf()
            }
            return val2 - val1
          }
        )
        state.usedCoupon = usedCoupon
        state.unUseCoupon = unUseCoupon
        console.log(state)

        return state
      }
    }
  }
}
