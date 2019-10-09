<template>
  <div>
    <sub-page-header title="매장안내"/>
    <slider/>
    <!-- <div class="stores-menu">
      <store-tabs @childs-event="tabView" />
    </div> -->
    <div id="container">
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
                  <em>{{ location.type }}</em>
                </dd>
                <dd class="stores-contents__info">
                  <span class="stores-contents__ico place"></span>
                  <p>{{ location.address }}<a :href="location.map" target="_blank">지도 보기</a></p>
                </dd>
                <dd class="stores-contents__info">
                  <span class="stores-contents__ico call"></span>
                  <em>{{ location.phone }}</em>
                </dd>
                <dd class="stores-contents__info">
                  <span class="stores-contents__ico time"></span>
                  <em>
                    <span v-html="location.time"></span>
                  </em>
                </dd>
              </dl>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SubPageHeader from '../../layout/header/SubPageHeader'
import Slider from '@/components/mobile/others/StoreSlide'
import StoreTabs from '@/components/mobile/others/StoreTabs'
import stores from '@/components/common/store'

export default {
  name: 'StoreGuide',
  components: {
    SubPageHeader,
    Slider,
    StoreTabs
  },
  data () {
    return {
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
