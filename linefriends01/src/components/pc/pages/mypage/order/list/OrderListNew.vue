<template>
  <div>
    <div class="table-list">
      <div class="table-list--header">
        <h2 class="table-list--header__title">
          {{ $t('mypage.orderList.title') }}
        </h2>
        <ul class="table-list--header__list">
          <li
            class="table-list--header__item"
            :class="selectTypeFlg ==='one_month' ? 'active' : ''"
          >
            <a href="#" @click.prevent="getOrders('one_month')"><span class="num">1</span>{{ $t('mypage.orderList.month') }}</a>
          </li>
          <li
            class="table-list--header__item"
            :class="selectTypeFlg === 'three_month' ? 'active' : ''"
          >
            <a href="#" @click.prevent="getOrders('three_month')"><span class="num">3</span>{{ $t('mypage.orderList.month') }}</a>
          </li>
          <li
            class="table-list--header__item"
            :class="selectTypeFlg === 'six_month' ? 'active' : ''"
          >
            <a href="#" @click.prevent="getOrders('six_month')"><span class="num">6</span>{{ $t('mypage.orderList.month') }}</a>
          </li>
          <li
            class="table-list--header__item"
            :class="selectTypeFlg === 'all' ? 'active' : ''"
          >
            <a href="#" @click.prevent="getOrders('all')">{{ $t('mypage.orderList.all') }}</a>
          </li>
        </ul>
      </div>
    </div>
    <template v-if="orders && orders.length > 0">
      <order
        :order="orders"
        :type="'list'"
        @showInquiryPopup="showInquiryPopup"
        @showAddReviewPopup="showAddReviewPopup"
        :showOrderType="'ORDER'"
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
      <div class="search-util">
        <a href="https://old-store.linefriends.co.kr/" target="_blanck">{{ $t('mypage.orderList.prevOrder') }}</a>
      </div>
      <div class="pagination-interval pagination mt-3">
        <pagination v-model="pageNo" :total="totalCount || 0" :limit="pageSize" @change="pageChange" ref="pagination"></pagination>
      </div>
    </template>

    <template v-if="orders && orders.length === 0">
      <div class="table_wrap">
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
              <th class="part1">{{ $t('mypage.orderList.orderInfo') }}</th>
              <th class="part2">{{ $t('mypage.orderList.goodsInfo') }}</th>
              <th>{{ $t('mypage.orderList.cnt') }}</th>
              <th class="part4">{{ $t('mypage.orderList.goodsPrice') }}</th>
              <th>{{ $t('mypage.orderList.status') }}</th>
              <th class="part6">{{ $t('mypage.orderList.management') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="none" colspan="6">
                <div class="table-nodata">
                <figure class="table-nodata__fig">
                  <img src="~@/assets/images/pc/icons/ic-nodata79x100.png">
                </figure>
                <div class="table-nodata--info">
                  <h2 class="table-nodata--info__title">
                    {{ $t('orderInfo.noOrderDelivery1') }}<br>
                    {{ $t('orderInfo.noOrderDelivery2') }}
                  </h2>
                  <router-link
                    to="/goods"
                    class="table-nodata--info__action"
                  >{{ $t('orderInfo.allGoodsView') }}
                  </router-link>
                </div>
              </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="search-util">
          <a href="https://old-store.linefriends.co.kr/" target="_blanck">{{ $t('mypage.orderList.prevOrder') }}</a>
        </div>
        <div class="pagination mt-3">
          <!-- [D] 현재 페이지인 곳에 now 클래스 추가 -->
          <a href="#" class="prev" @click.prevent="noDone">이전으로</a>
          <a href="#" class="now" @click.prevent="noDone"><em>1</em></a>
          <a href="#" class="next" @click.prevent="noDone">다음으로</a>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ProductInquiryPopup from '@/components/pc/popup/ProductInquiryPopupNew'
import OrderAddreviewPopup from '@/components/pc/popup/OrderAddreviewPopupNew'
import Order from '@/components/pc/layout/order/OrderNew'
import OrderListNew from '@/components/mixins/mypage/order/list/OrderListNew'
import Pagination from '@/components/pc/assets/Pagination'

export default {
  name: 'OrderList',
  mixins: [OrderListNew],
  components: {
    ProductInquiryPopup,
    OrderAddreviewPopup,
    Order,
    Pagination
  }
}
</script>

<style>
.myorder_list #loader {
  position: static;
  transform: none;
}
</style>
<style scoped>
.search-util {
  text-align: right;
  padding-top: 10px;
  color: #5286bc;
  text-decoration: underline;
}
</style>
