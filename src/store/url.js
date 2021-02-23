import types from './types'

export default {
  state: {
    entryUrl: null
  },
  mutations: {
    [types.SetEntryUrl](state, { entryUrl }) {
      state.entryUrl = entryUrl;
    }
  },
  getters: {
    [types.GetEntryUrl](state) {
      return state.entryUrl;
    },
  }
}