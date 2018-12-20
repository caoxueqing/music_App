<template>
  <div class="rank" ref="topList">
    <Scroll class="toplist" :data="topList" ref="scroll">
      <ul>
        <li @click="selectItem(item)" v-for="item in topList" class="item">
          <div class="icon">
            <img :src="item.picUrl" width="100" height="100"/>
          </div>
          <ul class="songlist">
            <li v-for="(song, index) in item.songList" class="song">
              <span>{{index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </Scroll>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from '../../base/scroll/scroll.vue'
  import {getTopList} from '../../api/rank'
  import {ERR_OK} from '../../api/config'
  import {playlistMixin} from '../../common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    name: 'rank',
    mixins: [playlistMixin],
    data() {
      return {
        topList: []
      }
    },
    created() {
      this._getTopList()
    },
    methods: {
      ...mapMutations({
        setTopList: 'topList'
      }),
      selectItem(item) {
        console.log(1)
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
        console.log(111)
      },
      handlePlaylist(playlist) {
        const Bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.topList.style.bottom = Bottom
        this.$refs.scroll.refresh()
      },
      _getTopList() {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
            console.log(this.topList)
          }
        })
      }
    },
    components: {
      Scroll
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
