<template>
  <section class="detail-review">
    <div class="detail-review__nodata">
      <figure class="detail-review__nodata-fig">
        <img class="detail-review__nodata__img" src="~@/assets/images/pc/icons/ic-nodata-480x280.jpg" />
      </figure>
      <p class="detail-review__nodata-fcp">
        {{ title }}
      </p>
    </div>
  </section>
</template>
<script>

export default {
  name: 'DetailNoData',
  props: {
    title: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      form: {
        ok: {
          action: 'button',
          to: '',
          title: this.$t('button.goHome'),
          type: 'free',
          size: 360
        }
      }
    }
  }
}
</script>
