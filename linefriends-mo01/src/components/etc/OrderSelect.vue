<template>
  <div class="cs-popup" style="display: block;">
    <p class="cs-popup-close"><a @click.prevent="closePopup">close</a></p>
    <div class="cs-popup-ttl">注文選択</div>
    <div class="cs-popup-contents">
      <div class="period_sel">
        <div class="bx_select">
          <select class="normal-sel" v-model="period">
            <option value="one_month">1ヶ月</option>
            <option value="three_month">3ヶ月</option>
            <option value="six_month">6ヶ月</option>
          </select>
        </div>
      </div>
    </div>
    <ul class="order_num_list">
      <li v-for="order in orders" :key="order.orderNo">
        <span class="bx_input size_l">
          <input :id="`checkbox-${order.orderNo}`" type="checkbox" @click="clickItem(order)">
          <label class="txt" :for="`checkbox-${order.orderNo}`">注文番号 : {{order.orderNo}}<br>
            <span>{{order.orderOptions[0].productName}}
            </span>
          </label>
        </span>
      </li>
    </ul>
    <pagination v-model="pageNo" :total="totalCount || 1" :limit="pageSize" @change="pageChange" v-if="orders"/>
    <div class="cs-popup-contents">
      <ul class="product_active">
        <li><button class="btn" @click.prevent="closePopup">キャンセル</button></li>
        <li><button class="btn btn_green" @click.prevent="submit">選択</button></li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Alert } from '@/components/common/modal'
import Pagination from '@/components/common/Pagination'
import { mapState } from 'vuex'
import $ from 'jquery'
export default {
  name: 'OrderSelect',
  components: {
    Pagination
  },
  data: function () {
    return {
      period: 'one_month',
      pageNo: 1,
      pageSize: 10,
      selectedOrder: null
    }
  },
  watch: {
    period () {
      this.getOrders()
    }
  },
  created () {
    this.getOrders()
  },
  methods: {
    pageChange () {
      this.$store.dispatch('myorder/fetchMoreOrderListInInquiry', this.pageNo)
    },
    async getOrders () {
      await this.$store.dispatch('myorder/getOrderListInInquiry', { type: 'ORDER', period: this.period })
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
        Alert('注文を選択してください。')
      }
    }
  },
  computed: {
    ...mapState('myorder', ['totalCount', 'orders'])
  }
}
</script>
