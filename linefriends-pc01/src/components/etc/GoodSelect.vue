<template>
  <div class="popup-layer" style="display: block;">
    <div class="popup_common popup_size_1 popup_size_new1">
      <div class="roller_area none_overflow is_open">
        <div class="contact_registration">
          <h1>商品選択</h1>
        </div>
        <div class="con con_new_margin">
          <div class="search_pop">
            <div class="icon-search">
              <input type="text" class="size_m" placeholder="商品名を入力してください。" v-model="goodName" @keyup.enter="select">
              <button @click.prevent="clearKeyword"><img src="@/assets/img/icon/btn_popup_close_text.png"></button>
            </div>
            <button class="btn btn_green search_search" @click.prevent="select">検索</button>
          </div>

          <div class=" bear_search" style="display: block;" v-if="isFirst">
            <img src="@/assets/img/common/img_error.png">
            <p class="text">お問い合わせしたい商品を検索し、選択してください。</p>
          </div>
          <div class="search_conts" v-else>
            <p class="commodity_quantity"><span class="wrapper-pc-font_family_c">{{totalCount}}</span>件の商品があります。</p>
            <div class="common_three_two">
              <ul class="good_list column-min-3">
                <li v-for="(item,key) in goodList" :key="key">
                  <!-- <a href="#"> -->
                  <div class="photo_wrap">
                    <div class="thumbnail">
                      <img class="item_img" :src="item.imageUrls[0]">
                      <img class="item_img_hover" :src="item.imageUrls[0]">
                    </div>
                    <span class="bx_input">
                      <input :id="`product-${item.productNo}`" type="checkbox" @click="clickItem(item)">
                      <label :for="`product-${item.productNo}`"></label>
                    </span>
                  </div>
                  <div class="good_info">
                    <span class="describe" v-if="item.promotionText">{{ item.promotionText }}</span>
                    <h3 class="name">{{ item.productName }}</h3>
                    <p class="price" v-if="Math.ceil(item.immediateDiscountAmt || 0 / item.salePrice * 100)">
                      <strong class="discount">{{ Math.ceil(item.immediateDiscountAmt || 0 / item.salePrice * 100) }}% OFF</strong>
                      <span class="real"><i class="uom">￥</i>{{ item.salePrice - item.immediateDiscountAmt }}</span>
                      <del class="original">{{ item.salePrice }}</del>
                    </p>
                    <p class="price" v-else>
                      <span class="real"><i class="uom">￥</i>{{ item.salePrice }}</span>
                    </p>
                    <p class="ohter">
                      <span class="badge badge_blue">20% OFF クーポン</span>
                      <span class="badge badge_reserved" v-if="isPreOrderPeriod(item)">予約商品</span>
                    </p>
                  </div>
                  <!-- </a> -->
                </li>
              </ul>
            </div>
            <pagination v-model="fetchListParams.pageNumber" :total="totalCount || 1" :limit="fetchListParams.pageSize" @change="select" v-if="goodList" />
            <ul class="btn_list btn_list-margin">
              <li>
                <button class="btn" @click.prevent="closePopup">キャンセル</button>
              </li>
              <li>
                <button class="btn btn_green" @click.prevent="submit">登録</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button class="btn_close" @click.prevent="closePopup">close</button>
    </div>
  </div>
</template>
<script>
import { Alert } from '@/components/common/modal'
import Pagination from '@/components/common/Pagination'
import $ from 'jquery'
export default {
  name: 'GoodSelect',
  components: {
    Pagination
  },
  data () {
    return {
      isFirst: true,
      goodName: '',
      fetchListParams: {
        hasTotalCount: true,
        'filter.saleStatus': 'RESERVATION_AND_ONSALE',
        pageNumber: 1,
        pageSize: 10,
        'order.by': 'RECENT_PRODUCT',
        'order.direction': 'DESC',
        'filter.keywords': '',
        'filter.soldout': true
      },
      goodList: null,
      totalCount: 0,
      selectedGoods: null
    }
  },
  methods: {
    closePopup () {
      this.$emit('closePopup')
    },
    clearKeyword () {
      this.goodName = ''
      this.isFirst = true
    },
    select () {
      if (this.goodList !== null) {
        this.goodList.forEach(good => {
          $(`#product-${good.productNo}`)[0].checked = false
        })
      }
      this.isFirst = false
      this.searchKeyword(this.goodName)
    },
    async searchKeyword (keyword) {
      if (keyword) {
        this.fetchListParams['filter.keywords'] = this.goodName
        await this.$store.dispatch('search/getList', this.fetchListParams).then(res => {
          this.goodList = res.list
          this.totalCount = res.totalCount
        })
      } else {
        Alert({ message: '商品名を入力してください。', title: 'お問い合わせ' })
      }
    },
    clickItem (item) {
      this.goodList.forEach(good => {
        if (item.productNo !== good.productNo) {
          $(`#product-${good.productNo}`)[0].checked = false
        }
      })
      if ($(`#product-${item.productNo}`)[0].checked) {
        this.selectedGoods = item
      } else {
        this.selectedGoods = null
      }
    },
    isPreOrderPeriod (item) {
      if (item && item.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(item.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(item.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    },
    submit () {
      if (this.selectedGoods) {
        this.$emit('setSelectedGood', this.selectedGoods)
        this.$emit('closePopup')
      } else {
        Alert('商品を選択してください。')
      }
    }
  }
}
</script>
<style>
.file {
  display: none;
}
</style>
