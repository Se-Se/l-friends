<template>
  <main-article
    :title="$t('article.instagram.title')"
    :subtitle="$t('article.instagram.subtitle')"
    :padding-top="2.4"
    :padding-bottom="3.3"
  >
    <vue-instagram token="2660806299.29a42cc.3ce96b5dfff74cd99c517b87fcf99c46" :count="12" class="insta__list">
      <template slot="feeds" slot-scope="props">
        <div class="insta__item"><a :href="props.feed.link" target="_blank" class="insta__link"><img :src="props.feed.images.standard_resolution.url" class="insta__img"></a></div>
      </template>
    </vue-instagram>
  </main-article>
</template>

<style lang="scss" scoped>
.main-article { padding-bottom: 3rem; }
</style>

<script>
import MainArticle from './MainArticle'
import ImageGrid from '../common/ImageGrid'

export default {
  name: 'InstaList',
  components: {
    MainArticle,
    ImageGrid
  }
}
</script>

<style lang="scss" scoped>
.insta {
  &__list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 0.8rem;
  }

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10.6rem;
    height: 10.6rem;
    overflow: hidden;
    position: relative;
  }

  &__link{
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  &__img{
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
</style>
