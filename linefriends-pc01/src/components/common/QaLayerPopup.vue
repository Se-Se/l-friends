<template>
  <div class="popup-layer" v-if="isShow">
    <div class="popup_common qa_04_popup_size">
      <div class="popup_qa_login_content">
        <div class="contact_registration popup_qa_login_title">
          <h1>商品お問い合わせ{{showAddOrEdit?'登録':'修正'}}</h1>
        </div>
        <div class="popup_qa_login_select_box">
          <div class="bx_select size_m">
            <div class="txt_select popup_qa_login_select_txt">
              <span class="select_vle">商品</span>
              <!-- <span class="ico_arrow">リストを開く</span> -->
            </div>
            <ul class="lst_select_content" :style="openSelect ? 'display:block;' : 'display:none;'">
              <li v-for="(item,index) in showSelect" :key="index">
                <a href="#" @click.prevent="selectType(item.value)">{{item.label}}</a>
              </li>
            </ul>
          </div>
          <div class="popup_qa_login_write_box">
            <textarea-item v-model="form.add.content" :length="1000 > 0" :placeholder="placeHold" :max-length="1000" />
          </div>
          <div class="popup_qa_login_notes">
            - 注文に関するお問い合わせは<a href="/etc/inquiry">1:1お問い合わせ</a> メニューをご利用ください。
          </div>
        </div>
        <div class="popup_qa_btns">
          <button class="btn btn_green" @click="submit">{{showAddOrEdit?'登録':'修正'}}</button>
          <button class="btn_close" @click="handleClose">X</button>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>
<script>
import TextareaItem from './QaTextArea'
import { mapState, mapActions } from 'vuex'
import { Alert, Confirm } from '@/components/common/modal'

export default {
  name: 'QaLayerPopup',
  watch: {
    theInquiryNo (newV, oldV) {
      this.form.add.content = newV.content
      this.form.add.type = 'PRODUCT'
    },
    visible (next) {
      this.addType = next
    },
    data (next) {
      this.select = next
    }
  },
  data () {
    return {
      placeHold: `-商品についてご不明な点がございましたらご連絡ください。検討後、お答えいたします。\n-電話番号やメールアドレスなど、顧客様情報の投稿はお控えください。`,
      content: this.contentText,
      select: {},
      form: {
        add: {
          productNo: 0,
          type: null,
          secreted: false,
          title: '',
          content: '',
          parentInquiryNo: 0,
          email: ''
        }
      },
      addType: '',
      openSelect: false
    }
  },
  mounted () {
    this.form.add.productNo = this.$route.params.goodsNo || this.productNo
    this.form.add.content = ''
    this.form.add.type = 'PRODUCT'
  },
  props: {
    theInquiryNo: {
      required: false
    },
    title: {
      type: String,
      required: false
    },
    visible: {
      type: String,
      required: false
    },
    data: {
      type: Array,
      required: false
    },
    productNo: {
      required: false
    },
    type: {
      required: false
    }
  },
  components: {
    TextareaItem
  },
  computed: {
    ...mapState('common', ['malls']),
    ...mapState('profile', ['profile']),
    inquiryNo () {
      return this.$route.params.inquiryNo
    },
    showSelect () {
      return this.data
    },
    isShow () {
      if (this.visible !== null) {
        return true
      } else {
        return false
      }
    },
    showAddOrEdit () {
      if (this.addType === 'contactAdd') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions('productinquiry', [
      'postProductInquiry',
      'putProductInquiry']
    ),
    changeType () {
      this.openSelect = !this.openSelect
    },
    inquiryType (type) {
      let lable = '商品'
      if (this.data) {
        this.data.forEach(item => {
          if (item.value === type) {
            lable = item.label
          }
        })
      }
      return lable
    },
    selectType (type) {
      this.form.add.type = 'PRODUCT'
      this.openSelect = false
    },
    addNew () {
      this.form.add.content = ''
      this.form.add.type = 'PRODUCT'
    },
    submit () {
      if (!this.form.add.content || (this.form.add.content.trim() === '')) {
        return Alert({
          title: '商品お問い合わせ',
          message: 'お問い合わせ内容を入力してください。'
        })
      } else if (this.form.add.content && this.form.add.content.length > 1000) {
        return Alert({
          title: '商品お問い合わせ',
          message: '商品お問い合わせについては、最大1000文字を入力することができます'
        })
      }
      Confirm({
        title: '商品お問い合わせ',
        message: !this.showAddOrEdit ? 'お問い合わせを修正しますか？' : 'お問い合わせを登録しますか？'
      }).then((res) => {
        if (res) {
          this.form.add.email = this.profile.email
          if (!this.showAddOrEdit) {
            this.form.add.inquiryNo = this.theInquiryNo.inquiryNo
            this.putProductInquiry(this.form.add).then(() => {
              Alert({
                message: '修正されました。'
              }).then(() => {
                this.form.add.content = ''
                this.form.add.type = 'PRODUCT'
                this.handleClose()
              })
            })
          } else {
            this.postProductInquiry(this.form.add).then(() => {
              this.form.add.content = ''
              this.form.add.type = 'PRODUCT'
              this.handleClose()
            })
          }
        }
      })
    },
    handleClose () {
      if (this.showAddOrEdit) {
        this.form.add.content = ''
        this.form.add.type = 'PRODUCT'
      } else {
        this.form.add.content = this.theInquiryNo.content
        this.form.add.type = 'PRODUCT'
      }
      this.$emit('close')
      this.openSelect = false
    },
    setProductNo (productNo) {
      this.form.add.productNo = productNo
    }
  },
  destroyed () {
    this.$store.commit('CLOSE_POP')
  }
}
</script>
<style  scoped>
#select {
  width: 608px;
  height: 100%;
  list-style: none;
  margin-left: -12px;
  position: absolute;
  border: none;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  padding-left: 12px;
}
.txt_select {
  width: 100%;
  height: 100%;
  list-style: none;
  position: absolute;
  border: none;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
}
</style>
