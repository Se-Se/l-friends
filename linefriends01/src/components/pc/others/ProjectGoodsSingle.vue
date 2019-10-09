<template>
  <article class="project-goods__single">
    <figure class="project-item__fig">
      <img
        :src="item.thumbnail"
        :alt="item.name"
        :title="item.name"
      >
    </figure>
    <div class="project-item--info">
      <p
        v-if="item.subname"
        class="project-item--info__subname"
      >
        {{ item.subname }}
      </p>
      <h2 class="project-item--info__name">
        {{ item.name }}
      </h2>
      <div class="project-item--info__price-wrap">
        <p
          v-if="item.sale"
          class="project-item--info__sale"
        >
          {{ item.sale }}%
        </p>
        <p
          v-if="item.price"
          class="project-item--info__origin"
        >
          <strong class="project-item--info__origin--price">{{ originalPrice }}</strong>
          <span class="project-item--info__origin--symbol">원</span>
        </p>
        <p
          v-if="item.sale"
          class="project-item--info__saleprice"
        >
          {{ salePrice }}
        </p>
      </div>
      <div class="project-item--info__tags">
        <div
          v-if="item.coupon"
          class="project-item--info__tags__item coupon"
        >
          <p>{{ item.coupon }}% 쿠폰</p>
        </div>
        <div
          v-if="item.reserve"
          class="project-item--info__tags__item reserve"
        >
          <p>예약상품</p>
        </div>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  name: 'ProjectGoodsSingle',
  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  computed: {
    sale () {
      return this.item.sale * 0.01
    },
    salePrice () {
      return (this.item.sale
        ? this.item.price - Math.ceil(this.item.price * this.sale)
        : this.item.price
      ).toLocaleString()
    },
    originalPrice () {
      return this.item.price.toLocaleString()
    }
  }
}
</script>
