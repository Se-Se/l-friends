<template>
  <article class="user-info">
    <p
      v-if="isLogined"
      class="user-name"
    >
      <router-link to="/mypage" class="user-name__link">
      <strong>{{ memberName }}</strong>{{ $t('user.wellcome') }}
      </router-link>
    </p>
    <p
      v-else
      class="user-name"
    >
      <router-link
        :to="{
          path: '/member/login',
          query: {
            redirect: $route.meta.notMember ? '/' : $route.fullPath
          }
        }"
        class="user-name__link"
      >{{ $t('auth.login') }}{{ $t('common.isRequired') }}
      </router-link>
    </p>
    <nav class="user-nav__wrapper">
      <ul class="user-nav">
        <li class="user-nav__item">
          <router-link to="/mypage">
            <div class="user-nav__item-icon">
              <img src="~@/assets/images/common/user.svg">
            </div>
            <span class="user-nav__item-label">{{ $t('user.menu.mypage') }}</span>
          </router-link>
        </li>
        <li class="user-nav__item">
          <router-link to="/mypage/orderlist">
            <div class="user-nav__item-icon">
              <img src="~@/assets/images/common/delivery.svg">
            </div>
            <span class="user-nav__item-label">{{ $t('user.menu.delivery') }}</span>
          </router-link>
        </li>
        <li class="user-nav__item">
          <router-link to="/etc/faq">
            <div class="user-nav__item-icon">
              <img src="~@/assets/images/common/information.svg">
            </div>
            <span class="user-nav__item-label">{{ $t('user.menu.contact') }}</span>
          </router-link>
        </li>
        <li class="user-nav__item">
          <router-link to="/others/stores">
            <div class="user-nav__item-icon">
              <img src="~@/assets/images/common/home.svg">
            </div>
            <span class="user-nav__item-label">{{ $t('user.menu.shops') }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </article>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'UserInfo',
  computed: {
    ...mapState('profile', ['profile']),
    ...mapGetters(['isLogined']),
    ...mapGetters('profile', ['memberId', 'memberName'])
  }
}
</script>

<style lang="scss" scoped>
.user {
  &-info {
    background: #3d485e;
    padding: 0 0 2rem;
  }

  &-name {
    height: 6rem;
    border-bottom: 1px solid rgba(255,255,255,0.12);
    line-height: 6rem;
    letter-spacing: 0.06rem;
    color: #fff;
    font-size: 1.6rem;
    font-family: "Noto Sans KR",sans-self;
    font-weight: normal;

    &__link{
      display: inline-block;
      width: 100%;
      height: 100%;
      padding: 0 2rem;
    }

    strong {
      margin-right: 0.4rem;
      display: inline-block;
      max-width: 15.1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
      vertical-align: top;
    }

    .underline {
      text-decoration: underline;
    }
  }

  &-nav {
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;

    &__wrapper {
      padding-top: 1.2rem;
    }

    &__item {
      font-size: 0;

      &-icon {
        display: flex;
        opacity: 0.7;
        height: 4rem;
        align-items: center;
        justify-content: center;

        & > img {
          width: auto;
          height: 2.15rem;
        }
      }

      &-label {
        font-family: 'Noto Sans KR';
        font-weight: normal;
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.7);
        letter-spacing: -0.01rem;
        display: block;
      }
    }
  }
}
</style>
