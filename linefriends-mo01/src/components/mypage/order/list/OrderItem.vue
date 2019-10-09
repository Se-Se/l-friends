<template>

  <!-- ↓↓↓↓↓ cart_wrapper ↓↓↓↓↓ -->
  <div class="cart_wrapper">
    <div class="cart_main cart_none_wrapper">
      <ul class="new_month_choose">
        <li><button :class="['btn size_s btn_radius',{'checked': selectedMonthTab === 1}]" @click="clickMonth(1)">1ヶ月</button></li>
        <li><button :class="['btn size_s btn_radius',{'checked': selectedMonthTab === 2}]" @click="clickMonth(2)">2ヶ月</button></li>
        <li><button :class="['btn size_s btn_radius',{'checked': selectedMonthTab === 3}]" @click="clickMonth(3)">3ヶ月</button></li>
        <li><button :class="['btn size_s btn_radius',{'checked': selectedMonthTab === 12}]" @click="clickMonth(12)">すべて</button></li>
      </ul>
      <div v-for="(order,index) in list" :key="index">
        <div class="head_ttl change-child_font_size">
          <p class="ttl ttl_order_new_size">注文番号 : {{order.orderNo}}</p>
          <span class="user_info">
            <p class="user_email">{{order.orderYmdt | dateFormatStr('yyyy-MM-dd') }}</p>
            <router-link class="date order_font_family_kr" :to="type ? `/m/mypage/orderdetail/${order.orderNo}?type=${type}` : `/m/mypage/orderdetail/${order.orderNo}`">詳細</router-link>
          </span>
          <p class="drawer open">
            <router-link :to="`/m/mypage/orderdetail/${order.orderNo}`"></router-link>
          </p>
        </div>
        <div class="product_item pt-0">
          <template v-for="(option, index) in order.orderOptions">
            <ProductItem :option="option" :order="order" :index="index" :key="index+'_'+option.optionNo  +'_'+ option.orderNo" :type="type"></ProductItem>
          </template>
        </div>
      </div>
      <div v-if="totalCount === 0" class="cart_none_info_wrap">
        <div class="f-0">
          <img class="sally-none-img" alt="" src="~@/assets/img/common/img_no_data.png" />
        </div>
        <p class="text" v-if="type === 'order'">注文・発送履歴がありません。<br>
          注文はこちらから</p>
        <p class="text" v-else>キャンセル/返品履歴がありません。</p>
        <div class="btn_wrap">
          <button class="btn btn_primary size_m" @click="goGood()">すべての商品</button>
        </div>
      </div>
      <div class="look_old_order" v-if="type === 'order'">
        <a href="">前の注文履歴を表示</a>
      </div>
      <div>
        <div class="exchange_guidance active" @click="showContent = !showContent">
          <div class="exchange_guidance_img">
            <img src="~@/assets/img/icon/icon_notes.png" alt="">
          </div>
          <p class="exchange_guidance_text">交換・返品について</p>
          <div class="exchange_guidance_bo">
          </div>
          <div class="active_text_new" style="display:block" v-if="showContent">
            <div class="exchange_guidance_long_text exchange_guidance_mg_0">交換・返品期間<br>商品到着から7日以内に交換・返品が可能です。(交換したい商品が品切れの場合は、払戻し処理を進めさせていただきます)
              ただし、表示内容と異なる商品や不良品が届いた場合など、契約内容と異なる場合は、商品到着から3ヶ月以内、もしくはその事実を認識した日から30日以内に交換・返品が可能です。
              <br><br>
              交換・返品の送料<br>交換・返品の送料：OOO円(返送料＋初回発送時の送料をお客様にご負担頂きます)<br>
              規格外の場合には追加送料が発生する場合がございます。商品の不備又は配送ミスによる返品の場合、返送料はLINE <br>FRIENDSが負担いたします。</div>
            <div class="exchange_search">
              <div class="exchange_search_img">
                <img src="~@/assets/img/icon/icon-order_search.png" alt="">
              </div>
              <p class="exchange_search_text">交換・返品についてより詳しく知りたいですか？</p>
              <div class="find_out_more">
                <a href="">詳細はこちら</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <mugen-scroll :handler="fetchMore" :should-handle="haveMore">
      <div id="loader" v-show="haveMore">
        <div class="loader_img"></div>
      </div>
    </mugen-scroll>
  </div>
  <!-- ↑↑↑↑↑ cart_wrapper ↑↑↑↑↑ -->
</template>
<script>
import { mapState } from 'vuex'
import { addMonth } from '@/utils/dateUtils'
import ProductItem from './ProductItem'
import MugenScroll from '@/components/common/MugenScroll'

export default {
  props: ['type'],
  data () {
    return {
      currentPage: 1,
      selectedMonthTab: 1,
      showContent: false
    }
  },
  components: {
    ProductItem,
    MugenScroll
  },
  computed: {
    ...mapState('orderList', ['list', 'totalCount', 'fetchListParams', 'pending']),
    haveMore () {
      if (!this.pending.list && this.list && this.list.length < this.totalCount) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    goGood () {
      this.$router.push('/m/goods')
    },
    clickMonth (num) {
      this.selectedMonthTab = num
      this.$store.dispatch('orderList/filterPeriod', { startYmd: addMonth(new Date(), -num) })
    },
    fetchMore () {
      this.$store.dispatch('orderList/fetchMore')
    }
  },
  mounted () {
    if (this.fetchListParams && this.fetchListParams.startYmd) {
      let tempDate2 = addMonth(new Date(), -2)
      let tempDate3 = addMonth(new Date(), -3)
      let tempDate12 = addMonth(new Date(), -12)
      if (tempDate2 === this.fetchListParams.startYmd) {
        this.selectedMonthTab = 2
      } else if (tempDate3 === this.fetchListParams.startYmd) {
        this.selectedMonthTab = 3
      } else if (tempDate12 === this.fetchListParams.startYmd) {
        this.selectedMonthTab = 12
      }
    }
  }
}
</script>
