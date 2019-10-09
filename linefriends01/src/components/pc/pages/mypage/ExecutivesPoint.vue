<template>
  <div class="old-css">
    <div class="mypage">
      <div class="integral">
        <h2>임직원 포인트 현황</h2>
        <div class="data mt-1">
          <dl v-if="welfareTotal">
            <dt>사용 가능 임직원 포인트</dt>
            <dd class="fz_1">{{ welfareTotal.totalAvailableAmt | formatCurrency }}<span class="txt">원</span></dd>
          </dl>
          <dl v-if="welfareTotal">
            <dt>한 달 이내 소멸예정</dt>
            <dd class="fz_1">{{welfareTotal ? MyMiliFormat(welfareTotal.totalExpireAmt) : '0'}}<span class="txt">원</span></dd>
          </dl>
        </div>
      </div>
      <div class="filter_con">
        <ul class="date">
          <li v-click-outside="closeCalendarDataStart">
            <div class="input_calendar" @click.prevent="openByDialog(calendarDataStart)"><input type="text" :value="calendarDataStart.value.join('.')"></div>
            <div class="calendar_popup" v-if="calendarDataStart.show" :style="calendarDataStart.show ? 'display: block;' : ''">
              <calendar :range="calendarDataStart.range" :zero="calendarDataStart.zero" :lunar="calendarDataStart.lunar" :value="calendarDataStart.value" @select="calendarDataStart.select"></calendar>
            </div>
          </li>
          <li class="line">~</li>
          <li v-click-outside="closeCalendarDataEnd">
            <div class="input_calendar" @click.prevent="openByDialog(calendarDataEnd)"><input type="text" :value="calendarDataEnd.value.join('.')"></div>
            <div class="calendar_popup calendar_position" v-if="calendarDataEnd.show" :style="calendarDataEnd.show ? 'display: block;' : ''">
              <calendar :range="calendarDataEnd.range" :zero="calendarDataEnd.zero" :lunar="calendarDataEnd.lunar" :value="calendarDataEnd.value" @select="calendarDataEnd.select"></calendar>
            </div>
          </li>
        </ul>
        <ul class="month">
          <li :class="selectTypeFlg === 'one_month' ? 'active' : ''">
            <a href="#" @click.prevent="getOrders('one_month')"><span class="num">1</span>개월</a>
          </li>
          <li :class="selectTypeFlg === 'three_month' ? 'active' : ''">
            <a href="#" @click.prevent="getOrders('three_month')"><span class="num">3</span>개월</a>
          </li>
          <li :class="selectTypeFlg === 'six_month' ? 'active' : ''">
            <a href="#" @click.prevent="getOrders('six_month')"><span class="num">6</span>개월</a>
          </li>
          <li :class="selectTypeFlg === 'all' ? 'active' : ''">
            <a href="#" @click.prevent="getOrders('all')">전체</a>
          </li>
        </ul>
        <div class="btn_con">
          <button class="white-button review" @click="search">조회하기</button>
        </div>
      </div>
      <div class="table_wrap mt-2">
        <table class="table">
          <colgroup>
            <col class="width-220">
            <col class="width-320">
            <col class="width-160">
            <col class="width-160">
            <col class="width-320">
          </colgroup>
          <thead>
            <tr>
              <th>일자</th>
              <th>적립내역</th>
              <th>적립</th>
              <th>차감</th>
              <th>유효기간</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in welfareHistoryList" :key="index">
              <td>{{item.registerYmdt.substring(0, 16).replace(/-/g, '.')}}</td>
              <td class="prod_name text_left_sp1">
                <div class="ellipsis">
                  <p>{{item.reasonDetail}}</p>
                </div>
              </td>
              <!-- TODO :: SUBTRACTION_CANCELED 조건추가 ? -->
              <td>{{item.accumulationStatus === 'GIVE_AVAILABLE' || item.accumulationStatus === 'SUBTRACTION_CANCELED' ? MyMiliFormat(item.accumulationAmt) : '-'}}<span v-if="item.accumulationStatus === 'GIVE_AVAILABLE' || item.accumulationStatus === 'SUBTRACTION_CANCELED'" class="txt">원</span></td>
              <td>{{item.accumulationStatus === 'SUBTRACTION_USED' ? MyMiliFormat(item.accumulationAmt) : '-'}}<span v-if="item.accumulationStatus === 'SUBTRACTION_USED'" class="txt">원</span></td>
              <td>{{item.accumulationStatus === 'GIVE_AVAILABLE' || item.accumulationStatus === 'SUBTRACTION_CANCELED' ? (item.registerYmdt.substring(0, 16).replace(/-/g, '.') + ' - ' + item.expireYmdt.substring(0, 16).replace(/-/g, '.')) : ''}}</td>
            </tr>
            <tr v-if="welfareHistoryList && welfareHistoryList.length === 0">
              <td class="none" colspan="5">사용 내역이 없습니다</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-interval">
        <!-- [D] 현재 페이지인 곳에 now 클래스 추가 -->
        <pagination v-model="pageNo" :total="totalCount || 1" :limit="pageSize" @change="pageChange" ref="pagination"></pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Calendar from '@/components/common/calendar/calendarNew.vue'
import Pagination from '@/components/pc/assets/Pagination'
import { formatCurrency } from '@/utils/StringUtils'
import ClickOutside from 'vue-click-outside'
import { getToday, addMonth } from '@/utils/dateUtils'
export default {
  data () {
    return {
      pageNo: 1,
      pageSize: 20,
      selectTypeFlg: 'one_month',
      selectDate: false,
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
      dateRange: ''
    }
  },
  directives: {
    ClickOutside
  },
  components: {
    Pagination,
    Calendar
  },
  computed: {
    ...mapState('member', ['mySummary', 'welfareTotal']),
    ...mapState('myorder', ['totalCount', 'totalAmt', 'welfareHistoryList', 'pointName'])
  },
  methods: {
    MyMiliFormat (num) {
      return formatCurrency(num)
    },
    pageChange (index) {
      this.pageNo = index
      this.$store.dispatch('myorder/getWelfareList', { pageNumber: this.pageNo, startYmd: this.calendarDataStart.value.join('-'), endYmd: this.calendarDataEnd.value.join('-') })
    },
    getOrders (period) {
      this.selectTypeFlg = period
      if (period === 'all') {
        this.calendarDataStart.value = ['2018', '01', '01']
        this.calendarDataEnd.value = getToday().split('-')
      } else if (period === 'six_month') {
        this.calendarDataStart.value = addMonth(new Date(), -6).split('-')
        this.calendarDataEnd.value = getToday().split('-')
      } else if (period === 'three_month') {
        this.calendarDataStart.value = addMonth(new Date(), -3).split('-')
        this.calendarDataEnd.value = getToday().split('-')
      } else {
        // period === 'one_month'
        this.calendarDataStart.value = addMonth(new Date(), -1).split('-')
        this.calendarDataEnd.value = getToday().split('-')
      }
      this.selectDate = false
    },
    search () {
      this.pageNo = 1
      this.$store.dispatch('myorder/getWelfareList', { pageNumber: this.pageNo, startYmd: this.calendarDataStart.value.join('-'), endYmd: this.calendarDataEnd.value.join('-') }).then(() => {
        this.dateRange = this.calendarDataStart.value.join('.') + ' ~ ' + this.calendarDataEnd.value.join('.')
      })
      if (this.selectDate) this.selectTypeFlg = ''
    },
    openByDialog (theObj) {
      theObj.show = !theObj.show
    },
    orderclick (orderNo) {
      this.$router.push(`/mypage/orderdetail/${orderNo}`)
    },
    getDateRange () {
      let nowDate = new Date()
      let year = nowDate.getFullYear()
      let month = nowDate.getMonth()
      let theDateD = new Date().getDate()
      let today = [year, month + 1, theDateD]
      if (month === 0) {
        month = 12
        year = year - 1
      }
      this.calendarDataStart.value = [year, month, theDateD]
      this.calendarDataEnd.value = today
      if (this.calendarDataStart.value[1] < 10) {
        this.calendarDataStart.value[1] = '0' + this.calendarDataStart.value[1]
      }
      if (this.calendarDataStart.value[2] < 10) {
        this.calendarDataStart.value[2] = '0' + this.calendarDataStart.value[2]
      }
      if (this.calendarDataEnd.value[1] < 10) {
        this.calendarDataEnd.value[1] = '0' + this.calendarDataEnd.value[1]
      }
      if (this.calendarDataEnd.value[2] < 10) {
        this.calendarDataEnd.value[2] = '0' + this.calendarDataEnd.value[2]
      }
      this.dateRange = this.calendarDataStart.value.join('.') + ' ~ ' + this.calendarDataEnd.value.join('.')
      // return [[year, month, theDateD], today]
    },
    closeCalendarDataStart () {
      this.calendarDataStart.show = false
    },
    closeCalendarDataEnd () {
      this.calendarDataEnd.show = false
    }
  },
  beforeMount () {
    this.getDateRange()
    this.pageChange(1)
  }
}
</script>
