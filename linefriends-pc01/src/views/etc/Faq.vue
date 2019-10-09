<template>
  <div id="container" class="cs">
    <div class="wrap">
      <div class="cs-content">
        <h1>サポート</h1>
        <customer-service-tab activeType="faq">
          <ul class="sub_menu">
            <li :class="{'active': categoryNo === 0}" @click.prevent="clickTab(0,'すべて')">
              <a href>すべて</a>
            </li>
            <li :class="{'active': categoryNo === category.categoryNo}" v-for="(category,index) in faqCategorys" :key="index" @click.prevent="clickTab(category.categoryNo,category.label)">
              <a href>{{category.label}}</a>
            </li>
          </ul>
          <div class="sub_search">
            <p class="input_area">
              <input type="text" class="size_m" placeholder="キーワードを入力してください。" v-model="keyword" @keypress.enter="searchClick" />
              <button class="btn_close" @click.prevent="clearKeyword"></button>
            </p>
            <p class="btn_area">
              <button class="btn btn_green" @click="searchClick">検索</button>
            </p>
          </div>
        </customer-service-tab>
        <div class="table_wrap" v-if="faqList && faqList.length > 0">
          <p class="search_result" v-if="keywordQuery && totalCount">
            <span class="green">{{keywordQuery}}</span>に対し、総
            <span class="green">{{totalCount}}</span>件のFAQが検索されました。
          </p>
          <table class="table_list cursor_pointer">
            <thead>
              <tr>
                <th>カテゴリー</th>
                <td>タイトル</td>
              </tr>
            </thead>
            <tbody :class="{'open':index === currentIndex}" v-for="(faq,index) in faqList" :key="index" @click="onClick(index,faq.articleNo)">
              <tr>
                <th>{{faq.categoryLabel}}</th>
                <td>
                  <p class="ellipsis">{{faq.title}}</p>
                  <button class="btn_drawer"></button>
                </td>
              </tr>
              <tr class="open_item" v-if="index === currentIndex">
                <th></th>
                <td>
                  <div>
                    <p v-html="_xssFilter(content)"></p>
                    <p v-if="imageUrl"><img :src="imageUrl" alt=""></p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table_wrap" v-else>
          <div class="result_none">
            <img src="@/assets/img/order/img_none.png" alt="">
            <p class="txt">検索結果が見つかりません。</p>
          </div>
        </div>
        <div class="pad">
          <pagination v-model="pageNo" :total="totalCount || 1" :limit="20" @change="pageChange(pageNo)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/common/Pagination'
import { Alert } from '@/components/common/modal'
import CustomerServiceTab from '@/components/etc/CustomerServiceTab'
import { mapState } from 'vuex'
import { xssFilter } from '@/utils/utils'
export default {
  data () {
    return {
      categoryNo: this.faqCategorys ? this.faqCategorys[0].categoryNo : 0,
      keyword: '',
      content: '',
      currentIndex: '-1',
      faqName: 'すべて',
      pageNo: 1,
      imageUrl: '',
      redirect: `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
    }
  },
  computed: {
    ...mapState('board', ['faqCategorys', 'faqList', 'totalCount']),
    keywordQuery () {
      return (
        (this.$route && this.$route.query && this.$route.query.keyword) || ''
      )
    }
  },
  components: {
    Pagination,
    CustomerServiceTab
  },
  created () {
    this.keyword = this.keywordQuery
    this.search()
  },
  methods: {
    _xssFilter (str) {
      return xssFilter(str)
    },
    clearKeyword () {
      this.keyword = ''
    },
    clickTab (no, faq) {
      this.pageNo = 1
      this.categoryNo = no
      this.keyword = ''
      this.faqName = faq
      this.$router.push({ path: `/etc/faq` })
      this.search()
    },
    search () {
      const boardParams = {
        keyword: this.keywordQuery,
        categoryNo: this.categoryNo || ''
      }
      this.$store.dispatch('board/featchFaq', boardParams)
    },
    searchClick () {
      if (!this.keyword) {
        Alert({ message: 'キーワードを入力してください。', title: 'FAQ' })
      } else {
        this.$router.push({
          path: `/etc/faq/search`,
          query: {
            keyword: this.keyword
          }
        })
        this.search()
      }
    },
    async onClick (index, articleNo) {
      this.content = ''
      this.isOpen = !this.isOpen
      this.currentIndex = this.currentIndex === index ? -1 : index
      const res = await this.$store.dispatch('board/faqDetail', articleNo)
      this.content = res.data && res.data.content
      this.imageUrl = res.data && res.data.imageUrl
      if (this.search) {
        // let keyword = this.search
        let div = document.createElement('div')
        div.innerHTML = this.content
        const childNodes = div.getElementsByTagName('*')
        const length = childNodes.length
        let result = ''
        for (var i = 0; i < length; i++) {
          let content = childNodes[i].innerText
          // const filterResult = fliter.warpTag(content, keyword, 'span')
          result += `<${childNodes[i].tagName}>${content}</${childNodes[i].tagName}>`
        }
        this.content = result
      }
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
