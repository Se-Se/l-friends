<template>
  <!-- ↓↓↓↓↓ coupon_detail_area ↓↓↓↓↓ -->
  <div v-if="cuponTab && cuponList && totalCount > 0"
    class="coupon-detail-info-list"
    :class="cuponTab==='2' ? 'coupon-useup-list' : ''">
    <div class="coupon-detail-info-block" v-for="(item,index) in cuponList" :key="index">
      <dl class="coupon-info-item">
        <dt class="coupon-info-label">クーポン名</dt>
        <dd class="coupon-info-value coupon-name">{{ item.couponName }}</dd>
      </dl>
      <dl class="coupon-info-item">
        <dt class="coupon-info-label">内容</dt>
        <template v-if="item.discountAmt">
          <dd class="coupon-info-value coupon-style-txt_red">￥<span class="num">{{item.discountAmt | formatCurrency}}</span></dd>
        </template>
        <template v-if="item.discountRate">
          <dd class="coupon-info-value coupon-style-txt_red">
            <span class="num">{{item.discountRate}}</span>% 割引
            (最大 ￥<span class="num">{{item.maxDiscountAmt | formatCurrency}}</span>)</dd>
        </template>
      </dl>
      <dl class="coupon-info-item">
        <dt class="coupon-info-label">条件</dt>
        <template v-if="(item.couponType === 'PRODUCT' || item.couponType === 'PRODUCT_PLUS')">
          <dd class="coupon-info-value">
            <template v-if="item.minSalePrice">
              ￥<span class="num">{{item.minSalePrice | formatCurrency}}</span>円以上
            </template>
            <template v-if="item.minSalePrice && item.maxSalePrice">
              <br>~
            </template>
            <template v-if="item.maxSalePrice">
              ￥<span class="num">{{item.maxSalePrice | formatCurrency}}</span>円以下
            </template>
          </dd>
        </template>
        <template v-if="(item.couponType === 'CART' || item.couponType === 'CART_DELIVERY')">
          <dd class="coupon-info-value">
            カート内金額
            <template v-if="item.minSalePrice">
              ￥<span class="num">{{item.minSalePrice | formatCurrency}}</span>円以上
            </template>
            <template v-if="item.minSalePrice && item.maxSalePrice">
              <br>~
            </template>
            <template v-if="item.maxSalePrice">
              ￥<span class="num">{{item.maxSalePrice | formatCurrency}}</span>円以下
            </template>
            <template v-if="(item.minSalePrice && item.minDeliveryAmt) || (item.maxSalePrice && item.minDeliveryAmt)">
              /
            </template>
            <template v-if="item.minDeliveryAmt">
              送料 {{item.minDeliveryAmt | formatCurrency}} 円以上
            </template>
          </dd>
        </template>
      </dl>
      <dl class="coupon-info-item">
        <dt class="coupon-info-label">有効期限</dt>
        <dd class="coupon-info-value">
          <template v-if="item.used">
            {{item.useYmdt | dateFormatStr('yyyy-MM-dd hh:mm')}}
          </template>
          <template v-else>
            {{item.useEndYmdt | dateFormatStr('yyyy-MM-dd hh:mm')}}
          </template>
        </dd>
      </dl>
      <dl class="coupon-info-item" v-if="cuponTab==='2'">
        <dt class="coupon-info-label">使用状況</dt>
        <template v-if="item.used">
          <dd class="coupon-info-value useup-sit">使用済み</dd>
        </template>
        <template v-else>
          <dd class="coupon-info-value expired-sit">期限切れ</dd>
        </template>
      </dl>
      <dl class="coupon-info-item coupon-m-b_0">
        <dt class="coupon-info-label">クーポンの種類</dt>
        <dd class="coupon-info-value">
          <span v-if="item.couponType === 'PRODUCT'">商品クーポン</span>
          <span v-else-if="item.couponType === 'PRODUCT_PLUS'">商品プラスクーポン</span>
          <span v-else-if="item.couponType === 'CART'">カートクーポン</span>
        </dd>
      </dl>
    </div>
    <mugen-scroll :handler="pageDown" :should-handle="showMugen && !pending.cuponList" :offsetTop="-3000">
      <div id="loader" v-show="showMugen">
        <div class="loader_img"></div>
      </div>
    </mugen-scroll>
  </div>
  <div v-else-if="!pending.cuponList && cuponTab !== '2'" class="coupon-none-result-data">
    <img src="@/assets/img/common/img_no_data.png" alt="" class="none-result-data-img">
    <p class="coupon-none-data-txt">使用可能なクーポンはありません。</p>
  </div>
  <div v-else-if="!pending.cuponList && cuponTab === '2'" class="coupon-none-result-data">
    <img src="@/assets/img/common/img_no_data.png" alt="" class="none-result-data-img">
    <p class="coupon-none-data-txt">使用済み/期間切れのクーポンはありません。</p>
  </div>
  <!-- ↑↑↑↑↑ coupon_detail_area ↑↑↑↑↑ -->
</template>
<script>
import { mapState } from 'vuex'
import MugenScroll from '@/components/common/MugenScroll'

export default {
  data () {
    return {
      page: this.currentPage
    }
  },
  props: ['cuponTab'],
  components: {
    MugenScroll
  },
  computed: {
    ...mapState('mypage', ['cuponList', 'totalCount', 'pending']),
    showMugen () {
      return this.cuponList && this.cuponList.length < this.totalCount
    }
  },
  methods: {
    pageDown () {
      // console.log('pageDown')
      this.$store.dispatch('mypage/fetchCuponMore')
    }
  }
}
</script>
