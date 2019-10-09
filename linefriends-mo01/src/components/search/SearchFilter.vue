<template>
  <div>
    <vue-select-box class="size_m list-width_16_4" :showValue="sortType" :items="sortList" @selected="selectType" />
    <div class="bx_select size_m list-width_16_4">
      <div class="txt_select" @click.prevent="openBrand">
        <span class="select_vle">
          <span>{{brandLabel}}</span>
        </span>
        <span class="ico_character_select">リスト開く</span>
      </div>
    </div>
    <div class="list-popup" ref="popupScroll" :style="showBrand ? 'display: block;' : 'display: none;'">
      <div class="wrap_category">
        <h2>キャラクター選択</h2>
        <div class="category_right">
          <a class="btn_close" @click.prevent="closeBrand">Close</a>
        </div>
      </div>
      <div class="list-popup-wrap">
        <article class="list-popup-list">
          <div class="list-popup-list-header">
            <h3 class="list-popup-title">すべてのキャラクター</h3>
          </div>
          <ul class="list-popup-container-all">
            <li class="list-popup-brand-wrap">
              <a @click.prevent="changBrand">
                <div class="list-popup-brand-item">
                  <img src="@/assets/img/character/ic_all.png" alt="" class="list-popup-image">
                </div>
                <p class="list-popup-name">すべて</p>
              </a>
            </li>
          </ul>
        </article>
        <article class="list-popup-list" v-for="(brand, index) in brands" :key="`brand_${index}`">
          <div class="list-popup-list-header">
            <h3 class="list-popup-title">{{brand.label}}</h3>
          </div>
          <ul class="list-popup-container-all">
            <li class="list-popup-brand-wrap" v-for="(item, idx) in brand.brands" :key="`brand_${index}_${idx}`">
              <a @click.prevent="changBrand(idx, brand.brandNos, item.brandNo)">
                <div class="list-popup-brand-item">
                  <img :src="item.icon" alt="" class="list-popup-image">
                </div>
                <p class="list-popup-name">{{item.label}}</p>
              </a>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
import { mapState } from 'vuex'
import VueSelectBox from '@/components/common/VueSelectBox'
import ClickOutside from '@/utils/VueClickOutside.js'
import { lock, unlock } from 'tua-body-scroll-lock'

export default {
  props: ['pageSize', 'totalCount', 'fetchListParams'],
  data: function () {
    return {
      showBrand: false
    }
  },
  computed: {
    ...mapState('brand', ['brands']),
    sortType () {
      let type = 'RECENT_PRODUCT|DESC'
      if (this.fetchListParams && this.fetchListParams['order.by'] && this.fetchListParams['order.direction']) {
        type = this.fetchListParams['order.by'] + '|' + this.fetchListParams['order.direction']
      }
      return type
    },
    sortList () {
      return [
        {
          label: '新着順',
          value: 'RECENT_PRODUCT|DESC'
        },
        {
          label: '人気順',
          value: 'POPULAR|DESC'
        },
        {
          label: '安い順',
          value: 'DISCOUNTED_PRICE|ASC'
        },
        {
          label: '高い順',
          value: 'DISCOUNTED_PRICE|DESC'
        }
      ]
    },
    brandLabel () {
      let label = 'キャラクター'
      if (this.fetchListParams && this.fetchListParams.brandNos) {
        let brandNos = ''
        this.fetchListParams.brandNos.forEach((item, idx) => {
          if (idx > 0) {
            brandNos += ','
          }
          brandNos += item
        })
        this.brands.forEach(sub => {
          if (brandNos === sub.brandNos) {
            label = sub.label
          } else {
            sub.brands.forEach(item => {
              if (brandNos === item.brandNo) {
                label = item.label
              }
            })
          }
        })
      }
      return label
    }
  },
  methods: {
    changeSize (pageSize) {
      this.$emit('searchList', { type: 'pageSize', pageSize })
    },
    selectType (value) {
      this.$emit('searchList', { type: 'sort', sortType: value })
    },
    openBrand () {
      this.showBrand = true
      lock(this.$refs.popupScroll)
    },
    closeBrand () {
      this.showBrand = false
      unlock(this.$refs.popupScroll)
    },
    changBrand (idx, subNos, brandNo) {
      this.closeBrand()
      let brandNos = null
      if (idx === 0) {
        brandNos = subNos
      } else {
        brandNos = brandNo
      }
      this.$emit('searchList', { type: 'brand', brandNos })
    }
  },
  components: {
    VueSelectBox
  },
  directives: {
    ClickOutside
  }
}
</script>
