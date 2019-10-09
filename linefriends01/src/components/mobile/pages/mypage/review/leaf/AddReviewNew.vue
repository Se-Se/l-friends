<template>
  <div>
    <sub-page-header :title="mode === 'MODIFY' ? '상품평 작성' : '상품평 작성'" :onClose="closeReview" />
    <div id="container">
      <div class="addreview-container">
        <div class="input-row">
          <app-label :style="{ 'line-height': 1.67 }" :required="true" target="type">
            만족도
          </app-label>
          <star-selector v-model="starPoint" />
        </div>
        <div class="input-row">
          <app-label :required="true" target="content">
            상품평
          </app-label>
          <app-textarea id="content" v-model="content" :height="31.6" :placeholder="$t('mypage.productinquiry.placeholder.mobile.content')" :maxLength="1000" />
        </div>
        <div class="input-row">
          <app-label target="content">
            첨부
          </app-label>
          <file-selector v-model="files" :max="10" thumb :imgCount="imgCount" @addImageCount="addImageCount" />
        </div>
        <comment class="review-comment">
          상품평 작성을 완료하시면 구매확정으로 처리됩니다.
        </comment>
        <div class="button-list">
          <app-button type="secondary" @click="closeReview">
            취소
          </app-button>
          <app-button type="success" @click="registReview">
            등록
          </app-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AddReviewNew from '@/components/mixins/mypage/review/leaf/AddReviewNew'
import AppButton from '@/components/mobile/common/button/Button'
import AppInput from '@/components/mobile/common/input/Input'
import AppSelect from '@/components/mobile/common/input/Select'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'
import AppTextarea from '@/components/mobile/common/input/Textarea'
import AppLabel from '@/components/mobile/common/form/Label'
import FileSelector from '@/components/mobile/common/input/FileSelector'
import SignInInquiry from '@/components/mixins/mypage/inquiry/SignInInquiryNew'
import SelectBox from '@/components/common/SelectBoxNew'
import StarSelector from '@/components/mobile/common/StarSelector'
import Comment from '@/components/mobile/common/Comment'

export default {
  mixins: [AddReviewNew],
  data () {
    return {
      imgCount: 0
    }
  },
  components: {
    SubPageHeader,
    SelectBox,
    AppButton,
    AppTextarea,
    AppInput,
    AppSelect,
    AppCheckbox,
    AppLabel,
    FileSelector,
    StarSelector,
    Comment
  },
  watch: {
    review (next) {
      this.init(next)
    },
    files (next) {
      this.images = this.files.map(item => ({
        file: item.original
      }))
    }
  },
  mounted () {
    this.init(this.review)
  },
  methods: {
    init (review) {
      if (this.mode === 'MODIFY') {
        this.starPoint = review.rate
        this.content = review.content
        this.reviewNo = review.reviewNo
        this.images = []
        review.fileUrls.forEach(i => {
          let fileItem = {}
          fileItem.filedata = i
          this.images.push(fileItem)
        })
      } else {
        this.starPoint = 0
        this.content = ''
        this.reviewNo = null
        this.images = []
      }
    },
    addImageCount () {
      this.imgCount++
    },
    closeReview () {
      if (this.mode === 'WRITE') {
        this.imgCount = 0
      }
      this.starPoint = 0
      this.content = ''
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 3.3rem 2rem 0;
}

.input-row {
  margin-bottom: 3.1rem;
}

.review-comment {
  margin-top: 3.6rem;
}

#content {
  margin-bottom: 2rem;
}

.public-check {
  margin-left: 1.1rem;
  font-family: "Noto Sans KR";
  font-size: 1.4rem;
  font-weight: normal;
  line-height: normal;
  letter-spacing: -0.01rem;
  color: #333;
}

.button-list {
  display: flex;
  justify-content: space-between;
  margin: 2.8rem 0;

  > * {
    width: 48.959%;
  }
}
</style>
