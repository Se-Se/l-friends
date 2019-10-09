<template>
  <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
  <div id="container" class="search">
    <!-- ↓↓↓↓↓ SeachForm ↓↓↓↓↓ -->
    <seach-form />
    <!-- ↑↑↑↑↑ SeachForm ↑↑↑↑↑ -->

    <!-- ↓↓↓↓↓ search-wrap ↓↓↓↓↓ -->
    <div class="search-wrap">
      <dl class="search-record cf" v-if="favoriteKeywords">
        <dt>おすすめの検索ワード</dt>
        <dd v-for="(word, key) in favoriteKeywords" :key="key">
          <button class="btn size_s btn_radius" @click.prevent="searchKeyword(word)">{{word}}</button>
        </dd>
      </dl>
      <template v-if="isLoginYn">
        <dl class="search-con_title cf" v-if="moLocalKeywordArr">
          <dt>検索履歴</dt>
          <dd @click.prevent="delKeyword(-1)">すべて削除</dd>
        </dl>

        <ul class="search-record_list" v-if="moLocalKeywordArr">
          <li v-for="(word, index) in moLocalKeywordArr" :key="index">
            <a href="#" @click.prevent="searchKeyword(word)">{{word}}</a>
            <button @click.prevent="delKeyword(index)">☓</button>
          </li>
        </ul>
        <dl class="search-record cf none" v-else>
          <dt class="mt-60 mb-40">検索履歴</dt>
          <dd>検索履歴がありません。</dd>
        </dl>
      </template>
    </div>
    <!-- ↑↑↑↑↑ search-wrap ↑↑↑↑↑ -->
  </div>
  <!-- ↑↑↑↑↑ container ↑↑↑↑↑ -->
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SeachForm from '@/components/search/SeachForm'
import { Alert } from '@/components/common/modal'
import { isLogin } from '@/utils/utils'

export default {
  name: 'Search',
  data () {
    return {
      isLoginYn: false
    }
  },
  props: [],
  components: {
    SeachForm
  },
  computed: {
    ...mapState('product', ['favoriteKeywords']),
    ...mapState('search', ['moLocalKeywordArr']),
    ...mapState('likeProducts', ['totalCount'])
  },
  mounted () {
    this.getLoginStatus()
  },
  methods: {
    ...mapActions('search', ['fetchLocalKeyword']),
    getLoginStatus () {
      this.isLoginYn = isLogin()
    },
    searchKeyword (keyword) {
      if (keyword) {
        this.favoriteKeyword = keyword

        this.$router.push({
          path: `/m/search/keyword`,
          query: {
            keyword: keyword
          }
        })
      } else {
        Alert('キーワードを入力してください。')
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
      this.fetchLocalKeyword()
    }
  }
}
</script>
