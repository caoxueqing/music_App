<template>
<div class="singer" ref="singer">
  <listView @select="selectSinger" :data="singers" ref="list"></listView>
  <router-view></router-view>
</div>
</template>
<script>
  import listView from '../../base/listview/listview.vue'
  import Singer from '../../common/js/singer'
  import {getSingerList} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from '../../common/js/mixin'
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      handlePlaylist(playlist) {
        const Bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = Bottom
        this.$refs.list.refresh()
      },
      selectSinger(item) {
        this.$router.push({
          path: `/singer/${item.id}`
        })
        console.log(item)
        this.setSinger(item)
        console.log(item)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (ERR_OK === res.code) {
            this.singers = res.data.list
            this.singers = this.normallizeSinger(this.singers)
            console.log(this.singers)
          }
        })
      },
      normallizeSinger(list) {
        let map = {
          hot: {
            title: '热门',
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < 10) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[A-Za-z]/)) {
            ret.push(val)
          } else if (val.title === '热门') {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      listView
    }
  }
</script>
<style scoped lang="stylus">
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
