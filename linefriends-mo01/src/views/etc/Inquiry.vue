<template>
  <div id="container" class="cs-1v1">
    <sub-header title="サポート" />
    <div class="cs-1v1-wrap">
      <div class="cs_menu_wrap">
        <ul class="cs_nav_menu">
          <li>
            <router-link to="/m/etc/faq" class="cs-fag-new_font">FAQ</router-link>
          </li>
          <li class="cs_active pl-2_4">
            <router-link to="/m/etc/inquiry">1：1お問い合わせ</router-link>
          </li>
          <li class="pl-2_4">
            <router-link to="/m/etc/notice">お知らせ</router-link>
          </li>
        </ul>
      </div>

      <div class="cs-1v1-detail-block">
        <div class="cs-1v1-attention cs-1v1-mt_3">
          登録した１：1お問い合わせの内容及び返信は<br>
          <router-link to="/m/mypage/inquiry">「マイページ &gt; 1：1お問い合わせ」</router-link>からご確認ください。
        </div>
        <p class="cs-1v1-inquiry-category-title">カテゴリー <span class="cs-1v1-point">.</span></p>
        <div class="cs-1v1-inquiry-category cs-1v1-mt_3">
          <div :class="{bx_select:true, 'on':isOpen}">
            <div class="txt_select" @click.prevent="openInquiryType">
              <span class="select_vle">{{currentInquiryType.inquiryTypeName}}</span>
              <span class="ico_arrow">openSelect</span>
            </div>
            <ul class="lst_select_content">
              <li class="select_vle" v-for="(type,key) in inquiryType" :key=key :value="type.inquiryTypeNo">
                <a @click.prevent="selectedType(type)">{{type.inquiryTypeName}}</a>
              </li>
            </ul>
          </div>
        </div>
        <p class="cs-1v1-inquiry-category-title" v-if="currentInquiryType.inquiryTypeName === '商品'">商品選択</p>
        <p class="cs-1v1-inquiry-category-title" v-if="currentInquiryType.inquiryTypeName === '注文/決済'">注文選択</p>
        <div class="cs-1v1-product-select" v-if="currentInquiryType.inquiryTypeName === '商品'">
          <input type="text" placeholder="お問い合わせしたい商品を選択してください。" class="cs-1v1-select-ipt" v-model="selectedGood.productName" readonly>
          <button class="btn cs-1v1-select-btn btn_primary" @click.prevent="goPopup('good')">選択する</button>
        </div>
        <div class="cs-1v1-product-select" v-if="currentInquiryType.inquiryTypeName === '注文/決済'">
          <input type="text" placeholder="お問い合わせしたい注文を選択してください。" class="cs-1v1-select-ipt" v-model="selectedOrder.orderNo" readonly>
          <button class="btn cs-1v1-select-btn btn_primary" @click.prevent="goPopup('order')">選択する</button>
        </div>
        <div class="cs-1v1-select-check">
          <span class="bx_input" v-if="currentInquiryType.inquiryTypeName === '商品'">
            <input id="personal-1" type="checkbox" v-model="goodUnSelect" @click="clickCheckBox()">
            <label for="personal-1" class="cs-1v1-product-select-txt">商品を選択しない</label>
          </span>
          <span class="bx_input" v-if="currentInquiryType.inquiryTypeName === '注文/決済'">
            <input id="personal-2" type="checkbox" v-model="orderUnSelect" @click="clickCheckBox()">
            <label for="personal-2" class="cs-1v1-product-select-txt">注文を選択しない</label>
          </span>
        </div>
        <p class="cs-1v1-inquiry-category-title">タイトル <span class="cs-1v1-point">.</span></p>
        <div class="cs-1v1-inquiry-input cs-1v1-mt_3">
          <input type="text" maxlength="200" placeholder="タイトルを入力してください。" v-model="inquiryTitle">
        </div>
        <p class="cs-1v1-inquiry-category-title">内容 <span class="cs-1v1-point">.</span> </p>

        <div class="cs-1v1-inquiry-content cs-1v1-mt_3">
          <div class="bx_write bx_write_placeholder">
            <textarea class="text_area" @focus="isFocus = true" @blur="isFocus = false" v-model="inquiryContent" maxlength="2000"></textarea>
            <div v-if="!inquiryContent && !isFocus" class="text_area_placeholder" v-html="textAreaplaceholder">
            </div>
          </div>
        </div>
        <p class="cs-1v1-inquiry-category-title">添付ファイル</p>
        <div class="cs-1v1-file-select">
          <button class="btn btn_primary" @click="$refs.file.click()">ファイル選択</button>
          <input ref="file" type="file" @change="addFile" class="file" style="display: none;" multiple>
        </div>
        <div class="cs-1v1-file-select-result" v-if="file && file.length > 0">
          <ul class="cs-1v1-file-list cf">
            <li v-for="(image, key) in file" :key="key">
              <a href="#">
                <div class="thumbnail"><img :src="image.url" alt=""></div>
                <p class="pic-close" @click.prevent="removeFile(key)"><span>x</span></p>
              </a>
            </li>
          </ul>
        </div>
        <div class="cs-1v1-file-notes cs-1v1-mt_3">
          最大5件までアップロードできます。 <br>
          (jpg, png, gif 形式の画像ファイル)
        </div>

        <p class="cs-1v1-inquiry-category-title">返事のお知らせ</p>
        <div class="cs-1v1-reply">
          <span class="bx_input size_l">
            <input id="personal-2" type="checkbox" v-model="answerEmailSendYn">
            <label for="personal-2" class="cs-1v1-file-select-txt">メールアドレス(ID)</label>
          </span>
        </div>
        <p class="cs-1v1-up-email" v-if="profile">{{ profile.email }}</p>
        <div class="cs-1v1-btns">
          <button class="btn" @click.prevent="cancel">キャンセル</button>
          <button class="btn btn_green" @click.prevent="submit">登録</button>
        </div>
      </div>
      <good-select v-if="isOpenGoodSelector" @closePopup="closePopup" @setSelectedGood="setSelectedGood" />
      <order-select v-if="isOpenOrderSelector" @closePopup="closePopup" @setSelectedOrder="setSelectedOrder" />
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/header/SubHeader'
import GoodSelect from '@/components/etc/GoodSelect'
import OrderSelect from '@/components/etc/OrderSelect'
import { mapState, mapGetters } from 'vuex'
import { Alert } from '@/components/common/modal'
export default {
  name: 'Inquery',
  components: {
    SubHeader,
    GoodSelect,
    OrderSelect
  },
  data: function () {
    return {
      regist: false,
      file: [],
      isOpen: false,
      currentInquiryType: this.inquiryType ? this.inquiryType[0] : 0,
      inquiryContent: '',
      inquiryTitle: '',
      answerEmailSendYn: false,
      uploadFile: [],
      originalFileName: [],
      uploadedFileName: [],
      redirect: `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`,
      goodUnSelect: false,
      orderUnSelect: false,
      selectedGood: {
        productName: '',
        productNo: ''
      },
      selectedOrder: {
        orderNo: ''
      },
      isOpenGoodSelector: false,
      isOpenOrderSelector: false,
      isFocus: false
    }
  },
  methods: {
    complete () {
      this.regist = false
    },
    closeRegist () {
      this.regist = false
    },
    openInquiryType () {
      this.isOpen = !this.isOpen
    },
    selectedType (type) {
      this.isOpen = false
      this.currentInquiryType = type
      this.selectedGood.productName = ''
      this.selectedGood.productNo = ''
      this.selectedOrder.orderNo = ''
      this.goodUnSelect = false
      this.orderUnSelect = false
    },
    addFile () {
      const files = Array.from(this.$refs.file.files)
      if (files.length + this.file.length > 5) {
        Alert('最大5件までアップロードできます。')
        return false
      }
      files.forEach((file) => {
        this.uploadFile.push(file)
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          this.$refs.file.value = null

          if (file.size > 10485760) { // 1MB
            Alert('各画像は、最大10MBまで登録可能です。')
            return false
          }

          if (file.type.split('image').length === 1) {
            Alert('画像ファイルのみ登録可能です。')
            return false
          }

          this.file.push({
            url: e.target.result,
            original: file
          })
          this.originalFileName.push(file.name)
        }
      })
    },
    removeFile (key) {
      this.file.splice(key, 1)
      this.uploadFile.splice(key, 1)
      this.originalFileName.splice(key, 1)
    },
    submit () {
      let msg = this.checkForm()
      if (msg) {
        Alert(msg)
      } else {
        Promise.all(this.uploadFile.map(file => {
          const data = new FormData()
          data.append('file', file)
          return this.$store.dispatch('common/uploadImages', data)
        })).then(ret => {
          const urls = ret.map(res => res.data[0].uploadedFileName)
          if (urls) {
            this.uploadedFileName = urls
          }
          const iparam = {
            inquiryTypeNo: this.currentInquiryType.inquiryTypeNo,
            inquiryContent: this.inquiryContent,
            inquiryTitle: this.inquiryTitle,
            answerEmailSendYn: this.answerEmailSendYn,
            originalFileName: this.originalFileName,
            uploadedFileName: this.uploadedFileName,
            productNo: this.selectedGood.productNo,
            orderNo: this.selectedOrder.orderNo
          }

          this.$store.dispatch('inquiry/signInInquiries', iparam).then(() => {
            Alert({
              title: '1：1お問い合わせ',
              message: '1：1お問い合わせが登録されました。'
            }).then(() => {
              this.$router.push({
                path: `/m/mypage/inquiry`
              })
            })
          })
        })
      }
    },
    checkForm () {
      let message = ''
      if (!this.currentInquiryType) {
        message = 'カテゴリーを選択してください'
      }
      if (message === '' && (this.currentInquiryType.inquiryTypeName === '商品') && !this.goodUnSelect) {
        if (!this.selectedGood.productName) {
          message = '商品を選択してください。'
        }
      }
      if (message === '' && (this.currentInquiryType.inquiryTypeName === '注文/決済') && !this.orderUnSelect) {
        if (!this.selectedOrder.orderNo) {
          message = '注文を選択してください'
        }
      }
      if (message === '' && !this.inquiryTitle) {
        message = 'タイトルを入力してください'
      }
      if (message === '' && !this.inquiryContent) {
        message = '内容を入力してください'
      }

      return message
    },
    cancel () {
      this.init()
    },
    clickCheckBox () {
      if (this.currentInquiryType.inquiryTypeName === '商品') {
        this.goodUnselect = !this.goodUnselect
        if (!this.goodUnSelect) {
          this.selectedGood = {
            productName: '',
            productNo: ''
          }
        }
      }
      if (this.currentInquiryType.inquiryTypeName === '注文/決済') {
        this.orderUnSelect = !this.orderUnSelect
        if (this.orderUnSelect) {
          this.selectedOrder.orderNo = ''
        }
      }
    },
    goPopup (type) {
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
    },
    init () {
      this.file = []
      this.uploadFile = []
      this.uploadedFileName = []
      this.originalFileName = []
      this.inquiryContent = ''
      this.inquiryTitle = ''
      this.currentInquiryType = this.inquiryType[0]
      this.answerEmailSendYn = false
      this.goodUnSelect = false
      this.orderUnSelect = false
      this.selectedGood = {
        productName: '',
        productNo: ''
      }
      this.selectedOrder.orderNo = ''
    },
    setSelectedGood (item) {
      this.selectedGood = item
      this.goodUnSelect = false
    },
    setSelectedOrder (item) {
      this.selectedOrder = item
      this.orderUnSelect = false
    }
  },
  computed: {
    ...mapGetters('common', ['inquiryType']),
    ...mapState('profile', ['profile']),
    textAreaplaceholder () {
      let content = ''
      if (this.currentInquiryType.inquiryTypeName === '商品') {
        content = `- 商品についてご不明な点がございましたら、お問い合わせしてください。<br>
- 商品の入荷予定についてのお問い合わせは、お答えできませんので予めご了承下さい。`
      }
      if (this.currentInquiryType.inquiryTypeName === '注文/決済') {
        content = `- 注文状態が「注文完了」の場合、「マイページ＞注文/配送」よりキャンセルすることができます。<br>
- 注文状態が「商品準備中」以降の段階では、商品出荷の作業が行っており、ご注文のキャンセルは承りできません。`
      }
      if (this.currentInquiryType.inquiryTypeName === '配送') {
        content = `- 配送状態は「マイページ＞注文/配送」よりご確認いただけます。`
      }
      if (this.currentInquiryType.inquiryTypeName === '交換/返品/AS') {
        content = `- 迅速に対応いたしますので、下記の注文情報をご作成ください。<br>
「オンラインストアの注文情報」<br>
  受付内容 : 交換、返品、AS中から選択<br>
  商品名/数量 : <br>
  詳細内容 :
- 瑕疵のある商品について、画像を添付してください。<br>
- LINE Friends online、 Flagship store 以外の購入商品の場合、ご購入先にお問い合わせください。`
      }
      if (this.currentInquiryType.inquiryTypeName === '会員') {
        content = `- 広告、著作権侵害、誹謗、淫乱などお問い合わせと関係ない内容は、削除されますのであらかじめご了承ください。<br>
- お客様ご相談と関係ない個人情報などを記入しないよう注意してください。`
      }
      if (this.currentInquiryType.inquiryTypeName === '偽物申告') {
        content = `偽物を見つけて通報したい場合に、URLと画像を添付してください。`
      }
      if (this.currentInquiryType.inquiryTypeName === 'ETC') {
        content = `- 広告、著作権の侵害、誹謗中傷、淫乱などお問い合わせと関係のない文章は任意削除となることをお知らせいたします。<br>
- お客様ご相談と関係ない個人情報などを記入しないよう注意してください。`
      }
      return content
    }
  },
  mounted () {
    this.init()
    // this.isTextEmpty()
  }
}
</script>
