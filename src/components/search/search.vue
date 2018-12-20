<template>
<div class="search">
  <div class="search-box-wrapper">
    <searchBox @query="onQueryChange" ref="searchBox"></searchBox>
  </div>
  <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
    <Scroll class="shortcut" :data="allData" ref="shortcut">
      <div>
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="setQuery(item.k)" class="item" v-for="item in hotKey">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear">
            <i class="icon-clear" @click="deleteAll"></i>
          </span>
          </h1>
          <searchList @seleteOne="setQuery" @delete="deleteOne" :searches="searchHistory"></searchList>
        </div>
      </div>
    </Scroll>
  </div>
  <div class="search-result" ref="searchResult" v-show="query">
    <suggest ref="suggest" @select="saveHistory" :query="query"></suggest>
  </div>
</div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  import searchBox from '../../base/search-box/search-box.vue'
  import Scroll from '../../base/scroll/scroll.vue'
  import searchList from '../../base/search-list/search-list.vue'
  import {getHotKey} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  import suggest from '../suggest/suggest.vue'
  import {playlistMixin} from '../../common/js/mixin'
  export default {
    name: 'search',
    mixins: [playlistMixin],
    components: {
      searchBox,
      suggest,
      searchList,
      Scroll
    },
    data() {
      return {
        hotKey: [],
        query: ''
      }
    },
    created() {
      this._getHotKey()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      deleteAll () {
        this.deleteall()
      },
      deleteOne(item) {
        this.delectHistory(item)
      },
      ...mapActions({
        setHistory: 'saveSearchHistory',
        delectHistory: 'deleteHistory',
        deleteall: 'deleteAll'
      }),
      saveHistory() {
        this.setHistory(this.query)
      },
      onQueryChange(query) {
        this.query = query
      },
      setQuery(query) {
        this.$refs.searchBox.setQuery(query)
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      }
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    computed: {
      allData() {
        return this.hotKey.concat(this.searchHistory)
      },
      ...mapGetters(['searchHistory'])
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
