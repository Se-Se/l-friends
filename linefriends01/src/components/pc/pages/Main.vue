<template>
  <div>
    <div class="main-slide__wrapper">
      <main-slide :slides="slideBanners" />
    </div>
    <main-wrapper :main="true">
      <layout-width>
        <app-banner v-if="topBanners" :banner="topBanners" />
      </layout-width>
      <layout-width v-show="$refs.newBrownSection && $refs.newBrownSection.goodsItem.length > 0">
        <main-article
          :title="$t('article.new.title')"
          :lang="false"
          :bottom="true"
          :more="sectionInfos ? (sectionInfos[currentNew] || {}).sectionExplain : null"
        >
          <tab-container :bus="eventBus" :tabs="characters">
            <tab-content :bus="eventBus" tab-id="tab-1" :tabShow="true">
              <goods-list ref="newBrownSection" :section-no="config.newBrownSectionNo" :limit="6" />
            </tab-content>
            <tab-content :bus="eventBus" tab-id="tab-2" :tabShow="true">
              <goods-list :section-no="config.newBT21SectionNo" :limit="6" />
            </tab-content>
          </tab-container>
        </main-article>
      </layout-width>
    </main-wrapper>
    <goods-three-column :banners="hotBanners" v-if="hotBanners && hotBanners.length">
      <main-article
        :title="$t('article.hot.title')"
        :subtitle="$t('article.hot.pcSubTitle')"
        :lang="false"
      ></main-article>
    </goods-three-column>
    <main-wrapper v-if="config.bestSectionNo" :main="true">
      <layout-width>
        <main-article :subtitle="$t('article.best.subtitle')" :title="bestTitle" :lang="false"></main-article>
        <goods-best-list ref="GoodsBestList" />
      </layout-width>
    </main-wrapper>
    <layout-full v-if="recentGoods.length > 0">
      <layout-width :relative="true">
        <main-article
          :subtitle="$t('article.recent.subtitle')"
          :title="$t('article.recent.title')"
          :lang="false"
        />
        <goods-swiper :goods="recentGoods" />
      </layout-width>
    </layout-full>
    <main-wrapper :main="true">
      <layout-width
        v-show="$refs.chimmySection && $refs.chimmySection.goodsItem && $refs.chimmySection.goodsItem.length > 0"
      >
        <main-article
          :subtitle="(sectionInfos[config.chimmyEventSectionNo] || {}).promotionText"
          :title="(sectionInfos[config.chimmyEventSectionNo] || {}).label"
          :lang="true"
          :more="(sectionInfos[config.chimmyEventSectionNo] || {}).sectionExplain"
        >
          <goods-thumb-list ref="chimmySection" :section-no="config.chimmyEventSectionNo" />
        </main-article>
      </layout-width>
      <layout-width>
        <div v-if="false" class="insta-wrapper">
          <main-article
            :title="$t('article.instagram.title')"
            :subtitle="$t('article.instagram.subtitle')"
            :lang="false"
          ></main-article>
          <insta-list />
        </div>
        <template v-if="halfBanners">
          <half-list :banners="halfBanners" />
        </template>
      </layout-width>
    </main-wrapper>
    <CommonPopup v-show="isCommonPopup&&flag" @isCloseCommonPopup="isCloseCommonPopup"/>
  </div>
</template>
<script>
import Vue from 'vue'
import MainArticle from '../main/MainArticle'
import MainWrapper from '../layout/common/MainWrapper'
import LayoutWidth from '../layout/common/LayoutWidth'
import GoodsList from '../goods/GoodsList'
import GoodsThreeColumn from '../goods/GoodsThreeColumn'
import GoodsBestList from '../goods/GoodsBestList'
import GoodsThumbList from '../goods/GoodsThumbList'
import InstaList from '../main/InstaList'
import HalfList from '../main/HalfList'
import MainSlide from '../main/Slide'
import TabContainer from '../layout/common/TabContainer'
import TabContent from '../layout/common/TabContent'
import AppBanner from '../layout/common/Banner'
import LayoutFull from '../layout/common/LayoutFull'
import GoodsSwiper from '../goods/GoodsSwiper'
import GoodsEvent from '../goods/GoodsEvent'
import { mapActions, mapState, mapGetters } from 'vuex'
import CommonPopup from '../popup/CommonPopup'
import cookies from 'js-cookie'

import config from '@/config'

export default {
  name: 'default-main',
  components: {
    MainArticle,
    LayoutWidth,
    MainWrapper,
    GoodsList,
    GoodsThreeColumn,
    GoodsBestList,
    GoodsThumbList,
    InstaList,
    HalfList,
    MainSlide,
    TabContainer,
    TabContent,
    AppBanner,
    LayoutFull,
    GoodsSwiper,
    GoodsEvent,
    CommonPopup
  },
  data () {
    return {
      eventBus: new Vue(),
      characters: {
        'BROWN & FRIENDS': 'tab-1',
        BT21: 'tab-2'
      },
      currentScroll: 0,
      lastScroll: 0,
      config,
      currentNew: config.newBrownSectionNo,
      isCommonPopup: true,
      flag: true
    }
  },
  computed: {
    ...mapState('display', ['sectionInfos', 'best']),
    ...mapState('recent', ['recentGoods']),
    ...mapGetters('banners', [
      'topBanners',
      'hotBanners',
      'halfBanners',
      'slideBanners'
    ]),
    topBanner () {
      return this.topBanners ? this.topBanners[1] : null
    },
    bestTitle () {
      return this.best
        ? this.$t('article.best.title.' + this.best.mainBestSearchType)
        : ''
    }
  },
  mounted () {
    this.eventBus.$on('tab-change', id => {
      this.currentNew =
        id === 'tab-1' ? config.newBrownSectionNo : config.newBT21SectionNo
    })
  },
  methods: {
    isCloseCommonPopup (isCommonPopup) {
      this.isCommonPopup = isCommonPopup
      this.bodyStyle()
    },
    isOpenCommonPopup () {
      let flag = (cookies.get('CommonPopupIsOpen'))
      if (flag === 'true') {
        this.flag = true
      } else if (flag === 'false') {
        this.flag = false
      }
    },
    bodyStyle () {
      if (this.isCommonPopup && this.flag) {
        document.body.className = 'PopupBodyStyle'
      } else {
        document.body.className = ''
      }
    }
  },
  created () {
    this.isOpenCommonPopup()
    this.bodyStyle()
  }
}
</script>
<style lang="scss" scoped>
.insta-wrapper {
  padding-top: 60px;
}
.main-slide__wrapper {
  padding-top: 160px;
}
</style>
