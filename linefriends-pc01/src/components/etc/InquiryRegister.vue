<template>
  <!-- ↓↓↓↓↓ table_info ↓↓↓↓↓ -->
  <div class="table_info">
    <table class="table_data">
      <colgroup>
        <col style="width: 17%;">
        <col style="width: 83%;">
      </colgroup>
      <tbody>
        <tr>
          <th><span class="must">カテゴリー</span></th>
          <td>
            <div class="bx_select size_m win-360" v-click-outside="closeInquiryType">
              <div :class="{txt_select:true, 'on':isOpen}" @click.prevent="openInquiryType">
                <span class="select_vle">{{inquiry.currentInquiryType.inquiryTypeName}}</span>
                <span class="ico_arrow">商品</span>
              </div>
              <ul class="lst_select_content">
                <li v-for="(type,key) in inquiryType" :key=key :value="type.inquiryTypeNo">
                  <a @click.prevent="selectedType(type)">{{type.inquiryTypeName}}</a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
        <tr v-show="inquiry.currentInquiryType.inquiryTypeName === '商品'">
          <th><span class="must">商品選択</span></th>
          <td>
            <dl class="goods-select">
              <dt><input type="text" class="size_m" placeholder="お問い合わせしたい商品を選択してください。" v-model="inquiry.selectedGood.productName" disabled>
              </dt>
              <dd>
                <button class="btn btn_primary size_m" @click.prevent="goPopup('good')">選択する</button>
              </dd>
              <dd>
                <span class="bx_input">
                  <input id="personal-2" type="checkbox" v-model="inquiry.goodUnSelect" @click="clickCheckBox()">
                  <label for="personal-2">商品を選択しない</label>
                </span>
              </dd>
            </dl>
          </td>
        </tr>
        <tr v-show="inquiry.currentInquiryType.inquiryTypeName === '注文/決済'">
          <th><span class="must">注文選択</span></th>
          <td>
            <dl class="goods-select">
              <dt>
                <input type="text" class="size_m" placeholder="お問い合わせしたい注文を選択してください。" v-model="inquiry.selectedOrder.orderNo" disabled>
              </dt>
              <dd><button class="btn size_m btn_primary" @click.prevent="goPopup('order')">選択する</button></dd>
              <dd>
                <span class="bx_input">
                  <input id="personal-5" type="checkbox" v-model="inquiry.orderUnSelect" @click="clickCheckBox()">
                  <label for="personal-5">注文を選択しない</label>
                </span>
              </dd>
            </dl>
          </td>
        </tr>
        <tr>
          <th><span class="must">タイトル</span></th>
          <td>
            <div class="win-360">
              <input type="text" class="size_m" maxlength="200" placeholder="タイトルを入力してください。" v-model="inquiry.inquiryTitle">
            </div>
          </td>
        </tr>
        <tr>
          <th><span class="must">内容</span></th>
          <td>
            <div class="bx_write no_margin">
              <textarea :placeholder="textAreaplaceholder" maxlength="2000" v-model="inquiry.inquiryContent"></textarea>
            </div>
          </td>
        </tr>
        <tr>
          <th>添付ファイル</th>
          <td>
            <div class="win-222">
              <button class="btn btn_primary size_m" @click="$refs.file.click()">ファイル選択</button>
            </div>
            <ul class="upload-pic cf" v-if="inquiry.file && inquiry.file.length > 0">
              <li v-for="(image, key) in inquiry.file" :key="key">
                <div class="thumbnail">
                  <img class="item_img" :src="image.url">
                </div>
                <a @click.prevent="removeFile(key)">x</a>
              </li>
            </ul>
            <p class="upload-notes">最大5件までアップロードできます。(jpg, png, gif 形式の画像ファイル)</p>
            <input ref="file" type="file" @change="addFile" class="file" multiple>
          </td>
        </tr>
        <tr>
          <th>返事のお知らせ</th>
          <td>
            <div class="mail-id">
              <span class="bx_input">
                <input id="personal-3" type="checkbox" v-model="inquiry.answerEmailSendYn">
                <label for="personal-3">メールアドレス(ID)</label>
              </span>
              <strong v-if="profile">{{ profile.email }}</strong>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- ↑↑↑↑↑ table_info ↑↑↑↑↑ -->
</template>
<script>
import { Alert } from '@/components/common/modal'
import ClickOutside from 'vue-click-outside'
export default {
  name: 'Inquery',
  props: ['inquiryType', 'profile', 'inquiry'],
  data: function () {
    return {
      isOpen: false
    }
  },
  directives: {
    ClickOutside
  },
  computed: {
    textAreaplaceholder () {
      let content = ''
      if (this.inquiry.currentInquiryType.inquiryTypeName === '商品') {
        content = `- 商品についてご不明な点がございましたら、お問い合わせしてください。
- 商品の入荷予定についてのお問い合わせは、お答えできませんので予めご了承下さい。`
      }
      if (this.inquiry.currentInquiryType.inquiryTypeName === '注文/決済') {
        content = `- 注文状態が「注文完了」の場合、「マイページ＞注文/配送」よりキャンセルすることができます。
- 注文状態が「商品準備中」以降の段階では、商品出荷の作業が行っており、ご注文のキャンセルは承りできません。`
      }
      if (this.inquiry.currentInquiryType.inquiryTypeName === '配送') {
        content = `- 配送状態は「マイページ＞注文/配送」よりご確認いただけます。`
      }
      if (this.inquiry.currentInquiryType.inquiryTypeName === '交換/返品/AS') {
        content = `- 迅速に対応いたしますので、下記の注文情報をご作成ください。
「オンラインストアの注文情報」
  受付内容 : 交換、返品、AS中から選択
  商品名/数量 : 
  詳細内容 :
- 瑕疵のある商品について、画像を添付してください。
- LINE Friends online、 Flagship store 以外の購入商品の場合、ご購入先にお問い合わせください。`
      }
      if (this.inquiry.currentInquiryType.inquiryTypeName === '会員') {
        content = `- 広告、著作権侵害、誹謗、淫乱などお問い合わせと関係ない内容は、削除されますのであらかじめご了承ください。
- お客様ご相談と関係ない個人情報などを記入しないよう注意してください。`
      }
      if (this.inquiry.currentInquiryType.inquiryTypeName === '偽物申告') {
        content = `偽物を見つけて通報したい場合に、URLと画像を添付してください。`
      }
      if (this.inquiry.currentInquiryType.inquiryTypeName === 'ETC') {
        content = `- 広告、著作権の侵害、誹謗中傷、淫乱などお問い合わせと関係のない文章は任意削除となることをお知らせいたします。
- お客様ご相談と関係ない個人情報などを記入しないよう注意してください。`
      }
      return content
    }
  },
  methods: {
    closeInquiryType () {
      this.isOpen = false
    },
    openInquiryType () {
      this.isOpen = !this.isOpen
    },
    selectedType (type) {
      this.isOpen = false
      this.inquiry.currentInquiryType = type
      this.inquiry.selectedGood = {
        productName: '',
        productNo: ''
      }
      this.inquiry.selectedOrder = {
        orderNo: ''
      }
    },
    addFile () {
      const files = Array.from(this.$refs.file.files)
      if (files.length + this.inquiry.file.length > 5) {
        Alert('最大5件までアップロードできます。')
        return false
      }
      files.forEach((file) => {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          this.$refs.file.value = null

          if (file.size > 10485760) { // 10MB
            Alert('各画像は、最大10MBまで登録可能です。')
            return false
          }

          if (file.type.split('image').length === 1) {
            Alert('画像ファイルのみ登録可能です。')
            return false
          }

          this.inquiry.file.push({
            url: e.target.result,
            original: file,
            originalFileName: file.name
          })
        }
      })
    },
    removeFile (key) {
      this.inquiry.file.splice(key, 1)
    },
    clickCheckBox () {
      if (this.inquiry.currentInquiryType.inquiryTypeName === '商品') {
        this.inquiry.goodUnselect = !this.inquiry.goodUnselect
        if (this.inquiry.goodUnselect) {
          this.inquiry.selectedGood.productName = ''
          this.inquiry.selectedGood.productNo = ''
        }
      }
      if (this.inquiry.currentInquiryType.inquiryTypeName === '注文/決済') {
        this.inquiry.orderUnselect = !this.inquiry.orderUnselect
        if (this.inquiry.orderUnselect) {
          this.inquiry.selectedOrder = ''
        }
      }
    },
    goPopup (type) {
      this.$emit('goPopup', type)
    }
  },
  watch: {
    inquiry (next) {
      this.$emit('setInquiry', this.inquiry)
    }
  }
}
</script>
