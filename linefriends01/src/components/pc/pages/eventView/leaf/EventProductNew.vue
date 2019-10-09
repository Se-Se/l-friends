<template>
  <div class="event-overflow">
    <ul id="theMenu" :class="['lst_tab_brand extend', {'fixed' : fixedFlg}]" v-if="event && event.sectionMenu && event.sectionMenu.length > 1">
      <!-- [D] 카테고리 활성화 시 li에 on클래스 추가 -->
      <template v-for="(section, index) in event.sectionMenu">
        <li :class="{on: sectionSelect === index}" :key="index">
          <a href="javascript:" @click.prevent="sectionClick(index)">
            <span>{{ section.label }}</span>
          </a>
        </li>
      </template>
    </ul>
    <div class="inner main_inner" v-if="event && event.sectionMenu && event.sectionMenu.length > 0">
      <div :style="fixedFlg ? 'padding-top: 61px' : ''">
        <div id="check_fixed_div">
        </div>
      </div>
      <template v-for="(section, index) in event.sectionMenu">
        <div :key="index">
          <em :id="`${'category' + index}`" class="tit_category" v-if="event.sectionMenu.length > 1">{{ section.label }}</em>
          <ul class="item_best" :class="[index !== event.sectionMenu.length - 1  ? 'bor_bm': 'last','column' + section.pcPerRow]">
            <li v-for="(product,label) in section.products">
              <GoodsEventList :item="product" :key="label" :perRow="section.pcPerRow"></GoodsEventList>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import GoodsEventList from '@/components/pc/goods/GoodsPromotion'
import $ from 'jquery'

export default {
  data () {
    return {
      sectionSelect: this.$route.hash ? parseInt(this.$route.hash.replace('#category', '')) : 0,
      fixedFlg: false
    }
  },
  components: {
    GoodsEventList
  },
  computed: {
    ...mapState('event', ['event'])
  },
  methods: {
    sectionClick (index) {
      this.sectionSelect = index
      window.scrollTo(0, $('#category' + index).offset().top - 60.5)
    },
    handleScrollAddClass () {
      const tabHeight = 61
      const checkDivTop = document.getElementById('check_fixed_div')
      if (checkDivTop) {
        const divTop = checkDivTop.getBoundingClientRect().top
        if (divTop > tabHeight) {
          this.fixedFlg = false
        } else {
          this.fixedFlg = true
        }
        this.handleScrollChangeNane(divTop)
      }
    },
    handleScrollChangeNane (h) {
      for (let i = 0; i < $('.tit_category').length; i++) {
        if (h + $('.item_best ')[i].offsetTop - 175 < 0) {
          $('#theMenu').find('li').removeClass('on')
          $('#theMenu').find('li').eq(i).addClass('on')
        }
      }
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScrollAddClass)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScrollAddClass)
  },
  mounted () {
    this.handleScrollAddClass()
    this.$header = $('.header')
    this.$header.css('position', 'absolute')
  }
}
</script>
<style lang="scss" scoped>
.event-overflow {
  position: relative;
  overflow: hidden;
}
</style>
