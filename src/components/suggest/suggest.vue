<template>
<scroll ref="suggest" @scrollToEnd="searchMore" class="suggest" :data="result" :pullup="pullup">
  <ul class="suggest-list">
    <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
      <div class="icon">
        <i :class="getIconCls(item)"></i>
      </div>
      <div class="name">
        <p class="text" v-html="getDisplayName(item)"></p>
      </div>
    </li>
  </ul>
  <router-view></router-view>
  <div v-show="!hasMore && !result.length" class="no-result-wrapper">
    <noResult title="抱歉，暂无搜索结果"></noResult>
  </div>
</scroll>
</template>
<script>
  const perpage = 30
import Singer from '../../common/js/singer'
import noResult from '../../base/no-result/no-result.vue'
import {mapMutations, mapActions} from 'vuex'
import {search} from '../../api/search'
import {createSong} from '../../common/js/song'
import {ERR_OK} from '../../api/config'
import scroll from '../../base/scroll/scroll.vue'
    export default {
      name: 'suggest',
      components: {
        scroll,
        noResult
      },
      props: {
        showSinger: {
          type: Boolean,
          default: true
        },
        query: {
          type: String,
          default: ''
        }
      },
      data() {
        return {
          page: 1,
          result: [],
          pullup: true,
          hasMore: true
        }
      },
      methods: {
        refresh() {
          this.$refs.suggest.refresh()
        },
        searchMore() {
            if (!this.hasMore) {
              return
            }
            this.page++
            search(this.query, this.page, this.showSinger, perpage).then((res) => {
              if (res.code === ERR_OK) {
                this.result = this.result.concat(this._genResult(res.data))
                this.checkMore(res.data)
//                console.log(this.result)
                console.log(res.data)
              }
            })
        },
        ...mapActions({
          insertSong: 'insertSong'
        }),
        ...mapMutations({
          setItem: 'SET_SINGER'
        }),
        selectItem(item) {
//          console.log(item)
          if (item.type === 'singer') {
            const singer = new Singer({
              id: item.singermid,
              name: item.singername
            })
              this.$router.push({
                path: `/search/${singer.id}`
              })
            this.setItem(singer)
          } else {
//            console.log(item)
              this.insertSong(item)
          }
          this.$emit('select')
        },
        getDisplayName(item) {
          if (item.type === 'singer') {
            return item.singername
          } else {
            return `${item.name}-${item.singer}`
          }
        },
        getIconCls(item) {
          if (item.type === 'singer') {
            return 'icon-mine'
          } else {
            return 'icon-music'
          }
        },
        _genResult(data) {
          let ret = []
          if (data.zhida && data.zhida.singerid) {
            ret.push({
              ...data.zhida,
              ...{type: 'singer'}
            })
          }
          if (data.song) {
            ret = ret.concat(this._normalizeSong(data.song.list))
          }
          return ret
        },
        _normalizeSong(list) {
          let ret = []
          list.forEach((musicData) => {
            if (musicData.songid && musicData.albumid) {
              ret.push(createSong(musicData))
            }
          })
          return ret
        },
        search() {
          this.page = 1
          this.$refs.suggest.scrollTo(0, 0)
          this.hasMore = true
          search(this.query, this.page, this.showSinger, perpage).then((res) => {
            if (res.code === ERR_OK) {
              this.result = this._genResult(res.data)
              this.checkMore(res.data)
              console.log(this.result)
              console.log(res.data)
            }
          })
        },
        checkMore(data) {
          const song = data.song
          if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
            this.hasMore = false
          }
        }
      },
      watch: {
        query(newQuery) {
          this.search(newQuery)
        }
      }
    }
</script>
<style scoped lang="stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
  .suggest
    height 100%
    overflow hidden
    .suggest-list
      padding 0 30px
      .suggest-item
        display flex
        align-items center
        padding-bottom 20px
      .icon
        flex 0 0 30px
        width 30px
        [class^="icon"]
          font-size 14px
          color: $color-text-d
      .name
        flex 1
        font-size $font-size-medium
        color $color-text-d
        overflow hidden
        .text
            no-wrap()
    .no-result-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
