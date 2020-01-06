import _ from 'lodash'
const state = {
  current: {
    title: '',
    artist: '',
    src: '',
    pic: '',
    lrc: ''
  },
  list: []
}

const mutations = {
  SET_MUSIC: (state, current) => {
    state.current = current
  },
  SET_LIST: (state, list) => {
    state.current = list[0]
    state.list = _.unionBy(list, state.list, 'src')
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
