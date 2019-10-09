<template>
  <div class="search_inner">
    <div class="sch on" v-click-outside="closefns">
      <input type='password' style="position: absolute;z-index: -999;">
      <input type="text" tabindex="1" autocomplete="off" accesskey="s" aria-autocomplete="both" id="search" @click.prevent="focusfns" @keyup.enter="enterKeyword()" @keyup="valueReset()" :placeholder="defaultKeyword || 'BT21'" :value="defaultKeyword">
      <button class="btn_search" @click.prevent="enterKeyword()">Search</button>
      <button class="btn_del" v-if="searchYn" @click.prevent="setNoneKeyword()">☓</button>

      <!--  search 状態です。  -->
      <div v-if="favoriteKeywords" class="search_box_on" :style="searchYn ? 'display: block;' : 'display: none;'">
        <template v-if="!isLoginYn">
          <dl class="search-con">
            <dt><a href="#">おすすめ検索</a></dt>
            <dd v-for="(word, key) in favoriteKeywords" :key="key">
              <a href="#" @click.prevent="searchKeyword(word)">{{word}}</a>
            </dd>
          </dl>
        </template>
        <template v-else>
          <ul class="search-tab">
            <li v-if="isLoginYn" :class="{ 'active' : searchTab===1 }"><a href="#" @click.prevent="chgTab(1)">検索履歴</a></li>
            <li :class="{ 'active' : searchTab===2 }"><a href="#" @click.prevent="chgTab(2)">おすすめ検索</a></li>
          </ul>
          <ul class="search-list" v-if="searchTab===1 && localKeywordArr">
            <li v-for="(word, index) in localKeywordArr" :key="index">
              <a href="#" @click.prevent="searchKeyword(word)">{{word}}</a>
              <button @click.prevent="delKeyword(index)">☓</button>
            </li>
          </ul>
          <ul class="search-recommed" v-if="searchTab===2">
            <li v-for="(word, key) in favoriteKeywords" :key="key">
              <a href="#" @click.prevent="searchKeyword(word)">{{word}}</a>
            </li>
          </ul>
          <div class="search-list_btn" v-if="searchTab===1 && localKeywordArr">
            <a href="#" @click.prevent="delKeyword(-1)">すべて削除</a>
          </div>
          <p class="search-data_none" v-if="searchTab===1 && !localKeywordArr">検索履歴がありません。</p>
        </template>
      </div>
    </div>

    <!--  onのclassはデータがある状態です。  -->
    <p class="heart">
      <router-link to="/mypage/like">heart</router-link>
      <span class="data">{{likeProducts && likeProducts.totalCount ? getDisplayCount(likeProducts.totalCount) : 0}}</span>
    </p>
    <p class="cart">
      <router-link to="/cart">
        cart
        <span class="data">{{count ? getDisplayCount(count) : 0}}</span>
      </router-link>
    </p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import $ from 'jquery'
import ClickOutside from 'vue-click-outside'
import { isLogin } from '@/utils/utils'
import { Alert } from '@/components/common/modal'

export default {
  name: 'Search',
  directives: {
    ClickOutside
  },
  data () {
    return {
      searchYn: false,
      isLoginYn: false,
      searchTab: 1,
      localKeywordArr: null
    }
  },
  props: [],
  computed: {
    ...mapState('product', ['favoriteKeywords']),
    ...mapState('cart', ['count']),
    ...mapState('search', ['defaultKeyword']),
    ...mapState('likeProducts', ['likeProducts'])
  },
  methods: {
    ...mapActions('search', ['setDefaultKeyword']),
    getLoginStatus () {
      this.isLoginYn = isLogin()
      // console.log(`loginYn = ${this.isLoginYn}`)
    },
    setNoneKeyword () {
      this.setDefaultKeyword('')
      this.closefns()
    },
    searchKeyword (keyword) {
      // console.log(keyword)
      if (keyword) {
        this.favoriteKeyword = keyword
        this.togglefns()

        this.$router.push({
          path: `/search`,
          query: {
            keyword: this.favoriteKeyword
          }
        })
      } else {
        Alert('キーワードを入力してください。')
      }
    },
    enterKeyword () {
      let keyword = this.$route.query.keyword
      if (keyword === this.defaultKeyword && (this.$router.app._route.name !== 'Home')) return
      $('#search').blur()
      this.searchKeyword(this.defaultKeyword)
      this.searchYn = false
    },
    valueReset () {
      this.setDefaultKeyword($('#search').val())
    },
    focusfns () {
      this.togglefns()
      this.chgTab(1)
      this.getLoginStatus()
    },
    togglefns () {
      this.searchYn = !this.searchYn
    },
    closefns () {
      this.searchYn = false
    },
    chgTab (index) {
      this.searchTab = index
      if (index === 1) {
        this.localKeywordArr = this.getLocalKeywordArr()
      }
    },
    getLocalKeywordArr () {
      let arr = JSON.parse(window.localStorage.RecentSearchWord || '[]')
      if (arr && arr.length > 0) {
        return arr
      } else {
        return null
      }
    },
    delKeyword (index) {
      if (index === -1) {
        delete window.localStorage.RecentSearchWord
      } else {
        let arr = JSON.parse(window.localStorage.RecentSearchWord || '[]')
        arr.splice(index, 1)
        window.localStorage.RecentSearchWord = JSON.stringify(arr)
      }
      this.localKeywordArr = this.getLocalKeywordArr()
    },
    getDisplayCount (count) {
      return count > 99 ? '99+' : count
    }
  }
}
</script>

<style>
</style>
