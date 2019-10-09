<template>
  <div class="main-page">
    <notice />

    <main-slide />

    <div
      v-if="topBanners && topBanners.length > 0"
      class="image-banner swiper-container"
    >
      <slick :options="SlickOptions">
        <div
          v-for="(topBanner, key) in topBanners"
          :key="key"
          class="swiper-slide"
        >
          <image-banner :banner="topBanner" />
        </div>
      </slick>
    </div>
    <main-article
      v-show="$refs.newBrownSection && $refs.newBrownSection.goods.length > 0"
      :label="{ name: 'NEW', color: '#5e88ff' }"
      :title="$t('article.new.title')"
      :padding-top="1.5"
    >
      <tab-container
        :bus="eventBus"
        :tabs="characters"
      >
        <tab-content
          :bus="eventBus"
          tab-id="tab-1"
          :tabShow="true"
        >
          <goods-section
            ref="newBrownSection"
            :section-no="config.newBrownSectionNo"
            :limit="6"
          />
        </tab-content>
        <tab-content
          :bus="eventBus"
          tab-id="tab-2"
          :tabShow="true"
        >
          <goods-section
            :section-no="config.newBT21SectionNo"
            :limit="6"
          />
        </tab-content>
      </tab-container>
    </main-article>

    <main-article
      v-if="hotBanners && hotBanners.length > 0"
      :label="{ name: 'HOT', color: '#ff7667' }"
      :title="$t('article.hot.title')"
      background="#f6f6f6"
    >
      <banner-list :banners="hotBanners" />
    </main-article>

    <goods-best-article :isMainBest="true"/>

    <main-article
      v-if="recentGoods.length > 0"
      :title="$t('article.recent.title')"
      :subtitle="$t('article.recent.subtitle')"
      background="#f6f6f6"
      :padding-top="2"
      :padding-side="0"
    >
      <goods-list
        :padding-side="2"
        :goods="recentGoods"
        :width="19.4"
        direction="horizontal"
        skin="box"
      />
    </main-article>
    <main-article
      v-show="$refs.chimmySection && $refs.chimmySection.goods.length > 0"
      :title="getSection(config.chimmyEventSectionNo).label"
      :subtitle="getSection(config.chimmyEventSectionNo).promotionText"
      :padding-top="2.3"
      :padding-bottom="1.4"
    >
      <goods-section
        ref="chimmySection"
        skin="grid"
        :section-no="config.chimmyEventSectionNo"
        :limit="12"
      />
    </main-article>

    <insta-article v-if="false"/>

    <main-article
      v-if="halfBanners && halfBanners.length > 0"
      background="#f6f6f6"
      :padding-top="4"
      :padding-bottom="3.7"
    >
      <banner-list
        :banners="halfBanners"
        :text-overflow="true"
      />
    </main-article>
    <CommonPopup v-show="isCommonPopup&&flag" @isCloseCommonPopup="isCloseCommonPopup"/>
  </div>
</template>

<script>
import Vue from 'vue'
import Notice from '../../common/Notice'
import MainSlide from '../main/MainSlide'
import MainArticle from '../main/MainArticle'
import InstaArticle from '../main/InstaArticle'
import TabContainer from '../common/tab/TabContainer'
import TabContent from '../common/tab/TabContent'
import ImageBanner from '../common/banner/ImageBanner'
import BannerList from '../common/banner/BannerList'
import ImageGrid from '../common/ImageGrid'
import GoodsSearch from '../goods/GoodsSearch'
import GoodsList from '../goods/GoodsList'
import GoodsSection from '../goods/GoodsSection'
import GoodsBestArticle from '../goods/GoodsBestArticle'
import GoodsEvent from '../goods/GoodsEvent'
import { mapState, mapGetters } from 'vuex'
import Slick from 'vue-slick'
import CommonPopup from '../popup/CommonPopup'

import config from '@/config'
import cookies from 'js-cookie'

export default {
  name: 'Main',
  components: {
    Slick,
    Notice,
    MainSlide,
    MainArticle,
    BannerList,
    ImageBanner,
    InstaArticle,
    TabContainer,
    TabContent,
    ImageGrid,
    GoodsSearch,
    GoodsSection,
    GoodsBestArticle,
    GoodsEvent,
    GoodsList,
    CommonPopup
  },
  data () {
    return {
      eventBus: new Vue(),
      characters: {
        'BROWN & FRIENDS': 'tab-1',
        'BT21': 'tab-2'
      },
      SlickOptions: {
        slidesToShow: 1,
        arrows: false,
        infinite: true,
        speed: 300,
        fade: true,
        autoplay: true,
        autoplaySpeed: 5000
      },
      config,
      isCommonPopup: true,
      flag: true
    }
  },
  computed: {
    ...mapState('display', ['sectionInfos']),
    ...mapState('recent', ['recentGoods']),
    ...mapGetters(
      'banners', [
        'topBanners',
        'hotBanners',
        'halfBanners'
      ]
    )
  },
  methods: {
    getSection (sectionNo) {
      return (this.sectionInfos && this.sectionInfos[sectionNo]) || {}
    },
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
        document.body.style.height = '100vh'
      } else {
        document.body.className = ''
        document.body.style.height = ''
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
.image-banner {
  margin-top: 1.2rem;
  overflow: hidden;
  
  /deep/ .slick-track {
    display: flex;
  }
}

.chimmy-more-btn {
  margin-top: 1.1rem;
}
</style>
