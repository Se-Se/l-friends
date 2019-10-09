<template>
  <div>
    <sub-page-header title="취소신청" />

    <div id="container">
      <div class="cancellation">
        <ul class="cancellation-upper">
          <li
            :class="{ 'cancellation-upper__title': true, 'active': this.warning === true}"
            @click="warningToggle()"
          >
            <information class="information">
              취소신청 시 주의사항
            </information>
          </li>
          <transition-expand>
            <li
              v-if="warning === true"
              class="cancellation-upper__value"
            >
              <p>
                상품이 발송되기 전 단계인 경우 취소신청을 할 수 있습니다.<br/>
                다만, 취소신청을 하였더라도 판매자가 이미 상품을 발송한<br/>
                경우에는 취소가 거부될 수 있습니다.<br/><br/>
                쿠폰을 사용한 경우 취소한 금액에 따라 쿠폰적용이 취소될<br/>
                수 있습니다. 이 때, 쿠폰은 유효기간 내에서 복원됩니다.<br/><br/>
                결제완료 상태에서 취소신청 하는 경우 즉시 환불되며, 상<br/>
                품/배송준비중 상태에서 취소신청 하는 경우 판매자의 승인<br/>
                후 환불됩니다. 단, 카드사의 상황에 따라 환불기간이 다소<br/>
                길어질 수있습니다.
              </p>
            </li>
          </transition-expand>
        </ul>
        <ul
          v-if="orders && orders.length > 0"
          class="cancellation-list"
        >
          <li
            v-for="order in orders"
            :key="order.orderNo"
            class="cancellation-list__item"
          >
            <order-info
              :order="order"
              :cancel="true"
              mode="status"
            />
          </li>
        </ul>
        <div
          v-if="orders && orders.length > 0"
          class="cancellation-reason">
          <h2 class="cancellation-reason__title">
            취소 사유
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
                v-model="form.inquiryTypeNo"
                :options="inquiryTypeOption"
              />
            </div>
            <div class="input-row">
              <app-label
                target="content"
              >
                상세 사유
              </app-label>
              <app-textarea
                id="content"
                v-model="form.inquiryContent"
                :height="21.6"
                :placeholder="`상세사유를 입력해 주세요.`"
              />
            </div>
          </div>
        </div>
        <div
          v-if="orders && orders.length > 0"
          class="order-block">
          <div class="order-block__header">
            <h3 class="order-block__title">
              환불 예정 정보
            </h3>
          </div>
          <div>
            <dl class="order-block__row">
              <dt class="order-block__label">
                환불 상품금액
              </dt>
              <dd class="order-block__value price">
                9,999,999<span class="currency">{{ $t('currency') }}</span>
              </dd>
            </dl>
            <div class="order-block__child">
              <dl class="order-block__row">
                <dt class="order-block__label">
                  총 상품금액
                </dt>
                <dd class="order-block__value price">
                  9,999,999<span class="currency">{{ $t('currency') }}</span>
                </dd>
              </dl>
              <dl class="order-block__row">
                <dt class="order-block__label">
                  환불 배송비
                </dt>
                <dd class="order-block__value price">
                  2,500<span class="currency">{{ $t('currency') }}</span>
                </dd>
              </dl>
            </div>
            <dl class="order-block__row">
              <dt class="order-block__label">
                차감금액
              </dt>
              <dd class="order-block__value price">
                -9,999,999<span class="currency">{{ $t('currency') }}</span>
              </dd>
            </dl>
            <div class="order-block__child">
              <dl class="order-block__row">
                <dt class="order-block__label">
                  즉시 할인
                </dt>
                <dd class="order-block__value price">
                  -9,999,999<span class="currency">{{ $t('currency') }}</span>
                </dd>
              </dl>
              <dl class="order-block__row">
                <dt class="order-block__label">
                  추가 할인
                </dt>
                <dd class="order-block__value price">
                  -9,999,999<span class="currency">{{ $t('currency') }}</span>
                </dd>
              </dl>
              <dl class="order-block__row">
                <dt class="order-block__label">
                  상품 쿠폰
                </dt>
                <dd class="order-block__value price">
                  -9,999,999<span class="currency">{{ $t('currency') }}</span>
                </dd>
              </dl>
              <dl class="order-block__row">
                <dt class="order-block__label">
                  장바구니 쿠폰
                </dt>
                <dd class="order-block__value price">
                  -9,999,999<span class="currency">{{ $t('currency') }}</span>
                </dd>
              </dl>
              <dl class="order-block__row">
                <dt class="order-block__label">
                  환불 차감금액
                </dt>
                <dd class="order-block__value price">
                  -9,999,999<span class="currency">{{ $t('currency') }}</span>
                </dd>
              </dl>
            </div>
            <dl class="order-block__row bottom sale-price">
              <dt class="order-block__label">
                환불 금액
              </dt>
              <dd class="order-block__value price total">
                9,999,999<span class="currency">{{ $t('currency') }}</span>
              </dd>
            </dl>
            <div class="order-block__child">
              <dl class="order-block__row">
                <dt class="order-block__label">
                  결제 취소금액
                </dt>
                <dd class="order-block__value price">
                  9,999,999<span class="currency">{{ $t('currency') }}</span>
                </dd>
              </dl>
              <dl class="order-block__row">
                <dt class="order-block__label">
                  임직원 포인트
                </dt>
                <dd class="order-block__value price">
                  9,999,999<span class="currency">{{ $t('currency') }}</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <footer
          v-if="orders && orders.length > 0"
          class="button-list">
          <app-button type="secondary">
            취소
          </app-button>
          <app-button type="success">
            등록
          </app-button>
        </footer>
        <div v-if="orders && orders.length === 0">
          <not-found
            :description="$t('mypage.cancelList.description')"
            :height="49.1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TransitionExpand from '@/components/common/transition/TransitionExpand'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppButton from '@/components/mobile/common/button/Button'
import Information from '@/components/mobile/common/Information'
import OrderInfo from '@/components/mobile/order/OrderInfo'
import AppSelect from '@/components/mobile/common/input/Select'
import AppLabel from '@/components/mobile/common/form/Label'
import AppTextarea from '@/components/mobile/common/input/Textarea'
import CancelListNew from '@/components/mixins/mypage/order/list/CancelListNew'
import NotFound from '@/components/mobile/common/list/NotFound'

export default {
  name: 'CancellationNew',
  mixins: [CancelListNew],
  components: {
    SubPageHeader,
    AppButton,
    Information,
    OrderInfo,
    AppSelect,
    AppLabel,
    AppTextarea,
    TransitionExpand,
    NotFound
  }
}
</script>

<style lang="scss" scoped>
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
        padding-top: 3.2rem;
        line-height: 1.5;
        padding-bottom: 1.3rem;
      }
    }
  }
  &-list {
    &__item {
      padding-bottom: 3.5rem;
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
      padding-bottom: 2rem;
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
        padding-top: 3.1rem;
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
    margin-bottom: 2rem;
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
</style>
