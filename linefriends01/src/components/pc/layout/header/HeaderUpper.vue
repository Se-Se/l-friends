<template>
  <div class="header__upper">
    <layout-width>
      <div class="header__upper--content">
        <div v-if="notices">
          <div v-for="(notice, index) in notices" :key="index" class="header__upper--notic">
            <transition name="notice">
              <div v-if="active === index" class="notice-swiper__item" @click="$router.push(`/notice/detail/${notice.articleNo}`)">
                <span class="header__upper--notic__title">NOTICE</span>
                <p class="header__upper--notic__topic">{{ notice.title }}</p>
              </div>
            </transition>
          </div>
        </div>
        <ul class="header__upper--list">
          <template v-if="isLogined === true">
            <li class="header__upper--item">
              <a href="javascript:" @click.prevent="logout">{{ $t('auth.logout') }}</a>
            </li>
            <!-- <li class="header__upper--item"
                          v-if="profile">
                        {{ profile.email }} {{ $t('user.wellcome') }}
                      </li> -->
            <li v-if="profile" class="header__upper--item">
              <router-link to="/mypage/orderlist">{{ $t('header.mypage') }}</router-link>
            </li>
          </template>
          <template v-else>
            <li class="header__upper--item">
              <router-link :to="{
                  path: '/member/login',
                  query: {
                    redirect: $route.meta.notMember ? '/' : $route.fullPath
                  }
                }">{{ $t('auth.login') }}</router-link>
            </li>
            <li class="header__upper--item">
              <router-link to="/member/join">{{ $t('user.menu.join') }}</router-link>
            </li>
          </template>
          <li class="header__upper--item">
            <router-link to="/mypage/orderlist">{{ $t('user.menu.delivery') }}</router-link>
          </li>
          <li class="header__upper--item">
            <router-link to="/etc/faq">{{ $t('user.menu.contact') }}</router-link>
          </li>
          <li class="header__upper--item">
            <router-link to="/others/stores">{{ $t('user.menu.shops') }}</router-link>
          </li>
        </ul>
      </div>
    </layout-width>
  </div>
</template>
<script>
import LayoutWidth from '../common/LayoutWidth'
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  name: 'header-upper',
  components: { LayoutWidth },
  async created () {
    this.setBoard('notice')
    await this.fetchList(this.search)

    this.len = this.notices && this.notices.length
    setInterval(() => {
      this.active = (this.active + 1) % this.len
    }, 5000)
  },
  data () {
    return {
      search: {
        keyword: ''
      },
      active: 0
    }
  },
  computed: {
    ...mapState('profile', ['profile']),
    ...mapGetters(['isLogined']),
    ...mapGetters('board', { notices: 'list' }),
    notice () {
      return this.list ? this.list[0].title : null
    }
  },
  methods: {
    ...mapActions('board', ['setBoard', 'fetchList']),
    logout () {
      this.$store.dispatch('authentication/logout')
    }
  }
}
</script>
