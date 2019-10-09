<template>
  <div>
    <div>
      <table class="table">
        <colgroup>
          <col style="width:20%">
          <col style="width:30%">
          <col style="width:10%">
          <col style="width:10%">
          <col style="width:10%">
          <col style="width:10%">
        </colgroup>
        <thead>
          <tr>
            <th>{{ $t('orderInfo.title') }}</th>
            <th>{{ $t('orderInfo.goodsInfo') }}</th>
            <th>{{ $t('orderInfo.cnt') }}</th>
            <th>{{ $t('orderInfo.goodsPrice') }}</th>
            <th>{{ $t('orderInfo.status') }}</th>
            <th>{{ $t('orderInfo.management') }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="showOrderType === 'ORDER'">
            <template
            v-for="(item, index) in orderItems"
            :index="index"
            >
              <order-option
                v-for="option in item.viewOptions"
                :key="option.orderOptionNo"
                :option="option"
                @showInquiryPopup="showInquiryPopup"
                @showAddReviewPopup="showAddReviewPopup"
                @showReturnDetailPopup="showReturnDetailPopup"
                @showCancelDetailPopup="showCancelDetailPopup"
                :nonMember="nonMember"
                v-if="isShow(option)"
                :showOrderType="'ORDER'"
              />
            </template>
          </template>
          <template v-if="showOrderType === 'CANCEL'">
            <template
            v-for="(item, index) in orderItems"
            :index="index"
            >
              <order-option
                v-for="option in item.viewOptions"
                :key="option.orderOptionNo"
                :option="option"
                @showInquiryPopup="showInquiryPopup"
                @showAddReviewPopup="showAddReviewPopup"
                @showReturnDetailPopup="showReturnDetailPopup"
                @showCancelDetailPopup="showCancelDetailPopup"
                :nonMember="nonMember"
                v-if="isShow(option)"
                :showOrderType="'CANCEL'"
              />
            </template>
          </template>
          <template v-if="showOrderType === 'BOTH'">
            <template
            v-for="(item, index) in orderItems"
            :index="index"
            >
              <order-option
                v-for="option in item.viewOptions"
                :key="option.orderOptionNo"
                :option="option"
                @showInquiryPopup="showInquiryPopup"
                @showAddReviewPopup="showAddReviewPopup"
                @showReturnDetailPopup="showReturnDetailPopup"
                @showCancelDetailPopup="showCancelDetailPopup"
                :nonMember="nonMember"
                v-if="isShow(option)"
                :showOrderType="'CANCEL'"
              />
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import OrderOption from '@/components/pc/layout/order/OrderOptionNew'

export default {
  props: {
    order: {
      type: Array,
      required: true
    },
    showOrderType: {
      type: String,
      required: true
    },
    type: {
      type: String
    },
    nonMember: {
      type: Boolean
    }
  },
  components: {
    OrderOption
  },
  data () {
    return {
      orderItems: []
    }
  },
  methods: {
    showInquiryPopup (productNo) {
      this.$emit('showInquiryPopup', productNo)
    },
    showAddReviewPopup (orderOption) {
      this.$emit('showAddReviewPopup', orderOption)
    },
    showCancelDetailPopup (orderOptionNo) {
      this.$emit('showCancelDetailPopup', orderOptionNo)
    },
    showReturnDetailPopup (orderOptionNo) {
      this.$emit('showReturnDetailPopup', orderOptionNo)
    },
    isShow (option) {
      switch (this.showOrderType) {
        case 'ORDER':
          return !option.claimStatusType
        case 'CANCEL':
          return option.claimStatusType
        case 'BOTH':
          return true
        default:
          return false
      }
    },
    setViewOptions () {
      if (this.order) {
        for (let key in this.order) {
          let item = this.order[key]
          const claimNos = []
          const claimOption = []
          item.orderOptions.forEach(option => {
            claimNos.push(option.claimNo)
            if (option.claimNo) {
              claimOption.push(option)
            }
          })
          item.viewOptions = []
          const claimArr = Array.from(new Set(claimNos))

          claimOption.forEach((item, index) => {
            item.firstTd = index === 0
            item.rowspan = claimOption.length
          })
          claimArr.forEach(no => {
            const temp = []
            item.orderOptions.forEach((option, index) => {
              if (no === option.claimNo) {
                temp.push(option)
              }
            })
            temp.forEach((obj, index) => {
              obj.claimButton = index === 0
              obj.btnRowspan = claimNos.filter(claimNo => claimNo === no).length
              obj.orderYmdt = item.orderYmdt
              item.viewOptions.push(obj)
            })
          })

          this.$nextTick(() => {
            Vue.set(this.orderItems, key, item)
          })
        }
      }
    }
  },
  watch: {
    order () {
      this.setViewOptions()
    }
  },
  created () {
    this.setViewOptions()
  }
}
</script>
