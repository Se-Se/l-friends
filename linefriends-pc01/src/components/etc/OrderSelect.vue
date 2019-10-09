<template>
  <div class="popup-layer" style="display: block;">
    <div class="popup_common popup_size_1 popup_size_new2">
      <div class="roller_area none_overflow is_open">
        <div class="contact_registration">
          <h1>注文選択</h1>
        </div>
        <div class="con con_new_margin">
          <div class="popup_vertical">
            <div class="popup-telephone">
              <div class="popup_data" v-click-outside="closeCalendarDataStart">
                <input type="text" class="popup_inp-120" :value="calendarDataStart.value.join('.')" @click.prevent="openByDialog(calendarDataStart)">
                <img src="@/assets/img/icon/but_popup_data.png" @click.prevent="openByDialog(calendarDataStart)">
                <div class="calendar_popup" v-if="calendarDataStart.show" :style="calendarDataStart.show ? 'display: block;' : ''">
                  <calendar :range="calendarDataStart.range" :zero="calendarDataStart.zero" :lunar="calendarDataStart.lunar" :value="calendarDataStart.value" @select="calendarDataStart.select"></calendar>
                </div>
              </div>
              <span>-</span>
              <div class="popup_data" v-click-outside="closeCalendarDataEnd">
                <input type="text" class="popup_inp-120" :value="calendarDataEnd.value.join('.')" @click.prevent="openByDialog(calendarDataEnd)">
                <img src="@/assets/img/icon/but_popup_data.png" @click.prevent="openByDialog(calendarDataEnd)">
                <div class="calendar_popup calendar_position" v-if="calendarDataEnd.show" :style="calendarDataEnd.show ? 'display: block;' : ''">
                  <calendar :range="calendarDataEnd.range" :zero="calendarDataEnd.zero" :lunar="calendarDataEnd.lunar" :value="calendarDataEnd.value" @select="calendarDataEnd.select"></calendar>
                </div>
              </div>
            </div>
            <div class="pop_choose_data">
              <ul>
                <li :class="{pop_choose_data_true: selectedMonthTab === 1}" @click="clickMonth(1)">1ヶ月</li>
                <li :class="{pop_choose_data_true: selectedMonthTab === 3}" @click="clickMonth(3)">3ヶ月</li>
                <li :class="{pop_choose_data_true: selectedMonthTab === 6}" @click="clickMonth(6)">6ヶ月</li>
                <li :class="{pop_choose_data_true: selectedMonthTab === 12}" @click="clickMonth(12)">12ヶ月</li>
              </ul>
            </div>
            <button class="btn_green search_search" @click="select">照会する</button>
            <button class="search_search search_search1" @click="reset">
              <img src="@/assets/img/icon/btn_popup_refurblsh.png" alt="">
              リセット</button>
          </div>
          <div class="table_wrap">
            <table class="table_data buyer">
              <colgroup>
                <col style="width: 6%;">
                <col style="width:94%;">
              </colgroup>
              <tbody class="popup_choose_text">
                <tr v-for="order in orders" :key="order.orderNo">
                  <td>
                    <span class="bx_input">
                      <input :id="`checkbox-${order.orderNo}`" type="checkbox" @click="clickItem(order)">>
                      <label class="txt" :for="`checkbox-${order.orderNo}`"></label>
                    </span>
                  </td>
                  <td>
                    <p class="pop_weight_font">注文番号 : {{order.orderNo}}</p>
                    <p>{{order.orderOptions[0].productName}}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <pagination v-model="pageNo" :total="totalCount || 1" :limit="pageSize" @change="pageChange" v-if="orders" />
          <ul class="btn_list btn_list-margin">
            <li>
              <button class="btn" @click.prevent="closePopup">キャンセル</button>
            </li>
            <li>
              <button class="btn btn_green" @click.prevent="submit">登録</button>
            </li>
          </ul>
        </div>
      </div>
      <button class="btn_close" @click.prevent="closePopup">close</button>
    </div>
  </div>
  <!-- ↑↑↑↑↑ popup ↑↑↑↑↑ -->
</template>
<script>
import Pagination from '@/components/common/Pagination'
import Calendar from '@/components/common/calendar/calendar.vue'
import { getToday, addMonth } from '@/utils/dateUtils'
import ClickOutside from 'vue-click-outside'
import { mapState } from 'vuex'
import $ from 'jquery'
export default {
  name: 'OrderSelect',
  components: {
    Pagination,
    Calendar
  },
  directives: {
    ClickOutside
  },
  data: function () {
    return {
      pageNo: 1,
      pageSize: 5,
      selectedOrder: null,
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
      }
    }
  },
  created () {
    this.getOrders()
  },
  methods: {
    pageChange () {
      this.$store.dispatch('myorder/fetchMoreOrderListInInquiry', this.pageNo)
    },
    clickMonth (num) {
      this.calendarDataStart.value = addMonth(new Date(), -num).split('-')
      this.calendarDataEnd.value = getToday().split('-')
      this.selectedMonthTab = num
    },
    async getOrders () {
      await this.$store.dispatch('myorder/getOrderListInInquiry', { period: { startYmd: this.calendarDataStart.value.join('-'), endYmd: this.calendarDataEnd.value.join('-') } })
    },
    select () {
      this.getOrders()
    },
    closePopup () {
      this.$emit('closePopup')
    },
    clickItem (item) {
      this.orders.forEach(order => {
        if (item.orderNo !== order.orderNo) {
          $(`#checkbox-${order.orderNo}`)[0].checked = false
        }
      })
      if ($(`#checkbox-${item.orderNo}`)[0].checked) {
        this.selectedOrder = item
      } else {
        this.selectedOrder = null
      }
    },
    submit () {
      if (this.selectedOrder) {
        this.$emit('setSelectedOrder', this.selectedOrder)
        this.$emit('closePopup')
      } else {
        alert('注文を選択してください。')
      }
    },
    openByDialog (theObj) {
      theObj.show = !theObj.show
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
    reset () {
      this.clickMonth(1)
    },
    closeCalendarDataStart () {
      this.calendarDataStart.show = false
    },
    closeCalendarDataEnd () {
      this.calendarDataEnd.show = false
    }
  },
  computed: {
    ...mapState('myorder', ['totalCount', 'orders'])
  },
  beforeMount () {
    this.getDateRange()
  }
}
</script>
