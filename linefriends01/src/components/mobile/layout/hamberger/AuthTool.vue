<template>
  <div class="auth-tools__wrapper">
    <ul class="auth-tools">
      <li
        v-if="!isLogined"
        class="auth-tools__item"
      >
        <router-link
          :to="{
            path: '/member/login',
            query: {
              redirect: $route.meta.notMember ? '/' : $route.fullPath
            }
          }"
        >
          {{ $t('auth.login') }}
        </router-link>
      </li>
      <li
        v-if="!isLogined"
        class="auth-tools__item"
      >
        <router-link to="/member/join/terms">
          {{ $t('auth.join') }}
        </router-link>
      </li>
      <li
        v-if="isLogined"
        class="auth-tools__item"
        @click="logout"
      >
        {{ $t('auth.logout') }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AuthTool',
  computed: {
    ...mapGetters(['isLogined'])
  },
  methods: {
    ...mapActions('authentication', ['logout'])
  }
}
</script>

<style lang="scss" scoped>
.auth-tools {
  display: flex;

  &__wrapper {
    height: 5.6rem;
    padding: 0.4rem 0;
    box-sizing: border-box;
    background: #fafafa;
  }

  &__item {
    position: relative;
    flex: 1;
    line-height: 4.8rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 1.6rem;
    text-align: center;
    color: #999;

    &:nth-of-type(2)::before {
      position: absolute;
      display: block;
      content: '';
      width: 0.1rem;
      height: 2rem;
      left: 0;
      top: 1.4rem;
      background-color: #ddd;
    }

    > a {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
