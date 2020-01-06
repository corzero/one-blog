import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import music from './modules/music'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    music
  },
  getters
})

export default store
