import * as types from './mutation-types'
const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.playList] (state, playList) {
    state.playList = playList
  },
  [types.Fullscreen] (state, Fullscreen) {
    state.Fullscreen = Fullscreen
  },
  [types.currentIndex] (state, currentIndex) {
    state.currentIndex = currentIndex
  },
  [types.playing] (state, playing) {
    state.playing = playing
  },
  [types.sequenceList] (state, sequenceList) {
    state.sequenceList = sequenceList
  },
  [types.mode] (state, mode) {
    state.mode = mode
  },
  [types.topList] (state, topList) {
    state.topList = topList
  },
  [types.setDesc] (state, desc) {
    state.desc = desc
  },
  [types.setHistory] (state, history) {
    state.searchHistory = history
  }
}
export default mutations
