import {playMode} from '../common/js/config'
import {loadSearch} from '../common/js/cache'
const state = {
  singer: {},
  playList: [],
  Fullscreen: false,
  currentIndex: -1,
  playing: false,
  sequenceList: [],
  mode: playMode.sequence,
  topList: {},
  desc: {},
  searchHistory: loadSearch()
}
export default state
