<template>
  <div>
    <sub-page-header :title="`${claimTypeReturn ? '반품' : '취소'}신청`" />

    <div id="container">
      <div class="cancellation">
        <ul class="cancellation-upper">
          <li
            :class="{ 'cancellation-upper__title': true, 'active': this.warning === true}"
            @click="warningToggle()"
          >
            <information class="information">
              {{ claimTypeReturn ? '반품' : '취소' }}신청 시 주의사항
            </information>
          </li>
          <transition-expand>
            <li
              v-if="warning === true"
              class="cancellation-upper__value"
            >
              <p>
                <template v-if="claimTypeReturn">
                  반품 사유 구분에 따라 반품 배송비의 부담 주체가 구매자 또는 판매자로 구분됩니다.<br/>
                  사유가 불명확 한 경우 반드시 <router-link to="/etc/faq">고객센터(1544-5921)</router-link> 또는 <router-link to="/mypage/inquiry">1:1 문의</router-link>를 통해 협의 후 반품 신청
                  을 해주세요.<br/>
                  올바르지 않은 사유를 선택한 경우 판매자에 의해 반품이 거부될 수 있습니다.<br/>
                  쿠폰을 사용한 경우 반품한 금액에 따라 쿠폰 적용이 취소될 수 있습니다. <span>이 때,</span> 쿠폰은 유효기간 내에서 복원됩니다.<br/>
                  반품 신청 시 판매자의 승인 후 환불됩니다. 단, 카드사의 상황에 따라 환불기간이 다소 길어질 수 있습니다.
                </template>
                <template v-else>
                  상품이 발송되기 전 단계인 경우 취소신청을 할 수 있습니다.
                  다만, 취소신청을 하였더라도 판매자가 이미 상품을 발송한
                  경우에는 취소가 거부될 수 있습니다.<br><br>
                  쿠폰을 사용한 경우 취소한 금액에 따라 쿠폰적용이 취소될
                  수 있습니다. 이 때, 쿠폰은 유효기간 내에서 복원됩니다.<br><br>
                  결제완료 상태에서 취소신청 하는 경우 즉시 환불되며, 상
                  품/배송준비중 상태에서 취소신청 하는 경우 판매자의 승인
                  후 환불됩니다. 단, 카드사의 상황에 따라 환불기간이 다소
                  길어질 수있습니다.
                </template>
              </p>
            </li>
          </transition-expand>
        </ul>
        <refund-list
          :isReturn="claimTypeReturn"
          :firstOption="claimOrderOption.originalOption"
          :addOptions="viewableClaimOptions"
          :claimInfo="returnInfo"
          @claimEstimate="returnEstimate"
        />
        <div class="cancellation-reason">
          <h2 class="cancellation-reason__title">
            {{ claimTypeReturn ? '반품 사유' : '취소 사유' }}
          </h2>
          <div>
            <div class="input-row">
              <app-label
                :style="{ 'line-height': 1.67 }"
                target="type"
              >
                사유 구분
              </app-label>
              <app-select
                id="type"
                :placeholder="txt.claimReasonType"
                :options="[
                  { label: '선택', value: undefined },
                  ...claimOrderOption.claimReasonTypes.map(item => ({ label: item.label, value: item }))
                ]"
                @input="type => updateClaimType(type)"
              />
              <p
                v-if="txt.responsibleObjectType && claimTypeReturn"
                class="cancellation-reason__info"
              >
                {{ txt.responsibleObjectType }}
              </p>
            </div>
            <div class="input-row">
              <app-label
                target="content"
              >
                상세 사유
              </app-label>
              <app-textarea
                id="content"
                v-model="claimReasonDetail"
                :height="21.6"
                :placeholder="`상세사유를 입력해 주세요.`"
              />
            </div>
          </div>
        </div>
        <div
          class="order-block">
          <div class="order-block__header">
            <h3 class="order-block__title">
              환불 예정 정보
            </h3>
          </div>
          <refund-info :refund-infos="refundInfos" />
        </div>
        <address-info
          ref="addInfo"
          :claimOrderOption="claimOrderOption"
          v-if="claimTypeReturn"
        />
        <footer class="button-list">
          <app-button
            type="secondary"
            @click="enterBeforePage"
          >
            취소
          </app-button>
          <app-button
            type="success"
            @click="returnOrderOption"
          >
            등록
          </app-button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import TransitionExpand from '@/components/common/transition/TransitionExpand'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppButton from '@/components/mobile/common/button/Button'
import Information from '@/components/mobile/common/Information'
import RefundList from '@/components/mobile/pages/mypage/order/claim/RefundListNew'
import AppSelect from '@/components/mobile/common/input/Select'
import AppLabel from '@/components/mobile/common/form/Label'
import AppTextarea from '@/components/mobile/common/input/Textarea'
import RefundInfo from '@/components/mobile/pages/mypage/order/common/RefundInfoNew'
import AddressInfo from '@/components/mobile/pages/mypage/order/claim/AddressInfoNew'
import OrderClaimRefundNew from '@/components/mixins/mypage/order/claim/OrderClaimRefundNew'

export default {
  name: 'OrderClaimRefundNew',
  mixins: [OrderClaimRefundNew],
  components: {
    SubPageHeader,
    AppButton,
    Information,
    RefundList,
    AppSelect,
    AppLabel,
    AppTextarea,
    TransitionExpand,
    RefundInfo,
    AddressInfo
  },
  data () {
    return {
      warning: false
    }
  },
  methods: {
    warningToggle () {
      if (this.warning === true) {
        this.warning = false
      } else {
        this.warning = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ #container {
  .update-delivery {
    padding: 0.4rem 1.1rem;
    border-radius: 5rem;
    background: #fff;
    border: 1px solid #ddd;
    font-family: 'Noto Sans KR';
    font-size: 1.2rem;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #666;
  }

  .cancellation {
    padding-bottom: 4rem;
    &-upper {
      padding: 2rem 2rem 2.2rem;
      border-bottom: 0.1rem solid #ededed;
      &__title {
        position: relative;
        &:after {
          position: absolute;
          width: 2rem;
          height: 2rem;
          background-image: url(~@/assets/images/mobile/ic-small-down.svg);
          background-size: cover;
          right: 0;
          top: 0;
          transition: 300ms all;
          content: '';
        }
        &.active {
          &:after {
            transform: rotate(180deg);
          }
        }
      }
      &__value {
        p {
          color: #868686;
          padding-top: 3.2rem;
          line-height: 1.5;
          padding-bottom: 1.3rem;
          & > a {
            color: #ff414e;
          }
          & > span {
            color: #ff414e;
          }
        }
      }
    }
    &-list {
      &__item {
        padding: 0 2rem 3.5rem;
        border-bottom: 0.1rem solid #ededed;
        &:last-child {
          border-bottom: 0;
        }
      }
    }
    &-reason {
      padding: 3.1rem 2rem 3.6rem;
      border-top: 0.1rem solid #ededed;
      &__title {
        padding-bottom: 2.8rem;
        font-family: 'Noto Sans KR';
        font-size: 1.6rem;
        font-weight: bold;
        letter-spacing: -0.01rem;
        color: #333333;
      }
      &__info {
        padding-top: 0.8rem;
        font-family: 'Noto Sans KR';
        font-size: 1.2rem;
        font-weight: normal;
        line-height: 1.67;
        letter-spacing: -0.01rem;
        color: #4ba4d9;
      }
      .input-row {
        &:not(:first-child) {
          padding-top: 3.2rem;
        }
      }
    }
    &--collection {
      position: relative;
      padding: 3.1rem 0 3.4rem;
      border-top: .1rem solid #ededed;

      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem 2.8rem;
      }

      &__title {
        font-family: 'Noto Sans KR';
        font-size: 1.6rem;
        font-weight: bold;
        letter-spacing: -0.01rem;
        color: #333333;
      }

      &__info {
        display: flex;
        padding: 0 2rem 1rem 2rem;
        font-family: 'Noto Sans KR';
        font-size: 1.4rem;
        font-weight: normal;
        letter-spacing: -0.01rem;
        color: #333333;
        justify-content: space-between;
        &-value {
          text-align: right;
          line-height: 1.5;
        }
      }
    }
  }
  .order-block {
    padding: 3.1rem 2rem 3.3rem;
    border-top: 0.1rem solid #ededed;

    &__header {
      display: flex;
      justify-content: space-between;
    }

    &__title {
      font-family: 'Noto Sans KR';
      font-size: 1.6rem;
      font-weight: bold;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #333;
      margin-bottom: 2.8rem;
    }

    &__row {
      display: flex;
      justify-content: space-between;

      &.bottom {
        align-items: flex-end;
      }

      &:not(:first-child) {
        margin-top: 2.2rem;
      }

      &.sale-price {
        margin-top: 0.8rem;
      }
    }

    &__label {
      font-family: 'Noto Sans KR';
      font-size: 1.4rem;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.01rem;
      color: 3333;
    }

    &__value {
      max-width: 22.4rem;
      font-family: 'Noto Sans KR';
      font-size: 1.4rem;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.01rem;
      color: #333;
      text-align: right;
      word-break: keep-all;

      &.price {
        font-family: Volte, sans-serif;
        font-size: 1.6rem;
        font-weight: 600;
        line-height: 1.25;

        .currency {
          font-family: 'Noto Sans KR';
          font-size: 1.4rem;
          font-weight: bold;
          letter-spacing: normal;
        }
      }

      &.total.price {
        margin-top: 1.4rem;
        margin-bottom: 0.4rem;
        font-size: 2.4rem;
        color: #ff414e;
        line-height: 0.71;

        .currency {
          font-size: 2rem;
        }
      }
    }

    &__child {
      .order-block {
        &__label, &__value {
          color: #999;
        }

        &__row {
          margin-top: 0.8rem;
        }
      }
    }

    &__button {
      padding: 0.6rem 2rem 4rem;
    }
  }
  .button-list {
    display: flex;
    padding: 0 2rem;
    justify-content: space-between;

    > * {
      width: 48.959%;
    }
  }
}
</style>
