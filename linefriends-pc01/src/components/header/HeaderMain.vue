<template>
  <div class="header_main">
    <p class="logo">
      <a href="/">
        <img src="@/assets/img/common/logo_lf.png" alt />
      </a>
    </p>
    <div class="table-grid">
      <div class="sp_menu table-grid__left">
        <ul>
          <li>
            <router-link :to="jpUrl">日本限定</router-link>
          </li>
          <li class="on">
            <router-link to="/goods?sale=true">SALE</router-link>
          </li>
          <li :class="{'new': hasNewPromotion(promotionBanners)}">
            <router-link to="/event">プロモーション</router-link>
          </li>
        </ul>
      </div>
      <div class="search table-grid__right">
        <!-- HeaderSearch -->
        <header-search />
      </div>
    </div>
    <!-- ▼▼▼▼==== nav_global ====▼▼▼▼ -->
    <div class="nav_global">
      <nav>
        <ul>
          <li class="on" @mouseover="allmenuActive()" @mouseleave="allmenuUnActive()">
            <router-link to="/goods">すべて</router-link>
            <div class="sub_menu_all" v-show="allmenu && allm" @mouseover="allmenuActive()" @mouseleave="allmenuUnActive()">
              <div class="sub_menu_inner cf">
                <ul v-for="( category, key ) in categories" :key="key">
                  <li>
                    <router-link :to="'/goods/' + category.categoryNo + '?depth1Desc=' + category.label">{{ category.label }}</router-link>
                  </li>
                  <li v-for="submenu in category.children" :key="submenu.categoryNo">
                    <router-link :to="'/goods/' + category.categoryNo + '/' + submenu.categoryNo + '?depth1Desc=' + category.label + '&&depth2Desc=' + submenu.label">{{ submenu.label }}</router-link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li v-for="( category, key ) in categories" :key="key" @mouseover="menuActive(key)" @mouseleave="menuUnActive()">
            <router-link :to="'/goods/' + category.categoryNo + '?depth1Desc=' + category.label">{{ category.label }}</router-link>
            <div class="sub_menu" v-show="submenu === key && subm">
              <ul>
                <li v-for="submenu in category.children" :key="submenu.categoryNo">
                  <router-link :to="'/goods/' + category.categoryNo + '/' + submenu.categoryNo + '?depth1Desc=' + category.label + '&&depth2Desc=' + submenu.label">{{ submenu.label }}</router-link>
                </li>
              </ul>
            </div>
          </li>
          <li class="character" @mouseover="charactersAllmenu()" @mouseleave="charactersAllmenuUn()">
            <a href="#">キャラクター</a>
            <div class="character_menu" v-show="charactersmenu && characterm">
              <div class="character_inner">
                <div class="cf">
                  <div class="cha_area" v-for="(brand, key) in brands" :key="key">
                    <div class="cha_head cf">
                      <p class="ttl">{{ brand.label }}</p>
                      <p class="txt_ex" v-if="brand.intro">
                        <!-- <router-link :to="brand.intro">キャラクター紹介</router-link> -->
                        <router-link to="#">キャラクター紹介</router-link>
                      </p>
                    </div>
                    <div class="cha_main">
                      <ul>
                        <li v-for="(item, key) in brand.brands" :key="key">
                          <router-link :to="`/goods?brandNos=${key === 0 ? getSubBrand(brand.brandNo) : item.brandNo}&brandName=${key === 0 ? brand.label : item.label}`">
                            <p class="img">
                              <img :src="item.icon" />
                            </p>
                            <span class="ttl">{{ item.label }}</span>
                          </router-link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    <!-- ▲▲▲▲==== nav_global ====▲▲▲▲ -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import HeaderSearch from '@/components/header/HeaderSearch'

export default {
  name: 'HeaderMain',
  data () {
    return {
      jpUrl: '/goods/' + process.env.VUE_APP_JAPAN_CATEGORY + '?depth1Desc=日本限定',
      active: 0,
      submenu: false,
      allmenu: false,
      charactersmenu: false,
      favoriteKeyword: 'BT21'
    }
  },
  components: {
    HeaderSearch
  },
  props: ['characterm', 'allm', 'subm'],
  computed: {
    ...mapState('common', ['categories']),
    ...mapState('brand', ['brands']),
    ...mapState('cart', ['count']),
    ...mapGetters('display', ['promotionBanners'])
  },
  methods: {
    allmenuActive () {
      this.allmenu = true
      this.charactersmenu = false
      this.salemenu = false
    },
    allmenuUnActive () {
      this.allmenu = false
    },
    menuActive (key) {
      this.submenu = key
      this.allmenu = false
      this.salemenu = false
      this.charactersmenu = false
      this.searchFoucs = false
    },
    menuUnActive () {
      this.submenu = -1
    },
    charactersAllmenu () {
      this.charactersmenu = true
    },
    charactersAllmenuUn () {
      this.charactersmenu = false
    },
    duration (registerYmdt) {
      let currentDate = new Date()
      currentDate.setDate(currentDate.getDate() - 7)
      registerYmdt = new Date(registerYmdt)
      return registerYmdt > currentDate
    },
    hasNewPromotion (items) {
      if (items && items.length) {
        for (let item of items) {
          if (this.duration(item.registerYmdt)) {
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
  }
}
</script>

<style>
</style>
