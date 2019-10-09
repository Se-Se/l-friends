import { mapState } from 'vuex'
import { Alert } from '@/utils/event-bus'
import $ from 'jquery'
export default {
  data () {
    return {
      categoryNo: 0,
      keyword: '',
      currentIndex: '-1',
      pageNo: 1
    }
  },
  computed: {
    ...mapState('board', ['faqCategorys', 'faqList', 'totalCount']),
    keywordQuery () {
      return (this.$route && this.$route.query && this.$route.query.keyword) || ''
    },
    faqListRes () {
      return this.faqList || []
    },
    categories () {
      if (!this.faqCategorys) {
        return {}
      }

      let categories = {}
      for (const cate of this.faqCategorys) {
        categories[cate.label] = cate.categoryNo
      }

      return categories
    }
  },
  watch: {
    '$route': 'changeRouter',
    categoryNo () {
      this.search()
    }
  },
  created () {
    this.init()
  },
  methods: {
    clickTab (categoryNo) {
      this.pageNo = 1
      this.categoryNo = categoryNo
      this.$router.push({
        path: `/etc/faq`
      })
    },
    searchClick () {
      // $('html').css('overflow', 'hidden')
      if (!this.keyword) {
        Alert({
          title: 'FAQ',
          message: '검색어를 입력하세요.'
        })
        this.$router.push({
          path: `/etc/faq`
        })
      } else {
        this.$router.push({
          path: `/etc/faq/search`,
          query: {
            keyword: this.keyword
          }
        })
      }
    },
    search () {
      const boardParams = {
        keyword: this.keywordQuery,
        categoryNo: this.categoryNo || ''
      }
      this.currentIndex = '-1'
      this.$store.dispatch('board/featchFaq', boardParams)
    },
    changeRouter () {
      this.init()
    },
    pageChange (page) {
      this.currentIndex = '-1'
      this.pageNo = page
      this.$store.dispatch('board/featchFaqMore', page)
      window.scrollTo(0, 0)
    },
    init () {
      this.keyword = this.keywordQuery
      this.search()
    },
    openIndex (index) {
      this.currentIndex = index
    }
  }
}
