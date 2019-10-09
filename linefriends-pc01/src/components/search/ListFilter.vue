<template>
  <div>
    <div class="list-query-block cf">
      <ul class="list-query-result">
        <li :class="['list-query-piece', {'piece-active' : pageSize === 40}]" @click.prevent="changeSize(40)">
          <span class="wrapper-pc-font_family_c">40</span>件
        </li>
        <li :class="['list-query-piece', {'piece-active' : pageSize === 80}]" @click.prevent="changeSize(80)">
          <span class="wrapper-pc-font_family_c">80</span>件
        </li>
      </ul>
      <div class="list-query-result list-query-font">
        <span class="list-query-nums">{{ totalCount }}</span>件の商品があります。
      </div>
      <div class="list-query-way cf">
        <div class="list-product-sort">
          <vue-select-box class="size_m" :showValue="sortType" :items="sortList" @selected="selectType" />
        </div>
        <div class="list-role-select">
          <div class="bx_select size_m" v-click-outside="closeBrand">
            <div class="txt_select" ref="selectBrandBox" @click.prevent="openBrand">
              <span class="select_vle">{{brandLabel}}</span>
              <span class="ico_arrow">リストを開く</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="character-select-menu-wrap" ref="selectBrand" :style="showBrand ? 'display: block;' : 'display: none;'">
      <div class="character-select-layout">
        <div class="character-select-menu">
          <div class="character-select-layout">
            <div class="character-select-char character-select-char-all">
              <h2 class="character-select-char-title">すべてのキャラクター</h2>
              <ul class="character-select-char-list">
                <li class="character-select-char-item">
                  <a href="javascript:" @click.prevent="changBrand">
                    <p class="character-select-char-img">
                      <img src="@/assets/img/character/ic-all-003.png" alt="" class="character-select-char-image">
                    </p>
                    <p class="cha-name">すべて</p>
                  </a>
                </li>
              </ul>
            </div>
            <div class="character-select-char">
              <h2 class="character-select-char-title">{{brands[0].label}}</h2>
              <ul class="character-select-char-list  char_select_width">
                <li class="character-select-char-item" v-for="(item, idx) in brands[0].brands" :key="idx">
                  <a href="javascript:" @click.prevent="changBrand(idx, brands[0].brandNos, item.brandNo)">
                    <p class="character-select-char-img">
                      <img :src="item.icon" alt="" class="character-select-char-image">
                    </p>
                    <p class="cha-name">{{item.label}}</p>
                  </a>
                </li>
              </ul>
            </div>
            <div class="character-select-char">
              <h2 class="character-select-char-title">{{brands[1].label}}</h2>
              <ul class="character-select-char-list char_select_width">
                <li class="character-select-char-item" v-for="(item, idx) in brands[1].brands" :key="idx">
                  <a href="javascript:" @click.prevent="changBrand(idx, brands[1].brandNos, item.brandNo)">
                    <p class="character-select-char-img">
                      <img :src="item.icon" alt="" class="character-select-char-image">
                    </p>
                    <p class="cha-name">{{item.label}}</p>
                  </a>
                </li>
              </ul>
              <h2 class="character-select-char-title">{{brands[2].label}}</h2>
              <ul class="character-select-char-list  char_select_width">
                <li class="character-select-char-item" v-for="(item, idx) in brands[2].brands" :key="idx">
                  <a href="javascript:" @click.prevent="changBrand(idx, brands[2].brandNos, item.brandNo)">
                    <p class="character-select-char-img">
                      <img :src="item.icon" alt="" class="character-select-char-image">
                    </p>
                    <p class="cha-name">{{item.label}}</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="character-select-menu-dim"></div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapState } from 'vuex'
import VueSelectBox from '@/components/common/VueSelectBox'
import ClickOutside from 'vue-click-outside'

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
      let label = 'すべてのキャラクター'
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
      this.toogleBrand()
    },
    closeBrand () {
      this.showBrand = false
      $('html').css('overflow', '')
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
    },
    toogleBrand () {
      this.showBrand = !this.showBrand
      if (this.showBrand) {
        $('html').css('overflow', 'hidden')
      } else {
        $('html').css('overflow', '')
      }
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
