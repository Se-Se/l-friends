<template>
  <div>
    <main-wrapper>
      <layout-width>
        <bread-crumbs
          :basic="basicCrumbs"
        />
        <div class="stores-title">
          <main-title :title="title" />
        </div>
        <div class="stores-slide">
          <store-slide />
        </div>
        <!-- <div class="stores-menu">
          <store-tabs @childs-event="tabView" />
        </div> -->
        <div class="stores-list">
          <template v-for="( store, key ) in stores">
            <div
              v-if="tabStatus === store.value || tabStatus === 'all'"
              :key="key"
              class="stores-list__contents">
              <h2 class="stores-list__title">{{ store.country }}</h2>
              <div class="stores-contents">
                <dl
                  v-for="( location, index ) in store.location"
                  :key="index"
                  class="stores-contents__wrapper">
                  <dt class="stores-contents__title">
                    {{ location.title }}
                  </dt>
                  <dd class="stores-contents__info">
                    <span class="stores-contents__ico store"></span>
                    {{ location.type }}
                  </dd>
                  <dd class="stores-contents__info">
                    <span class="stores-contents__ico place"></span>
                    {{ location.address }}<br>
                    <a :href="location.map" target="_blank">지도 보기</a>
                  </dd>
                  <dd class="stores-contents__info">
                    <span class="stores-contents__ico call"></span>
                    {{ location.phone }}
                  </dd>
                  <dd class="stores-contents__info">
                    <span class="stores-contents__ico time"></span>
                    <span v-html="location.time"></span>
                  </dd>
                </dl>
              </div>
            </div>
          </template>
        </div>
      </layout-width>
    </main-wrapper>
  </div>
</template>

<script>
import MainWrapper from '../../layout/common/MainWrapper'
import LayoutWidth from '../../layout/common/LayoutWidth'
import BreadCrumbs from '../../layout/common/BreadCrumbs'
import MainTitle from '../../mypage/MainTitle'
import StoreSlide from '../../others/StoreSlide'
import StoreTabs from '../../others/StoreTabs'
import stores from '@/components/common/store'

export default {
  name: 'Store',
  props: {
    title: {
      type: String,
      default: '매장안내'
    }
  },
  components: {
    MainWrapper,
    LayoutWidth,
    BreadCrumbs,
    MainTitle,
    StoreSlide,
    StoreTabs
  },
  data () {
    return {
      basicCrumbs: '홈',
      tabStatus: 'all',
      stores: stores
    }
  },
  methods: {
    tabView (event) {
      if (event === 'all') {
        this.tabStatus = 'all'
      } else if (event === 'china') {
        this.tabStatus = 'china'
      } else if (event === 'japan') {
        this.tabStatus = 'japan'
      } else if (event === 'taiwan') {
        this.tabStatus = 'taiwan'
      } else if (event === 'hongkong') {
        this.tabStatus = 'hongkong'
      } else if (event === 'thai') {
        this.tabStatus = 'thai'
      } else if (event === 'usa') {
        this.tabStatus = 'usa'
      } else if (event === 'korea') {
        this.tabStatus = 'korea'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
