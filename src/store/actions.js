import * as types from './mutation-types'
import {shuffle} from '../common/js/util'
import {playMode} from '../common/js/config'
import {saveSearch, deleteSearch, clearSearch} from '../common/js/cache'
export const selectPlay = function ({commit, state}, {list, index}) {
  console.log(list)
  commit(types.sequenceList, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.playList, randomList)
    let resetIndex = randomList.findIndex((item) => {
      return item.id === list[index].id
    })
    commit(types.currentIndex, resetIndex)
  } else {
    commit(types.playList, list)
    commit(types.currentIndex, index)
  }
  commit(types.Fullscreen, true)
  commit(types.playing, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.sequenceList, list)
  commit(types.mode, playMode.random)
  let randomList = shuffle(list)
  commit(types.playList, randomList)
  commit(types.Fullscreen, true)
  commit(types.currentIndex, 0)
  commit(types.playing, true)
}

export const insertSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = playList[currentIndex]
  let fpIndex = playList.findIndex((item) => {
    return item.id === song.id
  })
  currentIndex++
  playList.splice(currentIndex, 0, song)
  if (fpIndex > -1) {
      if (currentIndex > fpIndex) {
          playList.splice(fpIndex, 1)
        currentIndex--
      } else {
            playList.splice(fpIndex + 1, 1)
      }
  }
  let currentSIndex = sequenceList.findIndex((item) => {
    return item.id === currentSong.id
  }) + 1
  let fsIndex = sequenceList.findIndex((item) => {
    return item.id === song.id
  })
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.playList, playList)
  commit(types.sequenceList, sequenceList)
  commit(types.currentIndex, currentIndex)
  commit(types.Fullscreen, true)
  commit(types.playing, true)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.setHistory, saveSearch(query))
}
export const deleteHistory = function ({commit}, query) {
  commit(types.setHistory, deleteSearch(query))
}

export const deleteAll = function ({commit}) {
  commit(types.setHistory, clearSearch())
}

export const deleteOne = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = playList.findIndex((items) => {
    return items.id === song.id
  })
  playList.splice(pIndex, 1)
  console.log(playList)
  let fIndex = sequenceList.findIndex((items) => {
    return items.id === song.id
  })
  sequenceList.splice(fIndex, 1)
  if (pIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit(types.playList, playList)
  commit(types.sequenceList, sequenceList)
  commit(types.currentIndex, currentIndex)
  console.log(playList)
  if (!playList.length) {
    commit(types.playing, false)
  } else {
    commit(types.playing, true)
  }
}

export const deleteall = function ({commit}) {
  commit(types.playList, [])
  commit(types.sequenceList, [])
  commit(types.currentIndex, -1)
  commit(types.playing, false)
}
