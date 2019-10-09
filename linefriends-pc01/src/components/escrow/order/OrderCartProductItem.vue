<template>
    <tr>
        <td>
            <router-link :to="`/product/detail/${option.productNo}`" class="item_info" target="_blank">
                          <span class="bx_thumb">
                            <img :src="option.imageUrl" alt="商品画像">
                          </span>
                <div class="bx_info">
                    <dl class="badge_area" v-if="option.reservation === true">
                        <dt><span class="badge badge_reserved">予約商品</span></dt>
                        <dd>{{option.reservationDeliveryYmdt.substring(0, 10)}}日から順次発送</dd>
                    </dl>
                    <span class="name">{{(option.showProductName)}}</span>
                    <span class="option opt_pd_0">
                        <div v-for="(showOption, index) in option.showOptions" :key='index'>
                              <span class="bar" v-if="index != 0">/</span> {{showOption}}
                        </div>
                          <!--<template v-for="(showOption, index) in option.showOptions" :key='index'>-->
                              <!--<span class="bar" v-if="index != 0">/</span> {{showOption}}-->
                          <!--</template>-->
                          <template v-if="option.showAddPrice">
                             {{option.showAddPrice}}
                          </template>
                        </span>
                </div>
            </router-link>
        </td>
        <td>
            <span class="num">{{option.orderCnt}}</span></td>
        <td>
            <!--<span class="num tax_txt have_cut_price"><i class="uom2">￥</i>{{option.showPrice}}</span>-->
            <span class="num tax_txt have_cut_price" v-if="option.showDiscountAmt !== 0"><i class="uom2">￥</i>{{option.showStandardAmt}}</span>
            <span class="num after_cut_price"><i class="uom2">￥</i>{{option.showPrice}}</span>
            <!--<div class="tip">-->
                <!--&lt;!&ndash; 割引適用金額ガイドPOPUP &ndash;&gt;-->
                <!--<div class="tip_popup size_1">-->
                    <!--<dl>-->
                        <!--<dt>商品価格</dt>-->
                        <!--<dd><i class="uom2">￥</i><span class="num">{{option.showStandardAmt}}</span></dd>-->
                    <!--</dl>-->
                    <!--<dl>-->
                        <!--<dt>割引金額</dt>-->
                        <!--<dd><i class="uom2">￥</i><span class="num">{{option.showDiscountAmt == 0 ? option.showDiscountAmt : '- ' + option.showDiscountAmt}}</span></dd>-->
                    <!--</dl>-->
                    <!--<div class="total_pop">-->
                        <!--<dl>-->
                            <!--<dt>小計(税込)</dt>-->
                            <!--<dd><i class="uom2">￥</i><span class="num">{{option.showPrice}}</span></dd>-->
                        <!--</dl>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        </td>
        <template v-if="option.bundledFlg">
            <order-cart-fee v-if="option.bundledFirst" :rowspan="option.bundledSize" :option="option" class="merge"/>
        </template>
        <template v-else>
            <order-cart-fee :option="option" />
        </template>
    </tr>
</template>

<script>
import OrderCartFee from '@/components/escrow/order/OrderCartFee'

export default {
  props: ['option'],
  components: {
    OrderCartFee
  },
  beforeCreate () {
  }
}
</script>
