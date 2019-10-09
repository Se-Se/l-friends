<template>
  <div>
    <sub-page-header :title="$t('menu.withdrawal')" />

    <div class="withdrawal--block">
      <h3 class="withdrawal-title">
        서비스를 이용하시는데 불편함이 있으셨나요?
      </h3>
      <p class="withdrawal-content">
        쇼핑몰에서 발송하는 쇼핑혜택알림은 <router-link to="/mypage/profile">마이페이지 > 정보수정</router-link>에서 수신거부 할 수 있습니다.
      </p>
      <p class="withdrawal-content">
        이용 불편 및 각종 문의 사항은 고객센터(1544-5921) 또는
        <router-link to="/mypage/inquiry" class="link">1:1문의</router-link>로 문의 해 주시면 성심 성의껏 답변 드리겠습니다.
      </p>
    </div>

    <div class="withdrawal--block">
      <h3 class="withdrawal-title">
        탈퇴 시 유의사항
      </h3>
      <p class="withdrawal-content">
        회원탈퇴 시 회원전용 서비스 이용은 불가능합니다. <span class="active-red">보유하셨던 쿠폰 등 회원 전용 혜택은</span>탈퇴와 함께 삭제되며 복구되지 않습니다.
      </p>
      <p class="withdrawal-content">
        주문내역이 있는 경우, 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 계약 또는 청약철회에 관한 기록,
        대금결제 및 재화 등의 공급에 관한 기록은 탈퇴 후 5년 동안 보존됩니다.
      </p>
      <p class="withdrawal-content">
        고객센터 또는 1:1 문의를 통한 고객상담 기록이 있는 경우,
        전자상거래 등에서의 소비자 보호에 관한 법률에 따라 소비자의 불만 또는 분쟁처리에 관한 기록은 탈퇴 후 3년간 보존됩니다.
      </p>
      <p class="withdrawal-content">
        탈퇴 완료 시 회원님의 개인정보는 삭제되지만 회원일 때 작성하였던 상품문의 및 상품평은 삭제되지 않습니다.
        상품문의 및 상품평 삭제를 원하실 경우 먼저 게시물을 삭제하신 후 탈퇴를 신청하시기 바랍니다.
      </p>
      <p class="withdrawal-content">
        회원탈퇴 시 일주일간 동일한 아이디로 재 가입 불가합니다.
        탈퇴를 요청하시기 전에 주문 상품의 구매 절차가 완료되지 않은 경우 불이익은 회원님이 부담하셔야 함을 유의해 주시기 바랍니다.
      </p>
      <div class="withdrawal-input">
        <app-checkbox
          v-model="agree"
        >
          <span class="withdrawal-agree-label">탈퇴 시 유의사항을 모두 확인하였으며 동의합니다.</span>
        </app-checkbox>
      </div>
    </div>

    <div class="withdrawal--block">
      <h3 class="withdrawal-title">
        남기고 싶은 의견이 있으시면 기재해 주세요. (선택)
      </h3>
      <app-textarea
        v-model="opinion"
        class="withdrawal-opinion"
        :placeholder="$t('placeholder.opinion')"
        style="width:100%"
        :maxLength="100"
      />
      <div class="withdrawal-buttons">
        <app-button
          class="withdrawal-button"
          type="secondary"
          @click="goProfile"
          bold
        >
          {{ $t('mypage.withdrawal.button.cancel') }}
        </app-button>
        <app-button
          class="withdrawal-button"
          type="success"
          @click="submit"
          bold
        >
          {{ $t('mypage.withdrawal.button.ok') }}
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
import SubPageHeader from '../../layout/header/SubPageHeader'
import AppCheckbox from '../../common/input/Checkbox'
import AppTextarea from '../../common/input/Textarea'
import AppButton from '../../common/button/Button'

import Withdrawal from '@/components/mixins/mypage/Withdrawal'

export default {
  name: 'Withdrawal',
  mixins: [Withdrawal],
  components: {
    SubPageHeader,
    AppCheckbox,
    AppTextarea,
    AppButton
  }
}
</script>

<style lang="scss" scoped>
.active-red {
  color: #ff414e;
}

.withdrawal {
  &--block {
    padding: 3.1rem 2rem 3.4rem;

    &:not(:last-child) {
      border-bottom: 1px solid #ededed;
    }
  }

  &-title {
    margin-bottom: 1.2rem;
    font-size: 1.6rem;
    font-family:'Noto Sans KR';
    font-weight: bold;
    letter-spacing: -0.01rem;
    line-height: normal;
    color: #333;
  }

  &-content {
    font-size: 1.4rem;
    letter-spacing: -0.01rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    color: #666;
    line-height: 2.4rem;

    &:not(:last-child) {
      margin-bottom: 1.4rem;
    }

    a {
      color: #4ba4d9;
      text-decoration: underline;
    }
  }

  &-input {
    padding-top: 0.4rem;
  }

  &-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;

    > .withdrawal-button {
      width: 48.9%;
    }
  }

  &-agree-label {
    margin-left: 1.2rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 1.4rem;
    color: #333;
    letter-spacing: -0.01rem;
    line-height: 1.2;
  }
}
</style>
