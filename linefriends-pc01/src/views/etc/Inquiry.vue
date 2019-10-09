<template>
  <div id="container" class="cs">
    <!-- order detial -->
    <div class="wrap">
      <div class="cs-content">
        <h1>サポート</h1>
        <customer-service-tab activeType="inquiry" />
        <div class="txt_ex">
          <p class="txt">登録した１：1お問い合わせの内容及び返信は<router-link to="/mypage/inquiry">「マイページ > 1：1お問い合わせ」</router-link>からご確認ください。</p>
        </div>
        <inquiry-register :inquiryType="inquiryType" :profile="profile" @goPopup="goPopup" :inquiry="inquiry" @setInquiry="setInquiry" />
        <ul class="btn_list">
          <li>
            <button class="btn" @click.prevent="cancel">キャンセル</button>
          </li>
          <li>
            <button class="btn btn_green" @click.prevent="submit">登録</button>
          </li>
        </ul>

      </div>
      <!-- ↑↑↑↑↑ cs-content ↑↑↑↑↑ -->
    </div>
    <good-select v-show="isOpenGoodSelector" @closePopup="closePopup" @setSelectedGood="setSelectedGood" />
    <order-select v-show="isOpenOrderSelector" @closePopup="closePopup" @setSelectedOrder="setSelectedOrder" />
    <!-- ↑↑↑↑↑ wrap ↑↑↑↑↑ -->
  </div>
</template>
<script>
import InquiryRegister from '@/components/etc/InquiryRegister'
import GoodSelect from '@/components/etc/GoodSelect'
import OrderSelect from '@/components/etc/OrderSelect'
import CustomerServiceTab from '@/components/etc/CustomerServiceTab'
import { mapState, mapGetters } from 'vuex'
import { Alert } from '@/components/common/modal'
import * as $ from 'jquery'
export default {
  name: 'Inquery',
  components: {
    GoodSelect,
    OrderSelect,
    CustomerServiceTab,
    InquiryRegister

  },
  data: function () {
    return {
      inquiry: {
        currentInquiryType: this.inquiryType ? this.inquiryType[0] : 0,
        inquiryContent: '',
        inquiryTitle: '',
        answerEmailSendYn: false,
        file: [],
        selectedGood: {
          productName: '',
          productNo: ''
        },
        selectedOrder: {
          orderNo: ''
        },
        goodUnSelect: false,
        orderUnSelect: false
      },
      uploadedFileName: [],
      isOpenGoodSelector: false,
      isOpenOrderSelector: false
    }
  },
  methods: {
    submit () {
      let msg = this.checkForm()
      if (msg) {
        Alert(msg)
      } else {
        Promise.all(this.inquiry.file.map(file => {
          const data = new FormData()
          data.append('file', file.original)
          return this.$store.dispatch('common/uploadImages', data)
        })).then(ret => {
          const urls = ret.map(res => res.data[0].uploadedFileName)
          const names = this.inquiry.file.map(file => file.originalFileName)
          if (urls) {
            this.uploadedFileName = urls
          }
          const iparam = {
            inquiryTypeNo: this.inquiry.currentInquiryType.inquiryTypeNo,
            inquiryContent: this.inquiry.inquiryContent,
            inquiryTitle: this.inquiry.inquiryTitle,
            answerEmailSendYn: this.inquiry.answerEmailSendYn,
            originalFileName: names,
            uploadedFileName: this.uploadedFileName,
            productNo: this.inquiry.selectedGood.productNo,
            orderNo: this.inquiry.selectedOrder.orderNo
          }

          this.$store.dispatch('profileinquiry/signInInquiries', iparam).then(() => {
            Alert({
              title: '1：1お問い合わせ',
              message: '1：1お問い合わせが登録されました。'
            }).then(() => {
              this.$router.push({
                path: `/mypage/inquiry`
              })
            })
          })
        })
      }
    },
    checkForm () {
      let message = ''
      if (!this.inquiry.currentInquiryType) {
        message = 'カテゴリーを選択してください'
      }
      if (message === '' && (this.inquiry.currentInquiryType.inquiryTypeName === '商品') && !this.inquiry.goodUnselect) {
        if (!this.inquiry.selectedGood.productName) {
          message = '商品を選択してください'
        }
      }
      if (message === '' && (this.inquiry.currentInquiryType.inquiryTypeName === '注文・お支払い') && !this.inquiry.orderUnselect) {
        if (!this.inquiry.selectedOrder.orderNo) {
          message = '注文を選択してください'
        }
      }
      if (message === '' && !this.inquiry.inquiryTitle) {
        message = 'タイトルを入力してください'
      }
      if (message === '' && !this.inquiry.inquiryContent) {
        message = '内容を入力してください'
      }

      return message
    },
    cancel () {
      this.init()
    },
    goPopup (type) {
      $('html, body').css({ overflow: 'hidden' })
      if (type === 'good') {
        this.isOpenGoodSelector = true
      }
      if (type === 'order') {
        this.isOpenOrderSelector = true
      }
    },
    closePopup () {
      this.isOpenGoodSelector = false
      this.isOpenOrderSelector = false
      $('html, body').css({ overflow: '' })
    },
    init () {
      this.inquiry.file = []
      this.inquiry.inquiryContent = ''
      this.inquiry.inquiryTitle = ''
      this.inquiry.currentInquiryType = this.inquiryType[0]
      this.inquiry.answerEmailSendYn = false
      this.inquiry.goodUnSelect = false
      this.inquiry.orderUnSelect = false
      this.selectedGood = {
        productName: '',
        productNo: ''
      }
      this.selectedOrder = {
        orderNo: ''
      }
    },
    setSelectedGood (item) {
      this.inquiry.goodUnSelect = false
      this.inquiry.selectedGood = item
    },
    setSelectedOrder (item) {
      this.inquiry.orderUnSelect = false
      this.inquiry.selectedOrder = item
    },
    setInquiry (inquiry) {
      this.inquiry = inquiry
    }
  },
  computed: {
    ...mapGetters('common', ['inquiryType']),
    ...mapState('profile', ['profile'])
  },
  mounted () {
    this.init()
  }
}
</script>
