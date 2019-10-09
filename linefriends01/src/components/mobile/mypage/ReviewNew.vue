<template>
  <div>
    <sub-page-header title="상품평 작성" />
    <div id="container">
      <div class="input-row">
        <app-label
          :style="{ 'line-height': 1.67 }"
          :required="true"
          target="type"
        >
          만족도
        </app-label>
        <star-selector v-model="form.star" />
      </div>
      <div class="input-row">
        <app-label
          :required="true"
          target="content"
        >
          상품평
        </app-label>
        <app-textarea
          id="content"
          v-model="form.content"
          :height="21.6"
          :placeholder="$t('mypage.productinquiry.placeholder.mobile.content')"
          :maxLength="1000"
        />
      </div>
      <div class="input-row">
        <app-label target="content">
          첨부
        </app-label>
        <file-selector
          :max="10"
          :thumb="true"
        />
      </div>

      <comment class="review-comment">
        상품평 작성을 완료하시면 구매확정으로 처리됩니다.
      </comment>

      <div class="button-list">
        <app-button type="secondary">
          취소
        </app-button>
        <app-button type="success">
          등록
        </app-button>
      </div>
    </div>

    <app-footer />
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppFooter from '@/components/mobile/layout/footer/Footer'
import AppButton from '@/components/mobile/common/button/Button'
import AppTextarea from '@/components/mobile/common/input/Textarea'
import AppLabel from '@/components/mobile/common/form/Label'
import FileSelector from '@/components/mobile/common/input/FileSelector'
import StarSelector from '@/components/mobile/common/StarSelector'
import Comment from '@/components/mobile/common/Comment'
import { Alert } from '@/utils/event-bus'

export default {
  name: 'ProfileInquiryNew',
  components: {
    SubPageHeader,
    AppFooter,
    AppButton,
    AppTextarea,
    AppLabel,
    FileSelector,
    StarSelector,
    Comment
  },
  data () {
    return {
      form: {
        star: 0,
        content: ''
      },
      inquiryTypeOption: [
        {
          label: '상품',
          value: 241
        },
        {
          label: '배송',
          value: 242
        }
      ]
    }
  },
  methods: {
    submit () {
      // alert('1:1 문의가 등록되었습니다')
      Alert({
        message: '1:1 문의가 등록되었습니다'
      })
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
  font-family: 'Noto Sans KR';
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
