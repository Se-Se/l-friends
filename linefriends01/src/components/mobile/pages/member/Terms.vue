<template>
  <div>
    <sub-page-header :title="$t('member.join.terms.subject')" />
    <div id="container">
      <div class="terms-box">
        <div class="terms-check-all">
          <app-checkbox
            :value="allstatus"
            @change="allcheck"
            size="large"
          >
            <span class="terms-label">{{ $t('member.join.terms.all') }}</span>
          </app-checkbox>
        </div>
        <ul class="terms-list">
          <li
            v-for="(term, index) in terms"
            :key="index"
            class="terms-list__item"
          >
            <app-checkbox
              v-model="agree[term.type]"
              :id="'Checkbox___' + Math.floor(Math.random() * 100000)"
              size="large"
            >
              <span class="terms-label">{{ term.name }}</span>
            </app-checkbox>
            <a
              v-if="term.full"
              class="terms-full"
              @click.prevent.stop="viewTerm(term.type)"
            >{{ $t('member.join.terms.view') }}</a>
          </li>
        </ul>
      </div>

      <div
        v-if="error"
        class="terms-error"
      >
        {{ error }}
      </div>
    </div>
    <bottom-fixed>
      <app-button
        type="success"
        @click="submit"
        bold
      >
        {{ $t('button.continue') }}
      </app-button>
    </bottom-fixed>
  </div>
</template>

<script>
import Vue from 'vue'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'
import AppButton from '@/components/mobile/common/button/Button'
import BottomFixed from '@/components/mobile/common/BottomFixed'

export default {
  name: 'Terms',
  components: {
    SubPageHeader,
    AppCheckbox,
    AppButton,
    BottomFixed
  },
  data () {
    return {
      allstatus: false,
      terms: [
        {
          name: this.$t('member.join.terms.service'),
          required: true,
          full: true,
          type: 'service'
        },
        {
          name: this.$t('member.join.terms.privercy'),
          required: true,
          full: true,
          type: 'privercy'
        },
        {
          name: this.$t('member.join.terms.marketing'),
          required: false,
          type: 'marketing'
        },
        {
          name: this.$t('member.join.terms.age'),
          required: true,
          type: 'age'
        }
      ],
      agree: {
        service: false,
        privercy: false,
        marketing: false,
        age: false
      },
      error: false
    }
  },
  watch: {
    agree: {
      deep: true,
      handler () {
        let state = true
        for (let agree in this.agree) {
          if (agree !== 'age' && this.agree[agree] === false) {
            state = false
          }
        }
        this.allstatus = state
      }
    }
  },
  methods: {
    allcheck (value) {
      for (let agree in this.agree) {
        if (agree === 'age') {
          continue
        }
        Vue.set(this.agree, agree, value)
      }
    },
    submit () {
      let error = false
      for (const key in this.terms) {
        const term = this.terms[key]
        if (this.agree[term.type] === false && term.required === true) {
          error = '필수 항목을 체크해주세요.'
        }
      }
      this.error = error
      if (Object.keys(this.error).length === 0) {
        this.$router.push({ path: '/member/join?marketing=' + this.agree.marketing })
      }
    },
    viewTerm (type) {
      this.$router.push({ path: '/member/join/terms/' + type })
    }
  },
  mounted () {
    this.$store.dispatch('common/fetchTerms', 'USE')
    this.$store.dispatch('common/fetchTerms', 'PI_COLLECTION_AND_USE_REQUIRED')
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 2rem 2rem 0;
}

.terms {
  &-box {
    padding: 2.6rem 2.8rem 2.7rem;
    background: #fafafa;
  }

  &-label {
    display: inline-block;
    margin-top: 0.2rem;
    margin-left: 0.8rem;
    font-size: 1.4rem;
    font-family: 'Noto Sans KR';
    font-weight: 500;
    color: #333;
    letter-spacing: -0.01rem;
    line-height: 1.5;
  }

  &-check-all {
    padding-bottom: 1.9rem;
    margin-bottom: 1.8rem;
    border-bottom: 1px solid #eee;
  }

  &-full {
    display: inline-block;
    margin-top: 0.3rem;
    font-size: 1.2rem;
    font-family: 'Noto Sans KR';
    font-weight: 500;
    line-height: 1.75;
    letter-spacing: -0.01rem;
    color: #4ba4d9;
    text-decoration: underline;
  }

  &-list__item {
    display: flex;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 1.3rem;
    }

    &:last-child {
      padding-top: 1.9rem;
      margin-top: 1.8rem;
      border-top: 1px solid #eee;
    }
  }

  &-error {
    margin-top: 0.8rem;
    font-family: 'Noto Sans KR';
    font-weight: 500;
    color: #ff414e;
    line-height: 1.5;
    letter-spacing: -0.01rem;
  }
}
</style>
