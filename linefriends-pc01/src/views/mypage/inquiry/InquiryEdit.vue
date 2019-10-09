<template>
  <div class="popup-layer" style="display: block;">
    <div class="popup_common popup_size_1 popup_size_new">
      <div class="roller_area none_overflow is_open">
        <div class="contact_registration">
          <h1>1：1お問い合わせ</h1>
        </div>
        <div class="con con_new_margin">
          <div class="able_overflow">
            <table class="table_info contact sp_2">
              <tbody>
                <tr>
                  <th class="big_th"><span class="must">カテゴリー</span></th>
                  <td class="td_padding_left">
                    <div class="bx_select size_m">
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
                  </td>
                </tr>
                <tr v-if="inquiry.inquiryType.inquiryTypeName === '商品'">
                  <th class="big_th">
                    <span class="must">商品選択</span>
                  </th>
                  <td class="td_padding_left">
                    <div class="float_left wid-276">
                      <input type="text" class="size_m" placeholder="問い合わせたい商品を選択してくださ..." v-model="inquiry.productName" readonly>
                    </div>
                    <button class="click_button btn_primary">選択する</button>
                    <span class="bx_input margin_left_20">
                      <span class="bx_input">
                        <input id="personal-5" type="checkbox" v-model="goodUnSelect" onclick="return false;">
                        <label for="personal-5"></label>
                        <label class="txt_2" for="personal-5">商品を選択しない</label>
                      </span>
                    </span>
                  </td>
                </tr>
                <tr>
                <tr v-if="inquiry.inquiryType.inquiryTypeName === '注文/決済'">
                  <th class="big_th"><span class="must">注文選択</span></th>
                  <td class="td_padding_left">
                    <div class="float_left wid-276">
                      <input type="text" class="size_m" placeholder="問い合わせたい注文を選択してくださ..." v-model="inquiry.orderNo" readonly>
                    </div>
                    <button class="click_button btn_primary">選択する</button>
                    <span class="bx_input margin_left_20">
                      <span class="bx_input">
                        <input type="checkbox" id="personal-6" v-model="orderUnSelect" onclick="return false;">
                        <label for="personal-6"></label>
                        <label class="txt_2" for="personal-6">注文を選択しない</label>
                      </span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th class="big_th"><span class="must">タイトル</span></th>
                  <td class="td_padding_left">
                    <div class="bx_select size_m">
                      <div class="text_select">
                        <input type="text" class="size_m" placeholder="タイトルを入力してください。" v-model="inquiry.inquiryTitle">
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th><span class="must">内容</span></th>
                  <td class="td_padding_left1">
                    <div class="bx_write no_top">
                      <textarea :placeholder="textAreaplaceholder" v-model="inquiry.inquiryContent" maxlength="2000"></textarea>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>添付ファイル</th>
                  <td class="td_padding_left1">
                    <div class="btn_file">
                      <input type="file" ref="file" id="fileElem" class="fileElem" name="fileElem" multiple="multiple" accept="image/*" @change="addFile">
                      <label class="btn btn_primary size_m" for="fileElem">ファイル選択</label>
                    </div>
                    <div class="upload_view upload_new_wh">
                      <ul>
                        <li v-for="(image, key) in inquiry.imageUrls" :key="key">
                          <div class="photo_wrap">
                            <div class="thumbnail">
                              <img :src="image">
                            </div>
                          </div>
                          <button class="btn_close" @click.prevent="removeUploadedFile(key)">close</button>
                        </li>
                        <li v-for="(image, key) in file" :key="key+5">
                          <div class="photo_wrap">
                            <div class="thumbnail">
                              <img :src="image.url">
                            </div>
                          </div>
                          <button class="btn_close" @click.prevent="removeFile(key)">close</button>
                        </li>
                      </ul>
                    </div>
                    <div class="tip_1">
                      <span class="pop_font_new">最大5件までアップロードできます。(jpg, png, gif 形式の画像ファイル)</span>
                    </div>
                  </td>
                </tr>
                <tr style="height: 64px">
                  <th class="big_th"><span>返事のお知らせ</span></th>
                  <td class="td_padding_left">
                    <span class="bx_input">
                      <input id="mail_id_2" type="checkbox" :checked="inquiry.answerEmailSend" onclick="return false;">
                      <label for="mail_id_2"></label>
                      <label class="txt_2" for="mail_id_2">メールアドレス(ID)</label>
                    </span>
                    <span class="address_span">{{ profile.email }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul class="btn_list btn_list-margin">
            <li>
              <button class="btn" @click.prevent="close">キャンセル</button>
            </li>
            <li>
              <button class="btn btn_green" @click.prevent="submit">修正</button>
            </li>
          </ul>
        </div>
      </div>
      <button class="btn_close" @click.prevent="close">close</button>
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
        content = `- 商品についてご不明な点がございましたら、お問い合わせしてください。
- 商品の入荷予定についてのお問い合わせは、お答えできませんので予めご了承下さい。`
      }
      if (this.inquiry.inquiryType.inquiryTypeName === '注文/決済') {
        content = `- 注文状態が「注文完了」の場合、「マイページ＞注文/配送」よりキャンセルすることができます。
- 注文状態が「商品準備中」以降の段階では、商品出荷の作業が行っており、ご注文のキャンセルは承りできません。`
      }
      if (this.inquiry.inquiryType.inquiryTypeName === '配送') {
        content = `- 配送状態は「マイページ＞注文/配送」よりご確認いただけます。`
      }
      if (this.inquiry.inquiryType.inquiryTypeName === '交換/返品/AS') {
        content = `- 迅速に対応いたしますので、下記の注文情報をご作成ください。
「オンラインストアの注文情報」
  受付内容 : 交換、返品、AS中から選択
  商品名/数量 : 
  詳細内容 :
- 瑕疵のある商品について、画像を添付してください。
- LINE Friends online、 Flagship store 以外の購入商品の場合、ご購入先にお問い合わせください。`
      }
      if (this.inquiry.inquiryType.inquiryTypeName === '会員') {
        content = `- 広告、著作権侵害、誹謗、淫乱などお問い合わせと関係ない内容は、削除されますのであらかじめご了承ください。
- お客様ご相談と関係ない個人情報などを記入しないよう注意してください。`
      }
      if (this.inquiry.inquiryType.inquiryTypeName === '偽物申告') {
        content = `偽物を見つけて通報したい場合に、URLと画像を添付してください。`
      }
      if (this.inquiry.inquiryType.inquiryTypeName === 'ETC') {
        content = `- 広告、著作権の侵害、誹謗中傷、淫乱などお問い合わせと関係のない文章は任意削除となることをお知らせいたします。
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
      isOpenOrderSelector: false
    }
  },
  methods: {
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
          message = '商品を選択してください'
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
      const imageCount = this.file.length + this.inquiry.imageUrls.length
      const files = Array.from(this.$refs.file.files)
      if (files.length > 5 - imageCount) {
        Alert('最大5件までアップロードできます。')
        return false
      }
      files.forEach(file => {
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
