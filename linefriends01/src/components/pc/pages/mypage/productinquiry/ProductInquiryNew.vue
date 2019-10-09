<template>
  <div class="table-list">
    <div class="table-list--header">
      <h2 class="table-list--header__title">상품문의</h2>
    </div>
    <div class="table_wrap">
      <table class="table-contact contact">
        <colgroup>
          <col style="width:177px">
          <col style="width:236px">
          <col style="width:472px">
          <col style="width:177px">
          <col style="width:118px">
        </colgroup>
        <thead>
          <tr>
            <th>{{ $t('contactUs.typeOfInquiry') }}</th>
            <th>{{ $t('contactUs.goodsTitle') }}</th>
            <th>{{ $t('contactUs.typeOfDescription') }}</th>
            <th>{{ $t('contactUs.updateDate') }}</th>
            <th>{{ $t('contactUs.status') }}</th>
          </tr>
        </thead>
        <template v-if="productInquiries && productInquiries.length > 0">
          <template v-for="(inquiry,index) in productInquiries">
            <ProductInquiryCard :inquiry="inquiry" :key="index" @openIndex="openIndex" :currentIndex="currentIndex" :index="index"></ProductInquiryCard>
          </template>
        </template>
        <tbody v-if="productInquiries && productInquiries.length === 0">
          <tr>
            <td class="none" colspan="5" style="cursor: default;">
              <div class="table-nodata">
                <figure class="table-nodata__fig">
                  <img src="~@/assets/images/pc/icons/ic-nodata79x100.png">
                </figure>
                <div class="table-nodata--info">
                  <h2 class="table-nodata--info__title">
                      작성한 상품문의가 없습니다.
                  </h2>
                  </div>
                </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-interval">
      <pagination class="mt-3" v-model="pageNo" :total="totalCount || 1" :limit="pageSize" @change="pageChange" ref="pagination" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ProductInquiryCard from './leaf/ProductInquiryCardNew'
import ProductInquiryNew from '@/components/mixins/mypage/productinquiry/ProductInquiryNew'
import Pagination from '@/components/pc/assets/Pagination'

export default {
  mixins: [ProductInquiryNew],
  components: {
    ProductInquiryCard,
    Pagination
  }
}
</script>
