<template>
  <div id="container" class="mypage">
    <!-- order detial -->
    <div class="wrap">

      <!-- ↓↓↓↓↓ wrap_category ↓↓↓↓↓ -->
      <BreadCrumbs breadCrumbs="1：1 お問い合わせ履歴"></BreadCrumbs>
      <!-- ↑↑↑↑↑ wrap_category ↑↑↑↑↑ -->

      <!-- ↓↓↓↓↓ mypage-content ↓↓↓↓↓ -->
      <div class="mypage-content">
        <h1>1：1 お問い合わせ履歴</h1>
        <div class="qa_area">
          <button class="mypage-consult_information" @click.prevent="goRegister">1：1 お問い合わせ</button>
          <div class="table_wrap" v-if="inquiries && inquiries.length">
            <table class="table_data">
              <colgroup>
                <col style="width: 16%;">
                <col style="width: 58%;">
                <col style="width: 15%;">
                <col style="width: 10%;">
              </colgroup>
              <thead>
                <tr>
                  <th>カテゴリー</th>
                  <th>タイトル</th>
                  <th>登録日</th>
                  <th>ステータス</th>
                </tr>
              </thead>
              <tbody :class="{have_none:currentIndex!==index}" v-for="(inquiryItem, index) in inquiries" :key="index">
                <tr @click="open(index)">
                  <th class="qa-th-font_500">{{ inquiryItem.inquiryType.inquiryTypeName }}</th>
                  <th class="qa_area_text_left">
                    <p class="ellipsis inquiry_ttl">{{ inquiryItem.inquiryTitle | toHtml }}</p>
                  </th>
                  <th class="qa-th-font_color_999">{{ inquiryItem.registerYmdt | dateFormatStr('yyyy-MM-dd hh:mm') }}</th>
                  <th :class="{'qa-th-font_bold': true, 'green_font': !inquiryStatus(inquiryItem), 'qa-th-font_color_ababab': inquiryStatus(inquiryItem) }">{{inquiryStatus(inquiryItem)?'未回答':'回答済み'}}</th>
                </tr>
                <tr class="qa_area_have">
                  <td colspan="5">
                    <div class="qa_area_expansion">
                      <div class="qa_area_expansion_content have_border">
                        <p>
                          <span>Q</span>{{ inquiryItem.inquiryTitle | toHtml}}
                        </p>
                        <ul class="l-15">
                          <li>
                            <pre v-html="getTypeHtml(inquiryItem)"></pre>
                          </li>
                          <MoreView :MoreViewIsOpen="MoreViewIsOpen" :content="inquiryItem.inquiryContent" />
                          <li class="amendment_deletion" v-if="!inquiryItem.answer">
                            <button @click.prevent="openEdit(inquiryItem)">修正</button>
                            <button @click.prevent="deleteInquiry(inquiryItem.inquiryNo)">削除</button>
                          </li>
                        </ul>
                        <ul class="review_pic open cf">
                          <li v-for="(imageUrl, index) in inquiryItem.imageUrls" :key="index">
                            <div class="thumbnail" @click.prevent="goImgPopup(index, inquiryItem.imageUrls)">
                              <img class="item_img" :src="imageUrl">
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="qa_area_expansion" v-if="inquiryItem.answer">
                      <div class="qa_area_expansion_content">
                        <p class="green_font">
                          <span>A</span>LINE FRIENDSからのご回答
                        </p>
                        <ul class="l-15">
                          <MoreView :MoreViewIsOpen="MoreViewIsOpen" :content="inquiryItem.answer.answerContent" isRichText="true" />
                          <li class="qa_1_data">{{inquiryItem.answer.answerRegisterYmdt | dateFormatStr('yyyy-MM-dd hh:mm:ss')}}</li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <pagination class="qa_area_page_margin" v-model="currentPage" :total="totalCount || 1" :limit="20" @change="pageChange(currentPage)" />
          </div>
          <div class="table_data qa_1_none" v-else>
            <div class="qa_1_img_none">
              <img src="@/assets/img/order/img_none.png" alt="">
            </div>
            <p class="qa_1_text_none">作成した１：１お問い合わせがありません。</p>
          </div>
        </div>
      </div>
      <!-- ↑↑↑↑↑ mypage-content ↑↑↑↑↑ -->
    </div>
    <!-- ↑↑↑↑↑ wrap ↑↑↑↑↑ -->
    <inquiry-edit :inquiry="editInquiry" v-if="isOpenEdit" @close="closePopup" />
    <template v-if="isOpenImgPopup">
      <ReviewImgPopup ref="imgPopup" :images="images" :num="initialSlide" @close="closePopup"></ReviewImgPopup>
    </template>
  </div>
</template>
<script>
import InquiryEdit from './InquiryEdit'
import BreadCrumbs from '@/components/common/BreadCrumbs'
import Pagination from '@/components/common/Pagination'
import { mapState } from 'vuex'
import { Confirm, Alert } from '@/components/common/modal'
import ReviewImgPopup from '@/components/common/ReviewImgPopup'
import MoreView from '@/components/common/MoreView.vue'
import * as $ from 'jquery'
import { toHtml } from '@/utils/utils'
export default {
  name: 'ProfileInquiry',
  data () {
    return {
      isOpenEdit: false,
      editInquiry: null,
      currentPage: 1,
      currentIndex: -1,
      initialSlide: 0,
      images: [],
      isOpenImgPopup: false,
      MoreViewIsOpen: false
    }
  },
  components: {
    BreadCrumbs,
    Pagination,
    InquiryEdit,
    ReviewImgPopup,
    MoreView
  },
  computed: {
    ...mapState('profileinquiry', ['inquiries', 'totalCount'])
  },
  methods: {
    goImgPopup (index, imageUrls) {
      $('html, body').css({ overflow: 'hidden' })
      this.initialSlide = index + 1
      this.images = imageUrls
      this.isOpenImgPopup = true
      this.$nextTick(() => {
        this.$refs.imgPopup.swiperSlideTo(index)
      })
    },
    open (idx) {
      this.MoreViewIsOpen = !this.MoreViewIsOpen
      if (this.currentIndex === idx) {
        this.currentIndex = -1
        this.MoreViewIsOpen = false
      } else {
        this.currentIndex = idx
      }
    },
    closePopup () {
      this.isOpenEdit = false
      this.isOpenImgPopup = false
      $('html, body').css({ overflow: '' })
    },
    openEdit (inquiry) {
      $('html, body').css({ overflow: 'hidden' })
      this.isOpenEdit = true
      inquiry.inquiryContent = toHtml(inquiry.inquiryContent)
      this.editInquiry = inquiry
    },
    inquiryStatus (inquiryItem) {
      return inquiryItem.inquiryStatus === 'ASKED' || inquiryItem.inquiryStatus === 'IN_PROGRESS'
    },
    async pageChange (page) {
      this.currentPage = page
      this.currentIndex = -1
      await this.$store.dispatch('profileinquiry/fetchInquiries', { pageNumber: page })
    },
    goRegister () {
      this.$router.push({
        path: `/etc/inquiry`
      })
    },
    deleteInquiry (inquiryNo) {
      Confirm('1：1お問い合わせを削除しますか?').then((res) => {
        if (res) {
          this.$store.dispatch('profileinquiry/deleteInquiry', inquiryNo).then((ret) => {
            if (!ret) {
              Alert({ message: '削除されました。' }).then(() => {
                this.currentIndex = -1
              })
            }
          })
        }
      })
    },
    getTypeHtml (inquiry) {
      let html = inquiry.inquiryType.inquiryTypeName
      if (inquiry.inquiryType.inquiryTypeName === '商品' && inquiry.productName) {
        html += ` (<a href="/product/detail/${inquiry.productNo}">${inquiry.productName}</a>)`
      } else if (inquiry.inquiryType.inquiryTypeName === '注文/決済' && inquiry.orderNo) {
        html += ` (<a href="/mypage/orderdetail/${inquiry.orderNo}">${inquiry.orderNo}</a>)`
      } else {
        html += ''
      }
      return html
    }
  }
}
</script>
<style scoped>
.table_data tbody {
  cursor: pointer;
}
</style>
