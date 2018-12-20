<template>
  <transition name="slide">
    <music-list :title="title" :bgimg="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
  import MusicList from '../../components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from '../../api/recommend'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'

  export default {
    computed: {
      title() {
        return this.desc.dissname
      },
      bgImage() {
        return this.desc.imgurl
      },
      ...mapGetters([
        'desc'
      ])
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _nomalizeSongs(list) {
        const ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      _getSongList() {
        console.log(this.desc.dissid)
        if (!this.desc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.desc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._nomalizeSongs(res.cdlist[0].songlist)
          }
        })
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
