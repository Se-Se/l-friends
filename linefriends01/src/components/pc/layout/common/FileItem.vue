<template>
  <div class="file">
    <div class="file_content">
      <input
        type="file"
        :name="files.data"
        class="file-input"
        :id="files.data"
        :disabled="isDisable"
        @change="fileProceess($event)"/>
      <div class="file-list">
        <label :for="files.data"
              class="file-label">
          <span class="file__action">{{ files.choiceText }}</span>
        </label>
        <div class="file-thum" v-if="file.length !== 0">
          <figure
            v-for="(item, key) in file"
            :key="key"
            class="file-thum__fig"
          >
            <img :src="item.fileData"/>
          </figure>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Alert } from '@/utils/event-bus'

export default {
  name: 'file-item',
  data () {
    return {
      imageData: null,
      file: []
    }
  },
  props: {
    files: {
      type: Object,
      required: false
    },
    max: {
      type: [Number, Boolean],
      default: false
    },
    imgCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isDisable () {
      return this.max === false ? this.file.length > 0 : this.max <= this.file.length
    }
  },
  methods: {
    fileProceess (event) {
      if (this.isDisable) {
        return
      }
      const input = event.target

      if (typeof FileReader === 'undefined') {
        Alert({
          message: '브라우저가 이미지 업로드를 지원하지 않습니다. 브라우저를 업그레이드 해주세요.'
        })
        return false
      }

      const leng = input.files.length
      for (let i = 0; i < leng; i++) {
        if (input.files[i].size > 1048576) { // 1MB
          Alert({
            message: '각 사진은 최대 1MB까지 등록가능합니다.'
          })
          return false
        }

        if (input.files[i].type.split('image').length === 1) {
          Alert({
            message: '이미지 파일만 등록가능합니다.'
          })
          return false
        }
      }

      if (leng + input.files.length > 10) {
        Alert({
          message: '첨부파일은 10개까지만 등록 가능합니다.'
        })
        return false
      }

      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.file.push({
            fileData: e.target.result
          })
          this.$emit('addImageCount', null)
        }
        reader.readAsDataURL(input.files[0])
      }
    }
  },
  watch: {
    imgCount (newValue, oldValue) {
      if (this.imgCount === 0) {
        this.file = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.file {
  &__content {
    font-size: 0;
  }
  &-input {
    display: none;
    opacity: 0;
  }
  &-label {
    display: inline-block;
    width: 222px;
    height: 40px;
  }
  &__action {
    display: inline-block;
    width: 100%;
    height: 100%;
    font-family: 'Noto Sans KR';
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    letter-spacing: -0.1px;
    border: 1px solid #dddddd;
    border-radius: 4px;
    color: #333333;
    line-height: 2.7;
    cursor: pointer;
  }
  &-thum {
    margin-top: 20px;
    &__fig {
      width: 100px;
      height: 100px;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
