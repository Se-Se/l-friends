import throttle from 'throttleit'

function inViewport (element, { offsetTop = 0, threshold = 0 } = {}) {
  const {
    top,
    right,
    bottom,
    left,
    width,
    height
  } = element.getBoundingClientRect()

  const intersection = {
    t: bottom,
    r: window.innerWidth - left,
    b: window.innerHeight - top,
    l: right
  }

  const elementThreshold = {
    x: threshold * width,
    y: threshold * height
  }
  return (
    intersection.t >= (0 + elementThreshold.y) &&
    intersection.r >= (0 + elementThreshold.x) &&
    intersection.b >= (offsetTop + elementThreshold.y) &&
    intersection.l >= (0 + elementThreshold.x)
  )
}

const triggers = ['scroll', 'resize']

const MugenScroll = {
  name: 'mugen-scroll',
  props: {
    handler: {
      type: Function,
      required: true
    },
    shouldHandle: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0
    },
    handleOnMount: {
      type: Boolean,
      default: true
    },
    scrollContainer: {
      type: String
    },
    offsetTop: {
      type: Number
    }
  },
  mounted () {
    this.checkInView()
  },
  methods: {
    checkInView () {
      const execute = () => {
        const inView = inViewport(this.$refs.scroll, {
          threshold: this.threshold,
          offsetTop: this.offsetTop
        })
        if (this.shouldHandle && inView) {
          this.handler()
        }
      }

      // checkInView right after this component is mounted
      if (this.handleOnMount) {
        execute()
      }

      if (this.scrollContainer) {
        let parent = this
        while ((parent = parent.$parent) && !this._scrollContainer) {
          this._scrollContainer = parent.$refs[this.scrollContainer]
        }
        // Ensure it's html element (ref could be component)
        if (this._scrollContainer && this._scrollContainer.$el) {
          this._scrollContainer = this._scrollContainer.$el
        }
      }

      this._scrollContainer = this._scrollContainer || window

      // Add event listeners
      this.check = throttle(execute, 200)
      triggers.forEach(event => this._scrollContainer.addEventListener(event, this.check))
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'mugen-scroll',
      ref: 'scroll'
    }, this.$slots.default)
  },
  beforeDestroy () {
    triggers.forEach(event => this._scrollContainer.removeEventListener(event, this.check))
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(MugenScroll.name, MugenScroll)
}

export default MugenScroll
