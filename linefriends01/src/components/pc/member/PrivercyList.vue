<template>
  <div class="privercy-list">
    <ul class="privercy-list__content">
      <li class="privercy-list__item">
        <switch-item type="checkbox" :title="$t('member.join.terms.all')" name="allChk" :bold="true" :value="allState" @input="allCheck" />
      </li>
      <li class="privercy-list__item">
        <switch-item type="checkbox" :title="$t('member.join.terms.service')" name='service' :bold="true" v-model="agree.service" @change="useAgree" />
        <under-bar-button :data="privercyInfo" @childs-event="servicePrivercy('service')" />
      </li>
      <li class="privercy-list__item">
        <switch-item type="checkbox" :title="$t('member.join.terms.privercy')" name="privercy" :bold="true" v-model="agree.privercy" @change="useAgree" />
        <under-bar-button :data="privercyInfo" @childs-event="servicePrivercy('privercy')" />
      </li>
      <li class="privercy-list__item">
        <switch-item type="checkbox" :title="$t('member.join.terms.marketing')" name="marketing" value="marketing" :bold="true" v-model="agree.marketing" @change="useAgree" />
      </li>
      <li class="privercy-list__item">
        <switch-item type="checkbox" :title="$t('member.join.terms.age')" name="age" :bold="true" v-model="agree.age" @change="useAgree" />
      </li>
    </ul>
    <p v-show="privercyError" class="join-error">
      필수 항목을 체크해주세요.
    </p>
    <info-layer-popup :title="privercyInfo.subject" button="single" :bus="eventBus" type="">
      <div class="privercy-info">
        <p v-html="privercyInfo.content"></p>
      </div>
    </info-layer-popup>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import SwitchItem from '../assets/Switch'
import InfoLayerPopup from '../layout/common/InfoLayerPopup'
import UnderBarButton from '../assets/buttons/UnderBarButton'

export default {
  name: 'Privercy',
  components: {
    SwitchItem,
    InfoLayerPopup,
    UnderBarButton
  },
  props: ['privercyError'],
  data () {
    return {
      eventBus: new Vue(),
      checkAll: false,
      privercyInfo: {
        action: 'button',
        subject: '',
        title: this.$t('member.join.terms.view'),
        to: '',
        content: ''
      },
      agree: {
        'service': false,
        'privercy': false,
        'marketing': false,
        'age': false
      },
      error: false
    }
  },
  computed: {
    ...mapState('common', ['terms']),
    allState () {
      let state = true
      for (let agree in this.agree) {
        if (agree !== 'age' && this.agree[agree] === false) state = false
      }
      return state
    }
  },
  methods: {
    useAgree (target) {
      let name = target.target.name
      this.agree[name] = target.target.checked
    },
    servicePrivercy (type) {
      switch (type) {
        case 'service':
          this.privercyInfo.subject = this.$t('member.join.terms.title.service')
          this.privercyInfo.content = this.terms.use.contents
          break
        case 'privercy':
          this.privercyInfo.subject = this.$t('member.join.terms.title.privercy')
          this.privercyInfo.content = this.terms.pi_collection_and_use_required.contents
          break
      }
      this.eventBus.$emit('openPopup')
    },
    allCheck (target) {
      for (let agree in this.agree) {
        if (agree === 'age') {
          continue
        }
        this.agree[agree] = target
      }
    }
  },
  mounted () {
    this.$store.dispatch('common/fetchTerms', 'USE')
    this.$store.dispatch('common/fetchTerms', 'PI_COLLECTION_AND_USE_REQUIRED')
  }
}
</script>
