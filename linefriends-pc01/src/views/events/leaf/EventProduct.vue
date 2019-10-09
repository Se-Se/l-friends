<template>
  <div class="event-goods_area" v-if="event && event.section.length">
    <div class="event-fixed-area">
      <div class="event-good_tab js_native" :class="{'fixed': fixedFlg}" v-if="event && event.sectionMenu && event.sectionMenu.length > 1">
        <div class="good_tab_list">
          <nav>
            <ul>
              <li :class="{on: sectionSelect === index}" v-for="(section, index) in event.sectionMenu" :key="index">
                <a href="#" @click.prevent="sectionClick(index)">{{ section.label }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <div class="wrap">
      <div class="event-good_area" v-for="(section, index) in event.sectionMenu" :key="index">
        <p class="title js_title" v-if="event && event.sectionMenu && event.sectionMenu.length > 1">{{section.label}}</p>
        <ul class="good_list js_list" :class="columnRow(section.pcPerRow)">
          <li v-for="(product,label) in section.products" :key="label">
            <ProductItem :item="product" :area="'event'"></ProductItem>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { productPrice } from '@/utils/StringUtils'
import ProductItem from '@/components/common/ProductItem'
import $ from 'jquery'

export default {
  data () {
    return {
      sectionSelect: this.$route.hash ? parseInt(this.$route.hash.replace('#category', '')) : 0,
      fixedFlg: false,
      top: 0
    }
  },
  components: {
    ProductItem
  },
  computed: {
    ...mapState('event', ['event'])
  },
  methods: {
    columnRow (pcPerRow) {
      return 'column-' + pcPerRow
    },
    priceCalculate (product) {
      return productPrice(product.salePrice,
        product.additionDiscountAmt,
        product.immediateDiscountAmt)
    },
    sectionClick (index) {
      this.sectionSelect = index
      $('html, body').stop(true).animate({
        scrollTop: $('.event-good_area').eq(index).offset().top - 56
      })
    },
    handleScrollAddClass () {
      const checkDivTop = document.getElementsByClassName('event-goods_area')[0].getBoundingClientRect ? document.getElementsByClassName('event-goods_area')[0].getBoundingClientRect().top : 0
      if (checkDivTop > 0) {
        this.fixedFlg = false
      } else {
        this.fixedFlg = true
      }
      this.handleScrollChangeNane(checkDivTop)
    },
    handleScrollChangeNane (h) {
      for (let i = 0; i < $('.js_title').length; i++) {
        if (h + $('.js_list')[i].offsetTop - 175 < 0) {
          $('.js_native').find('li').removeClass('on')
          $('.js_native').find('li').eq(i).addClass('on')
        }
      }
    },
    isNew (itemRegisterYmdt) {
      let currentDate = new Date()
      return currentDate.getTime() < this.fun_date2(itemRegisterYmdt).getTime()
    },
    fun_date2 (data) {
      let date1 = new Date(data.replace(/-/g, '/'))
      date1.setDate(date1.getDate() + 7)
      return date1
    },
    isPreOrderPeriod (product) {
      if (product && product.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(product.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(product.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScrollAddClass)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScrollAddClass)
  },
  mounted () {
    $('.header').css('position', 'relative')
    this.handleScrollAddClass()
  }
}
</script>
<style scoped>
.js_native {
  min-width: 1180px;
}
.js_pointer {
  cursor: pointer;
}
</style>
