<template>
  <section>
    <div class="table-list">
      <div class="table-list--header">
        <h2 class="table-list--header__title">
          {{ $t('mypage.cancelList.title') }}
        </h2>
        <ul
          class="table-list--header__list"
        >
          <li
            :class="selectTypeFlg === 'one_month' ? 'active' : ''"
            class="table-list--header__item">
            <a href="#" @click.prevent="getCancels('one_month')">{{ $t('months.one') }}</a>
          </li>
          <li
            :class="selectTypeFlg === 'three_month' ? 'active' : ''"
            class="table-list--header__item">
            <a href="#" @click.prevent="getCancels('three_month')">{{ $t('months.three') }}</a>
          </li>
          <li
            :class="selectTypeFlg === 'six_month' ? 'active' : ''"
            class="table-list--header__item">
            <a href="#" @click.prevent="getCancels('six_month')">{{ $t('months.six') }}</a>
          </li>
          <li
            :class="selectTypeFlg === 'all' ? 'active' : ''"
            class="table-list--header__item">
            <a href="#" @click.prevent="getCancels('all')">{{ $t('months.all') }}</a>
          </li>
        </ul>
      </div>
    </div>
    <template v-if="orders && orders.length > 0">
      <order
        :order="orders"
        :type="'list'"
        @showInquiryPopup="showInquiryPopup"
        @showReturnDetailPopup="showReturnDetailPopup"
        @showCancelDetailPopup="showCancelDetailPopup" 
        :showOrderType="'CANCEL'"
      />
      <product-inquiry-popup
        :inquiryTypes="productInquiryTypes"
        :productNo="inquiryProductNo"
        ref="productInquiryPopup"
        :isShowContact.sync="isShowContact"
      />
      <order-addreview-popup
        :orderOption="orderOption"
        ref="orderAddreviewPopup"
        :isShowReview.sync="isShowReview"
      />
      <order-claim-detail-popup
        :showClaimType="'CANCEL'"
        ref="orderClaimCancelDetailPopup"
      />
      <order-claim-detail-popup
        :showClaimType="'RETURN'"
        ref="orderClaimReturnDetailPopup"
      />
    </template>
    <div
      v-if="orders && orders.length > 0"
      class="pagination-interval pagination mt-3"
    >
      <pagination
        v-model="pageNo"
        :total="totalCount || 0"
        :limit="pageSize"
        @change="pageChange"
        ref="pagination"
        ></pagination>
    </div>

    <template v-if="orders && orders.length === 0">
      <div class="table_wrap">
        <table class="table">
          <colgroup>
            <col style="width: 180px;">
            <col style="width: 510px;">
            <col style="width: 60px;">
            <col style="width: 160px;">
            <col style="width: 120px;">
            <col style="width: 150px;">
          </colgroup>
          <thead>
            <tr>
              <th class="part1">{{ $t('mypage.cancelList.orderInfo') }}</th>
              <th class="part2">{{ $t('mypage.cancelList.goodsInfo') }}</th>
              <th>{{ $t('mypage.cancelList.cnt') }}</th>
              <th class="part4">{{ $t('mypage.cancelList.goodsPrice') }}</th>
              <th>{{ $t('mypage.cancelList.status') }}</th>
              <th class="part6">{{ $t('mypage.cancelList.management') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="none" colspan="6">
                <div class="table-nodata">
                  <figure class="table-nodata__fig">
                    <img src="~@/assets/images/pc/icons/ic-nodata79x100.png">
                  </figure>
                  <div
                    class="table-nodata--info"
                  >
                    <h2
                      class="table-nodata--info__title"
                    >
                      {{ $t('mypage.cancelList.description') }}
                    </h2>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination mt-3">
          <!-- [D] 현재 페이지인 곳에 now 클래스 추가 -->
          <a href="#" class="prev" @click.prevent="noDone">이전으로</a>
          <a href="#" class="now" @click.prevent="noDone"><em>1</em></a>
          <a href="#" class="next" @click.prevent="noDone">다음으로</a>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import ProductInquiryPopup from '@/components/pc/popup/ProductInquiryPopupNew'
import OrderAddreviewPopup from '@/components/pc/popup/OrderAddreviewPopupNew'
import OrderClaimDetailPopup from '@/components/pc/pages/mypage/order/claim/OrderClaimDetailPopupNew'
import Order from '@/components/pc/layout/order/OrderNew'
import Pagination from '@/components/pc/assets/Pagination'
import CancelListNew from '@/components/mixins/mypage/order/list/CancelListNew'

export default {
  name: 'CancelListNew',
  mixins: [CancelListNew],
  components: {
    ProductInquiryPopup,
    OrderAddreviewPopup,
    Order,
    Pagination,
    OrderClaimDetailPopup
  },
  methods: {
    showCancelDetailPopup (orderOptionNo) {
      this.cancelDetailOrderOptionNo = orderOptionNo
      this.$refs.orderClaimCancelDetailPopup.openOrderClaimDetailPopup(this.cancelDetailOrderOptionNo, false)
    },
    showReturnDetailPopup (claimNo) {
      this.returnDetailClaimNo = claimNo
      this.$refs.orderClaimReturnDetailPopup.openOrderReturnDetailPopup(this.returnDetailClaimNo, false)
    }
  }
}
</script>

<style>
.myorder_list #loader {
  position: static;
  transform: none;
}
</style>
