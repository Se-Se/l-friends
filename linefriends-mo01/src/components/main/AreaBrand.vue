<template>
  <div class="good_area pt-40">
    <h2 class="ttl_1">熱情子犬, CHIMMY</h2>
    <p class="ttl_sub">CHIMMYの代表アイテム</p>
    <ul class="good_list column-3 no-info">
      <li v-for="product in section[0].products.slice(0, 12)" :key="product.productNo">
        <router-link :to="`/m/product/detail/${product.productNo}`">
          <div class="photo_wrap">
            <div class="thumbnail">
              <img :src="product.imageUrls[0]" alt="">
            </div>
          </div>
        </router-link>
      </li>
    </ul>
    <button class="btn btn_primary more mt-2" @click.prevent="more">
      <span class="bold">もっと見る</span>
    </button>
  </div>
</template>

<script>
export default {
  props: ['section'],
  methods: {
    more () {
      location.href = '/m' + this.section[0].sectionExplain
    }
  }
}
</script>
