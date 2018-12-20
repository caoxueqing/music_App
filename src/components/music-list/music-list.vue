<template>
<div class="music-list">
  <div class="back" @click="back">
    <i class="icon-back"></i>
  </div>
  <h1 class="title" v-html="title"></h1>
  <div class="bg-image" :style="BGIMG" ref="bgImg">
    <div class="play-wrapper">
      <div ref="playBtn" v-show="songs.length>0" class="play" @click="randomplay">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
    </div>
    <div class="filter"></div>
  </div>
<scroll :data="songs" class="list" ref="list">
  <div class="song-list-wrapper">
    <songList :rank="rank" @select="selectItem" :songs="songs"></songList>
  </div>
</scroll>
</div>
</template>
<script>
  import songList from '../song-list/songList.vue'
  import scroll from '../../base/scroll/scroll.vue'
  import {mapActions} from 'vuex'
  import {playlistMixin} from '../../common/js/mixin'
  export default {
    mixins: [playlistMixin],
    name: 'musicList',
    props: {
      rank: {
        type: Boolean,
        default: false
      },
      title: {
        type: String
      },
      songs: {
        type: Array
      },
      bgimg: {
        type: String
      }
    },
    components: {
      songList,
      scroll
    },
    methods: {
      handlePlaylist(playlist) {
        const Bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = Bottom
        this.$refs.list.refresh()
      },
      randomplay() {
        this.randomPlay({
          list: this.songs
        })
      },
      back() {
        this.$router.back()
      },
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    mounted () {
      this.$refs.list.$el.style.top = `${this.$refs.bgImg.clientHeight}px`
      console.log(this.songs)
    },
    computed: {
      BGIMG() {
        return `background-image:url(${this.bgimg})`
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .music-list
    position: fixed
    z-index: 1000
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      overflow hidden
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
