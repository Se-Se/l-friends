<template>
  <div id="container" class="detail">
    <div class="qa">
      <div class="wrap_category">
        <h2>1：1お問い合わせ</h2>
        <div class="category_right">
          <a @click.prevent="close" class="btn_close"></a>
        </div>
      </div>

      <!-- ↓↓↓↓↓ qa_wrapper ↓↓↓↓↓ -->
      <div class="detail_qa_wrapper">
        <div class="info">
          <p class="contact-name">カテゴリー<span>.</span></p>
          <div class="bx_select">
            <div :class="{txt_select:true,font_have:true,'on':isOpen}">
              <span class="select_vle">{{inquiry.inquiryType.inquiryTypeName}}</span>
              <span class="ico_arrow">商品</span>
            </div>
            <!-- <ul class="lst_select_content">
                        <li v-for="(type,key) in inquiryType" :key=key :value="type.inquiryTypeNo">
                          <a @click.prevent="selectedType(type)">{{type.inquiryTypeName}}</a>
                        </li>
                      </ul> -->
          </div>
        </div>

        <div class="info mar-t-3" v-if="inquiry.inquiryType.inquiryTypeName === '商品'">
          <p class="contact-name">商品選択<span>.</span></p>
          <dl class="qa-goods-select">
            <dt><input type="text" placeholder="問い合わせたい商品を選択…" v-model="inquiry.productName" readonly></dt>
            <dd><button class="btn btn_primary">選択する</button></dd>
          </dl>
          <div class="qa-goods-check">
            <span class="bx_input">
              <input id="personal-2" type="checkbox" v-model="goodUnSelect" onclick="return false;">
              <label for="personal-2">商品を選択しない</label>
            </span>
          </div>
        </div>
        <div class="info mar-t-3" v-if="inquiry.inquiryType.inquiryTypeName === '注文/決済'">
          <p class="contact-name">注文選択<span>.</span></p>
          <dl class="qa-goods-select">
            <dt><input type="text" placeholder="問い合わせたい注文を選択…" v-model="inquiry.orderNo" readonly></dt>
            <dd><button class="btn btn_primary">選択する</button></dd>
          </dl>
          <div class="qa-goods-check">
            <span class="bx_input">
              <input id="personal-2" type="checkbox" v-model="orderUnSelect" onclick="return false;">
              <label for="personal-2">商品を選択しない</label>
            </span>
          </div>
        </div>

        <div class="info mar-t-3">
          <p class="contact-name">タイトル<span>.</span></p>
          <div>
            <input type="text" placeholder="タイトルを入力してください" v-model="inquiry.inquiryTitle">
          </div>
        </div>

        <div class="info mar-t-3">
          <p class="contact-name">内容<span>.</span></p>
          <div class="bx_write contact-textarea bx_write_placeholder">
            <textarea class="text_area" @input="isTextEmpty" v-model="inquiry.inquiryContent" maxlength="2000"></textarea>
            <div v-if="isTextAreaEmpty" class="text_area_placeholder" v-html="textAreaplaceholder">
            </div>
          </div>
        </div>

        <div class="info mar-t-3">
          <p class="contact-name">添付ファイル</p>
          <div class="file_select">
            <button class="btn btn_primary" @click="$refs.file.click()">ファイル選択</button>
            <input ref="file" type="file" style="display: none;" @change="addFile" class="file" multiple>
          </div>
          <ul class="qa-goods-list cf">
            <li name="befor" v-for="(image, key) in inquiry.imageUrls" :key="key">
              <a>
                <div class="thumbnail">
                  <img :src="image">
                </div>
                <p class="pic-close" @click.prevent="removeUploadedFile(key)"><span>x</span></p>
              </a>
            </li>
            <li name="update" v-for="(image, key) in file" :key="key+5">
              <a>
                <div class="thumbnail">
                  <img :src="image.url">
                </div>
                <p class="pic-close" @click.prevent="removeFile(key)"><span>x</span></p>
              </a>
            </li>
          </ul>
          <p class="upload-notes">最大5件までアップロードできます。<br>(jpg, png, gif 形式の画像ファイル)</p>
        </div>
        <div class="info mar-t-3 last-info">
          <p class="contact-name">返事のお知らせ</p>
          <div class="isOpen">
            <span class="bx_input size_l">
              <input id="personal-1" type="checkbox" :checked="inquiry.answerEmailSend" onclick="return false;">
              <label for="personal-1">メールアドレス(ID)</label>
            </span>
          </div>
          <p class="upload-mail">{{ profile.email }}</p>
        </div>
        <ul class="btn_qa_goods">
          <li><button class="btn" @click.prevent="close">キャンセル</button></li>
          <li><button class="btn btn_green" @click.prevent="submit">修正</button></li>
        </ul>
      </div>
      <!-- ↑↑↑↑↑ qa_wrapper ↑↑↑↑↑ -->
    </div>
    <good-select v-show="isOpenGoodSelector" @closePopup="closePopup" @setSelectedGood="setSelectedGood" />
    <order-select v-show="isOpenOrderSelector" @closePopup="closePopup" @setSelectedOrder="setSelectedOrder" />
  </div>
</template>
<script>
import { Alert, Confirm } from '@/components/common/modal'
import GoodSelect from '@/components/etc/GoodSelect'
import OrderSelect from '@/components/etc/OrderSelect'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'InquiryPop',
  props: ['inquiry'],
  components: {
    GoodSelect,
    OrderSelect
  },
  computed: {
    ...mapGetters('common', ['inquiryType']),
    ...mapState('profile', ['profile']),
    textAreaplaceholder () {
      let content = ''
      if (this.inquiry.inquiryType.inquiryTypeName === '商品') {
        content = `- 商品についてご不明な点がございましたら、お問い合わせしてください。<br>
- 商品の入荷予定についてのお問い合わせは、お答えできませんので予めご了承下さい。`
      }
      if (this.inquiry.inquiryType.inquiryTypeName === '注文/決済') {
        content = `- 注文状態が「注文完了」の場合、「マイページ＞注文/配送」よりキャンセルすることができます。<br>
- 注文状態が「商品準備中」以降の段階では、商品出荷の作業が行っており、ご注文のキャンセルは承りできません。`
      }
      if (this.inquiry.inquiryType.inquiryTypeNamee === '配送') {
        content = `- 配送状態は「マイページ＞注文/配送」よりご確認いただけます。`
      }
      if (this.inquiry.inquiryType.inquiryTypeName === '交換/返品/AS') {
        content = `- 迅速に対応いたしますので、下記の注文情報をご作成ください。<br>
「オンラインストアの注文情報」<br>
  受付内容 : 交換、返品、AS中から選択<br>
  商品名/数量 : <br>
  詳細内容 :
- 瑕疵のある商品について、画像を添付してください。<br>
- LINE Friends online、 Flagship store 以外の購入商品の場合、ご購入先にお問い合わせください。`
      }
      if (this.inquiry.inquiryType.inquiryTypeName === '会員') {
        content = `- 広告、著作権侵害、誹謗、淫乱などお問い合わせと関係ない内容は、削除されますのであらかじめご了承ください。<br>
- お客様ご相談と関係ない個人情報などを記入しないよう注意してください。`
      }
      if (this.inquiry.inquiryType.inquiryTypeName === '偽物申告') {
        content = `偽物を見つけて通報したい場合に、URLと画像を添付してください。`
      }
      if (this.inquiry.inquiryType.inquiryTypeName === 'ETC') {
        content = `- 広告、著作権の侵害、誹謗中傷、淫乱などお問い合わせと関係のない文章は任意削除となることをお知らせいたします。<br>
- お客様ご相談と関係ない個人情報などを記入しないよう注意してください。`
      }
      return content
    }
  },
  data: function () {
    return {
      isOpen: false,
      file: [],
      goodUnSelect: !this.inquiry.productNo,
      orderUnSelect: !this.inquiry.orderNo,
      isOpenGoodSelector: false,
      isOpenOrderSelector: false,
      isTextAreaEmpty: false
    }
  },
  mounted () {
    this.isTextEmpty()
  },
  methods: {
    isTextEmpty () {
      if (!this.inquiry.inquiryContent) {
        this.isTextAreaEmpty = true
      } else {
        this.isTextAreaEmpty = false
      }
    },
    submit () {
      let msg = this.checkForm()
      if (msg) {
        Alert(msg)
      } else {
        Confirm('1：1お問い合わせを修正しますか？').then((res) => {
          if (res) {
            Promise.all(this.file.map(file => {
              const data = new FormData()
              data.append('file', file.original)
              return this.$store.dispatch('common/uploadImages', data)
            })).then(ret => {
              const urls = ret.map(res => res.data[0].uploadedFileName)
              const originName = ret.map(res => res.data[0].originalFileName)

              const iparam = {
                inquiryNo: this.inquiry.inquiryNo,
                inquiryContent: this.inquiry.inquiryContent,
                inquiryTitle: this.inquiry.inquiryTitle,
                originalFileName: originName ? [...this.inquiry.originalImageUrls, ...originName] : this.inquiry.originalImageUrls,
                uploadedFileName: urls ? [...this.inquiry.imageUrls, ...urls] : this.inquiry.imageUrls
              }

              this.$store.dispatch('profileinquiry/updateInquiry', iparam).then(() => {
                Alert({ message: '修正されました。' }).then(() => {
                  this.$emit('close')
                })
              })
            })
          }
        })
      }
    },
    checkForm () {
      let message = ''
      if ((this.inquiry.inquiryType.inquiryTypeName === '商品') && !this.goodUnSelect) {
        if (!this.inquiry.productName) {
          message = '商品を選択してください。'
        }
      }
      if (message === '' && (this.inquiry.inquiryType.inquiryTypeName === '注文/決済') && !this.orderUnSelect) {
        if (!this.inquiry.orderNo) {
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
    close () {
      this.$emit('close')
    },
    closePopup () {
      this.isOpenGoodSelector = false
      this.isOpenOrderSelector = false
    },
    goPopup (type) {
      if (type === 'good') {
        this.isOpenGoodSelector = true
      }
      if (type === 'order') {
        this.isOpenOrderSelector = true
      }
    },
    openInquiryTypeopenInquiryType () {
      this.isOpen = !this.isOpen
    },
    selectedType (type) {
      this.isOpen = false
      if (type.inquiryTypeNo !== this.inquiry.inquiryType.inquiryTypeNo) {
        this.inquiry.productName = null
        this.inquiry.productNo = null
        this.inquiry.orderNo = null
      }
      this.inquiry.inquiryType = type
    },
    addFile () {
      const files = Array.from(this.$refs.file.files)
      const imageCount = this.file.length + this.inquiry.imageUrls.length
      if (files.length > 5 - imageCount) {
        Alert('最大5件までアップロードできます。')
        return false
      }
      files.forEach(file => {
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
            original: file,
            originalFileName: file.name
          })
        }
      })
    },
    removeUploadedFile (key) {
      this.inquiry.imageUrls.splice(key, 1)
      this.inquiry.originalImageUrls.splice(key, 1)
    },
    removeFile (key) {
      this.file.splice(key - 5, 1)
    },
    setSelectedGood (item) {
      this.goodUnSelect = false
      this.inquiry.productNo = item.productNo
      this.inquiry.productName = item.productName
    },
    setSelectedOrder (item) {
      this.orderUnSelect = false
      this.inquiry.orderNo = item.orderNo
    }
  }
}
</script>
