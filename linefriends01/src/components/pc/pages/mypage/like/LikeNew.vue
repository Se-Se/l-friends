<template>
  <div class="wishlist">
    <!-- // [D] 타이틀 영역 -->
    <h2 class="wishlist-title">{{ $t('mypage.like.title') }}</h2>
    <template v-if="likeProducts && likeProducts.length > 0">
      <ul class="wishlist__list">
        <li class="wishlist__all">
          <input
            id="select_all"
            type="checkbox"
            class="switch-input"
            @change="allSelect()"
            v-model="allSelector"
          >
            <label for="select_all">
              <span
                class="switch-label__action checkbox"
              ></span>
              <p class="switch-label__title _bold">
                {{ $t('mypage.like.allChk') }}
              </p>
            </label>
        </li>
        <li class="wishlist--action">
          <button
            type="button"
            class="wishlist--action__btn"
            @click="likeDeleteProducts"
          >
            {{ $t('mypage.like.itemCancel') }}
          </button>
        </li>
      </ul>
      <ul class="goods-best-list wish">
        <li
          v-for="(product, key) in likeProducts"
          :key="key"
          class="goods-item__wish">
              <article class="goods-item__doubleline">
                <div class="goods-item__wish-chk">
                  <input
                    :id="`item_${product.productNo}`"
                    :value="product.productNo"
                    v-model="selectedNos"
                    @change="changeAllSelector"
                    type="checkbox"
                    class="switch-input"
                  >
                    <label :for="`item_${product.productNo}`">
                      <span
                        class="switch-label__action checkbox"
                      ></span>
                      <p
                        :class="{
                          'switch-label__title': true
                        }"
                      ></p>
                    </label>
                </div>
                <router-link :to="'/goods/detail/'+product.productNo">
                  <figure
                    class="goods-item__fig"
                    :class="{ '_soldout': product.stockCnt === 0 }">
                    <img
                      class="goods-item__img"
                      :src="product.imageUrls[0]"
                    />
                  </figure>
                </router-link>
                <div class="goods-item--info">
                  <p
                    v-if="product.promotionText"
                    class="goods-item--info__subname">
                    {{ product.promotionText }}
                  </p>
                  <h2 class="goods-item--info__name">
                    {{ product.productName }}
                  </h2>
                  <div class="goods-item--info__price-wrap">
                    <p
                      v-if="priceCalculate(product).discountRate !== 0"
                      class="goods-item--info__sale"
                    >
                      {{ priceCalculate(product).discountRate }}%
                    </p>
                    <p
                      v-if="product.salePrice"
                      class="goods-item--info__origin"
                    >
                      <strong class="goods-item--info__origin--price">{{ priceCalculate(product).finalSalePrice.toLocaleString() }}</strong>
                      <span class="goods-item--info__origin--symbol">{{ $t('currency') }}</span>
                    </p>
                    <p
                      v-if="priceCalculate(product).discountRate !== 0"
                      class="goods-item--info__saleprice"
                    >
                      {{ product.salePrice.toLocaleString() }}
                    </p>
                  </div>
                  <div class="goods-item--info__tags">
                    <div
                      v-if="product.stockCnt === 0"
                      class="goods-item--info__tags__item soldout"
                    >
                      <p>{{ $t('goods.tags.soldout') }}</p>
                    </div>
                    <div
                      v-if="product.couponDiscountAmt"
                      class="goods-item--info__tags__item coupon"
                    >
                      <p>
                        {{ $t('goods.coupon') }}
                      </p>
                    </div>
                    <div
                      v-if="product.reserve"
                      class="goods-item--info__tags__item reserve"
                    >
                      <p>
                        {{ $t('item.reserve') }}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
        </li>
      </ul>
    </template>
    <template v-if="likeProducts && likeProducts.length === 0">
      <div class="table_wrap">
        <table class="table_data bor-1">
          <colgroup>
            <col style="width:1180px;">
          </colgroup>
          <tbody>
            <tr>
              <td class="none" colspan="1">
                <div class="table-nodata">
                  <figure class="table-nodata__fig">
                    <img src="~@/assets/images/pc/icons/ic-nodata79x100.png">
                  </figure>
                  <div class="table-nodata--info">
                  <h2 class="table-nodata--info__title">
                      {{ $t('mypage.like.description') }}
                  </h2>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <div class="pagination-interval">
      <pagination class="mt-3" :page="1" :total="totalCount || 1" :limit="20" @change="pageChange" ref="pagination" />
    </div>
  </div>
</template>

<script>
import GoodsItem from '../../../goods/goodsItem/GoodsItemDoubleLine'
import LikeNew from '@/components/mixins/mypage/like/LikeNew'

import Pagination from '@/components/pc/assets/Pagination'

export default {
  mixins: [LikeNew],
  components: {
    GoodsItem,
    Pagination
  }
}
</script>

