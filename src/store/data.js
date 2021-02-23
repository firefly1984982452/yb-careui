import types from './types'

export default {
  state: {
    isLoading: false,
    isToast: false,
    toastText: null,

    currentUser: {
      id: null,
      userId: 0,
      loginName: null
    }
  },
  mutations: {
    [types.SetLoadingStatus](state, payload) {
      state.isLoading = payload.isLoading;
    },
    [types.SetToastStatus](state, payload) {
      state.isToast = true;
      state.toastText = payload.message;
    },
    [types.SetCurrentUser](state, { user }) {
      state.currentUser = user;
    }
  },
  getters: {
    [types.GetLoadingStatus](state) {
      return state.isLoading;
    },
    [types.GetCurrentUser](state) {
      return state.currentUser;
    }
  }
};
