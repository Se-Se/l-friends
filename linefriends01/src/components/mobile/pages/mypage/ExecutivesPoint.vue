<template>
  <div>
    <sub-page-header title="임직원 포인트 현황" />
    <div class="total-point">
      <dl class="total-point__item">
        <dt class="total-point__label">
          사용 가능 임직원 포인트
        </dt>
        <dd class="total-point__value">
          {{ welfareTotal.totalAvailableAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
      <dl class="total-point__item">
        <dt class="total-point__label">
          한 달 이내 소멸예정
        </dt>
        <dd class="total-point__value">
          {{welfareTotal ? MyMiliFormat(welfareTotal.totalExpireAmt) : '0'}}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
    </div>
    <period-selector v-model="selectTypeFlg" />

    <div id="container">
      <div v-if="welfareHistoryList && welfareHistoryList.length > 0">
        <point-log
          v-for="(item, key) in welfareHistoryList"
          :key="key"
          :point="item"
          class="point-logs"
        />
      </div>
      <not-found
        v-else
        description="사용 내역이 없습니다"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { onScrollNextPage } from '@/utils/event-bus'
import { formatCurrency } from '@/utils/StringUtils'
import ClickOutside from 'vue-click-outside'
import { getToday, addMonth } from '@/utils/dateUtils'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import PeriodSelector from '@/components/mobile/common/PeriodSelector'
import PointLog from '@/components/mobile/point/PointLog'
import NotFound from '@/components/mobile/common/list/NotFound'

export default {
  data () {
    return {
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
  watch: {
    selectTypeFlg (next) {
      this.getOrders(next)
      this.search()
    }
  },
  directives: {
    ClickOutside
  },
  components: {
    SubPageHeader,
    PeriodSelector,
    PointLog,
    NotFound
  },
  computed: {
    ...mapState('member', ['mySummary', 'welfareTotal']),
    ...mapState('myorder', ['totalCount', 'totalAmt', 'welfareHistoryList', 'pointName'])
  },
  methods: {
    MyMiliFormat (num) {
      return formatCurrency(num)
    },
    async pageChange (index) {
      this.pageNo = index
      await this.$store.dispatch('myorder/getWelfareListMore', { pageNumber: this.pageNo, startYmd: this.calendarDataStart.value.join('-'), endYmd: this.calendarDataEnd.value.join('-') })
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
    this.getOrders(this.selectTypeFlg)
    this.pageChange(1)
  },
  mounted () {
    onScrollNextPage(async () => {
      if (
        this.welfareHistoryList &&
        this.welfareHistoryList.length < this.totalCount
      ) {
        await this.pageChange(this.pageNo + 1)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.total-point {
  padding: 3rem 2rem 3.233rem;
  border-bottom: 1px solid #ededed;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 0.633rem;
    }
  }

  &__label {
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__value {
    font-family: Volte, sans-serif;
    font-size: 1.8rem;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #00d664;

    .currency {
      font-family: 'Noto Sans KR';
      font-weight: bold;
      letter-spacing: normal;
    }
  }
}

.point-logs:not(:last-child) {
  border-bottom: 1px solid #ededed;
}

.point-logs:last-child {
  margin-bottom: 0.3rem;
}
</style>
