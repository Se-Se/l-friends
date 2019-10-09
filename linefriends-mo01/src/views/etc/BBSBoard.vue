<template>
  <div id="container" class="cs_notice">
    <sub-header title="サポート" />
    <div class="cs_menu_wrap">
      <ul class="cs_nav_menu">
        <li>
          <router-link to="/m/etc/faq" class="cs-fag-new_font">FAQ</router-link>
        </li>
        <li class="pl-2_4">
          <router-link to="/m/etc/inquiry">1：1お問い合わせ</router-link>
        </li>
        <li class="cs_active pl-2_4">
          <router-link to="/m/etc/notice">お知らせ</router-link>
        </li>
      </ul>
    </div>
    <div class="notice_info_wrap" v-for="(notice,index) in bbsList" :key="index">
      <div class="notice_box" @click.prevent="goNoticeDetail(notice.articleNo)">
        <div class="notice_info">
          <ul>
            <li class="notice_type">{{ notice.categoryLabel }}</li>
            <li class="notice_detail_title">{{ notice.title }}</li>
            <li class="notice_date_wrap">
              <span>LINE FRIENDS</span>
              <span class="notice_date">{{notice.registerYmdt}}</span>
            </li>
          </ul>
          <div class="category_right">
            <router-link :to="`/m/notice/detail/${notice.articleNo}`" class="btn_next">Next</router-link>
          </div>
        </div>
      </div>
    </div>
    <mugen-scroll :handler="pageDown" :should-handle="showMugen && !pending.bbsList" :offsetTop="-3000">
      <div id="loader" v-show="showMugen">
        <div class="loader_img"></div>
      </div>
    </mugen-scroll>
  </div>
</template>
<script>
import SubHeader from '@/components/header/SubHeader'
import MugenScroll from '@/components/common/MugenScroll'
import { mapState } from 'vuex'
export default {
  name: 'Inquery',
  components: {
    MugenScroll,
    SubHeader
  },
  data () {
    return {
      page: 1,
      redirect: `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
    }
  },
  computed: {
    ...mapState('board', ['bbsCount', 'bbsList', 'bbsPageSize', 'pending']),
    showMugen () {
      return this.bbsList && this.bbsList.length < this.bbsCount
    }
  },
  methods: {
    goNoticeDetail (articleNo) {
      this.$router.push({
        path: `/m/notice/detail/${articleNo}`
      })
    },
    pageDown () {
      this.$store.dispatch('board/featchBBSMore')
    }
  }
}
</script>
