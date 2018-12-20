<template>
<transition name="slider">
  <musicList :songs="songs" :title="title" :bgimg="bgImage"></musicList>
</transition>
</template>
<script>
  import {mapGetters} from 'vuex'
  import musicList from '../music-list/music-list.vue'
  import {getSingerDetail} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'
  export default {
    name: 'singerDetail',
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters(['singer']),
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      }
    },
    methods: {
      get_detail() {
        console.log(this.singer)
        if (!this.singer.id) {
          this.$router.push('/singer')
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this.normalizeSong(res.data.list)
            console.log(this.songs)
          }
        })
      },
      normalizeSong(list) {
        let res = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.albummid && musicData.songmid) {
            res.push(createSong(musicData))
          }
        })
        return res
      }
    },
    created() {
      this.get_detail(this.singer)
    },
    components: {
      musicList
    }
  }
</script>
<style scoped lang="stylus">
@import "../../common/stylus/variable.styl"
  .slider-enter-active,.slider-leave-active
      transition all 0.5s
  .slider-enter,.slider-leave-to
      transform translate3d(100%, 100%, 0)

</style>
