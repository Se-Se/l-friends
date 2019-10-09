<template>
  <main-wrapper>
    <div id="container" class="etc">
      <div class="etc_inner">
        <h1>고객센터</h1>
        <div class="mypage-menu">
          <ul class="mypage-menu__wrap">
            <li class="mypage-menu__item active">
              <router-link to="/etc/faq">
                <button
                  type="button"
                  class="etc-btn"
                >FAQ</button>
              </router-link>
            </li>
            <li class="mypage-menu__item">
              <router-link to="/notice/list">
                <button
                  type="button"
                  class="etc-btn"
                >공지사항</button>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="menu_wrap">
          <ul class="nav_menu">
            <li :class="{ 'active': categoryNo === 0 }">
              <a href="#" @click.prevent="clickTab(0)">전체</a>
            </li>
            <li :class="{ 'active': category.categoryNo === categoryNo }" v-for="(category,index) in faqCategorys" :key="index">
              <a href="#" @click.prevent="clickTab(category.categoryNo)">{{ category.label }}</a>
            </li>
          </ul>
          <div class="btn_iar">
            <router-link to="/mypage/inquiry">
              <button class="white-button review">1:1문의 등록</button>
            </router-link>
          </div>
        </div>
        <div class="old-css">
          <div class="filter_con">
            <div class="search">
              <div class="search-con">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  v-model="keyword"
                  @keypress="delView()"
                  @keypress.enter="searchClick">
                  <button
                    v-if="del"
                    class="search-del"
                    @click="searchDel()"
                  >
                    삭제
                  </button>
                </div>
                <span class="btn_search">
                  <button
                    type="submit"
                    class="btn btn_gray"
                    @click.prevent.enter="searchClick">검색</button>
                </span>
            </div>
          </div>
        </div>
        <div class="search_result" v-if="keywordQuery && totalCount">
          <strong class="keywords">{{ keywordQuery }}</strong> 에 대해 총
          <strong class="data_bar">{{ totalCount }}</strong>건의 FAQ가 검색 되었습니다.
        </div>
        <div class="table_wrap">
          <table class="table_data bor-1 link">
            <colgroup>
              <col style="width:146px">
              <col style="width:977px">
            </colgroup>
            <thead>
              <tr>
                <th>구분</th>
                <th>제목</th>
                <th></th>
              </tr>
            </thead>
            <template v-if="faqListRes && faqListRes.length > 0">
              <faq-item v-for="(faqItem, index) in faqListRes" :key="faqItem.articleNo" :faq-item="faqItem" :index="index" :search="keywordQuery" :categoryNo="categoryNo" @openIndex="openIndex" :currentIndex="currentIndex" :pageNo="pageNo"></faq-item>
            </template>
            <tbody v-else>
              <tr>
                <td colspan="3">
                  <div class="none">
                    검색결과가 없습니다.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination class="mt-3" :page="pageNo" :total="totalCount || 1" :limit="20" @change="pageChange" ref="pagination" />
      </div>
    </div>
  </main-wrapper>
</template>
<script>
import FaqItem from './FaqItemNew'
import Pagination from '@/components/pc/assets/Pagination'
import MainWrapper from '../../layout/common/MainWrapper'

import FaqNew from '@/components/mixins/etc/FaqNew'

export default {
  mixins: [FaqNew],
  components: {
    FaqItem,
    Pagination,
    MainWrapper
  },
  data () {
    return {
      del: false
    }
  },
  methods: {
    searchDel () {
      this.keyword = ''
      this.del = false
    },
    delView () {
      this.del = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn_font {
    font-size: 14px !important;
  }
</style>

