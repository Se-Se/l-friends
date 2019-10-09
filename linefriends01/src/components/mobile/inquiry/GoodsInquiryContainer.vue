<template>
  <div>
    <div
      v-if="productInquiries && productInquiries.length > 0"
      class="inquiry-container"
    >
      <inquiry-item
        v-for="(item, index) in productInquiries"
        :key="index"
        :inquiry="item"
        :editable="true"
        @openIndex="openIndex"
        :currentIndex="currentIndex"
        :index="index"
        class="inquiry-items"
      />
    </div>
    <not-found
      v-else
      :description="$t('mypage.productinquiry.description')"
    />
  </div>
</template>

<script>
import NotFound from '../common/list/NotFound'
import InquiryItem from './ProductInquiryItem'
import ProductInquiryNew from '@/components/mixins/mypage/productinquiry/ProductInquiryNew'
import { onScrollNextPage } from '@/utils/event-bus'

export default {
  name: 'GoodsInquiryContainer',
  mixins: [ProductInquiryNew],
  components: {
    InquiryItem,
    NotFound
  },
  props: {
    noData: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    onScrollNextPage(async () => {
      if (this.productInquiries && this.productInquiries.length < this.totalCount) {
        await this.$store.dispatch('productinquiry/fetchMore')
      }
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
