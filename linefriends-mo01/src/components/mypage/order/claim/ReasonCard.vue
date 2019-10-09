<template>
  <div class="settlement_information">
    <div class="settlement_information_ttl">
      <p class="ttl">キャンセルの理由</p>
    </div>
    <div class="return_reason">
      <dl>
        <dt>理由</dt>
        <dd>
          <vue-select-box :showValue="claimReasonType" :items="typeList" @selected="selectType" />
          <!-- <p class="notices">返送料はお客様ご負担となります。</p> -->
        </dd>
        <dt>内容</dt>
        <dd>
          <textarea class="reason_area" v-model="claimReasonDetail" placeholder="詳しい理由を入力してください。" maxlength="160"></textarea>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import VueSelectBox from '@/components/common/VueSelectBox'

export default {
  props: ['claimOrderOption', 'options', 'type'],
  data: function () {
    return {
      claimReasonType: 'default',
      claimReasonDetail: ''
    }
  },
  computed: {
    typeList () {
      let list = [{
        label: '選択してください',
        value: 'default'
      }]
      if (this.claimOrderOption && this.claimOrderOption.claimReasonTypes && this.claimOrderOption.claimReasonTypes.length) {
        this.claimOrderOption.claimReasonTypes.forEach(option => {
          if (!(this.type === 'return' && option.claimReasonType === 'CHANGE_MIND')) {
            list.push({
              label: option.label,
              value: option.claimReasonType
            })
          }
        })
      }
      return list
    },
    reasonInfo () {
      return {
        claimReasonType: this.claimReasonType,
        claimReasonDetail: this.claimReasonDetail
      }
    }
  },
  methods: {
    selectType (value) {
      this.claimReasonType = value
      this.$nextTick(() => {
        this.$emit('estimate')
      })
    },
    checkReason () {
      if (this.claimReasonType === 'default') {
        return '理由を選択してください。'
      } else {
        return ''
      }
    }
  },
  components: {
    VueSelectBox
  }
}
</script>
