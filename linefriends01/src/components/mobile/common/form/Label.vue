<template>
  <label
    :for="target"
    :class="['input-label', required ? 'require' : '', size]"
  >
    <slot />
  </label>
</template>

<script>
export default {
  name: 'Label',
  props: {
    target: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    }
  }
}
</script>

<style lang="scss" scoped>
.input-label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: 1.2rem;
  font-family: 'Noto Sans KR';
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.01rem;
  color: #333;

  &.normal {
    font-size: 1.4rem;
    line-height: 1.43;
  }

  &.require::after {
    content: '';
    display: inline-block;
    vertical-align: top;
    margin-left: 0.233rem;
    margin-top: 0.4rem;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 0.2rem;
    background: #00d664;
  }
}
</style>
