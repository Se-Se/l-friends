<template>
  <div
    :class="[
      'app-input__wrapper',
      readonly || !showInput ? 'readonly' : '',
      focus ? 'focus' : '',
      error !== '' ? 'error' : ''
    ]"
  >
    <div :class="['app-input', size]">
      <input
        v-if="showInput"
        v-model="content"
        class="app-input__text"
        :type="type"
        :placeholder="placeholder"
        :readonly="readonly"
        :maxlength="max"
        @input="onChange"
        @focus="focusAction"
        @blur="blurAction"
        @keyup="keyupAction"
        @keydown="keydownAction"
      >
      <p
        v-else
        class="app-input__text"
      >
        <template v-if="selected">
          {{ selected }}
        </template>
        <template v-else>
          선택해주세요.
        </template>
      </p>
    </div>
    <div
      v-if="(max > 0 || select || hint) && !noHint"
      class="app-input-info"
    >
      <span
        v-if="hint"
        class="app-input-hint"
      >
        {{ hint }}
      </span>
      <span
        v-if="max > 0 && showInput"
        class="app-input-length"
      >
        <strong class="app-input-length__current">{{ content.length.toLocaleString() }}</strong>/{{ max.toLocaleString() }}
      </span>
      <select
        v-if="select"
        ref="selectBox"
        v-model="selected"
        @change="setSelected"
        class="app-input-select"
      >
        <option :value="null">
          선택해주세요.
        </option>
        <option value="직접입력">
          직접입력
        </option>
        <option
          v-for="(text, key) in select"
          :key="key"
          :value="text"
        >
          {{ text }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { validateNumber } from '@/utils/validateUtils'
export default {
  name: 'Textarea',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'normal'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    blur: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: null
    },
    select: {
      type: Array,
      default: null
    },
    hint: {
      type: String,
      default: null
    },
    value: {
      default: ''
    },
    noHint: {
      type: Boolean,
      default: false
    },
    filter: {
      type: String
    },
    error: {
      type: String,
      default: ''
    },
    checktype: {
      type: String,
      default: 'text'
    }
  },
  data () {
    return {
      content: this.value,
      selected: '',
      focus: false
    }
  },
  computed: {
    showInput () {
      return this.select === null || ['직접입력'].includes(this.selected)
    }
  },
  watch: {
    value (set) {
      this.content = set
      if (this.select) {
        if (this.select.includes(set) || set === null) {
          this.selected = set
        } else {
          this.selected = '직접입력'
        }
      }
    }
  },
  methods: {
    onChange () {
      if (this.checktype === 'email') {
        this.content = this.content.replace(/[^A-Za-z0-9~\-.!@#$%^&*()_+']/g, '')
      }
      this.$emit('input', this.content)
    },
    setSelected () {
      this.content = this.selected === '직접입력' ? '' : this.selected
      this.onChange()
    },
    blurAction (event) {
      this.focus = false
      if (this.type === 'number') {
        validateNumber(event)
      }
      this.$emit('blur')
    },
    keyupAction (event) {
      if (this.type === 'number') {
        validateNumber(event)
      }
      this.$emit('keyup')
    },
    keydownAction (event) {
      if (this.type === 'number') {
        validateNumber(event, this.max)
      }
      this.$emit('keydown')
    },
    focusAction () {
      this.focus = true
      this.$emit('focus')
    }
  }
}
</script>

<style lang="scss" scoped>
input[type="password"] {
  // font-size: 0.6rem;
  letter-spacing: 0.8rem;
}

.app-input {
  flex: 1 1 auto;

  &__text {
    width: 100%;
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    color: #333;
    letter-spacing: -0.1rem;
    line-height: normal;

    &::placeholder, &::-webkit-input-placeholder {
      letter-spacing: -0.1rem;
      color: rgba(51, 51, 51, 0.4);
    }

    &:read-only {
      background-color: #fafafa;
    }
  }

  &.small &__text {
    padding: 0 1.6rem;
    height: 3.8rem;
  }

  &.middle &__text{
    padding: 0 1.6rem;
    height: 4.2rem;
  }

  &.normal &__text {
    padding: 1.3rem 1.6rem;
  }

  &.large &__text {
    padding: 1.5rem 1.9rem;
    height: 5rem;
  }

  &__wrapper {
    width:100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 0.4rem;

    &.error {
      border-color: #FF5A5F;
    }

    &.focus {
      border-color: #999;
    }

    &.readonly {
      border-color: #ededed;
      background: #fafafa;
    }
  }

  &-info {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    padding-right: 1.5rem;
  }

  &-length {
    height: 2rem;
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    line-height: 1.43;
    font-weight: normal;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &-select {
    margin-left: 1.1rem;
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background-size: 100% 100%;
    background-image: url(~@/assets/images/mobile/ic-small-down.svg);
    font-size: 0;
    border: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  &-hint {
    padding-right: 0.566rem;
    font-family: 'Noto Sans KR';
    font-size: 1.2rem;
    font-weight: normal;
    letter-spacing: -0.01rem;
    color: #666;
  }
}
</style>
