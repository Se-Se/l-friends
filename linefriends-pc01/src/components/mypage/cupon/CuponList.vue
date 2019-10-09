<template>
  <!-- ↓↓↓↓↓ coupon_detail_area ↓↓↓↓↓ -->
  <div v-if="cuponTab && cuponList && totalCount > 0" class="coupon_detail_area common_table_area" :class="cuponTab==='2' ? 'useup_table_area' : 'available_table_area'">
    <table>
      <colgroup>
        <col style="width:422px;">
        <col style="width:190px;">
        <col style="width:190px;">
        <col style="width:190px;">
        <col style="width:188px;">
      </colgroup>

      <thead>
        <th>クーポン名</th>
        <th>内容</th>
        <th>条件</th>
        <th>有効期限</th>
        <th>クーポンの種類</th>
      </thead>
      <tbody v-if="cuponList && totalCount > 0">
        <tr v-for="(item,index) in cuponList" :key="index">
          <td class="coupon_name">{{ item.couponName }}</td>
          <template v-if="item.discountAmt">
            <td class="red_txt wm">￥<span class="money_number">{{item.discountAmt | formatCurrency}}</span></td>
          </template>
          <template v-if="item.discountRate">
            <td class="red_txt wm">
              <span class="money_number">{{item.discountRate}}%</span> 割引<br>
              (最大 ￥<span class="money_number">{{item.maxDiscountAmt | formatCurrency}}</span>)
            </td>
          </template>
          <template v-if="(item.couponType === 'PRODUCT' || item.couponType === 'PRODUCT_PLUS')">
            <td>
              <template v-if="item.minSalePrice">
                ￥<span class="money_number wm">{{item.minSalePrice | formatCurrency}}</span> 円以上
              </template>
              <template v-if="item.minSalePrice && item.maxSalePrice">
                <br>~
              </template>
              <template v-if="item.maxSalePrice">
                ￥<span class="money_number wm">{{item.maxSalePrice | formatCurrency}}</span> 円以下
              </template>
            </td>
          </template>
          <template v-if="(item.couponType === 'CART' || item.couponType === 'CART_DELIVERY')">
            <td>
              <br v-if="!item.freeDelivery" /> カート内金額
              <template v-if="item.minSalePrice">
                ￥<span class="money_number wm">{{item.minSalePrice | formatCurrency}}</span> 円以上
              </template>
              <template v-if="item.minSalePrice && item.maxSalePrice">
                <br>~
              </template>
              <template v-if="item.maxSalePrice">
                ￥<span class="money_number wm">{{item.maxSalePrice | formatCurrency}}</span> 円以下
              </template>
              <template v-if="(item.minSalePrice && item.minDeliveryAmt) || (item.maxSalePrice && item.minDeliveryAmt)">
                /
              </template>
              <template v-if="item.minDeliveryAmt">
                送料 {{item.minDeliveryAmt | formatCurrency}} 円以上
              </template>
            </td>
          </template>
          <td>
            <template v-if="item.used">
              {{item.useYmdt | dateFormatStr('yyyy-MM-dd hh:mm')}}
              <template v-if="cuponTab==='2'">
                <br><span class="useup_sit">使用済み</span>
              </template>
            </template>
            <template v-else>
              {{item.useEndYmdt | dateFormatStr('yyyy-MM-dd hh:mm')}}
              <template v-if="cuponTab==='2'">
                <br><span class="expired_sit">期限切れ</span>
              </template>
            </template>
          </td>
          <td class="coupon_type">
            <span v-if="item.couponType === 'PRODUCT'">商品クーポン</span>
            <span v-else-if="item.couponType === 'PRODUCT_PLUS'">商品プラスクーポン</span>
            <span v-else-if="item.couponType === 'CART'">カートクーポン</span>
          </td>
        </tr>
      </tbody>

    </table>

    <!-- PageSlide -->
    <pagination v-model="page" :total="totalCount" :limit="currentPageSize" :size="10" @input="onMovePage" />
    <!-- PageSlide -->
  </div>
  <!-- ↑↑↑↑↑ coupon_detail_area ↑↑↑↑↑ -->

  <div v-else-if="!pending.cuponList && cuponTab !== '2'" class="coupon_detail_area coupon_none_area">
    <img class="img-none-sally" alt="" src="@/assets/img/mypage/none-sally.png">
    <div class="none_explain">使用可能なクーポンはありません。</div>
  </div>
  <div v-else-if="!pending.cuponList && cuponTab === '2'" class="coupon_detail_area common_table_area useup_table_area">
    <div class="coupon_none_area mb-247">
      <img class="img-none-sally" alt="" src="@/assets/img/mypage/none-sally.png">
      <div class="none_explain">使用済み/期間切れのクーポンはありません。</div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Pagination from '@/components/common/Pagination'

export default {
  data () {
    return {
      page: this.currentPage
    }
  },
  props: ['cuponTab'],
  components: {
    Pagination
  },
  computed: {
    ...mapState('mypage', ['cuponList', 'totalCount', 'currentPage', 'currentPageSize', 'pending'])
  },
  methods: {
    ...mapActions('mypage', ['fetchPage', 'setCurrentPageNo']),
    onMovePage () {
      this.setCurrentPageNo(this.page)
      this.fetchPage(this.page)
    }
  }
}
</script>
