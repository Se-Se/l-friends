<template>
  <div :on="scrollHandler">
    <header-wrapper class="tempShow" :class="{
        header: true,
        show: scrolled,
        _detail: $route.name === 'GoodsDetail'
      }">
      <header-upper />
      <layout-width>
        <div class="header-middle">
          <div class="header-middle__left">
            <router-link to="/event">{{ $t('menu.promotion') }}</router-link>
          </div>
          <div class="header-middle__logo">
            <figure class="center">
              <a href="/"><img src="~@/assets/images/common/logo.svg" /></a>
            </figure>
          </div>
          <div class="header-middle__right">
            <router-link to="/cart" :class="{
                'header-middle__cart' : true,
                'active': count && count.count > 0
              }">
              <p>{{ count ? count.count : 0 }}</p>
            </router-link>
            <div :class="{
                'header-middle__search': true,
                '__icon': searchActive
              }" v-click-outside="isSearchClose">
              <div :class="searchFoucs ? 'search_box_on' : 'search_box_def'">
                <input type='password' width="0px" height="0px" class="hidden-input">
                <input type="text" id="search" placeholder="검색어를 입력하세요" tabindex="1" autocomplete='off' accesskey='s' style='ime-mode:active;' aria-autocomplete='both' @focus="searchBoxFoucs" v-model="searchWord" @input="showSearchResult" @keypress.13="search">
                <button class="search-default__btn" v-if="!searchFoucs" @click="search">Search</button>
                <button v-if="searchIng" class="search-default__del" @click="searchDel()">
                  Del
                </button>
                <a class="search-default__btn" @click="search" v-if="searchFoucs">search</a>
                <div v-show="searchFoucs && showFavoriteKeywords" class="search-view">
                  <ul class="search-view__header">
                    <li v-if="isLogined" class="search-view__header-item">
                      <button type="button" :class="{ '_active':lately }" @click="searchLately()">
                        {{ $t('header.latelySearch') }}
                      </button>
                    </li>
                    <li :class="{ 'search-view__header-item':true, '_login': !isLogined }">
                      <button type="button" :class="{ '_active':recommand }" @click="searchRecommand()">
                        {{ $t('header.recommandSearch') }}
                      </button>
                    </li>
                  </ul>
                  <div class="search-view__content">
                    <template v-if="isLogined">
                      <ul v-show="lately" class="search-view__list">
                        <template v-if="searchHistory.length === 0">
                          <p>{{ $t('header.latelyNoData') }}</p>
                        </template>
                        <template v-else>
                          <li v-for="(item, index) in searchHistory" :key="index" class="search-view__item">
                            <p class="search-view__item-title" @click="searchItem(item)">
                              {{ item }}
                            </p>
                            <button type="button" class="search-view__item-del" @click="REMOVE_SEARCH_LOG(item)">
                              {{ $t('header.del') }}
                            </button>
                          </li>
                        </template>
                      </ul>
                    </template>
                    <ul v-show="recommand" class="search-view__list _recommand-list">
                      <template v-if="inputFavoriteKeywords">
                        <li v-for="(item, index) in inputFavoriteKeywords" v-if="index < 10" class="search-view__item">
                          <p class="search-view__item-title">
                            <a href="javascript:" @click="searchItem(item)">{{item}}</a>
                          </p>
                        </li>
                      </template>
                      <template v-else>
                        <p class="search-view__item-title">
                          {{ $t('header.recommandNoData') }}
                        </p>
                      </template>
                    </ul>
                    <template v-if="searchHistory.length !== 0 && isLogined">
                      <div class="search-view__footer">
                        <button v-if="searchFoucs" @click="closeSearchKeyword" type="button" class="search-view__footer-all">
                          {{ $t('header.allDel') }}
                        </button>
                      </div>
                    </template>
                  </div>
                  <ul class="result_list" v-if="searchFoucs && showResultKeywords">
                    <li v-for="(item, index) in searchResultWords" @click="clickSearchResultWords(index)" style="cursor: pointer;">
                      {{item[0]}}<span>{{item[1]}}</span>{{item[2]}}
                    </li>
                  </ul>
                  <!-- <a class="close_btn" href="javascript:" @click="closeSearchKeyword" v-if="searchFoucs">닫기</a> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="header-menu">
          <ul class="header-menu__list" @mouseleave="menuAllClear()">
            <li class="header-menu__item all" @mouseover="allmenuActive()" @mouseleave="allmenuUnActive()">
              <router-link to="/goods">
                <span v-bind:class="{'header-menu__item--total': allmenu === true}">{{ $t('menu.all') }}</span>
              </router-link>
            </li>
            <li class="header-menu__item sale" @mouseover="salemenuActive()" @mouseleave="salemenuUnActive()">
              <router-link to="/goods/sale">
                <span v-bind:class="{'header-menu__item--sale': salemenu === true }">{{ $t('menu.sale') }}</span>
              </router-link>
            </li>
            <li v-for="( category, key ) in categories" :key="key" @mouseover="menuActive(key)" @mouseleave="menuUnActive()" v-bind:class="{ 'header-menu__item': true, toy: category.label === '토이' }">
              <router-link :to="'/goods/' + category.categoryNo + '?depth1Desc=' + category.label">
                <span v-bind:class="{ 'header-menu__item--hover': submenu === key }">{{ category.label }}</span>
              </router-link>
              <div class="header-menu__sub" v-show="submenu === key">
                <ul class="header-menu__sub--list">
                  <li class="header-menu__sub--item" v-for="submenu in category.children" :key="submenu.categoryNo">
                    <router-link :to="'/goods/' + category.categoryNo + '/' + submenu.categoryNo + '?depth1Desc=' + category.label + '&&depth2Desc=' + submenu.label">
                      {{ submenu.label }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
            <li class="header-menu__item characters" @mouseover="charactersAllmenu()" @mouseleave="charactersAllmenuUn()">
              <a href="#">
                <span v-bind:class="{'header-menu__item--all': charactersmenu === true}">
                  <span v-bind:class="{'header-menu__item--all-hover': charactersmenu === true}">{{ $t('menu.character') }}</span>
                </span>
              </a>
            </li>
          </ul>
          <div class="header-menu__all" v-show="allmenu === true" @mouseover="allmenuActive()" @mouseleave="allmenuUnActive()">
            <layout-width>
              <div class="header-menu__all--content">
                <ul class="menu_all--list" v-for="( category, key ) in categories" :key="key">
                  <li class="menu_all--item">
                    <router-link :to="'/goods/' + category.categoryNo + '?depth1Desc=' + category.label">{{ category.label }}
                    </router-link>
                  </li>
                  <li class="menu_all--item" v-for="submenu in category.children" :key="submenu.categoryNo">
                    <router-link :to="'/goods/' + category.categoryNo + '/' + submenu.categoryNo + '?depth1Desc=' + category.label + '&&depth2Desc=' + submenu.label">{{ submenu.label }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </layout-width>
          </div>
          <div class="header-menu__all" v-show="charactersmenu === true" @mouseover="charactersAllmenu()" @mouseleave="charactersAllmenuUn()">
            <layout-width>
              <div class="header-menu__all--content header-menu__char">
                <div v-for="(brand, key) in brands" :key="key" v-if="brand.intro" class="header-menu__char--list">
                  <div class="header-menu__char--header">
                    <h2 class="header-menu__char--header__title">{{ brand.label }}</h2>
                    <router-link :to="brand.intro" class="header-menu__char--header__action">
                      {{ $t('character.intro') }}
                    </router-link>
                  </div>
                  <ul class="header-menu__char--content">
                    <li class="header-menu__char--item">
                      <router-link :to="`/goods?brandNo=${brand.brandNo}&brandName=${brandLabelPath(brand.label)}`">
                        <figure class="header-menu__char--item__fig">
                          <img :src="brand.icon" />
                          <figcaption class="header-menu__char--item__fic">
                            <p>{{ $t('character.all') }}</p>
                          </figcaption>
                        </figure>
                      </router-link>
                    </li>
                    <li v-for="(item, key) in brand.brands" :key="key" class="header-menu__char--item">
                      <router-link :to="`/goods?brandNo=${item.brandNo}&brandName=${item.label}`">
                        <figure class="header-menu__char--item__fig">
                          <img :src="item.icon" />
                          <figcaption class="header-menu__char--item__fic">
                            <p>{{ item.label }}</p>
                          </figcaption>
                        </figure>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
            </layout-width>
          </div>
        </div>
      </layout-width>
    </header-wrapper>
  </div>
</template>

<script>
import * as $ from 'jquery'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import HeaderWrapper from './HeaderWrapper'
import HeaderUpper from './HeaderUpper'
import LayoutWidth from '../common/LayoutWidth'
import ClickOutside from 'vue-click-outside'
import cookies from 'js-cookie'
import { Alert } from '@/utils/event-bus'
import { gaEventSearch } from '@/utils/gaEventUtils'
export default {
  name: 'default-header',
  data () {
    return {
      submenu: false,
      allmenu: false,
      charactersmenu: false,
      salemenu: false,
      currentScroll: 0,
      lastScroll: 0,
      limitPosition: 500,
      scrolled: false,
      lastPosition: 0,
      searchActive: false,
      lately: true,
      recommand: false,
      searchFoucs: false,
      showFavoriteKeywords: false,
      showResultKeywords: false,
      searchIng: false,
      searchWord: '',
      searchResultWords: []
    }
  },
  components: {
    HeaderWrapper,
    HeaderUpper,
    LayoutWidth
  },
  directives: {
    ClickOutside
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    detail: {
      type: String,
      required: false
    }
  },
  watch: {
    url () {
      this.showMyMenu = false
    },
    '$route.name' (name) {
      if (name !== 'Search') {
        this.searchWord = ''
      }
    },
    $route () {
      this.outside()
      $('#search').blur()
    }
  },
  computed: {
    ...mapState('brand', ['brands']),
    ...mapState('cart', ['count']),
    ...mapState('categories', ['categories']),
    ...mapState('product', ['inputFavoriteKeywords']),
    ...mapState('productList', ['searchHistory', 'fetchListParams']),
    ...mapGetters(['isLogined']),
    url () {
      return this.$route && this.$route.path
    }
  },
  async mounted () {
    await this.newProductCategoryFetch()

    if (!this.categories) {
      this.fetchAll().catch(() => {
        Alert({
          title: this.$t('assets.notice'),
          message: this.$t('assets.noCategory')
        })
      })
    }
  },
  created () {
    window.addEventListener('scroll', this.scrollHandler)
    if (this.$route.name !== 'Category') {
      this.$store.dispatch('categories/fetchAll')
    }
    if (Object.keys(this.$route.query).includes('keyword')) {
      this.searchWord = this.$route.query.keyword
    }
    // this.$store.dispatch('product/_getFavoriteKeywords')
    this.$store.dispatch('product/_getInputFavoriteKeywords')

    if (this.isLogined === false) {
      this.recommand = true
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  methods: {
    ...mapMutations('productList', ['REMOVE_SEARCH_LOG', 'REMOVE_SEARCH_LOG_ALL']),
    ...mapActions('categories', ['fetchAll', 'newProductCategoryFetch']),
    ...mapMutations('search', ['show_search_layer']),
    ...mapActions('authentication', ['deleteToken']),
    menuActive (key) {
      this.submenu = key
      this.allmenu = false
      this.salemenu = false
      this.charactersmenu = false
      this.searchFoucs = false
    },
    menuAllClear () {
      this.submenu = -1
      this.searchFoucs = false
    },
    menuUnActive () {
      this.submenu = -1
    },
    allmenuActive () {
      this.allmenu = true
      this.charactersmenu = false
      this.salemenu = false
      this.searchFoucs = false
    },
    allmenuUnActive () {
      this.allmenu = false
    },
    charactersAllmenu () {
      this.charactersmenu = true
    },
    charactersAllmenuUn () {
      this.charactersmenu = false
    },
    salemenuActive () {
      this.salemenu = true
      this.charactersmenu = false
      this.allmenu = false
      this.searchFoucs = false
    },
    salemenuUnActive () {
      this.salemenu = false
      this.charactersmenu = false
      this.allmenu = false
      this.searchFoucs = false
    },
    searchList () {
      this.searchActive = true
    },
    searchListUn () {
      this.searchActive = false
    },
    searchLately () {
      this.recommand = false
      this.lately = true
    },
    searchRecommand () {
      this.recommand = true
      this.lately = false
    },
    isSearchClose () {
      this.searchFoucs = false
    },
    scrollHandler () {
      const header = document.querySelector('.header__wrapper')
      const showHeader = document.querySelector('tempShow')
      let scrollTop = $(window).scrollTop()
      if (this.lastPosition < scrollTop && header.offsetHeight < scrollTop) {
        this.scrolled = false
        this.charactersmenu = false
        this.allmenu = false
        this.salemenu = false
        this.submenu = false
        this.searchActive = false
        this.searchFoucs = false
        $('.header').removeClass('tempShow')
        // move up!
      }
      if (this.lastPosition > scrollTop) {
        this.scrolled = true
        $('.header').addClass('tempShow')
        // move down
      }
      this.lastPosition = scrollTop
      // this.scrolled = window.scrollY > 250;
    },
    searchBoxFoucs () {
      this.searchIng = true
      this.searchFoucs = true
      this.show_search_layer()
      if (this.searchWord === '') {
        this.showFavoriteKeywords = true
        this.showResultKeywords = false
      } else {
        this.showResultKeywords = true
        this.showFavoriteKeywords = false
      }
    },
    closeSearchKeyword () {
      this.REMOVE_SEARCH_LOG_ALL()
      document.getElementById('search').focus()
      setTimeout(() => {
        this.searchFoucs = false
        this.showFavoriteKeywords = false
        this.showResultKeywords = false
      }, 2)
    },
    searchItem (word) {
      this.searchWord = word
      gaEventSearch(this.searchWord)
      this.$router.push({ path: `/goods/search?sortBy=MD_RECOMMEND:ASC&keyword=${encodeURIComponent(this.searchWord)}` })
    },
    showSearchResult () {
      this.searchResultWords = []
      if (this.searchWord === '') {
        this.showFavoriteKeywords = true
        this.showResultKeywords = false
      } else {
        this.showFavoriteKeywords = false
        this.showResultKeywords = true
        for (var i = 0; i < this.inputFavoriteKeywords.length; i++) {
          var index = this.inputFavoriteKeywords[i].indexOf(this.searchWord)
          if (index !== -1) {
            var tempWord = this.inputFavoriteKeywords[i]
            var arr = []
            arr[0] = tempWord.substring(0, index)
            arr[1] = tempWord.substring(index, index + this.searchWord.length)
            arr[2] = tempWord.substring(index + this.searchWord.length, tempWord.length)
            this.searchResultWords.push(arr)
            if (this.searchResultWords.length > 10) {
              break
            }
          }
        }
      }
    },
    brandLabelPath (brandLabel) {
      return brandLabel.replace('&', '＆')
    },
    clickSearchResultWords (index) {
      this.searchWord = this.searchResultWords[index].join('')
      gaEventSearch(this.searchWord)
      this.$router.push({ path: `/goods/search?sortBy=MD_RECOMMEND:ASC&keyword=${encodeURIComponent(this.searchWord)}` })
    },
    search () {
      let theSearch = this.searchWord.replace(' ', '')
      if (theSearch === undefined || theSearch === '') {
        // $('html').css('overflow', 'hidden')
        Alert({
          title: this.$t('assets.notice'),
          message: this.$t('header.enterSearch')
        })
        return false
      }
      gaEventSearch(this.searchWord)
      let orderby = this.fetchListParams['order.by'] ? `${this.fetchListParams['order.by']}:${this.fetchListParams['order.direction']}` : 'MD_RECOMMEND:ASC'
      this.$router.push({ path: `/goods/search?sortBy=${orderby}&keyword=${encodeURIComponent(this.searchWord)}` })
    },
    outside () {
      this.searchFoucs = false
      this.showFavoriteKeywords = false
      this.showResultKeywords = false
    },
    format (children) {
      let res = []
      if (children) {
        for (let i = 0; i < children.length; i++) {
          if (i < 5) {
            res[i] = []
            if (children[i]) res[i].push(children[i])
          } else {
            for (let j = 0; j < 5; j++) {
              if ((res[j].length === 1 && res[j][0].children && res[j][0].children.length <= 6) ||
                (res[j].length === 1 && res[j][0].children === null)) {
                res[j].push(children[i])
                break
              }
            }
          }
        }
      }
      return res
    },
    searchDel () {
      let searchValue = $('#search').val()
      if (searchValue === '') {
        this.searchIng = false
      } else {
        this.searchWord = ''
        this.searchIng = false
      }
    }
  }
}
</script>
<style scoped>
.hidden-input {
  position: absolute;
  z-index: -999;
}
</style>