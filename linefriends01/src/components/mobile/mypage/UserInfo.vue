<template>
  <div :class="['user-info__wrapper', isExec ? 'executives' : '']">
    <div class="user-info">
      <p class="user-info__name">
        <strong>{{ memberName | formatName }}</strong><span>{{ $t('common.sir') }}</span>
      </p>
      <router-link
        to="/mypage/profile"
        class="user-info__update-btn"
      >{{ $t('user.menu.updateInfo') }}</router-link>
    </div>
    <span class="user-info__welcome">{{ $t('common.welcome') }}</span>
    <div
      v-if="isExec"
      class="user-info__executives"
    >
      <dl class="executives-point">
        <dt class="executives-point__label">임직원 포인트</dt>
        <dd class="executives-point__point">
          {{ welfareTotal.totalAvailableAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import cookies from 'js-cookie'

export default {
  name: 'UserInfo',
  computed: {
    ...mapState('member', ['mySummary', 'welfareTotal']),
    ...mapState('myorder', ['pointName']),
    ...mapGetters('profile', ['memberId', 'memberName', 'isExec']),
    point () {
      return this.profile.point.toLocaleString()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  justify-content: space-between;

  &__wrapper {
    padding: 3rem 2rem 3.4rem 2rem;
    height: auto;
  }

  &__name {
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 2.4rem;
    line-height: normal;
    color: #333;
    width: 28rem;

    strong {
      display: inline-block;
      max-width: 23rem;
      padding-right:0.5rem; 
      font-weight: bold;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

    }
    span {
      position: absolute;
    }
  }

  &__welcome {
    display: block;
    margin-top: 0.1rem;
    padding-left: 0.2rem;
    line-height: normal;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 1.4rem;
    color: #999;
  }

  &__update-btn {
    margin-top: 0.7rem;
    border: 1px solid #999;
    border-radius: 1.4rem;
    width: 7.1rem;
    height: 2.8rem;
    text-align: center;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 1.2rem;
    color: #666;
    line-height: 2.7rem;
  }

  &__executives {
    padding-top: 3rem;
  }
}

.executives-point {
  display: flex;

  &__label {
    display: inline-block;
    margin-right: 1.2rem;
    padding-top: 0.3rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 1.4rem;
    line-height: 1.43;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &::before {
    content: '';
    display: inline-block;
    margin-top: 0.6rem;
    margin-right: 0.7rem;
    width: 1.6rem;
    height: 1.6rem;
    background-image: url(~@/assets/images/common/mypage/ic-money.svg);
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  &__point {
    font-size: 1.6rem;
    font-family: Volte, sans-serif;
    font-weight: 600;
    line-height: normal;
    color: #00d664;

    > .currency {
      font-family: 'Noto Sans KR';
      font-size: 1.6rem;
      font-weight: 500;
      letter-spacing: -0.01rem;
    }
  }
}
</style>
