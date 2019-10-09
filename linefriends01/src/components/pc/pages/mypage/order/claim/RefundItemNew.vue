<template>
  <tr>
    <td>
      <span class="bx_input check2">
        <input :id="`personal-${index}`" type="checkbox" v-model="option.checkYn" @change="checkChange">
        <label :for="`personal-${index}`"><span></span></label>
      </span>
    </td>
    <td>
      <router-link :to="`/goods/detail/${option.productNo}`" class="item_info" target="_blank">
        <div class="bx_thumb">
          <img :src="option.imageUrl ? option.imageUrl : ''" width="80" height="80" alt="상품 썸네일">
        </div>
        <div class="bx_info">
          <span class="name">
            {{(option.showBrandName + option.productName) | wordsFormat(56)}}
          </span>
          <span class="option">
            <template v-for="showOption, index in option.showOptions">
              <template v-if="index === 0">{{showOption}}</template>
              <template v-else> / {{showOption}}</template>
            </template>
            <template v-if="option.showAddPrice">
              {{option.showAddPrice}}
            </template>
            <template v-if="option.showOrderCnt">
              {{option.showOrderCnt}}
            </template>
          </span>
        </div>
      </router-link>
    </td>
    <td><span class="num">{{option.price.buyAmt | formatCurrency}}원</span></td>
    <td><span class="num">{{option.orderCnt}}</span></td>
    <td>
      <div class="sel_wrap size_1">
        <div class="bx_select">
          <a href="javascript:void(0)" class="txt_select" v-click-outside="hideProductCnt" :class="{'on' : active}" v-toggle="active">
            <span class="num">{{selectedCount}}</span>
            <span class="ico_arrow">목록 열기</span>
          </a>
          <ul :class="['lst_select_content', {'limited' : option.orderCnt > 4}]">
            <li @click.prevent="updateProductCnt(0)">
              <a href="javascript:"><span class="num">선택</span></a>
            </li>
            <li v-for="selectCnt in option.orderCnt" @click.prevent="updateProductCnt(selectCnt)">
              <a href="javascript:"><span class="num">{{selectCnt}}</span></a>
            </li>
          </ul>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import RefundItemNew from '@/components/mixins/mypage/order/claim/RefundItemNew'

export default {
  mixins: [RefundItemNew]
}
</script>
