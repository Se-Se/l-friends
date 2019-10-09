<template>
  <!-- <div>
    <span class="star-cb-group">
      <input type="radio" id="rating-5" name="rating" value="5" />
      <label for="rating-5">5</label>
      <input type="radio" id="rating-4" name="rating" value="4" checked="checked" />
      <label for="rating-4">4</label>
      <input type="radio" id="rating-3" name="rating" value="3" />
      <label for="rating-3">3</label>
      <input type="radio" id="rating-2" name="rating" value="2" />
      <label for="rating-2">2</label>
      <input type="radio" id="rating-1" name="rating" value="1" />
      <label for="rating-1">1</label>
      <input type="radio" id="rating-0" name="rating" value="0" class="star-cb-clear" />
      <label for="rating-0">0</label>
    </span>
  </div> -->
  <div class="detail-default__item-rating review-rating">
    <span
      v-for="i in length"
      :key="i"
      :class="{ 'review-rating__item': true, '_active': active >= i }"
    >score</span>
  </div>
</template>
<script>
export default {
  name: 'star-rating',
  props: {
    length: {
      type: Number,
      default: 5
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      active: this.value
    }
  }
}
</script>
<style lang="scss" scoped>
$unchecked-star: '\2605';
$unchecked-color: #ededed;
$checked-star: '\2605';
$checked-color: #00d664;

.star-cb-group {
  font-size: 0;
  unicode-bidi: bidi-override;
  direction: rtl;
  & > input {
    display: none;
    & + label {
      display: inline-block;
      overflow: hidden;
      font-size: 20px;
      text-indent: 9999px;
      width: 25px;
      white-space: nowrap;
      cursor: pointer;
      &:before {
        display: inline-block;
        text-indent: -9999px;
        content: $unchecked-star;
        color: $unchecked-color;
      }
    }
    &:checked ~ label:before,
      & + label:hover ~ label:before,
      & + label:hover:before {
      content: $checked-star;
      color: #00d664;
      }
  }
  & > .star-cb-clear + label {
    text-indent: -9999px;
    width: .5em;
    margin-left: -.5em;
  }
  & > .star-cb-clear + label:before {
    width: .5em;
  }

  &:hover > input + label:before {
    content: $unchecked-star;
    color: $unchecked-color;
    text-shadow: none;
  }
  &:hover > input + label:hover ~ label:before,
  &:hover > input + label:hover:before {
    content: $checked-star;
    color: $checked-color;
  }
}
</style>
