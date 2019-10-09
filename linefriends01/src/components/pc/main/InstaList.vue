<template>
  <div class="insta">
    <vue-instagram token="2660806299.29a42cc.3ce96b5dfff74cd99c517b87fcf99c46" :count="5" class="insta__list">
      <template slot="feeds" slot-scope="props">
        <div class="insta__item"><a :href="props.feed.link" target="_blank"><img :src="props.feed.images.standard_resolution.url"></a></div>
      </template>
    </vue-instagram>
  </div>
</template>
<script>
import VueInstagram from 'vue-instagram'
import LayoutWidth from '../layout/common/LayoutWidth'

export default {
  name: 'insta-list',
  component: {
    LayoutWidth,
    VueInstagram
  }
}
</script>
<style lang="scss" scoped>
.insta {
  padding-top: 16px;
  &__list {
    font-size: 0;
  }
  &__item {
    display: inline-block;
    margin-right: 8px;
    vertical-align: middle;
    &:last-child {
      margin-right: 0;
    }
    & a {
      display:inline-block;
      overflow: hidden;
      font-size:0;
    }
    & img {
      width: 229px;
      height: 229px;
    }
  }
}
</style>
