<template>
  <div :class="['inquiry-item__wrapper', currentIndex === index ? 'active' : '']">
    <div class="inquiry-item" @click.prevent="onClick">
      <div class="inquiry-info">
        <p class="inquiry__type">
          {{ inquiryType(inquiry.type) }}
        </p>
        <div>
          <template v-if="inquiry.answers === null">
            <span class="inquiry__status asked">{{ $t('mypage.productinquiry.asked') }}</span>
          </template>
          <template v-else>
            <span class="inquiry__status answered">{{ $t('mypage.productinquiry.answered') }}</span>
          </template>
        </div>
      </div>
      <router-link :to="'/goods/detail/'+inquiry.productNo">
        <p class="inquiry__goods">
          {{ inquiry.productName }}
        </p>
      </router-link>
      <div v-if="!edit">
        <pre class="inquiry__title">
          <more-view :content="inquiry.content"></more-view>
        </pre>
        <p class="inquiry__reg-dt">
          <span class="inquiry__reg-date">{{ inquiry.registerYmdt | dateFormatStr('yyyy-MM-dd') }}</span>
          <span class="inquiry__reg-time">{{ inquiry.registerYmdt | dateFormatStr('HH:mm') }}</span>
        </p>
        <div v-if="editable && !inquiry.answers" class="inquiry-tools inquiry-buttons">
          <app-button v-if="!inquiry.answer" class="inquiry-buttons__item" size="small" @click="edit = true">
            {{ $t('mypage.productinquiry.update') }}
          </app-button>
          <app-button v-if="!inquiry.answer" class="inquiry-buttons__item" size="small" @click="deleteInquiry(inquiry.inquiryNo)">
            {{ $t('mypage.productinquiry.delete') }}
          </app-button>
        </div>
      </div>
      <div v-else class="inquiry-detail-info edit">
        <div class="input-row">
          <app-select v-model="savedInquiry.type" :options="malls.productInquiryType" />
        </div>
        <div class="input-row">
          <app-textarea v-model="savedInquiry.content" :height="21.6" :max-length="1000" :placeholder="$t('mypage.productinquiry.placeholder.pc.content')" />
        </div>
        <div class="inquiry-tools">
          <app-checkbox v-model="savedInquiry.secreted" size="large" :disabled="true">
            <span class="inquiry-secret">비공개</span>
          </app-checkbox>
          <div class="inquiry-buttons">
            <app-button class="inquiry-buttons__item" size="small" @click="putInquiry">
              {{ $t('mypage.productinquiry.update') }}
            </app-button>
            <app-button class="inquiry-buttons__item" size="small" @click="cancelInquiry">
              {{ $t('mypage.productinquiry.cancel') }}
            </app-button>
          </div>
        </div>
      </div>
    </div>
    <transition-expand>
      <div v-if="currentIndex === index" class="inquiry-detail">
        <template v-for="(answer,index) in inquiry.answers">
          <div :key="index" class="inquiry-detail__item answer">
            <div class="inquiry-detail__header">
              <img class="inquiry-detail__icon" src="~@/assets/images/mobile/qna-brown.png">
              <span class="inquiry__type">{{ $t('mypage.productinquiry.answer') }}</span>
            </div>
            <div class="inquiry-detail-info">
              <p class="inquiry__answer">{{ answer.content }}</p>
              <p class="inquiry__reg-dt">
                <span class="inquiry__reg-date">{{ answer.updateYmdt | dateFormatStr('yyyy-MM-dd') }}</span>
                <span class="inquiry__reg-time">{{ answer.updateYmdt | dateFormatStr('HH:mm') }}</span>
              </p>
            </div>
          </div>
        </template>
      </div>
    </transition-expand>
  </div>
</template>

<script>
import TransitionExpand from '@/components/common/transition/TransitionExpand'
import AppSelect from '@/components/mobile/common/input/Select'
import AppTextarea from '@/components/mobile/common/input/Textarea'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'
import AppButton from '@/components/mobile/common/button/Button'
import ProductInquiryCardNew from '@/components/mixins/mypage/productinquiry/leaf/ProductInquiryCardNew'
import MoreView from '@/components/common/MoreView'

export default {
  name: 'ProductInquiry',
  mixins: [ProductInquiryCardNew],
  components: {
    TransitionExpand,
    AppButton,
    AppSelect,
    AppTextarea,
    AppCheckbox,
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
      edit: false,
      statuses: {
        ASKED: this.$t('inquiry.asked'),
        ANSWERED: this.$t('inquiry.answered')
      },
      active: false,
      answersArray: {}
    }
  },
  computed: {
    inquiryStatus () {
      return this.statuses[this.inquiry.inquiryStatus]
    },
    answerItem () {
      return this.answersArray[this.productinquiry]
    }
  },
  methods: {
    toggleActive () {
      this.active = !this.active
    },
    cancelInquiry () {
      this.edit = false
      this.resetInquiry()
    }
  }
}
</script>

<style lang="scss" scoped>
.input-row {
  &:not(:last-child) {
    margin-bottom: 1.2rem;
  }
}

.inquiry {
  &-item {
    padding: 2rem 1.9rem 2.1rem 2rem;

    &__wrapper {
      transition: all 0.3s;
      &.active {
        background: #fafafa;
      }
      &:not(:last-child) .inquiry-item,
      &:first-child .inquiry-item,
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
        padding-left: 2.4rem;
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
    margin-top: 0.2rem;
    margin-bottom: 0.4rem;
    font-family: "Noto Sans KR";
    font-weight: bold;
    font-size: 1.4rem;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__goods {
    width: 24rem;
    word-break: keep-all;
    margin-bottom: 1.6rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__title {
    width: 25rem;
    font-family: "Noto Sans KR";
    font-size: 1.4rem;
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #666;
    text-overflow: ellipsis;
    word-wrap: normal;
    overflow: hidden;
  }

  &__goods,
  &__question,
  &__answer {
    font-family: "Noto Sans KR";
    line-height: normal;
    font-size: 1.4rem;
    font-weight: normal;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__question,
  &__answer {
    white-space: pre-wrap;
    line-height: 1.5;
    max-width: 27.1rem;
    word-break: break-word;
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
    margin-top: 2.4rem;
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

  &-tools {
    display: flex;
    justify-content: space-between;
    margin-top: 1.833rem;
  }

  &-secret {
    margin-top: 0.1rem;
    margin-left: 1.1rem;
    display: inline-block;
    font-family: "Noto Sans KR";
    font-size: 1.4rem;
    font-weight: normal;
    letter-spacing: -0.01rem;
    line-height: normal;
    color: #333333;
  }

  &-buttons {
    display: flex;
    justify-content: flex-end;

    &__item {
      width: 7.6rem;
      margin-left: 0.7rem;
    }
  }
}
</style>
