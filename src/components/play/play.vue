<template>
<div class="player"  v-show="playList.length>0">
<transition name="normal">
  <div class="normal-player" v-show="Fullscreen" >
    <div class="background">
      <img :src="currenSong.image" alt="" width="100%" height="100%">
    </div>
    <div class="top">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="currenSong.name"></h1>
      <h2 class="subtitle" v-html="currenSong.singer"></h2>
    </div>
    <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
      <div class="middle-l" ref="middleL">
        <div class="cd-wrapper">
          <div class="cd" :class="cdCls">
            <img :src="currenSong.image" class="image">
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>
      </div>
      <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
        <div class="lyric-wrapper">
          <div v-if="currentLyric">
            <p :class="{current:index === currentLine}" v-for="(line, index) in currentLyric.lines" class="text" ref="lyricLine">{{line.txt}}</p>
          </div>
        </div>
      </scroll>
    </div>
    <div class="bottom">
      <div class="dot-wrapper">
        <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
        <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
      </div>
      <div class="progress-wrapper">
        <span class="time time-l">{{normalTime(currentTime)}}</span>
        <div class="progress-bar-wrapper">
          <Progress @percentChange="percentChange" :currentIndex="currentIndex" :per="per"></Progress>
        </div>
        <span class="time time-r">{{normalTime(currenSong.duration)}}</span>
      </div>
      <div class="operators">
        <div class="icon i-left" @click="changeMode">
          <i :class="iconModeState"></i>
        </div>
        <div class="icon i-left" >
          <i class="icon-prev" @click="beforeSong"></i>
        </div>
        <div class="icon i-center"  @click="changePlaying">
          <i :class="playState"></i>
        </div>
        <div class="icon i-right" @click="nextSong">
          <i  class="icon-next"></i>
        </div>
        <div class="icon i-right">
          <i  class="icon icon-not-favorite"></i>
        </div>
      </div>
    </div>
  </div>
</transition>
<transition name="mini">
  <div class="mini-player" @click="Full" v-show="!Fullscreen" >
    <div class="icon">
      <img  width="40" height="40" :src="currenSong.image" :class="cdCls">
    </div>
    <div class="text">
      <h2 class="name" v-html="currenSong.name"></h2>
      <p class="desc" v-html="currenSong.singer"></p>
    </div>
    <div class="control">
      <i :class="iconState " @click.stop="changePlaying"></i>
    </div>
    <div class="control">
      <i class="icon-playlist" @click.stop="show"></i>
    </div>
  </div>
</transition>
  <audio @timeupdate="changeTime" ref="audio" :src="currenSong.url" @canplay="canplay" @ended="end"></audio>
  <playList ref="playList"></playList>
</div>
</template>
<script>
import Progress from '../../base/progress-bar/progress-bar.vue'
import {mapGetters, mapMutations} from 'vuex'
import {playMode} from '../../common/js/config'
import {shuffle} from '../../common/js/util'
import Lyric from 'lyric-parser'
import scroll from '../../base/scroll/scroll.vue'
import playList from '../playList/playList.vue'
export default {
  name: 'play',
  data() {
    return {
      currentTime: 0,
      canPlay: false,
      currentLyric: null,
      currentShow: 'cd',
      currentLine: 0,
      playingLyric: ''
    }
  },
  computed: {
    iconModeState() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    per() {
      return this.currentTime / this.currenSong.duration
    },
    iconState() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    ...mapGetters([
      'playList',
      'playing',
      'Fullscreen',
      'currentIndex',
      'currenSong',
      'mode',
      'sequenceList'
    ]),
    playState() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    }
  },
  methods: {
    show() {
      this.$refs.playList.showflagT()
    },
    hide() {
      this.$refs.playList.showflagF()
    },
    middleTouchStart(e) {
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
      this.touch.initFlag = true
    },
    middleTouchMove(e) {
      if (!this.touch.initFlag) {
        return
      }
      const detalX = e.touches[0].pageX - this.touch.startX
      const detalY = e.touches[0].pageY - this.touch.startY
      if (Math.abs(detalX) < Math.abs(detalY)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const width = Math.min(0, Math.max(-window.innerWidth, left + detalX))
      this.touch.persent = Math.abs(width / window.innerWidth)
      this.$refs.middleL.style.opacity = (1 - this.touch.persent)
      this.$refs.middleL.style.transition = `all 0s`
      this.$refs.lyricList.$el.style.transform = `translate3d(${width}px,0,0)`
      this.$refs.lyricList.$el.style.transition = `all 0s`
    },
    middleTouchEnd() {
      let width
      if (this.currentShow === 'cd') {
        if (this.touch.persent > 0.1) {
          width = -window.innerWidth
          this.currentShow = 'lyric'
          this.$refs.middleL.style.opacity = 0
        } else {
          width = 0
        }
      } else {
        if (this.touch.persent < 0.9) {
          width = 0
          this.$refs.middleL.style.opacity = 1
          this.currentShow = 'cd'
        } else {
          width = -window.innerWidth
        }
      }
      this.$refs.lyricList.$el.style.transform = `translate3d(${width}px,0,0)`
      this.$refs.lyricList.$el.style.transition = `all 1s`
      this.touch.initFlag = false
    },
    changeMode() {
      const Mode = (this.mode + 1) % 3
      this.setMode(Mode)
      let list = null
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetIndex(list)
      this.setPlaylist(list)
      console.log(this.currentIndex)
    },
    resetIndex(list) {
      const index = list.findIndex((item) => {
        return item.id === this.currenSong.id
      })
      this.setCurrentIndex(index)
    },
    percentChange(per) {
      const currentTime = this.currenSong.duration * per
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.setPlaying(!this.playing)
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
        console.log(currentTime * 1000)
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.nextSong()
      }
    },
    canplay() {
      this.canPlay = true
    },
    addZero(num, size) {
      while (num.toString().length < size) {
        num = '0' + num
      }
      return num
    },
    normalTime(time) {
      let m = time / 60 | 0
      let s = time % 60 | 0
      return `${m}:${this.addZero(s, 2)}`
    },
    changeTime(e) {
      this.currentTime = e.target.currentTime
    },
    back() {
      this.setFullscreen(false)
    },
    Full() {
      this.setFullscreen(true)
    },
    ...mapMutations({
      setFullscreen: 'Fullscreen',
      setPlaying: 'playing',
      setCurrentIndex: 'currentIndex',
      setMode: 'mode',
      setPlaylist: 'playList'
    }),
    changePlaying() {
      if (!this.canPlay) {
        return
      }
      this.setPlaying(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    lyricPlay({lineNum, txt}) {
      this.currentLine = lineNum
      if (this.currentLine > 5) {
        this.$refs.lyricList.scrollToElement(this.$refs.lyricLine[this.currentLine - 5], 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    getLyric() {
      this.currenSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.lyricPlay)
        console.log(this.currentLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      })
    },
    nextSong() {
      if (!this.canPlay) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        if (this.currentIndex >= this.playList.length - 1) {
          this.setCurrentIndex(-1)
        }
        this.setCurrentIndex(this.currentIndex + 1)
        if (!this.playing) {
          this.setPlaying(!this.playing)
        }
        console.log(this.currentIndex)
      }
    },
    beforeSong() {
      if (!this.canPlay) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        if (this.currentIndex <= 0) {
          this.setCurrentIndex(this.playList.length)
        }
        this.setCurrentIndex(this.currentIndex - 1)
        if (!this.playing) {
          this.setPlaying(!this.playing)
        }
      }
    }
  },
  watch: {
    currenSong (newSong, oldSong) {
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },
    playing (newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  created() {
    this.touch = {}
  },
  components: {
    Progress,
    scroll,
    playList
  }
}
</script>
<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 60s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            &.play
              animation: rotate 60s linear infinite
            &.pause
              animation-play-state: paused
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform rotate(360deg)
</style>
