<template>
  <div class="wrap_category">
    <ul class="wrap_category_list">
      <li>
        <router-link to="/">ホーム</router-link>
      </li>
      <template v-if="breadCrumbs">
        <li>{{ breadCrumbs }}</li>
      </template>
      <template v-else v-for="( nav, key) in navs">
        <li :key="key" v-if="key !== navs.length-1">
          <router-link :to="nav.link">{{nav.desc}}</router-link>
        </li>
        <li :key="key" v-else>{{ nav.desc }}</li>
      </template>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'BreadCrumbs',
  props: ['breadCrumbs', 'goodsName'],
  computed: {
    navs () {
      let nav = []
      if (this.$route.path === '/goods' && !this.$route.query.sale && !this.$route.query.brandName) {
        nav.push({ link: this.$route.fullPath, desc: 'すべて' })
      }

      if (this.$route.params.categoryNo) {
        if (this.$route.params.subCategoryNo) {
          nav.push({ link: `/goods/${this.$route.params.categoryNo}?depth1Desc=${this.$route.query.depth1Desc}`, desc: this.$route.query.depth1Desc })
          nav.push({ link: this.$route.fullPath, desc: this.$route.query.depth2Desc })
        } else {
          nav.push({ link: this.$route.fullPath, desc: this.$route.query.depth1Desc })
        }
      }

      if (this.$route.query.brandName) {
        nav.push({ link: this.$route.fullPath, desc: this.$route.query.brandName })
      }

      if (this.$router.app._route.name === 'KeywordSearch') {
        nav.push({ link: this.$route.fullPath, desc: this.$route.query.keyword })
      }

      if (this.$route.query.sale) {
        nav.push({ link: this.$route.fullPath, desc: 'SALE' })
      }

      if (this.$route.fullPath === '/event') {
        nav.push({ link: this.$route.fullPath, desc: 'プロモーション' })
      }

      if (this.$route.params.goodsNo) {
        let active = this.$route.query.active
        let prevActive = this.$route.query.prevActive
        if (active) {
          if (active.indexOf('/goods') === 0 && active.indexOf('/goods/') === -1) {
            let activeParams = active.split('?')[1]
            let saleFlg = false
            let brandName = ''
            if (activeParams) {
              activeParams = activeParams.split('&')
              // SALE
              activeParams.forEach(item => {
                if (item.indexOf('sale=true') === 0) {
                  saleFlg = true
                }
              })
              if (saleFlg) {
                nav.push({ link: active, desc: 'SALE' })
              }

              // brand
              activeParams.forEach(item => {
                if (item.indexOf('brandName=') === 0) {
                  brandName = item.split('=')[1]
                }
              })
              if (brandName) {
                nav.push({ link: active, desc: decodeURIComponent(brandName) })
              }
            }

            // すべて
            if (!activeParams || (!saleFlg && !brandName)) {
              nav.push({ link: active, desc: 'すべて' })
            }
          }
          if (~active.indexOf('/search?')) {
            let activeParams = active.split('?')[1].split('&')
            let keyword = ''
            activeParams.forEach(item => {
              if (item.indexOf('keyword=') === 0) {
                keyword = item.split('=')[1]
              }
            })
            nav.push({ link: active, desc: decodeURIComponent(keyword) })
          }
          if (~active.indexOf('/event/')) {
            nav.push({ link: active, desc: 'プロモーション' })
          }
          let categorylength = active.split('/').length
          if (categorylength === 3 && !~active.indexOf('/event/')) {
            nav.push({ link: active, desc: active.split('depth1Desc=')[1] })
          }
          if (categorylength === 4) {
            nav.push({ link: prevActive, desc: prevActive.split('depth1Desc=')[1] })
            nav.push({ link: active, desc: active.split('depth2Desc=')[1] })
          }
        }
        nav.push({ link: this.$route.fullPath, desc: this.goodsName })
      }
      return nav
    }
  }
}
</script>
