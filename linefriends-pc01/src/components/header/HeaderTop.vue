<template>
  <div class="header_top">
    <div class="header_top_inner table-grid">
      <div class="express table-grid__left">
        <p class="txt_ex">6,000円以上お買い上げで</p>
        <span class="free">送料無料</span>
      </div>
      <div class="menu table-grid__right">
        <ul>
          <template v-if="loginState && profile">
            <li>
              <router-link to="/mypage">{{profile && profile.nickname}}さん</router-link>
            </li>
            <li>
              <a href="#" @click.prevent="logout">ログアウト</a>
            </li>
            <li>
              <router-link to="/mypage">マイページ</router-link>
            </li>
          </template>
          <template v-else>
            <li>
              <router-link :to="{
                path: '/member/login',
                query: {
                  redirect: $route.meta.notMember ? '/' : $route.fullPath
                }
              }">ログイン
              </router-link>
            </li>
            <li>
              <router-link to="/member/join">会員登録</router-link>
            </li>
          </template>
          <li>
            <router-link to="/mypage/orderlist">注文/配送</router-link>
          </li>
          <li>
            <router-link to="#">利用ガイド</router-link>
          </li>
          <li>
            <router-link to="/etc/faq">サポート</router-link>
          </li>
          <li>
            <router-link to="/others/store">店舗情報</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { isLogin } from '@/utils/utils'
import { mapState } from 'vuex'
export default {
  name: 'HeaderTop',
  data () {
    return {
      loginState: isLogin()
    }
  },
  computed: {
    ...mapState('profile', ['profile'])
  },
  methods: {
    logout () {
      this.$store.dispatch('authentication/logout')
    }
  }
}
</script>

<style>
</style>
