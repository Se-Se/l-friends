<template>
  <div id="container" class="review_edit">
    <div class="wrap_category">
      <div class="category_close">
        <a href="#" class="btn_close" @click.prevent="close">close</a>
      </div>
      <h2>{{reviewNo?'レビューの修正':'レビューの作成'}}</h2>
    </div>

    <!-- ↓↓↓↓↓ review_list-wrapper ↓↓↓↓↓ -->
    <div class="review_edit-wrapper">
      <div class="necessary">
        <h1>満足度</h1>
      </div>
      <div class="star_area">
        <span class="review_score_max" @click.stop="getPoint" ref="star">
          <span class="graph" :style="{width: starPoint * 20 + `%`}"><strong class="blind">{{starPoint}}</strong></span>
          <span class="blind">/ 5.0</span>
        </span>
      </div>
      <div class="necessary">
        <h1>商品レビュー</h1>
      </div>
      <div class="bx_write txt_area bx_write_placeholder">
        <textarea class="text_area" @blur="blurText" @focus="focusText" v-model="content" maxlength="1000"></textarea>
        <div v-if="isTextAreaEmpty" class="text_area_placeholder">
          - 広告、著作権侵害、いやがらせ、誹謗、わいせつなど、商品と関係ない内容投稿は任意に削除される可能性があります。<br>
          - レビューと関係ない個人情報などを記入しないよう注意してください。<br>
          - 商品にご不明な点がございましたら、商品のお問い合わせから質問してください。
        </div>
      </div>
      <div>
        <h1>添付</h1>
      </div>
      <div class="file_select">
        <input type="file" id="fileElem" class="fileElem" name="fileElem" ref="inputFile" multiple="" accept="image/*" @change="onFileChange">
        <button class="btn btn_primary" @click="$refs.inputFile.click()">ファイル選択</button>
      </div>
      <div class="img_upload_area">
        <ul class="img_upload">
          <li v-for="(image, index) in images" :key="index">
            <a href="#" @click.prevent="removeImage(index)">
              <img src="@/assets/img/icon/ico_black_close.png" alt="">
            </a>
            <div class="thumbnail">
              <img :src="image.filedata" alt="">
            </div>
          </li>
        </ul>
      </div>
      <div class="warn">
        <img src="@/assets/img/icon/important.png" alt="">
        <span>最大10件までアップロードできます。</span>
      </div>
      <div class="button_area">
        <button class="btn" @click="close">キャンセル</button>
        <button class="btn btn_green" v-if="!reviewNo" @click="registReview">登録</button>
        <button class="btn btn_green" v-if="reviewNo" @click="registReview">修正</button>
      </div>
    </div>
    <!-- ↑↑↑↑↑ review_list-wrapper ↑↑↑↑↑ -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { Alert, Confirm } from '@/components/common/modal'

export default {
  name: 'AddReview',
  data () {
    return {
      starPoint: 0,
      content: '',
      images: [],
      isTextAreaEmpty: false
    }
  },
  computed: {
    ...mapState('review', ['currentReview']),
    reviewNo () {
      return this.$route.params ? this.$route.params.reviewno : 0
    }
  },
  methods: {
    focusText () {
      this.isTextAreaEmpty = false
    },
    blurText () {
      if (!this.content) {
        this.isTextAreaEmpty = true
      }
    },
    getPoint () {
      let starNum = Math.ceil(event.offsetX / (this.$refs.star.clientWidth / 5))
      this.selectStar(starNum)
    },
    selectStar (point) {
      this.starPoint = point
    },
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createImage(files)
      e.target.value = ''
    },
    createImage (files) {
      if (typeof FileReader === 'undefined') {
        Alert({
          message: 'ブラウザが画像のアップロードをサポートしていません。ブラウザをアップグレードしてください。'
        })
        return false
      }

      const leng = files.length
      for (let i = 0; i < leng; i++) {
        if (files[i].size > 10485760) { // 1MB
          Alert({
            message: '各画像は、最大10MBまで登録可能です。'
          })
          return false
        }

        if (files[i].type.split('image').length === 1) {
          Alert({
            message: '画像ファイルのみ登録可能です。'
          })
          return false
        }
      }

      if (leng + this.images.length > 10) {
        Alert({
          message: '添付ファイルは、10個まで登録可能です。'
        })
        return false
      }

      const that = this
      for (let i = 0; i < leng; i++) {
        const fileitem = {}
        fileitem.file = files[i]
        const reader = new FileReader()
        reader.readAsDataURL(files[i])
        reader.onload = function (e) {
          fileitem.filedata = e.target.result
          that.images.push(fileitem)
        }
      }
    },
    removeImage (index) {
      Confirm('写真を削除しますか？').then((result) => {
        if (result) this.images.splice(index, 1)
      })
    },
    registReview () {
      if (this.starPoint === 0) {
        Alert({
          message: '満足度をお選びください。'
        })
        return
      }
      if (this.content.trim() === '') {
        Alert({
          message: 'レビュー本文を入力してください。'
        })
        return
      }
      const paramsReview = {
        productNo: this.currentReview.productNo,
        optionNo: this.currentReview.optionNo,
        orderOptionNo: this.currentReview.orderOptionNo,
        rate: this.starPoint,
        content: this.content,
        reviewNo: this.reviewNo,
        orderAddFlg: ''
      }
      const dispatch = this.$store.dispatch
      Promise.all(this.images.map(image => {
        if (image.file !== undefined) {
          const data = new FormData()
          data.append('file', image.file)
          return dispatch('common/uploadImages', data)
        }
      })).then(ret => {
        const urls = ret.filter(res => res !== undefined).map(res => res.data[0].uploadedFileName).concat(this.images.filter(i => i.file === undefined).map(i => i.filedata))
        paramsReview.urls = urls
        if (this.reviewNo) {
          dispatch('review/putProductReviews', paramsReview).then(() => {
            Alert({ message: 'レビュー修正が完了しました。' }).then(this.close)
          })
        } else {
          dispatch('review/postProductReviews', paramsReview).then(() => {
            Alert({ message: 'レビューの作成が完了しました。' }).then(this.close)
          })
        }
      })
    },
    close () {
      if (this.reviewNo) {
        this.$router.push('/m/mypage/myreview/reviewed')
      } else {
        this.$router.push('/m/mypage/myreview')
      }
    },
    setData (review) {
      this.starPoint = review.rate
      this.content = review.content
      this.images = []
      review.fileUrls.forEach(i => {
        let fileItem = {}
        fileItem.filedata = i
        this.images.push(fileItem)
      })
    }
  },
  mounted () {
    if (!this.currentReview) {
      this.close()
    } else {
      if (this.reviewNo) {
        this.setData(this.currentReview)
      }
    }
    // text_area_placeholder
    this.blurText()
  }
}
// router
// ,
// {
//   path: '/m/mypage/myreview/addreview/:reviewno',
//   name: 'AddReview',
//   components: {
//     default: AddReview,
//     header: Header,
//     footer: Footer
//   },
//   meta: {
//     needAuth: true
//   }
// },
// {
//   path: '/m/mypage/myreview/addreview',
//   name: 'EditReview',
//   components: {
//     default: AddReview,
//     header: Header,
//     footer: Footer
//   },
//   meta: {
//     needAuth: true
//   }
// }
</script>
<style scoped>
#fileElem {
  display: none;
}
</style>
