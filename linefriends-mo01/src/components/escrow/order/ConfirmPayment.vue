<template>
    <transition>
        <div class="popup-layer" style="display: block;background: #fff;overflow: scroll;">
            <div class="wrap_category">
                <h2>利用規約</h2>
                <div class="category_right">
                    <a href="#" class="btn_close" @click="closeCouponPopup">Close</a>
                </div>
            </div>
            <div class="main-popup">
                <div class="popup-text popup-text-terms">
                    <dl>
                        <dt></dt>
                        <dd></dd>
                        <dt class="mt-17"></dt>
                        <dd></dd>
                    </dl>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>

export default {
  methods: {
    closeCouponPopup () {
      this.$emit('close')
    }
  }
}
</script>
