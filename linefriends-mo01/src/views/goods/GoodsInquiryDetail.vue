<template>
  <div id="container" class="detail">
    <div class="qa">
      <sub-product-header :showClose="true" :title="this.isEdit ? '商品お問い合わせ修正' : '商品お問い合わせ登録' " :showBack="false" @close="HandleClose" />
      <!-- ↓↓↓↓↓ qa_wrapper ↓↓↓↓↓ -->
      <div class="detail_qa_wrapper">
        <template v-if="routeFlag">
          <div class="info">
            <div :class="{bx_select:true}">
              <div class="txt_select">
                <span class="select_vle">商品</span>
                <!-- <span class="ico_arrow">リストを開く</span> -->
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <inquiry-select id="type" v-model="form.type" :options="malls.productInquiryType" />
        </template>
        <!-- <div class="info">
          <app-textarea class="goods-qna__box-textarea" v-model="form.content" :height="24" :placeholder="placeHold" :max-length="1000" />
        </div> -->
        <div class="info">
          <div class="bx_write bx_write_placeholder">
            <textarea class="text_area" id="test_new_line" @blur="blurText" @focus="focusText" v-model="form.content" maxlength="1000"></textarea>
            <div v-if="isTextAreaEmpty" class="text_area_placeholder">
              - 商品についてご不明な点がございましたらご連絡ください。検討後、お答えいたします。<br>
              - 電話番号やメールアドレスなど、顧客様情報の投稿はお控えください。
            </div>
            <span class="text_count"><span class="num">{{this.form.content.length}}</span>/1000</span>
          </div>
        </div>
        <div class="info">
          <p class="hint">
            - 注文に関するお問い合わせは<a href="/m/etc/inquiry">1:1お問い合わせ</a>メニューをご利用
            ください。
          </p>
        </div>
        <p class="btn_bt_login">
          <button class="btn btn_green" @click="submit">
            <span v-if="this.isEdit">修正</span>
            <span v-else>登録</span>
          </button>
        </p>
      </div>
      <!-- ↑↑↑↑↑ qa_wrapper ↑↑↑↑↑ -->
    </div>
  </div>
</template>
<script>
import SubProductHeader from '@/components/header/SubProductHeader'
import InquirySelect from '@/components/goods/select/InquirySelect'
import { mapState, mapActions } from 'vuex'
import { Alert, Confirm } from '@/components/common/modal'
import { toHtml } from '@/utils/utils'
export default {
  name: 'GoodsInquiryDetail',
  components: {
    SubProductHeader,
    InquirySelect
  },
  computed: {
    ...mapState('common', ['malls']),
    ...mapState('profile', ['profile']),
    ...mapState('productinquiry', ['inquiry']),
    checkRoutes () {
      return this.checkRoute
    },
    $route () {
      return this.$router.currentRoute
    },
    goodsNo () {
      return this.$route.params.goodsNo
    },
    inquiryNo () {
      return this.$route.params.inquiryNo
    },
    isEdit () {
      return this.inquiryNo !== undefined
    },
    isFromOrder () {
      return this.$store.state.route.from.name === 'OrderList' || this.$store.state.route.from.name === 'OrderDetail' || this.$store.state.route.from.name === 'Qa'
    }
  },
  data () {
    return {
      form: {
        type: 'PRODUCT',
        secreted: true,
        title: 'Title Example',
        content: '',
        inquiryNo: null
      },
      routeFlag: false,
      isTextAreaEmpty: false
    }
  },
  async mounted () {
    this.checkOutFrom()
    if (this.isEdit) {
      await this.fetchProductInquiryDetail({ productNo: this.goodsNo, inquiryNo: this.inquiryNo })
      this.inquiry.secreted = true
      this.inquiry.content = toHtml(this.inquiry.content)
      this.form = this.inquiry
    } else {
      this.form.productNo = this.goodsNo
      this.form.type = this.routeFlag ? 'PRODUCT' : this.malls.productInquiryType[0].value
    }
    // text_area_placeholder
    this.blurText()
  },
  methods: {
    ...mapActions('productinquiry', [
      'fetchProductInquiryDetail',
      'postProductInquiry',
      'putProductInquiry'
    ]),
    focusText () {
      this.isTextAreaEmpty = false
    },
    blurText () {
      if (!this.form.content) {
        this.isTextAreaEmpty = true
      }
    },
    checkOutFrom () {
      if (this.$route.query.from && (this.$route.query.from === 'GoodsInquiry' || this.$route.query.from === 'Order')) {
        this.routeFlag = true
      } else {
        this.routeFlag = false
      }
    },
    async submit () {
      if (this.form.content.trim() === '') {
        return Alert({
          title: '商品お問い合わせ',
          message: 'お問い合わせの内容を入力してください。'
        })
      } else if (this.form.content.length > 1000) {
        return Alert({
          title: '商品お問い合わせ',
          message: '商品お問い合わせについては、最大1000文字を入力することができます'
        })
      }
      Confirm({
        title: '商品お問い合わせ',
        message: this.isEdit ? 'お問い合わせを修正しますか？' : 'お問い合わせを登録しますか？'
      }).then((res) => {
        if (res) {
          if (this.isEdit) {
            let newData = {
              data: {
                title: this.form.title,
                content: this.form.content,
                secreted: this.routeFlag ? false : this.form.secreted,
                type: this.routeFlag ? 'PRODUCT' : this.form.type
              },
              inquiryNo: this.$route.params.inquiryNo,
              productNo: this.$route.params.goodsNo
            }
            this.form.inquiryNo = this.$route.params.inquiryNo
            this.putProductInquiry(newData).then(() => {
              Alert({ message: '修正されました。' })
            })
          } else {
            if (this.routeFlag) {
              this.form.secreted = false
            }
            this.postProductInquiry(this.form).then((res) => {
            })
          }
          if (this.isFromOrder) {
            this.$router.go(-1)
          } else {
            this.moveToGoodsDetail()
          }
        }
      })
    },
    moveToGoodsDetail (openInquiryNo) {
      let query = {
        tab: 'inquiry'
      }
      if (this.$route.query.currScroll) {
        query.currScroll = this.$route.query.currScroll
      }
      if (openInquiryNo) {
        query.openInquiryNo = openInquiryNo
      }
      this.$router.push({
        name: 'ProductDetail',
        goodsNo: this.goodsNo,
        query
      })
    },
    HandleClose () {
      if (this.$route.query && this.$route.query.tab) {
        this.$router.go(-3)
      } else if (this.$route.query && this.$route.query.from === 'GoodsInquiry') {
        let goodsNo = this.$route.params.goodsNo
        this.$router.push({ path: `/m/product/detail/${goodsNo}`, query: { from: 'GoodsInquiryDetail', currScroll: this.$route.query.currScroll, tab: 'inquiry' } })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
