<template>
  <div class="wrap_category result-search-border_bottom">
    <div class="category_left">
      <a href="#" class="btn_back" @click.prevent="goBack">Back</a>
    </div>
    <div class="category_search input_text">
      <input type="text" id="search"
        @keyup.enter="enterKeyword()"
        @input="checkInput()"
        placeholder="検索ワードを入力してください。" :value="defaultKeyword"
      >
    </div>
    <div class="category_right">
      <a href="#" v-show="inputYn || defaultKeyword"  @click="removeSearchQuery"
        class="btn_close search">Close</a>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { Alert } from '@/components/common/modal'
import $ from 'jquery'

export default {
  name: 'Search',
  data () {
    return {
      inputYn: false
    }
  },
  props: [],
  computed: {
    ...mapState('search', ['defaultKeyword'])
  },
  methods: {
    ...mapActions('search', ['setDefaultKeyword', 'fetchLocalKeyword']),
    goBack () {
      this.$router.go(-1)
    },
    checkInput () {
      // console.log('checkInput >> ' + $('#search').val())
      let keyword = $('#search').val()
      if (keyword) {
        this.inputYn = true
      } else {
        this.inputYn = false
      }
      this.setDefaultKeyword(keyword)
    },
    removeSearchQuery () {
      $('#search').val('')
      $('#search').focus()
      this.setDefaultKeyword('')
      this.inputYn = false
    },
    searchKeyword (keyword) {
      if (keyword) {
        // console.log(keyword)
        this.fetchLocalKeyword(keyword)
        this.$router.replace({
          path: `/m/search/keyword`,
          query: {
            keyword: keyword
          }
        })
      } else {
        Alert('キーワードを入力してください。')
      }
    },
    enterKeyword () {
      let keyword = $('#search').val()
      // console.log(keyword)
      $('#search').blur()
      this.searchKeyword(keyword)
    }
  }
}
</script>
