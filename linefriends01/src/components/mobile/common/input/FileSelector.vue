<template>
  <div class="file-selector">
    <input
      ref="file"
      type="file"
      :disabled="loading || isDisable"
      @change="addFile"
    >
    <label>
      <app-button
        class="file-select-btn"
        size="middle-small"
        @click="$refs.file.click()"
      >
        파일선택
      </app-button>
    </label>
    <ul
      v-if="!thumb && file.length > 0"
      class="selected-files-text"
    >
      <li
        v-for="(item, key) in file"
        :key="key"
        class="selected-files-text__item"
      >
        {{ item.original.name }}
        <a
          href="#"
          @click.prevent="removeFile(key)"
        >close</a>
      </li>
    </ul>
    <ul
      v-if="thumb && file.length > 0"
      class="selected-files-thumb"
    >
      <li
        v-for="(item, key) in file"
        :key="key"
        class="selected-files-thumb__item"
        :style="{ backgroundImage: 'url(' + item.url + ')' }"
      >
        {{ item.original.name }}
        <a
          href="#"
          @click.prevent="removeFile(key)"
        >close</a>
      </li>
    </ul>
    <information
      v-if="max !== false"
      size="small"
      class="information"
    >
      사진은 최대 10장까지 등록 가능합니다.
    </information>
  </div>
</template>

<script>
import AppButton from '@/components/mobile/common/button/Button'
import Information from '@/components/mobile/common/Information'
import { Alert } from '@/utils/event-bus'

export default {
  name: 'FileSelector',
  components: {
    AppButton,
    Information
  },
  props: {
    max: {
      type: [Number, Boolean],
      default: false
    },
    thumb: {
      type: Boolean,
      default: false
    },
    imgCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      file: [],
      loading: false
    }
  },
  computed: {
    isDisable () {
      return this.max !== false && this.max <= this.file.length
    }
  },
  watch: {
    file (next) {
      this.$emit('input', next)
    },
    imgCount (newValue, oldValue) {
      if (this.imgCount === 0) {
        this.file = []
      }
    }
  },
  methods: {
    addFile () {
      if (this.isDisable) {
        return
      }
      /*
        if (leng + this.images.length > 10) {
          Alert({
            message: '첨부파일은 10개까지만 등록 가능합니다.'
          })
          return false
        }
       */
      const file = this.$refs.file.files[0]
      this.loading = true

      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = e => {
        this.$refs.file.value = null

        if (this.max === false) {
          this.file = []
        }
        let files = file
        if (files.size > 1048576) { // 1MB
          Alert({
            message: '각 사진은 최대 1MB까지 등록가능합니다.'
          })
          this.loading = false
          return false
        }

        if (files.type.split('image').length === 1) {
          Alert({
            message: '이미지 파일만 등록가능합니다.'
          })
          this.loading = false
          return false
        }

        this.file.push({
          url: e.target.result,
          original: file
        })
        this.$emit('addImageCount', null)
        this.loading = false
      }
    },
    removeFile (key) {
      this.file.splice(key, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
input[type=file] {
  display: none;
}

.information {
  margin-top: 1.2rem;

  /deep/ &-message {
    font-size: 1.2rem;
    color: #666;
  }
}

.file-select-btn {
  display: inline-block;
  width: 13.6rem;
}

.selected-files-text {
  margin-top: 1.3rem;

  &__item {
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;

    a {
      display: inline-block;
      vertical-align: top;
      margin-top: 0.8rem;
      margin-left: 0.766rem;
      width: 0.7rem;
      height: 0.7rem;
      font-size: 0;
      background-size: 100% 100%;
      background-image: url(~@/assets/images/mobile/small-close.svg);
    }
  }
}

.selected-files-thumb {
  margin-top: 2rem;
  display: grid;
  grid-gap: 0.7rem 0.7rem;
  grid-template-columns: repeat(auto-fit, 6rem);

  &__item {
    font-size: 0;
    height: 6rem;
    background-size: cover;
    background-position: center center;
    border: 1px solid #ededed;
    text-align: right;

    a {
      display: inline-block;
      vertical-align: top;
      width: 1.7rem;
      height: 1.7rem;
      margin: -0.01rem -0.01rem 0 0;
      font-size: 0;
      background-size: 100% 100%;
      background-image: url(~@/assets/images/mobile/background-close.svg);
    }
  }
}
</style>
