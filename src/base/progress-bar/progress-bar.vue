<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" @touchstart.prevent="touchstart" @touchmove.prevent="touchmove" @touchend="touchend">
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      per: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      _triggerPercent() {
        const allWidth = this.$refs.progressBar.clientWidth - 16
        const per = this.$refs.progress.clientWidth / allWidth
        this.$emit('percentChange', per)
      },
      _setOffset(progressWidth) {
        this.$refs.progress.style.width = `${progressWidth}px`
        this.$refs.progressBtn.style.transform = `translate3d(${progressWidth}px, 0, 0)`
      },
      touchstart(e) {
        console.log(e.touches[0].pageX)
        this.touch.flag = true
        this.touch.initX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      touchmove(e) {
        if (!this.touch.flag) {
          return
        }
        const runX = e.touches[0].pageX
        const moveX = runX - this.touch.initX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - 16, Math.max(0, this.touch.left + moveX))
        this._setOffset(offsetWidth)
      },
      touchend() {
        this.touch.flag = false
        this._triggerPercent()
      }
//      progressClick(e) {
//        const rect = this.$refs.progressBar.getBoundingClientRect()
//        const offsetWidth = e.pageX - rect.left
//        this._offset(offsetWidth)
//        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
//        // this._offset(e.offsetX)
//        this._triggerPercent()
//      },

    },
    watch: {
      per(newPercent) {
        if (this.per >= 0 && !this.touch.flag) {
          let allWidth = this.$refs.progressBar.clientWidth
          let progressWidth = (allWidth - 16) * newPercent
          this._setOffset(progressWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
