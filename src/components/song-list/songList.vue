<template>
<div class="song-list">
  <ul>
    <li v-for="(item, index) in songs" class="item" @click="selectItem(item, index)" :key="index">
    <div class="rank" v-show="rank">
      <span :class="getRank(index)">{{getText(index)}}</span>
    </div>
    <div class="content">
      <h2 class="name">{{item.name}}</h2>
      <p class="desc">{{getDesc(item)}}</p>
    </div>
    </li>
  </ul>
</div>
</template>
<script>
    export default {
      props: {
        rank: {
          type: Boolean,
          default: false
        },
        songs: {
          type: Array
        }
      },
      methods: {
        getText(index) {
          if (index > 2) {
            return index + 1
          }
        },
        getRank(index) {
          if (index <= 2) {
            return `icon icon${index}`
          } else {
            return 'text'
          }
        },
        getDesc(item) {
          return `${item.singer}-${item.album}`
        },
        selectItem(item, index) {
          this.$emit('select', item, index)
        }
      }
    }
</script>
<style scoped lang="stylus">
@import "../../common/stylus/variable.styl"
  .song-list
   .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    .rank
      flex 0 0 25px
      width 25px
      margin-right 30px
      text-align center
      .icon
        display inline-block
        width 25px
        height 24px
        background-size 25px 24px
        &.icon0
           background-image url('../../common/image/first@2x.png')
        &.icon1
           background-image url('../../common/image/second@2x.png')
        &.icon2
            background-image url('../../common/image/third@2x.png')
      .text
        color: $color-theme
        font-size: $font-size-large
     .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
