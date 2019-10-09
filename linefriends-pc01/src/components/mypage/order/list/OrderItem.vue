<template>
  <!-- ↓↓↓↓↓ mypage-content ↓↓↓↓↓ -->
  <div class="mypage-content">
    <h1>{{type === 'order' ? '注文履歴' : 'キャンセル/返品'}}</h1>
    <div class="main">
      <div class="filter">
        <div class="date_filter">
          <div class="bx_date" v-click-outside="closeStateDialog">
            <div class="input_calendar" @click.prevent="openByDialog(calendarDataStart)">
              <input type="text" :value="calendarDataStart.value.join('.')">
              <div class="calendar_popup" v-if="calendarDataStart.show" :style="calendarDataStart.show ? 'display: block;' : ''">
                <calendar :range="calendarDataStart.range" :zero="calendarDataStart.zero" :lunar="calendarDataStart.lunar" :value="calendarDataStart.value" @select="calendarDataStart.select"></calendar>
              </div>
            </div>
          </div>
          <div class="line">-</div>
          <div class="bx_date" v-click-outside="closeEndDialog">
            <div class="input_calendar" @click.prevent="openByDialog(calendarDataEnd)">
              <input type="text" :value="calendarDataEnd.value.join('.')">
              <div class="calendar_popup" v-if="calendarDataEnd.show" :style="calendarDataEnd.show ? 'display: block;' : ''">
                <calendar :range="calendarDataEnd.range" :zero="calendarDataEnd.zero" :lunar="calendarDataEnd.lunar" :value="calendarDataEnd.value" @select="calendarDataEnd.select"></calendar>
              </div>
            </div>
          </div>
        </div>
        <ul class="month">
          <li :class="{'active': selectedMonthTab === 1}" @click="clickMonth(1)"><a>1ヶ月</a></li>
          <li :class="{'active': selectedMonthTab === 3}" @click="clickMonth(3)"><a>3ヶ月</a></li>
          <li :class="{'active': selectedMonthTab === 6}" @click="clickMonth(6)"><a>6ヶ月</a></li>
          <li :class="{'active': selectedMonthTab === 12}" @click="clickMonth(12)"><a>12ヶ月</a></li>
        </ul>
        <p class="inquire_btn"><button class="btn btn_green" @click="searchOrderList">照会する</button></p>
        <p class="reset_btn"><a href="javascript:" @click.prevent="clickMonth(1)">リセット</a></p>
        <p class="history_link" v-if="type === 'order'"><a href="#">前の注文履歴を表示</a></p>
      </div>
      <div v-if="list && list.length > 0" class="table_wrap">
        <table class="table_data myorder_table">
          <colgroup>
            <col style="width:216px;">
            <col style="width:384px;">
            <col style="width:140px;">
            <col style="width:140px;">
            <col style="width:170px;">
            <col style="width:140px;">
          </colgroup>
          <thead>
            <tr>
              <th>注文情報</th>
              <th>商品情報</th>
              <th>個数</th>
              <th>注文金額</th>
              <th>ステータス</th>
              <th>管理</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="order in list">
              <template v-for="(option, index) in order.orderOptions">
                <ProductItem :option="option" :order="order" :index="index" :key="index+'_'+option.optionNo  +'_'+ option.orderNo" @writeReview="writeReview" :type="type"></ProductItem>
              </template>
            </template>
          </tbody>
        </table>
        <pagination v-model="currentPage" :total="totalCount" :limit="5" type="list" @goPage="pageChange" />
      </div>
      <OrderListNoData v-if="totalCount === 0" :theType="type"></OrderListNoData>
      <div class="exchange_area">
        <h3>交換・返品について</h3>
        <dl>
          <dt>交換・返品期間</dt>
          <dd>商品到着から7日以内に交換・返品が可能です。(交換したい商品が品切れの場合は、払戻し処理を進めさせていただきます) </dd>
          <dd>ただし、表示内容と異なる商品や不良品が届いた場合など、契約内容と異なる場合は、商品到着から3ヶ月以内、もしくはその事実を認識した日から30日以内に交換・返品が可能です。</dd>
        </dl>
        <dl>
          <dt>交換・返品の送料</dt>
          <dd> -交換・返品の送料：600円(返送料＋初回発送時の送料をお客様にご負担頂きます)</dd>
          <dd> -規格外の場合には追加送料が発生する場合がございます。商品の不備又は配送ミスによる返品の場合、返送料はLINE FRIENDSが負担いたします。</dd>
        </dl>
        <p class="more_link">交換・返品についてより詳しく知りたいですか？<a href="#">詳細はこちら</a></p>
      </div>
    </div>
    <ReviewPop :isShow="reviewShow" :review="currentReview" @closePop="closeReviewPop" ref="reviewPop"></ReviewPop>
  </div>
  <!-- ↑↑↑↑↑ mypage-content ↑↑↑↑↑ -->
</template>
<script>
import { mapState } from 'vuex'
import Pagination from '@/components/common/Pagination'
import ProductItem from './ProductItem'
import OrderListNoData from './OrderListNoData'
import ReviewPop from '@/components/common/ReviewPop'
import Calendar from '@/components/common/calendar/calendar.vue'
import ClickOutside from 'vue-click-outside'
import { getToday, addMonth } from '@/utils/dateUtils'
export default {
  props: ['type'],
  data () {
    return {
      selectedMonthTab: 1,
      calendarDataStart: {
        show: false,
        range: false,
        zero: true,
        value: [],
        lunar: false,
        select: (value) => {
          this.calendarDataStart.show = false
          this.calendarDataStart.value = value
          this.selectDate = true
        }
      },
      calendarDataEnd: {
        show: false,
        range: false,
        zero: true,
        value: [],
        lunar: false,
        select: (value) => {
          this.calendarDataEnd.show = false
          this.calendarDataEnd.value = value
          this.selectDate = true
        }
      },
      reviewShow: false,
      currentReview: null
    }
  },
  components: {
    Pagination,
    ProductItem,
    Calendar,
    OrderListNoData,
    ReviewPop
  },
  computed: {
    ...mapState('orderList', ['list', 'totalCount', 'fetchListParams']),
    currentPage () {
      return this.fetchListParams && this.fetchListParams.pageNumber ? this.fetchListParams.pageNumber : 1
    }
  },
  methods: {
    writeReview (review) {
      this.$store.commit('SHOW_POP')
      this.reviewShow = true
      this.currentReview = review
    },
    closeReviewPop (okFLg) {
      this.$store.commit('CLOSE_POP')
      this.reviewShow = false
      if (okFLg) {
        this.refreshPage()
      }
    },
    pageChange (pageNo) {
      let query = JSON.parse(JSON.stringify(this.$route.query))
      query.pageNumber = pageNo
      this.$router.push({
        path: this.$route.path,
        query
      })
    },
    openByDialog (theObj) {
      theObj.show = !theObj.show
    },
    closeStateDialog () {
      this.calendarDataStart.show = false
    },
    closeEndDialog () {
      this.calendarDataEnd.show = false
    },
    refreshPage () {
      this.$router.push({
        path: this.$route.path
      })
    },
    clickMonth (num) {
      let startDate = addMonth(new Date(), -num)
      let endDate = getToday()
      this.calendarDataStart.value = startDate.split('-')
      this.calendarDataEnd.value = endDate.split('-')
      this.selectedMonthTab = num

      let query = JSON.parse(JSON.stringify(this.$route.query))
      query.pageNumber = 1
      query.startYmd = startDate
      query.endYmd = endDate
      this.$router.push({
        path: this.$route.path,
        query
      })
    },
    searchOrderList () {
      let startDate = this.calendarDataStart.value.join('-')
      let endDate = this.calendarDataEnd.value.join('-')

      let query = JSON.parse(JSON.stringify(this.$route.query))
      query.pageNumber = 1
      query.startYmd = startDate
      query.endYmd = endDate
      this.$router.push({
        path: this.$route.path,
        query
      })
    }
  },
  mounted () {
    let startYmd = addMonth(new Date(), -1).split('-')
    let endYmd = getToday().split('-')
    let query = JSON.parse(JSON.stringify(this.$route.query))
    if (query.startYmd) {
      startYmd = query.startYmd.split('-')
    }
    if (query.endYmd) {
      endYmd = query.endYmd.split('-')
    }
    this.calendarDataStart.value = [startYmd[0], startYmd[1], startYmd[2]]
    this.calendarDataEnd.value = [endYmd[0], endYmd[1], endYmd[2]]
  },
  directives: {
    ClickOutside
  }
}
</script>
