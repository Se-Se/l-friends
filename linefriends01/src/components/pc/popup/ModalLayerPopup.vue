<template>
  <div class="layer_popup fixed" :style="{ display: visible ? 'block' : 'none', 'background-color': backLayerColor }">
    <div class="layer_inner" :style="{ 'z-index': layerIndex }">
      <div class="layer_contents" :class="[layer_class]" >
        <div class="bx_tit">
          <slot name="title"></slot>
        </div>
        <div class="area_contents" :class="[area_class]">
          <slot></slot>
        </div>
        <div>
          <button type="button" class="btn_close" slot="button" @click="close"><span class="sp">닫기</span></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Confirm } from '@/utils/event-bus'

  function initView (show) {
    if (show) {
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
    } else {
      if (getLayerCount() === 1) {
        // bodyElm.classList.remove('no_scroll')
      }
    }
  }

  function getLayerCount () {
    return document.querySelectorAll(".layer_popup[style*='display: block']").length
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
        } else {
          if (this.close_confirm_msg) {
            Confirm({
              message: this.close_confirm_msg,
              onCancel: () => {
                return true
              }
            })
            // if (!confirm(this.close_confirm_msg)) {
            //   return
            // }
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
