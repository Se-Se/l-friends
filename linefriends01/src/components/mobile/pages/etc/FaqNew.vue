<template>
  <div>
    <sub-page-header title="FAQ"/>
    <ul class="service-upper">
      <li class="service-upper__item">
        <router-link to="/etc/faq">FAQ</router-link>
      </li>
      <li class="service-upper__item">
        <router-link to="/notice/list">공지사항</router-link>
      </li>
    </ul>
    <service-tab-container
      :bus="tabBus"
      :tabs="{ '전체': 0, ...categories }"
      class="goods-info__nav"
    />
    <div id="container">
      <div class="service-faq__header">
        <div class="service-faq__search">
          <div class="service-faq__search-box">
            <app-input
              v-model="keyword"
              type="text"
              size="small"
              placeholder="검색어를 입력하세요"
              @keypress.enter="searchClick"
            />
          </div>
          <div class="service-faq__search-btn">
            <app-button
              type="secondary"
              size="middle-small"
              middle
              @click="searchClick"
            >
              검색
            </app-button>
          </div>
        </div>
        <div class="service-faq__inquiry">
          <router-link to="/mypage/inquiry">
          <app-button
              faq
            > 
              1:1 문의하기
            </app-button>
          </router-link>
        </div>
        <p
          v-if="keywordQuery && totalCount"
          class="service-faq__result"
        >
          <em>{{ keywordQuery }}</em>에 대해 총 <em>{{ totalCount }}</em>건의 FAQ가 검색 되었습니다.
        </p>
      </div>
      <div class="service-faq__list">
        <faq-container :faqs="faqListRes" />
      </div>
      <div class="service-faq__pagination">
        <pagination
          v-model="pageNo"
          :total="totalCount || 1"
          :limit="5"
          @change="pageChange(pageNo)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import SubPageHeader from '../../layout/header/SubPageHeader'
import ServiceTabContainer from '@/components/mobile/common/tab/ServiceTabContainer'
import AppInput from '@/components/mobile/common/input/Input'
import AppButton from '@/components/mobile/common/button/Button'
import FaqContainer from '../../service/FaqContainer'
import Pagination from '@/components/mobile/common/list/Pagination'

import FaqNew from '@/components/mixins/etc/FaqNew'

export default {
  name: 'Faq',
  components: {
    SubPageHeader,
    ServiceTabContainer,
    AppInput,
    AppButton,
    FaqContainer,
    Pagination
  },
  mixins: [FaqNew],
  data () {
    return {
      tabBus: new Vue()
    }
  },
  mounted () {
    this.tabBus.$on('tab-change', i => {
      this.clickTab(i)
    })
  }
}
</script>
