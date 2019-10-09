<template>
  <!-- ↓↓↓↓↓ popup ↓↓↓↓↓ -->
  <div class="popup-layer">
    <div class="popup_common qa_04_popup_size">
      <button class="btn_close" @click.prevent="$emit('closeQaPopup')">close</button>
      <div class="popup_qa_login_content">
        <div class="contact_registration popup_qa_login_title">
          <h1>商品お問い合わせ修正</h1>
        </div>
        <div class="popup_qa_login_select_box">
          <div class="bx_select size_m">
            <div class="txt_select popup_qa_login_select_txt">
              <span class="select_vle">{{ getInquiryType(qadata.type) }}</span>
            </div>
            <ul class="lst_select_content" :style="isOpen ? 'display:block;' : 'display:none;'">
              <li v-for="(item,index) in productInquiryTypes" :key="index">
                <a href="#" @click.prevent="selectType(item.value)">{{item.label}}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup_qa_login_write_box">
          <div class="bx_write">
            <textarea class="popup_qa_login_write" placeholder="- 商品についてご不明な点がございましたらご連絡ください。検討後、お答えいたします。
- 在庫状況・再入荷に関するお問い合わせには回答しかねますので、予めご了承ください。
- 広告、著作権侵害、いやがらせ、誹謗、わいせつなど、商品と関係ない内容投稿は任意に削除される可能性があります。
- 電話番号やメールアドレスなど、顧客様情報の投稿はお控えください。" v-model="qadata.content" maxlength="1000">
              </textarea>
            <span class="text_count"><span class="num">{{qadata.content.length}}</span> / 1000</span>
          </div>
        </div>
        <div class="popup_qa_login_notes">
          - 注文に関するお問い合わせは<a href="#" @click.prevent="oneToOne">お問い合わせ</a> メニューをご利用ください。
        </div>
        <div class="popup_qa_btns">
          <button class="btn btn_green" @click.prevent="upQa">修正</button>
        </div>

      </div>
    </div>
  </div>
  <!-- ↑↑↑↑↑ popup ↑↑↑↑↑ -->
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { Alert, Confirm } from '@/components/common/modal'

export default {
  data () {
    return {
      isOpen: false
    }
  },
  props: ['qadata'],
  computed: {
    ...mapGetters('common', ['productInquiryTypes'])
  },
  methods: {
    ...mapActions('mypage', ['updateQa']),
    getInquiryType (type) {
      let lable = '商品お問い合わせ'
      if (this.productInquiryTypes) {
        this.productInquiryTypes.forEach(item => {
          // console.log(item.value, lable)
          if (item.value === type) {
            lable = item.label
          }
        })
      }
      return lable
    },
    changeType () {
      this.isOpen = !this.isOpen
    },
    selectType (type) {
      this.qadata.type = type
      this.isOpen = false
    },
    oneToOne (type) {
      this.$router.push({
        path: '/mypage/inquiry'
      })
    },
    upQa () {
      if (!this.qadata.content) {
        Alert('お問い合わせの内容を入力してください。')
        return
      }
      Confirm('お問い合わせを修正しますか。？').then((res) => {
        if (res) {
          // console.info('click yes')
          this.ConfirmUpdateQa()
        }
      })
    },
    async ConfirmUpdateQa () {
      // console.log(this.qadata)
      let ret = await this.updateQa(this.qadata)
      if (ret) {
        Alert({ message: '修正されました。' }).then(() => {
          this.$emit('closeQaPopup')
        })
      }
    }
  },
  destroyed () {
    this.$store.commit('CLOSE_POP')
  }
}
</script>
