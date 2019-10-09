<template>
  <div id="container" class="home">
    <!-- ↓↓↓↓↓ home ↓↓↓↓↓ -->
    <div class="home-wrapper">
      <div class="express">
        <p class="txt_ex">6,000円以上お買い上げで</p>
        <span class="free">送料無料</span>
      </div>
      <banner-big v-if="bigBanners" :banners="bigBanners" />
      <notice :notice="mainNotice" v-if="mainNotice && mainNotice.length" />
      <p class="banner_1">
        <banner-link v-if="midBanner" :banner="midBanner">
          <img :src="midBanner.imageUrl" alt="" />
        </banner-link>
      </p>
      <area-new :sections="mainNewSections" v-if="mainNewSections && mainNewSections.length" />
      <banner-mid v-if="mid2Banners" :banners="mid2Banners" />
      <area-best :products="mainBestProducts" v-if="mainBestProducts && mainBestProducts.length!==0"/>
      <area-recent :products="recentProducts" v-if="recentProducts.length" />
      <area-brand :section="mainBrandSection" v-if="mainBrandSection && mainBrandSection.length" />
      <banner-btm v-if="btmBanners" :banners="btmBanners" />
      <banner-qr v-if="qrBanners" :banners="qrBanners" />
    </div>
    <!-- ↑↑↑↑↑ home ↑↑↑↑↑ -->
  </div>
</template>

<script>
import BannerBig from '@/components/main/BannerBig'
import Notice from '@/components/main/Notice'
import BannerLink from '@/components/common/BannerLink'
import AreaNew from '@/components/main/AreaNew'
import BannerMid from '@/components/main/BannerMid'
import AreaBest from '@/components/main/AreaBest'
import AreaBrand from '@/components/main/AreaBrand'
import AreaRecent from '@/components/main/AreaRecent'
import BannerBtm from '@/components/main/BannerBtm'
import BannerQr from '@/components/main/BannerQr'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    BannerBig,
    Notice,
    BannerLink,
    AreaNew,
    BannerMid,
    AreaBest,
    AreaBrand,
    AreaRecent,
    BannerBtm,
    BannerQr
  },
  computed: {
    ...mapState('display', ['mainNewSections', 'mainBestSections', 'mainBrandSection']),
    ...mapState('product', ['mainBestProducts']),
    ...mapState('recent', ['recentProducts']),
    ...mapGetters('display', ['bigBanners', 'midBanner', 'mid2Banners', 'btmBanners', 'qrBanners']),
    ...mapGetters('board', ['mainNotice'])
  }
}
</script>
