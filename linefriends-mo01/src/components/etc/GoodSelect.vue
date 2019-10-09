<template>
  <div class="cs-popup" style="display: block;">
    <p class="cs-popup-close"><a @click.prevent="closePopup">close</a></p>
    <div class="cs-popup-ttl">商品選択</div>
    <div class="cs-popup-contents">
      <div class="search_key">
        <dl class="input-area">
          <dt>
            <input type="text" placeholder="商品名を入力してください。" v-model="goodName">
            <a href="#" class="btn_clear" @click.prevent="clearKeyword">clear</a>
          </dt>
          <dd><button class="btn" @click.prevent="select">検索</button></dd>
        </dl>
      </div>
      <div class="detail-select-no-data" v-if="isFirst">
        <img src="@/assets/img/common/img_error.png" alt="" class="detail-select-no-data-img">
        <p class="detail-select-no-data-txt">お問い合わせしたい商品を検索し、<br>選択してください。</p>
      </div>
      <div class="detail" v-else>
        <div class="detail_popup_wrap">
          <div class="list-wrap pt-30">
            <div class="list-select-product-list">
              <p class="list-select-result"> <span class="list-select-result-nums">{{totalCount}}</span> 件の商品があります。
              </p>
              <ul class="good_list column-2">
                <li v-for="(item,key) in goodList" :key="key">
                  <!-- <router-link :to="'/m/product/detail/' + item.productNo"> -->
                  <div class="photo_wrap product_rela">
                    <div class="thumbnail">
                      <img :src="item.imageUrls[0]">
                      <span class="bx_input size_l product_checkbox">
                        <input :id="`product-${item.productNo}`" type="checkbox" @click="clickItem(item)">
                        <label :for="`product-${item.productNo}`">id_save</label>
                      </span>
                    </div>

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
                      <span class="badge badge_blue">クーポン</span>
                      <span class="badge badge_reserved" v-if="isPreOrderPeriod(item)">予約商品</span>
                    </p>
                  </div>
                  <!-- </router-link> -->
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pagination v-model="fetchListParams.pageNumber" :total="totalCount || 1" :limit="fetchListParams.pageSize" @change="select" v-if="goodList" />
    <div class="cs-popup-contents">
      <ul class="product_active">
        <li><button class="btn" @click.prevent="closePopup">キャンセル</button></li>
        <li><button class="btn btn_green" @click.prevent="submit">選択</button></li>
      </ul>
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
