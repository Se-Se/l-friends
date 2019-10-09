<template>
  <section>
    <!-- <div class="popup_wrap" :style="{ display: visible ? 'block' : 'none' }">
      <div class="popup_common" :class="popup_size_class">
        <slot name="title"></slot>
        <slot v-if="no_area_contents"></slot>
        <div class="area_contents" :class="[area_class]" v-else>
          <slot></slot>
        </div>
        <button type="button" class="btn_close" slot="button" @click="close">close</button>
      </div>
    </div> -->
    <div class="layer-popup" :style="{ display: visible ? 'block' : 'none' }">
      <div
      class="layer-popup__dim"
      ></div>
      <div class="layer-popup__content">
        <header class="layer-popup__header">
          <h2 class="layer-popup__header--title 2">
            <slot name="title"></slot>
          </h2>
          <button
            class="layer-popup__header--btn"
            @click="close()"
          >
            닫기
          </button>
        </header>
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import $ from 'jquery'
import { Confirm } from '@/utils/event-bus'

function initView (show) {
  if (show) {
    $('#container').css('z-index', 'auto')
    // document.getElementsByTagName('body')[0].classList.add('no_scroll')
  }
}

function changeView (show) {
  // let bodyElm = document.getElementsByTagName('body')[0]
  if (show) {
    // bodyElm.classList.add('no_scroll')
    if (getLayerCount() >= 1) {
      this.backLayerColor = 'rgba(0,0,0,.0)'
      this.layIndex = 40 + getLayerCount()
    }
    $('#container').css('z-index', 'auto')
  } else {
    if (getLayerCount() === 0) {
      // bodyElm.classList.remove('no_scroll')
      $('#container').css('z-index', 1)
    }
    // $('#container').css('z-index', 1)
  }
}

function getLayerCount () {
  return document.querySelectorAll(".popup_wrap[style*='display: block']").length
}

export default {
  data () {
    return {
      backLayerColor: 'auto',
      layerIndex: 40
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    layer_class: {
      type: String,
      default: ''
    },
    popup_size_class: {
      type: String,
      default: ''
    },
    area_class: {
      type: String,
      default: ''
    },
    close_confirm_msg: {
      type: String,
      default: ''
    },
    popup_name: {
      type: String,
      default: ''
    },
    no_area_contents: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    close () {
      if (this.popup_name === 'inquiry') {
        this.$emit('closeInquiryPopup')
      } else if (this.popup_name === 'orderClaimReturnAddress') {
        this.$emit('closeOrderClaimReturnAddressPopup')
      } else if (this.popup_name === 'orderAddreviewPopupName') {
        this.$emit('closeOrderAddReviewPopup')
      } else if (this.popup_name === 'orderClaimDetailPopupName') {
        this.$emit('closeOrderClaimDetailPopup')
      } else if (this.popup_name === 'orderClaimDetailNonMemberPopupName') {
        this.$emit('closeOrderClaimDetailNonMemberPopup')
      } else if (this.popup_name === 'guestPasswordPopupName') {
        this.$emit('closeGuestPasswordPopup')
      } else if (this.popup_name === 'orderDetailAddressPopupName') {
        this.$emit('closeOrderDetailAddressPopup')
      } else if (this.popup_name === 'addressModified') {
        this.$emit('closeAddressesPopup')
      } else {
        if (this.close_confirm_msg) {
          // if (!confirm(this.close_confirm_msg)) {
          //   return
          // }
          Confirm({
            message: this.close_confirm_msg,
            onCancel: () => {
              return true
            }
          })
        }
        changeView.call(this, false)
        this.$emit('close')
        this.$emit('update:visible', false)
      }
    }
  },
  watch: {
    visible (show) {
      changeView.call(this, show)
    }
  },
  mounted () {
    initView(this.visible)
  }
}
</script>
