<template>
  <div id="container" class="qa">
    <breadcrumb title="1：1 お問い合わせ履歴" v-if="!isOpenEdit" />
    <!-- ↓↓↓↓↓ qa_wrapper ↓↓↓↓↓ -->
    <div class="qa_wrapper contactUs" v-if="!isOpenEdit">
      <p class="btn_qa_contactUs">
        <button class="btn btn_primary size_m" @click="goRegister">1：1 お問い合わせ</button>
      </p>
      <div class="qa_none" v-if="!(inquiries && inquiries.length)">
        <div class="no_data">
          <div class="no_data_img"><img src="@/assets/img/common/img_no_data.png" alt=""></div>
          <p class="no_data_text qa_1v1_none">作成した 1:1 お問い合わせがありません。</p>
        </div>
      </div>
      <ul class="qa_list list_1v1_new" v-else>
        <li v-for="(inquiryItem, index) in inquiries" :key="index" :class="{open:currentIndex===index}">
          <div class="qa_item" @click.prevent="open(index)">
            <div class="qa_list-header">
              <p class="name_font_500">{{ inquiryItem.inquiryType.inquiryTypeName }}</p>
              <p :class="{status:true, 'font-green':!inquiryStatus(inquiryItem)}">{{inquiryStatus(inquiryItem)?'未回答':'回答済み'}}</p>
            </div>
            <div class="qa_list-body">
              <p class="title">{{ inquiryItem.inquiryTitle | toHtml }}</p>
              <p class="date">{{formatData(inquiryItem.registerYmdt)}}</p>
            </div>
          </div>
          <div class="comments-list">
            <div class="input-q">
              <p class="qa_title qa_q-title"><span class="write_grey_q">Q</span>{{ inquiryItem.inquiryTitle | toHtml }}</p>
              <p class="txt-content">
                <pre v-html="getTypeHtml(inquiryItem)"></pre>
              </p>
              <p class="txt-content">
                <MoreView :content="inquiryItem.inquiryContent" :MoreViewIsOpen="MoreViewIsOpen" />
              </p>
              <ul class="qa-goods-list cf">
                <li v-for="(imageUrl, index) in inquiryItem.imageUrls" :key="index">
                  <a @click.prevent="goImgPopup(index, inquiryItem.imageUrls)">
                    <div class="thumbnail"><img :src="imageUrl" alt=""></div>
                  </a>
                </li>
              </ul>
              <ul class="btn-list" v-if="!inquiryItem.answer">
                <li><button class="btn btn_primary size_xs" @click.prevent="openEdit(inquiryItem)">修正</button></li>
                <li><button class="btn btn_primary size_xs" @click.prevent="deleteInquiry(inquiryItem.inquiryNo)">削除</button></li>
              </ul>
            </div>
            <div class="input-a_new" v-if="inquiryItem.answer">
              <div class="qa_title qa_a-title"><span class="write_green_a">A</span>LINE FRIENDSからのご回答</div>
              <div class="txt-con">
                <MoreView :content="'<p>'+inquiryItem.answer.answerContent + '</p>'" :MoreViewIsOpen="MoreViewIsOpen" isRichText="true" />
                <span class="date">{{formatData(inquiryItem.answer.answerRegisterYmdt)}}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <mugen-scroll :handler="pageDown" :should-handle="showMugen && !pending.inquiries" :offsetTop="-3000">
        <div id="loader" v-show="showMugen">
          <div class="loader_img"></div>
        </div>
      </mugen-scroll>
    </div>
    <!-- ↑↑↑↑↑ qa_wrapper ↑↑↑↑↑ -->
    <inquiry-edit :inquiry="editInquiry" v-if="isOpenEdit" @close="closePopup" />
    <template v-if="isOpenImgPopup">
      <ReviewImgPopup ref="imgPopup" :images="images" :initialSlide="initialSlide" @close="closePopup"></ReviewImgPopup>
    </template>
  </div>
</template>
<script>
import InquiryEdit from './InquiryEdit'
import { mapState } from 'vuex'
import { Confirm, Alert } from '@/components/common/modal'
import Breadcrumb from '@/components/common/Breadcrumb'
import MugenScroll from '@/components/common/MugenScroll'
import ReviewImgPopup from '@/components/common/ReviewImgPopup'
import { dateFormatStrContainIOS } from '@/utils/dateUtils'
import MoreView from '@//components/common/MoreView.vue'
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
      isOpenImgPopup: false,
      initialSlide: 0,
      images: [],
      MoreViewIsOpen: false
    }
  },
  components: {
    Breadcrumb,
    MugenScroll,
    InquiryEdit,
    ReviewImgPopup,
    MoreView
  },
  computed: {
    ...mapState('profileinquiry', ['inquiries', 'totalCount', 'pending']),
    showMugen () {
      return this.inquiries && this.inquiries.length < this.totalCount
    }
  },
  methods: {
    goImgPopup (index, imageUrls) {
      this.initialSlide = index + 1
      this.images = imageUrls
      this.isOpenImgPopup = true
    },
    pageDown () {
      this.$store.dispatch('profileinquiry/fetchInquiriesMore')
    },
    open (idx) {
      this.MoreViewIsOpen = !this.MoreViewIsOpen
      if (this.currentIndex === idx) {
        this.currentIndex = -1
      } else {
        this.currentIndex = idx
      }
    },
    closePopup () {
      this.isOpenEdit = false
      this.isOpenImgPopup = false
      $('html, body').animate({ scrollTop: 0 })
    },
    openEdit (inquiry) {
      this.isOpenEdit = true
      inquiry.inquiryContent = toHtml(inquiry.inquiryContent)
      this.editInquiry = inquiry
    },
    inquiryStatus (inquiryItem) {
      return inquiryItem.inquiryStatus === 'ASKED' || inquiryItem.inquiryStatus === 'IN_PROGRESS'
    },
    formatData (str) {
      return dateFormatStrContainIOS(str, 'yyyy.MM.dd hh:mm')
    },
    goRegister () {
      this.$router.push({
        path: `/m/etc/inquiry`
      })
    },
    deleteInquiry (inquiryNo) {
      Confirm('1：1お問い合わせを削除しますか？').then((res) => {
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
        html += ` (<a href="/m/product/detail/${inquiry.productNo}">${inquiry.productName}</a>)`
      } else if (inquiry.inquiryType.inquiryTypeName === '注文/決済' && inquiry.orderNo) {
        html += ` (<a href="/m/mypage/orderdetail/${inquiry.orderNo}">${inquiry.orderNo}</a>)`
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
