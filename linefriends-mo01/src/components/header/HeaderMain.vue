<template>
  <div class="head_con" @click="clickListener">
    <header-top @showHamberger="hamberger = true" />
    <div :class="{'aside_menu_bg':true, 'disp-none':!hamberger}" @close="hamberger=false">
      <div ref="aside_menu" class="aside_menu category_aside_menu" @close="hamberger=false">
        <div class="aside_menu_top">
          <h3>
            <template v-if="loginState && profile">
              <a href="javascript:">{{profile && profile.nickname}}<span>さん</span></a>
              <button class="mypage" @click.prevent="goMypage">マイページ</button>
            </template>
            <template v-else>
              <router-link to="/m/member/login">ログイン</router-link>
            </template>
          </h3>
        </div>
        <div class="aside_menu_nav">
          <div class="nav_list">
            <ul @click.prevent="closeMenu">
              <li>
                <router-link to="/m/mypage/like">
                  <p class="nav_icon">
                    <img src="@/assets/img/icon/ico_like.png">
                  </p>
                  <p class="nav_text">お気に入り</p>
                </router-link>
              </li>
              <li>
                <router-link to="/m/mypage/orderlist">
                  <p class="nav_icon">
                    <img src="@/assets/img/icon/ico_order.png">
                  </p>
                  <p class="nav_text">注文/配送</p>
                </router-link>
              </li>
              <li>
                <router-link to="#">
                  <p class="nav_icon"><img src="@/assets/img/icon/ico_cs.png"></p>
                  <p class="nav_text">利用ガイド</p>
                </router-link>
              </li>
              <li>
                <router-link to="/m/etc/faq">
                  <p class="nav_icon"><img src="@/assets/img/icon/ico_consult.png"></p>
                  <p class="nav_text">サポート</p>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="latest_item" v-if="recentProducts.length > 0" @click.prevent="closeMenu">
          <h3>最近見た商品</h3>
          <div class="scroll_box">
            <ul class="latest_list" style="width: 336px;">
              <li v-for="(recent, key) in recentProducts" :key="key">
                <template v-if="key !== recentProducts.length">
                  <router-link :to="'/m/product/detail/' + recent.productNo">
                    <img :src="recent.imageUrls[0]" alt="">
                  </router-link>
                </template>
                <template v-else>
                  <router-link :to="'/m/product/detail/' + recent.productNo" class="last_browse">
                    <img :src="recent.imageUrls[0]" alt="">
                  </router-link>
                </template>
              </li>
            </ul>
          </div>
        </div>
        <div class="top_menu" @click.prevent="closeMenu">
          <ul class="top_menu_list">
            <li>
              <router-link to="/m/goods">すべて</router-link>
            </li>
            <li>
              <router-link :to="jpUrl">日本限定</router-link>
            </li>
            <li class="hot">
              <router-link to="/m/goods?sale=true">SALE</router-link>
            </li>
          </ul>
        </div>
        <div class="aside_menu_inner">
          <ul class="sub_category">
            <li :class="{character:true, is_active:active === -1}">
              <div class="li_div" @click="active = active === -1 ? -2 : -1">
                <img class="ico_animation pl-20" src="@/assets/img/character/ico_animation.gif" />
                <span class="every_list_title pl-8">キャラクター</span>
                <a :class="{'arrow_wrap':true, 'is_open':active === -1}"></a>
              </div>
              <div class="char_detail" v-show="active===-1">
                <div class="char_area" v-for="( brand, key ) in brands" :key="key">
                  <h3>
                    {{ brand.label }}
                    <!-- <router-link :to="brand.intro" v-if="brand.intro">キャラクター紹介</router-link> -->
                    <a @click.prevent="closeMenu" v-if="brand.intro">キャラクター紹介</a>
                  </h3>
                  <ul class="char_list">
                    <li v-for="(item, key) in brand.brands" :key="key">
                      <router-link @click.native="closeMenu" :to="`/m/goods?brandNos=${key === 0 ? getSubBrand(brand.brandNo) : item.brandNo}&brandName=${item.label}`">
                        <p class="char_icon">
                          <img :src="item.icon">
                        </p>
                        <p class="char_name">{{ item.label }}</p>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
            </li>

            <li class="toy" v-for="( category, index ) in categories" :key="category.categoryNo">
              <div class="li_div" @click="setActive(index)">
                <a href="javascript:">
                  <span :class="{'new_ico':isNew(category), 'every_list_title':true, 'pl-20':true}">{{ category.label }}</span>
                </a>
                <a :class="{'arrow_wrap':true, 'is_open':active===index}"></a>
              </div>
              <div :class="{'sub_category_2':true, 'disp-blk':active===index}" v-if="category.children">
                <ul>
                  <li>
                    <router-link @click.native="closeMenu" :to="'/m/goods/' + category.categoryNo + '?depth1Desc=' + category.label">
                      すべて
                    </router-link>
                  </li>
                  <li v-for="submenu in category.children" :key="submenu.categoryNo">
                    <router-link @click.native="closeMenu" :to="'/m/goods/' + category.categoryNo + '/' + submenu.categoryNo + '?depth1Desc=' + category.label + '&&depth2Desc=' + submenu.label">
                      {{ submenu.label }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
            <li class="border-top" :class="{'new_ico': hasNewPromotion(promotionBanners)}">
              <router-link to="/m/event" class="every_list_title pl-20" @click.native="closeMenu">プロモーション</router-link>
            </li>
            <li class="promotion bt-none">
              <router-link to="/m/others/store" class="every_list_title pl-20" @click.native="closeMenu">店舗情報</router-link>
            </li>
          </ul>
          <div class="category_btn logout" v-if="loginState && profile">
            <a href="javascript:" @click.prevent="logout">ログアウト</a>
          </div>
          <div class="category_btn" v-else>
            <router-link :to="{
                path: '/m/member/login',
                query: {
                  redirect: $route.meta.notMember ? '/m' : $route.fullPath
                }
              }">ログイン</router-link>
            <router-link to="/m/member/join">会員登録</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderTop from '@/components/header/HeaderTop'
import { mapState, mapGetters } from 'vuex'
import { isLogin } from '@/utils/utils'
import { lock, unlock } from 'tua-body-scroll-lock'
export default {
  name: 'HeaderMain',
  components: {
    HeaderTop
  },
  data () {
    return {
      jpUrl: '/m/goods/' + process.env.VUE_APP_JAPAN_CATEGORY + '?depth1Desc=日本限定',
      hamberger: false,
      active: -2,
      loginState: isLogin()
    }
  },
  methods: {
    clickListener (e) {
      if (e.target.classList.contains('aside_menu_bg')) {
        this.hamberger = false
      }
    },
    closeMenu () {
      this.hamberger = false
    },
    setActive (index) {
      this.active = this.active === index ? -2 : index
    },
    logout () {
      this.$store.dispatch('authentication/logout')
    },
    goMypage () {
      this.$router.push({
        path: '/m/mypage'
      })
      this.hamberger = false
    },
    isNew (category) {
      if (this.news) {
        let isNew = this.news.indexOf(category.categoryNo) >= 0
        for (let submenu in category.children) {
          isNew = isNew || this.news.indexOf(submenu.categoryNo) >= 0
        }

        return isNew
      }
    },
    duration (displayStartYmdt) {
      let currentDate = new Date()
      currentDate.setDate(currentDate.getDate() - 7)
      displayStartYmdt = new Date(displayStartYmdt)
      return displayStartYmdt < currentDate
    },
    hasNewPromotion (items) {
      if (items && items.length) {
        for (let item of items) {
          if (this.duration(item.displayStartYmdt)) {
            return true
          }
        }
      }
    },
    getSubBrand (pBrandcode) {
      let subBrands = this.brands.filter(item => item.brandNo === pBrandcode)
      let subBrandCodes = subBrands[0].brands.map(item => item.brandNo).slice(1)
      return subBrandCodes
    }
  },
  computed: {
    ...mapState('recent', ['recentProducts']),
    ...mapState('common', ['categories', 'news']),
    ...mapState('brand', ['brands']),
    ...mapState('likeProducts', ['totalCount']),
    ...mapState('profile', ['profile']),
    ...mapGetters('display', ['promotionBanners'])
  },
  watch: {
    $route (to, from) {
      this.hamberger = false
      this.active = -2
    },
    hamberger (next) {
      this.$nextTick(() => {
        if (next) {
          lock(this.$refs.aside_menu)
        } else {
          unlock(this.$refs.aside_menu)
        }
      })
    }
  },
  beforeDestroy () {
    unlock(this.$refs.aside_menu)
  }
}
</script>
