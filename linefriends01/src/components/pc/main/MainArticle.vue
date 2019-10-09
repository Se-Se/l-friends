<template>
  <article class="main-article">
    <header class="main-article__header">
      <h3 class="main-article__title" v-if="title">{{ title }}</h3>
      <p v-bind:class="{'main-article__subtitle' : true, 'main-article__lang' : lang}"
         v-if="subtitle">{{ subtitle }}</p>
      <div
        v-if="more"
        :class="{
          'main-article__more' : true,
          'main-article__more--bottom': bottom === true
        }"
      >
        <a :href="more">상품 더보기</a>
      </div>
    </header>
    <slot></slot>
  </article>
</template>
<script>
import LayoutWidth from '../layout/common/LayoutWidth'

export default {
  name: 'main-article',
  component: { LayoutWidth },
  props: {
    title: {
      type: String,
      required: false
    },
    subtitle: {
      type: String,
      required: false
    },
    more: {
      type: String,
      required: null
    },
    lang: {
      type: Boolean,
      required: false
    },
    bottom: {
      type: Boolean,
      required: false
    },
    to: {
      type: String,
      required: false
    }
  }
}
</script>
