<template>
  <div :class="['inquiry-item__wrapper', active ? 'active' : '']">
    <div class="inquiry-item" @click="$emit('click')">
      <div class="inquiry-info">
        <div class="inquiry-info__header">
          <p class="inquiry">
            {{ getTypeName(inquiry.type) }}
            <span v-if="inquiry.secreted" class="inquiry__lock">
              lock
            </span>
          </p>
          <span class="inquiry__status" :class="['inquiry', inquiry.answers ? 'answered' : '']">{{ inquiry.answers ? '답변완료' : '답변대기' }}</span>
        </div>
        <div class="inquiry__title">
          <template v-if="inquiry.administrator === false && inquiry.myInquiry === false && inquiry.secreted === true">
            {{ $t('goods.detailContact.sceretContact') }}
          </template>
          <template v-else>
            <more-view :content="inquiry.content"></more-view>
          </template>
        </div>
        <p class="inquiry__email">
          {{ inquiry.memberId }}
        </p>
        <p class="inquiry__reg-dt">
          <span class="inquiry__reg-date">{{ inquiry.registerYmdt | dateFormatStr('yyyy-MM-dd') }}</span>
          <span class="inquiry__reg-time">{{ inquiry.registerYmdt | dateFormatStr('HH:mm') }}</span>
        </p>
        <div v-if="inquiry.myInquiry && !inquiry.answers" class="inquiry-buttons">
          <app-button class="inquiry-buttons__item" size="small" @click="toEdit(inquiry.inquiryNo)">
            수정
          </app-button>
          <app-button class="inquiry-buttons__item" size="small" @click="deleteInquiry(inquiry.inquiryNo)">
            삭제
          </app-button>
        </div>
      </div>
      <transition-expand v-if="inquiry.answers">
        <template v-if="active">
          <div v-for="(item, key) in inquiry.answers" :key="key" class="inquiry-detail">
            <div class="inquiry-detail__item question">
              <div class="inquiry-detail__header">
                <ul>
                  <li class="inquiry-detail__icon"><img src="~@/assets/images/mobile/qna-brown.png"></li>
                  <li class="inquiry-detail__type">라인프렌즈 답변</li>
                </ul>
              </div>
              <div class="inquiry-detail-info">
                <p class="inquiry-detail__question">
                  <template v-if="!inquiry.myInquiry && inquiry.secreted">
                    {{ $t('goods.detailContact.sceretAnswer') }}
                  </template>
                  <template v-else>
                    <more-view :content="item.content"></more-view>
                  </template>
                  <!-- {{ !inquiry.myInquiry && inquiry.secreted ? $t('goods.detailContact.sceretAnswer') : item.content }} -->
                </p>
                <p class="inquiry-detail__reg-dt">
                  <span class="inquiry-detail__reg-date">{{ item.registerYmdt | dateFormatStr('yyyy-MM-dd') }}</span>
                  <span class="inquiry-detail__reg-time">{{ item.registerYmdt | dateFormatStr('HH:mm') }}</span>
                </p>
              </div>
            </div>
          </div>
        </template>
      </transition-expand>
    </div>
  </div>
</template>

<script>
import TransitionExpand from '@/components/common/transition/TransitionExpand'
import AppButton from '@/components/mobile/common/button/Button'
import { mapState, mapActions } from 'vuex'
import { Alert, Confirm } from '@/utils/event-bus'
import MoreView from '@/components/common/MoreView'

export default {
  name: 'InquiryItem',
  components: {
    TransitionExpand,
    AppButton,
    MoreView
  },
  props: {
    inquiry: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('common', ['malls']),
    inquiryStatus () {
      return this.statuses[this.inquiry.inquiryStatus]
    },
    $route () {
      return this.$router.currentRoute
    },
    page () {
      return this.$route.params.page || 1
    }
  },
  methods: {
    ...mapActions('product', ['fetchProduct']),
    ...mapActions('productinquiry', ['fetchProductInquiry', 'deleteProductInquiry']),
    getTypeName (type) {
      return this.malls.productInquiryType.filter(item => item.value === type)[0].label
    },
    toEdit (inquiryNo) {
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.$router.push({
        name: 'GoodsInquiry',
        params: {
          goodsNo: this.$route.params.goodsNo,
          inquiryNo
        },
        query: {
          currScroll
        }
      })
    },
    deleteInquiry (inquiryNo) {
      Confirm({
        message: this.$t('mypage.productinquiry.confirm.delete'),
        callback: async () => {
          try {
            await this.deleteProductInquiry({
              inquiryNo: inquiryNo,
              page: this.page,
              productNo: this.$route.params.goodsNo
            }).then(() => {
              // alert('삭제되었습니다.')
              Alert({
                message: '삭제되었습니다.'
              })
            })
            this.fetchProduct({ productNo: this.$route.params.goodsNo })
          } catch (e) {
            this.fetchProductInquiry({ productNo: this.$route.params.goodsNo })
          }
        }
      })
      // if (confirm(this.$t('mypage.productinquiry.confirm.delete'))) {
      //   try {
      //     await this.deleteProductInquiry({
      //       inquiryNo: inquiryNo,
      //       page: this.page,
      //       productNo: this.$route.params.goodsNo
      //     }).then(() => {
      //       // alert('삭제되었습니다.')
      //       Alert({
      //         message: '삭제되었습니다.'
      //       })
      //     })
      //     this.fetchProduct({ productNo: this.$route.params.goodsNo })
      //   } catch (e) {
      //     this.fetchProductInquiry({ productNo: this.$route.params.goodsNo })
      //   }
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.inquiry {
  margin-bottom: 0.4rem;
  color: #333333;
  font-size: 1.4rem;
  font-family: "Noto Sans KR";
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.01rem;

  &__lock {
    display: inline-block;
    vertical-align: top;
    width: 1.2rem;
    height: 1.4rem;
    font-size: 0;
    margin-top: 0.3rem;
    margin-left: 0.3rem;
    background-image: url(~@/assets/images/mobile/ic-lock.svg);
    background-size: 100% 100%;
  }

  &-item {
    border-bottom: 1px solid #ededed;

    &__wrapper {
      transition: all 0.3s;

      &.active {
        background: #fafafa;
      }
    }
  }

  &-detail {
    &__item {
      padding: 0 2rem 2.4rem 2rem;
    }
    &__header {
      display: flex;
      align-items: middle;
      margin-bottom: 0.4rem;
      padding-top: 1.4rem;
      border-top: 1px solid #ededed;
    }
    &__icon {
      display: inline-block;
      margin-right: 0.5rem;
      width: 2.5rem;
      height: 2.5rem;
      vertical-align: middle;
    }
    &__type {
      display: inline-block;
      color: #333333;
      font-size: 1.4rem;
      font-weight: 500;
      font-family: "Noto Sans KR";
      line-height: 1.5;
      letter-spacing: -0.01rem;
      vertical-align: middle;
    }
    &-info {
      padding-left: 3.2rem;
    }
    &__question {
      white-space: pre-wrap;
      margin-bottom: 2.4rem;
      font-family: "Noto Sans KR";
      font-weight: normal;
      font-size: 1.4rem;
      line-height: 1.5;
      letter-spacing: -0.01rem;
      color: #333333;
      word-break: break-word;
    }
    &__reg-dt {
      color: #666666;
      font-size: 1.2rem;
      font-family: "Volte", sans-serif;
      font-weight: normal;
      letter-spacing: -0.01rem;
    }
    .inquiry__type {
      margin-bottom: 0.3rem;
    }
  }

  &-info {
    padding: 2.1rem 2.6rem 2.4rem 2rem;

    &__header {
      display: flex;
      justify-content: space-between;
    }
  }

  &__answer {
    margin-top: 0.2rem;
    margin-bottom: 0.933rem;
    font-family: "Noto Sans KR";
    font-weight: 500;
    font-size: 1.4rem;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__title {
    width: 25rem;
    margin-bottom: 1.7rem;
    color: #333333;
    font-family: "Noto Sans KR";
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    word-break: break-all;
    text-overflow: ellipsis;
    word-wrap: normal;
    overflow: hidden;
  }

  &__status {
    width: 5.3rem;
    height: 1.8rem;
    box-sizing: content-box;
    border: 1px solid #dddddd;
    border-radius: 15px;
    background-color: #ffffff;
    font-family: "Noto Sans KR";
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.8rem;
    letter-spacing: -0.003rem;
    color: #999999;
    text-align: center;

    &.answered {
      border: 0;
      background-color: #00d664;
      color: #ffffff;
    }
  }
  &__email {
    display: inline-block;
    font-family: "Volte", sans-serif;
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: -0.01rem;
    color: #666666;
  }
  &__reg-dt {
    display: inline-block;
    padding-left: 1.2rem;
    font-size: 0;

    > * {
      font-family: "Volte", sans-serif;
      font-weight: normal;
      font-size: 1.2rem;
      letter-spacing: -0.01rem;
      color: #666666;
    }
  }

  &__reg-date {
    margin-right: 0.5rem;
  }

  &-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 2.5rem;
    margin-bottom: -0.4rem;

    &__item {
      width: 5.4rem;
      margin-left: 0.6rem;
    }
  }
}
</style>
