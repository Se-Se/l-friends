<template>
  <div v-if="showClaimResult.claimNo !== 0">
    <sub-page-header :title="txt.title" />

    <div id="container">
      <div class="cancellation-status">
        <ul v-for="(option, key) in showClaimResult.claimedOptions" :key="key" class="cancellation-status__list">
          <li class="cancellation-status--item">
            <h2 class="cancellation-status--item__title">
              상품정보
            </h2>
            <div class="cancellation-status--item__info">
              <p class="cancellation-status--item__info-title">
                {{ option.productName }}
              </p>
              <p class="cancellation-status--item__info-option">
                {{ option.optionTitle }}/{{ option.orderCnt }}개
              </p>
            </div>
          </li>
          <li class="cancellation-status--item">
            <h2 class="cancellation-status--item__title">
              주문상태
            </h2>
            <div class="cancellation-status--item__info">
              <p class="cancellation-status--item__info-title">
                <template v-if="['RETURN_REQUEST', 'RETURN_REJECT_REQUEST', 'RETURN_PROC_BEFORE_RECEIVE', 'RETURN_PROC_REQUEST_REFUND', 'RETURN_PROC_WAITING_REFUND'].includes(option.claimStatusType)">
                  반품처리중
                </template>
                <template v-if="['RETURN_DONE'].includes(option.claimStatusType)">
                  반품완료
                </template>
                <template v-if="['CANCEL_REQUEST', 'CANCEL_PROC_REQUEST_REFUND', 'CANCEL_PROC_WAITING_REFUND'].includes(option.claimStatusType)">
                  취소처리중
                </template>
                <template v-if="['CANCEL_DONE', 'CANCEL_NO_REFUND'].includes(option.claimStatusType)">
                  취소완료
                </template>
              </p>
            </div>
          </li>
        </ul>
        <div class="cancellation-status--reason">
          <h2 class="cancellation-status--reason__title">
            {{ txt.titleReason }}
          </h2>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              {{ txt.reasonType }}
            </p>
            <p v-for="claimReasonType in claimReasonTypes" :key="claimReasonType.value" v-if="claimReasonType.value === showClaimResult.claimReasonType" class="cancellation-status--reason__info-value">
              {{ claimReasonType.label }}
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              {{ txt.reasonDetail }}
            </p>
            <p class="cancellation-status--reason__info-value">
              {{ showClaimResult.claimReasonDetail | decodeEntities }}
            </p>
          </div>
        </div>
        <div class="cancellation-status--reason">
          <h2 class="cancellation-status--reason__title info">
            환불 정보
          </h2>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              환불 상품 금액
            </p>
            <p class="cancellation-status--reason__info-value">
              {{ refundAmt | formatCurrency }}원
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              차감 금액
            </p>
            <p class="cancellation-status--reason__info-value">
              {{ deductionAmt | formatCurrency }}원
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              환불 금액
            </p>
            <p class="cancellation-status--reason__info-value">
              {{ showRefundPayAmt }}원
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              환불 수단
            </p>
            <template v-if="showClaimResult.claimPriceInfo.refundPayType === 'ACCUMULATION'">
              <p class="cancellation-status--reason__info-value">
                임직원 포인트
              </p>
            </template>
            <template v-else>
              <p class="cancellation-status--reason__info-value">
                {{ showClaimResult.claimPriceInfo.refundTypeLabel }}
              </p>
            </template>
          </div>
        </div>
        <div v-if="!isCancel && showClaimResult.returnWayType === 'SELLER_COLLECT' && showClaimResult.returnAddress.name && showClaimResult.returnAddress.contact1" class="cancellation-status--reason">
          <h2 class="cancellation-status--reason__title">
            반품 수거 정보
            <p class="cancellation-status--reason__subtitle">
              상품 수거를 위해 아래 주소로 택배기사가 방문합니다.
            </p>
          </h2>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              받는 사람
            </p>
            <p class="cancellation-status--reason__info-value">
              {{ showClaimResult.returnAddress.name }}
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              주소
            </p>
            <p class="cancellation-status--reason__info-value" style="max-width: 22.4rem;">
              {{ showClaimResult.returnAddress.addressStr }}
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              휴대전화
            </p>
            <p class="cancellation-status--reason__info-value">
              {{ showClaimResult.returnAddress.contact1 }}
            </p>
          </div>
        </div>
      </div>
      <footer class="button-wrap">
        <app-button type="success" @click="$router.go(-1)">
          확인
        </app-button>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppButton from '@/components/mobile/common/button/Button'
import OrderClaimDetailPoupNew from '@/components/mixins/mypage/order/claim/OrderClaimDetailPopupNew'

export default {
  name: 'OrderClaimDetail',
  mixins: [OrderClaimDetailPoupNew],
  components: {
    SubPageHeader,
    AppButton
  },
  props: {
    showClaimType: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    isCancel () {
      return this.$route.name === 'OrderCancelDetailNew'
    }
  },
  created () {
    if (this.isCancel) {
      this.getOrderClaimResult(this.$route.params.optionNo, !this.isLogined)

      this.txt.title = '취소처리현황'
      this.txt.titleReason = '취소 사유'
      this.txt.reasonType = '취소사유구분'
      this.txt.reasonDetail = '취소상세사유'
    } else {
      this.getOrderReturnResult(this.$route.params.claimNo, !this.isLogined)

      this.txt.title = '반품처리현황'
      this.txt.titleReason = '반품 사유'
      this.txt.reasonType = '반품사유구분'
      this.txt.reasonDetail = '반품상세사유'
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding-bottom: 3.9rem;
}

.cancellation-status {
  padding: 3.2rem 0 0;
  &__list {
    padding: 3.4rem 0;
    border-bottom: 0.1rem solid #ededed;
    &:first-child {
      padding-top: 0;
    }
  }
  &--item {
    display: flex;
    padding: 1.2rem 2rem 0;
    font-family: "Noto Sans KR";
    justify-content: space-between;
    &:first-child {
      padding-top: 0;
    }
    &__title {
      width: 8.3rem;
      font-size: 1.43rem;
      font-weight: normal;
      line-height: 1.43;
      letter-spacing: 0.01rem;
      color: #333333;
    }
    &__info {
      &-title {
        font-size: 1.4rem;
        font-weight: normal;
        text-align: right;
        line-height: 1.43;
        letter-spacing: -0.01rem;
        color: #333333;
      }
      &-option {
        padding-top: 0.4rem;
        font-size: 1.2rem;
        font-weight: normal;
        text-align: right;
        line-height: 1.67;
        letter-spacing: -0.01rem;
        color: #999999;
      }
    }
  }
  &--reason {
    padding: 3.1rem 0 3.6rem;

    &:not(:last-child) {
      border-bottom: 0.1rem solid #ededed;
    }

    &:last-child {
      padding-bottom: 3.8rem;
    }

    &__title {
      padding: 0 0 2.8rem 2rem;
      font-family: "Noto Sans KR";
      font-size: 1.6rem;
      font-weight: bold;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #333333;
    }
    &__subtitle {
      padding: 0.6rem 0.1rem 0;
      font-family: "Noto Sans KR";
      font-size: 1.2rem;
      font-weight: normal;
      line-height: 1;
      letter-spacing: -0.01rem;
      color: #666666;
    }
    &__info {
      display: flex;
      padding: 0 2rem;
      font-family: "Noto Sans KR";
      font-size: 1.4rem;
      font-weight: normal;
      line-height: 1.43;
      letter-spacing: -0.01rem;
      color: #333333;
      justify-content: space-between;

      &-title {
        width: 8.3rem;
      }

      &:not(:last-child) {
        padding-bottom: 1.2rem;
      }

      &-value {
        width: 19.73rem;
        text-align: right;
        word-wrap: break-word;
      }
    }
  }
}
.button-wrap {
  padding: 0 2rem;
}
</style>
