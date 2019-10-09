<template>
  <div class="heart-check-box">
    <input
      :id="label"
      class="heart-check-box__input"
      type="checkbox"
    >
    <label
      :for="label"
      class="heart-check-box__label"
    >
      <span
        :class="{
          'heart-check-box__label-wish': true,
          '__bigger': type === 'bigger'
        }"
        :style="{ width: width + 'px' }"
      >{{ $t('assets.wish') }}</span>
    </label>
  </div>
</template>
<script>

export default {
  name: 'HeartCheckBox',
  props: {
    type: {
      type: String,
      required: false
    },
    width: {
      type: Number,
      required: false
    },
    label: {
      type: String,
      required: false
    }
  }
}
</script>
