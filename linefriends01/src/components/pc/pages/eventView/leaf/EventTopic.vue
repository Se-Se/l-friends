<template>
  <div class="area_event_topic">
    <div class="back_capture" @click="closeOtherEventPopup" v-if="otherEventPopup"></div>
    <div class="inner">
      <h3 class="blind">이벤트 및 프로모션 알림</h3>
      <strong class="tit_topic">{{ event.label }}</strong>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        otherEventPopup: false
      }
    },
    computed: {
      ...mapState('event', ['event', 'otherEvent'])
    },
    methods: {
      eventChange (eventNo) {
        this.closeOtherEventPopup()
        this.$router.push(`/event/${eventNo}`)
      },
      closeOtherEventPopup () {
        this.otherEventPopup = false
      }
    }
  }
</script>

<style scoped>
  .back_capture {
    overflow: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20px;
    background-color: rgba(0,0,0,0);
    text-align: center;
  }
</style>
