import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    mobile: '',
    tenantName: '',
    email: '',
    userType: '',
    lastLoginTime: '',
    lastLoginIp: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MOBILE: (state, mobile) => {
    state.mobile = mobile
  },
  SET_TENANT_NAME: (state, tenantName) => {
    state.tenantName = tenantName
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_USER_TYPE: (state, userType) => {
    state.userType = userType
  },
  SET_LAST_LOGIN_TIME: (state, lastLoginTime) => {
    state.lastLoginTime = lastLoginTime
  },
  SET_LAST_LOGIN_IP: (state, lastLoginIp) => {
    state.lastLoginIp = lastLoginIp
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login(username.trim(), password).then(response => {
        const { token } = response
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const data = response

        if (!data) {
          reject('获取用户信息失败')
        }

        const { roles, avatar, userName, tenantName, mobile, userType, email, lastLoginTime, lastLoginIp } = data

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        commit('SET_ROLES', roles)
        commit('SET_NAME', userName)
        commit('SET_AVATAR', avatar)
        commit('SET_MOBILE', mobile)
        commit('SET_TENANT_NAME', tenantName)
        commit('SET_EMAIL', email)
        commit('SET_USER_TYPE', userType)
        commit('SET_LAST_LOGIN_TIME', lastLoginTime)
        commit('SET_LAST_LOGIN_IP', lastLoginIp)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
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

