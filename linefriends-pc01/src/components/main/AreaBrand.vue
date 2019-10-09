<template>
  <div class="good_area">
    <h2 class="ttl_1">熱情子犬, CHIMMY</h2>
    <p class="ttl_sub">CHIMMYの代表アイテム</p>
    <ul class="good_list column-6 no-info">
      <li v-for="product in section[0].products.slice(0, 12)" :key="`brand_${product.productNo}`">
        <router-link :to="`/product/detail/${product.productNo}`">
          <div class="photo_wrap">
            <div class="thumbnail">
              <img class="item_img" :src="product.imageUrls[0]" alt="">
              <img class="item_img_hover" :src="product.imageUrls[1]" alt="">
            </div>
          </div>
        </router-link>
      </li>
    </ul>
    <p class="more">
      <a :href="section[0].sectionExplain">もっと見る</a>
    </p>
  </div>
</template>

<script>
export default {
  props: ['section']
}
</script>
