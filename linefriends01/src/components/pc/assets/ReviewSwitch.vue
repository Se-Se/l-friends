<template>
  <div class="review-switch">
    <input
      :id="data.title"
      type="radio"
      :name="data.name"
      class="review-switch__input"
    >
    <label
      :for="data.title"
      class="review-switch__label"
    >
      <span class="review-switch__label-title">{{ data.title }}</span>
    </label>
  </div>
</template>
<script>
export default {
  name: 'ReviewSwitch',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>
