<template>
  <div>
    <sub-page-header title="반품처리현황" />

    <div id="container">
      <div class="cancellation-status">
        <ul class="cancellation-status__list">
          <li class="cancellation-status--item">
            <h2 class="cancellation-status--item__title">
              상품정보
            </h2>
            <div class="cancellation-status--item__info">
              <p class="cancellation-status--item__info-title">
                BROWN & FRIENDS | RHODIA<br>
                BROWN Special Edition / 최대<br>
                width 191
              </p>
              <p class="cancellation-status--item__info-option">
                사이즈: S / 구매수량 : 99개
              </p>
            </div>
          </li>
          <li class="cancellation-status--item">
            <h2 class="cancellation-status--item__title">
              주문상태
            </h2>
            <div class="cancellation-status--item__info">
              <p class="cancellation-status--item__info-title">
                취소처리중
              </p>
            </div>
          </li>
        </ul>
        <div class="cancellation-status--reason">
          <h2 class="cancellation-status--reason__title">
            반품 사유
          </h2>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              반품사유구분
            </p>
            <p class="cancellation-status--reason__info-value">
              단순 변심(색상, 사이즈)
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              반품상세이유
            </p>
            <p class="cancellation-status--reason__info-value">
              옷이 마음에 들지 않습니다.
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
              9,999,999원
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              차감 금액
            </p>
            <p class="cancellation-status--reason__info-value">
              -9,999,999원
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              환불 금액
            </p>
            <p class="cancellation-status--reason__info-value">
              9,999,999원
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              환불 수단
            </p>
            <p class="cancellation-status--reason__info-value">
              PAYCO
            </p>
          </div>
        </div>
        <div class="cancellation-status--reason">
          <h2 class="cancellation-status--reason__title">
            반품 수거 정보
            <p class="cancellation-status--reason__subtitle">상품 수거를 위해 아래 주소로 택배기사가 방문합니다.</p>
          </h2>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              받는 사람
            </p>
            <p class="cancellation-status--reason__info-value">
              이지영
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title" style="width: 30px;">
              주소
            </p>
            <p class="cancellation-status--reason__info-value">
              (06536) 서울특별시 강남구 반포동<br/>
              10층 브랜드칸 타워
            </p>
          </div>
          <div class="cancellation-status--reason__info">
            <p class="cancellation-status--reason__info-title">
              휴대전화
            </p>
            <p class="cancellation-status--reason__info-value">
              010-1234-1324
            </p>
          </div>
        </div>
      </div>
      <footer class="button-list">
        <app-button type="secondary">
          취소
        </app-button>
        <app-button type="success">
          확인
        </app-button>
      </footer>
    </div>
    <app-footer />
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppFooter from '@/components/mobile/layout/footer/Footer'
import AppButton from '@/components/mobile/common/button/Button'

export default {
  name: 'ReturnStatus',
  components: {
    SubPageHeader,
    AppFooter,
    AppButton
  },
  data () {
    return {
      period: null
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
    padding-bottom: 3.4rem;
    border-bottom: .1rem solid #ededed;
  }
  &--item {
    display: flex;
    padding: 1.2rem 2rem 0;
    font-family: 'Noto Sans KR';
    justify-content: space-between;
    &:first-child {
      padding-top: 0;
    }
    &__title {
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
      border-bottom: .1rem solid #ededed;
    }

    &:last-child {
      padding-bottom: 3.8rem;
    }

    &__title {
      padding: 0 0 2.8rem 2rem;
      font-family: 'Noto Sans KR';
      font-size: 1.6rem;
      font-weight: bold;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #333333;
    }
    &__subtitle {
      padding: 0.6rem 0.1rem 0;
      font-family: 'Noto Sans KR';
      font-size: 1.2rem;
      font-weight: normal;
      line-height: 1;
      letter-spacing: -0.01rem;
      color: #666666;
    }
    &__info {
      display: flex;
      padding: 0 2rem;
      font-family: 'Noto Sans KR';
      font-size: 1.4rem;
      font-weight: normal;
      line-height: 1.43;
      letter-spacing: -0.01rem;
      color: #333333;
      justify-content: space-between;

      &:not(:last-child) {
        padding-bottom: 1.2rem;
      }

      &-value {
        text-align: right;
      }
    }
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
