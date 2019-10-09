<template>
  <div id="container" class="home">
    <banner-big :banners="bigBanners" v-if="bigBanners" />
    <div class="wrap">
      <notice :notice="mainNotice" v-if="mainNotice && mainNotice.length" />
      <p class="baner_1">
        <banner-link :banner="midBanner" v-if="midBanner">
          <img :src="midBanner.imageUrl" alt="" />
        </banner-link>
      </p>
      <area-new :sections="mainNewSections" v-if="mainNewSections && mainNewSections.length" />
    </div>
    <banner-mid :banners="mid2Banners" v-if="mid2Banners" />
    <area-best :products="mainBestProducts" v-if="mainBestProducts" />
    <area-recent :products="recentProducts" v-if="recentProducts.length" />
    <div class="wrap">
      <area-brand :section="mainBrandSection" v-if="mainBrandSection && mainBrandSection.length" />
      <banner-btm :banners="btmBanners" v-if="btmBanners" />
      <banner-qr :banners="qrBanners" v-if="qrBanners" />
    </div>
  </div>
</template>

<script>
import BannerBig from '@/components/main/BannerBig'
import Notice from '@/components/main/Notice'
import BannerLink from '@/components/common/BannerLink'
import AreaNew from '@/components/main/AreaNew'
import BannerMid from '@/components/main/BannerMid'
import AreaBest from '@/components/main/AreaBest'
import AreaRecent from '@/components/main/AreaRecent'
import AreaBrand from '@/components/main/AreaBrand'
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
    AreaRecent,
    AreaBrand,
    BannerBtm,
    BannerQr
  },
  computed: {
    ...mapState('display', ['mainNewSections', 'mainBrandSection']),
    ...mapState('product', ['mainBestProducts']),
    ...mapState('recent', ['recentProducts']),
    ...mapState('brand', ['brands']),
    ...mapGetters('display', ['bigBanners', 'midBanner', 'mid2Banners', 'btmBanners', 'qrBanners']),
    ...mapGetters('board', ['mainNotice'])
  }
}
</script>
