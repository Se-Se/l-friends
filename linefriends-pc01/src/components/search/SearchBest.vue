<template>
  <div class="result_no_wrap">
    <div class="result_no_wrap_bottom">
        <h1 class="recommend_title">人気上昇中！</h1>
        <div class="recommend_center">
            <ul class="good_list column-5">
                <li v-for="(item, index) in bestProducts" :key="index">
                    <product-item v-if="index<5" :item="item" />
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductItem from '@/components/common/ProductItem'

export default {
  props: [],
  components: {
    ProductItem
  },
  computed: {
    ...mapState('product', ['bestProducts'])
  }
}
</script>
