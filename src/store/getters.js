export const singer = state => state.singer
export const playList = state => state.playList
export const Fullscreen = state => state.Fullscreen
export const currentIndex = state => state.currentIndex
export const playing = state => state.playing
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currenSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
export const topList = state => state.topList
export const desc = state => state.desc
export const searchHistory = state => state.searchHistory
