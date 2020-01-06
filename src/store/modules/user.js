import {
  encodeToken,
  setToken,
  removeToken,
  setUser,
  getUser,
  removeUser
} from '@/utils/auth'
import { resetRouter } from '@/router'
import { user } from '@/api'
const state = {
  token: encodeToken(),
  avatar: '',
  username: '',
  sex: '',
  title: '',
  baseFolder: '',
  _id: ''
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INFO: (state, info) => {
    state = Object.assign(state, info)
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      user
        .login({
          username: username.trim(),
          password: password
        })
        .then(response => {
          console.log('登录之后', response)
          const { data } = response
          console.log('设置store')
          commit('SET_INFO', data)
          setUser(data)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      const info = getUser() || ''
      try {
        commit('SET_INFO', JSON.parse(info))
        resolve()
      } catch (e) {
        removeUser()
        reject('验证失败, 请重新登录。')
      }
    })
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      user
        .logout({ token: state.token })
        .then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken ({ commit, state }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeUser()
      removeToken()
      resolve()
    })
  },

  // addToken
  addToken ({ commit }, token) {
    return new Promise(resolve => {
      commit('SET_TOKEN', token)
      setToken(token)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
