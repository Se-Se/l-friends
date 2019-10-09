<template>
  <section class="bread-crumbs">
    <p class="bread-crumbs__item">
      <router-link to="/">{{ $t('page.home')}}</router-link>
    </p>
    <template v-for="(navi, number) in findLocation">
      <h1 class="bread-crumbs__title" v-if="(findLocation.length - 1) === number">
        <template v-if="navi.link">
          <router-link :to="navi.link">{{ navi.value }}</router-link>
        </template>
        <template v-else>{{ navi.value }}</template>
      </h1>
      <p class="bread-crumbs__item" v-else>
        <template v-if="navi.link">
          <router-link :to="navi.link">{{ navi.value }}</router-link>
        </template>
        <template v-else>{{ navi.value }}</template>
      </p>
    </template>
    <!-- bread-crumbs__title -->
  </section>
</template>
<script>
  export default {
    name: 'bread-crumbs',
    props: {
      basic: {},
      active: {}
    },
    computed: {
      findLocation () {
        if (this.$route.meta.breadCrumbs) {
          return [{
            value: this.$route.meta.breadCrumbs
          }]
        } else {
          if (Array.isArray(this.active)) {
            return this.active.filter((item) => item.value !== 'undefined')
          } else {
            return [{
              value: this.active
            }]
          }
        }
      }
    }
  }
</script>
