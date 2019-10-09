<template>
  <div class="table-list">
    <div class="table-list--header">
      <h2 class="table-list--header__title">{{ $t('mypage.inquiry.title') }}</h2>
      <div class="table-list--header__btn old-css">
        <button class="white-button review" @click="showInquiryPopup">{{ $t('mypage.inquiry.title') }} {{ $t('mypage.inquiry.add') }}</button>
      </div>
    </div>
    <div class="table_wrap">
      <table class="table-contact">
        <colgroup>
          <col style="width: 160px">
          <col style="width: 660px">
          <col style="width: 200px">
          <col style="width: 160px">
        </colgroup>
        <thead>
          <tr>
            <th>{{ $t('mypage.inquiry.kinds.type') }}</th>
            <th>{{ $t('mypage.inquiry.kinds.title') }}</th>
            <th>{{ $t('mypage.inquiry.kinds.date') }}</th>
            <th>{{ $t('mypage.inquiry.kinds.status') }}</th>
          </tr>
        </thead>
        <InquiryItem
          :inquiry-item="inquiryItem"
          v-for="(inquiryItem,index) in inquiries"
          :key="inquiryItem.inquiryNo"
          @openIndex="openIndex"
          :currentIndex="currentIndex"
          :index="index" />
        <!-- [D] 문의내역이 없을 경우, 노출 -->
        <tbody v-if="!inquiries || inquiries.length === 0">
          <tr>
            <td class="none" colspan="4" style="cursor: default;">
              <div
                class="table-nodata"
              >
                <figure
                  class="table-nodata__fig"
                >
                  <img src="~@/assets/images/pc/icons/ic-nodata79x100.png">
                </figure>
                <div
                  class="table-nodata--info"
                >
                  <h2
                    class="table-nodata--info__title"
                  >
                    {{ $t('mypage.inquiry.description') }}
                  </h2>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <SignInInquiry ref="signInInquiry" @initOpenI="openIndex" />
    <div class="pagination-interval">
      <pagination class="mt-3" :page="1" :total="totalCount || 1" :limit="20" @change="pageChange" ref="pagination" />
    </div>
  </div>
</template>
<script>
import SignInInquiry from './SignInInquiryNew'
import InquiryItem from './InquiryItemNew'
import InquiryNew from '@/components/mixins/mypage/inquiry/InquiryNew'
import Pagination from '@/components/pc/assets/Pagination'

export default {
  mixins: [InquiryNew],
  components: {
    SignInInquiry,
    InquiryItem,
    Pagination
  }
}
</script>
