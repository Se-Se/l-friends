<template>
  <div :class="['inquiry-item__wrapper', currentIndex === index ? 'active' : '']">
    <div class="inquiry-item" @click="toggleActive">
      <div class="inquiry-info">
        <p class="inquiry__type">
          {{ inquiry.inquiryType.inquiryTypeName }}
        </p>
        <div>
          <span :class="['inquiry__status', inquiry.inquiryStatus.toLowerCase()]">{{ inquiryStatus }}</span>
        </div>
      </div>
      <p v-if="inquiry.product" class="inquiry__goods">
        {{ inquiry.product.name }}
      </p>
      <p class="inquiry__title">
        {{ inquiry.inquiryTitle }}
      </p>
      <p class="inquiry__reg-dt">
        <ul v-if="inquiry.imageUrls" :class="['inquiry-images']">
          <li v-if="inquiry.imageUrls[i]" v-for="i in inquiry.imageUrls.length" :key="i" :style="{ backgroundImage: 'url(' + inquiry.imageUrls[i-1] + ')' }" class="inquiry-images__item" @click="showMore(i-1)" />
        </ul>
        <!-- <template v-for="imgName in inquiry.originalImageUrls">
          <span
            v-for="(img, index) in inquiry.imageUrls"
            :key="index"
            @click.prevent="downloadIamge(img, imgName)"
          >
            {{ imgName }}
          </span>
        </template> -->
      </p>
      <p class="inquiry__reg-dt">
        <span class="inquiry__reg-date">{{ inquiry.registerYmdt | dateFormatStr('yyyy-MM-dd') }}</span>
        <span class="inquiry__reg-time">{{ inquiry.registerYmdt | dateFormatStr('HH:mm') }}</span>
      </p>
    </div>
    <transition-expand>
      <div v-if="currentIndex === index" class="inquiry-detail">
        <div class="inquiry-detail__item question">
          <div class="inquiry-detail__header">
            <img class="inquiry-detail__icon" src="~@/assets/images/mobile/ic-question.svg">
            <span class="inquiry__type">{{ inquiry.inquiryType.inquiryTypeName }}</span>
          </div>
          <div class="inquiry-detail-info">
            <p class="inquiry__question">
              <more-view :content="inquiry.inquiryContent"></more-view>
            </p>
          </div>
        </div>
        <div v-if="inquiry.answer" class="inquiry-detail__item answer">
          <div class="inquiry-detail__header">
            <img class="inquiry-detail__icon" src="~@/assets/images/mobile/ic-answer.svg">
            <span class="inquiry__type">라인프렌즈</span>
          </div>
          <div class="inquiry-detail-info">
            <p class="inquiry__answer" v-html="inquiry.answer.answerContent"></p>
            <p class="inquiry__reg-dt">
              <span class="inquiry__reg-date">{{ inquiry.answer.answerRegisterYmdt | dateFormatStr('yyyy-MM-dd') }}</span>
              <span class="inquiry__reg-time">{{ inquiry.answer.answerRegisterYmdt | dateFormatStr('HH:mm') }}</span>
            </p>
          </div>
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<script>
import Vue from 'vue'
import TransitionExpand from '@/components/common/transition/TransitionExpand'
import AppSelect from '@/components/mobile/common/input/Select'
import AppTextarea from '@/components/mobile/common/input/Textarea'
import AppButton from '@/components/mobile/common/button/Button'
import InquiryItemNew from '@/components/mixins/mypage/inquiry/InquiryItemNew'
import ImageGallery from '@/components/common/ImageGalleryNew'
import MoreView from '@/components/common/MoreView'

export default {
  name: 'InquiryItem',
  mixins: [InquiryItemNew],
  components: {
    TransitionExpand,
    AppButton,
    AppSelect,
    AppTextarea,
    ImageGallery,
    MoreView
  },
  props: {
    inquiry: {
      type: [Array, Object],
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modalBus: new Vue(),
      edit: false,
      seen: true,
      button: {
        text: '자세히 보기'
      },
      statuses: {
        ASKED: this.$t('inquiry.asked'),
        ANSWERED: this.$t('inquiry.answered')
      },
      // active: false,
      inquiryTypeOption: [
        {
          label: '상품',
          value: 241
        },
        {
          label: '배송',
          value: 242
        }
      ],
      form: {}
    }
  },
  computed: {
    inquiryStatus () {
      return this.statuses[this.inquiry.inquiryStatus]
    }
  },
  methods: {
    toggleActive () {
      // this.active = !this.active
      this.$emit('openIndex', this.index)
      if (this.currentIndex === this.index) {
        this.$emit('openIndex', -1)
      }
    },
    showMore (index) {
      this.modalBus.$emit('open', this.images, index)
    }
  }
}
</script>
<style >
.inquiry__answer b,
strong {
  font-weight: bold;
}
</style>
<style lang="scss" scoped>
.input-row {
  &:not(:last-child) {
    margin-bottom: 1.2rem;
  }
}

.inquiry {
  &-images {
    display: flex;
    margin-top: 2.1rem;

    &__item {
      width: 6rem;
      height: 6rem;
      background-size: cover;
      border: 1px solid #ededed;

      &:not(:last-child) {
        margin-right: 0.4rem;
      }
    }

    &.more &__item:last-child::after {
      content: "더보기";
      display: block;
      width: 100%;
      height: 100%;
      padding-top: 2rem;
      background: rgba(255, 255, 255, 0.5);
      font-family: "Noto Sans KR";
      font-size: 1.2rem;
      font-weight: bold;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #333;
      text-align: center;
    }
  }

  &-item {
    padding: 2rem 1.9rem 2.1rem 2rem;

    &__wrapper {
      transition: all 0.3s;

      &:not(:last-child) .inquiry-item,
      &.active .inquiry-item {
        border-bottom: 1px solid #ededed;
      }
    }
  }

  &-detail {
    background: #fafafa;

    &__item {
      padding: 2.5rem 2rem 2.3rem 2.1rem;
      border-bottom: 1px solid #ededed;

      &.answer {
        padding-left: 5.3rem;
        padding-bottom: 2.1rem;
      }
    }

    &__header {
      display: flex;
      align-items: middle;
      margin-bottom: 0.4rem;
    }

    &-info {
      padding-left: 3.2rem;

      &.edit {
        padding: 1.7rem 0 0;
      }
    }

    &__icon {
      margin-right: 0.7rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .inquiry__type {
      margin-bottom: 0.3rem;
    }
  }

  &-info {
    display: flex;
    justify-content: space-between;
  }

  &__type {
    width: 20rem;
    margin-top: 0.2rem;
    margin-bottom: 0.4rem;
    font-family: "Noto Sans KR";
    font-weight: 500;
    font-size: 1.4rem;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__goods {
    width: 24rem;
    margin-bottom: 1rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: normal;
    overflow: hidden;
  }

  &__title {
    display: -webkit-box;
    width: 100%;
    margin-top: -2rem;
    font-family: "Noto Sans KR";
    font-size: 1.4rem;
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #666;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: pre-line;
    word-break: break-all;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  &__goods,
  &__question,
  &__answer {
    font-family: "Noto Sans KR";
    line-height: normal;
    font-size: 1.2rem;
    font-weight: normal;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__question,
  &__answer {
    white-space: pre-wrap;
    line-height: 1.5;
    width: 100%;
    word-break: break-all;
  }

  &__status {
    display: block;
    line-height: 1.8rem;
    padding: 0 0.8rem;
    border: 1px solid #ddd;
    border-radius: 1.866rem;
    font-family: "Noto Sans KR";
    font-size: 1rem;
    font-weight: normal;
    color: #999;

    &.answered {
      border: none;
      background: #00d664;
      color: #fff;
    }
  }

  &__reg-dt {
    margin-top: 2rem;
    font-size: 0;

    > * {
      font-family: Volte, sans-serif;
      font-size: 1.2rem;
      line-height: normal;
      font-weight: normal;
      letter-spacing: -0.01rem;
      color: #999;
    }
  }

  &__reg-date {
    margin-right: 0.7rem;
  }

  &-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.833rem;

    &__item {
      width: 7.6rem;
      margin-left: 0.7rem;
    }
  }
}
</style>
