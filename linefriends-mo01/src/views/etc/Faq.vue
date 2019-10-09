<template>
  <div id="container" class="cs-faq cs-faq-font_family">
    <sub-header title="サポート" />
    <div class="cs-faq-wrap">
      <div class="cs_menu_wrap cs-faq-border_bottom cs-faq-mew_height">
        <ul class="cs_nav_menu">
          <li class="cs_active cs-faq_padding-bottom">
            <router-link to="/m/etc/faq" class="cs-fag-new_font">FAQ</router-link>
          </li>
          <li class="pl-2_4">
            <router-link to="/m/etc/inquiry">1：1お問い合わせ</router-link>
          </li>
          <li class="pl-2_4">
            <router-link to="/m/etc/notice">お知らせ</router-link>
          </li>
        </ul>
      </div>
      <div class="cs-faq-tab-search-block cs-faq-tab-slide-margin_bottom">
        <div class="cs-faq-tab-slide cs-faq-tab-slide-margin_bottom">
          <ul class="cs-faq-tab-list">
            <li :class="{'cs-faq-tab-item':true, 'cs-faq-tab_active': categoryIndex === 0}" @click.prevent="clickTab(0,'すべて')">
              すべて
            </li>
            <li :class="{'cs-faq-tab-item':true, 'cs-faq-tab_active': categoryIndex === category.categoryNo}" @click.prevent="clickTab(category.categoryNo, category.label)" v-for="(category,index) in faqCategorys" :key="index">
              {{ category.label }}
            </li>
          </ul>
        </div>
        <div class="cs-faq-search-block">
          <input type="text" class="cs-faq-width_22_1 cs-faq-m-r_0_7" placeholder="キーワードを入力してくだ…" v-model="keyword">
          <button class="btn cs-faq-width_10_7_52" @click="searchClick">検索</button>
        </div>
        <p class="search_result" v-if="keywordQuery && totalCount">
          <span class="green">{{keywordQuery}}</span>に対し、総
          <span class="green">{{totalCount}}</span>件のFAQが検索されました。
        </p>
      </div>
      <div class="cs-faq-search-none-result cs-faq-border_bottom cs-faq-padding_top " v-if="!(faqList && faqList.length > 0)">
        <img src="@/assets/img/common/img-no@2x.png" alt="">
        <p class="cs-faq-search-none-txt cs-faq-search-none-txt_new">検索結果が見つかりません。</p>
      </div>
      <div class="cs-faq-detail" v-else>
        <div :class="{'notice_box': true, 'active':index === currentIndex}" v-for="(faq, index) in faqList" :key="index" @click.prevent="onClick(index,faq.articleNo)">
          <div class="notice_info">
            <ul class="notice_list">
              <li class="notice_type  cs-box-padding-top_2_8">{{ faq.categoryLabel }}</li>
              <li class="notice_detail_title cs-faq-txt-style">{{ faq.title }}</li>
            </ul>
            <div class="category_right">
              <a href="javascript:" class="btn_next cs-faq-ic-open">detail</a>
            </div>
          </div>
          <div class="cs-faq-open-content">
            <div class="cs-faq-avator-name">
              <img src="@/assets/img/character/ic_brown.png" alt="" class="cs-faq-avator">
              <span class="cs-faq-name cs-faq-font_weight_500">LINE FRIENDSからのご回答</span>
            </div>
            <p class="cs-faq-content-detail" v-html="content"></p>
            <div class="cs-faq-content-image">
              <img :src="imageUrl" alt="">
            </div>
          </div>
        </div>
      </div>
      <mugen-scroll :handler="pageDown" :should-handle="showMugen && !pending.faqList" :offsetTop="-3000">
        <div id="loader" v-show="showMugen">
          <div class="loader_img"></div>
        </div>
      </mugen-scroll>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import fliter from '@/filters'
import { Alert } from '@/components/common/modal'
import SubHeader from '@/components/header/SubHeader'
import MugenScroll from '@/components/common/MugenScroll'
export default {
  data () {
    return {
      categoryIndex: 0,
      categoryNo: this.faqCategorys ? this.faqCategorys[0].categoryNo : 0,
      keyword: '',
      currentIndex: '-1',
      pageNo: 1,
      content: '',
      imageUrl: '',
      redirect: `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
    }
  },
  components: {
    SubHeader,
    MugenScroll
  },
  computed: {
    ...mapState('board', ['faqCategorys', 'faqList', 'totalCount', 'pending']),
    keywordQuery () {
      return (this.$route && this.$route.query && this.$route.query.keyword) || ''
    },
    showMugen () {
      return this.faqList && this.faqList.length < this.totalCount
    }
  },
  created () {
    this.keyword = this.keywordQuery
    this.search()
  },
  methods: {
    clickTab (categoryNo, label) {
      this.keyword = ''
      this.categoryIndex = categoryNo
      this.categoryNo = categoryNo
      this.$router.push({ path: `/m/etc/faq` })
      this.search()
    },
    search () {
      this.pageNo = 1
      const boardParams = {
        keyword: this.keywordQuery,
        categoryNo: this.categoryNo || ''
      }
      this.$store.dispatch('board/featchFaq', boardParams)
    },
    pageDown () {
      this.$store.dispatch('board/featchFaqMore')
    },
    async onClick (index, articleNo) {
      this.content = ''
      this.currentIndex = this.currentIndex === index ? -1 : index

      const res = await this.$store.dispatch('board/faqDetail', articleNo)

      this.content = res.data && res.data.content
      this.imageUrl = res.data && res.data.imageUrl
      // if (this.search) {
      //   let keyword = this.search
      //   let div = document.createElement('div')
      //   div.innerHTML = this.content
      //   const childNodes = div.getElementsByTagName('*')
      //   const length = childNodes.length
      //   let result = ''
      //   for (var i = 0; i < length; i++) {
      //     let content = childNodes[i].innerText
      //     const filterResult = fliter.warpTag(content, keyword, 'span')
      //     result += `<${childNodes[i].tagName}>${filterResult}</${childNodes[i].tagName}>`
      //   }
      //   this.content = result
      // }
    },
    searchClick () {
      if (!this.keyword) {
        Alert({ message: 'キーワードを入力してください。', title: 'FAQ' })
      } else {
        this.$router.push({
          path: `/m/etc/faq/search`,
          query: {
            keyword: this.keyword
          }
        })
        this.search()
      }
    },
    goInquery () {
      this.$router.push({ path: `/m/mypage/inquiry` })
    },
    pageChange (page) {
      this.currentIndex = '-1'
      this.pageNo = page
      this.$store.dispatch('board/featchFaqMore', page)
      window.scrollTo(0, 0)
    }
  },
  watch: {
    faqList () {
      this.currentIndex = -1
    }
  }
}
</script>
